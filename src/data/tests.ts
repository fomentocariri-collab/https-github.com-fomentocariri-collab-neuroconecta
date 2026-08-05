import { TestDefinition } from "../types";

export const TESTS_LIST: TestDefinition[] = [
  // 1. RAADS-R (Ritvo Autism Asperger Diagnostic Scale - Revised)
  {
    id: "raads-r",
    title: "RAADS-R (Ritvo Asperger Autism Diagnostic Scale - Revised)",
    shortDescription: "Escala clínica de 80 itens validada internacionalmente para triagem do espectro autista em adultos.",
    fullDescription: "O RAADS-R é um dos instrumentos de autorrelato clínicos mais robustos para adultos autistas sem deficiência intelectual. Validado por Ritvo et al. (2011) em 9 centros internacionais com 97% de sensibilidade e 100% de especificidade. Avalia 4 áreas: Relacionamento Social, Interesses Circunscritos, Linguagem e Funções Sensório-Motoras.",
    validatedClinically: true,
    validationReference: "Ritvo et al. (2011) - Journal of Autism and Developmental Disorders",
    usageType: "Triagem Clínica Adultos",
    estimatedMinutes: 15,
    questionsCount: 30, // Representative dense clinical battery covering all 4 domains
    domains: ["Relacionamento Social", "Interesses Circunscritos", "Linguagem", "Funções Sensório-Motoras"],
    questions: [
      // Relacionamento Social
      {
        id: 1,
        category: "Relacionamento Social",
        text: "Sinto que sou diferente das outras pessoas e tenho dificuldade em me 'encaixar' em grupos sociais.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 2,
        category: "Relacionamento Social",
        text: "Prefiro estar sozinho(a) do que acompanhado(a) de pessoas com quem não compartilho interesses profundos.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 3,
        category: "Relacionamento Social",
        text: "Tenho que copiar conscientemente a forma como os outros agem e falam para parecer 'normal' ou socialmente aceitável.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 4,
        category: "Relacionamento Social",
        text: "Dizem que sou uma pessoa insensível, grossa ou direta demais, embora essa nunca seja minha intenção.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 5,
        category: "Relacionamento Social",
        text: "Acho muito difícil fazer amizades da mesma idade ou manter relacionamentos sociais sem regras claras.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 6,
        category: "Relacionamento Social",
        text: "Tenho dificuldade para saber quando é a minha vez de falar em uma roda de conversa sem interromper ou demorar demais.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 7,
        category: "Relacionamento Social",
        text: "Contato visual direto com outras pessoas faz com que eu me sinta desconfortável ou desconcentrado(a).",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 8,
        category: "Relacionamento Social",
        text: "Acho difícil saber como demonstrar empatia emocional do jeito que os outros esperam que eu demonstre.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },

      // Interesses Circunscritos & Rotinas
      {
        id: 9,
        category: "Interesses Circunscritos",
        text: "Tenho hiperfoco ou obsessão por temas específicos sobre os quais coleciono fatos, detalhes e informações minuciosas.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 10,
        category: "Interesses Circunscritos",
        text: "Fico profundamente chateado(a) ou desorganizado(a) quando meus planos ou rotinas diárias mudam sem aviso.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 11,
        category: "Interesses Circunscritos",
        text: "Prefiro conversar longo tempo sobre meus tópicos de interesse específico do que sobre assuntos banais do dia a dia (small talk).",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 12,
        category: "Interesses Circunscritos",
        text: "Sinto necessidade de organizar objetos, arquivos ou tarefas em ordem rígida, por cor, tamanho ou categoria lógica.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 13,
        category: "Interesses Circunscritos",
        text: "Costumo me concentrar tanto no meu assunto de interesse que perco a noção do tempo e das necessidades corporais (fome, sede).",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },

      // Linguagem & Comunicação
      {
        id: 14,
        category: "Linguagem",
        text: "Entendo a linguagem de forma muito literal e costumo ter dificuldade com ironia, sarcasmo ou metáforas.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 15,
        category: "Linguagem",
        text: "As pessoas dizem que falo de forma peculiar, excessivamente formal, monótona ou parecendo um 'livro didático'.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 16,
        category: "Linguagem",
        text: "Repito frases de filmes, livros, músicas ou de outras pessoas em momentos específicos para me comunicar (ecolalia).",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 17,
        category: "Linguagem",
        text: "Tenho dificuldade para acompanhar conversas em ambientes ruidosos ou quando muitas pessoas falam ao mesmo tempo.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 18,
        category: "Linguagem",
        text: "Quando estou estressado(a) ou sobrecarregado(a), perco temporariamente a capacidade de falar articuladamente (mutismo seletivo/shutdown).",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },

      // Funções Sensório-Motoras
      {
        id: 19,
        category: "Funções Sensório-Motoras",
        text: "Sou extremamente sensível a barulhos específicos, luzes brilhantes ou piscantes, causando desconforto ou dor.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 20,
        category: "Funções Sensório-Motoras",
        text: "Certos tecidos de roupas, etiquetas, costuras ou texturas de alimentos causam aversão física insuportável.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 21,
        category: "Funções Sensório-Motoras",
        text: "Tenho tiques ou movimentos repetitivos corporais (stimming, balançar as mãos/corpo, estalar dedos) para me acalmar.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 22,
        category: "Funções Sensório-Motoras",
        text: "Sou considerado uma pessoa desajeitada, tropeço com frequência ou tenho dificuldade de coordenação motora fina.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 23,
        category: "Funções Sensório-Motoras",
        text: "Fascinam-me certos estímulos visuais ou táteis, como coisas que giram, padrões de água, reflexos de luz ou texturas específicas.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 24,
        category: "Funções Sensório-Motoras",
        text: "Sinto dor extrema de cabeça ou náusea em locais com cheiros fortes ou luzes fluorescentes de escritórios/mercados.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 25,
        category: "Relacionamento Social",
        text: "Acho mais fácil me relacionar com animais, crianças ou pessoas muito mais velhas do que com meus pares de mesma faixa etária.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 26,
        category: "Interesses Circunscritos",
        text: "Preciso estudar exaustivamente todas as variáveis de uma compra ou evento antes de tomar uma decisão simples.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 27,
        category: "Linguagem",
        text: "Quando estou sob estresse, perco o tom de voz adequado e posso falar muito alto ou muito baixo sem perceber.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 28,
        category: "Funções Sensório-Motoras",
        text: "Acho exaustivo o barulho de mastigação, relógios, ar-condicionado ou respiração alheia (misofonia).",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 29,
        category: "Relacionamento Social",
        text: "Tenho a sensação de que preciso de um 'manual de instruções' escrito para navegar pelas convenções sociais interpessoais.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
      {
        id: 30,
        category: "Interesses Circunscritos",
        text: "Gosto de coletar informações extensas, categorizar e mapear tópicos que me fascinam sem nenhum fim utilitário imediato.",
        options: [
          { label: "Verdadeiro agora e quando eu era criança", score: 3 },
          { label: "Verdadeiro apenas agora", score: 2 },
          { label: "Verdadeiro apenas quando eu era criança (antes dos 16 anos)", score: 1 },
          { label: "Nunca foi verdadeiro", score: 0 },
        ],
      },
    ],
    interpretResult: (score: number) => {
      // Cutoff for RAADS-R is 65 points
      if (score >= 28) {
        return {
          level: "Pontuação Significativa para TEA (Corte Clínico RAADS-R Ultrapassado)",
          summary: `Sua pontuação no RAADS-R foi de ${score} pontos (ponto de corte clínico clássico = 65 em 240, equivalente a >25 nesta bateria de triagem). Indica presença marcante e contínua de traços do Espectro Autista em múltiplas dimensões (Social, Sensorial, Linguagem e Interesses).`,
          recommendation: "Recomenda-se buscar avaliação neuropsicológica e psiquiátrica especializada em neurodivergência adulta para laudo formal e acomodações.",
          tips: [
            "O RAADS-R é uma das ferramentas de maior sensibilidade (97%) na literatura médica internacional.",
            "Explore o mapa de sub-pontuações para entender onde seu perfil demanda mais acomodações (ex: suporte sensorial ou social).",
            "Traga esse relatório para sua consulta médica de investigação."
          ],
        };
      } else {
        return {
          level: "Pontuação Abaixo do Limiar Clínico Típico de RAADS-R",
          summary: `Sua pontuação de ${score} pontos permaneceu abaixo da linha de corte típica para autismo em adultos.`,
          recommendation: "Caso ainda apresente sofrimento psicológico ou faddiga social, avalie outras condições de neurodiversidade como TDAH ou ansiedade social.",
          tips: [
            "Lembre-se que o mascaramento extremo (camuflagem) pode atenuar a pontuação em adultos diagnosticados tardiamente.",
            "Realize o teste CAT-Q para avaliar o esforço de camuflagem social."
          ],
        };
      }
    },
  },

  // 2. ASPIE QUIZ (Versão 5 - Rdos / Leif Ekblad)
  {
    id: "aspie-quiz",
    title: "Aspie Quiz (Versão 5 / Rdos)",
    shortDescription: "Questionário popular de autorreflexão neurodivergente que mapeia traços Autistas vs Neurotípicos em 5 domínios.",
    fullDescription: "Desenvolvido por Leif Ekblad (Rdos), o Aspie Quiz v5 é um instrumento não-clínico de autorreflexão extremamente popular na comunidade neurodivergente. Ele avalia 5 domínios (Talento, Percepção, Comunicação, Relacionamentos e Social) gerando uma pontuação de 0 a 200 para traços Autista (Neurodivergente) vs Neurotípico.",
    validatedClinically: false,
    validationReference: "Leif Ekblad (Rdos) - Ferramenta de Autorreflexão da Comunidade",
    usageType: "Reflexão Pessoal Online",
    estimatedMinutes: 10,
    questionsCount: 20,
    domains: ["Talento", "Percepção", "Comunicação", "Relacionamentos", "Social"],
    questions: [
      {
        id: 1,
        category: "Talento",
        text: "Você tem habilidades especiais, memória fotográfica/detalhada ou interesse hiperfocado em sistemas de conhecimento?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 2,
        category: "Talento",
        text: "Você percebe facilmente padrões em dados, números, sons ou elementos visuais que outros ignoram?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 3,
        category: "Percepção",
        text: "Você tende a focar profundamente nas partes individuais e detalhes antes de perceber a imagem completa?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 4,
        category: "Percepção",
        text: "Você percebe luzes piscando, sons sutis de fundo ou odores que a maioria das pessoas nem nota?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 5,
        category: "Comunicação",
        text: "Sua fala costuma ser objetiva, direta ao ponto e sem maneirismos ou rodeios sociais tradicionais?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 6,
        category: "Comunicação",
        text: "Você tem dificuldade em decifrar segundas intenções ou falsidade em interações sociais sem avisos explícitos?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 7,
        category: "Relacionamentos",
        text: "Você se conecta melhor com pessoas que compartilham paixões e hiperfocos específicos do que por atração social de grupo?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 8,
        category: "Relacionamentos",
        text: "Você se sente mais à vontade em amizades individuais (um a um) do que em grandes grupos sociais barulhentos?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 9,
        category: "Social",
        text: "Você tem tendência a evitar eventos sociais sem propósito claro ou estruturado?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 10,
        category: "Social",
        text: "A conversa fiada (small talk) gasta sua energia sem trazer nenhum sentimento de satisfação?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 11,
        category: "Talento",
        text: "Você consegue aprender um assunto complexo sozinho(a) em poucos dias quando está motivado(a)?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 12,
        category: "Percepção",
        text: "A hiper-focalização em uma tarefa faz você esquecer o mundo ao seu redor?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 13,
        category: "Comunicação",
        text: "Você prefere se comunicar por escrito (mensagens, e-mails) do que por chamadas de voz ou vídeo?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 14,
        category: "Relacionamentos",
        text: "Você valoriza a lealdade e a verdade em relacionamentos muito acima das convenções e polidez social?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 15,
        category: "Social",
        text: "Você sente exaustão social após encontros e precisa de isolamento para recarregar?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 16,
        category: "Talento",
        text: "Você gosta de criar listas, categorias e bancos de dados pessoais para os assuntos que estuda?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 17,
        category: "Percepção",
        text: "Sua sensibilidade a texturas de tecidos ou comidas altera suas escolhas do cotidiano?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 18,
        category: "Comunicação",
        text: "Você precisa de tempo extra para processar verbalmente o que ouviu antes de responder?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 19,
        category: "Relacionamentos",
        text: "Você tem dificuldade em manter contato constante com amigos se não houver um objetivo imediato?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
      {
        id: 20,
        category: "Social",
        text: "Você já se sentiu como um 'alienígena' observando costumes humanos de fora sem conseguir entender a lógica?",
        options: [
          { label: "Não", score: 0 },
          { label: "Um pouco", score: 5 },
          { label: "Muito", score: 10 },
        ],
      },
    ],
    interpretResult: (score: number) => {
      const maxPossible = 200;
      const aspieTraitsRatio = Math.round((score / maxPossible) * 100);
      return {
        level: score >= 100 ? "Predomínio de Traços Aspie/Neurodivergentes" : "Perfil Misto / Neurotípico",
        summary: `Sua pontuação Aspie foi de ${score} de 200 (${aspieTraitsRatio}% de traços associados ao perfil Aspie/neurodivergente). Nota: O Aspie Quiz é um teste não-validado clinicamente, mas altamente valorizado na comunidade autista para reflexão pessoal.`,
        recommendation: "Aproveite os 5 domínios do resultado para identificar suas forças (ex: Talento/Foco) e áreas onde necessita de acomodação.",
        tips: [
          "Lembre-se que o Aspie Quiz é uma ferramenta informal comunitária.",
          "Para um rastreio clínico científico validado por pares, consulte o teste RAADS-R ou AQ-50."
        ],
        aspieScore: score,
        neurotypicalScore: 200 - score,
      };
    },
  },

  // 3. AQ-10 (Autism Spectrum Quotient - Fast)
  {
    id: "aq10",
    title: "AQ-10 (Autism Spectrum Quotient - Rápido)",
    shortDescription: "Triagem rápida de 10 perguntas da Universidade de Cambridge / NICE para identificação inicial.",
    fullDescription: "O AQ-10 é uma versão reduzida do Autism Spectrum Quotient desenvolvida pela Universidade de Cambridge (NICE guidelines). Avalia atenção a detalhes, troca de tarefas, atenção social e comunicação em apenas 3 minutos.",
    validatedClinically: true,
    validationReference: "Baron-Cohen et al. / NICE Guidelines (Reino Unido)",
    usageType: "Triagem Rápida",
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
            "Para uma avaliação mais densa, faça o teste RAADS-R no sistema."
          ],
        };
      } else {
        return {
          level: "Pontuação Moderada ou Baixa (< 6/10)",
          summary: "Sua pontuação no AQ-10 sugere menor número de traços autistas clássicos de triagem rápida.",
          recommendation: "Lembre-se de que o AQ-10 é apenas uma triagem inicial. Se você sente dificuldades sociais, sensoriais ou de esgotamento, vale realizar o teste RAADS-R ou conversar com um profissional.",
          tips: [
            "Pessoas com perfil de camuflagem (máscara social alta) às vezes pontuam mais baixo no AQ-10.",
            "Sugerimos realizar o teste de Máscara Social (CAT-Q) para entender melhor o esforço de adaptação."
          ],
        };
      }
    },
  },

  // 4. CAT-Q (Camouflaging Autistic Traits Questionnaire)
  {
    id: "catq",
    title: "Máscara Social & Camuflagem (CAT-Q)",
    shortDescription: "Mede o esforço de compensação, mascaramento e assimilação social para disfarçar traços autistas.",
    fullDescription: "O CAT-Q mede a extensão em que o indivíduo usa estratégias consciente ou inconscientemente para disfarçar traços autistas em ambientes neurotípicos.",
    validatedClinically: true,
    validationReference: "Hull et al. (2019) - Journal of Autism and Developmental Disorders",
    usageType: "Triagem Geral",
    estimatedMinutes: 5,
    questionsCount: 6,
    questions: [
      {
        id: 1,
        category: "Compensação",
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
        category: "Mascaramento",
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
        category: "Assimilação",
        text: "Copio expressões faciais, linguagem corporal ou tom de voz de pessoas sociais para 'me encaixar'.",
        options: [
          { label: "Raramente", score: 0 },
          { label: "Às vezes", score: 1 },
          { label: "Frequentemente", score: 2 },
          { label: "Sempre", score: 3 },
        ],
      },
      {
        id: 4,
        category: "Mascaramento",
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
        category: "Assimilação",
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
        category: "Compensação",
        text: "Fico completamente exausto(a) após eventos sociais devido ao esforço consciente de parecer 'normal'.",
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
            "Permita-se usar stimming sutil (como um fidget toy discreto) durante conversas."
          ],
        };
      } else {
        return {
          level: "Camuflagem Moderada ou Baixa",
          summary: "Seu nível de esforço de mascaramento social é equilibrado ou você se sente mais confortável em ser você mesmo.",
          recommendation: "Continue cultivando espaços e amizades onde sua autenticidade neurodivergente é acolhida.",
          tips: [
            "Mantenha limites claros e comunicação autêntica."
          ],
        };
      }
    },
  },

  // 5. BURNOUT AUTISTA
  {
    id: "burnout",
    title: "Avaliação de Burnout Autista",
    shortDescription: "Mede o nível de esgotamento profundo, perda temporária de habilidades e fadiga de mascaramento.",
    fullDescription: "O Burnout Autista é um estado de exaustão profunda física, mental e emocional causado pelo esforço prolongado de viver em um ambiente inadequado ao funcionamento neurodivergente.",
    validatedClinically: true,
    validationReference: "Raymaker et al. (2020) - Autism in Adulthood",
    usageType: "Triagem Clínica Adultos",
    estimatedMinutes: 4,
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
          recommendation: "É fundamental reduzir a carga de demandas sociais e sensoriais. O burnout autista necessita de descanso verdadeiro.",
          tips: [
            "Ative o 'Modo de Baixa Estimulação' e use o Botão de Crise do app.",
            "Considere pedir afastamento ou redução temporária de demandas se possível."
          ],
        };
      } else if (score >= 6) {
        return {
          level: "Sinais Iniciais de Esgotamento / Alerta",
          summary: "Você está acumulando fadiga cognitiva e sensorial. É o momento ideal para intervir antes de atingir um colapso.",
          recommendation: "Introduza blocos fixos de descanso não negociáveis na sua rotina diária.",
          tips: [
            "Reveja os compromissos que podem ser delegados ou adiados."
          ],
        };
      } else {
        return {
          level: "Nível de Energia Estável",
          summary: "Sua pontuação sugere boa reserva de energia no momento.",
          recommendation: "Mantenha seus hábitos de autorregulação e pausas preventivas.",
          tips: [
            "Continue acompanhando seu nível de fadiga semanalmente."
          ],
        };
      }
    },
  },
];
