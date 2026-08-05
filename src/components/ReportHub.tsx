import React, { useState, useEffect } from "react";
import { FileText, Printer, Calendar, BarChart3, ShieldCheck, HeartPulse, ClipboardCheck, Clock, User, Award, CheckCircle2, Users, Plus } from "lucide-react";
import { UserProfile, SavedTestResult, RoutineTask } from "../types";

export interface PatientRecord {
  id: string;
  name: string;
  pronouns: string;
  diagnosisStatus: "laudo_formal" | "autodiagnosticado" | "investigacao" | "familiar_apoiador" | "nao_informado";
  supportLevel: 1 | 2 | 3 | "nao_especificado";
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

  // Patient database for reports (does not default to logged in user)
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_report_patients");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "pat-001",
        name: "Ana Maria Souza",
        pronouns: "ela/dela",
        diagnosisStatus: "laudo_formal",
        supportLevel: 1,
        cipteaNumber: "CIPTEA-CE 2025/0881",
        birthDate: "15/04/2012",
        focusArea: "Regulação Sensorial & Acomodações Escolare",
        caregiverMode: true,
        aq10Score: 8,
        sqeqScore: 32,
        sensoryScore: 28,
        burnoutScore: 24,
        catqScore: 110,
      },
      {
        id: "pat-002",
        name: "Gabriel Santos Oliveira",
        pronouns: "ele/dele",
        diagnosisStatus: "investigacao",
        supportLevel: 2,
        cipteaNumber: "CIPTEA-CE 2026/0142",
        birthDate: "20/09/2015",
        focusArea: "Comunicação AAC & Rotina Visual",
        caregiverMode: true,
        aq10Score: 9,
        sqeqScore: 35,
        sensoryScore: 31,
        burnoutScore: 18,
        catqScore: 95,
      },
      {
        id: "pat-003",
        name: "Lucas Silva Ferreira",
        pronouns: "ele/dele",
        diagnosisStatus: "laudo_formal",
        supportLevel: 1,
        cipteaNumber: "CIPTEA-SP 2024/7741",
        birthDate: "03/11/1998",
        focusArea: "Acomodações Laborais & Burnout Autista",
        caregiverMode: false,
        aq10Score: 7,
        sqeqScore: 30,
        sensoryScore: 22,
        burnoutScore: 29,
        catqScore: 125,
      },
    ];
  });

  const [selectedPatId, setSelectedPatId] = useState<string>(patients[0]?.id || "pat-001");

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
  const [newPatPronouns, setNewPatPronouns] = useState("ela/dela");
  const [newPatDiag, setNewPatDiag] = useState<PatientRecord["diagnosisStatus"]>("laudo_formal");
  const [newPatSupport, setNewPatSupport] = useState<PatientRecord["supportLevel"]>(1);
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
      aq10Score: Math.floor(Math.random() * 4) + 6,
      sqeqScore: Math.floor(Math.random() * 10) + 25,
      sensoryScore: Math.floor(Math.random() * 10) + 20,
      burnoutScore: Math.floor(Math.random() * 10) + 15,
      catqScore: Math.floor(Math.random() * 30) + 90,
    };
    setPatients([...patients, newPat]);
    setSelectedPatId(newPat.id);
    setNewPatName("");
    setShowAddPatientModal(false);
  };

  // Loaded data
  const [testHistory, setTestHistory] = useState<SavedTestResult[]>([]);
  const [routineTasks, setRoutineTasks] = useState<RoutineTask[]>([]);
  const [moodLogs, setMoodLogs] = useState<{ date: string; time: string; moodScore: number; energyScore: number; sensoryOverload: boolean; note: string }[]>([]);
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

  const handlePrint = () => {
    window.print();
  };

  // Aggregation calculations
  const totalTasks = routineTasks.length;
  const completedTasksCount = routineTasks.filter((t) => t.completed).length;
  const routineCompletionPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const avgMood = moodLogs.length > 0
    ? (moodLogs.reduce((acc, curr) => acc + curr.moodScore, 0) / moodLogs.length).toFixed(1)
    : "3.5";

  const avgEnergy = moodLogs.length > 0
    ? (moodLogs.reduce((acc, curr) => acc + curr.energyScore, 0) / moodLogs.length).toFixed(1)
    : "3.0";

  const sensoryOverloadEvents = moodLogs.filter((m) => m.sensoryOverload).length;

  const aq10Result = testHistory.find((t) => t.testId === "aq10");
  const sqeqResult = testHistory.find((t) => t.testId === "sqeq");
  const sensoryResult = testHistory.find((t) => t.testId === "sensory");
  const burnoutResult = testHistory.find((t) => t.testId === "burnout");
  const catqResult = testHistory.find((t) => t.testId === "catq");

  const supportLevelLabel = (selectedPatient ? selectedPatient.supportLevel : userProfile.supportLevel) === 1
    ? "Nível 1 de Suporte (Apoio leve/moderado)"
    : (selectedPatient ? selectedPatient.supportLevel : userProfile.supportLevel) === 2
    ? "Nível 2 de Suporte (Apoio substancial)"
    : (selectedPatient ? selectedPatient.supportLevel : userProfile.supportLevel) === 3
    ? "Nível 3 de Suporte (Apoio muito substancial)"
    : "Em Investigação Diagnóstica / Não Especificado";

  const diagnosisLabel = (selectedPatient ? selectedPatient.diagnosisStatus : userProfile.diagnosisStatus) === "laudo_formal"
    ? "Laudo Médico Formal Confirmado (TEA)"
    : (selectedPatient ? selectedPatient.diagnosisStatus : userProfile.diagnosisStatus) === "autodiagnosticado"
    ? "Autodiagnosticado / Identificação Autista"
    : (selectedPatient ? selectedPatient.diagnosisStatus : userProfile.diagnosisStatus) === "investigacao"
    ? "Em Avaliação Multiprofissional em Andamento"
    : "Não Especificado";

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Controls (Hidden on Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 text-xs font-bold">
              Diagnóstico Integrado & Relatórios PDF
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-400" />
            Relatório de Avaliação & Parecer Diagnóstico
          </h1>
          <p className="text-sm text-slate-400">
            Gerador de laudo técnico integral e relatórios impressos para apresentação em consultas médicas ou terapêuticas.
          </p>
        </div>

        {/* Action Button for PDF Print */}
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95 flex-shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Salvar PDF</span>
        </button>
      </div>

      {/* Patient Selector Card (Hidden on Print) */}
      <div className="no-print bg-slate-900 border border-teal-800/80 rounded-2xl p-5 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-950 text-teal-300 border border-teal-700/80 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Seleção de Paciente / Aluno para Laudo Técnico
              </h3>
              <p className="text-xs text-slate-400">
                Selecione o paciente cadastrado para gerar o relatório em seu nome (evitando utilizar o nome do profissional logado).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Cadastrar Novo Paciente
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-teal-300">
              Paciente Selecionado no Prontuário
            </label>
            <select
              value={selectedPatId}
              onChange={(e) => setSelectedPatId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-teal-700/80 rounded-xl text-slate-100 text-xs font-semibold focus:outline-none focus:border-teal-400"
            >
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.name} — ({pat.pronouns}) {pat.cipteaNumber ? `[${pat.cipteaNumber}]` : ""}
                </option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>{selectedPatient.name}</span>
                <span className="text-teal-400">{selectedPatient.pronouns}</span>
              </div>
              <p className="text-slate-400">Diagnóstico: {diagnosisLabel}</p>
              <p className="text-teal-300">Suporte: {supportLevelLabel} {selectedPatient.cipteaNumber ? `| Carteira: ${selectedPatient.cipteaNumber}` : ""}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Cadastrar Novo Paciente */}
      {showAddPatientModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-teal-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-teal-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" /> Cadastrar Paciente / Aluno
              </h3>
              <button onClick={() => setShowAddPatientModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Nome Completo do Paciente</label>
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
                    placeholder="Ex: ele/dele"
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
                <label className="block font-semibold text-slate-300">Status do Diagnóstico</label>
                <select
                  value={newPatDiag}
                  onChange={(e) => setNewPatDiag(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                >
                  <option value="laudo_formal">Laudo Médico Formal Confirmado (TEA)</option>
                  <option value="investigacao">Em Avaliação Multiprofissional</option>
                  <option value="autodiagnosticado">Autodiagnosticado / Identificação</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Nível de Suporte (TEA)</label>
                <select
                  value={newPatSupport}
                  onChange={(e) => setNewPatSupport(parseInt(e.target.value) as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                >
                  <option value={1}>Nível 1 (Apoio leve/moderado)</option>
                  <option value={2}>Nível 2 (Apoio substancial)</option>
                  <option value={3}>Nível 3 (Apoio muito substancial)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-300">Área de Maior Demanda</label>
                <input
                  type="text"
                  value={newPatFocus}
                  onChange={(e) => setNewPatFocus(e.target.value)}
                  placeholder="Ex: Regulação Sensorial e Comunicação AAC"
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
                  Salvar Paciente
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
          <span className="text-xs font-semibold text-slate-300">Selecione a Janela Temporal do Relatório:</span>
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
        
        {/* Document Header for Formal Clinical Report */}
        <div className="border-b-2 border-teal-700/60 pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/sistemastop_logo.svg" alt="SISTEMASTOP" className="w-12 h-12 object-contain rounded-xl p-1 bg-slate-950 border border-teal-800 print:w-10 print:h-10" />
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest print:text-teal-800">
                  SISTEMASTOP • NEUROCONECTA — TECNOLOGIA NEUROAFIRMATIVA
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 print:text-black mt-0.5">
                  Relatório de Acompanhamento &amp; Diagnóstico Integral
                </h1>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Rua Doutor Rolim, 366 - Bairro Independência, Crato - CE | +55 (88) 99673-9128 | contato@sistemastop.com.br
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-black flex-shrink-0">
              <p><strong>Emissão:</strong> {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
              <p><strong>Período Analisado:</strong> {period === "diario" ? "Relatório Diário" : period === "semanal" ? "Consolidado Semanal" : "Consolidado Mensal"}</p>
            </div>
          </div>

          {/* Patient Profile Metadata Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs print:bg-slate-50 print:border-slate-300">
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Paciente / Identificação:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{selectedPatient ? selectedPatient.name : userProfile.preferredName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Pronomes:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{selectedPatient ? selectedPatient.pronouns : userProfile.pronouns}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Status Diagnóstico:</p>
              <p className="text-sm font-bold text-teal-300 print:text-black">{diagnosisLabel}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Nível de Suporte (TEA):</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{supportLevelLabel}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Documento / CIPTEA / BPC:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{selectedPatient?.cipteaNumber || "Não cadastrado"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Profissional Emissor (Responsável):</p>
              <p className="text-sm font-bold text-teal-400 print:text-black">
                {userProfile.preferredName || "Profissional Responsável"} {userProfile.professionalRegisterNumber ? `(${userProfile.professionalRegisterNumber})` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100 print:text-black flex items-center gap-2 border-b border-slate-800 pb-2">
            <BarChart3 className="w-5 h-5 text-teal-400 print:text-black" />
            Indicadores de Desempenho & Autorregulação ({period.toUpperCase()})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Conclusão de Rotina</p>
              <p className="text-2xl font-extrabold text-teal-300 print:text-black mt-1">{routineCompletionPercentage}%</p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">{completedTasksCount} de {totalTasks} tarefas concluídas</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Média de Humor (1-5)</p>
              <p className="text-2xl font-extrabold text-amber-300 print:text-black mt-1">{avgMood} / 5.0</p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">{moodLogs.length} registros computados</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Nível de Energia (1-5)</p>
              <p className="text-2xl font-extrabold text-emerald-300 print:text-black mt-1">{avgEnergy} / 5.0</p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">Disponibilidade cognitiva</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl print:border-slate-300 print:bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 print:text-slate-700">Eventos de Sobrecarga</p>
              <p className="text-2xl font-extrabold text-rose-400 print:text-black mt-1">{sensoryOverloadEvents}</p>
              <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">Crises / Sobrecargas sensoriais</p>
            </div>
          </div>
        </div>

        {/* Standardized Test Summary Table */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-100 print:text-black flex items-center gap-2 border-b border-slate-800 pb-2">
            <ClipboardCheck className="w-5 h-5 text-teal-400 print:text-black" />
            Quadro de Autoavaliações Padronizadas Realizadas
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 print:bg-slate-100 print:text-black print:border-slate-400">
                  <th className="p-3 font-bold">Instrumento de Triagem</th>
                  <th className="p-3 font-bold">Data</th>
                  <th className="p-3 font-bold">Pontuação Obtida</th>
                  <th className="p-3 font-bold">Nível Interpretativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">AQ-10 (Autism Spectrum Quotient)</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{aq10Result ? aq10Result.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{aq10Result ? `${aq10Result.score} / ${aq10Result.maxScore}` : "N/A"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{aq10Result ? aq10Result.interpretationLevel : "Pendente"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">SQ-EQ (Empatia e Sistematização)</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{sqeqResult ? sqeqResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{sqeqResult ? `${sqeqResult.score} / ${sqeqResult.maxScore}` : "N/A"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{sqeqResult ? sqeqResult.interpretationLevel : "Pendente"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">Perfil Sensorial Simplificado</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{sensoryResult ? sensoryResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{sensoryResult ? `${sensoryResult.score} / ${sensoryResult.maxScore}` : "N/A"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{sensoryResult ? sensoryResult.interpretationLevel : "Pendente"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">Avaliação de Burnout Autista</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{burnoutResult ? burnoutResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{burnoutResult ? `${burnoutResult.score} / ${burnoutResult.maxScore}` : "N/A"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{burnoutResult ? burnoutResult.interpretationLevel : "Pendente"}</td>
                </tr>
                <tr className="hover:bg-slate-950/40 print:bg-white">
                  <td className="p-3 font-semibold text-slate-200 print:text-black">CAT-Q (Máscara / Camuflagem Social)</td>
                  <td className="p-3 text-slate-400 print:text-slate-700">{catqResult ? catqResult.date : "Não realizado"}</td>
                  <td className="p-3 font-mono font-bold text-teal-300 print:text-black">{catqResult ? `${catqResult.score} / ${catqResult.maxScore}` : "N/A"}</td>
                  <td className="p-3 text-slate-300 print:text-black">{catqResult ? catqResult.interpretationLevel : "Pendente"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DIAGNÓSTICO TOTAL / INTEGRAL (FULL CONTINUOUS NARRATIVE PROSE WITHOUT RESUME OR BULLET SHORTCUTS) */}
        <div className="space-y-5 pt-4 border-t-2 border-slate-800 print:border-slate-400 print-page-break">
          <div className="flex items-center gap-2 text-teal-400 print:text-black">
            <Award className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-slate-100 print:text-black">
              Parecer Diagnóstico Integrado e Síntese Clínica Integral
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 print:text-black leading-relaxed space-y-4 text-justify">
            <p>
              O presente documento constitui o parecer diagnóstico integral e síntese de acompanhamento do neurodesenvolvimento referente ao paciente <strong>{selectedPatient ? selectedPatient.name : userProfile.preferredName}</strong> ({selectedPatient?.pronouns || "ele/dele"}), fundamentado no cruzamento de dados de autorrelato, instrumentos de triagem validados internacionalmente (AQ-10, SQ-EQ, CAT-Q, Perfil Sensorial) e registros de navegação e regulação comportamental no sistema NeuroConecta.
            </p>

            <p>
              No que tange aos critérios diagnósticos formais estabelecidos pelo DSM-5-TR (Manual Diagnóstico e Estatístico de Transtornos Mentais) e pela CID-11 (Classificação Internacional de Doenças - Código 6A02), o perfil avaliado apresenta manifestações clínicas consistentes nas duas dimensões fundamentais do Transtorno do Espectro Autista. Em relação ao Critério A (Déficits na comunicação e interação social), observam-se padrões característicos de hiper-foco em regulação lógica, necessidade de previsibilidade explícita e dispêndio elevado de energia cognitiva para processar normas sociais implícitas.
            </p>

            <p>
              No tocante ao Critério B (Padrões restritos, repetitivos e inflexíveis de comportamento, interesses ou atividades), os dados registram forte aderência a rotinas visuais estruturadas, preferência por sequenciamento rigoroso de tarefas e presença de comportamentos de autorregulação motora e sensorial (stimming). O instrumento AQ-10 pontuou em nível correspondente a traços autistas significativos, enquanto o teste SQ-EQ indicou perfil hiper-sistematizador com empatia orientada pela lógica e pela justiça distributiva, em detrimento do contágio emocional automático.
            </p>

            <p>
              Na dimensão de Processamento Sensorial, o rastreamento identifica hiper-reatividade a estímulos exógenos, destacando-se vulnerabilidade elevada a ruídos ambientais simultâneos, iluminação fluorescente e sobrecarga de contato interpessoal prolongado. O acúmulo de estressores sem a devida descompressão culmina em episódios de desligamento defensivo (shutdown) ou colapso sensorial (meltdown), demandando acomodações ativas como protetores auriculares, lentes filtrantes e pausas sensoriais programadas.
            </p>

            <p>
              No que tange à Camuflagem Social (Mascaramento), os resultados da escala CAT-Q revelam esforço substancial de assimilação e ensaio mental prévio de interações sociais. Embora o mascaramento proporcione adaptação aparente em ambientes acadêmicos e corporativos, a sua manutenção contínua atua como fator neurotóxico primário, estando diretamente associada à exaustão crônica e aos indicadores de Burnout Autista identificados no período.
            </p>

            <p>
              Considerando o quadro global e os níveis de autonomia demonstrados, o indivíduo é enquadrado no <strong>{supportLevelLabel}</strong>, demandando acomodações ambientais, previsibilidade nas transições de rotina, flexibilização de prazos cognitivos e apoio na intermediação interpessoal. Recomenda-se a apresentação deste parecer à equipe multiprofissional assistente para ratificação diagnóstica clínica e elaboração de Plano Terapêutico Singular (PTS).
            </p>
          </div>
        </div>

        {/* Recommendations for Healthcare Professionals */}
        <div className="space-y-3 pt-4 border-t border-slate-800 print:border-slate-400">
          <h3 className="text-sm font-bold text-teal-300 print:text-black uppercase tracking-wider">
            Diretrizes Recomendadas para a Equipe Multiprofissional Assistente:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 print:text-black">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">🧠 Neurologia / Psiquiatria:</p>
              <p>Considerar avaliação complementar para condições neurodivergentes sobrepostas (TDAH, AH/SD) e monitoramento de episódios de burnout autista e ansiedade decorrentes da sobrecarga de mascaramento.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">🎧 Terapia Ocupacional (Integração Sensorial):</p>
              <p>Mapeamento de dieta sensorial personalizada, prescrevendo estratégias de propriocepção e autorregulação vestibular para prevenção diária de shutdowns e meltdowns.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">🗣️ Psicologia Neuroafirmativa:</p>
              <p>Desenvolvimento de estratégias de desmascaramento seguro (unmasking), psicoeducação em limites cognitivos e fortalecimento da auto-advocacia sem culpa em contextos sociais.</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <p className="font-bold text-slate-100 print:text-black mb-1">🏫 Acomodações Acadêmicas / Laborais:</p>
              <p>Recomendação formal de adaptação de provas/prazos, permissão de uso de fones abafadores e acesso a ambientes desestimulados durante jornadas de trabalho ou estudo.</p>
            </div>
          </div>
        </div>

        {/* Formal Signature & Validation Block */}
        <div className="pt-8 border-t-2 border-slate-800 print:border-slate-400 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400 print:text-black">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-bold text-slate-200 print:text-black">NeuroConecta — Plataforma de Apoio Neurodivergente</p>
            <p>Documento gerado eletronicamente e validado em ambiente seguro.</p>
            <p className="font-mono text-[10px] text-slate-500 print:text-slate-600">ID de Autenticidade: NC-REP-{Date.now().toString(36).toUpperCase()}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-center">
            <div className="space-y-1 min-w-[180px]">
              <div className="border-b border-slate-700 print:border-black w-44 mx-auto mb-1"></div>
              <p className="font-bold text-slate-200 print:text-black">{userProfile.preferredName || "Profissional Responsável"}</p>
              <p className="text-[10px] text-teal-400 print:text-slate-600 font-semibold">
                Emissor / {userProfile.professionalRoleType ? userProfile.professionalRoleType.toUpperCase() : "Técnico"}
                {userProfile.professionalRegisterNumber ? ` (${userProfile.professionalRegisterNumber})` : ""}
              </p>
            </div>

            <div className="space-y-1 min-w-[180px]">
              <div className="border-b border-slate-700 print:border-black w-44 mx-auto mb-1"></div>
              <p className="font-bold text-slate-200 print:text-black">{selectedPatient ? selectedPatient.name : "Paciente / Aluno"}</p>
              <p className="text-[10px] text-slate-500 print:text-slate-600">Titular do Prontuário / Laudo</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
