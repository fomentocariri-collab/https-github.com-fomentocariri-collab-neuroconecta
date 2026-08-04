import React, { useState } from "react";
import { 
  Users, 
  Heart, 
  BookOpen, 
  Lightbulb, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  School,
  Sparkles,
  MessageSquare
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"cuidador" | "pei" | "escola">("cuidador");

  const [activeCategory, setActiveCategory] = useState<CaregiverGuideItem["category"]>("meltdown_shutdown");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("todos");

  // --- PEI (Plano de Ensino Individualizado) Form State ---
  const [peiStudentName, setPeiStudentName] = useState(userName || "Aluno(a)");
  const [peiSchool, setPeiSchool] = useState("Escola Municipal / Colégio");
  const [peiGrade, setPeiGrade] = useState("5º Ano do Ensino Fundamental");
  const [peiTeacher, setPeiTeacher] = useState("Prof. Especialista / AEE");
  const [peiDiagnoses, setPeiDiagnoses] = useState("TEA Nível 2 de Suporte + TDAH");
  const [peiSensoryNeeds, setPeiSensoryNeeds] = useState("Sensibilidade auditiva a barulho alto; necessita uso de fone abafador no recreio e em aulas barulhentas.");
  const [peiAccommodations, setPeiAccommodations] = useState<string[]>([
    "Tempo adicional (50% a mais) em provas e trabalhos",
    "Apresentação de instruções escritas e fracionadas no quadro",
    "Permissão para pausas de autorregulação no Cantinho da Calma",
    "Uso liberado de fones de ouvido para abafamento de ruído",
    "Provas adaptadas com imagens de apoio e enunciados diretos",
  ]);
  const [peiNewAccommodation, setPeiNewAccommodation] = useState("");
  const [peiGoals, setPeiGoals] = useState("1. Desenvolver autonomia no início de tarefas escritas.\n2. Reduzir ansiedade de transição entre disciplinas com quadro visual.\n3. Ampliar interação em pequenos grupos em duplas de apoio.");
  
  const [copiedPei, setCopiedPei] = useState(false);

  // --- Observation Logs state ---
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

  const handleAddAccommodation = () => {
    if (!peiNewAccommodation.trim()) return;
    setPeiAccommodations([...peiAccommodations, peiNewAccommodation.trim()]);
    setPeiNewAccommodation("");
  };

  const handleRemoveAccommodation = (idx: number) => {
    setPeiAccommodations(peiAccommodations.filter((_, i) => i !== idx));
  };

  const generateFormattedPeiText = () => {
    return `=====================================================
PLANO DE ENSINO INDIVIDUALIZADO (PEI)
NEUROCONECTA - SUPORTE À EDUCAÇÃO ESPECIAL & AEE
=====================================================

1. DADOS DE IDENTIFICAÇÃO DO ALUNO(A)
• Nome do Aluno: ${peiStudentName}
• Escola/Instituição: ${peiSchool}
• Ano/Série: ${peiGrade}
• Responsável / Educador AEE: ${peiTeacher}
• Perfil / Diagnóstico: ${peiDiagnoses}

2. NECESSIDADES E PERFIL SENSORIAL
${peiSensoryNeeds}

3. ACOMODAÇÕES CURRICULARES E TECNOLOGIAS ASSISTIVAS
${peiAccommodations.map((a, i) => `${i + 1}. ${a}`).join("\n")}

4. METAS PEDAGÓGICAS E DE DESENVOLVIMENTO
${peiGoals}

=====================================================
Documento gerado em: ${new Date().toLocaleDateString("pt-BR")} via NeuroConecta
=====================================================`;
  };

  const handleCopyPei = () => {
    const text = generateFormattedPeiText();
    navigator.clipboard.writeText(text);
    setCopiedPei(true);
    setTimeout(() => setCopiedPei(false), 2000);
  };

  const handlePrintPei = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: monospace; font-size: 14px; padding: 20px;">${generateFormattedPeiText()}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 text-xs font-bold">
              Modo Cuidadores, Pais & Educadores Especiais
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-teal-400" />
            Portal de Apoio Familiar & Educação Especial (PEI)
          </h1>
          <p className="text-sm text-slate-400">
            Ferramentas para elaboração do PEI (Plano de Ensino Individualizado), adaptações escolares e manejo neuroafirmativo de {userName}.
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

      {/* Main Mode Subtabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("cuidador")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
            activeTab === "cuidador"
              ? "bg-teal-600 text-white shadow-md"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <Users className="w-4 h-4 text-teal-300" />
          <span>Guia para Pais & Cuidadores</span>
        </button>

        <button
          onClick={() => setActiveTab("pei")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
            activeTab === "pei"
              ? "bg-teal-600 text-white shadow-md"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Gerador de PEI (Educação Especial)</span>
        </button>

        <button
          onClick={() => setActiveTab("escola")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
            activeTab === "escola"
              ? "bg-teal-600 text-white shadow-md"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <School className="w-4 h-4 text-cyan-400" />
          <span>Comunicação Escola-Família</span>
        </button>
      </div>

      {/* TAB 1: PAIS & CUIDADORES */}
      {activeTab === "cuidador" && (
        <div className="space-y-8 animate-fadeIn">
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

          {/* Observation Journal */}
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
                placeholder="Anotação de hoje..."
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
      )}

      {/* TAB 2: GERADOR DE PEI */}
      {activeTab === "pei" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
                Educação Especial Inclusiva (AEE)
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">
                Plano de Ensino Individualizado (PEI)
              </h2>
              <p className="text-xs text-slate-400">
                Estruture e exporte o documento oficial de acomodações para a escola do aluno.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPei}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                {copiedPei ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPei ? "Copiado!" : "Copiar Texto Formatado"}</span>
              </button>

              <button
                onClick={handlePrintPei}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Nome do Aluno(a):</label>
              <input
                type="text"
                value={peiStudentName}
                onChange={(e) => setPeiStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Escola / Colégio:</label>
              <input
                type="text"
                value={peiSchool}
                onChange={(e) => setPeiSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Ano / Série:</label>
              <input
                type="text"
                value={peiGrade}
                onChange={(e) => setPeiGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Professor AEE / Especialista:</label>
              <input
                type="text"
                value={peiTeacher}
                onChange={(e) => setPeiTeacher(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Perfil Diagnóstico e Apoio:</label>
            <input
              type="text"
              value={peiDiagnoses}
              onChange={(e) => setPeiDiagnoses(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Necessidades e Perfil Sensorial na Escola:</label>
            <textarea
              rows={2}
              value={peiSensoryNeeds}
              onChange={(e) => setPeiSensoryNeeds(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
          </div>

          {/* Accommodations List */}
          <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Acomodações Curriculares Registradas:
            </h3>

            <div className="space-y-2">
              {peiAccommodations.map((acc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200">
                  <span>• {acc}</span>
                  <button
                    onClick={() => handleRemoveAccommodation(idx)}
                    className="text-rose-400 hover:text-rose-300 font-bold text-[10px] px-2 py-1 bg-rose-950/60 rounded-md"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Adicionar nova acomodação escolar (Ex: 'Uso de gravador ou tablet')..."
                value={peiNewAccommodation}
                onChange={(e) => setPeiNewAccommodation(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
              <button
                onClick={handleAddAccommodation}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
              >
                Adicionar
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Metas Pedagógicas e de Desenvolvimento Social:</label>
            <textarea
              rows={3}
              value={peiGoals}
              onChange={(e) => setPeiGoals(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
          </div>
        </div>
      )}

      {/* TAB 3: COMUNICAÇÃO ESCOLA-FAMÍLIA */}
      {activeTab === "escola" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="space-y-1 border-b border-slate-800 pb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold">
              Diário de Bordo & Parceria Pedagógica
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Guia de Comunicação Escola-Família & Protocolo de Sala
            </h2>
            <p className="text-xs text-slate-400">
              Diretrizes para professores de sala comum e estagiários de apoio pedagógico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="font-bold text-teal-300 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                Dicas para o Professor de Sala Comum
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>• <strong>Instruções Claras:</strong> Divida tarefas longas em passos numerados no quadro.</li>
                <li>• <strong>Antecipação de Transições:</strong> Avise 5 minutos antes de trocar de atividade ou ir para o recreio.</li>
                <li>• <strong>Sensibilidade Sonora:</strong> Evite palmas repentinas ao lado da mesa do aluno. Pode-se usar gestos visuais de apoio.</li>
                <li>• <strong>Dupla de Parceria:</strong> Posicione o aluno ao lado de um colega acolhedor e calmo.</li>
              </ul>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Protocolo de Desescalada em Crise Escolar
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>• <strong>Garanta a Segurança:</strong> Afaste o público e diminua a luminosidade/som da sala.</li>
                <li>• <strong>Reduza a Fala:</strong> Não faça perguntas complexas durante a crise. Use frase curta: "Você está seguro".</li>
                <li>• <strong>Acesso ao Cantinho da Calma:</strong> Ofereça o fone abafador e espaço de descanso sem punição.</li>
                <li>• <strong>Comunicação aos Pais:</strong> Registre os fatos sem tom acusatório ou punitivo no diário.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

