import React, { useState } from "react";
import { MessageSquare, Copy, Check, FileText, Share2, HelpCircle, Volume2 } from "lucide-react";
import { SOCIAL_SCRIPTS, LITERAL_LANGUAGE_GUIDE } from "../data/scripts";

export const CommunicationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"scripts" | "gerador" | "literal">("scripts");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Accommodation Generator state
  const [recipient, setRecipient] = useState("Gestor(a) / RH");
  const [requestType, setRequestType] = useState("fones");
  const [customDetail, setCustomDetail] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.95;
      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta a síntese de voz nativa.");
    }
  };

  const handleGenerateAccommodation = () => {
    let detailText = "";
    if (requestType === "fones") {
      detailText = "a autorização para utilizar fones de ouvido com cancelamento de ruído passivo ou ativo durante as tarefas individuais para reduzir o estresse por ruídos de fundo.";
    } else if (requestType === "instrucoes_escritas") {
      detailText = "que as instruções de projetos, tarefas complexas e prazos sejam enviadas por e-mail ou aplicativo de mensagem por escrito, garantindo alinhamento e precisão.";
    } else if (requestType === "local_tranquilo") {
      detailText = "a possibilidade de trabalhar em uma mesa em local de menor circulação de pessoas ou em regime híbrido/remoto alguns dias na semana.";
    } else {
      detailText = customDetail || "pequenas adaptações sensoriais e de fluxo de trabalho para otimizar meu desempenho.";
    }

    const fullTemplate = `Prezado(a) ${recipient || "Sua Equipe"},

Gostaria de solicitar uma acomodação razoável no ambiente de trabalho/estudo para otimizar meu foco e bem-estar.

Como pessoa neurodivergente (autismo/TEA), funciono de maneira mais eficiente com certas estruturações. Solicito gentilmente:
• ${detailText}

Essa simples medida me ajudará a manter alta qualidade de entregas e evitar a fadiga cognitiva excessiva. 

Permaneço totalmente à disposição para esclarecer qualquer dúvida.

Atenciosamente,`;

    setGeneratedText(fullTemplate);
  };

  const filteredScripts =
    selectedCategory === "todos"
      ? SOCIAL_SCRIPTS
      : SOCIAL_SCRIPTS.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            Comunicação & Scripts Sociais
          </h1>
          <p className="text-sm text-slate-400">
            Modelos de mensagens prontos para o dia a dia, gerador de acomodações e esclarecimento de expressões figuradas.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-800 pb-2">
        {[
          { id: "scripts", label: "💬 Biblioteca de Scripts" },
          { id: "gerador", label: "✉️ Gerador de Acomodações" },
          { id: "literal", label: "📖 Guia do Sentido Literal" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-teal-950 text-teal-200 border border-teal-700"
                : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Scripts Library */}
      {activeTab === "scripts" && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex overflow-x-auto no-scrollbar gap-2">
            {[
              { id: "todos", label: "Todos" },
              { id: "trabalho", label: "Trabalho" },
              { id: "saude", label: "Saúde / Médicos" },
              { id: "familia", label: "Família" },
              { id: "social", label: "Eventos Sociais" },
              { id: "acomodacoes", label: "Acomodações" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? "bg-teal-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScripts.map((sc) => (
              <div
                key={sc.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded-md border border-teal-800">
                      {sc.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-base">{sc.title}</h3>
                  <p className="text-xs text-slate-400">{sc.description}</p>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {sc.scriptText}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopy(sc.id, sc.scriptText)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedId === sc.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === sc.id ? "Copiado!" : "Copiar"}</span>
                  </button>

                  <button
                    onClick={() => handleSpeak(sc.id, sc.scriptText)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      speakingId === sc.id
                        ? "bg-teal-600 text-white animate-pulse"
                        : "bg-slate-800 hover:bg-slate-700 text-teal-300"
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speakingId === sc.id ? "Falando..." : "Ouvir Áudio"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Accommodation Request Generator */}
      {activeTab === "gerador" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-100">Gerador de Pedido de Acomodação</h2>
            <p className="text-xs text-slate-400">
              Monte uma mensagem formal e educada para solicitar fones, instruções por escrito ou flexibilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Para quem é a mensagem?</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ex: Prof. Silva, Gerente de RH, Supervisor..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Qual acomodação você precisa?</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
              >
                <option value="fones">Uso de fones com cancelamento de ruído</option>
                <option value="instrucoes_escritas">Instruções de tarefas enviadas por escrito</option>
                <option value="local_tranquilo">Trabalho em mesa mais silenciosa / Híbrido</option>
                <option value="outro">Outro pedido personalizado</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateAccommodation}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Gerar Modelo de Texto</span>
          </button>

          {generatedText && (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Texto Gerado:</h4>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                {generatedText}
              </div>

              <button
                onClick={() => handleCopy("gen-acc", generatedText)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedId === "gen-acc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === "gen-acc" ? "Copiado!" : "Copiar Texto"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Literal Meaning Guide */}
      {activeTab === "literal" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-100">Guia de Expressões Figuradas vs. Sentido Literal</h2>
            <p className="text-xs text-slate-400">
              Se você costuma interpretar metáforas de forma literal, consulte o significado real das expressões mais comuns do português:
            </p>
          </div>

          <div className="space-y-3">
            {LITERAL_LANGUAGE_GUIDE.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <h3 className="font-bold text-teal-300 text-sm">💬 Expressão: "{item.expression}"</h3>
                <p className="text-xs text-slate-200">
                  🎯 <strong>O que realmente significa:</strong> {item.literalMeaning}
                </p>
                <p className="text-xs text-slate-400 italic">
                  💡 <strong>Nota:</strong> {item.avoid}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
