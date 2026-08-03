import { TestDefinition } from "../types";

export const TESTS_LIST: TestDefinition[] = [
  {
    id: "aq10",
    title: "AQ-10 (Autism Spectrum Quotient)",
    shortDescription: "Triagem rápida de 10 perguntas para identificar traços do espectro autista em adultos.",
    fullDescription: "O AQ-10 é uma versão reduzida do Autism Spectrum Quotient desenvolvida pela Universidade de Cambridge (NICE guidelines). Avalia atenção a detalhes, troca de tarefas, atenção social e comunicação.",
    estimatedMinutes: 3,
    questionsCount: 10,
    questions: [
      {
        id: 1,
        text: "Geralmente percebo sons pequenos e discretos quando os outros não parecem notar.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 0 },
          { label: "Concordo parcialmente", score: 1 },
          { label: "Concordo totalmente", score: 1 },
        ],
      },
      {
        id: 2,
        text: "Costumo focar mais no quadro geral do que nas partes individuais de um assunto.",
        options: [
          { label: "Discordo totalmente", score: 1 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 0 },
          { label: "Concordo totalmente", score: 0 },
        ],
      },
      {
        id: 3,
        text: "Acho fácil fazer mais de uma coisa ao mesmo tempo em uma conversa ou grupo.",
        options: [
          { label: "Discordo totalmente", score: 1 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 0 },
          { label: "Concordo totalmente", score: 0 },
        ],
      },
      {
        id: 4,
        text: "Se houver uma interrupção, consigo voltar ao que estava fazendo muito rapidamente.",
        options: [
          { label: "Discordo totalmente", score: 1 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 0 },
          { label: "Concordo totalmente", score: 0 },
        ],
      },
      {
        id: 5,
        text: "Acho fácil 'ler nas entrelinhas' quando alguém está falando comigo.",
        options: [
          { label: "Discordo totalmente", score: 1 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 0 },
          { label: "Concordo totalmente", score: 0 },
        ],
      },
      {
        id: 6,
        text: "Consigo identificar facilmente se o meu ouvinte está entediado ou desinteressado.",
        options: [
          { label: "Discordo totalmente", score: 1 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 0 },
          { label: "Concordo totalmente", score: 0 },
        ],
      },
      {
        id: 7,
        text: "Quando estou lendo uma história, acho difícil descobrir as intenções dos personagens.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 0 },
          { label: "Concordo parcialmente", score: 1 },
          { label: "Concordo totalmente", score: 1 },
        ],
      },
      {
        id: 8,
        text: "Gosto de coletar informações sobre categorias de coisas (ex: tipos de carros, trens, plantas, fatos históricos).",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 0 },
          { label: "Concordo parcialmente", score: 1 },
          { label: "Concordo totalmente", score: 1 },
        ],
      },
      {
        id: 9,
        text: "Acho fácil adivinhar o que alguém está sentindo apenas olhando para a expressão do seu rosto.",
        options: [
          { label: "Discordo totalmente", score: 1 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 0 },
          { label: "Concordo totalmente", score: 0 },
        ],
      },
      {
        id: 10,
        text: "Acho difícil fazer novos amigos ou entender intuitivamente regras sociais não escritas.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 0 },
          { label: "Concordo parcialmente", score: 1 },
          { label: "Concordo totalmente", score: 1 },
        ],
      },
    ],
    interpretResult: (score: number) => {
      if (score >= 6) {
        return {
          level: "Pontuação Significativa (>= 6/10)",
          summary: "Sua pontuação indica a presença marcante de traços autistas significativos de acordo com o protocolo AQ-10.",
          recommendation: "É recomendada uma avaliação diagnóstica multiprofissional (com psicólogo especializado em neurodivergência ou neurologista/psiquiatra) para investigação formal.",
          tips: [
            "Conhecer mais sobre o autismo adulto e perfis sensoriais pode trazer alívio e clareza.",
            "Considere explorar estratégias de regulação sensorial e respeito aos seus limites cognitivos.",
            "Converse com nosso assistente virtual NeuroConecta para receber dicas de acomodações no cotidiano."
          ],
        };
      } else {
        return {
          level: "Pontuação Moderada ou Baixa (< 6/10)",
          summary: "Sua pontuação no AQ-10 sugere menor número de traços autistas clássicos de triagem rápida.",
          recommendation: "Lembre-se de que o AQ-10 é apenas uma triagem inicial. Se você sente dificuldades sociais, sensoriais ou de esgotamento, vale conversar com um profissional de saúde mental.",
          tips: [
            "Pessoas com perfil de camuflagem (máscara social alta) às vezes pontuam mais baixo no AQ-10.",
            "Sugerimos realizar o teste de Máscara Social (CAT-Q) ou Perfil Sensorial para entender melhor suas necessidades específicas."
          ],
        };
      }
    },
  },
  {
    id: "sqeq",
    title: "Empatia e Sistematização (SQ-EQ)",
    shortDescription: "Avaliação do equilíbrio entre o impulso de analisar sistemas (SQ) e empatia intuitiva (EQ).",
    fullDescription: "Avalia a tendência cognitiva entre busca de padrões/regras em sistemas (Sistematização) e compreensão imediata de estados emocionais sem regras explícitas (Empatia Cognitiva e Afetiva).",
    estimatedMinutes: 4,
    questionsCount: 8,
    questions: [
      {
        id: 1,
        text: "Acho fascinante entender como mecanismos, tabelas, código ou regras lógicas funcionam.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 2 },
          { label: "Concordo totalmente", score: 3 },
        ],
      },
      {
        id: 2,
        text: "Consigo notar facilmente se alguém em um grupo se sente desconfortável ou excluído sem que a pessoa diga.",
        options: [
          { label: "Concordo totalmente", score: 0 },
          { label: "Concordo parcialmente", score: 1 },
          { label: "Discordo parcialmente", score: 2 },
          { label: "Discordo totalmente", score: 3 },
        ],
      },
      {
        id: 3,
        text: "Gosto de organizar minhas ideias, horários ou coleções em categorias estruturadas.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 2 },
          { label: "Concordo totalmente", score: 3 },
        ],
      },
      {
        id: 4,
        text: "Muitas vezes acho difícil saber como reagir quando uma pessoa chora ou expressa emoções intensas de forma espontânea.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 2 },
          { label: "Concordo totalmente", score: 3 },
        ],
      },
      {
        id: 5,
        text: "Prefiro instruções claras, explícitas e por escrito a orientações informais e abertas.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 2 },
          { label: "Concordo totalmente", score: 3 },
        ],
      },
      {
        id: 6,
        text: "Costumo me preocupar profundamente com o bem-estar dos outros, mesmo que nem sempre saiba como demonstrar verbalmente.",
        options: [
          { label: "Discordo totalmente", score: 3 },
          { label: "Discordo parcialmente", score: 2 },
          { label: "Concordo parcialmente", score: 1 },
          { label: "Concordo totalmente", score: 0 },
        ],
      },
      {
        id: 7,
        text: "Presto muita atenção a inconsistências lógicas em conversas ou argumentos.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 2 },
          { label: "Concordo totalmente", score: 3 },
        ],
      },
      {
        id: 8,
        text: "Sinto que minha empatia funciona através do raciocínio lógico e da justiça, e não por 'contágio emocional' automático.",
        options: [
          { label: "Discordo totalmente", score: 0 },
          { label: "Discordo parcialmente", score: 1 },
          { label: "Concordo parcialmente", score: 2 },
          { label: "Concordo totalmente", score: 3 },
        ],
      },
    ],
    interpretResult: (score: number) => {
      if (score >= 15) {
        return {
          level: "Perfil Hiper-Sistematizador / Empatia Racional",
          summary: "Seu perfil indica forte preferência por lógica, previsibilidade e estrutura sistemática para processar o mundo e as relações.",
          recommendation: "Isso é uma grande força analítica! Para interações sociais, apoie-se em regras claras e comunicação explícita.",
          tips: [
            "Use tabelas e organizadores visuais para aliviar a carga cognitiva.",
            "Não hesite em pedir às pessoas que sejam diretas e explícitas em suas solicitações emocionais."
          ],
        };
      } else {
        return {
          level: "Perfil Equilibrado ou Empatia Intuitiva",
          summary: "Sua pontuação aponta um equilíbrio ou maior fluidez na leitura social intuitiva combinada à análise de sistemas.",
          recommendation: "Observe em quais momentos você se apoia mais na intuição social e em quais busca estrutura rígida.",
          tips: [
            "Respeite seus momentos de cansaço após eventos sociais intensos.",
            "Continue combinando sua percepção empática com estruturas lógicas de organização."
          ],
        };
      }
    },
  },
  {
    id: "sensory",
    title: "Perfil Sensorial Simplificado",
    shortDescription: "Mapeie hipersensibilidades e busca de estímulos sensoriais (luz, som, toque, texturas).",
    fullDescription: "Identifique como seu sistema nervoso reage a estímulos do ambiente diário. Pessoas autistas frequentemente apresentam hiper-reatividade (sensibilidade excessiva) ou hipo-reatividade (busca de estímulos).",
    estimatedMinutes: 4,
    questionsCount: 6,
    questions: [
      {
        id: 1,
        text: "Luzes fluorescentes, brilhantes ou piscantes causam cansaço visual, dor de cabeça ou irritabilidade rápida em você?",
        options: [
          { label: "Raramente / Nunca", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre / Severo", score: 3 },
        ],
      },
      {
        id: 2,
        text: "Locais barulhentos ou com múltiplos sons simultâneos (ex: praça de alimentação, festas) tornam difícil entender quem fala ou causam ansiedade?",
        options: [
          { label: "Raramente / Nunca", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre / Severo", score: 3 },
        ],
      },
      {
        id: 3,
        text: "Etiquetas de roupas, tecidos sintéticos, costuras de meias ou toques físicos inesperados incomodam muito?",
        options: [
          { label: "Raramente / Nunca", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre / Severo", score: 3 },
        ],
      },
      {
        id: 4,
        text: "Você se sente mal com certas texturas de alimentos ou cheiros fortes que outras pessoas parecem ignorar?",
        options: [
          { label: "Raramente / Nunca", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre / Severo", score: 3 },
        ],
      },
      {
        id: 5,
        text: "Você sente necessidade de fazer movimentos repetitivos com as mãos, balançar o corpo ou apertar objetos para se acalmar (stimming)?",
        options: [
          { label: "Raramente / Nunca", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre / Severo", score: 3 },
        ],
      },
      {
        id: 6,
        text: "Após passar algumas horas em ambientes muito estimulantes, você sente necessidade imperativa de ficar em um local escuro e silencioso?",
        options: [
          { label: "Raramente / Nunca", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre / Severo", score: 3 },
        ],
      },
    ],
    interpretResult: (score: number) => {
      if (score >= 11) {
        return {
          level: "Hipersensibilidade Sensorial Elevada",
          summary: "Seu sistema nervoso é altamente reativo a estímulos do ambiente. O acúmulo sensorial pode levar a esgotamento ou crises se não houver pausas.",
          recommendation: "Priorize acomodações sensoriais ativas no seu dia a dia (fones de ouvido com cancelamento de ruído, óculos escuros, roupas confortáveis sem etiquetas).",
          tips: [
            "Configure 'Pausas Sensoriais' na aba de Rotina do NeuroConecta.",
            "Anote seus gatilhos sensoriais específicos na aba de Regulação Sensorial.",
            "Permita-se praticar stimming autorregulado para descarregar a tensão."
          ],
        };
      } else {
        return {
          level: "Sensibilidade Sensorial Moderada ou Mista",
          summary: "Você apresenta algumas reações a estímulos específicos, mantendo boa tolerância em outros aspectos.",
          recommendation: "Identifique os canais sensoriais que mais te afetam (ex: som ou luz) para fazer pequenos ajustes pontuais.",
          tips: [
            "Tenha sempre um fone ou protetor auricular na bolsa por precaução.",
            "Respeite sua necessidade de silêncio após dias atípicos."
          ],
        };
      }
    },
  },
  {
    id: "burnout",
    title: "Avaliação de Burnout Autista",
    shortDescription: "Mede o nível de esgotamento profundo, perda de habilidades e fadiga de mascaramento.",
    fullDescription: "O Burnout Autista é um estado de exaustão profunda física, mental e emocional causado pelo esforço prolongado de viver em um ambiente inadequado ao seu funcionamento neurodivergente.",
    estimatedMinutes: 3,
    questionsCount: 6,
    questions: [
      {
        id: 1,
        text: "Sinto uma fadiga extrema que não melhora mesmo após uma noite normal de sono.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Quase sempre / Diariamente", score: 3 },
        ],
      },
      {
        id: 2,
        text: "Sinto que perdi temporariamente habilidades que costumava ter (ex: tolerar barulho, falar em público, organizar a rotina).",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Quase sempre / Diariamente", score: 3 },
        ],
      },
      {
        id: 3,
        text: "Minha tolerância a pequenas frustrações ou estímulos sensoriais diminuiu drasticamente.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Quase sempre / Diariamente", score: 3 },
        ],
      },
      {
        id: 4,
        text: "Sinto ansiedade ou bloqueio intenso ao pensar em cumprir tarefas sociais ou de trabalho diárias.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Quase sempre / Diariamente", score: 3 },
        ],
      },
      {
        id: 5,
        text: "Sinto necessidade premente de me isolar totalmente do mundo por dias para conseguir funcionar novamente.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Quase sempre / Diariamente", score: 3 },
        ],
      },
      {
        id: 6,
        text: "Tenho tido episódios mais frequentes de paralisação (shutdown) ou crises de choro e sobrecarga (meltdown).",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Quase sempre / Diariamente", score: 3 },
        ],
      },
    ],
    interpretResult: (score: number) => {
      if (score >= 12) {
        return {
          level: "Burnout Autista Severo / Sobrecarga Crítica",
          summary: "Sua pontuação sinaliza um nível elevado de esgotamento. Seu corpo e mente estão pedindo alívio e desaceleração imediatos.",
          recommendation: "É fundamental reduzir a carga de demandas sociais e sensoriais. O burnout autista necessita de descanso verdadeiro e desmascaramento gradual.",
          tips: [
            "Ative o 'Modo de Baixa Estimulação' e use o Botão de Crise/Calma do app se sentir sobrecarga.",
            "Considere pedir afastamento ou redução temporária de demandas se possível.",
            "Busque apoio de um psicólogo neurodivergente ou especializado em TEA."
          ],
        };
      } else if (score >= 6) {
        return {
          level: "Sinais Iniciais de Esgotamento / Alerta",
          summary: "Você está acumulando fadiga cognitiva e sensorial. É o momento ideal para intervir antes de atingir um colapso.",
          recommendation: "Introduza blocos fixos de descanso não negociáveis na sua rotina diária.",
          tips: [
            "Reveja os compromissos que podem ser delegados ou adiados.",
            "Pratique a autorregulação e evite assumir novas responsabilidades sociais por agora."
          ],
        };
      } else {
        return {
          level: "Nível de Energia Estável",
          summary: "Sua pontuação sugere boa reserva de energia no momento.",
          recommendation: "Mantenha seus hábitos de autorregulação e pausas preventivas para preservar sua saúde mental.",
          tips: [
            "Continue acompanhando seu nível de fadiga semanalmente."
          ],
        };
      }
    },
  },
  {
    id: "catq",
    title: "Máscara Social / Camuflagem (CAT-Q adaptado)",
    shortDescription: "Mede o esforço empregado para disfarçar traços autistas em público e parecer neurotípico.",
    fullDescription: "Avalia estratégias de assimilação, compensação e mascaramento social. O camuflamento prolongado é um dos maiores fatores de risco para diagnóstico tardio e burnout autista.",
    estimatedMinutes: 3,
    questionsCount: 6,
    questions: [
      {
        id: 1,
        text: "Ensaio mentalmente conversas, frases e cumprimentos antes de falar com as pessoas.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre", score: 3 },
        ],
      },
      {
        id: 2,
        text: "Forço o contato visual direto com as pessoas mesmo quando isso me causa extremo desconforto ou desconcentração.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre", score: 3 },
        ],
      },
      {
        id: 3,
        text: "Copio expressões faciais, linguagem corporal ou tom de voz de pessoas sociais e populares para 'me encaixar'.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre", score: 3 },
        ],
      },
      {
        id: 4,
        text: "Sufoco ou escondo meus movimentos de stimming (ex: mexer as mãos, balançar o pé) perto de outras pessoas.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre", score: 3 },
        ],
      },
      {
        id: 5,
        text: "Sinto que estou interpretando um papel em uma peça de teatro durante quase todas as minhas interações sociais.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre", score: 3 },
        ],
      },
      {
        id: 6,
        text: "Fico completamente exausto(a) após eventos sociais devido ao esforço consciente de parecendo 'normal'.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre", score: 3 },
        ],
      },
    ],
    interpretResult: (score: number) => {
      if (score >= 12) {
        return {
          level: "Alta Carga de Camuflagem Social (Máscara Intensa)",
          summary: "Sua pontuação reflete um esforço gigantesco e contínuo para passar por neurotípico e evitar rejeição social.",
          recommendation: "Embora a máscara ajude no pertencimento imediato, ela consome enorme energia vital. O desmascaramento seguro com pessoas de confiança traz alívio.",
          tips: [
            "Experimente reduzir o contato visual forçado em ambientes seguros.",
            "Permita-se usar stimming sutil (como um fidget toy discreto) durante conversas.",
            "Utilize os 'Scripts Sociais' do aplicativo para reduzir a necessidade de ensaios exaustivos."
          ],
        };
      } else {
        return {
          level: "Camuflagem Moderada ou Baixa",
          summary: "Seu nível de esforço de mascaramento social é equilibrado ou você se sente mais confortável em ser você mesmo.",
          recommendation: "Continue cultivando espaços e amizades onde sua autenticidade neurodivergente é acolhida sem exigência de atuação.",
          tips: [
            "Mantenha limites claros e comunicação autêntica."
          ],
        };
      }
    },
  },
];
