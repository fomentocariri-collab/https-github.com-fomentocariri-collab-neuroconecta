import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  ShareGrantsService,
  DiaryEntriesService,
  SensoryRecordsService,
  FunctionalPlanService,
  PeiService,
  SchoolFamilyCommService,
} from "./server/lote1Service";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper de extração de ator da requisição
function getActorFromReq(req: express.Request) {
  const actorId = (req.headers["x-actor-id"] as string) || (req.query.actorId as string) || req.body?.actorId || "anon-user";
  const actorRole = (req.headers["x-actor-role"] as string) || (req.query.actorRole as string) || req.body?.actorRole || "pcd";
  const actorName = (req.headers["x-actor-name"] as string) || (req.query.actorName as string) || req.body?.actorName || "Usuário";
  const profRole = (req.headers["x-actor-professional-role"] as string) || (req.query.actorProfRole as string) || req.body?.actorProfRole;

  return { id: actorId, role: actorRole, name: actorName, professionalRoleType: profRole };
}

// ==========================================
// ENDPOINTS DO LOTE 1: ARQUITETURA DE APOIO
// ==========================================

// 1. Matriz de Compartilhamento Granular (Share Grants)
app.get("/api/share-grants", (req, res) => {
  const subjectId = (req.query.subjectId as string) || getActorFromReq(req).id;
  const grants = ShareGrantsService.list(subjectId);
  res.json({ grants });
});

app.post("/api/share-grants", (req, res) => {
  const actor = getActorFromReq(req);
  const { grantedToName, relationship, context, resourceType, permission, description, subjectId } = req.body;

  if (!grantedToName || !context || !resourceType) {
    return res.status(400).json({ error: "Campos obrigatórios: grantedToName, context, resourceType." });
  }

  const newGrant = ShareGrantsService.create({
    subjectId: subjectId || actor.id,
    subjectName: req.body.subjectName,
    grantedBy: actor.id,
    grantedToName,
    grantedToId: req.body.grantedToId,
    relationship: relationship || "outro",
    context,
    resourceType,
    permission: permission || "VIEW",
    description,
  });

  res.status(201).json({ grant: newGrant });
});

app.patch("/api/share-grants/:id/revoke", (req, res) => {
  const actor = getActorFromReq(req);
  const grantId = req.params.id;
  const revoked = ShareGrantsService.revoke(grantId, actor.id);

  if (!revoked) {
    return res.status(404).json({ error: "Concessão não encontrada." });
  }

  res.json({ grant: revoked, message: "Concessão revogada com sucesso." });
});

// 2. Diário & Humor com Isolamento e Controle de Privacidade Estrito
app.get("/api/diary/entries", (req, res) => {
  const actor = getActorFromReq(req);
  const subjectId = (req.query.subjectId as string) || actor.id;

  const { entries, deniedPersonalEntriesCount } = DiaryEntriesService.list(subjectId, actor);
  res.json({ entries, deniedPersonalEntriesCount });
});

app.post("/api/diary/entries", (req, res) => {
  const actor = getActorFromReq(req);
  const entry = req.body;

  if (!entry || !entry.mood) {
    return res.status(400).json({ error: "Dados de humor são obrigatórios." });
  }

  // Previne personificação indevida
  let entryType = entry.entryType;
  if (!entryType) {
    if (actor.role === "escola" || actor.professionalRoleType === "educador") {
      entryType = "school_note";
    } else if (actor.role === "cuidador_educador") {
      entryType = "caregiver_observation";
    } else {
      entryType = "personal";
    }
  }

  // Escola não pode postar no diário íntimo pessoal da pessoa
  if ((actor.role === "escola" || actor.professionalRoleType === "educador") && entryType === "personal") {
    return res.status(403).json({ error: "Acesso negado: escola só pode emitir notas pedagógicas ou de contexto escolar." });
  }

  const created = DiaryEntriesService.create(
    {
      ...entry,
      entryType,
      authorName: actor.name || entry.authorName || "Anônimo",
      authorRole: actor.role,
    },
    actor
  );

  res.status(201).json({ entry: created });
});

app.delete("/api/diary/entries/:id", (req, res) => {
  const actor = getActorFromReq(req);
  const success = DiaryEntriesService.delete(req.params.id, actor);

  if (!success) {
    return res.status(403).json({ error: "Não autorizado a excluir este registro." });
  }

  res.json({ success: true, message: "Registro removido com sucesso." });
});

// 3. Regulação Sensorial (Autopercepção e Check-ins)
app.get("/api/sensory/records", (req, res) => {
  const actor = getActorFromReq(req);
  const subjectId = (req.query.subjectId as string) || actor.id;
  const records = SensoryRecordsService.list(subjectId);
  res.json({ records });
});

app.post("/api/sensory/records", (req, res) => {
  const actor = getActorFromReq(req);
  const record = req.body;

  if (typeof record.energyLevel !== "number" || typeof record.sensoryOverloadLevel !== "number") {
    return res.status(400).json({ error: "energyLevel e sensoryOverloadLevel são obrigatórios." });
  }

  const created = SensoryRecordsService.create(
    {
      ...record,
      subjectId: record.subjectId || actor.id,
      authorName: actor.name,
    },
    actor
  );

  res.status(201).json({ record: created });
});

// 4. Plano Individual de Apoio Funcional
app.get("/api/functional-plan/:subjectId", (req, res) => {
  const plan = FunctionalPlanService.get(req.params.subjectId);
  res.json({ plan });
});

app.put("/api/functional-plan/:subjectId", (req, res) => {
  const actor = getActorFromReq(req);
  const plan = req.body;

  if (!plan || plan.subjectId !== req.params.subjectId) {
    return res.status(400).json({ error: "Identificador subjectId inconsistente no corpo da requisição." });
  }

  const updated = FunctionalPlanService.update(plan, actor);
  res.json({ plan: updated });
});

// 5. Minutas de PEI com Versionamento
app.get("/api/pei/versions/:subjectId", (req, res) => {
  const versions = PeiService.list(req.params.subjectId);
  res.json({ versions });
});

app.post("/api/pei/versions", (req, res) => {
  const actor = getActorFromReq(req);
  const draft = req.body;

  if (!draft.subjectId || !draft.schoolName) {
    return res.status(400).json({ error: "subjectId e schoolName são obrigatórios." });
  }

  const created = PeiService.createVersion(draft, actor);
  res.status(201).json({ version: created });
});

// 6. Comunicação Bidirecional Escola-Família
app.get("/api/school-family-comm/:subjectId", (req, res) => {
  const msgs = SchoolFamilyCommService.list(req.params.subjectId);
  res.json({ messages: msgs });
});

app.post("/api/school-family-comm", (req, res) => {
  const actor = getActorFromReq(req);
  const msg = req.body;

  if (!msg.subjectId || !msg.content || !msg.type) {
    return res.status(400).json({ error: "subjectId, content e type são obrigatórios." });
  }

  const created = SchoolFamilyCommService.create(
    {
      ...msg,
      authorName: actor.name,
      authorContext: msg.authorContext || (actor.role === "escola" || actor.professionalRoleType === "educador" ? "escola" : "familia"),
    },
    actor
  );

  res.status(201).json({ message: created });
});

app.patch("/api/school-family-comm/:id/read", (req, res) => {
  const success = SchoolFamilyCommService.markRead(req.params.id);
  res.json({ success });
});

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "dummy-key") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function normalizeSupportContext(rawRole?: string): string {
  if (!rawRole) return "meu_apoio";
  const r = rawRole.toLowerCase();
  if (r === "usuario" || r === "meu_apoio") return "meu_apoio";
  if (r === "educador" || r === "educacao") return "educacao";
  if (r === "familia_cuidado" || r === "familia") return "familia_cuidado";
  if (r === "comunicacao_acessibilidade" || r === "comunicacao") return "comunicacao_acessibilidade";
  if (r === "organizacao_rotina" || r === "rotina") return "organizacao_rotina";
  if (r === "medico" || r === "enfermeiro" || r === "psiquiatra" || r === "saude") return "saude";
  if (r === "rh" || r === "perito" || r === "trabalho") return "trabalho";
  return "meu_apoio";
}

const SYSTEM_INSTRUCTION = `Você é o copiloto virtual de organização, comunicação e acessibilidade do NeuroConecta.

Sua identidade é:
PESSOA → AUTONOMIA → COMUNICAÇÃO → ACESSIBILIDADE → REDE DE APOIO.
Você NUNCA se apresenta nem assume a persona de um profissional habilitado (médico, psiquiatra, neurologista, enfermeiro, psicólogo clínico, advogado, perito ou gestor de RH).
Você atua como um copiloto prático, acolhedor e neuroafirmativo.

LIMITES DE SEGURANÇA INEGOCIÁVEIS:
- Não realizar diagnóstico clínico nem sugerir confirmação de TEA, TDAH ou transtornos mentais.
- Não afirmar que um comportamento relatado é "prova" de determinada condição.
- Não prescrever medicamentos, dosagens, fórmulas ou suplementos, nem sugerir início ou suspensão medicamentosa.
- Não substituir avaliação profissional presencial.

Você ajusta o direcionamento prático conforme o CONTEXTO DO APOIO selecionado:

1. MEU APOIO (meu_apoio):
   - Foco na própria pessoa e em sua autonomia no dia a dia.
   - Ajudar a: organizar o dia, dividir tarefas complexas em etapas executáveis, criar checklists práticos, preparar conversas, organizar pensamentos antes de reuniões, preparar a ida a novos locais (escola, trabalho, consulta), redigir mensagens de pedido de ajuda ou acomodação, encontrar estratégias que respeitem a energia diária e simplificar textos longos.
   - Não diagnosticar nem julgar.

2. EDUCAÇÃO (educacao):
   - Foco pedagógico inclusivo com base no Desenho Universal para a Aprendizagem (DUA), LBI e Lei Berenice Piana.
   - Primeira pergunta orientadora preferencial: "O que você precisa ensinar ou tornar mais acessível?" (e não "Qual diagnóstico o aluno tem?").
   - Ajudar a: adaptar atividades para reduzir sobrecarga, criar múltiplas formas de participação (oral, escrita, visual), simplificar enunciados mantendo objetivos pedagógicos, organizar instruções por etapas, sugerir apoios visuais para sala de aula, planejar transições entre atividades, redigir minutas de PEI/PDI, registrar observações pedagógicas descritivas e neutras e facilitar o diálogo respeitoso Escola-Família.

3. FAMÍLIA & CUIDADO (familia_cuidado):
   - Foco na rotina familiar e suporte compartilhado.
   - O familiar/cuidador é parceiro de apoio, previsibilidade e acolhimento (nunca corretor punitivo de comportamentos atípicos).
   - Ajudar a: organizar a rotina da casa e da semana, prever momentos de descanso e descompressão sensorial, preparar mudanças de rotina com antecedência, redigir mensagens para a escola ou terapeutas, registrar observações do cotidiano sem julgamentos e reduzir barreiras ambientais em casa (ruído, luz excessiva, imprevisibilidade).

4. COMUNICAÇÃO & ACESSIBILIDADE (comunicacao_acessibilidade):
   - Foco na expressão, escrita e interação social autêntica.
   - Ajudar a: criar scripts sociais personalizados, redigir mensagens curtas e objetivas, solicitar acomodações de forma educada e assertiva, pedir instruções por escrito, preparar conversas difíceis, traduzir expressões com duplo sentido para sentido literal e direto, e apoiar o uso de Comunicação Aumentativa e Alternativa (CAA).

5. ORGANIZAÇÃO & ROTINA (organizacao_rotina):
   - Foco na função executiva diária e ritmo de vida sustentável.
   - Ajudar a: estruturar agendas diárias ou semanais, priorizar demandas, montar sequências visuais de tarefas, planejar pausas e hidratação, dividir tarefas grandes em passos concretos e preparar rotinas adaptadas para dias de baixa energia.

6. SAÚDE — ORGANIZAÇÃO E PREPARAÇÃO (saude):
   - AVISO VISÍVEL OBRIGATÓRIO: A IA oferece apoio para organizar informações e preparar perguntas ou registros. Não substitui profissionais habilitados nem realiza diagnóstico, prescrição ou decisão clínica.
   - Permitido: organizar listas de sintomas e observações relatadas pelo próprio usuário em ordem cronológica para levar à consulta, estruturar perguntas claras para médicos ou terapeutas, resumir rotinas para facilitar o diálogo com a equipe de saúde e ajudar a registrar efeitos percebidos para posterior relato ao profissional.
   - Proibido: emitir laudos/atestados, sugerir diagnósticos conclusivos ou opinar sobre dosagens de medicamentos.

7. TRABALHO — ACESSIBILIDADE & ORGANIZAÇÃO (trabalho):
   - AVISO VISÍVEL OBRIGATÓRIO: A IA oferece apoio para organizar informações e pedidos funcionais. Não emite parecer jurídico, médico ou trabalhista.
   - Permitido: redigir mensagens para solicitar instruções de trabalho por escrito, solicitar autorização para fones com cancelamento de ruído ou ambiente com menos estímulos, estruturar rotina de tarefas e prazos, preparar conversas com gestores ou RH sobre necessidades funcionais e organizar entregas com clareza de prioridades.

Estilo de resposta: Claro, empático, direto, em Português do Brasil, sem jargões artificiais nem promessas de cura.`;

function getFallbackAssistantReply(userMessage: string, userContext?: any, rawRole: string = "meu_apoio"): string {
  const text = userMessage.toLowerCase();
  const name = userContext?.preferredName && userContext.preferredName !== "Visitante" ? `, ${userContext.preferredName}` : "";
  const role = normalizeSupportContext(rawRole);

  if (role === "saude") {
    return `[Apoio para Organização & Preparação em Saúde]
Olá${name}. 

⚠️ **Aviso Importante:** Esta ferramenta oferece apoio exclusivamente para organizar suas anotações, histórico e dúvidas para consultas. Não realiza diagnóstico, não prescreve medicamentos e não substitui avaliação médica ou profissional.

Como posso te apoiar a se preparar?
1. **Organizar lista de sintomas:** Registrar o que você vem sentindo, quando começou e em quais momentos costuma piorar ou melhorar.
2. **Preparar perguntas para a consulta:** Estruturar as 3 a 5 dúvidas principais para você não esquecer de perguntar durante o atendimento.
3. **Organizar histórico de exames/laudos:** Montar um resumo cronológico simples para apresentar ao seu médico ou terapeuta.

O que você gostaria de organizar primeiro?`;
  }

  if (role === "trabalho") {
    return `[Apoio para Acessibilidade & Organização no Trabalho]
Olá${name}. 

ℹ️ **Aviso:** Este recurso auxilia na redação de comunicações práticas e organização funcional. Não emite parecer jurídico, médico ou trabalhista.

Posso te apoiar a:
1. **Pedir acomodações funcionais:** Modelos educados e objetivos para solicitar fones abafadores, assento mais silencioso ou instruções de tarefas por escrito.
2. **Priorizar demandas:** Alinhar com sua liderança o que deve ser entregue primeiro quando há muitas tarefas abertas.
3. **Preparar conversas:** Estruturar tópicos pontuais para alinhar expectativas com gestores ou equipe.

Qual demanda de trabalho você gostaria de estruturar agora?`;
  }

  if (role === "educacao") {
    return `[Apoio Pedagógico & Inclusão Escolar]
Olá${name}! No contexto pedagógico, nosso foco é tornar o aprendizado acessível e reduzir sobrecargas cognitivas e sensoriais.

**O que você precisa ensinar ou tornar mais acessível hoje?**

Posso te apoiar com:
- **Adaptação de atividades:** Dividir enunciados longos em etapas curtas e objetivas mantendo o objetivo pedagógico.
- **Apoios visuais e transições:** Criar quadros visuais para antecipar mudanças de aula ou matéria.
- **Minuta de PEI / PDI:** Estruturar propostas de acomodações curriculares e ambientais baseadas em Desenho Universal para a Aprendizagem (DUA).
- **Comunicação Escola-Família:** Redigir registros neutros e colaborativos sobre o progresso do estudante.`;
  }

  if (role === "familia_cuidado") {
    return `[Apoio à Família & Rede de Cuidados]
Olá${name}! O papel da rede de apoio é promover acolhimento, previsibilidade e redução de barreiras no cotidiano.

Como posso apoiar a rotina da sua família hoje?
- **Planejamento da semana:** Montar uma rotina doméstica equilibrada com tempo previsto para descompressão.
- **Antecipação de mudanças:** Preparar a pessoa com antecedência para viagens, consultas ou novos compromissos.
- **Comunicação com escola ou terapeutas:** Escrever mensagens claras relatando como foram os últimos dias.
- **Ajustes no ambiente:** Dicas simples para reduzir sobrecarga de iluminação, ruídos e desorganização visual em casa.`;
  }

  if (role === "comunicacao_acessibilidade") {
    return `[Comunicação & Acessibilidade]
Olá${name}! A comunicação clara e autêntica reduz a ansiedade e evita mal-entendidos.

Posso te apoiar a:
- **Criar scripts sociais:** Textos prontos para conversas delicadas, convites ou recusas educadas.
- **Solicitar instruções por escrito:** Frases diretas para garantir que detalhes e prazos não se percam.
- **Linguagem literal e direta:** Esclarecer expressões figuradas ou redigir mensagens sem ambiguidade.
- **Apoio a CAA:** Estruturar frases curtas e objetivas para painéis ou cartões de comunicação.

Qual mensagem ou conversa você gostaria de preparar?`;
  }

  if (role === "organizacao_rotina") {
    return `[Organização & Rotina Funcional]
Olá${name}! Ter uma rotina visual e previsível alivia a sobrecarga executiva.

Posso te apoiar a:
- **Estruturar seu dia:** Montar uma lista visual de tarefas dividida em Manhã, Tarde e Noite.
- **Dividir uma tarefa grande:** Transformar um projeto assustador em 3 a 5 passos pequenos e fáceis de começar.
- **Rotina de baixa energia:** Ajustar as atividades para dias em que você precisa descansar mais.
- **Lembretes essenciais:** Incluir pausas sensoriais, hidratação e refeições regulares.

Qual atividade ou período do dia você gostaria de organizar?`;
  }

  // Meu Apoio (padrão)
  if (
    text.includes("crise") ||
    text.includes("meltdown") ||
    text.includes("shutdown") ||
    text.includes("panico") ||
    text.includes("pânico") ||
    text.includes("desespero") ||
    text.includes("socorro") ||
    text.includes("sobrecarga")
  ) {
    return `Olá${name}. Estou aqui com você. Se estiver passando por um momento de sobrecarga sensorial ou emocional intensa:

💙 **Estratégia Imediata de Descompressão:**
1. **Reduza Estímulos:** Vá para um espaço mais calmo, diminua as luzes ou coloque fones de ouvido.
2. **Apoio no corpo (Técnica 5-4-3-2-1):**
   - 👁️ Olhe para 5 objetos ao seu redor.
   - 🖐️ Toque em 4 coisas com texturas conhecidas.
   - 👂 Foque em 3 sons suaves no ambiente.
   - 👃 Respire calmamente soltando o ar devagar.
3. Não se cobre resolver tarefas complexas agora. Permita-se desacelerar.

⚠️ *Se você estiver em risco ou precisar de acolhimento emocional humano imediato, use o botão **SOS Crise** no topo do app ou ligue para o CVV (188) ou SAMU (192).*`;
  }

  return `Olá${name}! Sou o copiloto de apoio do **NeuroConecta**.

Como posso apoiar você hoje? Posso ajudar a:
1. 🗓️ **Organizar o seu dia:** Dividir tarefas grandes em passos simples e executáveis.
2. ✍️ **Preparar mensagens:** Redigir pedidos claros de apoio, acomodação ou instruções por escrito.
3. 🧘 **Autorregulação:** Encontrar estratégias de pausa sensorial e descompressão.
4. 🧭 **Navegar pelo app:** Indicar onde encontrar sons relaxantes, planos de apoio ou scripts de comunicação.

Você também pode selecionar o **Contexto do Apoio** no topo do chat (Meu Apoio, Educação, Família, Comunicação, Rotina, Saúde ou Trabalho).`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userContext, interactionRole } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Campo 'messages' é obrigatório e deve ser um array." });
    }

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const activeRole = normalizeSupportContext(interactionRole);
    const ai = getGenAI();

    if (ai) {
      let contextPrompt = `[CONTEXTO DO APOIO SELECIONADO: ${activeRole.toUpperCase()}]\n`;
      if (userContext) {
        contextPrompt += `[Perfil do Usuário: Nome="${userContext.preferredName || "Não informado"}", Status="${userContext.diagnosisStatus || "Não informado"}"]\n\n`;
      }

      const formattedHistory = messages
        .map((m: { role: string; content: string }) => {
          const roleName = m.role === "user" ? "Usuário" : "NeuroConecta";
          return `${roleName}: ${m.content}`;
        })
        .join("\n\n");

      const fullPrompt = `${contextPrompt}${formattedHistory}\n\nNeuroConecta:`;

      // Try gemini models
      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            return res.json({ reply: response.text });
          }
        } catch (genErr: any) {
          console.warn(`Tentativa com modelo ${modelName} falhou:`, genErr?.message || genErr);
        }
      }
    }

    // Fallback if AI key is missing or model calls fail
    const fallbackReply = getFallbackAssistantReply(lastUserMsg, userContext, activeRole);
    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    const fallbackReply = getFallbackAssistantReply("", req.body?.userContext, req.body?.interactionRole || "usuario");
    return res.json({ reply: fallbackReply });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NeuroConecta Server rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
