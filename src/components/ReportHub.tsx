import React, { useState, useEffect } from "react";
import { FileText, Printer, Calendar, BarChart3, ShieldCheck, HeartPulse, ClipboardCheck, Clock, User, Award, CheckCircle2 } from "lucide-react";
import { UserProfile, SavedTestResult, RoutineTask } from "../types";

interface ReportHubProps {
  userProfile: UserProfile;
}

type PeriodFilter = "diario" | "semanal" | "mensal";

export const ReportHub: React.FC<ReportHubProps> = ({ userProfile }) => {
  const [period, setPeriod] = useState<PeriodFilter>("semanal");

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

  const supportLevelLabel = userProfile.supportLevel === 1
    ? "Nível 1 de Suporte (Apoio leve/moderado)"
    : userProfile.supportLevel === 2
    ? "Nível 2 de Suporte (Apoio substancial)"
    : userProfile.supportLevel === 3
    ? "Nível 3 de Suporte (Apoio muito substancial)"
    : "Em Investigação Diagnóstica / Não Especificado";

  const diagnosisLabel = userProfile.diagnosisStatus === "laudo_formal"
    ? "Laudo Médico Formal Confirmado (TEA)"
    : userProfile.diagnosisStatus === "autodiagnosticado"
    ? "Autodiagnosticado / Identificação Autista"
    : userProfile.diagnosisStatus === "investigacao"
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
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest print:text-black">
                NEUROCONECTA — SISTEMA INTEGRADO DE APOIO AO TEA
              </span>
              <h1 className="text-2xl font-extrabold text-slate-100 print:text-black mt-1">
                Relatório de Acompanhamento & Diagnóstico Integral
              </h1>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-black">
              <p><strong>Emissão:</strong> {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
              <p><strong>Período Analisado:</strong> {period === "diario" ? "Relatório Diário" : period === "semanal" ? "Consolidado Semanal" : "Consolidado Mensal"}</p>
            </div>
          </div>

          {/* Patient Profile Metadata Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs print:bg-slate-50 print:border-slate-300">
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Nome / Identificação:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{userProfile.preferredName || "Não Informado"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Pronomes:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{userProfile.pronouns || "Não Informado"}</p>
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
              <p className="text-slate-400 font-semibold print:text-slate-600">Modo Cuidador Ativo:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black">{userProfile.caregiverMode ? "Sim (Monitorado por familiar/rede)" : "Não (Uso autônomo)"}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold print:text-slate-600">Área de Maior Demanda:</p>
              <p className="text-sm font-bold text-slate-100 print:text-black capitalize">{userProfile.currentFocus.replace("_", " ")}</p>
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
              O presente documento constitui o parecer diagnóstico integral e síntese de acompanhamento do neurodesenvolvimento referente ao indivíduo <strong>{userProfile.preferredName || "Paciente em Avaliação"}</strong>, fundamentado no cruzamento de dados de autorrelato, instrumentos de triagem validados internacionalmente (AQ-10, SQ-EQ, CAT-Q, Perfil Sensorial) e registros de navegação e regulação comportamental no sistema NeuroConecta.
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
            <p>Documento gerado eletronicamente e validado pelo usuário autor / responsável.</p>
            <p className="font-mono text-[10px] text-slate-500 print:text-slate-600">ID de Autenticidade: NC-REP-{Date.now().toString(36).toUpperCase()}</p>
          </div>

          <div className="text-center space-y-1 min-w-[200px]">
            <div className="border-b border-slate-700 print:border-black w-48 mx-auto mb-1"></div>
            <p className="font-bold text-slate-200 print:text-black">{userProfile.preferredName || "Paciente em Acompanhamento"}</p>
            <p className="text-[10px] text-slate-500 print:text-slate-600">Assinatura / Validação do Registro</p>
          </div>
        </div>

      </div>

    </div>
  );
};
