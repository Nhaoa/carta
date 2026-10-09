/* =========================================================
   APP PRINCIPAL, LOJA VIP COMPLETA, CARTA E NAVEGAÇÃO
========================================================= */

let isAutoTimeTheme = localStorage.getItem('cat_theme_auto') !== 'false';
let currentManualTimeIndex = 0;
const TIME_THEMES = ['morning', 'afternoon', 'evening', 'dawn'];
const TIME_ICONS = { morning: '🌅', afternoon: '☀️', evening: '🌆', dawn: '🌙' };
const TIME_NAMES = { morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite', dawn: 'Madrugada' };

function applyTimeTheme(themeName) {
  document.body.classList.remove('time-morning', 'time-afternoon', 'time-evening', 'time-dawn');
  document.body.classList.add(`time-${themeName}`);

  const icon = document.getElementById('auto-time-icon');
  const text = document.getElementById('auto-time-text');
  if (icon && text) {
    if (isAutoTimeTheme) {
      icon.innerText = '⏰';
      text.innerText = `Auto (${TIME_NAMES[themeName]})`;
    } else {
      icon.innerText = TIME_ICONS[themeName];
      text.innerText = TIME_NAMES[themeName];
    }
  }
}

function updateAutoTimeTheme() {
  if (!isAutoTimeTheme) return;
  const hour = new Date().getHours();
  let theme = 'morning';
  if (hour >= 5 && hour < 12) theme = 'morning';
  else if (hour >= 12 && hour < 18) theme = 'afternoon';
  else if (hour >= 18 && hour < 22) theme = 'evening';
  else theme = 'dawn';
  applyTimeTheme(theme);
}

window.toggleAutoTime = function() {
  if (isAutoTimeTheme) {
    isAutoTimeTheme = false;
    currentManualTimeIndex = 0;
    applyTimeTheme(TIME_THEMES[currentManualTimeIndex]);
  } else {
    currentManualTimeIndex++;
    if (currentManualTimeIndex >= TIME_THEMES.length) {
      isAutoTimeTheme = true;
      updateAutoTimeTheme();
    } else {
      applyTimeTheme(TIME_THEMES[currentManualTimeIndex]);
    }
  }
  localStorage.setItem('cat_theme_auto', isAutoTimeTheme);
};

window.toggleSideNav = function() {
  const sideNav = document.getElementById('side-nav-container');
  const arrow = document.getElementById('side-nav-arrow');
  if (!sideNav) return;
  const isCollapsed = sideNav.classList.toggle('collapsed');
  if (arrow) arrow.innerText = isCollapsed ? '▶' : '◀';
};

window.toggleStatusVisibility = function() {
  const statusContainer = document.getElementById('status-container');
  const arrow = document.getElementById('status-arrow-icon');
  if (!statusContainer) return;
  const isHidden = statusContainer.classList.toggle('hidden');
  if (arrow) arrow.innerText = isHidden ? '▼' : '▲';
};

window.openWalletModal = function(e) {
  if (e) e.stopPropagation();
  const coinVal = document.getElementById('wallet-coin-val');
  const pawVal = document.getElementById('wallet-paw-val');
  if (coinVal) coinVal.innerText = window.catStats.fishCoins || 0;
  if (pawVal) pawVal.innerText = window.catStats.pawCoins || 0;
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.add('open');
};

window.closeWalletModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.remove('open');
};

window.checkDailyRewardManual = function() {
  const today = new Date().toDateString();
  if (window.catStats.lastRewardDate === today) {
    alert('Você já resgatou o seu peixinho diário de hoje! Volte amanhã. 🐟');
    return;
  }
  window.catStats.lastRewardDate = today;
  window.catStats.fishCoins = (window.catStats.fishCoins || 0) + 1;
  window.saveStats();
  window.openWalletModal();
  alert('🎉 Parabéns! Ganhou +1 Peixinho 🐟!');
};

window.openChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.add('open');
};

window.closeChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.remove('open');
};

// Ler carta: retira a carta das patinhas do gato
window.openLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  const content = document.getElementById('letter-content');
  if (content) {
    content.innerText = (typeof MENSAGENS_CARTA !== 'undefined' && MENSAGENS_CARTA.length > 0)
      ? MENSAGENS_CARTA[Math.floor(Math.random() * MENSAGENS_CARTA.length)]
      : "Cada segundo com você é o momento mais doce do meu dia! 💖🐾";
  }
  if (modal) modal.classList.add('open');
  if (typeof window.setCatHoldingLetter === 'function') {
    window.setCatHoldingLetter(false);
  }
};

// Fechar carta: o gato volta a segurar a carta
window.closeLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  if (modal) modal.classList.remove('open');
  if (typeof window.setCatHoldingLetter === 'function') {
    window.setCatHoldingLetter(true);
  }
};

/* =========================================================
   LOJA VIP COMPLETA COM VISUALIZAÇÃO AO VIVO E ABAS
========================================================= */

window.openShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (!modal) return;
  modal.classList.add('open');
  renderShopMiniPreview();
  window.switchShopTab('acessorios');
};

window.closeShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (modal) modal.classList.remove('open');
};

function renderShopMiniPreview() {
  const box = document.getElementById('shop-mini-cat-container');
  const mainSvg = document.getElementById('main-cat-svg');
  if (!box || !mainSvg) return;
  box.innerHTML = '';
  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');
  box.appendChild(clone);
}

window.switchShopTab = function(tabName) {
  document.querySelectorAll('.shop-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabName));
  });

  const area = document.getElementById('shop-content-area');
  if (!area) return;

  if (tabName === 'acessorios') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderCosmeticCard('Gravata Borboleta', 'bowtie', '🎀')}
        ${renderCosmeticCard('Óculos Redondo', 'glasses', '👓')}
        ${renderCosmeticCard('Florzinha', 'flower', '🌸')}
        ${renderCosmeticCard('Coroa Dourada', 'crown', '👑')}
      </div>
    `;
  } else if (tabName === 'racas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Gato Branco', 'breed_white', '🤍', 'breed', 0)}
        ${renderOptionCard('Gato Siamês', 'breed_siamese', '🤎', 'breed', 1)}
        ${renderOptionCard('Gato Frajola', 'breed_tuxedo', '🖤', 'breed', 1)}
        ${renderOptionCard('Gato Laranja', 'breed_orange', '🧡', 'breed', 1)}
      </div>
    `;
  } else if (tabName === 'olhos') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Olhos Ônix', '#2b2725', '⚫', 'eye', 0)}
        ${renderOptionCard('Olhos Âmbar', '#c48b36', '🟡', 'eye', 1)}
        ${renderOptionCard('Olhos Esmeralda', '#27ae60', '🟢', 'eye', 1)}
        ${renderOptionCard('Olhos Safira', '#2980b9', '🔵', 'eye', 1)}
      </div>
    `;
  } else if (tabName === 'pupilas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Normal', 'pupil_normal', '👀', 'pupil', 0)}
        ${renderOptionCard('Fenda Felina', 'pupil_slit', '👁️', 'pupil', 1)}
        ${renderOptionCard('Brilho Sparkle', 'pupil_sparkle', '✨', 'pupil', 1)}
        ${renderOptionCard('Anime Estrela', 'pupil_anime', '⭐', 'pupil', 1)}
      </div>
    `;
  } else if (tabName === 'bocas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Miau Clássico', 'mouth_cat', '🐱', 'mouth', 0)}
        ${renderOptionCard('Linguinha :P', 'mouth_tongue', '👅', 'mouth', 1)}
        ${renderOptionCard('Presas Vampiro', 'mouth_vampire', '🧛', 'mouth', 1)}
        ${renderOptionCard('Sorridente', 'mouth_smile', '😊', 'mouth', 1)}
      </div>
    `;
  } else if (tabName === 'expressoes') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Neutra', 'none', '😐', 'expr', 0)}
        ${renderOptionCard('Determinado', 'expr_determined', '😼', 'expr', 1)}
        ${renderOptionCard('Orelhas de Avião', 'expr_airplane', '✈️', 'expr', 1)}
      </div>
    `;
  } else if (tabName === 'temas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('morning')">🌅 Manhã</button>
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('afternoon')">☀️ Tarde</button>
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('evening')">🌆 Noite</button>
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('dawn')">🌙 Madrugada</button>
      </div>
    `;
  } else if (tabName === 'efeitos') {
    area.innerHTML = `
      <div style="text-align: center; padding: 12px;">
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="createFloatingParticles(window.innerWidth/2, window.innerHeight/2, 25)">
          ✨ Disparar Chuva de Brilhos
        </button>
      </div>
    `;
  } else if (tabName === 'backup') {
    area.innerHTML = `
      <div style="text-align: center; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <button class="action-btn" style="justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Código DNA do Gatinho</button>
        <button class="action-btn" style="justify-content: center;" onclick="promptPartnerCode()">📥 Restaurar DNA via Código</button>
      </div>
    `;
  }
};

function renderCosmeticCard(name, id, icon) {
  const isEq = window.equippedItems.includes(id);
  return `
    <div class="shop-card">
      <span style="font-size: 2rem;">${icon}</span>
      <span class="shop-card-name">${name}</span>
      <button class="action-btn" style="font-size: 0.8rem; margin: 4px 0;" onclick="toggleEquip('${id}')">
        ${isEq ? '✓ Equipado' : 'Equipar'}
      </button>
      <button class="palette-btn" onclick="openColorPalette('${id}')">🎨 Mudar Cor</button>
    </div>
  `;
}

function renderOptionCard(name, val, icon, type, cost) {
  return `
    <div class="shop-card">
      <span style="font-size: 2rem;">${icon}</span>
      <span class="shop-card-name">${name}</span>
      <span class="shop-card-price">${cost > 0 ? cost + ' 🐟' : 'Grátis'}</span>
      <button class="action-btn" style="font-size: 0.8rem;" onclick="applyShopCustomization('${type}', '${val}', ${cost})">
        Aplicar
      </button>
    </div>
  `;
}

window.toggleEquip = function(id) {
  const idx = window.equippedItems.indexOf(id);
  if (idx > -1) window.equippedItems.splice(idx, 1);
  else window.equippedItems.push(id);
  localStorage.setItem('cat_equipped', JSON.stringify(window.equippedItems));
  window.renderCatAppearence();
  renderShopMiniPreview();
  window.switchShopTab('acessorios');
};

window.applyShopCustomization = function(type, val, cost) {
  if (cost > 0 && window.catStats.fishCoins < cost) {
    alert('Peixinhos insuficientes!');
    return;
  }
  if (cost > 0) {
    window.catStats.fishCoins -= cost;
    window.saveStats();
  }

  if (type === 'breed') {
    window.activeBreed = val;
    localStorage.setItem('cat_breed', val);
  } else if (type === 'eye') {
    window.activeEyeColor = val;
    localStorage.setItem('cat_eyecolor', val);
  } else if (type === 'pupil') {
    window.activePupil = val;
    localStorage.setItem('cat_pupil', val);
  } else if (type === 'mouth') {
    window.activeMouth = val;
    localStorage.setItem('cat_mouth', val);
  } else if (type === 'expr') {
    window.activeExpr = val;
    localStorage.setItem('cat_expr', val);
  }

  window.renderCatAppearence();
  renderShopMiniPreview();
  alert('Visual atualizado com sucesso! 🐾');
};

let currentColorItem = null;
window.openColorPalette = function(itemKey) {
  currentColorItem = itemKey;
  const modal = document.getElementById('color-modal');
  const grid = document.getElementById('color-picker-grid');
  if (!modal || !grid) return;

  const colors = [
    { name: 'Rubi', hex: '#c0392b' }, { name: 'Âmbar', hex: '#e67e22' },
    { name: 'Ouro', hex: '#f1c40f' }, { name: 'Esmeralda', hex: '#27ae60' },
    { name: 'Céu', hex: '#3498db' }, { name: 'Índigo', hex: '#2980b9' },
    { name: 'Ametista', hex: '#8e44ad' }, { name: 'Rosa', hex: '#e84393' },
    { name: 'Carvão', hex: '#2b2725' }, { name: 'Pérola', hex: '#ffffff' }
  ];

  grid.innerHTML = colors.map(c => `
    <div class="color-swatch-card" onclick="selectItemColor('${c.hex}')">
      <div class="color-swatch-circle" style="background: ${c.hex};"></div>
      <span class="color-swatch-name">${c.name}</span>
    </div>
  `).join('');

  modal.classList.add('open');
};

window.closeColorModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('color-modal');
  if (modal) modal.classList.remove('open');
};

window.selectItemColor = function(hex) {
  if (currentColorItem) {
    window.itemColors[currentColorItem] = hex;
    localStorage.setItem('cat_item_colors', JSON.stringify(window.itemColors));
    window.renderCatAppearence();
    renderShopMiniPreview();
    window.closeColorModal();
  }
};

/* =========================================================
   DOCK INFERIOR (CARROSSEL COM ROLAGEM E FOCO)
========================================================= */

const navCarousel = document.getElementById('bottom-nav-carousel');
const navButtons = document.querySelectorAll('.bottom-nav-bar .bottom-nav-btn');

function updateNavFocus() {
  if (!navCarousel || navButtons.length === 0) return;
  const screenCenter = window.innerWidth / 2;

  let closestBtn = null;
  let minDistance = Infinity;

  navButtons.forEach((btn) => {
    const rect = btn.getBoundingClientRect();
    const btnCenter = rect.left + rect.width / 2;
    const dist = Math.abs(screenCenter - btnCenter);

    if (dist < minDistance) {
      minDistance = dist;
      closestBtn = btn;
    }
  });

  navButtons.forEach((btn) => {
    btn.classList.toggle('active-focus', btn === closestBtn);
  });
}

window.scrollNavToIndex = function(index, smooth = true) {
  if (!navCarousel || !navButtons[index]) return;
  const btn = navButtons[index];
  const targetLeft = btn.offsetLeft - (navCarousel.clientWidth / 2) + (btn.clientWidth / 2);
  navCarousel.scrollTo({ left: targetLeft, behavior: smooth ? 'smooth' : 'auto' });
};

window.handleNavClick = function(index, callback, event) {
  if (event) event.stopPropagation();
  const btn = navButtons[index];

  if (btn && btn.classList.contains('active-focus')) {
    if (typeof callback === 'function') callback(event);
    return;
  }

  window.scrollNavToIndex(index, true);
  setTimeout(updateNavFocus, 180);
};

if (navCarousel) {
  navCarousel.addEventListener('scroll', () => {
    updateNavFocus();
    const hint = document.getElementById('nav-swipe-hint');
    if (hint) hint.classList.add('fade-out');
  }, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  window.loadStats();
  window.initFXCanvas();
  window.renderCatAppearence();
  updateAutoTimeTheme();
  setInterval(updateAutoTimeTheme, 60000);

  setTimeout(() => {
    window.scrollNavToIndex(1, false);
    updateNavFocus();
  }, 120);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      const tray = document.getElementById('inventory-tray');
      if (tray && tray.classList.contains('visible')) window.toggleBackpack();
    }
  });
});/* =========================================================
   APP PRINCIPAL, LOJA VIP COMPLETA, NAVEGAÇÃO E TEMAS
========================================================= */

let isAutoTimeTheme = localStorage.getItem('cat_theme_auto') !== 'false';
let currentManualTimeIndex = 0;
const TIME_THEMES = ['morning', 'afternoon', 'evening', 'dawn'];
const TIME_ICONS = { morning: '🌅', afternoon: '☀️', evening: '🌆', dawn: '🌙' };
const TIME_NAMES = { morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite', dawn: 'Madrugada' };

function applyTimeTheme(themeName) {
  document.body.classList.remove('time-morning', 'time-afternoon', 'time-evening', 'time-dawn');
  document.body.classList.add(`time-${themeName}`);

  const icon = document.getElementById('auto-time-icon');
  const text = document.getElementById('auto-time-text');
  if (icon && text) {
    if (isAutoTimeTheme) {
      icon.innerText = '⏰';
      text.innerText = `Auto (${TIME_NAMES[themeName]})`;
    } else {
      icon.innerText = TIME_ICONS[themeName];
      text.innerText = TIME_NAMES[themeName];
    }
  }
}

function updateAutoTimeTheme() {
  if (!isAutoTimeTheme) return;
  const hour = new Date().getHours();
  let theme = 'morning';
  if (hour >= 5 && hour < 12) theme = 'morning';
  else if (hour >= 12 && hour < 18) theme = 'afternoon';
  else if (hour >= 18 && hour < 22) theme = 'evening';
  else theme = 'dawn';
  applyTimeTheme(theme);
}

window.toggleAutoTime = function() {
  if (isAutoTimeTheme) {
    isAutoTimeTheme = false;
    currentManualTimeIndex = 0;
    applyTimeTheme(TIME_THEMES[currentManualTimeIndex]);
  } else {
    currentManualTimeIndex++;
    if (currentManualTimeIndex >= TIME_THEMES.length) {
      isAutoTimeTheme = true;
      updateAutoTimeTheme();
    } else {
      applyTimeTheme(TIME_THEMES[currentManualTimeIndex]);
    }
  }
  localStorage.setItem('cat_theme_auto', isAutoTimeTheme);
};

window.toggleSideNav = function() {
  const sideNav = document.getElementById('side-nav-container');
  const arrow = document.getElementById('side-nav-arrow');
  if (!sideNav) return;
  const isCollapsed = sideNav.classList.toggle('collapsed');
  if (arrow) arrow.innerText = isCollapsed ? '▶' : '◀';
};

window.toggleStatusVisibility = function() {
  const statusContainer = document.getElementById('status-container');
  const arrow = document.getElementById('status-arrow-icon');
  if (!statusContainer) return;
  const isHidden = statusContainer.classList.toggle('hidden');
  if (arrow) arrow.innerText = isHidden ? '▼' : '▲';
};

window.openWalletModal = function(e) {
  if (e) e.stopPropagation();
  const coinVal = document.getElementById('wallet-coin-val');
  const pawVal = document.getElementById('wallet-paw-val');
  if (coinVal) coinVal.innerText = window.catStats.fishCoins || 0;
  if (pawVal) pawVal.innerText = window.catStats.pawCoins || 0;
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.add('open');
};

window.closeWalletModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.remove('open');
};

window.checkDailyRewardManual = function() {
  const today = new Date().toDateString();
  if (window.catStats.lastRewardDate === today) {
    alert('Você já resgatou seu peixinho de hoje! Volte amanhã. 🐟');
    return;
  }
  window.catStats.lastRewardDate = today;
  window.catStats.fishCoins = (window.catStats.fishCoins || 0) + 1;
  window.saveStats();
  window.openWalletModal();
  alert('🎉 Parabéns! Você ganhou +1 Peixinho 🐟!');
};

window.openChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.add('open');
};

window.closeChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.remove('open');
};

window.openLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  const content = document.getElementById('letter-content');
  if (content) {
    content.innerText = (typeof MENSAGENS_CARTA !== 'undefined' && MENSAGENS_CARTA.length > 0)
      ? MENSAGENS_CARTA[Math.floor(Math.random() * MENSAGENS_CARTA.length)]
      : "Cada segundo com você é o momento mais doce do meu dia! 💖🐾";
  }
  if (modal) modal.classList.add('open');
};

window.closeLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  if (modal) modal.classList.remove('open');
};

/* =========================================================
   LOJA VIP COMPLETA COM VISUALIZAÇÃO AO VIVO E ABAS
========================================================= */

window.openShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (!modal) return;
  modal.classList.add('open');
  renderShopMiniPreview();
  window.switchShopTab('acessorios');
};

window.closeShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (modal) modal.classList.remove('open');
};

function renderShopMiniPreview() {
  const box = document.getElementById('shop-mini-cat-container');
  const mainSvg = document.getElementById('main-cat-svg');
  if (!box || !mainSvg) return;
  box.innerHTML = '';
  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');
  box.appendChild(clone);
}

window.switchShopTab = function(tabName) {
  document.querySelectorAll('.shop-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabName));
  });

  const area = document.getElementById('shop-content-area');
  if (!area) return;

  if (tabName === 'acessorios') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderCosmeticCard('Gravata Borboleta', 'bowtie', '🎀')}
        ${renderCosmeticCard('Óculos Redondo', 'glasses', '👓')}
        ${renderCosmeticCard('Florzinha', 'flower', '🌸')}
        ${renderCosmeticCard('Coroa Dourada', 'crown', '👑')}
      </div>
    `;
  } else if (tabName === 'racas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Gato Branco', 'breed_white', '🤍', 'breed', 0)}
        ${renderOptionCard('Gato Siamês', 'breed_siamese', '🤎', 'breed', 1)}
        ${renderOptionCard('Gato Frajola', 'breed_tuxedo', '🖤', 'breed', 1)}
        ${renderOptionCard('Gato Laranja', 'breed_orange', '🧡', 'breed', 1)}
      </div>
    `;
  } else if (tabName === 'olhos') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Olhos Ônix', '#2b2725', '⚫', 'eye', 0)}
        ${renderOptionCard('Olhos Âmbar', '#c48b36', '🟡', 'eye', 1)}
        ${renderOptionCard('Olhos Esmeralda', '#27ae60', '🟢', 'eye', 1)}
        ${renderOptionCard('Olhos Safira', '#2980b9', '🔵', 'eye', 1)}
      </div>
    `;
  } else if (tabName === 'pupilas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Normal', 'pupil_normal', '👀', 'pupil', 0)}
        ${renderOptionCard('Fenda Felina', 'pupil_slit', '👁️', 'pupil', 1)}
        ${renderOptionCard('Brilho Sparkle', 'pupil_sparkle', '✨', 'pupil', 1)}
        ${renderOptionCard('Anime Estrela', 'pupil_anime', '⭐', 'pupil', 1)}
      </div>
    `;
  } else if (tabName === 'bocas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Miau Clássico', 'mouth_cat', '🐱', 'mouth', 0)}
        ${renderOptionCard('Linguinha :P', 'mouth_tongue', '👅', 'mouth', 1)}
        ${renderOptionCard('Presas Vampiro', 'mouth_vampire', '🧛', 'mouth', 1)}
        ${renderOptionCard('Sorridente', 'mouth_smile', '😊', 'mouth', 1)}
      </div>
    `;
  } else if (tabName === 'expressoes') {
    area.innerHTML = `
      <div class="shop-items-grid">
        ${renderOptionCard('Neutra', 'none', '😐', 'expr', 0)}
        ${renderOptionCard('Determinado', 'expr_determined', '😼', 'expr', 1)}
        ${renderOptionCard('Orelhas de Avião', 'expr_airplane', '✈️', 'expr', 1)}
      </div>
    `;
  } else if (tabName === 'temas') {
    area.innerHTML = `
      <div class="shop-items-grid">
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('morning')">🌅 Manhã</button>
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('afternoon')">☀️ Tarde</button>
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('evening')">🌆 Noite</button>
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="applyTimeTheme('dawn')">🌙 Madrugada</button>
      </div>
    `;
  } else if (tabName === 'efeitos') {
    area.innerHTML = `
      <div style="text-align: center; padding: 12px;">
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="createFloatingParticles(window.innerWidth/2, window.innerHeight/2, 25)">
          ✨ Disparar Chuva de Brilhos
        </button>
      </div>
    `;
  } else if (tabName === 'backup') {
    area.innerHTML = `
      <div style="text-align: center; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
        <button class="action-btn" style="justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Código DNA do Gatinho</button>
        <button class="action-btn" style="justify-content: center;" onclick="promptPartnerCode()">📥 Restaurar DNA via Código</button>
      </div>
    `;
  }
};

function renderCosmeticCard(name, id, icon) {
  const isEq = window.equippedItems.includes(id);
  return `
    <div class="shop-card">
      <span style="font-size: 2rem;">${icon}</span>
      <span class="shop-card-name">${name}</span>
      <button class="action-btn" style="font-size: 0.8rem; margin: 4px 0;" onclick="toggleEquip('${id}')">
        ${isEq ? '✓ Equipado' : 'Equipar'}
      </button>
      <button class="palette-btn" onclick="openColorPalette('${id}')">🎨 Mudar Cor</button>
    </div>
  `;
}

function renderOptionCard(name, val, icon, type, cost) {
  return `
    <div class="shop-card">
      <span style="font-size: 2rem;">${icon}</span>
      <span class="shop-card-name">${name}</span>
      <span class="shop-card-price">${cost > 0 ? cost + ' 🐟' : 'Grátis'}</span>
      <button class="action-btn" style="font-size: 0.8rem;" onclick="applyShopCustomization('${type}', '${val}', ${cost})">
        Aplicar
      </button>
    </div>
  `;
}

window.toggleEquip = function(id) {
  const idx = window.equippedItems.indexOf(id);
  if (idx > -1) window.equippedItems.splice(idx, 1);
  else window.equippedItems.push(id);
  localStorage.setItem('cat_equipped', JSON.stringify(window.equippedItems));
  window.renderCatAppearence();
  renderShopMiniPreview();
  window.switchShopTab('acessorios');
};

window.applyShopCustomization = function(type, val, cost) {
  if (cost > 0 && window.catStats.fishCoins < cost) {
    alert('Peixinhos insuficientes!');
    return;
  }
  if (cost > 0) {
    window.catStats.fishCoins -= cost;
    window.saveStats();
  }

  if (type === 'breed') {
    window.activeBreed = val;
    localStorage.setItem('cat_breed', val);
  } else if (type === 'eye') {
    window.activeEyeColor = val;
    localStorage.setItem('cat_eyecolor', val);
  } else if (type === 'pupil') {
    window.activePupil = val;
    localStorage.setItem('cat_pupil', val);
  } else if (type === 'mouth') {
    window.activeMouth = val;
    localStorage.setItem('cat_mouth', val);
  } else if (type === 'expr') {
    window.activeExpr = val;
    localStorage.setItem('cat_expr', val);
  }

  window.renderCatAppearence();
  renderShopMiniPreview();
  alert('Visual atualizado com sucesso! 🐾');
};

let currentColorItem = null;
window.openColorPalette = function(itemKey) {
  currentColorItem = itemKey;
  const modal = document.getElementById('color-modal');
  const grid = document.getElementById('color-picker-grid');
  if (!modal || !grid) return;

  const colors = [
    { name: 'Rubi', hex: '#c0392b' }, { name: 'Âmbar', hex: '#e67e22' },
    { name: 'Ouro', hex: '#f1c40f' }, { name: 'Esmeralda', hex: '#27ae60' },
    { name: 'Céu', hex: '#3498db' }, { name: 'Índigo', hex: '#2980b9' },
    { name: 'Ametista', hex: '#8e44ad' }, { name: 'Rosa', hex: '#e84393' },
    { name: 'Carvão', hex: '#2b2725' }, { name: 'Pérola', hex: '#ffffff' }
  ];

  grid.innerHTML = colors.map(c => `
    <div class="color-swatch-card" onclick="selectItemColor('${c.hex}')">
      <div class="color-swatch-circle" style="background: ${c.hex};"></div>
      <span class="color-swatch-name">${c.name}</span>
    </div>
  `).join('');

  modal.classList.add('open');
};

window.closeColorModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('color-modal');
  if (modal) modal.classList.remove('open');
};

window.selectItemColor = function(hex) {
  if (currentColorItem) {
    window.itemColors[currentColorItem] = hex;
    localStorage.setItem('cat_item_colors', JSON.stringify(window.itemColors));
    window.renderCatAppearence();
    renderShopMiniPreview();
    window.closeColorModal();
  }
};

/* =========================================================
   DOCK COM FOCO CENTRAL
========================================================= */

const navCarousel = document.getElementById('bottom-nav-carousel');
const navButtons = document.querySelectorAll('.bottom-nav-bar .bottom-nav-btn');

function updateNavFocus() {
  if (!navCarousel || navButtons.length === 0) return;
  const screenCenter = window.innerWidth / 2;

  let closestBtn = null;
  let minDistance = Infinity;

  navButtons.forEach((btn) => {
    const rect = btn.getBoundingClientRect();
    const btnCenter = rect.left + rect.width / 2;
    const dist = Math.abs(screenCenter - btnCenter);

    if (dist < minDistance) {
      minDistance = dist;
      closestBtn = btn;
    }
  });

  navButtons.forEach((btn) => {
    btn.classList.toggle('active-focus', btn === closestBtn);
  });
}

window.scrollNavToIndex = function(index, smooth = true) {
  if (!navCarousel || !navButtons[index]) return;
  const btn = navButtons[index];
  const targetLeft = btn.offsetLeft - (navCarousel.clientWidth / 2) + (btn.clientWidth / 2);
  navCarousel.scrollTo({ left: targetLeft, behavior: smooth ? 'smooth' : 'auto' });
};

window.handleNavClick = function(index, callback, event) {
  if (event) event.stopPropagation();
  const btn = navButtons[index];

  if (btn && btn.classList.contains('active-focus')) {
    if (typeof callback === 'function') callback(event);
    return;
  }

  window.scrollNavToIndex(index, true);
  setTimeout(updateNavFocus, 180);
};

if (navCarousel) {
  navCarousel.addEventListener('scroll', () => {
    updateNavFocus();
    const hint = document.getElementById('nav-swipe-hint');
    if (hint) hint.classList.add('fade-out');
  }, { passive: true });
}

window.addEventListener('DOMContentLoaded', () => {
  window.loadStats();
  window.initFXCanvas();
  window.renderCatAppearence();
  updateAutoTimeTheme();
  setInterval(updateAutoTimeTheme, 60000);

  setTimeout(() => {
    window.scrollNavToIndex(1, false);
    updateNavFocus();
  }, 120);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      const tray = document.getElementById('inventory-tray');
      if (tray && tray.classList.contains('visible')) window.toggleBackpack();
    }
  });
});/* =========================================================
   APP INICIALIZAÇÃO E NAVEGAÇÃO
========================================================= */

window.toggleSideNav = function() {
  const sideNav = document.getElementById('side-nav-container');
  const arrow = document.getElementById('side-nav-arrow');
  if (!sideNav) return;
  const isCollapsed = sideNav.classList.toggle('collapsed');
  if (arrow) arrow.innerText = isCollapsed ? '▶' : '◀';
};

window.toggleStatusVisibility = function() {
  const statusContainer = document.getElementById('status-container');
  const arrow = document.getElementById('status-arrow-icon');
  if (!statusContainer) return;
  const isHidden = statusContainer.classList.toggle('hidden');
  if (arrow) arrow.innerText = isHidden ? '▼' : '▲';
};

window.openWalletModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.add('open');
};

window.closeWalletModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.remove('open');
};

window.openChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.add('open');
};

window.closeChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.remove('open');
};

window.openLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  const content = document.getElementById('letter-content');
  if (content) content.innerText = 'Para a pessoa mais especial do mundo: \n\nObrigado por estar sempre comigo! 💖🐾';
  if (modal) modal.classList.add('open');
};

window.closeLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  if (modal) modal.classList.remove('open');
};

window.openShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (modal) modal.classList.add('open');
};

window.closeShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (modal) modal.classList.remove('open');
};

window.handleNavClick = function(index, callback, event) {
  if (event) event.stopPropagation();
  const navButtons = document.querySelectorAll('.bottom-nav-bar .bottom-nav-btn');
  navButtons.forEach((btn, i) => {
    if (i === index) btn.classList.add('active-focus');
    else btn.classList.remove('active-focus');
  });

  if (typeof callback === 'function') callback(event);
};

window.toggleAutoTime = function() {
  document.body.classList.toggle('time-night');
};

window.addEventListener('DOMContentLoaded', () => {
  window.loadStats();
  window.initFXCanvas();
  window.renderCatAppearence();
  window.renderPartnerCatStage();
});
