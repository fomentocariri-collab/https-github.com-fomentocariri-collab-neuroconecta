import React, { useState } from "react";
import { Users, Heart, BookOpen, Lightbulb, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { CAREGIVER_GUIDE } from "../data/caregiverData";
import { CaregiverGuideItem, SupportLevel } from "../types";

interface CaregiverHubProps {
  currentSupportLevel?: SupportLevel;
  userName?: string;
}

export const CaregiverHub: React.FC<CaregiverHubProps> = ({
  currentSupportLevel = 2,
  userName = "Pessoa em Apoio",
}) => {
  const [activeCategory, setActiveCategory] = useState<CaregiverGuideItem["category"]>("meltdown_shutdown");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("todos");

  // Observation Logs state
  const [logs, setLogs] = useState<{ id: string; date: string; note: string; tag: string }[]>(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_caregiver_logs");
      return stored ? JSON.parse(stored) : [
        {
          id: "log-1",
          date: new Date().toLocaleDateString("pt-BR"),
          note: "Ótima resposta à rotina visual matinal de café e hidratação.",
          tag: "Vitória",
        },
      ];
    } catch {
      return [];
    }
  });

  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState("Observação");

  const handleAddLog = () => {
    if (!newNote.trim()) return;
    const newEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString("pt-BR"),
      note: newNote.trim(),
      tag: newTag,
    };
    const updated = [newEntry, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem("neuroconecta_caregiver_logs", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setNewNote("");
  };

  const filteredGuides = CAREGIVER_GUIDE.filter((g) => {
    const categoryMatch = g.category === activeCategory;
    if (selectedLevelFilter === "todos") return categoryMatch;
    return categoryMatch && (g.levelTarget === "Todos" || g.levelTarget.includes(selectedLevelFilter));
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 text-xs font-bold">
              Modo Cuidador & Familiar
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            Guia de Apoio para Pais, Familiares e Cuidadores
          </h1>
          <p className="text-sm text-slate-400">
            Estratégias práticas, validadas e neuroafirmativas para acolher {userName} com respeito à autonomia e previsibilidade.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-1 text-slate-300">
          <p className="font-semibold text-teal-400 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-teal-400" /> Nível de Suporte Registrado:
          </p>
          <p className="text-sm font-bold text-slate-100">
            {currentSupportLevel === 1 && "Nível 1 (Apoio leve)"}
            {currentSupportLevel === 2 && "Nível 2 (Apoio substancial)"}
            {currentSupportLevel === 3 && "Nível 3 (Apoio muito substancial)"}
            {(!currentSupportLevel || (currentSupportLevel as any) === "nao_especificado") && "Em avaliação / Não especificado"}
          </p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          {/* Categories */}
          <div className="flex overflow-x-auto no-scrollbar gap-2">
            {[
              { id: "meltdown_shutdown", label: "🛡️ Crises & Desligamento" },
              { id: "rotina_sensorial", label: "🌱 Rotina & Sensorial" },
              { id: "escola_trabalho", label: "📚 Escola & Trabalho" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeCategory === cat.id
                    ? "bg-teal-950 text-teal-200 border border-teal-700"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-transparent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filtrar por Nível:</span>
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
            >
              <option value="todos">Todos os Níveis</option>
              <option value="1">Nível 1</option>
              <option value="2">Nível 2</option>
              <option value="3">Nível 3</option>
            </select>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-4 shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  {guide.situation}
                </h3>
                <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-950 border border-teal-800/80 px-2 py-0.5 rounded-full flex-shrink-0">
                  {guide.levelTarget}
                </span>
              </div>

              {/* What to do */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> O que fazer (Ações Recomendadas):
                </p>
                <ul className="space-y-1 text-xs text-slate-200">
                  {guide.whatToDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to avoid */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  ⚠️ O que evitar:
                </p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {guide.whatToAvoid.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phrases to use */}
              {guide.phrasesToUse && guide.phrasesToUse.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Frases Calmas de Acolhimento:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {guide.phrasesToUse.map((phrase, idx) => (
                      <span
                        key={idx}
                        className="text-xs italic bg-slate-950 text-teal-200 border border-teal-900/60 px-2.5 py-1 rounded-lg"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Observation & Progress Journal for Caregivers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-lg">Diário de Observações do Cuidador</h3>
        </div>
        <p className="text-xs text-slate-400">
          Registre momentos marcantes, gatilhos identificados ou pequenas vitórias do dia a dia para compartilhar com a equipe terapêutica.
        </p>

        {/* Add log form */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Anotação de hoje (Ex: 'Teve um dia muito calmo com o fone de ouvido na escola')..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="sm:col-span-2 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100"
          />
          <select
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100"
          >
            <option value="Vitória">🎉 Vitória / Progresso</option>
            <option value="Gatilho">⚠️ Gatilho Identificado</option>
            <option value="Sensorial">🎧 Resposta Sensorial</option>
            <option value="Observação">📝 Observação Geral</option>
          </select>
          <button
            onClick={handleAddLog}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-4 h-4" /> Registrar
          </button>
        </div>

        {/* Logs List */}
        <div className="space-y-2 pt-2">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">{log.date}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 text-[10px] font-semibold">
                    {log.tag}
                  </span>
                </div>
                <p className="text-slate-200">{log.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
