import { SocialScript } from "../types";

export const SOCIAL_SCRIPTS: SocialScript[] = [
  {
    id: "medico_consulta",
    title: "Consulta Médica sem Sobrecarga",
    category: "saude",
    description: "Script para comunicar ao médico que você prefere explicações diretas e escritas, reduzindo ansiedade.",
    scriptText: `"Olá, doutor(a). Eu sou uma pessoa autista e processo informações com mais facilidade quando são diretas e explicadas passo a passo. 

Gostaria de pedir, se possível:
1. Que me avise antes de qualquer toque ou procedimento físico.
2. Que possa me entregar as orientações principais anotadas ou por escrito.
3. Se puder me fazer perguntas objetivas, agradeço muito!"`,
    tips: [
      "Leve suas dúvidas anotadas em um papel ou bloco de notas do celular.",
      "Você pode ter um acompanhante de confiança para te apoiar."
    ]
  },
  {
    id: "trabalho_fones",
    title: "Pedir permissão para fones com cancelamento de ruído no trabalho",
    category: "acomodacoes",
    description: "Modelo de mensagem para o supervisor ou RH explicando a necessidade sensorial.",
    scriptText: `"Prezado(a) [Nome do Gestor/RH],

Gostaria de solicitar uma pequena acomodação sensorial no meu ambiente de trabalho para otimizar meu foco e produtividade. 

Sou sensível ao ruído de fundo do escritório e gostaria de autorização para utilizar fones de ouvido com cancelamento de ruído durante as tarefas individuais. 

Fico à disposição no chat e por e-mail para qualquer demanda urgente. Essa medida simples ajudará muito no meu bem-estar diário e rendimento. 

Atenciosamente,
[Seu Nome]"`,
    tips: [
      "Reforce que a medida aumenta sua produtividade e foco.",
      "Mostre que você continuará acessível por canais assíncronos (e-mail, Teams, Slack)."
    ]
  },
  {
    id: "recusar_evento",
    title: "Recusar convite social sem parecer indelicado",
    category: "social",
    description: "Mensagem objetiva e carinhosa para declinar um evento barulhento ou cansativo sem culpas.",
    scriptText: `"Oi, [Nome]! Fico muito feliz pelo convite para o [Evento] e por ter lembrado de mim. 

No momento estou precisando de um tempo de descanso e baixa estimulação, por isso não conseguirei ir desta vez. 

Agradeço demais o carinho e nos falamos em breve!"`,
    tips: [
      "Não precisa inventar desculpas elaboradas; 'preciso de descanso' é suficiente e honesto.",
      "Agradeça a lembrança para manter o vínculo positivo."
    ]
  },
  {
    id: "explicar_duplo_sentido",
    title: "Pedir esclarecimento sobre ironia ou metáfora ambígua",
    category: "familia",
    description: "Frase para pedir que a pessoa seja literal e objetiva.",
    scriptText: `"Entendi as palavras, mas fiquei em dúvida se você falou no sentido literal ou com ironia/brincadeira. Pode me explicar de forma direta o que você quis dizer ou o que precisa que eu faça?"`,
    tips: [
      "Pedir clareza evita mal-entendidos e ressentimentos acumulados."
    ]
  },
  {
    id: "instrucoes_escritas",
    title: "Solicitar instruções por escrito (Escola / Trabalho)",
    category: "trabalho",
    description: "Pedir que prazos e tarefas sejam enviados por texto para não perder detalhes verbais.",
    scriptText: `"Para garantir que eu não perca nenhum detalhe importante e possa organizar minha rotina com precisão, você poderia me enviar esses pontos chave e prazos por e-mail ou mensagem? Agradeço muito!"`,
    tips: [
      "Processar instruções verbais rápidas consome muita memória de trabalho; texto escrito é acessibilidade."
    ]
  }
];

export const LITERAL_LANGUAGE_GUIDE = [
  {
    expression: "Dar uma mãozinha",
    literalMeaning: "Oferecer ajuda em uma tarefa curta.",
    avoid: "Não significa literalmente entregar uma mão física."
  },
  {
    expression: "Chover no molhado",
    literalMeaning: "Repetir algo redundante ou óbvio que não adiciona novidade.",
    avoid: "Não se refere ao tempo ou clima."
  },
  {
    expression: "Tirar o cavalo da chuva",
    literalMeaning: "Desistir de uma expectativa ou ideia irreal.",
    avoid: "Não tem relação com animais ou tempestades reais."
  },
  {
    expression: "Ficar em cima do muro",
    literalMeaning: "Estar indeciso ou não querer tomar partido em uma discussão.",
    avoid: "Não é sobre subir em uma parede ou muro físico."
  },
  {
    expression: "Segurar a onda",
    literalMeaning: "Aguardar com paciência ou manter o autocontrole emocional.",
    avoid: "Não é sobre o mar ou surfe."
  }
];
