import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, Copy, Check, ShieldAlert, Heart, MessageSquare } from "lucide-react";
import { UserProfile, ChatMessage, FocusArea, DiagnosisStatus } from "../types";

interface ChatAssistantProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenCrisis: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateToTab,
  onOpenCrisis,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Onboarding local state if user hasn't filled profile
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | "done">(
    userProfile.onboardingCompleted ? "done" : 1
  );
  const [tempName, setTempName] = useState(userProfile.preferredName || "");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message if conversation is empty
  useEffect(() => {
    if (messages.length === 0 && onboardingStep === "done") {
      const initialGreeting: ChatMessage = {
        id: "msg-welcome",
        role: "assistant",
        content: `Olá${userProfile.preferredName ? `, ${userProfile.preferredName}` : ""}! Sou o assistente virtual do **NeuroConecta**.

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

      const data = await response.json();
      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "⚠️ Tive uma pequena instabilidade de conexão. Por favor, tente enviar sua mensagem novamente. Se você estiver em um momento de crise urgente, utilize o botão **SOS Crise** no topo.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
        <div className="mb-4 bg-slate-900 border border-teal-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-teal-300">
            <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
            <h2 className="text-lg font-bold">Bem-vindo(a) ao NeuroConecta!</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Para personalizar melhor seu atendimento com linguagem neuroafirmativa, nos diga brevemente:
          </p>

          {onboardingStep === 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200">1. Como prefere ser chamado(a)?</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Seu nome ou apelido"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-500"
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
              <label className="block text-sm font-semibold text-slate-200">
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
                    className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left text-slate-200 font-medium transition"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
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
                    className="p-3 bg-teal-950/80 hover:bg-teal-900 border border-teal-800 rounded-xl text-teal-200 text-center font-medium transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Chat Conversation */}
      <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`p-2 rounded-xl text-white flex-shrink-0 ${
                msg.role === "user" ? "bg-emerald-600" : "bg-teal-700"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed space-y-2 relative group ${
                msg.role === "user"
                  ? "bg-emerald-950/80 text-emerald-100 border border-emerald-800/80 rounded-tr-none"
                  : "bg-slate-800/90 text-slate-100 border border-slate-700 rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans leading-relaxed">
                {msg.content}
              </div>

              {/* Action Bar inside bubble */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-700/50 mt-2">
                <span>{msg.timestamp}</span>
                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-slate-200 flex items-center gap-1"
                  title="Copiar texto"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === msg.id ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs italic p-2">
            <Bot className="w-4 h-4 text-teal-400 animate-spin" />
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
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-teal-300 rounded-full font-medium whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0"
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
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-teal-500 placeholder-slate-500 shadow-sm"
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
