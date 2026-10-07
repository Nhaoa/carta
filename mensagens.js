/* =========================================================
   CONFIGURAÇÃO DE MENSAGENS PERSONALIZADAS POR PERÍODO DO DIA
   (Edite os textos livremente para cada momento)
========================================================= */

window.CONFIG_MENSAGENS = {
  // ☀️ MANHÃ (05:00 às 11:59)
  manha: {
    balao: "Psst... o gatinho trouxe uma cartinha matinal para você! 🐾",
    carta: {
      texto: "Adoro o seu jeitinho. Seu sorriso me contagia de alegria logo cedo.\n\nBom dia, meu pedaço de pecado, te amo!",
      rodape: "Comece o dia com todo o meu amor ♡"
    }
  },

  // 🌇 TARDE (12:00 às 17:59)
  tarde: {
    balao: "O gatinho passou para deixar um recado na sua tarde! 🐾",
    carta: {
      texto: "Passando para lembrar que você ilumina o meu dia inteiro.\n\nBoa tarde, meu pedaço de pecado, te amo!",
      rodape: "Com todo o meu carinho para a sua tarde ♡"
    }
  },

  // 🌙 NOITE (18:00 às 23:59)
  noite: {
    balao: "Tem uma cartinha especial esperando por você nesta noite... 🐾",
    carta: {
      texto: "O dia acaba, mas a vontade de estar com você só aumenta.\n\nBoa noite, meu pedaço de pecado, te amo!",
      rodape: "Durma bem, com todo o meu amor ♡"
    }
  },

  // 🌌 MADRUGADA (00:00 às 04:59)
  madrugada: {
    balao: "Ainda acordada? O gatinho tem um segredo para você... 🐾",
    carta: {
      texto: "Mesmo nas horas mais quietas, você é o meu pensamento favorito.\n\nBoa madrugada, meu pedaço de pecado, te amo!",
      rodape: "Sonhe comigo, com todo o meu amor ♡"
    }
  },

  // Mensagem do balão quando a carta do período já foi aberta e lida
  balaoSemCarta: "Toque no gatinho para reler a cartinha de agora! 💌"
};// frases.js - Edite ou adicione quantas frases quiser para cada momento do dia!
const FRASES_DO_DIA = {
  // Manhã (05:00 às 11:59)
  manha: [
    "Adoro o seu jeitinho. Seu sorriso me contagia de alegria.\n\nBom dia, meu pedaço de pecado, te amo!",
    "Acordei pensando no seu sorriso que ilumina qualquer dia.\n\nBom dia, meu pedaço de pecado, te amo!",
    "Que o seu dia comece tão doce quanto o seu abraço.\n\nBom dia, meu pedaço de pecado, te amo!"
  ],

  // Tarde (12:00 às 17:59)
  tarde: [
    "Adoro o seu jeitinho. Seu sorriso me contagia de alegria.\n\nBoa tarde, meu pedaço de pecado, te amo!",
    "Passando no meio da tarde só para lembrar que você não sai do meu pensamento.\n\nBoa tarde, meu pedaço de pecado, te amo!",
    "Uma pausa no dia só para te mandar todo o meu carinho.\n\nBoa tarde, meu pedaço de pecado, te amo!"
  ],

  // Noite (18:00 às 23:59)
  noite: [
    "Adoro o seu jeitinho. Seu sorriso me contagia de alegria.\n\nBoa noite, meu pedaço de pecado, te amo!",
    "O dia foi longo, mas pensar em você acalma tudo.\n\nBoa noite, meu pedaço de pecado, te amo!",
    "Vá descansar com a certeza de que você é meu pensamento favorito.\n\nBoa noite, meu pedaço de pecado, te amo!"
  ],

  // Madrugada (00:00 às 04:59)
  madrugada: [
    "Adoro o seu jeitinho. Seu sorriso me contagia de alegria.\n\nBoa madrugada, meu pedaço de pecado, te amo!",
    "A noite é silenciosa, mas meu coração grita o quanto gosta de você.\n\nBoa madrugada, meu pedaço de pecado, te amo!",
    "Perdendo o sono e achando você em cada pensamento.\n\nBoa madrugada, meu pedaço de pecado, te amo!"
  ]
};
