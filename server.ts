import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

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

const SYSTEM_INSTRUCTION = `Você é o assistente virtual do aplicativo "NeuroConecta", desenvolvido para apoiar pessoas autistas (TEA) e suas famílias, melhorando a qualidade de vida por meio de ferramentas práticas, testes de autoavaliação, suporte sensorial, comunicação e acolhimento.

## PERSONALIDADE E TOM
- Seja claro, direto, empático e extremamente respeitoso. Evite metáforas excessivas, ironias ou linguagem ambígua.
- Use linguagem inclusiva e neuroafirmativa (ex: "suas características sensoriais", "seu perfil neurodivergente", "suas preferências de comunicação").
- Valide as experiências e sentimentos do usuário sem medicalizar nem julgar.
- Ofereça opções estruturadas e passo a passo sempre que conveniente (ex: "Escolha uma opção: 1, 2 ou 3").
- Responda no idioma do usuário (predominantemente Português do Brasil).

## ÁREAS DE SUPORTE
1. Rotina e Organização: Dicas para rotinas visuais, blocos de tempo, pausas sensoriais e combate ao esgotamento.
2. Regulação Sensorial: Grounding (técnica 5-4-3-2-1), estratégias para hiper/hiposensibilidades a som, luz, tato, texturas.
3. Comunicação e Relacionamentos: Scripts sociais práticos para trabalho, família, consultas médicas; como pedir acomodações.
4. Testes e Autoavaliação: Esclarecer dúvidas sobre testes do app (AQ-10, SQ-EQ, Perfil Sensorial, Burnout Autista, Máscara Social CAT-Q). Lembre sempre que são triagens adaptadas, não diagnósticos médicos.
5. Emergência e Crise: Passo a passo calmo para Meltdown e Shutdown, redução de estímulos.
6. Educação e Empoderamento: Explicar conceitos como Stimming, Interesses Especiais, Máscara (Camouflaging), Função Executiva e Dupla Empatia.

## REGRAS INVIOLÁVEIS DE SEGURANÇA
- NUNCA forneça diagnóstico formal.
- Sempre recomende a busca por profissionais qualificados (psicólogos, neuropediatras, psiquiatras) para avaliação médica.
- Em crises graves de saúde mental ou risco, forneça contatos de emergência no Brasil: CVV 188 (apoio emocional), SAMU 192 (emergência) ou serviços locais de saúde.
- Respeite o nome e pronomes que o usuário indicar.`;

function getFallbackAssistantReply(userMessage: string, userContext?: any): string {
  const text = userMessage.toLowerCase();
  const name = userContext?.preferredName ? `, ${userContext.preferredName}` : "";

  if (
    text.includes("crise") ||
    text.includes("meltdown") ||
    text.includes("shutdown") ||
    text.includes("panico") ||
    text.includes("pânico") ||
    text.includes("desespero") ||
    text.includes("socorro") ||
    text.includes("sobrecarga") ||
    text.includes("ansiedad")
  ) {
    return `Olá${name}. Percebo que você pode estar passando por um momento de sobrecarga ou crise. 

Sua segurança e bem-estar são a nossa prioridade absoluta.

💙 **Passos de Regulação Imediata:**
1. **Reduza Estímulos:** Se possível, vá para um ambiente escuro e silencioso ou use fones com cancelamento de ruído.
2. **Exercício 5-4-3-2-1 (Grounding):**
   - 👁️ Observe 5 coisas ao seu redor.
   - 🖐️ Sinta 4 texturas acessíveis.
   - 👂 Identifique 3 sons distantes.
   - 👃 Note 2 cheiros presentes.
   - 👅 Respire fundo focando no ar entrando e saindo.

⚠️ *Se sentir que precisa de suporte imediato em crise ou apoio emocional gratuito, utilize o botão **SOS Crise** no topo da página ou entre em contato com o CVV (188) ou SAMU (192).*`;
  }

  if (
    text.includes("rotina") ||
    text.includes("tarefa") ||
    text.includes("organiza") ||
    text.includes("tempo") ||
    text.includes("foco") ||
    text.includes("executiv")
  ) {
    return `Olá${name}! Para organizar a rotina de forma neuroafirmativa e evitar a fadiga executiva, aqui estão algumas estratégias práticas:

1. **Micro-passos (Chunking):** Quebre tarefas grandes em etapas minúsculas. Em vez de "arrumar o quarto", comece recolhendo 2 objetos.
2. **Pausas Sensoriais Programadas:** Não espere o esgotamento para descansar. Programe 5 a 10 minutos de descompressão a cada tarefa.
3. **Organizador do App:** Acesse a aba **Rotina Visual & Tarefas** no menu para estruturar suas atividades por urgência e demanda de energia.

Como posso te ajudar a planejar sua próxima atividade?`;
  }

  if (
    text.includes("comunica") ||
    text.includes("script") ||
    text.includes("falar") ||
    text.includes("trabalho") ||
    text.includes("explicar") ||
    text.includes("social")
  ) {
    return `Olá${name}! A comunicação neuroafirmativa ajuda a expressar necessidades e limites com clareza e sem sentimento de culpa.

📌 **Exemplo de Script para Solicitar Acomodação:**
*"Olá! Para que eu possa desempenhar meu trabalho com melhor foco e conforto, prefiro receber instruções detalhadas por escrito e ter breves pausas silenciosas. Agradeço pela compreensão!"*

Você pode navegar até a aba **Comunicação** para explorar mais cartões ilustrados e scripts sociais prontos!`;
  }

  if (
    text.includes("teste") ||
    text.includes("aq-10") ||
    text.includes("cat-q") ||
    text.includes("perfil") ||
    text.includes("diagnostico") ||
    text.includes("diagnóstico") ||
    text.includes("laudo")
  ) {
    return `Olá${name}! Os questionários disponíveis no **NeuroConecta** (como AQ-10, CAT-Q de camuflagem social e Perfil Sensorial) são ferramentas para **autoconhecimento e triagem**.

Eles ajudam a mapear traços autistas e preferências sensoriais, mas **não substituem um diagnóstico médico ou neurológico formal**.

Acesse a aba **Testes de Triagem** para realizar as autoavaliações ou **Relatórios & Diagnóstico** para gerar resumos de resultados para seu médico ou terapeuta!`;
  }

  if (
    text.includes("sensorial") ||
    text.includes("som") ||
    text.includes("luz") ||
    text.includes("barulho") ||
    text.includes("textura") ||
    text.includes("estimulo") ||
    text.includes("estímulo")
  ) {
    return `Olá${name}! O processamento sensorial hiper ou hipossensível é uma parte essencial do perfil neurodivergente.

✨ **Estratégias de Regulação:**
- **Auditição:** Utilize fones com cancelamento ativo de ruído ou ruído branco/marrom.
- **Visão:** Reduza o brilho de telas, ative o Modo Baixa Estimulação no topo da tela.
- **Tato/Propriocepção:** Experimente mantas de peso, objetos de stimming (fidgets) e roupas sem costura incômoda.

Visite a aba **Regulação Sensorial** para guias visuais e exercícios de descompressão!`;
  }

  return `Olá${name}! Sou o assistente neuroafirmativo do **NeuroConecta**. Como posso te apoiar hoje?

Principais áreas que posso te ajudar:
1. 🗓️ **Rotina & Organização:** Micro-passos para combate à sobrecarga executiva.
2. 🧘 **Regulação Sensorial:** Exercícios de grounding e descompressão.
3. 💬 **Comunicação & Scripts:** Frases para solicitar acomodações e impor limites.
4. 📋 **Orientações sobre Triagens:** Explicações sobre os testes de autoavaliação.

Sinta-se à vontade para me fazer uma pergunta ou compartilhar o que está sentindo!`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Campo 'messages' é obrigatório e deve ser um array." });
    }

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const ai = getGenAI();

    if (ai) {
      let contextPrompt = "";
      if (userContext) {
        contextPrompt = `[Contexto do Usuário: Nome="${userContext.preferredName || "Não informado"}", Diagnóstico="${userContext.diagnosisStatus || "Não informado"}", Foco Atual="${userContext.currentFocus || "Geral"}"]\n\n`;
      }

      const formattedHistory = messages
        .map((m: { role: string; content: string }) => {
          const roleName = m.role === "user" ? "Usuário" : "NeuroConecta";
          return `${roleName}: ${m.content}`;
        })
        .join("\n\n");

      const fullPrompt = `${contextPrompt}${formattedHistory}\n\nNeuroConecta:`;

      // Try gemini models
      const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
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
    const fallbackReply = getFallbackAssistantReply(lastUserMsg, userContext);
    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    const fallbackReply = getFallbackAssistantReply("", req.body?.userContext);
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
