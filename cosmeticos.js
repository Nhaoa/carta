/* =========================================================
   CATÁLOGO DE COSMÉTICOS, CORES, RAÇAS, PUPILAS E EXPRESSÕES
========================================================= */

window.CATALOGO_COSMETICOS = {
  tintas: [
    { id: 'c_preto', nome: 'Grafite Escuro', hex: '#2b2725' },
    { id: 'c_cinza', nome: 'Cinza Suave', hex: '#7a736e' },
    { id: 'c_marrom', nome: 'Chocolate', hex: '#4a3528' },
    { id: 'c_ambar', nome: 'Âmbar Dourado', hex: '#c48b36' },
    { id: 'c_laranja', nome: 'Laranja Queimado', hex: '#d96b27' },
    { id: 'c_vermelho', nome: 'Vinho Aveludado', hex: '#872b2b' },
    { id: 'c_rosa', nome: 'Pêssego Suave', hex: '#d98b82' },
    { id: 'c_roxo', nome: 'Ametista Profundo', hex: '#5b3a6e' },
    { id: 'c_azul_escuro', nome: 'Azul Meia-Noite', hex: '#223854' },
    { id: 'c_azul_claro', nome: 'Azul Céu', hex: '#4f83a8' },
    { id: 'c_verde_escuro', nome: 'Verde Musgo', hex: '#375239' },
    { id: 'c_verde_claro', nome: 'Verde Sálvia', hex: '#5f8263' },
    { id: 'c_creme', nome: 'Baunilha Claro', hex: '#f0e3ce' },
    { id: 'c_dourado', nome: 'Ouro Nobre', hex: '#dfb15b' }
  ],

  acessorios: [
    { 
      id: 'bowtie', nome: 'Gravatinha Borboleta', preco: 1,
      svg: `<svg viewBox="0 0 60 40" width="46" height="32"><polygon points="12,10 12,30 30,20" fill="COLOR" stroke="#2b2725" stroke-width="2"/><polygon points="48,10 48,30 30,20" fill="COLOR" stroke="#2b2725" stroke-width="2"/><circle cx="30" cy="20" r="4.5" fill="#c48b36"/></svg>`
    },
    { 
      id: 'glasses', nome: 'Óculos com Hastes', preco: 2,
      svg: `<svg viewBox="0 0 76 35" width="54" height="26"><line x1="4" y1="14" x2="18" y2="18" stroke="COLOR" stroke-width="2.5"/><line x1="72" y1="14" x2="58" y2="18" stroke="COLOR" stroke-width="2.5"/><circle cx="28" cy="18" r="12" fill="none" stroke="COLOR" stroke-width="3"/><circle cx="48" cy="18" r="12" fill="none" stroke="COLOR" stroke-width="3"/><path d="M 40,18 Q 38,13 36,18" fill="none" stroke="COLOR" stroke-width="3"/></svg>`
    },
    { 
      id: 'flower', nome: 'Florzinha Delicada', preco: 3,
      svg: `<svg viewBox="0 0 50 50" width="38" height="38"><circle cx="20" cy="18" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/><circle cx="30" cy="13" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/><circle cx="36" cy="22" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/><circle cx="28" cy="30" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/><circle cx="18" cy="26" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/><circle cx="26" cy="22" r="4.5" fill="COLOR"/></svg>`
    },
    { 
      id: 'crown', nome: 'Coroa Imperial', preco: 4,
      svg: `<svg viewBox="0 0 60 40" width="46" height="30"><path d="M 10,12 L 18,28 L 30,6 L 42,28 L 50,12 L 48,34 L 12,34 Z" fill="COLOR" stroke="#2b2725" stroke-width="2.5"/><circle cx="30" cy="6" r="2.5" fill="#c48b36"/></svg>`
    }
  ],

  // Formatos de boquinha cosméticos
  bocas: [
    { id: 'mouth_cat', nome: 'Gatinho Fofo (:3)', preco: 0, icone: 'ω' },
    { id: 'mouth_tongue', nome: 'Linguinha de Fora (:P)', preco: 2, icone: '👅' },
    { id: 'mouth_vampire', nome: 'Dentinho de Vampiro', preco: 3, icone: '🧛' },
    { id: 'mouth_smile', nome: 'Sorriso Amplo', preco: 2, icone: '‿' }
  ],

  // Expressões faciais (olhos e sobrancelhas/orelhas)
  expressoes: [
    { id: 'expr_neutral', nome: 'Expressão Padrão', preco: 0, icone: '🐱' },
    { id: 'expr_anime', nome: 'Olhar Curioso Anime', preco: 2, icone: '✨' },
    { id: 'expr_airplane', nome: 'Orelhas em Modo Avião', preco: 3, icone: '✈️' },
    { id: 'expr_determined', nome: 'Determinado / Focado', preco: 2, icone: '😼' }
  ],

  pupilas: [
    { id: 'pupil_round', nome: 'Olhar Curioso (Normal)', preco: 0, icone: '●' },
    { id: 'pupil_slit', nome: 'Fenda Felina (Caçador)', preco: 2, icone: '❙' },
    { id: 'pupil_sparkle', nome: 'Olhar Brilhante (Anime)', preco: 3, icone: '✦' }
  ],

  olhos: [
    { id: 'eye_charcoal', nome: 'Grafite Preto', hex: '#2b2725', preco: 0, icone: '👁️' },
    { id: 'eye_blue', nome: 'Azul Safira (Siamês)', hex: '#3466b0', preco: 2, icone: '💎' },
    { id: 'eye_amber', nome: 'Âmbar Dourado', hex: '#c47d25', preco: 2, icone: '🍯' },
    { id: 'eye_emerald', nome: 'Verde Esmeralda', hex: '#2e6b3e', preco: 3, icone: '🌿' },
    { id: 'eye_violet', nome: 'Violeta Profundo', hex: '#633974', preco: 3, icone: '🔮' }
  ],

  racas: [
    { id: 'breed_default', nome: 'Branco Clássico', preco: 0, icone: '⚪' },
    { id: 'breed_siamese', nome: 'Siamês Real', preco: 3, icone: '🤎' },
    { id: 'breed_tuxedo', nome: 'Frajola Real', preco: 3, icone: '🖤' },
    { id: 'breed_orange', nome: 'Laranja Listrado', preco: 4, icone: '🧡' }
  ],

  temas: [
    { id: 'theme_default', nome: 'Pergaminho', preco: 0, icone: '📜', class: '' },
    { id: 'theme_cafe', nome: 'Carvão & Café', preco: 3, icone: '☕', class: 'theme-cafe' },
    { id: 'theme_night', nome: 'Noite Estrelada', preco: 5, icone: '🌌', class: 'theme-night' }
  ],

  efeitos: [
    { id: 'fx_hearts', nome: 'Corações', preco: 0, icone: '🤍', type: 'heart' },
    { id: 'fx_leaves', nome: 'Folhas de Outono', preco: 2, icone: '🍂', type: 'leaf' },
    { id: 'fx_stars', nome: 'Estrelinhas', preco: 3, icone: '✨', type: 'star' }
  ]
};/* =========================================================
   CATÁLOGO DE COSMÉTICOS, CORES, RAÇAS E PUPILAS
========================================================= */

window.CATALOGO_COSMETICOS = {
  // Paleta expandida de tintas compráveis para os itens (1 peixinho cada)
  tintas: [
    { id: 'c_preto', nome: 'Grafite Escuro', hex: '#2b2725' },
    { id: 'c_cinza', nome: 'Cinza Suave', hex: '#7a736e' },
    { id: 'c_marrom', nome: 'Chocolate', hex: '#4a3528' },
    { id: 'c_ambar', nome: 'Âmbar Dourado', hex: '#c48b36' },
    { id: 'c_laranja', nome: 'Laranja Queimado', hex: '#d96b27' },
    { id: 'c_vermelho', nome: 'Vinho Aveludado', hex: '#872b2b' },
    { id: 'c_rosa', nome: 'Pêssego Suave', hex: '#d98b82' },
    { id: 'c_roxo', nome: 'Ametista Profundo', hex: '#5b3a6e' },
    { id: 'c_azul_escuro', nome: 'Azul Meia-Noite', hex: '#223854' },
    { id: 'c_azul_claro', nome: 'Azul Céu', hex: '#4f83a8' },
    { id: 'c_verde_escuro', nome: 'Verde Musgo', hex: '#375239' },
    { id: 'c_verde_claro', nome: 'Verde Sálvia', hex: '#5f8263' },
    { id: 'c_creme', nome: 'Baunilha Claro', hex: '#f0e3ce' },
    { id: 'c_dourado', nome: 'Ouro Nobre', hex: '#dfb15b' }
  ],

  // Acessórios vestíveis
  acessorios: [
    { 
      id: 'bowtie', nome: 'Gravatinha Borboleta', preco: 1,
      svg: `<svg viewBox="0 0 60 40" width="46" height="32">
              <polygon points="12,10 12,30 30,20" fill="COLOR" stroke="#2b2725" stroke-width="2"/>
              <polygon points="48,10 48,30 30,20" fill="COLOR" stroke="#2b2725" stroke-width="2"/>
              <circle cx="30" cy="20" r="4.5" fill="#c48b36"/>
            </svg>`
    },
    { 
      id: 'glasses', nome: 'Óculos com Hastes', preco: 2,
      svg: `<svg viewBox="0 0 76 35" width="54" height="26">
              <line x1="4" y1="14" x2="18" y2="18" stroke="COLOR" stroke-width="2.5"/>
              <line x1="72" y1="14" x2="58" y2="18" stroke="COLOR" stroke-width="2.5"/>
              <circle cx="28" cy="18" r="12" fill="none" stroke="COLOR" stroke-width="3"/>
              <circle cx="48" cy="18" r="12" fill="none" stroke="COLOR" stroke-width="3"/>
              <path d="M 40,18 Q 38,13 36,18" fill="none" stroke="COLOR" stroke-width="3"/>
            </svg>`
    },
    { 
      id: 'flower', nome: 'Florzinha Delicada', preco: 3,
      svg: `<svg viewBox="0 0 50 50" width="38" height="38">
              <circle cx="20" cy="18" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/>
              <circle cx="30" cy="13" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/>
              <circle cx="36" cy="22" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/>
              <circle cx="28" cy="30" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/>
              <circle cx="18" cy="26" r="6" fill="#fffdf9" stroke="#2b2725" stroke-width="2"/>
              <circle cx="26" cy="22" r="4.5" fill="COLOR"/>
            </svg>`
    },
    { 
      id: 'crown', nome: 'Coroa Imperial', preco: 4,
      svg: `<svg viewBox="0 0 60 40" width="46" height="30">
              <path d="M 10,12 L 18,28 L 30,6 L 42,28 L 50,12 L 48,34 L 12,34 Z" fill="COLOR" stroke="#2b2725" stroke-width="2.5"/>
              <circle cx="30" cy="6" r="2.5" fill="#c48b36"/>
            </svg>`
    }
  ],

  // Formato da pupila do gato
  pupilas: [
    { id: 'pupil_round', nome: 'Olhar Curioso (Normal)', preco: 0, icone: '●' },
    { id: 'pupil_slit', nome: 'Fenda Felina (Caçador)', preco: 2, icone: '❙' },
    { id: 'pupil_sparkle', nome: 'Olhar Brilhante (Anime)', preco: 3, icone: '✦' }
  ],

  // Cores da íris/olhos
  olhos: [
    { id: 'eye_charcoal', nome: 'Grafite Preto', hex: '#2b2725', preco: 0, icone: '👁️' },
    { id: 'eye_blue', nome: 'Azul Safira (Siamês)', hex: '#3466b0', preco: 2, icone: '💎' },
    { id: 'eye_amber', nome: 'Âmbar Dourado', hex: '#c47d25', preco: 2, icone: '🍯' },
    { id: 'eye_emerald', nome: 'Verde Esmeralda', hex: '#2e6b3e', preco: 3, icone: '🌿' },
    { id: 'eye_violet', nome: 'Violeta Profundo', hex: '#633974', preco: 3, icone: '🔮' }
  ],

  // Raças com padrões realistas
  racas: [
    { id: 'breed_default', nome: 'Branco Clássico', preco: 0, icone: '⚪' },
    { id: 'breed_siamese', nome: 'Siamês Real', preco: 3, icone: '🤎' },
    { id: 'breed_tuxedo', nome: 'Frajola Real', preco: 3, icone: '🖤' },
    { id: 'breed_orange', nome: 'Laranja Listrado', preco: 4, icone: '🧡' }
  ],

  // Temas de iluminação e papel
  temas: [
    { id: 'theme_default', nome: 'Pergaminho', preco: 0, icone: '📜', class: '' },
    { id: 'theme_cafe', nome: 'Carvão & Café', preco: 3, icone: '☕', class: 'theme-cafe' },
    { id: 'theme_night', nome: 'Noite Estrelada', preco: 5, icone: '🌌', class: 'theme-night' }
  ],

  // Efeitos ao acariciar
  efeitos: [
    { id: 'fx_hearts', nome: 'Corações', preco: 0, icone: '🤍', type: 'heart' },
    { id: 'fx_leaves', nome: 'Folhas de Outono', preco: 2, icone: '🍂', type: 'leaf' },
    { id: 'fx_stars', nome: 'Estrelinhas', preco: 3, icone: '✨', type: 'star' }
  ]
};
