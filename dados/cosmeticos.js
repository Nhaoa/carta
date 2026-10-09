/* =========================================================
   CATÁLOGO DE COSMÉTICOS, CORES, RAÇAS, BOCA E EXPRESSÕES
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
      svg: `<svg viewBox="0 0 50 30" width="46" height="26"><path d="M 14,14 Q 20,22 25,14 Q 30,22 36,14" fill="none" stroke="#2b2725" stroke-width="3.5" stroke-linecap="round"/></svg>`
    },
    { 
      id: 'mouth_tongue', nome: 'Linguinha (:P)', preco: 2, 
      svg: `<svg viewBox="0 0 50 35" width="46" height="28"><path d="M 14,14 Q 25,20 36,14" fill="none" stroke="#2b2725" stroke-width="3.5"/><path d="M 20,16 C 20,28 30,28 30,16 Z" fill="#e74c3c" stroke="#2b2725" stroke-width="2"/></svg>`
    },
    { 
      id: 'mouth_vampire', nome: 'Dentinhos (:3)', preco: 3, 
      svg: `<svg viewBox="0 0 50 30" width="46" height="26"><path d="M 12,14 Q 19,21 25,14 Q 31,21 38,14" fill="none" stroke="#2b2725" stroke-width="3.5"/><polygon points="17,14 19,21 21,14" fill="#fff" stroke="#2b2725" stroke-width="1.5"/><polygon points="29,14 31,21 33,14" fill="#fff" stroke="#2b2725" stroke-width="1.5"/></svg>`
    },
    { 
      id: 'mouth_smile', nome: 'Sorriso Amplo', preco: 2, 
      svg: `<svg viewBox="0 0 50 30" width="46" height="26"><path d="M 12,12 Q 25,26 38,12" fill="none" stroke="#2b2725" stroke-width="3.5" stroke-linecap="round"/></svg>`
    }
  ],

  expressoes: [
    { 
      id: 'expr_neutral', nome: 'Expressão Padrão', preco: 0, 
      svg: `<svg viewBox="0 0 50 40" width="46" height="34"><ellipse cx="17" cy="20" rx="9" ry="12" fill="#2b2725"/><ellipse cx="33" cy="20" rx="9" ry="12" fill="#2b2725"/><circle cx="19" cy="17" r="3" fill="#fff"/><circle cx="35" cy="17" r="3" fill="#fff"/></svg>`
    },
    { 
      id: 'expr_anime', nome: 'Olhar Anime', preco: 2, 
      svg: `<svg viewBox="0 0 50 40" width="46" height="34"><ellipse cx="17" cy="20" rx="10" ry="13" fill="#2b2725"/><ellipse cx="33" cy="20" rx="10" ry="13" fill="#2b2725"/><polygon points="17,12 19,16 23,17 19,19 17,23 15,19 11,17 15,16" fill="#fff"/><polygon points="33,12 35,16 39,17 35,19 33,23 31,19 27,17 31,16" fill="#fff"/></svg>`
    },
    { 
      id: 'expr_airplane', nome: 'Modo Avião', preco: 3, 
      svg: `<svg viewBox="0 0 60 40" width="50" height="32"><path d="M 6,18 L 22,25 L 18,34 Z" fill="#e58e45" stroke="#2b2725" stroke-width="2.5"/><path d="M 54,18 L 38,25 L 42,34 Z" fill="#e58e45" stroke="#2b2725" stroke-width="2.5"/><path d="M 22,25 Q 30,22 38,25" fill="none" stroke="#2b2725" stroke-width="2"/></svg>`
    },
    { 
      id: 'expr_determined', nome: 'Determinado', preco: 2, 
      svg: `<svg viewBox="0 0 50 40" width="46" height="34"><line x1="8" y1="12" x2="22" y2="18" stroke="#2b2725" stroke-width="3" stroke-linecap="round"/><line x1="42" y1="12" x2="28" y2="18" stroke="#2b2725" stroke-width="3" stroke-linecap="round"/><ellipse cx="16" cy="24" rx="7" ry="9" fill="#2b2725"/><ellipse cx="34" cy="24" rx="7" ry="9" fill="#2b2725"/></svg>`
    }
  ],

  pupilas: [
    { 
      id: 'pupil_round', nome: 'Pupila Redonda', preco: 0, 
      svg: `<svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="20" rx="14" ry="17" fill="#2b2725"/><circle cx="24" cy="15" r="4.5" fill="#fff"/></svg>`
    },
    { 
      id: 'pupil_slit', nome: 'Fenda Felina', preco: 2, 
      svg: `<svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="20" rx="14" ry="17" fill="#2e6b3e"/><ellipse cx="20" cy="20" rx="3.5" ry="15" fill="#151210"/><circle cx="23" cy="14" r="2.5" fill="#fff"/></svg>`
    },
    { 
      id: 'pupil_sparkle', nome: 'Pupila Estrelada', preco: 3, 
      svg: `<svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="20" rx="14" ry="17" fill="#2b2725"/><polygon points="20,10 22,16 28,18 22,20 20,26 18,20 12,18 18,16" fill="#fff"/></svg>`
    }
  ],

  olhos: [
    { id: 'eye_charcoal', nome: 'Grafite Preto', hex: '#2b2725', preco: 0 },
    { id: 'eye_blue', nome: 'Azul Safira (Siamês)', hex: '#3466b0', preco: 2 },
    { id: 'eye_amber', nome: 'Âmbar Dourado', hex: '#c47d25', preco: 2 },
    { id: 'eye_emerald', nome: 'Verde Esmeralda', hex: '#2e6b3e', preco: 3 },
    { id: 'eye_violet', nome: 'Violeta Profundo', hex: '#633974', preco: 3 }
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
   CATÁLOGO DE COSMÉTICOS, CORES, RAÇAS, BOCA E EXPRESSÕES
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
      svg: `<svg viewBox="0 0 50 30" width="46" height="26"><path d="M 14,14 Q 20,22 25,14 Q 30,22 36,14" fill="none" stroke="#2b2725" stroke-width="3.5" stroke-linecap="round"/></svg>`
    },
    { 
      id: 'mouth_tongue', nome: 'Linguinha (:P)', preco: 2, 
      svg: `<svg viewBox="0 0 50 35" width="46" height="28"><path d="M 14,14 Q 25,20 36,14" fill="none" stroke="#2b2725" stroke-width="3.5"/><path d="M 20,16 C 20,28 30,28 30,16 Z" fill="#e74c3c" stroke="#2b2725" stroke-width="2"/></svg>`
    },
    { 
      id: 'mouth_vampire', nome: 'Dentinhos (:3)', preco: 3, 
      svg: `<svg viewBox="0 0 50 30" width="46" height="26"><path d="M 12,14 Q 19,21 25,14 Q 31,21 38,14" fill="none" stroke="#2b2725" stroke-width="3.5"/><polygon points="17,14 19,21 21,14" fill="#fff" stroke="#2b2725" stroke-width="1.5"/><polygon points="29,14 31,21 33,14" fill="#fff" stroke="#2b2725" stroke-width="1.5"/></svg>`
    },
    { 
      id: 'mouth_smile', nome: 'Sorriso Amplo', preco: 2, 
      svg: `<svg viewBox="0 0 50 30" width="46" height="26"><path d="M 12,12 Q 25,26 38,12" fill="none" stroke="#2b2725" stroke-width="3.5" stroke-linecap="round"/></svg>`
    }
  ],

  expressoes: [
    { 
      id: 'expr_neutral', nome: 'Expressão Padrão', preco: 0, 
      svg: `<svg viewBox="0 0 50 40" width="46" height="34"><ellipse cx="17" cy="20" rx="9" ry="12" fill="#2b2725"/><ellipse cx="33" cy="20" rx="9" ry="12" fill="#2b2725"/><circle cx="19" cy="17" r="3" fill="#fff"/><circle cx="35" cy="17" r="3" fill="#fff"/></svg>`
    },
    { 
      id: 'expr_anime', nome: 'Olhar Anime', preco: 2, 
      svg: `<svg viewBox="0 0 50 40" width="46" height="34"><ellipse cx="17" cy="20" rx="10" ry="13" fill="#2b2725"/><ellipse cx="33" cy="20" rx="10" ry="13" fill="#2b2725"/><polygon points="17,12 19,16 23,17 19,19 17,23 15,19 11,17 15,16" fill="#fff"/><polygon points="33,12 35,16 39,17 35,19 33,23 31,19 27,17 31,16" fill="#fff"/></svg>`
    },
    { 
      id: 'expr_airplane', nome: 'Modo Avião', preco: 3, 
      svg: `<svg viewBox="0 0 60 40" width="50" height="32"><path d="M 6,18 L 22,25 L 18,34 Z" fill="#e58e45" stroke="#2b2725" stroke-width="2.5"/><path d="M 54,18 L 38,25 L 42,34 Z" fill="#e58e45" stroke="#2b2725" stroke-width="2.5"/><path d="M 22,25 Q 30,22 38,25" fill="none" stroke="#2b2725" stroke-width="2"/></svg>`
    },
    { 
      id: 'expr_determined', nome: 'Determinado', preco: 2, 
      svg: `<svg viewBox="0 0 50 40" width="46" height="34"><line x1="8" y1="12" x2="22" y2="18" stroke="#2b2725" stroke-width="3" stroke-linecap="round"/><line x1="42" y1="12" x2="28" y2="18" stroke="#2b2725" stroke-width="3" stroke-linecap="round"/><ellipse cx="16" cy="24" rx="7" ry="9" fill="#2b2725"/><ellipse cx="34" cy="24" rx="7" ry="9" fill="#2b2725"/></svg>`
    }
  ],

  pupilas: [
    { 
      id: 'pupil_round', nome: 'Pupila Redonda', preco: 0, 
      svg: `<svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="20" rx="14" ry="17" fill="#2b2725"/><circle cx="24" cy="15" r="4.5" fill="#fff"/></svg>`
    },
    { 
      id: 'pupil_slit', nome: 'Fenda Felina', preco: 2, 
      svg: `<svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="20" rx="14" ry="17" fill="#2e6b3e"/><ellipse cx="20" cy="20" rx="3.5" ry="15" fill="#151210"/><circle cx="23" cy="14" r="2.5" fill="#fff"/></svg>`
    },
    { 
      id: 'pupil_sparkle', nome: 'Pupila Estrelada', preco: 3, 
      svg: `<svg viewBox="0 0 40 40" width="36" height="36"><ellipse cx="20" cy="20" rx="14" ry="17" fill="#2b2725"/><polygon points="20,10 22,16 28,18 22,20 20,26 18,20 12,18 18,16" fill="#fff"/></svg>`
    }
  ],

  olhos: [
    { id: 'eye_charcoal', nome: 'Grafite Preto', hex: '#2b2725', preco: 0 },
    { id: 'eye_blue', nome: 'Azul Safira (Siamês)', hex: '#3466b0', preco: 2 },
    { id: 'eye_amber', nome: 'Âmbar Dourado', hex: '#c47d25', preco: 2 },
    { id: 'eye_emerald', nome: 'Verde Esmeralda', hex: '#2e6b3e', preco: 3 },
    { id: 'eye_violet', nome: 'Violeta Profundo', hex: '#633974', preco: 3 }
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
