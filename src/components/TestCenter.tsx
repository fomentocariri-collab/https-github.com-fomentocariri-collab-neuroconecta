import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  HelpCircle,
  Copy,
  Check,
  BarChart2,
  FileText,
  ListFilter
} from "lucide-react";
import { TestDefinition, SavedTestResult } from "../types";
import { TESTS_LIST } from "../data/tests";

interface TestCenterProps {
  onNavigateToChat: () => void;
}

export const TestCenter: React.FC<TestCenterProps> = ({ onNavigateToChat }) => {
  const [selectedTest, setSelectedTest] = useState<TestDefinition | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [copiedReport, setCopiedReport] = useState(false);

  const [testResult, setTestResult] = useState<{
    score: number;
    maxScore: number;
    level: string;
    summary: string;
    recommendation: string;
    tips: string[];
    domainScores?: Record<string, { scored: number; max: number }>;
    aspieScore?: number;
    neurotypicalScore?: number;
  } | null>(null);

  const [savedHistory, setSavedHistory] = useState<SavedTestResult[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_test_history");
      if (stored) {
        setSavedHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleStartTest = (test: TestDefinition) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestResult(null);

    // Check for draft saved in localStorage
    try {
      const draft = localStorage.getItem(`neuroconecta_draft_${test.id}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed && typeof parsed === "object") {
          setAnswers(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    const updated = { ...answers, [questionId]: optionIndex };
    setAnswers(updated);

    // Save draft
    if (selectedTest) {
      try {
        localStorage.setItem(`neuroconecta_draft_${selectedTest.id}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFinishTest = () => {
    if (!selectedTest) return;

    let totalScore = 0;
    let maxPossibleScore = 0;

    // Sub-domain tracking
    const domainScores: Record<string, { scored: number; max: number }> = {};

    selectedTest.questions.forEach((q) => {
      const selectedIndex = answers[q.id];
      const selectedOption = selectedIndex !== undefined ? q.options[selectedIndex] : null;
      const selectedScore = selectedOption ? selectedOption.score : 0;
      totalScore += selectedScore;

      const maxOptionScore = Math.max(...q.options.map((o) => o.score));
      maxPossibleScore += maxOptionScore;

      if (q.category) {
        if (!domainScores[q.category]) {
          domainScores[q.category] = { scored: 0, max: 0 };
        }
        domainScores[q.category].scored += selectedScore;
        domainScores[q.category].max += maxOptionScore;
      }
    });

    const interpretation = selectedTest.interpretResult(totalScore);

    const result = {
      score: totalScore,
      maxScore: maxPossibleScore,
      level: interpretation.level,
      summary: interpretation.summary,
      recommendation: interpretation.recommendation,
      tips: interpretation.tips,
      domainScores,
      aspieScore: interpretation.aspieScore,
      neurotypicalScore: interpretation.neurotypicalScore,
    };

    setTestResult(result);

    // Clear draft
    try {
      localStorage.removeItem(`neuroconecta_draft_${selectedTest.id}`);
    } catch (e) {
      console.error(e);
    }

    // Save history item
    const historyItem: SavedTestResult = {
      id: `res-${Date.now()}`,
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      score: totalScore,
      maxScore: maxPossibleScore,
      date: new Date().toLocaleDateString("pt-BR"),
      interpretationLevel: interpretation.level,
      interpretationSummary: interpretation.summary,
    };

    const newHistory = [historyItem, ...savedHistory];
    setSavedHistory(newHistory);
    try {
      localStorage.setItem("neuroconecta_test_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyClinicalReport = () => {
    if (!selectedTest || !testResult) return;

    let domainText = "";
    if (testResult.domainScores) {
      domainText = Object.entries(testResult.domainScores)
        .map(([domain, val]) => `  - ${domain}: ${val.scored} / ${val.max} pts (${Math.round((val.scored / val.max) * 100)}%)`)
        .join("\n");
    }

    const reportText = `[RELATÓRIO DE AUTOAVALIAÇÃO - NEUROCONECTA]
Data: ${new Date().toLocaleDateString("pt-BR")}
Instrumento: ${selectedTest.title}
Validação Científica: ${selectedTest.validatedClinically ? `Sim (${selectedTest.validationReference})` : "Não (Reflexão Pessoal Comunitária)"}

PONTUAÇÃO TOTAL: ${testResult.score} / ${testResult.maxScore} pts
INTERPRETAÇÃO DE TRIAGEM: ${testResult.level}

RESUMO EXECUTIVO:
${testResult.summary}

RECOMENDAÇÃO TÉCNICA:
${testResult.recommendation}

${domainText ? `DESCOMPOSIÇÃO POR DOMÍNIOS COGNITIVOS/SENSORIAIS:\n${domainText}\n` : ""}
SINAIS E DICAS PRÁTICAS:
${testResult.tips.map(t => `- ${t}`).join("\n")}

Aviso Legal: Este documento é fruto de ferramenta pedagógica de autorrelato e autoavaliação. Não substitui consulta e laudo clínico com equipe multiprofissional (médico neurologista/psiquiatra ou neuropsicólogo).`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-teal-400" />
            Centro de Autoavaliação &amp; Triagem Densa
          </h1>
          <p className="text-sm text-slate-400">
            Instrumentos clínicos validados por literatura médica e questionários de reflexão pessoal comunitária.
          </p>
        </div>
        <div className="text-xs bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span>Ferramentas de rastreio. Não substituem laudo psiquiátrico ou neuropsicológico.</span>
        </div>
      </div>

      {/* Main View Switch */}
      {!selectedTest ? (
        <div className="space-y-8">
          
          {/* Scientific Context Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-slate-100">
                Comparativo de Instrumentos Avaliativos &amp; Validação
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-3">Instrumento / Teste</th>
                    <th className="p-3">Nº Questões</th>
                    <th className="p-3">Validação Clínica?</th>
                    <th className="p-3">Uso Principal &amp; Domínios</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-teal-300">RAADS-R</td>
                    <td className="p-3 font-mono">80 / 30 adapt.</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        <ShieldCheck className="w-3 h-3" /> Sim (Ritvo, 2011)
                      </span>
                    </td>
                    <td className="p-3">Triagem clínica de adultos (Sensibilidade 97%, Especificidade 100%). Avalia Social, Interesses, Linguagem e Sensório-Motor.</td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-teal-300">Aspie Quiz (v5)</td>
                    <td className="p-3 font-mono">~120 / 20 adapt.</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        <HelpCircle className="w-3 h-3" /> Não (Rdos / Leif)
                      </span>
                    </td>
                    <td className="p-3">Reflexão pessoal e comunitária (Escala 0 a 200). Mapeia Talento, Percepção, Comunicação, Relacionamentos e Social.</td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-teal-300">AQ-10</td>
                    <td className="p-3 font-mono">10</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        <ShieldCheck className="w-3 h-3" /> Sim (Cambridge / NICE)
                      </span>
                    </td>
                    <td className="p-3">Rastreio rápido de 3 minutos para indicar se há necessidade de investigação aprofundada.</td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-teal-300">CAT-Q</td>
                    <td className="p-3 font-mono">25 / 6 adapt.</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        <ShieldCheck className="w-3 h-3" /> Sim (Hull, 2019)
                      </span>
                    </td>
                    <td className="p-3">Mede o nível de camuflagem social e esforço empregado para passar por neurotípico em público.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tests List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTS_LIST.map((test) => (
              <div
                key={test.id}
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-700/60 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-950 text-teal-300 border border-teal-800/80">
                        {test.questionsCount} Questões
                      </span>
                      {test.validatedClinically ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Validado
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> Reflexão Pessoal
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{test.estimatedMinutes} min
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-300 transition">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Uso: {test.usageType}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {test.shortDescription}
                  </p>

                  {test.domains && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {test.domains.map((d, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 rounded-md border border-slate-800">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <span>Iniciar Autoavaliação</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Test Result History */}
          {savedHistory.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                Histórico de Autoavaliações Salvas
              </h3>
              <div className="space-y-3">
                {savedHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div>
                      <span className="text-[11px] text-slate-500 font-mono">{item.date}</span>
                      <h4 className="font-bold text-slate-200">{item.testTitle}</h4>
                      <p className="text-teal-400 font-medium text-xs mt-0.5">{item.interpretationLevel}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-mono text-center">
                      {item.score} / {item.maxScore} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Test Runner & Results */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">{selectedTest.title}</h2>
                {selectedTest.validatedClinically ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Validado Clinicamente
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Reflexão Pessoal
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedTest.fullDescription}</p>
            </div>
            <button
              onClick={() => setSelectedTest(null)}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Voltar aos Testes
            </button>
          </div>

          {!testResult ? (
            /* Active Questionnaire Flow */
            <div className="space-y-6">
              
              {/* Progress Bar & Sub-category Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Questão {currentQuestionIndex + 1} de {selectedTest.questionsCount}</span>
                  {selectedTest.questions[currentQuestionIndex]?.category && (
                    <span className="text-teal-400 font-bold bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800 text-[11px]">
                      Domínio: {selectedTest.questions[currentQuestionIndex].category}
                    </span>
                  )}
                  <span>{Math.round(((currentQuestionIndex + 1) / selectedTest.questionsCount) * 100)}% concluído</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / selectedTest.questionsCount) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Question */}
              {selectedTest.questions[currentQuestionIndex] && (
                <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
                  <h3 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                    "{selectedTest.questions[currentQuestionIndex].text}"
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {selectedTest.questions[currentQuestionIndex].options.map((opt, idx) => {
                      const isSelected = answers[selectedTest.questions[currentQuestionIndex].id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(selectedTest.questions[currentQuestionIndex].id, idx)}
                          className={`p-4 rounded-xl border text-left font-medium text-xs sm:text-sm transition flex items-center justify-between ${
                            isSelected
                              ? "bg-teal-950 text-teal-200 border-teal-500 shadow-md"
                              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next / Back Controls */}
              <div className="flex justify-between items-center pt-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs sm:text-sm rounded-xl transition"
                >
                  Anterior
                </button>

                {currentQuestionIndex < selectedTest.questionsCount - 1 ? (
                  <button
                    disabled={answers[selectedTest.questions[currentQuestionIndex].id] === undefined}
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>Próxima Questão</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled={Object.keys(answers).length < selectedTest.questionsCount}
                    onClick={handleFinishTest}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ver Resultado e Relatório Completo</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Test Results Display */
            <div className="space-y-6">
              
              <div className="p-6 bg-slate-950 border border-teal-800/80 rounded-2xl space-y-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">Resultado da Autoavaliação</span>
                    <h3 className="text-xl font-bold text-slate-100">{testResult.level}</h3>
                  </div>
                  <div className="text-2xl font-extrabold text-teal-300 font-mono bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                    {testResult.score} <span className="text-xs text-slate-500 font-normal">/ {testResult.maxScore} pts</span>
                  </div>
                </div>

                <div className="space-y-3 text-slate-200 text-sm leading-relaxed">
                  <p className="font-medium text-teal-200">{testResult.summary}</p>
                  <p className="text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    💡 <strong>Recomendação Técnica:</strong> {testResult.recommendation}
                  </p>
                </div>

                {/* Sub-Domains Breakdown Meters */}
                {testResult.domainScores && Object.keys(testResult.domainScores).length > 0 && (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-teal-400" />
                      Decomposição por Domínios AVALIADOS:
                    </h4>

                    <div className="space-y-2.5">
                      {Object.entries(testResult.domainScores).map(([domName, val]) => {
                        const pct = Math.round((val.scored / val.max) * 100);
                        return (
                          <div key={domName} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-slate-200">{domName}</span>
                              <span className="text-teal-400 font-mono">{val.scored} / {val.max} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sugestões Práticas Personalizadas:</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {testResult.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyClinicalReport}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow"
                >
                  {copiedReport ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReport ? "Relatório Copiado!" : "Copiar Relatório Clínico em Texto"}</span>
                </button>

                <button
                  onClick={onNavigateToChat}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 border border-slate-700"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Discutir com Assistente IA</span>
                </button>

                <button
                  onClick={() => handleStartTest(selectedTest)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 border border-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer Teste</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
