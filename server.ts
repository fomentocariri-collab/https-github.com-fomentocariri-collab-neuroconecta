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

const SYSTEM_INSTRUCTION = `Você é o assistente virtual inteligente e especializado do aplicativo "NeuroConecta", desenvolvido para ser um ecossistema completo de apoio à neurodiversidade.

Você possui capacidade técnica para interagir em múltiplos NÍVEIS E PERSONAS PROFISSIONAIS, ajustando dinamicamente o vocabulário, profundidade científica e direcionamentos de acordo com o papel selecionado:

## NÍVEIS DE INTERAÇÃO DISPONÍVEIS:
1. 🩺 **NÍVEL MÉDICO & NEUROLOGISTA (medico):**
   - Utilize terminologia nosológica e neurobiológica precisa (ex: critérios DSM-5-TR, CID-11 6A02, neuroconectividade atípica, funções executivas dorso-laterais, coerência central local).
   - Analise testes de triagem (RAADS-R, AQ-10, CAT-Q) do ponto de vista de validade psicométrica, sensibilidade, especificidade e diagnósticos diferenciais (ex: TDAH, Transtorno de Personalidade Esquizóide, MMT/Síndrome de Burnout Autista).
   - Forneça orientação rigorosa para condução de investigação neuropsicológica e emissão de laudo formal.

2. 🩺 **NÍVEL ENFERMAGEM & CUIDADOS (enfermeiro):**
   - Aplique o raciocínio do Processo de Enfermagem e Sistematização da Assistência (SAE), focando na identificação de sinais vitais de desconforto sensorial, prevenção de úlceras por estresse, manejo de meltdowns e rotinas de higiene/nutrição sensoriais.
   - Orientações de biossegurança, acolhimento em triagem (Classificação de Risco Manchester/SUS) e prescrição de cuidados de enfermagem adaptados.

3. 🧠 **NÍVEL PSIQUIATRIA & SAÚDE MENTAL (psiquiatra):**
   - Analise interações entre traços autistas e comorbidades do afeto e humor (Ansiedade Social, Depressão Maior, Rejeição Sensível a Disforia - RSD, Alexitimia, Trauma Complexo C-PTSD).
   - Aborde a síndrome de Burnout Autista x Depressão Unipolar e apresente diretrizes gerais de estadiamento psiquiátrico, manejo de sobrecarga de dopamina/serotonina e estabilização de crises.

4. 🎓 **NÍVEL EDUCACIONAL & PEDAGÓGICO (educador):**
   - Fundamente respostas na Lei Brasileira de Inclusão (LBI nº 13.146/2015) e Lei Berenice Piana (nº 12.764/2012).
   - Forneça diretrizes práticas para elaboração de Plano de Ensino Individualizado (PEI/PDI), desenho universal para a aprendizagem (DUA), acomodações de provas (tempo estendido, sala reservada) e mediação escolar por Acompanhante Terapêutico (AT).

5. 💙 **NÍVEL USUÁRIO & AUTOADVOCACIA (usuario):**
   - Tom neuroafirmativo, claro, empático, direto, sem jargões desnecessários.
   - Orientações práticas de rotina, regulação sensorial, scripts sociais e descompressão.

## REGRAS GERAIS:
- Responda com texto fluido, denso e articulado, priorizando análises técnicas e embasadas.
- Respeite rigorosamente os limites de segurança: não forneça prescrição medicamentosa direta nem substitua a consulta presencial.
- Responda predominantemente em Português do Brasil.`;

function getFallbackAssistantReply(userMessage: string, userContext?: any, role: string = "usuario"): string {
  const text = userMessage.toLowerCase();
  const name = userContext?.preferredName ? `, ${userContext.preferredName}` : "";

  // Role-specific tailored fallback responses
  if (role === "medico") {
    return `[Parecer Técnico-Médico / Neurologia]
Prezado(a) profissional/paciente${name}. Do ponto de vista neurológico e neurodesenvolvimental, a análise do quadro clínico do Transtorno do Espectro Autista em adultos envolve a investigação sistemática dos domínios do DSM-5-TR (A - Comunicação e Interação Social; B - Padrões Restritos e Repetitivos de Comportamento).

Em triagens com marcadores significativos (como escores do RAADS-R superiores a 65 pontos ou AQ-10 superior a 6/10), recomenda-se o prosseguimento da investigação via bateria neuropsicológica quantitativa (ex: WAIS-IV para inteligência, FDT/TAVIS para funções executivas e ADOS-2 Módulo 4). Diagnósticos diferenciais primários incluem Transtorno de Deficit de Atenção e Hiperatividade (TDAH comórbido em ~50-70% dos casos), Transtorno de Ansiedade Social e Transtorno de Personalidade Evitativa. Fico à disposição para aprofundar qualquer dimensão nosológica ou psicométrica específica.`;
  }

  if (role === "enfermeiro") {
    return `[Parecer de Enfermagem & Cuidado Holístico]
Olá${name}. A assistência de enfermagem neuroafirmativa prioriza a identificação precoce de indicadores fisio-comportamentais de sobrecarga sensorial e fadiga executiva.

No plano de cuidados de enfermagem (SISTEMATIZAÇÃO SAE):
1. **Diagnóstico de Enfermagem:** Risco de Conflito de Papel Social relacionado a ambiente de hiperestimulação sensorial; Resposta de Enfrentamento Ineficaz por exaustão do sistema nervoso autônomo.
2. **Intervenções Imediatas (NIC):** Promoção de ambiente de baixa estimulação (iluminação difusa <300 lux, redução de ruídos de fundo), monitoramento de taquicardia e hiperventilação compensatória, e implementação de pausado estruturado com hidratação e descompressão tátil.
3. **Avaliação contínua (NOC):** Nível de ansiedade atenuado e recuperação do tônus de autorregulação. Como a equipe de enfermagem pode atuar melhor no seu plano de cuidado hoje?`;
  }

  if (role === "psiquiatra") {
    return `[Parecer Psiquiátrico & Saúde Mental]
Acolhendo sua solicitação no âmbito da psiquiatria da neurodivergência${name}. A intersecção entre o perfil autista e manifestações de sofrimento psíquico exige diferenciação criteriosa entre Depressão Clássica e a Síndrome de Burnout Autista (Raymaker et al., 2020).

Enquanto a depressão cursa com anedonia generalizada e pensamentos de desvalia, o Burnout Autista caracteriza-se por exaustão bio-psico-sensorial crônica decorrente do esforço contínuo de camuflagem social (Mapeado no CAT-Q). Clinicamente, observa-se regressão temporária no desempenho executivo e perda do limiar de tolerância sensorial. O plano terapêutico psiquiátrico deve priorizar a remoção de estressores ambientais e psicoeducação neuroafirmativa antes de escalonamentos farmacológicos desnecessários.`;
  }

  if (role === "educador") {
    return `[Parecer Pedagógico & Inclusão Escolar / PEI]
Olá${name}! Sob a perspectiva da Pedagogia Inclusiva e legislação vigente (LBI nº 13.146/2015 e Lei Berenice Piana nº 12.764/2012), a garantia de acesso ao conhecimento para estudantes neurodivergentes exige flexibilização curricular estruturada por meio do Plano de Ensino Individualizado (PEI/PDI).

Diretrizes pedagógicas recomendadas:
- **Acomodação Ambiental:** Assento estratégico longe de fontes de ruído e luz direta, permissão para fones de ouvido durante momentos de estudo individual.
- **Adaptação de Avaliações:** Provas impressas em fonte legível com espaçamento ampliado, tempo adicional de 50% e permissão para pausas de descompressão a cada 40 minutos.
- **Desenho Universal para Aprendizagem (DUA):** Apresentação de conteúdos com apoios visuais esquemáticos, mapas mentais e roteiros de passo a passo de tarefas complexas. Como posso auxiliar na montagem do plano educacional?`;
  }

  return `Olá${name}! Sou o assistente neuroafirmativo do **NeuroConecta**. Como posso te apoiar hoje?

Sinta-se à vontade para me fazer perguntas sobre rotinas, regulação sensorial, testes de triagem ou comunicação! Você também pode alterar o modo de interação no topo do chat para conversar no Nível Médico, Enfermagem, Psiquiatria ou Educação Inclusiva.`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userContext, interactionRole } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Campo 'messages' é obrigatório e deve ser um array." });
    }

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
    const activeRole = interactionRole || "usuario";
    const ai = getGenAI();

    if (ai) {
      let contextPrompt = `[MODO DE INTERAÇÃO SELECIONADO: Nível ${activeRole.toUpperCase()}]\n`;
      if (userContext) {
        contextPrompt += `[Contexto do Usuário: Nome="${userContext.preferredName || "Não informado"}", Diagnóstico="${userContext.diagnosisStatus || "Não informado"}", Foco="Geral"]\n\n`;
      }

      const formattedHistory = messages
        .map((m: { role: string; content: string }) => {
          const roleName = m.role === "user" ? "Usuário" : "NeuroConecta";
          return `${roleName}: ${m.content}`;
        })
        .join("\n\n");

      const fullPrompt = `${contextPrompt}${formattedHistory}\n\nNeuroConecta (${activeRole}):`;

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
