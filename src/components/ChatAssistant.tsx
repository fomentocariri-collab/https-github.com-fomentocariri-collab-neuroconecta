import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Bot, User, Sparkles, Copy, Check, 
  UserCheck, GraduationCap, Users, MessageSquare, 
  Clock, HeartPulse, Building2, AlertTriangle, Info
} from "lucide-react";
import { UserProfile, ChatMessage, FocusArea, DiagnosisStatus } from "../types";

interface ChatAssistantProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenCrisis: () => void;
}

export type InteractionRole = 
  | "meu_apoio" 
  | "educacao" 
  | "familia_cuidado" 
  | "comunicacao_acessibilidade" 
  | "organizacao_rotina" 
  | "saude" 
  | "trabalho";

const getSmartAssistantReply = (userMessage: string, profile: UserProfile, role: InteractionRole = "meu_apoio"): string => {
  const text = userMessage.toLowerCase();
  const name = profile.preferredName && profile.preferredName !== "Visitante" ? `, ${profile.preferredName}` : "";

  // 1. SAÚDE - Organização e Preparação
  if (role === "saude") {
    return `[Apoio para Organização & Preparação em Saúde]
Olá${name}.

⚠️ **Aviso de Segurança:** A IA oferece apoio para organizar informações e preparar perguntas ou registros. Não substitui profissionais habilitados nem realiza diagnóstico, prescrição ou decisão clínica.

Posso te ajudar a preparar sua consulta com os seguintes passos práticos:
1. **Organização cronológica de sintomas:** Registrar o que você sentiu, datas aproximadas e o que atenua ou agrava o desconforto.
2. **Lista de perguntas prioritárias:** Estruturar 3 a 5 perguntas objetivas para você tirar dúvidas com seu médico ou terapeuta.
3. **Registro de efeitos de rotina:** Estruturar um diário simples para acompanhar sono, alimentação e efeitos percebidos ao longo dos dias.

O que você gostaria de estruturar para a sua próxima consulta?`;
  }

  // 2. TRABALHO - Acessibilidade & Organização
  if (role === "trabalho") {
    return `[Apoio para Acessibilidade & Organização no Trabalho]
Olá${name}.

ℹ️ **Aviso:** A IA oferece apoio para organizar informações e pedidos funcionais. Não emite parecer jurídico, médico ou trabalhista.

Posso te apoiar com:
1. **Redação de pedidos de acomodação funcional:** Modelos educados e objetivos para solicitar uso de fones abafadores com cancelamento de ruído, instruções de tarefas por escrito ou assento em área com menor circulação.
2. **Organização e priorização de tarefas:** Ajudar a organizar demandas acumuladas e sugerir uma mensagem para alinhar prioridades com seu gestor.
3. **Comunicação profissional assíncrona:** Estruturar emails ou mensagens para evitar sobrecarga de reuniões desnecessárias.

Qual pedido ou alinhamento de trabalho você gostaria de redigir?`;
  }

  // 3. EDUCAÇÃO - Inclusão Escolar & DUA
  if (role === "educacao") {
    return `[Apoio Pedagógico & Inclusão Escolar]
Olá${name}! No contexto educacional inclusivo, nosso foco é remover barreiras pedagógicas e reduzir sobrecargas sensoriais e cognitivas.

**O que você precisa ensinar ou tornar mais acessível hoje?**

Posso te apoiar com:
- **Adaptação de atividades:** Dividir enunciados extensos em etapas menores mantendo intacto o objetivo pedagógico.
- **Desenho Universal para Aprendizagem (DUA):** Sugerir múltiplas formas de participação (visual, oral, escrita) para acolher diferentes ritmos.
- **Apoios visuais e previsibilidade:** Quadros visuais para antecipar a rotina da aula e transições suaves entre disciplinas.
- **Minuta de PEI / PDI:** Ajudar a registrar as acomodações necessárias e estratégias de acessibilidade.
- **Comunicação respeitosa Escola-Família:** Redigir registros pedagógicos descritivos, neutros e acolhedores.`;
  }

  // 4. FAMÍLIA & CUIDADO - Rotina e Rede de Apoio
  if (role === "familia_cuidado") {
    return `[Apoio à Família & Rede de Cuidados]
Olá${name}! O papel da rede de apoio é construir um ambiente seguro, com previsibilidade e acolhimento mútuo.

Como posso apoiar a rotina familiar hoje?
- **Previsibilidade doméstica:** Organizar horários estáveis para as refeições, descanso e momentos de silêncio.
- **Antecipação de mudanças:** Planejar como conversar antes sobre alterações de horários, visitas ou consultas.
- **Divisão de tarefas colaborativas:** Estruturar afazeres com a participação da pessoa apoiada respeitando seu ritmo.
- **Comunicação com a escola/terapeutas:** Preparar mensagens informando sobre a semana sem cobranças ou julgamentos.
- **Ajustes ambientais:** Reduzir excesso de estímulos luminosos, sonoros ou desorganização física nos espaços de descanso.`;
  }

  // 5. COMUNICAÇÃO & ACESSIBILIDADE - Expressão e Scripts
  if (role === "comunicacao_acessibilidade") {
    return `[Comunicação & Acessibilidade]
Olá${name}! Uma comunicação autêntica e clara reduz a ansiedade e garante que suas necessidades sejam compreendidas.

Posso te apoiar a:
- **Criar scripts sociais:** Textos prontos para dizer 'não' educadamente, pedir um tempo para pensar ou recusar um convite sem constrangimento.
- **Solicitar instruções por escrito:** Frases diretas para garantir que detalhes de conversas orais fiquem registrados.
- **Tradução para linguagem literal:** Ajudar a interpretar metáforas ou expressões implícitas que pareçam confusas.
- **Apoio a CAA (Comunicação Aumentativa e Alternativa):** Elaborar frases curtas com vocabulário direto para painéis ou cartões.

Qual situação comunicativa você gostaria de praticar ou preparar?`;
  }

  // 6. ORGANIZAÇÃO & ROTINA - Funções Executivas
  if (role === "organizacao_rotina") {
    return `[Organização & Rotina Funcional]
Olá${name}! Estruturar a rotina com clareza visual alivia a fadiga mental e facilita o início das tarefas.

Posso te apoiar com:
- **Estruturação do dia:** Dividir o dia em blocos realistas (Manhã, Tarde e Noite) com margem para pausas.
- **Dividir uma tarefa grande em etapas:** Transformar uma demanda complexa em passos de 10 a 15 minutos.
- **Rotina para dias de baixa energia:** Identificar o que é estritamente essencial e o que pode esperar quando a energia está baixa.
- **Checklist de saída de casa:** Listar itens essenciais para não esquecer nada ao sair (chaves, documentos, fones, água).

Qual atividade você gostaria de organizar agora?`;
  }

  // 7. MEU APOIO (padrão)
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
    return `Olá${name}. Estou aqui com você. Se estiver sentindo sobrecarga sensorial ou emocional:

Sua segurança e bem-estar vêm em primeiro lugar.

💙 **Estratégia Imediata de Descompressão:**
1. **Reduza Estímulos:** Vá para um local silencioso, diminua as luzes ou use fones de ouvido.
2. **Exercício de Apoio Sensorial (5-4-3-2-1):**
   - 👁️ Olhe para 5 objetos seguros ao seu redor.
   - 🖐️ Toque em 4 texturas que tragam conforto.
   - 👂 Ouça 3 sons suaves no ambiente.
   - 👃 Sinta 2 aromas agradáveis.
   - 👅 Beba um gole de água fresca devagar.
3. Não tente resolver decisões difíceis agora. Apenas respire no seu próprio ritmo.

⚠️ *Se precisar de acolhimento emergencial humano, use o botão **SOS Crise** no topo ou ligue para o CVV (188) ou SAMU (192).*`;
  }

  return `Olá${name}! Sou o copiloto de apoio do **NeuroConecta**.

Posso te apoiar a:
1. 🗓️ **Organizar o seu dia:** Dividir tarefas grandes em passos simples e fáceis de começar.
2. ✍️ **Preparar mensagens:** Redigir pedidos de apoio, acomodação ou instruções por escrito.
3. 🧘 **Autorregulação:** Encontrar momentos de pausa e estratégias de descompressão sensorial.
4. 🧭 **Recursos do NeuroConecta:** Indicar sons relaxantes, scripts sociais prontos ou rotinas visuais.

Selecione o **Contexto do Apoio** acima para focar no que você mais precisa neste momento!`;
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateToTab,
  onOpenCrisis,
}) => {
  const isDark = userProfile.lowStimulationMode;

  const [interactionRole, setInteractionRole] = useState<InteractionRole>("meu_apoio");
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
        content: `Olá${realName}! Sou o copiloto de apoio do **NeuroConecta**.

Como posso apoiar você hoje? Posso ajudar a:
• Organizar o seu dia ou dividir uma tarefa difícil em etapas
• Redigir uma mensagem objetiva ou pedir uma acomodação funcional
• Adaptar uma atividade de estudo ou apoiar a rotina familiar
• Guiar estratégias simples de pausa e autorregulação

Selecione no menu acima o **Contexto do Apoio** mais adequado para o seu momento ou digite sua mensagem abaixo.`,
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
      
      {/* Support Context Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 pl-1">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200">Contexto do Apoio:</span>
          <span className="text-[11px] text-slate-400 hidden lg:inline">• Copiloto de organização, comunicação e acessibilidade</span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: "meu_apoio", label: "Meu Apoio", icon: UserCheck, color: "text-teal-300 bg-teal-950/80 border-teal-700" },
            { id: "educacao", label: "Educação", icon: GraduationCap, color: "text-amber-300 bg-amber-950/80 border-amber-700" },
            { id: "familia_cuidado", label: "Família & Cuidado", icon: Users, color: "text-emerald-300 bg-emerald-950/80 border-emerald-700" },
            { id: "comunicacao_acessibilidade", label: "Comunicação & Acessibilidade", icon: MessageSquare, color: "text-sky-300 bg-sky-950/80 border-sky-700" },
            { id: "organizacao_rotina", label: "Organização & Rotina", icon: Clock, color: "text-indigo-300 bg-indigo-950/80 border-indigo-700" },
            { id: "saude", label: "Saúde (Organização)", icon: HeartPulse, color: "text-rose-300 bg-rose-950/80 border-rose-700" },
            { id: "trabalho", label: "Trabalho (Acessibilidade)", icon: Building2, color: "text-cyan-300 bg-cyan-950/80 border-cyan-700" },
          ].map((ctx) => {
            const Icon = ctx.icon;
            const isSelected = interactionRole === ctx.id;
            return (
              <button
                key={ctx.id}
                onClick={() => setInteractionRole(ctx.id as InteractionRole)}
                className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition text-xs ${
                  isSelected
                    ? ctx.color + " ring-1 ring-offset-1 ring-offset-slate-950 shadow-md font-bold"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{ctx.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context Specific Safety Notice Banner */}
      {interactionRole === "saude" && (
        <div className="bg-amber-950/60 border border-amber-800/80 text-amber-200 px-3.5 py-2 rounded-xl text-xs flex items-start gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Aviso de Apoio em Saúde:</strong> A IA oferece apoio para organizar informações e preparar perguntas ou registros. Não substitui profissionais habilitados nem realiza diagnóstico, prescrição ou decisão clínica.
          </p>
        </div>
      )}

      {interactionRole === "trabalho" && (
        <div className="bg-cyan-950/60 border border-cyan-800/80 text-cyan-200 px-3.5 py-2 rounded-xl text-xs flex items-start gap-2 shadow-sm">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Aviso de Apoio no Trabalho:</strong> A IA oferece apoio para organizar informações e pedidos funcionais. Não emite parecer jurídico, médico ou trabalhista.
          </p>
        </div>
      )}

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
            <span>O copiloto NeuroConecta está formulando a resposta...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="py-1 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
        {[
          { label: "🗓️ Organizar meu dia", prompt: "Pode me ajudar a organizar o meu dia de forma clara e sem sobrecarga?" },
          { label: "🧩 Dividir tarefa em etapas", prompt: "Tenho uma tarefa grande para fazer e estou com dificuldade de começar. Pode me ajudar a dividi-la em etapas simples?" },
          { label: "✍️ Pedir instruções por escrito", prompt: "Pode redigir uma mensagem curta e educada pedindo que as instruções da tarefa sejam enviadas por escrito?" },
          { label: "🎧 Pedir uso de fones abafadores", prompt: "Pode me ajudar a redigir um pedido para utilizar fones com cancelamento de ruído no ambiente de trabalho ou estudo?" },
          { label: "🎓 Adaptar atividade escolar", prompt: "Como posso tornar uma atividade de estudo mais acessível e dividida em passos para reduzir sobrecarga?" },
          { label: "💬 Script para conversa difícil", prompt: "Tenho uma conversa delicada pela frente. Pode me sugerir um roteiro respeitoso para expressar meus limites?" },
          { label: "🧘 Autorregulação & Pausa", prompt: "Estou me sentindo sobrecarregado(a). Pode me guiar em uma estratégia simples de respiração ou descompressão sensorial?" },
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
          placeholder="Digite sua mensagem ou o que deseja organizar hoje..."
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
