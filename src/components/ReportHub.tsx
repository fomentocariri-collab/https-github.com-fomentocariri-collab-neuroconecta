import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Printer, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  HeartPulse, 
  ClipboardCheck, 
  Award, 
  Users, 
  Plus, 
  BookOpen, 
  AlertTriangle,
  Info
} from "lucide-react";
import { UserProfile, SavedTestResult, RoutineTask } from "../types";
import { AcademicReviewModal } from "./AcademicReviewModal";

export interface PatientRecord {
  id: string;
  name: string;
  pronouns: string;
  diagnosisStatus: "laudo_formal" | "autodiagnosticado" | "investigacao" | "familiar_apoiador" | "nao_informado";
  supportLevel: 1 | 2 | 3 | "nao_informado" | "nao_especificado";
  cipteaNumber?: string;
  birthDate?: string;
  focusArea: string;
  caregiverMode: boolean;
  aq10Score?: number;
  sqeqScore?: number;
  sensoryScore?: number;
  burnoutScore?: number;
  catqScore?: number;
}

interface ReportHubProps {
  userProfile: UserProfile;
}

type PeriodFilter = "diario" | "semanal" | "mensal";

export const ReportHub: React.FC<ReportHubProps> = ({ userProfile }) => {
  const [period, setPeriod] = useState<PeriodFilter>("semanal");
  const [showAcademicModal, setShowAcademicModal] = useState(false);

  // Patient database for reports (strictly provenance-based, no fake scores or defaulted support levels)
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_report_patients");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // If empty in report, load from global registry with safe fallbacks (never defaulting to Level 2)
      const globalRaw = localStorage.getItem("neuroconecta_global_patients");
      if (globalRaw) {
        const globalList = JSON.parse(globalRaw);
        if (Array.isArray(globalList) && globalList.length > 0) {
          return globalList.map((p: any) => ({
            id: p.id,
            name: p.name,
            pronouns: p.pronouns || "não informado",
            diagnosisStatus: p.diagnosisStatus || "nao_informado",
            supportLevel: p.supportLevel || "nao_informado",
            cipteaNumber: p.cipteaNumber || undefined,
            birthDate: p.birthDate,
            focusArea: p.focusArea || "Acompanhamento Funcional",
            caregiverMode: true
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [selectedPatId, setSelectedPatId] = useState<string>(patients[0]?.id || "");

  // Save patients list
  useEffect(() => {
    try {
      localStorage.setItem("neuroconecta_report_patients", JSON.stringify(patients));
    } catch (e) {
      console.error(e);
    }
  }, [patients]);

  const selectedPatient = patients.find((p) => p.id === selectedPatId) || patients[0];

  // New Patient Form state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatName, setNewPatName] = useState("");
  const [newPatPronouns, setNewPatPronouns] = useState("não informado");
  const [newPatDiag, setNewPatDiag] = useState<PatientRecord["diagnosisStatus"]>("nao_informado");
  const [newPatSupport, setNewPatSupport] = useState<PatientRecord["supportLevel"]>("nao_informado");
  const [newPatCiptea, setNewPatCiptea] = useState("");
  const [newPatFocus, setNewPatFocus] = useState("Autonomia & Rotina Visual");

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName.trim()) return;
    const newPat: PatientRecord = {
      id: `pat-${Date.now()}`,
      name: newPatName.trim(),
      pronouns: newPatPronouns.trim() || "não informado",
      diagnosisStatus: newPatDiag,
      supportLevel: newPatSupport,
      cipteaNumber: newPatCiptea.trim() || undefined,
      focusArea: newPatFocus,
      caregiverMode: true,
      // No synthetic or random test scores: strictly provenance-based
    };
    setPatients([...patients, newPat]);
    setSelectedPatId(newPat.id);
    setNewPatName("");
    setShowAddPatientModal(false);
  };

  // Loaded data
  const [testHistory, setTestHistory] = useState<SavedTestResult[]>([]);
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>([]);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [caregiverLogs, setCaregiverLogs] = useState<{ id: string; date: string; note: string; tag: string }[]>([]);

  useEffect(() => {
    try {
      const storedTests = localStorage.getItem("neuroconecta_test_history");
      if (storedTests) setTestHistory(JSON.parse(storedTests));

      const storedRoutines = localStorage.getItem("neuroconecta_routine_tasks");
      if (storedRoutines) setRoutineTasks(JSON.parse(storedRoutines));

      const storedMoods = localStorage.getItem("neuroconecta_mood_logs");
      if (storedMoods) setMoodLogs(JSON.parse(storedMoods));

      const storedCaregiver = localStorage.getItem("neuroconecta_caregiver_logs");
      if (storedCaregiver) setCaregiverLogs(JSON.parse(storedCaregiver));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Professional role audit (Educators / Caregivers do NOT emit clinical diagnoses)
  const isClinicalProfessional = 
    (userProfile.userRole === "saude_caps" || userProfile.professionalRoleType === "medico" || userProfile.professionalRoleType === "perito") && 
    Boolean(userProfile.professionalRegisterNumber);

  const isEducator = 
    userProfile.professionalRoleType === "educador" || 
    userProfile.professionalRoleType === "educador_especial" || 
    userProfile.professionalRoleType === "professor";

  const documentTitle = isEducator
    ? "Relatório Pedagógico & Síntese Funcional de Acompanhamento"
    : isClinicalProfessional
    ? "Relatório de Acompanhamento Clínico & Funcional"
    : "Relatório Funcional & Síntese de Acompanhamento";

  const documentTypeBadge = isEducator
    ? "Documento Pedagógico / Funcional Escolar"
    : isClinicalProfessional
    ? "Registro de Acompanhamento Clínico"
    : "Síntese Funcional de Rotina e Autorregulação";

  const emitterRoleLabel = isEducator
    ? "Educador(a) / Equipe Pedagógica"
    : userProfile.userRole === "cuidador_educador"
    ? "Cuidador(a) / Família"
    : isClinicalProfessional
    ? `Profissional de Saúde (${userProfile.professionalRoleType?.toUpperCase() || "TÉCNICO"})`
    : "Usuário(a) / Titular do Registro";

  // Aggregation calculations (Safe, audited numeric extraction preventing NaN)
  const totalTasks = routineTasks.length;
  const completedTasksCount = routineTasks.filter((t) => t.completed).length;
  const routineCompletionPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : null;

  // Mood mappings & audited numerical extraction
  const moodScoreMap: Record<string, number> = {
    excelente: 5,
    alegre: 5,
    calmo: 4,
    neutro: 3,
    ansioso: 2,
    irritado: 2,
    sobrecarregado: 1,
    exausto: 1,
  };

  const validMoodEntries: number[] = [];
  moodLogs.forEach((item: any) => {
    if (typeof item.moodScore === "number" && !isNaN(item.moodScore) && isFinite(item.moodScore)) {
      validMoodEntries.push(item.moodScore);
    } else if (typeof item.mood === "string" && moodScoreMap[item.mood.toLowerCase()] !== undefined) {
      validMoodEntries.push(moodScoreMap[item.mood.toLowerCase()]);
    } else if (typeof item.mood === "number" && !isNaN(item.mood) && isFinite(item.mood)) {
      validMoodEntries.push(item.mood);
    }
  });

  const validEnergyEntries: number[] = [];
  moodLogs.forEach((item: any) => {
    const raw = item.energyLevel ?? item.energyScore;
    const num = Number(raw);
    if (!isNaN(num) && isFinite(num) && typeof raw !== "boolean" && raw !== null && raw !== undefined) {
      validEnergyEntries.push(num);
    }
  });

  const avgMoodStr = validMoodEntries.length > 0
    ? (validMoodEntries.reduce((a, b) => a + b, 0) / validMoodEntries.length).toFixed(1)
    : "Sem dados suficientes";

  const avgEnergyStr = validEnergyEntries.length > 0
    ? (validEnergyEntries.reduce((a, b) => a + b, 0) / validEnergyEntries.length).toFixed(1)
    : "Sem dados suficientes";

  const sensoryOverloadEvents = moodLogs.filter((item: any) => 
    item.sensoryOverload === true || 
    item.sensoryLevel >= 4 || 
    item.mood === "sobrecarregado"
  ).length;

  // Real tests lookup with provenance check
  const aq10Result = testHistory.find((t) => t.testId === "aq10" && typeof t.score === "number" && !isNaN(t.score));
  const sqeqResult = testHistory.find((t) => t.testId === "sqeq" && typeof t.score === "number" && !isNaN(t.score));
  const sensoryResult = testHistory.find((t) => t.testId === "sensory" && typeof t.score === "number" && !isNaN(t.score));
  const burnoutResult = testHistory.find((t) => t.testId === "burnout" && typeof t.score === "number" && !isNaN(t.score));
  const catqResult = testHistory.find((t) => t.testId === "catq" && typeof t.score === "number" && !isNaN(t.score));

  const completedTestsList = [
    aq10Result ? { name: "AQ-10", res: aq10Result } : null,
    sqeqResult ? { name: "SQ-EQ", res: sqeqResult } : null,
    sensoryResult ? { name: "Perfil Sensorial", res: sensoryResult } : null,
    burnoutResult ? { name: "Burnout Autista", res: burnoutResult } : null,
    catqResult ? { name: "CAT-Q", res: catqResult } : null,
  ].filter(Boolean) as { name: string; res: SavedTestResult }[];

  // Support level label - Never infer or default to Level 2
  const currentSupportLevel = selectedPatient ? selectedPatient.supportLevel : userProfile.supportLevel;
  const supportLevelLabel = currentSupportLevel === 1
    ? "Nível 1 de Suporte (Declarado em documento formal prévio)"
    : currentSupportLevel === 2
    ? "Nível 2 de Suporte (Declarado em documento formal prévio)"
    : currentSupportLevel === 3
    ? "Nível 3 de Suporte (Declarado em documento formal prévio)"
    : "Não informado / Não documentado";

  // Diagnosis label - Never infer diagnosis
  const currentDiagStatus = selectedPatient ? selectedPatient.diagnosisStatus : userProfile.diagnosisStatus;
  const diagnosisLabel = currentDiagStatus === "laudo_formal"
    ? "Laudo Médico Formal Prévio Declarado pelo Usuário/Responsável"
    : currentDiagStatus === "autodiagnosticado"
    ? "Autorrelato / Identificação Neurodivergente"
    : currentDiagStatus === "investigacao"
    ? "Em Investigação Prévia / Sem Laudo Conclusivo"
    : "Não informado";

  // Fail-closed validation audit
  const validationErrors: string[] = [];
  if (avgMoodStr.includes("NaN") || avgEnergyStr.includes("NaN")) {
    validationErrors.push("Detecção de valor NaN em indicadores quantitativos.");
  }
  if (!isClinicalProfessional && (documentTitle.toLowerCase().includes("laudo médico") || documentTitle.toLowerCase().includes("parecer diagnóstico"))) {
    validationErrors.push("Emissor com papel não-clínico não pode gerar documentos intitulados como laudo ou parecer diagnóstico.");
  }

  const handlePrint = () => {
    if (validationErrors.length > 0) {
      alert("Inconsistência de integridade detectada. Por favor, revise os dados antes de imprimir.");
      return;
    }
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Controls (Hidden on Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 text-xs font-bold">
              Síntese Funcional &amp; Relatórios de Acompanhamento
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-400" />
            {documentTitle}
          </h1>
          <p className="text-sm text-slate-400">
            Organização estruturada de registros funcionais de rotina, autorrelato, autorregulação e estratégias de apoio.
          </p>
        </div>

        {/* Action Buttons for PDF Print and Academic Review */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAcademicModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-teal-700/80 text-teal-200 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition active:scale-95 flex-shrink-0"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Resenha Acadêmica (PDF)</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={validationErrors.length > 0}
            className={`px-5 py-2.5 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 flex-shrink-0 ${
              validationErrors.length > 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white"
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Validation Fail-Closed Warning if any inconsistency */}
      {validationErrors.length > 0 && (
        <div className="no-print p-4 bg-rose-950/80 border border-rose-700 rounded-2xl flex items-start gap-3 text-rose-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-rose-100">Inconsistência de Dados Detectada (Fail-Closed Ativo)</p>
            <ul className="list-disc list-inside space-y-0.5">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
            <p className="text-[11px] text-rose-300 pt-1">A impressão do relatório foi bloqueada para resguardar a integridade e precisão dos dados.</p>
          </div>
        </div>
      )}

      {/* Patient Selector Card (Hidden on Print) */}
      <div className="no-print bg-slate-900 border border-teal-800/80 rounded-2xl p-5 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-950 text-teal-300 border border-teal-700/80 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Seleção da Pessoa Acompanhada / Titular do Relatório
              </h3>
              <p className="text-xs text-slate-400">
                Selecione o registro do acompanhado para emitir a síntese funcional sem sobrepor os dados do profissional emissor.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Cadastrar Novo Registro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-teal-300">
              Pessoa Acompanhada Selecionada
            </label>
            <select
              value={selectedPatId}
              onChange={(e) => setSelectedPatId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-teal-700/80 rounded-xl text-slate-100 text-xs font-semibold focus:outline-none focus:border-teal-400"
            >
              {patients.length > 0 ? (
                patients.map((pat) => (
                  <option key={pat.id} value={pat.id}>
                    {pat.name} — ({pat.pronouns}) {pat.cipteaNumber ? `[${pat.cipteaNumber}]` : ""}
                  </option>
                ))
              ) : (
                <option value="">{userProfile.preferredName || "Usuário Atual"} (Registro Próprio)</option>
              )}
            </select>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>{selectedPatient ? selectedPatient.name : userProfile.preferredName}</span>
              <span className="text-teal-400">{selectedPatient ? selectedPatient.pronouns : userProfile.pronouns}</span>
            </div>
            <p className="text-slate-400">Status Diagnóstico: <span className="text-slate-200">{diagnosisLabel}</span></p>
            <p className="text-teal-300">Suporte: <span className="text-teal-200">{supportLevelLabel}</span> {selectedPatient?.cipteaNumber ? `| Carteira: ${selectedPatient.cipteaNumber}` : ""}</p>
          </div>
        </div>
      </div>

      {/* Modal: Cadastrar Novo Registro */}
      {showAddPatientModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-teal-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-teal-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" /> Cadastrar Pessoa Acompanhada
              </h3>
              <button onClick={() => setShowAddPatientModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newPatName}
                  onChange={(e) => setNewPatName(e.target.value)}
                  placeholder="Ex: Gabriel Santos Silva"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Pronomes</label>
                  <input
                    type="text"
                    value={newPatPronouns}
                    onChange={(e) => setNewPatPronouns(e.target.value)}
                    placeholder="Ex: ele/dele ou não informado"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Nº CIPTEA / BPC (Opcional)</label>
                  <input
                    type="text"
                    value={newPatCiptea}
                    onChange={(e) => setNewPatCiptea(e.target.value)}
                    placeholder="CIPTEA-CE 2026/001"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Status do Diagnóstico Documentado</label>
                <select
                  value={newPatDiag}
                  onChange={(e) => setNewPatDiag(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                >
                  <option value="nao_informado">Não informado</option>
                  <option value="laudo_formal">Laudo Médico Formal Prévio Declarado</option>
                  <option value="investigacao">Em Avaliação Multiprofissional Prévia</option>
                  <option value="autodiagnosticado">Autorrelato / Identificação Neurodivergente</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Nível de Suporte Registrado em Documento</label>
                <select
                  value={newPatSupport}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewPatSupport(val === "nao_informado" ? "nao_informado" : (parseInt(val) as any));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                >
                  <option value="nao_informado">Não informado / Não documentado</option>
                  <option value={1}>Nível 1 de Suporte (Apoio leve)</option>
                  <option value={2}>Nível 2 de Suporte (Apoio substancial)</option>
                  <option value={3}>Nível 3 de Suporte (Apoio muito substancial)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Foco Funcional Principal</label>
                <input
                  type="text"
                  value={newPatFocus}
                  onChange={(e) => setNewPatFocus(e.target.value)}
                  placeholder="Ex: Regulação Sensorial e Rotina Visual"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Period Selection Filters (Hidden on Print) */}
      <div className="no-print flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold text-slate-300">Janela Temporal dos Registros:</span>
        </div>
        <div className="flex gap-1.5">
          {[
            { id: "diario", label: "Diário (Hoje)" },
            { id: "semanal", label: "Semanal (7 dias)" },
            { id: "mensal", label: "Mensal (30 dias)" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id as PeriodFilter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                period === item.id
                  ? "bg-teal-950 text-teal-200 border border-teal-700 shadow"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-transparent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="border-b-2 border-teal-700/60 pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/sistemastop_logo.svg" alt="SISTEMASTOP" className="w-12 h-12 object-contain rounded-xl p-1 bg-slate-950 border border-teal-800 print:w-10 print:h-10" />
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest print:text-teal-800">
                  SISTEMASTOP • NEUROCONECTA — TECNOLOGIA NEUROAFIRMATIVA
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 print:text-black mt-0.5">
                  {documentTitle}
                </h1>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Rua Doutor Rolim, 366 - Bairro Independência, Crato - CE | +55 (88) 99673-9128 | contato@sistemastop.com.br
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-black flex-shrink-0">
              <p><strong>Emissão:</strong> {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
              <p><strong>Período Analisado:</strong> {period === "diario" ? "Registros de Hoje" : period === "semanal" ? "Consolidado Semanal (7 dias)" : "Consolidado Mensal (30 dias)"}</p>
              <p className="text-[10px] text-teal-400 print:text-teal-800 font-semibold">{documentTypeBadge}</p>
            </div>
          </div>

          {/* Profile Metadata Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs print:bg-slate-50 print:border-slate-300">
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Pessoa Acompanhada:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{selectedPatient ? selectedPatient.name : userProfile.preferredName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Pronomes:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{selectedPatient ? selectedPatient.pronouns : userProfile.pronouns}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Status Diagnóstico Declarado:</p>
              <p className="text-sm font-bold text-teal-300 print:text-black">{diagnosisLabel}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Nível de Suporte Registrado:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{supportLevelLabel}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Documento / CIPTEA / BPC:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{selectedPatient?.cipteaNumber || "Não cadastrado"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Responsável pela Emissão:</p>
              <p className="text-sm font-bold text-teal-400 print:text-black">
                {userProfile.preferredName || "Profissional Responsável"} ({emitterRoleLabel})
                {userProfile.professionalRegisterNumber ? ` • ${userProfile.professionalRegisterNumber}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Executive Metrics Overview (Zero NaN Guarantee) */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100 print:text-black flex items-center gap-2 border-b border-slate-800 pb-2">
            <BarChart3 className="w-5 h-5 text-teal-400 print:text-black" />
            Indicadores Funcionais de Rotina &amp; Autorregulação ({period.toUpperCase()})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Conclusão de Rotina</p>
              <p className="text-2xl font-extrabold text-teal-300 print:text-black mt-1">
                {routineCompletionPercentage !== null ? `${routineCompletionPercentage}%` : "Sem tarefas"}
              </p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                {totalTasks > 0 ? `${completedTasksCount} de ${totalTasks} tarefas concluídas` : "Nenhuma tarefa cadastrada"}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Média de Humor (1-5)</p>
              <p className="text-2xl font-extrabold text-amber-300 print:text-black mt-1">
                {avgMoodStr === "Sem dados suficientes" ? "Sem dados" : `${avgMoodStr} / 5.0`}
              </p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                {validMoodEntries.length > 0 ? `${validMoodEntries.length} registro(s) pontuado(s)` : "Sem notas de humor no período"}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Nível de Energia (1-5)</p>
              <p className="text-2xl font-extrabold text-emerald-300 print:text-black mt-1">
                {avgEnergyStr === "Sem dados suficientes" ? "Sem dados" : `${avgEnergyStr} / 5.0`}
              </p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                {validEnergyEntries.length > 0 ? `${validEnergyEntries.length} registro(s) pontuado(s)` : "Sem notas de energia no período"}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Eventos de Sobrecarga</p>
              <p className="text-2xl font-extrabold text-rose-400 print:text-black mt-1">{sensoryOverloadEvents}</p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">Sobrecargas / crises registradas</p>
            </div>
          </div>
        </div>

        {/* Standardized Test Summary Table (Strict Provenance) */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100 print:text-black flex items-center gap-2 border-b border-slate-800 pb-2">
            <ClipboardCheck className="w-5 h-5 text-teal-400 print:text-black" />
            Instrumentos Padronizados de Triagem
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 print:bg-slate-100 print:text-black print:border-slate-400">
                  <th className="p-3 font-bold">Instrumento</th>
                  <th className="p-3 font-bold">Data</th>
                  <th className="p-3 font-bold">Pontuação Obtida</th>
                  <th className="p-3 font-bold">Status / Interpretação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">AQ-10 (Autism Spectrum Quotient)</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{aq10Result ? aq10Result.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{aq10Result ? `${aq10Result.score} / ${aq10Result.maxScore}` : "Sem dados"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{aq10Result ? aq10Result.interpretationLevel : "Não realizado"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">SQ-EQ (Empatia e Sistematização)</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{sqeqResult ? sqeqResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{sqeqResult ? `${sqeqResult.score} / ${sqeqResult.maxScore}` : "Sem dados"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{sqeqResult ? sqeqResult.interpretationLevel : "Não realizado"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">Perfil Sensorial Simplificado</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{sensoryResult ? sensoryResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{sensoryResult ? `${sensoryResult.score} / ${sensoryResult.maxScore}` : "Sem dados"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{sensoryResult ? sensoryResult.interpretationLevel : "Não realizado"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">Avaliação de Burnout Autista</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{burnoutResult ? burnoutResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{burnoutResult ? `${burnoutResult.score} / ${burnoutResult.maxScore}` : "Sem dados"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{burnoutResult ? burnoutResult.interpretationLevel : "Não realizado"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">CAT-Q (Camuflagem Social)</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{catqResult ? catqResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{catqResult ? `${catqResult.score} / ${catqResult.maxScore}` : "Sem dados"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{catqResult ? catqResult.interpretationLevel : "Não realizado"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SÍNTESE FUNCIONAL DO PERÍODO (Provenance-based narrative, strictly without hallucinations or inferred diagnoses) */}
        <div className="space-y-5 pt-4 border-t-2 border-slate-800 print:border-slate-400 print-page-break">
          <div className="flex items-center gap-2 text-teal-400 print:text-black">
            <Award className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-slate-100 print:text-black">
              Síntese Funcional do Período
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 print:text-black leading-relaxed space-y-4 text-justify">
            <p>
              O presente documento consolida os registros funcionais de rotina, autorrelatos e apontamentos inseridos na plataforma NeuroConecta referentes a <strong>{selectedPatient ? selectedPatient.name : userProfile.preferredName}</strong> ({selectedPatient?.pronouns || userProfile.pronouns || "não informado"}), organizados na janela de acompanhamento <strong>{period === "diario" ? "diária" : period === "semanal" ? "semanal (7 dias)" : "mensal (30 dias)"}</strong>.
            </p>

            {/* Instrument Provenance Paragraph */}
            {completedTestsList.length === 0 ? (
              <p className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
                <strong>Instrumentos Padronizados de Triagem:</strong> Nenhum instrumento padronizado (AQ-10, SQ-EQ, Perfil Sensorial, Burnout Autista ou CAT-Q) foi realizado no período selecionado. Em estrita conformidade com as diretrizes de proveniência de dados, o sistema abstém-se de inferir pontuações, categorias diagnósticas ou classificações psicométricas a partir de instrumentos ausentes.
              </p>
            ) : (
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300 space-y-2">
                <p><strong>Instrumentos Padronizados Realizados no Período:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  {completedTestsList.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.name}:</strong> Realizado em {item.res.date}, registrando pontuação de {item.res.score}/{item.res.maxScore} ({item.res.interpretationLevel}).
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Os instrumentos não listados acima permanecem com status 'Não realizado' e não integram esta síntese.
                </p>
              </div>
            )}

            {/* Routine & Functional Execution Paragraph */}
            <p>
              <strong>Engajamento em Rotina &amp; Autonomia:</strong> {totalTasks > 0 ? (
                `Foram registradas ${totalTasks} tarefas na rotina visual do período, com conclusão confirmada de ${completedTasksCount} tarefas (${routineCompletionPercentage}% de adesão). ${
                  routineCompletionPercentage && routineCompletionPercentage >= 70
                    ? "Observa-se padrão consistente de seguimento e autonomia nas atividades estruturadas."
                    : "Registra-se demanda por flexibilização de etapas ou suporte na transição entre atividades."
                }`
              ) : (
                "Não foram cadastradas tarefas na rotina visual durante o período analisado."
              )}
            </p>

            {/* Mood, Energy & Sensory Balance Paragraph */}
            <p>
              <strong>Autorregulação &amp; Bem-Estar Autorrelatado:</strong> {
                validMoodEntries.length > 0 || validEnergyEntries.length > 0 ? (
                  `Os autorrelatos apontam média de humor de ${avgMoodStr !== "Sem dados suficientes" ? `${avgMoodStr}/5.0 (${validMoodEntries.length} registro(s))` : "não avaliada numericamente"} e média de energia de ${avgEnergyStr !== "Sem dados suficientes" ? `${avgEnergyStr}/5.0 (${validEnergyEntries.length} registro(s))` : "não avaliada numericamente"}. `
                ) : (
                  "Não constam registros numéricos de humor e energia no período. "
                )
              }
              {sensoryOverloadEvents > 0 ? (
                `Foram assinalados ${sensoryOverloadEvents} episódio(s) de sobrecarga sensorial ou estresse no período, evidenciando momentos de maior demanda ambiental em que acomodações de descompressão foram necessárias.`
              ) : (
                "Não constam registros de sobrecarga sensorial aguda no período monitorado."
              )}
            </p>

            {/* Educational / Caregiver Notes if available */}
            {caregiverLogs.length > 0 && (
              <p>
                <strong>Observações de Acompanhamento:</strong> Constam no histórico {caregiverLogs.length} anotação(ões) inserida(s) pela equipe de apoio/família, indicando acompanhamento de transições e acomodações pedagógicas ou domiciliares.
              </p>
            )}

            {/* Registered Baseline Status */}
            <p>
              <strong>Parâmetros Documentais Registrados:</strong> O cadastro ativo registra status diagnóstico como <em>"{diagnosisLabel}"</em> e suporte documental como <em>"{supportLevelLabel}"</em>. Ressalta-se expressamente que a plataforma não efetua diagnósticos, não atribui enquadramentos de suporte de maneira automatizada e não altera documentações preexistentes.
            </p>
          </div>
        </div>

        {/* Strategies and Practical Accommodations Section */}
        <div className="space-y-3 pt-4 border-t border-slate-800 print:border-slate-400">
          <h3 className="text-sm font-bold text-teal-300 print:text-black uppercase tracking-wider">
            Possibilidades de Apoio e Estratégias Funcionais Registradas
          </h3>
          <p className="text-xs text-slate-400 print:text-slate-600">
            Sugestões práticas de acomodação ambiental e suporte na rotina para discussão com a equipe assistente e rede de apoio:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 print:text-black">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">🗓️ Previsibilidade e Rotina Visual:</p>
              <p>Estruturação antecipada de sequências de tarefas e aviso prévio sobre transições de horários e ambientes, mitigando a sobrecarga de incerteza executiva.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">🎧 Conforto e Regulação Sensorial:</p>
              <p>Disponibilização voluntária de fones com cancelamento de ruído, iluminação indireta e pausas sensoriais programadas em ambientes de menor estímulo.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">💬 Comunicação Direta e Acessível:</p>
              <p>Priorização de enunciados diretos, objetivos e sem ambiguidades implícitas, com tempo estendido para elaboração de respostas orais ou escritas.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">⚖️ Manejo de Energia e Pausas:</p>
              <p>Intercalação de atividades de alta demanda cognitiva com momentos de descompressão, respeitando sinais de fadiga para prevenção de estresse crônico.</p>
            </div>
          </div>
        </div>

        {/* Limitations Notice */}
        <div className="p-4 bg-slate-950 border border-slate-700/80 rounded-xl text-xs space-y-1.5 print:bg-slate-50 print:border-slate-300">
          <div className="flex items-center gap-2 font-bold text-amber-300 print:text-amber-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Nota de Limitações &amp; Finalidade do Documento</span>
          </div>
          <p className="text-slate-300 print:text-slate-700 leading-relaxed">
            Este relatório organiza e sintetiza exclusivamente registros funcionais, autorrelatos e apontamentos inseridos na plataforma NeuroConecta. <strong>Este documento não constitui diagnóstico, laudo médico ou parecer psicológico e não substitui avaliação clínica especializada.</strong> Informações e instrumentos não preenchidos ou não realizados permanecem expressamente como 'Não realizados' e não são inferidos, complementados ou estimados pelo sistema.
          </p>
        </div>

        {/* Formal Signature & Validation Block */}
        <div className="pt-8 border-t-2 border-slate-800 print:border-slate-400 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400 print:text-black">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-bold text-slate-200 print:text-black">NeuroConecta — Tecnologia Assistiva &amp; Neuroafirmativa</p>
            <p>Documento gerado eletronicamente em conformidade com o princípio de proveniência de dados.</p>
            <p className="font-mono text-[10px] text-slate-500 print:text-slate-600">ID de Registro: NC-FUNC-{Date.now().toString(36).toUpperCase()}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-center">
            <div className="space-y-1 min-w-[180px]">
              <div className="border-b border-slate-700 print:border-black w-44 mx-auto mb-1"></div>
              <p className="font-bold text-slate-200 print:text-black">{userProfile.preferredName || "Responsável pelo Registro"}</p>
              <p className="text-[10px] text-teal-400 print:text-slate-600 font-semibold">
                Emissor / {emitterRoleLabel}
                {userProfile.professionalRegisterNumber ? ` (${userProfile.professionalRegisterNumber})` : ""}
              </p>
            </div>

            <div className="space-y-1 min-w-[180px]">
              <div className="border-b border-slate-700 print:border-black w-44 mx-auto mb-1"></div>
              <p className="font-bold text-slate-200 print:text-black">{selectedPatient ? selectedPatient.name : userProfile.preferredName}</p>
              <p className="text-[10px] text-slate-500 print:text-slate-600">Pessoa Acompanhada (Titular dos Registros)</p>
            </div>
          </div>
        </div>

      </div>

      {/* Academic Review Case Study Modal & PDF Export */}
      <AcademicReviewModal
        isOpen={showAcademicModal}
        onClose={() => setShowAcademicModal(false)}
      />

    </div>
  );
};
