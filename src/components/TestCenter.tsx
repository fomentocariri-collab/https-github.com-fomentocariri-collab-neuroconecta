import React, { useState, useEffect } from "react";
import { ClipboardCheck, Clock, CheckCircle2, ArrowRight, RotateCcw, Share2, Save, Sparkles, AlertCircle } from "lucide-react";
import { TestDefinition, SavedTestResult } from "../types";
import { TESTS_LIST } from "../data/tests";

interface TestCenterProps {
  onNavigateToChat: () => void;
}

export const TestCenter: React.FC<TestCenterProps> = ({ onNavigateToChat }) => {
  const [selectedTest, setSelectedTest] = useState<TestDefinition | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [testResult, setTestResult] = useState<{
    score: number;
    maxScore: number;
    level: string;
    summary: string;
    recommendation: string;
    tips: string[];
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
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinishTest = () => {
    if (!selectedTest) return;

    let totalScore = 0;
    let maxPossibleScore = 0;

    selectedTest.questions.forEach((q) => {
      const selectedIndex = answers[q.id];
      const selectedOption = selectedIndex !== undefined ? q.options[selectedIndex] : null;
      const selectedScore = selectedOption ? selectedOption.score : 0;
      totalScore += selectedScore;

      const maxOptionScore = Math.max(...q.options.map((o) => o.score));
      maxPossibleScore += maxOptionScore;
    });

    const interpretation = selectedTest.interpretResult(totalScore);

    const result = {
      score: totalScore,
      maxScore: maxPossibleScore,
      level: interpretation.level,
      summary: interpretation.summary,
      recommendation: interpretation.recommendation,
      tips: interpretation.tips,
    };

    setTestResult(result);

    // Save history item automatically
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

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-teal-400" />
            Testes e Autoavaliação Adaptados
          </h1>
          <p className="text-sm text-slate-400">
            Instrumentos de triagem validados em linguagem acessível para autoconhecimento.
          </p>
        </div>
        <div className="text-xs bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span>Ferramentas pedagógicas. Não substituem diagnóstico médico.</span>
        </div>
      </div>

      {/* Main View Switch */}
      {!selectedTest ? (
        <div className="space-y-8">
          
          {/* Tests List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTS_LIST.map((test) => (
              <div
                key={test.id}
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-700/60 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-950 text-teal-300 border border-teal-800/80">
                      {test.questionsCount} Questões
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{test.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-300 transition">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {test.shortDescription}
                  </p>
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
              <h2 className="text-xl font-bold text-slate-100">{selectedTest.title}</h2>
              <p className="text-xs text-slate-400">{selectedTest.fullDescription}</p>
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
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Questão {currentQuestionIndex + 1} de {selectedTest.questionsCount}</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <span>Ver Resultado Completo</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Test Results Display */
            <div className="space-y-6">
              
              <div className="p-6 bg-slate-950 border border-teal-800/80 rounded-2xl space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
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
                    💡 <strong>Recomendação:</strong> {testResult.recommendation}
                  </p>
                </div>

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
                  onClick={onNavigateToChat}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Discutir com Assistente IA</span>
                </button>

                <button
                  onClick={() => handleStartTest(selectedTest)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5"
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
