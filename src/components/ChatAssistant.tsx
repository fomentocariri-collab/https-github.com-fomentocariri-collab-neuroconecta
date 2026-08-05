import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Copy, Check, Stethoscope, HeartPulse, Brain, GraduationCap, UserCheck, Building2 } from "lucide-react";
import { UserProfile, ChatMessage, FocusArea, DiagnosisStatus } from "../types";

interface ChatAssistantProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenCrisis: () => void;
}

export type InteractionRole = "usuario" | "medico" | "enfermeiro" | "psiquiatra" | "educador" | "rh";

const getSmartAssistantReply = (userMessage: string, profile: UserProfile, role: InteractionRole = "usuario"): string => {
  const text = userMessage.toLowerCase();
  const name = profile.preferredName ? `, ${profile.preferredName}` : "";

  if (role === "rh") {
    return `[PARECER DE RECURSOS HUMANOS & GESTÃO DE PESSOAS / NR-1 GRO]
Acolhendo sua solicitação no Módulo de Recursos Humanos e Acessibilidade Corporativa${name}:

1. **Acomodações Razoáveis no Trabalho (Art. 3º LBI Lei 13.146/2015):**
   - Garantia de isolamento acústico/fones ANC em escritórios open-space.
   - Pauta prévia por escrito para reuniões e priorização de comunicação assíncrona.
   - Flexibilização de jornada e pausas sensoriais regulares.

2. **Garantia da Regra de Transição do BPC / Auxílio-Inclusão (Lei 14.176/2021):**
   - Ao ser contratado via CLT (Cotas PCD - Lei 8.213/91), o trabalhador recebe o Auxílio-Inclusão pago pelo INSS (50% do salário mínimo) acumulado com seu salário.
   - Caso ocorra desligamento, o BPC integral é reativado imediatamente junto ao INSS sem perda de direitos.

3. **Matriz de Riscos Psicossociais (NR-1.5.4 GRO):**
   - Mapeamento e mitigação de estressores ambientais e prevenção do Burnout Autista e mascaramento social excessivo no ambiente de trabalho.`;
  }

  if (role === "medico") {
    return `[PARECER TÉCNICO-CLÍNICO / NEUROLOGIA E DIAGNÓSTICO]
Prezado(a) paciente/profissional${name}. No acompanhamento de adultos neurodivergentes e investigação de Transtorno do Espectro Autista (TEA Nível 1 de suporte / Perfil Camuflado), a avaliação nosológica deve integrar os critérios diagnósticos do DSM-5-TR e CID-11 (Código 6A02).

Pontos chave na investigação clínica:
1. **Instrumentos de Rastreio:** O RAADS-R (Ritvo Autism Asperger Diagnostic Scale-Revised) possui sensibilidade de 97% e corte clínico aos 65 pontos. O CAT-Q (Camouflaging Autistic Traits Questionnaire) mede a compensação cognitiva e máscara social.
2. **Diagnósticos Diferenciais:** Investigar Transtorno de Deficit de Atenção com Hiperatividade (TDAH), Transtorno de Personalidade Evitativa, Síndrome de Burnout Autista e Transtornos de Processamento Sensorial isolados.
3. **Encaminhamento Recomendado:** Solicitar avaliação neuropsicológica focada em funções executivas, coerência central, cognição social e perfil psicométrico de QI (WAIS-IV).`;
  }

  if (role === "enfermeiro") {
    return `[PLANO DE CUIDADOS E ENFERMAGEM / SISTEMATIZAÇÃO SAE]
Acolhendo sua solicitação na perspectiva da Enfermagem Neuroafirmativa${name}:

1. **Avaliando Sinais de Crise Sensorial:** Monitoramento de hiperventilação, sudorese, rigidez muscular e fadiga pelo esforço de interação social prolongada.
2. **Prescrição de Cuidados:**
   - **Ambiente de Descompressão:** Diminuir luminosidade (<200 lux), disponibilizar abafadores auditivos e manta proprioceptiva.
   - **Protocolo de Hidratação e Nutrição:** Respeitar seletividade alimentar extrema sem julgamentos morais durante a internação ou consulta.
   - **Comunicação Adaptada:** Fornecer fichas de comunicação visual e aguardar o tempo de latência de resposta de 10 a 15 segundos sem interrupção.`;
  }

  if (role === "psiquiatra") {
    return `[PARECER PSIQUIÁTRICO & SAÚDE MENTAL]
Prezado(a)${name}. Na psiquiatria da neurodivergência, é fundamental distinguir entre quadros depressivos primários e o Burnout Autista Decorrente de Sobrecarga Executiva e Camuflagem Social (Hull et al., 2019).

Análise Psicopatológica e Manejo:
- **Burnout Autista:** Apresenta perda temporária de habilidades adaptativas previamente adquiridas, aumento da hiper-reatividade a estímulos sensoriais e apatia profunda por exaustão do sistema de recompensa dopaminérgico.
- **Transtornos Comórbidos de Humor e Ansiedade:** A prevalência de Ansiedade Generalizada e Rejeição Sensível a Disforia (RSD) em autistas é elevada.
- **Diretriz de Suporte:** Priorizar a redução de estressores ambientais e acomodações no trabalho/estudo antes de polifarmácia reativa.`;
  }

  if (role === "educador") {
    return `[PARECER PEDAGÓGICO & INCLUSÃO ESCOLAR]
Olá${name}! Sob a perspectiva do Direito à Educação (LBI nº 13.146/2015) e Desenho Universal para a Aprendizagem (DUA):

1. **Elaboração do PEI (Plano de Ensino Individualizado):** Mapear potencialidades e necessidades de acessibilidade pedagógica do estudante.
2. **Acomodações em Sala de Aula:**
   - Permissão de fones de ruído e objetos de stimming para auto-regulação.
   - Flexibilização de provas (tempo adicional de 50%, sala silenciosa reservada, enunciado fracionado).
   - Apoio de Acompanhante Terapêutico (AT) ou Mediador Escolar para suporte na organização executiva.`;
  }

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

  return `Olá${name}! Sou o assistente neuroafirmativo do **NeuroConecta**. Como posso te apoiar neste momento?

Possuo conhecimento para te orientar em:
1. 🗓️ **Organização da Rotina:** Técnicas contra fadiga executiva.
2. 🧘 **Regulação Sensorial:** Exercícios de grounding e estratégias de descompressão.
3. 💬 **Comunicação & Scripts:** Frases para impor limites e solicitar acomodações.
4. 📋 **Testes & Relatórios:** Informações sobre as ferramentas de triagem do app.

Sinta-se à vontade para enviar sua dúvida ou selecionar o Nível Médico, Enfermagem, Psiquiatria ou Educação no topo do chat!`;
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateToTab,
  onOpenCrisis,
}) => {
  const isDark = userProfile.lowStimulationMode;

  const [interactionRole, setInteractionRole] = useState<InteractionRole>("usuario");
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

  // Initial welcome message if conversation is empty
  useEffect(() => {
    if ((messages.length === 0 || (messages.length === 1 && messages[0].id === "msg-welcome")) && onboardingStep === "done") {
      const realName = userProfile.preferredName && userProfile.preferredName !== "Visitante" ? `, ${userProfile.preferredName}` : "";
      const initialGreeting: ChatMessage = {
        id: "msg-welcome",
        role: "assistant",
        content: `Olá${realName}! Sou o assistente virtual do **NeuroConecta**.

Você pode selecionar o nível de profundidade e perspectiva técnica no topo do chat (Médico, Enfermagem, Psiquiatria, Educação ou Usuário).

**Como posso te ajudar hoje?** Digite sua dúvida ou escolha um dos atalhos abaixo:`,
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
          interactionRole,
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
      replyText = getSmartAssistantReply(text, userProfile, interactionRole);
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
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-7xl mx-auto p-2 sm:p-4 space-y-3 flex-1">
      
      {/* Role Selection Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-sm flex-shrink-0">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pl-1">
          <Sparkles className="w-4 h-4 text-teal-400" />
          Nível de Interação da IA:
        </span>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: "usuario", label: "Usuário / Acolhimento", icon: UserCheck, color: "text-teal-400 bg-teal-950/80 border-teal-800" },
            { id: "medico", label: "Médico / Neurologia", icon: Stethoscope, color: "text-blue-400 bg-blue-950/80 border-blue-800" },
            { id: "enfermeiro", label: "Enfermagem / Cuidado", icon: HeartPulse, color: "text-rose-400 bg-rose-950/80 border-rose-800" },
            { id: "psiquiatra", label: "Psiquiatria / Saúde Mental", icon: Brain, color: "text-purple-400 bg-purple-950/80 border-purple-800" },
            { id: "educador", label: "Educador / PEI Escola", icon: GraduationCap, color: "text-amber-400 bg-amber-950/80 border-amber-800" },
            { id: "rh", label: "IA Recursos Humanos & Gestão", icon: Building2, color: "text-cyan-400 bg-cyan-950/80 border-cyan-800" },
          ].map((role) => {
            const Icon = role.icon;
            const isSelected = interactionRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setInteractionRole(role.id as InteractionRole)}
                className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition ${
                  isSelected
                    ? role.color + " ring-1 ring-offset-1 ring-offset-slate-950 shadow-md font-bold"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Onboarding Box if not completed */}
      {onboardingStep !== "done" && (
        <div className={`mb-2 rounded-2xl p-5 shadow-xl space-y-4 border ${
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
      <div className={`flex-1 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner border text-slate-100 ${
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
              className={`p-2.5 rounded-xl text-white flex-shrink-0 shadow-sm ${
                msg.role === "user" ? "bg-teal-600" : "bg-emerald-700 dark:bg-emerald-800"
              }`}
            >
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed space-y-2 relative group shadow-sm border ${
                msg.role === "user"
                  ? isDark
                    ? "bg-teal-950/90 text-teal-100 border-teal-800/80 rounded-tr-none"
                    : "bg-teal-600 text-white font-medium border-teal-700 rounded-tr-none"
                  : isDark
                    ? "bg-slate-800/95 text-slate-100 border-slate-700 rounded-tl-none"
                    : "bg-white text-slate-900 border-slate-200 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans leading-relaxed text-sm sm:text-base">
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
            <span>O assistente NeuroConecta ({interactionRole}) está formulando a resposta...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="py-1 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
        {[
          { label: "🩺 Discutir RAADS-R / AQ-10", prompt: "Gostaria de discutir a validade psicométrica e hipóteses dos testes RAADS-R e AQ-10 para triagem de adultos." },
          { label: "🧠 Analisar Burnout Autista x Depressão", prompt: "Pode fazer uma diferenciação clínica detalhada entre Burnout Autista e Depressão Unipolar?" },
          { label: "🎓 Orientações para PEI na Escola", prompt: "Como estruturar o Plano de Ensino Individualizado (PEI) garantindo acessibilidade sensorial para o aluno autista?" },
          { label: "💬 Pedir Script Social de Acomodação", prompt: "Pode me sugerir um script social para comunicar uma necessidade sensorial ou pedir acomodação no trabalho?" },
          { label: "🧘 Exercício de Grounding", prompt: "Pode me guiar passo a passo em uma técnica de grounding (5-4-3-2-1) para desacelerar agora?" },
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
          placeholder={`Digite sua dúvida no nível (${interactionRole.toUpperCase()})...`}
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
