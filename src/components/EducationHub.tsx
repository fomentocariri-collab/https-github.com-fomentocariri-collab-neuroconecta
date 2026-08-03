import React, { useState } from "react";
import { BookOpen, Search, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";
import { EDUCATION_ARTICLES, MYTHS_AND_FACTS } from "../data/education";

export const EducationHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  const filteredArticles = EDUCATION_ARTICLES.filter((a) => {
    const matchesSearch =
      a.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.shortDefinition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "todos" || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            Biblioteca & Empoderamento Neuroafirmativo
          </h1>
          <p className="text-sm text-slate-400">
            Conceitos do universo autista explicados sem jargões médicos pesados.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar conceito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Glossary Articles */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          Conceitos Fundamentais
        </h2>

        <div className="space-y-4">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-teal-200">{art.term}</h3>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                  {art.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {art.shortDefinition}
              </p>

              <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                {art.fullExplanation}
              </div>

              {art.practicalTips && art.practicalTips.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Estratégias Práticas:</h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {art.practicalTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Myths vs Facts */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          Desmistificando Mitos Comuns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MYTHS_AND_FACTS.map((item, idx) => (
            <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-md">
              <div className="p-3 bg-rose-950/60 border border-rose-800/50 rounded-xl text-xs text-rose-200">
                <strong>❌ MITO:</strong> {item.myth}
              </div>
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-xl text-xs text-emerald-200">
                <strong>✅ {item.fact}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
