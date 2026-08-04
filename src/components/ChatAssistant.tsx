import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Copy, Check } from "lucide-react";
import { UserProfile, ChatMessage, FocusArea, DiagnosisStatus } from "../types";

interface ChatAssistantProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenCrisis: () => void;
}

const getSmartAssistantReply = (userMessage: string, profile: UserProfile): string => {
  const text = userMessage.toLowerCase();
  const name = profile.preferredName ? `, ${profile.preferredName}` : "";

  if (
    text.includes("crise") ||
    text.includes("meltdown") ||
    text.includes("shutdown") ||
    text.includes("panico") ||
    text.includes("pânico") ||
    text.includes("desespero") ||
    text.includes("socorro") ||
    text.includes("sobrecarga") ||
    text.includes("ansiedade")
  ) {
    return `Olá${name}. Estou aqui com você. Percebo que você pode estar passando por um momento de sobrecarga ou crise.

Sua segurança e acolhimento são a nossa prioridade.

💙 **Passos Práticos de Regulação Imediata:**
1. **Reduza Estímulos:** Vá para um local seguro, diminua a iluminação ou use fones de ouvido.
2. **Exercício de Grounding (5-4-3-2-1):**
   - 👁️ Identifique 5 objetos ao seu redor.
   - 🖐️ Sinta 4 texturas conhecidas.
   - 👂 Ouça 3 sons distantes.
   - 👃 Note 2 aromas sutis.
   - 👅 Respire fundo focando na expansão do seu tórax.

⚠️ *Se precisar de suporte emocional imediato ou atendimento de emergência, utilize o botão **SOS Crise** no topo ou ligue para o CVV (188) ou SAMU (192).*`;
  }

  if (
    text.includes("rotina") ||
    text.includes("tarefa") ||
    text.includes("organiza") ||
    text.includes("tempo") ||
    text.includes("foco") ||
    text.includes("executiv")
  ) {
    return `Olá${name}! Organizar a rotina de forma neuroafirmativa envolve respeitar seus limites cognitivos e energia diária.

✨ **Três Estratégias Práticas:**
1. **Divisão em Micro-etapas (Chunking):** Divida uma tarefa grande em pequenos passos simples.
2. **Pausas Sensoriais Ativas:** Insira pausas de 5 a 10 minutos entre blocos de foco para descompressão.
3. **Uso de Suportes Visuais:** Acesse a aba **Rotina Visual & Tarefas** no menu do app para priorizar suas atividades por urgência e demanda de energia.

Como posso te ajudar no planejamento da sua próxima tarefa?`;
  }

  if (
    text.includes("comunica") ||
    text.includes("script") ||
    text.includes("falar") ||
    text.includes("trabalho") ||
    text.includes("explicar") ||
    text.includes("social")
  ) {
    return `Olá${name}! Expressar suas necessidades e limites de maneira assertiva e sem sentimento de culpa é um passo essencial de auto-advocacia.

📌 **Exemplo de Script para Pedir Acomodação:**
*"Olá! Para que eu possa desempenhar minhas atividades com melhor foco e conforto, prefiro receber direcionamentos por escrito e contar com breves intervalos de descompressão. Agradeço pelo apoio e compreensão!"*

Você pode acessar a aba **Comunicação** no menu para mais cartões ilustrados e modelos de scripts prontos!`;
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
    return `Olá${name}! Os questionários do **NeuroConecta** (AQ-10, CAT-Q de camuflagem social, Perfil Sensorial e Burnout Autista) foram elaborados para **autoavaliação e rastreio de traços**.

Eles auxiliam na identificação de padrões e preferências sensoriais, **mas não substituem o diagnóstico médico formal**.

Acesse as abas **Testes de Triagem** ou **Relatórios & Diagnóstico** para preencher as avaliações e emitir um parecer consolidado para apresentar ao seu profissional de saúde!`;
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
    return `Olá${name}! O processamento sensorial hiper ou hipossensível é um aspecto central do perfil autista.

🌿 **Dicas de Acomodação Sensorial:**
- **Estímulos Auditivos:** Fones com cancelamento de ruído ou sons de chuva/ruído marrom.
- **Estímulos Visuais:** Redução de brilho nas telas ou ativação do Modo Baixa Estimulação no topo da tela.
- **Tato & Propriocepção:** Roupas sem costuras incômodas, mantas de peso e objetos de stimming.

Acesse a aba **Regulação Sensorial** para guias visuais e exercícios para descompressão diária!`;
  }

  return `Olá${name}! Sou o assistente neuroafirmativo do **NeuroConecta**. Como posso te apoiar neste momento?

Possuo conhecimento para te orientar em:
1. 🗓️ **Organização da Rotina:** Técnicas contra fadiga executiva.
2. 🧘 **Regulação Sensorial:** Exercícios de grounding e estratégias de descompressão.
3. 💬 **Comunicação & Scripts:** Frases para impor limites e solicitar acomodações.
4. 📋 **Testes & Relatórios:** Informações sobre as ferramentas de triagem do app.

Sinta-se à vontade para enviar sua dúvida ou compartilhar o que está sentindo!`;
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateToTab,
  onOpenCrisis,
}) => {
  const isDark = userProfile.lowStimulationMode;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Onboarding local state if user hasn't filled profile
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | "done">(
    userProfile.onboardingCompleted ? "done" : 1
  );
  const [tempName, setTempName] = useState(userProfile.preferredName || "");

  useEffect(() => {
    if (userProfile.onboardingCompleted) {
      setOnboardingStep("done");
    }
    if (userProfile.preferredName && userProfile.preferredName !== "Visitante") {
      setTempName(userProfile.preferredName);
    }
  }, [userProfile.onboardingCompleted, userProfile.preferredName]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message if conversation is empty or if user profile name changed
  useEffect(() => {
    if ((messages.length === 0 || (messages.length === 1 && messages[0].id === "msg-welcome")) && onboardingStep === "done") {
      const realName = userProfile.preferredName && userProfile.preferredName !== "Visitante" ? `, ${userProfile.preferredName}` : "";
      const initialGreeting: ChatMessage = {
        id: "msg-welcome",
        role: "assistant",
        content: `Olá${realName}! Sou o assistente virtual do **NeuroConecta**.

Estou aqui para te apoiar com ferramentas práticas, rotinas visuais, comunicação neuroafirmativa, regulação sensorial e escuta acolhedora.

**Como posso te ajudar hoje?** Escolha uma opção rápida abaixo ou digite sua mensagem:`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([initialGreeting]);
    }
  }, [onboardingStep, userProfile.preferredName]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    let replyText = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            preferredName: userProfile.preferredName,
            diagnosisStatus: userProfile.diagnosisStatus,
            currentFocus: userProfile.currentFocus,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          replyText = data.reply;
        }
      }
    } catch (err) {
      console.warn("API de chat indisponível, utilizando resposta local inteligente:", err);
    }

    // Always fallback to smart response if API returned empty or failed
    if (!replyText) {
      replyText = getSmartAssistantReply(text, userProfile);
    }

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Onboarding submit
  const finishOnboarding = (focus: FocusArea, diagStatus?: DiagnosisStatus) => {
    const updated = {
      ...userProfile,
      preferredName: tempName.trim() || "Amigo(a)",
      diagnosisStatus: diagStatus || userProfile.diagnosisStatus,
      currentFocus: focus,
      onboardingCompleted: true,
    };
    onUpdateProfile(updated);
    setOnboardingStep("done");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-5xl mx-auto p-3 sm:p-4">
      
      {/* Onboarding Box if not completed */}
      {onboardingStep !== "done" && (
        <div className={`mb-4 rounded-2xl p-6 shadow-xl space-y-4 border ${
          isDark 
            ? "bg-slate-900 border-teal-700/80 text-slate-100" 
            : "bg-white border-teal-200 text-slate-900 shadow-md"
        }`}>
          <div className="flex items-center gap-3 text-teal-600 dark:text-teal-300">
            <Sparkles className="w-6 h-6 text-teal-500 animate-pulse" />
            <h2 className="text-lg font-bold">Bem-vindo(a) ao NeuroConecta!</h2>
          </div>
          <p className={`${isDark ? "text-slate-300" : "text-slate-600"} text-sm leading-relaxed`}>
            Para personalizar melhor seu atendimento com linguagem neuroafirmativa, nos diga brevemente:
          </p>

          {onboardingStep === 1 && (
            <div className="space-y-3">
              <label className={`block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                1. Como prefere ser chamado(a)?
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Seu nome ou apelido"
                className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  isDark
                    ? "bg-slate-950 border border-slate-700 text-slate-100"
                    : "bg-slate-50 border border-slate-300 text-slate-900"
                }`}
              />
              <button
                onClick={() => setOnboardingStep(2)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition"
              >
                Avançar
              </button>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-3">
              <label className={`block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                2. {tempName ? `${tempName}, você` : "Você"} já possui diagnóstico de TEA ou está em processo de investigação?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                {[
                  { label: "Autodiagnosticado / Identificação", val: "autodiagnosticado" },
                  { label: "Em processo de investigação", val: "investigacao" },
                  { label: "Possuo laudo formal confirmado", val: "laudo_formal" },
                  { label: "Familiar / Cuidador", val: "familiar_apoiador" },
                  { label: "Prefiro não informar", val: "nao_informado" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      onUpdateProfile({ ...userProfile, diagnosisStatus: opt.val as DiagnosisStatus });
                      setOnboardingStep(3);
                    }}
                    className={`p-3 border rounded-xl text-left font-medium transition ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                        : "bg-slate-50 hover:bg-teal-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-3">
              <label className={`block text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                3. Qual área da vida você gostaria de trabalhar hoje?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                {[
                  { label: "📅 Rotina & Pausas", focus: "rotina" },
                  { label: "📋 Testes & Autoavaliação", focus: "testes" },
                  { label: "🌊 Regulação Sensorial", focus: "sensorial" },
                  { label: "💬 Comunicação & Scripts", focus: "comunicacao" },
                  { label: "🆘 Prevenção de Crises", focus: "crise" },
                  { label: "📚 Aprendizado & Conceitos", focus: "aprendizado" },
                ].map((item) => (
                  <button
                    key={item.focus}
                    onClick={() => finishOnboarding(item.focus as FocusArea)}
                    className={`p-3 border rounded-xl text-center font-medium transition ${
                      isDark
                        ? "bg-teal-950/80 hover:bg-teal-900 border-teal-800 text-teal-200"
                        : "bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Chat Conversation Container */}
      <div className={`flex-1 rounded-2xl p-4 sm:p-5 overflow-y-auto space-y-4 shadow-sm border ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-slate-50 border-slate-200 text-slate-900"
      }`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`p-2 rounded-xl text-white flex-shrink-0 shadow-sm ${
                msg.role === "user" ? "bg-teal-600" : "bg-emerald-700 dark:bg-emerald-800"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed space-y-2 relative group shadow-sm border ${
                msg.role === "user"
                  ? isDark
                    ? "bg-teal-950/90 text-teal-100 border-teal-800/80 rounded-tr-none"
                    : "bg-teal-600 text-white font-medium border-teal-700 rounded-tr-none"
                  : isDark
                    ? "bg-slate-800/90 text-slate-100 border-slate-700 rounded-tl-none"
                    : "bg-white text-slate-900 border-slate-200 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans leading-relaxed">
                {msg.content}
              </div>

              {/* Action Bar inside bubble */}
              <div className={`flex items-center justify-between pt-1 text-[11px] border-t mt-2 ${
                msg.role === "user" && !isDark
                  ? "text-teal-100 border-teal-500/40"
                  : isDark
                    ? "text-slate-400 border-slate-700/50"
                    : "text-slate-400 border-slate-100"
              }`}>
                <span>{msg.timestamp}</span>
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 transition p-1 hover:underline flex items-center gap-1"
                  title="Copiar texto"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === msg.id ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs italic p-2">
            <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-spin" />
            <span>O assistente NeuroConecta está formulando a resposta...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
        {[
          { label: "💬 Pedir Script Social", prompt: "Pode me sugerir um script social para comunicar uma necessidade sensorial ou pedir desculpas por faltar a um evento?" },
          { label: "🧘 Exercício de Grounding", prompt: "Pode me guiar passo a passo em uma técnica de grounding (5-4-3-2-1) para desacelerar agora?" },
          { label: "📅 Pausas Sensoriais na Rotina", prompt: "Como posso organizar blocos de tempo com pausas sensoriais no meu dia de trabalho/estudo?" },
          { label: "📋 Fazer Teste de Burnout", prompt: "Gostaria de entender melhor como funciona o teste de Burnout Autista disponível no aplicativo." },
          { label: "💡 O que é Stimming?", prompt: "Pode me explicar o que é Stimming e por que é uma ferramenta importante de autorregulação?" },
          { label: "🆘 Apoio em crise", action: onOpenCrisis },
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (chip.action) chip.action();
              else if (chip.prompt) handleSendMessage(chip.prompt);
            }}
            className={`px-3 py-1.5 border rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 shadow-sm ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-teal-300"
                : "bg-white hover:bg-teal-50 border-slate-300 text-slate-700 hover:text-teal-800"
            }`}
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-1 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite sua dúvida ou desabafo..."
          disabled={isLoading}
          className={`flex-1 px-4 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition ${
            isDark
              ? "bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          }`}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold rounded-2xl shadow-md transition flex items-center gap-2 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>

    </div>
  );
};
