import React, { useState } from "react";
import { BookOpen, Search, Sparkles, CheckCircle2, HelpCircle, Printer, Building2, Phone, Mail, MapPin, FileText, Download } from "lucide-react";
import { EDUCATION_ARTICLES, MYTHS_AND_FACTS } from "../data/education";

export const EducationHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  const categories = [
    { id: "todos", label: "Todos os Artigos" },
    { id: "direitos", label: "Direitos & Leis (CIPTEA / 12.764)" },
    { id: "educacao", label: "Educação & PEI" },
    { id: "comunicacao", label: "Comunicação & CAA" },
    { id: "conceito", label: "Conceitos & Autorregulação" },
  ];

  const filteredArticles = EDUCATION_ARTICLES.filter((a) => {
    const matchesSearch =
      a.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.shortDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.fullExplanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "todos" || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handlePrintPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const articlesHtml = filteredArticles.map(art => `
      <div style="margin-bottom: 24px; padding: 18px; border: 1px solid #cbd5e1; border-radius: 12px; page-break-inside: avoid; background-color: #f8fafc;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-family: sans-serif;">${art.term}</h3>
          <span style="font-size: 11px; font-weight: bold; background-color: #0d9488; color: white; padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">${art.category}</span>
        </div>
        <p style="margin: 6px 0; font-size: 14px; font-weight: 600; color: #334155;">${art.shortDefinition}</p>
        <p style="margin: 10px 0; font-size: 13px; color: #475569; line-height: 1.6;">${art.fullExplanation}</p>
        ${art.practicalTips ? `
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #cbd5e1;">
            <strong style="font-size: 12px; color: #0d9488; text-transform: uppercase;">Estratégias Práticas:</strong>
            <ul style="margin: 6px 0 0 18px; padding: 0; font-size: 13px; color: #334155;">
              ${art.practicalTips.map(t => `<li style="margin-bottom: 4px;">${t}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
      </div>
    `).join("");

    const mythsHtml = MYTHS_AND_FACTS.map(m => `
      <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; page-break-inside: avoid;">
        <p style="margin: 0 0 6px 0; color: #991b1b; font-size: 13px;"><strong>❌ MITO:</strong> ${m.myth}</p>
        <p style="margin: 0; color: #065f46; font-size: 13px;"><strong>✅ ${m.fact}</strong></p>
      </div>
    `).join("");

    const dateStr = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Biblioteca NeuroConecta - SISTEMASTOP</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #0f172a; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 24px; }
            .brand { display: flex; align-items: center; gap: 12px; }
            .brand-text h1 { margin: 0; font-size: 22px; color: #0f172a; }
            .brand-text p { margin: 2px 0 0 0; font-size: 12px; color: #0d9488; font-weight: bold; }
            .company-info { text-align: right; font-size: 11px; color: #64748b; line-height: 1.4; }
            .section-title { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 24px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; text-align: center; font-size: 11px; color: #64748b; }
            @media print {
              body { margin: 15mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">
              <div class="brand-text">
                <h1>NeuroConecta • Guia da Biblioteca</h1>
                <p>Desenvolvido por SISTEMASTOP Soluções Tecnológicas</p>
              </div>
            </div>
            <div class="company-info">
              <strong>SISTEMASTOP</strong><br/>
              Rua Doutor Rolim, 366 - Bairro Independência, Crato - CE<br/>
              CEP: 63.119-060 | Tel/WhatsApp: +55 (88) 99673-9128<br/>
              contato@sistemastop.com.br
            </div>
          </div>

          <div style="margin-bottom: 20px; font-size: 12px; color: #475569;">
            Documento gerado em <strong>${dateStr}</strong> contendo guia oficial de conceitos, direitos e suporte neuroafirmativo.
          </div>

          <div class="section-title">📚 Conceitos, Direitos e Guias Neuroafirmativos</div>
          ${articlesHtml}

          <div class="section-title" style="margin-top: 32px;">💡 Desmistificando Mitos sobre Autismo e Neurodivergência</div>
          ${mythsHtml}

          <div class="footer">
            SISTEMASTOP Soluções Tecnológicas • Rua Doutor Rolim, 366, Crato - CE • +55 (88) 99673-9128 • contato@sistemastop.com.br
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Biblioteca & Direitos Neuroafirmativos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Guia completo de conceitos, Leis (Berenice Piana, CIPTEA), acomodações escolares e estratégias práticas explicadas de forma clara e acessível.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Print PDF Button */}
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-teal-950/50"
            title="Imprimir ou salvar a biblioteca completa em PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir PDF Completo</span>
          </button>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por termo ou lei..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedCategory === cat.id
                ? "bg-teal-600 text-white border-teal-500 shadow"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Artigos e Orientações ({filteredArticles.length})
          </h2>
          <span className="text-xs text-slate-500">Formato pronto para impressão</span>
        </div>

        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
              Nenhum termo encontrado para &quot;{searchTerm}&quot;. Tente buscar por lei, CIPTEA, PEI ou conceito.
            </div>
          ) : (
            filteredArticles.map((art) => (
              <div
                key={art.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-md hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-teal-200">{art.term}</h3>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-950 px-2.5 py-0.5 rounded-md border border-teal-800">
                    {art.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
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
            ))
          )}
        </div>
      </div>

      {/* Myths vs Facts */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
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

      {/* Company Contact Card Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-800/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img src="/sistemastop_logo.svg" alt="SISTEMASTOP Logo" className="w-14 h-14 object-contain rounded-xl p-1 bg-slate-950 border border-emerald-800" />
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white">SISTEMASTOP • Soluções Tecnológicas</h3>
            <p className="text-xs text-slate-300">
              Rua Doutor Rolim, 366 - Bairro Independência, Crato - CE, CEP 63.119-060
            </p>
            <p className="text-xs text-emerald-400 font-semibold">
              📞 +55 (88) 99673-9128 (WhatsApp) | ✉️ contato@sistemastop.com.br
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintPdf}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition whitespace-nowrap shadow-md shadow-emerald-950/50"
        >
          <Printer className="w-4 h-4" /> Baixar PDF para Impressão
        </button>
      </div>

    </div>
  );
};
