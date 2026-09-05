import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  FileText, 
  Layers, 
  Eye, 
  Clock, 
  Volume2, 
  Users, 
  CheckCircle2, 
  HelpCircle,
  Lightbulb,
  RotateCcw
} from "lucide-react";

interface AccessibleActivityPlannerProps {
  isDark?: boolean;
}

export interface ActivityAdaptationPlan {
  pedagogicalGoal: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  lessonTheme: string;
  studentInterests: string;
  availableResources: string;
  desiredParticipation: string;
  observableNeeds: string;
  generatedAt: string;
  // Generated fields
  commonGoal: string;
  directInstruction: string;
  stepByStepVersion: string[];
  suggestedVisualSupport: string[];
  alternativeParticipation: string[];
  alternativeResponseForms: string[];
  multiplePathways: { format: string; description: string }[];
  contextualEngagement: string[];
  environmentalAdaptations: string[];
  teacherNotes: string[];
}

export interface ActivityWhatWorkedLog {
  id: string;
  date: string;
  lessonTheme: string;
  subject: string;
  strategiesWorked: string[];
  notes: string;
}

export const AccessibleActivityPlanner: React.FC<AccessibleActivityPlannerProps> = ({ isDark = true }) => {
  // Input fields - Focused primarily on "O que você precisa ensinar?" (Item 20)
  const [pedagogicalGoal, setPedagogicalGoal] = useState("Compreender as etapas do ciclo da água (evaporação, condensação e precipitação)");
  const [subject, setSubject] = useState("Ciências Naturais");
  const [gradeLevel, setGradeLevel] = useState("5º Ano do Ensino Fundamental");
  const [duration, setDuration] = useState("50 minutos (divididos em blocos de 15 a 20 min)");
  const [lessonTheme, setLessonTheme] = useState("Ciclo da Água e Estados Físicos");
  const [studentInterests, setStudentInterests] = useState("Jogos de construção (Minecraft), música rítmica e mapas territoriais");
  const [availableResources, setAvailableResources] = useState("Quadro branco, cartolinas, canetas coloridas, copos com água e projetor");
  const [desiredParticipation, setDesiredParticipation] = useState("Produção em duplas ou individual, com opção de desenho esquemático ou colagem");
  const [observableNeeds, setObservableNeeds] = useState("Sensibilidade a ruído da sala, preferência por instruções visuais passo a passo, cansaço em cópias longas");

  // Plan result state
  const [currentPlan, setCurrentPlan] = useState<ActivityAdaptationPlan | null>(null);
  const [copied, setCopied] = useState(false);

  // Registro: "O que funcionou nesta atividade?" (Item 15)
  const [whatWorkedLogs, setWhatWorkedLogs] = useState<ActivityWhatWorkedLog[]>(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_activity_what_worked");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "ww-1",
        date: "28/08/2026",
        lessonTheme: "Ciclo da Água",
        subject: "Ciências Naturais",
        strategiesWorked: [
          "Apoio visual com roteiro no canto do quadro",
          "Opção de desenhar o esquema em vez de copiar texto",
          "Uso de abafador durante a explicação coletiva",
        ],
        notes: "Estudante participou de todas as etapas quando pode desenhar e explicar oralmente ao final.",
      },
    ];
  });

  const [selectedWorkedStrategies, setSelectedWorkedStrategies] = useState<string[]>([]);
  const [workedNotes, setWorkedNotes] = useState("");
  const [savedFeedbackSuccess, setSavedFeedbackSuccess] = useState(false);

  // Pre-fill quick templates
  const applyExampleTemplate = (type: "ciencias" | "historia" | "matematica") => {
    if (type === "ciencias") {
      setPedagogicalGoal("Compreender as etapas do ciclo da água (evaporação, condensação e precipitação)");
      setSubject("Ciências Naturais");
      setGradeLevel("5º Ano do Ensino Fundamental");
      setDuration("50 minutos (blocos de 15 a 20 min com pausa)");
      setLessonTheme("Ciclo da Água e Estados Físicos");
      setStudentInterests("Jogos de construção (Minecraft), experimentos com água e desenho");
      setAvailableResources("Quadro, cartolina, canetinhas, projetor, copos descartáveis");
      setDesiredParticipation("Opção de desenho esquemático, colagem ou montagem em dupla");
      setObservableNeeds("Sensibilidade a ruídos da sala, preferência por etapas visuais, cansaço em cópias longas");
    } else if (type === "historia") {
      setPedagogicalGoal("Identificar as transformações no bairro ao longo do tempo através de fotografias antigas e relatos");
      setSubject("História / Geografia");
      setGradeLevel("3º Ano do Ensino Fundamental");
      setDuration("45 minutos");
      setLessonTheme("Memória Local e Transformações Urbanas");
      setStudentInterests("Fotografia, mapas do bairro, trens e meios de transporte");
      setAvailableResources("Fotos impressas antigas e atuais, papel sulfite, mapa da cidade");
      setDesiredParticipation("Trabalho com pista visual e relato oral ou desenho de 'antes e depois'");
      setObservableNeeds("Dificuldade de escrita rápida, necessidade de previsibilidade do tempo, necessidade de apoio visual direto");
    } else {
      setPedagogicalGoal("Resolver situações-problema de adição e subtração contextualizadas em compras cotidianas");
      setSubject("Matemática");
      setGradeLevel("4º Ano do Ensino Fundamental");
      setDuration("45 minutos");
      setLessonTheme("Sistema Monetário e Resolução de Problemas");
      setStudentInterests("Coleção de figurinhas, carrinhos, mercadinho e contagem concreta");
      setAvailableResources("Folhetos de supermercado, cédulas ilustrativas de mentirinha, fichas com valores");
      setDesiredParticipation("Manuseio concreto de materiais, resolução em duplas estruturadas");
      setObservableNeeds("Sobrecarga com enunciados textuais muito extensos, benefício de material manipulável concreto");
    }
  };

  const handleGeneratePlan = () => {
    // Systematic pedagogical logic based on Universal Design for Learning (UDL / DUA)
    // "Mesmo objetivo, diferentes caminhos" (Item 13)
    const plan: ActivityAdaptationPlan = {
      pedagogicalGoal,
      subject,
      gradeLevel,
      duration,
      lessonTheme,
      studentInterests,
      availableResources,
      desiredParticipation,
      observableNeeds,
      generatedAt: new Date().toLocaleDateString("pt-BR"),
      commonGoal: `Garantir que toda a turma explore e domine ${lessonTheme.toLowerCase()} com base no objetivo curricular: "${pedagogicalGoal}".`,
      directInstruction: `Hoje vamos explorar ${lessonTheme}. Você poderá demonstrar o que entendeu escolhendo o caminho que melhor expressa seu pensamento: texto, mapa visual, tirinha, gravação em áudio ou cartões móveis.`,
      stepByStepVersion: [
        `Etapa 1 (5 min): Previsibilidade — Apresentar roteiro visual com as etapas da aula no canto do quadro.`,
        `Etapa 2 (10 min): Apresentação Visual — Exibir o conceito central com apoio de imagens claras, sem sobrecarga de leitura.`,
        `Etapa 3 (20 min): Produção Acessível — O estudante escolhe seu caminho de expressão (individualmente ou em dupla).`,
        `Etapa 4 (5 min): Pausa Sensorial Suave — Momento para descompressão, esticar o corpo, beber água ou silêncio.`,
        `Etapa 5 (10 min): Conclusão sem Pressão — Compartilhamento voluntário do que foi produzido (sem exigência de fala obrigatória).`,
      ],
      suggestedVisualSupport: [
        "Roteiro da aula no quadro em tópicos visuais com caixas de seleção.",
        "Fichas móveis com imagens concretas ilustrando os conceitos centrais.",
        "Timer visual ou combinados de tempo prévios ('Faltam 5 minutos para a próxima etapa').",
        "Modelo de exemplo concreto já pronto para servir de consulta e diminuir a hesitação inicial.",
      ],
      alternativeParticipation: [
        "Participação em duplas estruturadas com papéis divididos (um pesquisa a imagem, outro organiza).",
        "Possibilidade de trabalhar individualmente em mesa de menor circulação da sala.",
        "Ordenação de cartões e palavras-chave em vez de cópia manual exaustiva.",
        "Uso de tecnologia (tablet, computador ou gravador escolar) para registro da produção.",
      ],
      alternativeResponseForms: [
        "Produção textual direta ou por tópicos curtos.",
        "Áudio gravado no celular ou gravador da escola explicando o conceito em 1 minuto.",
        "Sequência de imagens ou cartões numerados em ordem cronológica.",
        "História em quadrinhos (HQ) ou tirinha ilustrada com balões curtos.",
        "Mapa mental ou esquema com setas relacionando as partes do tema.",
        "Comunicação Aumentativa e Alternativa (CAA) com apoio de pranchas temáticas.",
      ],
      multiplePathways: [
        { format: "Texto Convencional", description: "Produção escrita livre ou preenchimento de palavras-chave estruturadas." },
        { format: "Áudio / Relato Oral", description: "Explicação em fala natural gravada ou diálogo direto com o professor/colega." },
        { format: "Sequência de Imagens", description: "Ordenação visual cronológica ou colagem de cartões temáticos." },
        { format: "História em Quadrinhos", description: "Desenho em vinhetas com situações práticas do conceito estudado." },
        { format: "Mapa Mental / Esquema", description: "Diagrama visual com setas, cores e conceitos-chave interligados." },
        { format: "Tecnologia / CAA", description: "Uso de aplicativo, apresentação em slides ou pranchas de comunicação assistiva." },
      ],
      contextualEngagement: [
        `Conectar ${lessonTheme} aos interesses relatados (${studentInterests || "cultura, jogos ou vida cotidiana"}): usar esses elementos como pontes de significado e entusiasmo, sem inferir diagnósticos.`,
        "Utilizar referências do território e do dia a dia local para tornar o aprendizado tangível e contextualizado.",
        "Dar autonomia na escolha do formato para aumentar o engajamento e a segurança do estudante.",
      ],
      environmentalAdaptations: [
        "Permitir fones de redução de ruído ou abafadores para estudantes com sensibilidade auditiva.",
        "Posicionar o estudante em mesa com boa visibilidade e longe do fluxo intenso da porta.",
        "Diminuir estímulos concorrentes (evitar conversas paralelas simultâneas ao momento de instrução).",
        "Garantir acesso a um espaço tranquilo de autorregulação se houver sinais de cansaço ou sobrecarga.",
      ],
      teacherNotes: [
        "Princípio 'Mesmo objetivo, diferentes caminhos': as alternativas não são 'atividades mais fáceis', mas formas legítimas de acesso e expressão.",
        "Diagnóstico formal NÃO é condição para inclusão: qualquer estudante pode e deve se beneficiar destas adaptações.",
        "Acolha a forma de expressão escolhida com a mesma validação pedagógica das produções convencionais.",
        "Evite cobrar rapidez na entrega: priorize a apropriação do conceito sobre a velocidade motora de escrita.",
      ],
    };

    setCurrentPlan(plan);
  };

  const generatePlainTextToExport = () => {
    if (!currentPlan) return "";
    return `=====================================================
PROPOSTA DE ATIVIDADE PEDAGÓGICA ACESSÍVEL
NeuroConecta • Planejamento Inclusivo do Professor
(Baseado no Desenho Universal para a Aprendizagem - DUA)
=====================================================

1. IDENTIFICAÇÃO DA AULA
• Disciplina / Área: ${currentPlan.subject}
• Ano / Série: ${currentPlan.gradeLevel}
• Tema da Aula: ${currentPlan.lessonTheme}
• Duração Estimada: ${currentPlan.duration}
• Objetivo Pedagógico Base: ${currentPlan.pedagogicalGoal}
• Recursos Disponíveis: ${currentPlan.availableResources}
• Necessidades Observadas na Turma: ${currentPlan.observableNeeds}
• Data de Planejamento: ${currentPlan.generatedAt}

2. OBJETIVO COMUM DA TURMA
${currentPlan.commonGoal}

3. INSTRUÇÃO PRINCIPAL EM LINGUAGEM DIRETA
"${currentPlan.directInstruction}"

4. VERSÃO DA ATIVIDADE EM PASSOS CURTOS
${currentPlan.stepByStepVersion.map((s, i) => `${s}`).join("\n")}

5. APOIO VISUAL SUGERIDO
${currentPlan.suggestedVisualSupport.map((v, i) => `• ${v}`).join("\n")}

6. FORMAS ALTERNATIVAS DE PARTICIPAÇÃO
${currentPlan.alternativeParticipation.map((p, i) => `• ${p}`).join("\n")}

7. FORMAS ALTERNATIVAS DE RESPOSTA / AVALIAÇÃO
${currentPlan.alternativeResponseForms.map((r, i) => `• ${r}`).join("\n")}

8. ADAPTAÇÕES SIMPLES PARA O AMBIENTE
${currentPlan.environmentalAdaptations.map((a, i) => `• ${a}`).join("\n")}

9. OBSERVAÇÕES E BOAS PRÁTICAS PARA O PROFESSOR
${currentPlan.teacherNotes.map((n, i) => `• ${n}`).join("\n")}

=====================================================
Princípio Fundamental: O professor não é responsável por diagnosticar
ou tratar condições clínicas. Não é necessário um diagnóstico para
oferecer diferentes formas de participação, comunicação e acesso ao conteúdo.
=====================================================`;
  };

  const handleCopy = () => {
    const text = generatePlainTextToExport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    if (!currentPlan) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Planejamento de Atividade Acessível - NeuroConecta</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #0f172a; line-height: 1.6; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 20px; }
            h1 { margin: 0; font-size: 20px; color: #0f172a; }
            .subtitle { color: #0d9488; font-weight: bold; font-size: 13px; margin-top: 4px; }
            .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
            .box-title { font-size: 14px; font-weight: bold; color: #0d9488; text-transform: uppercase; margin-bottom: 8px; }
            ul { margin: 6px 0 0 20px; padding: 0; }
            li { margin-bottom: 6px; font-size: 13px; color: #334155; }
            .badge { display: inline-block; background: #0d9488; color: white; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; }
            .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 11px; color: #64748b; text-align: center; }
            @media print { body { margin: 12mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>NeuroConecta • Planejamento de Atividade Pedagógica Acessível</h1>
            <div class="subtitle">${currentPlan.lessonTheme} — ${currentPlan.subject} (${currentPlan.gradeLevel})</div>
          </div>

          <div class="box">
            <div class="box-title">1. Informações Gerais da Aula</div>
            <p><strong>Objetivo Pedagógico Comum:</strong> ${currentPlan.commonGoal}</p>
            <p><strong>Duração:</strong> ${currentPlan.duration} | <strong>Recursos:</strong> ${currentPlan.availableResources}</p>
            <p><strong>Necessidades Observadas:</strong> ${currentPlan.observableNeeds}</p>
          </div>

          <div class="box">
            <div class="box-title">2. Instrução Principal (Linguagem Direta)</div>
            <p style="font-size: 14px; font-style: italic; color: #0f172a;">"${currentPlan.directInstruction}"</p>
          </div>

          <div class="box">
            <div class="box-title">3. Versão da Atividade em Passos Curtos</div>
            <ul>
              ${currentPlan.stepByStepVersion.map(s => `<li>${s}</li>`).join("")}
            </ul>
          </div>

          <div class="box">
            <div class="box-title">4. Apoio Visual Sugerido</div>
            <ul>
              ${currentPlan.suggestedVisualSupport.map(v => `<li>${v}</li>`).join("")}
            </ul>
          </div>

          <div class="box">
            <div class="box-title">5. Formas Alternativas de Participação & Resposta</div>
            <p><strong>Participação:</strong></p>
            <ul>${currentPlan.alternativeParticipation.map(p => `<li>${p}</li>`).join("")}</ul>
            <p style="margin-top: 8px;"><strong>Formas de Resposta:</strong></p>
            <ul>${currentPlan.alternativeResponseForms.map(r => `<li>${r}</li>`).join("")}</ul>
          </div>

          <div class="box">
            <div class="box-title">6. Adaptações do Ambiente & Boas Práticas</div>
            <ul>
              ${currentPlan.environmentalAdaptations.map(a => `<li>${a}</li>`).join("")}
              ${currentPlan.teacherNotes.map(n => `<li>${n}</li>`).join("")}
            </ul>
          </div>

          <div class="footer">
            NeuroConecta • Desenvolvido por SISTEMASTOP Soluções Tecnológicas • Crato - CE • Emissão: ${currentPlan.generatedAt}
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleToggleWorkedStrategy = (strategy: string) => {
    setSelectedWorkedStrategies((prev) =>
      prev.includes(strategy) ? prev.filter((s) => s !== strategy) : [...prev, strategy]
    );
  };

  const handleSaveWhatWorked = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorkedStrategies.length === 0 && !workedNotes.trim()) return;

    const newLog: ActivityWhatWorkedLog = {
      id: `ww-${Date.now()}`,
      date: new Date().toLocaleDateString("pt-BR"),
      lessonTheme: currentPlan?.lessonTheme || lessonTheme || "Atividade Escolar",
      subject: currentPlan?.subject || subject || "Geral",
      strategiesWorked: selectedWorkedStrategies,
      notes: workedNotes.trim(),
    };

    const updated = [newLog, ...whatWorkedLogs];
    setWhatWorkedLogs(updated);
    try {
      localStorage.setItem("neuroconecta_activity_what_worked", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setSelectedWorkedStrategies([]);
    setWorkedNotes("");
    setSavedFeedbackSuccess(true);
    setTimeout(() => setSavedFeedbackSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Princípio Pedagógico e Não Exigência de Diagnóstico (Itens 10 e 11 do Adendo) */}
      <div className={`p-5 rounded-2xl border space-y-3 ${
        isDark ? "bg-teal-950/40 border-teal-800/80 text-teal-200" : "bg-teal-50 border-teal-200 text-teal-900"
      }`}>
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
            <h3 className="font-bold text-sm sm:text-base">
              Princípio Pedagógico: O Professor não diagnostica — Acessibiliza!
            </h3>
            <p className="opacity-95">
              <strong>O professor não é responsável por diagnosticar ou tratar condições clínicas.</strong> O papel da escola e desta ferramenta é: tornar as atividades pedagógicas acessíveis, organizar instruções em etapas, oferecer múltiplos modos de participação, utilizar apoio visual e colaborar com a família e a equipe de AEE.
            </p>
            <div className={`p-3 rounded-xl border text-xs ${
              isDark ? "bg-slate-900/80 border-teal-900 text-slate-300" : "bg-white/90 border-teal-100 text-slate-800"
            }`}>
              <strong className="text-teal-400 dark:text-teal-300 block mb-1">
                Não é necessário um diagnóstico formal para adaptar o ensino:
              </strong>
              Beneficiam-se destas adaptações quem prefere instruções visuais, quem precisa de tempo adicional, quem aprende melhor por etapas fracionadas, quem necessita de previsibilidade, quem se comunica melhor por escrito ou por alternativas à fala, e qualquer estudante em processo de aprendizagem.
            </div>
          </div>
        </div>
      </div>

      {/* Form and Generation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters */}
        <div className={`lg:col-span-5 p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-500" />
                <span>Dados do Planejamento</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Preencha os campos da sua aula</p>
            </div>

            {/* Template Presets */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyExampleTemplate("ciencias")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-teal-300 rounded-lg"
                title="Exemplo Ciências"
              >
                Ciências
              </button>
              <button
                type="button"
                onClick={() => applyExampleTemplate("historia")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-amber-300 rounded-lg"
                title="Exemplo História"
              >
                História
              </button>
              <button
                type="button"
                onClick={() => applyExampleTemplate("matematica")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-cyan-300 rounded-lg"
                title="Exemplo Matemática"
              >
                Matemática
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Objetivo Pedagógico da Aula:
              </label>
              <textarea
                rows={2}
                value={pedagogicalGoal}
                onChange={(e) => setPedagogicalGoal(e.target.value)}
                placeholder="Ex: Compreender as quatro estações e suas características climáticas..."
                className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Disciplina / Área:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Língua Portuguesa"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ano / Série:
                </label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="Ex: 6º Ano Fundamental"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tema da Aula:
                </label>
                <input
                  type="text"
                  value={lessonTheme}
                  onChange={(e) => setLessonTheme(e.target.value)}
                  placeholder="Ex: Gênero Textual Notícia"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duração Estimada:
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 50 minutos (com pausas)"
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recursos Disponíveis na Escola:
              </label>
              <input
                type="text"
                value={availableResources}
                onChange={(e) => setAvailableResources(e.target.value)}
                placeholder="Ex: Quadro branco, cartolinas, canetas, projetor, tesouras"
                className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Interesses & Contexto Significativo:
                </label>
                <span className="text-[10px] text-teal-400 font-semibold">(Engajador pedagógico)</span>
              </div>
              <input
                type="text"
                value={studentInterests}
                onChange={(e) => setStudentInterests(e.target.value)}
                placeholder="Ex: Jogos (Minecraft), música, trens, mapas, arte, tecnologia..."
                className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Usado para criar pontes de interesse no conteúdo curricular, sem inferir diagnósticos.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Formas de Participação Desejadas:
              </label>
              <input
                type="text"
                value={desiredParticipation}
                onChange={(e) => setDesiredParticipation(e.target.value)}
                placeholder="Ex: Em duplas estruturadas, individual com apoio visual ou desenho"
                className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Necessidades Observáveis da Turma / Estudante:
                </label>
                <span className="text-[10px] text-teal-500 font-semibold">(Sem exigir laudo)</span>
              </div>
              <textarea
                rows={2}
                value={observableNeeds}
                onChange={(e) => setObservableNeeds(e.target.value)}
                placeholder="Ex: Sensibilidade a ruído, cansaço rápido com escrita manual longa, preferência por etapas visuais..."
                className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={handleGeneratePlan}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg transition mt-2 text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Proposta de Atividade Acessível</span>
            </button>
          </div>
        </div>

        {/* Right Area: Generated Pedagogical Plan */}
        <div className={`lg:col-span-7 p-5 sm:p-6 rounded-3xl border space-y-4 shadow-sm flex flex-col justify-between ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          {!currentPlan ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-300">Pronto para Planejar</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Preencha os campos ao lado com o tema da sua aula ou selecione um dos exemplos (Ciências, História ou Matemática) e clique em <strong>Gerar Proposta</strong>.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-teal-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Plano Acessível Gerado: {currentPlan.lessonTheme}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">{currentPlan.subject} • {currentPlan.gradeLevel}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copiado!" : "Copiar"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir</span>
                  </button>
                </div>
              </div>

              {/* Generated Content Sections */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 text-xs">
                {/* 1. Objetivo Comum & Instrução Direta */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <strong className="text-teal-400 block uppercase tracking-wider text-[10px]">
                    1. Objetivo Comum & Instrução Principal Direta
                  </strong>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {currentPlan.commonGoal}
                  </p>
                  <div className="p-3 bg-teal-950/40 border border-teal-800/60 rounded-xl text-teal-200 italic">
                    "{currentPlan.directInstruction}"
                  </div>
                </div>

                {/* 2. Versão em Passos Curtos */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <strong className="text-amber-400 block uppercase tracking-wider text-[10px]">
                    2. Roteiro da Aula em Passos Curtos (Estrutura Fracionada)
                  </strong>
                  <div className="space-y-1.5">
                    {currentPlan.stepByStepVersion.map((step, idx) => (
                      <div key={idx} className="p-2 bg-slate-900/90 rounded-lg border border-slate-800/80 text-slate-300">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Apoio Visual Sugerido */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <strong className="text-cyan-400 block uppercase tracking-wider text-[10px]">
                    3. Apoio Visual Sugerido para a Sala
                  </strong>
                  <ul className="space-y-1 text-slate-300">
                    {currentPlan.suggestedVisualSupport.map((v, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Eye className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. MESMO OBJETIVO, DIFERENTES CAMINHOS (Item 13 do Adendo) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800/80 pb-2">
                    <strong className="text-amber-400 block uppercase tracking-wider text-[10px]">
                      4. Mesmo Objetivo, Diferentes Caminhos (DUA)
                    </strong>
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-bold">
                      Não é "atividade mais fácil" • São diferentes modos de expressão
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Mesmo objetivo curricular com múltiplos meios de participação e expressão:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentPlan.multiplePathways.map((pathway, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1"
                      >
                        <span className="text-[10px] font-bold text-teal-400 block">
                          • {pathway.format}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {pathway.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. INTERESSES E CONTEXTO SIGNIFICATIVO (Item 14 do Adendo) */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <strong className="text-emerald-400 block uppercase tracking-wider text-[10px]">
                    5. Engajadores Pedagógicos, Contexto & Interesses
                  </strong>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {currentPlan.contextualEngagement.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 italic">
                    Importante: Interesses são recursos de engajamento pedagógico; nunca base para inferência diagnóstica.
                  </p>
                </div>

                {/* 6. Formas Alternativas de Participação e Resposta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <strong className="text-cyan-400 block uppercase tracking-wider text-[10px]">
                      6. Formas de Participação
                    </strong>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {currentPlan.alternativeParticipation.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <strong className="text-indigo-400 block uppercase tracking-wider text-[10px]">
                      7. Formas de Resposta / Entrega
                    </strong>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {currentPlan.alternativeResponseForms.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-400">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 7. Adaptações do Ambiente & Boas Práticas */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                  <strong className="text-purple-400 block uppercase tracking-wider text-[10px]">
                    8. Adaptações Simples de Ambiente & Boas Práticas
                  </strong>
                  <ul className="space-y-1 text-slate-300">
                    {currentPlan.environmentalAdaptations.map((env, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-purple-400">•</span>
                        <span>{env}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-slate-800 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Observações para a mediação pedagógica:
                    </span>
                    <ul className="space-y-1 text-slate-400 text-[11px]">
                      {currentPlan.teacherNotes.map((note, idx) => (
                        <li key={idx}>- {note}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 8. REGISTRO DO QUE FUNCIONOU NESTA ATIVIDADE (Item 15 do Adendo) */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? "bg-slate-950 border-teal-900/60" : "bg-teal-50/50 border-teal-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <strong className="text-teal-400 block uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      9. Registro do que Funcionou Nesta Atividade
                    </strong>
                    <span className="text-[10px] text-teal-300 font-semibold">
                      Memória pedagógica contínua
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Selecione as estratégias que facilitaram o engajamento e a aprendizagem:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Apoio visual e roteiro da aula no quadro",
                      "Divisão da instrução em etapas curtas",
                      "Expressão por áudio / fala gravada",
                      "Expressão por desenho / mapa mental / HQ",
                      "Uso de material manipulável ou cartões móveis",
                      "Conexão da aula com interesses significativos",
                      "Uso de abafador / redução de ruído ambiental",
                      "Trabalho em duplas estruturadas",
                      "Pausa suave para descompressão sensorial",
                    ].map((strat, idx) => {
                      const isSelected = selectedWorkedStrategies.includes(strat);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleWorkedStrategy(strat)}
                          className={`text-left p-2 rounded-xl text-[11px] font-medium transition border flex items-center gap-2 ${
                            isSelected
                              ? "bg-teal-950/80 border-teal-600 text-teal-200"
                              : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                              isSelected
                                ? "bg-teal-600 border-teal-500 text-white"
                                : "border-slate-700 bg-slate-950"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                          <span className="leading-snug">{strat}</span>
                        </button>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSaveWhatWorked} className="space-y-2 pt-1">
                    <textarea
                      rows={2}
                      value={workedNotes}
                      onChange={(e) => setWorkedNotes(e.target.value)}
                      placeholder="Observações complementares: Como o estudante reagiu? O que surpreendeu positivamente? O que ajustar na próxima aula?"
                      className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-teal-500 text-xs ${
                        isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      {savedFeedbackSuccess ? (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registro gravado no histórico de aprendizagem!
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {whatWorkedLogs.length} registros salvos no perfil do estudante
                        </span>
                      )}

                      <button
                        type="submit"
                        disabled={selectedWorkedStrategies.length === 0 && !workedNotes.trim()}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Salvar O Que Funcionou</span>
                      </button>
                    </div>
                  </form>

                  {/* Past logs preview */}
                  {whatWorkedLogs.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Histórico do Que Funcionou em Aulas Anteriores:
                      </span>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {whatWorkedLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-2 bg-slate-900/60 border border-slate-800/80 rounded-xl text-[11px] space-y-1"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-bold text-teal-300">{log.lessonTheme} ({log.subject})</span>
                              <span>{log.date}</span>
                            </div>
                            {log.strategiesWorked.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {log.strategiesWorked.map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 bg-slate-800 text-teal-300 text-[10px] rounded border border-slate-700"
                                  >
                                    ✓ {s}
                                  </span>
                                ))}
                              </div>
                            )}
                            {log.notes && (
                              <p className="text-slate-300 italic text-[10px]">
                                "{log.notes}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
