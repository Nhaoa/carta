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

  bocas: [
    { 
      id: 'mouth_cat', nome: 'Gatinho Fofo (:3)', preco: 0, 
      svg: `<svg viewBox="0 0 50 30" width="42" height="24"><path d="M 15,12 Q 25,22 35,12" fill="none" stroke="#2b2725" stroke-width="3.5" stroke-linecap="round"/><circle cx="25" cy="9" r="3" fill="#d98270"/></svg>` 
    },
    { 
      id: 'mouth_tongue', nome: 'Linguinha (:P)', preco: 2, 
      svg: `<svg viewBox="0 0 50 35" width="42" height="28"><path d="M 15,10 Q 25,18 35,10" fill="none" stroke="#2b2725" stroke-width="3"/><path d="M 20,13 C 20,25 30,25 30,13 Z" fill="#e74c3c" stroke="#2b2725" stroke-width="2"/><line x1="25" y1="13" x2="25" y2="20" stroke="#c0392b" stroke-width="1.5"/></svg>` 
    },
    { 
      id: 'mouth_vampire', nome: 'Dentinhos de Vampiro', preco: 3, 
      svg: `<svg viewBox="0 0 50 30" width="42" height="24"><path d="M 13,12 Q 25,20 37,12" fill="none" stroke="#2b2725" stroke-width="3"/><polygon points="18,13 21,21 23,13" fill="#fff" stroke="#2b2725" stroke-width="1.5"/><polygon points="27,13 29,21 32,13" fill="#fff" stroke="#2b2725" stroke-width="1.5"/></svg>` 
    },
    { 
      id: 'mouth_smile', nome: 'Sorriso Amplo', preco: 2, 
      svg: `<svg viewBox="0 0 50 30" width="42" height="24"><path d="M 12,8 Q 25,24 38,8" fill="none" stroke="#2b2725" stroke-width="3.5" stroke-linecap="round"/></svg>` 
    }
  ],

  expressoes: [
    { 
      id: 'expr_neutral', nome: 'Expressão Neutra', preco: 0, 
      svg: `<svg viewBox="0 0 50 40" width="44" height="34"><ellipse cx="16" cy="20" rx="8" ry="10" fill="#2b2725"/><ellipse cx="34" cy="20" rx="8" ry="10" fill="#2b2725"/><circle cx="18" cy="18" r="2.5" fill="#fff"/><circle cx="36" cy="18" r="2.5" fill="#fff"/></svg>` 
    },
    { 
      id: 'expr_anime', nome: 'Olhar Brilhante Anime', preco: 2, 
      svg: `<svg viewBox="0 0 50 40" width="44" height="34"><ellipse cx="16" cy="20" rx="9" ry="11" fill="#2b2725"/><ellipse cx="34" cy="20" rx="9" ry="11" fill="#2b2725"/><polygon points="16,14 18,19 23,19 19,22 21,27 16,24 11,27 13,22 9,19 14,19" fill="#fff"/><polygon points="34,14 36,19 41,19 37,22 39,27 34,24 29,27 31,22 27,19 32,19" fill="#fff"/></svg>` 
    },
    { 
      id: 'expr_airplane', nome: 'Orelhas em Modo Avião', preco: 3, 
      svg: `<svg viewBox="0 0 60 36" width="50" height="30"><path d="M 6,24 L 20,12 L 28,26 Z" fill="#e58e45" stroke="#2b2725" stroke-width="2.5"/><path d="M 54,24 L 40,12 L 32,26 Z" fill="#e58e45" stroke="#2b2725" stroke-width="2.5"/></svg>` 
    },
    { 
      id: 'expr_determined', nome: 'Determinado / Focado', preco: 2, 
      svg: `<svg viewBox="0 0 50 40" width="44" height="34"><line x1="8" y1="12" x2="22" y2="18" stroke="#2b2725" stroke-width="3" stroke-linecap="round"/><line x1="42" y1="12" x2="28" y2="18" stroke="#2b2725" stroke-width="3" stroke-linecap="round"/><ellipse cx="16" cy="24" rx="7" ry="8" fill="#2b2725"/><ellipse cx="34" cy="24" rx="7" ry="8" fill="#2b2725"/></svg>` 
    }
  ],

  pupilas: [
    { 
      id: 'pupil_round', nome: 'Olhar Normal', preco: 0, 
      svg: `<svg viewBox="0 0 40 40" width="34" height="34"><circle cx="20" cy="20" r="14" fill="#2b2725"/><circle cx="24" cy="16" r="4" fill="#fff"/></svg>` 
    },
    { 
      id: 'pupil_slit', nome: 'Fenda Felina (Caçador)', preco: 2, 
      svg: `<svg viewBox="0 0 40 40" width="34" height="34"><ellipse cx="20" cy="20" rx="4" ry="15" fill="#2b2725"/><circle cx="23" cy="15" r="2.5" fill="#fff"/></svg>` 
    },
    { 
      id: 'pupil_sparkle', nome: 'Estrelas / Anime', preco: 3, 
      svg: `<svg viewBox="0 0 40 40" width="34" height="34"><circle cx="20" cy="20" r="14" fill="#2b2725"/><polygon points="20,10 22,17 29,17 23,21 25,28 20,24 15,28 17,21 11,17 18,17" fill="#fff"/></svg>` 
    }
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
};
