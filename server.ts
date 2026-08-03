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
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY non set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
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

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Campo 'messages' é obrigatório e deve ser um array." });
    }

    const ai = getGenAI();

    let contextPrompt = "";
    if (userContext) {
      contextPrompt = `[Contexto do Usuário: Nome="${userContext.preferredName || "Não informado"}", Diagnóstico="${userContext.diagnosisStatus || "Não informado"}", Foco Atual="${userContext.currentFocus || "Geral"}"]\n\n`;
    }

    // Format chat history for Gemini
    // Format conversation into prompt or contents
    const formattedHistory = messages.map((m: { role: string; content: string }) => {
      const roleName = m.role === "user" ? "Usuário" : "NeuroConecta";
      return `${roleName}: ${m.content}`;
    }).join("\n\n");

    const fullPrompt = `${contextPrompt}${formattedHistory}\n\nNeuroConecta:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Desculpe, tive um problema ao gerar a resposta. Como posso te ajudar agora?";

    return res.json({ reply });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    return res.status(500).json({
      error: "Ocorreu um erro ao comunicar com o assistente NeuroConecta.",
      details: error?.message || "Erro desconhecido",
    });
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
