import { SavedTestResult } from "../types";

const GLOBAL_HISTORY_KEY = "neuroconecta_global_assessments_db";
const LOCAL_USER_HISTORY_KEY = "neuroconecta_test_history";

export const getGlobalTestHistory = (): SavedTestResult[] => {
  try {
    const stored = localStorage.getItem(GLOBAL_HISTORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Erro ao carregar histórico global de autoavaliações:", e);
  }
  return seedInitialDemonstrationHistory();
};

export const getUserTestHistory = (userId?: string): SavedTestResult[] => {
  const all = getGlobalTestHistory();
  if (!userId) return all;
  return all.filter((item) => item.userId === userId || !item.userId);
};

export const saveTestResultToStore = (result: SavedTestResult): SavedTestResult[] => {
  try {
    const all = getGlobalTestHistory();
    // Filter out if duplicate ID exists
    const updated = [result, ...all.filter((i) => i.id !== result.id)];
    localStorage.setItem(GLOBAL_HISTORY_KEY, JSON.stringify(updated));
    localStorage.setItem(LOCAL_USER_HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Erro ao salvar resultado no banco de dados local:", e);
    return [];
  }
};

export const seedInitialDemonstrationHistory = (): SavedTestResult[] => {
  const initialSeeds: SavedTestResult[] = [
    {
      id: "res-seed-101",
      userId: "usr-paciente-1",
      userName: "Mariana Souza Lima",
      userRole: "pcd",
      testId: "raads-r",
      testTitle: "RAADS-R (Ritvo Asperger Autism Diagnostic Scale - Revised)",
      score: 68,
      maxScore: 90,
      date: "04/08/2026",
      interpretationLevel: "Pontuação Significativa para TEA (Corte Clínico RAADS-R Ultrapassado)",
      validatedClinically: true,
      validationReference: "Ritvo et al. (2011) - Journal of Autism and Developmental Disorders",
      clinicalStatus: "Analisado por Medicina & Enfermagem",
      domainScores: {
        "Relacionamento Social": { scored: 21, max: 27 },
        "Interesses Circunscritos": { scored: 18, max: 24 },
        "Linguagem": { scored: 14, max: 18 },
        "Funções Sensório-Motoras": { scored: 15, max: 21 },
      },
      technicalReview:
        "Análise psicométrica e monografia clínica referente à aplicação da escala RAADS-R em indivíduo adulto. O resultado global apresentou pontuação expressiva de 68 pontos, superando substancialmente o limiar de corte estatístico validado internacionalmente (65 pontos). Observa-se maior acentuamento nos domínios socioemocional e sensório-motor, caracterizado por acentuada rigidez em normas não explícitas de convivência interpessoal, acompanhada de fadiga compensatória por mascaramento social prolongado. Na dimensão perceptivo-sensorial, sobressaem hiper-reatividade auditiva a ruídos contínuos de média frequência e sobrecarga proprioceptiva em ambientes abertos. Recomenda-se a condução de encaminhamento para protocolo multiprofissional com neuropediatria ou psiquiatria da neurodivergência para emissão de laudo diagnóstico formal e estabelecimento de plano de acomodação razoável no ambiente acadêmico e laboral.",
      recommendation:
        "Recomenda-se acompanhamento multiprofissional contínuo, investigação formal complementar via WAIS-IV/ADI-R se necessário e implementação imediata de acomodações sensoriais no trabalho e estudos.",
    },
    {
      id: "res-seed-102",
      userId: "usr-paciente-2",
      userName: "Carlos Eduardo Mendes",
      userRole: "pcd",
      testId: "catq",
      testTitle: "Máscara Social & Camuflagem (CAT-Q)",
      score: 16,
      maxScore: 18,
      date: "02/08/2026",
      interpretationLevel: "Alta Carga de Camuflagem Social (Máscara Intensa)",
      validatedClinically: true,
      validationReference: "Hull et al. (2019) - Journal of Autism and Developmental Disorders",
      clinicalStatus: "Acompanhamento CAPS / Enfermagem",
      domainScores: {
        Compensação: { scored: 6, max: 6 },
        Mascaramento: { scored: 5, max: 6 },
        Assimilação: { scored: 5, max: 6 },
      },
      technicalReview:
        "Resenha técnica avaliativa dos índices de camuflagem do questionário CAT-Q. A aferição quantitativa apontou escore elevado de 16 pontos, sinalizando o emprego extensivo e hipervigilante de mecanismos de supressão de traços autistas autóctones e imitação ativa de repertórios neurotípicos. Este padrão de hiper-compensação relaciona-se diretamente a taxas elevadas de esgotamento e episódios frequentes de colapso energético posterior (shutdown), exigindo intervenções focadas em desmascaramento seguro e validação de estratégias de regulação motora e sensorial sem inibição social forçada.",
      recommendation:
        "Priorizar estratégias de descompressão diária, acolhimento em grupos neuroafirmativos e psicoeducação sobre os custos metabólicos da camuflagem social contínua.",
    },
    {
      id: "res-seed-103",
      userId: "usr-paciente-3",
      userName: "Lucas Gabriel Rocha",
      userRole: "pcd",
      testId: "burnout",
      testTitle: "Avaliação de Burnout Autista",
      score: 15,
      maxScore: 18,
      date: "01/08/2026",
      interpretationLevel: "Burnout Autista Severo / Sobrecarga Crítica",
      validatedClinically: true,
      validationReference: "Raymaker et al. (2020) - Autism in Adulthood",
      clinicalStatus: "Protocolo de Emergência Ativado",
      technicalReview:
        "Parecer técnico psicossocial sobre o quadro de burnout autista. O paciente atinge o escore de 15 pontos, denotando estado crítico de exaustão bio-psico-sensorial e regressão temporária no desempenho de funções executivas essenciais. Verifica-se perda da tolerância a estímulos cotidianos, paralisações comunicativas frequentes e necessidade imperiosa de retração social imediata. O quadro difere do burnout ocupacional clássico por envolver o colapso do sistema de regulação autônomo decorrente de adaptação ambiental forçada e falta de acessibilidade.",
      recommendation:
        "Redução drástica de demandas exógenas, ativação de plano de baixa estimulação no aplicativo e suporte da equipe de enfermagem/psiquiatria para ajuste de rotina.",
    },
  ];

  try {
    localStorage.setItem(GLOBAL_HISTORY_KEY, JSON.stringify(initialSeeds));
    localStorage.setItem(LOCAL_USER_HISTORY_KEY, JSON.stringify(initialSeeds));
  } catch (e) {
    console.error(e);
  }
  return initialSeeds;
};
