/* =========================================================
   CONTROLE GERAL, MENUS RETRÁTEIS, CARROSSEL E INICIALIZAÇÃO
========================================================= */

let sideNavOpen = false;
let statusVisible = false;
let autoTimeEnabled = localStorage.getItem('cat_auto_time') !== 'false';

let catAudio = null;
try { catAudio = new Audio('gato_1.mp3'); } catch(e){}
function playMeowSound() { if(catAudio) { catAudio.currentTime = 0; catAudio.play().catch(()=>{}); } }
function playPaperSound() {}

function toggleSideNav() {
  sideNavOpen = !sideNavOpen;
  const nav = document.getElementById('side-nav-container');
  const arrow = document.getElementById('side-nav-arrow');
  if (sideNavOpen) {
    nav.classList.remove('collapsed');
    arrow.innerText = '◀';
    statusVisible = false;
    applyStatusVisibility();
  } else {
    nav.classList.add('collapsed');
    arrow.innerText = '▶';
  }
}

function toggleStatusVisibility() {
  statusVisible = !statusVisible;
  if (statusVisible) {
    sideNavOpen = false;
    document.getElementById('side-nav-container').classList.add('collapsed');
    document.getElementById('side-nav-arrow').innerText = '▶';
  }
  applyStatusVisibility();
}

function applyStatusVisibility() {
  const container = document.getElementById('status-container');
  const arrow = document.getElementById('status-arrow-icon');
  if (statusVisible) {
    container.classList.remove('hidden');
    arrow.innerText = '▲';
  } else {
    container.classList.add('hidden');
    arrow.innerText = '▼';
  }
}

function openLetter(event) {
  if (event) event.stopPropagation();
  const period = getPeriodName();
  const cfg = (window.CONFIG_MENSAGENS && window.CONFIG_MENSAGENS[period]) || {};
  const cartaCfg = cfg.carta || {};

  document.getElementById('letter-content').innerText = cartaCfg.texto || "Adoro você!";
  document.getElementById('letter-footer').innerText = cartaCfg.rodape || "Com todo amor ♡";

  playPaperSound();
  document.getElementById('letter-modal').classList.add('open');
  createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 12);

  localStorage.setItem('cat_last_opened_period', getCurrentPeriodKey());
  updateLetterHoldingState();
}

function closeLetter(event) {
  if (event) event.stopPropagation();
  document.getElementById('letter-modal').classList.remove('open');
}

function getPeriodName() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "manha";
  if (hour >= 12 && hour < 18) return "tarde";
  if (hour >= 18 && hour < 24) return "noite";
  return "madrugada";
}

function getCurrentPeriodKey() {
  return `${new Date().toISOString().split('T')[0]}_${getPeriodName()}`;
}

function updateLetterHoldingState() {
  const currentPeriod = getCurrentPeriodKey();
  const lastOpenedPeriod = localStorage.getItem('cat_last_opened_period');
  const letterGroup = document.getElementById('cat-letter-group');
  const idlePaws = document.getElementById('idle-paws');
  const bubble = document.getElementById('speech-bubble');

  const period = getPeriodName();
  const config = (window.CONFIG_MENSAGENS && window.CONFIG_MENSAGENS[period]) || {};

  if (lastOpenedPeriod === currentPeriod) {
    if (letterGroup) letterGroup.style.display = 'none';
    if (idlePaws) idlePaws.style.display = 'block';
    if (!isStatusCritical() && bubble) {
      bubble.innerText = (window.CONFIG_MENSAGENS && window.CONFIG_MENSAGENS.balaoSemCarta) || "Você pode reler a cartinha no menu ao lado! 💌";
      bubble.style.display = 'block';
      bubble.classList.remove('fade-out');
      setTimeout(() => {
        bubble.classList.add('fade-out');
        setTimeout(() => { bubble.style.display = 'none'; }, 400);
      }, 6000);
    }
  } else {
    if (letterGroup) letterGroup.style.display = 'block';
    if (idlePaws) idlePaws.style.display = 'none';
    if (bubble) {
      bubble.innerText = config.balao || "Psst... toque no gatinho para abrir a cartinha! 🐾";
      bubble.style.display = 'block';
      bubble.classList.remove('fade-out');
      setTimeout(() => {
        bubble.classList.add('fade-out');
        setTimeout(() => { bubble.style.display = 'none'; }, 400);
      }, 6000);
    }
  }
}

function openChangelog(e) {
  if (e) e.stopPropagation();
  document.getElementById('changelog-modal').classList.add('open');
}
function closeChangelog(e) {
  if (e) e.stopPropagation();
  document.getElementById('changelog-modal').classList.remove('open');
}

function updateTimeTheme() {
  if (!autoTimeEnabled) return;
  const hour = new Date().getHours();
  document.body.classList.remove('time-morning', 'time-afternoon', 'time-evening', 'time-dawn');
  if (hour >= 5 && hour < 12) document.body.classList.add('time-morning');
  else if (hour >= 12 && hour < 18) document.body.classList.add('time-afternoon');
  else if (hour >= 18 && hour < 24) document.body.classList.add('time-evening');
  else document.body.classList.add('time-dawn');
}

function toggleAutoTime() {
  autoTimeEnabled = !autoTimeEnabled;
  localStorage.setItem('cat_auto_time', autoTimeEnabled);
  const btn = document.getElementById('auto-time-btn');
  if (autoTimeEnabled) {
    if (btn) btn.classList.add('active');
    updateTimeTheme();
  } else {
    if (btn) btn.classList.remove('active');
    document.body.classList.remove('time-morning', 'time-afternoon', 'time-evening', 'time-dawn');
  }
}

/* CARROSSEL DA BARRA INFERIOR */
const navCarousel = document.getElementById('bottom-nav-carousel');
const navButtons = document.querySelectorAll('.bottom-nav-bar .bottom-nav-btn');

function updateNavFocus() {
  if (!navCarousel) return;
  const carouselCenter = navCarousel.scrollLeft + navCarousel.clientWidth / 2;
  let closestBtn = null;
  let minDistance = Infinity;

  navButtons.forEach((btn) => {
    const btnCenter = btn.offsetLeft + btn.clientWidth / 2;
    const dist = Math.abs(carouselCenter - btnCenter);
    if (dist < minDistance) {
      minDistance = dist;
      closestBtn = btn;
    }
  });

  navButtons.forEach((btn) => {
    if (btn === closestBtn) btn.classList.add('active-focus');
    else btn.classList.remove('active-focus');
  });
}

function scrollNavToIndex(index, smooth = true) {
  if (!navCarousel || !navButtons[index]) return;
  const btn = navButtons[index];
  const targetLeft = btn.offsetLeft - (navCarousel.clientWidth / 2) + (btn.clientWidth / 2);
  navCarousel.scrollTo({
    left: targetLeft,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function handleNavClick(index, callback, event) {
  if (event) event.stopPropagation();
  const btn = navButtons[index];
  if (!btn.classList.contains('active-focus')) {
    scrollNavToIndex(index, true);
    return;
  }
  if (typeof callback === 'function') {
    callback(event);
  }
}

if (navCarousel) {
  navCarousel.addEventListener('scroll', () => {
    updateNavFocus();
    const hint = document.getElementById('nav-swipe-hint');
    if (hint && !hint.classList.contains('fade-out')) {
      hint.classList.add('fade-out');
    }
  }, { passive: true });
}

/* LOJA VIP: MODAL E PREVIEWS */
function openShop(e) {
  if (e) e.stopPropagation();
  document.getElementById('shop-modal').classList.add('open');
  renderCurrentShopTab();
  updateMiniPreview();
}
function closeShop(e) {
  if (e) e.stopPropagation();
  document.getElementById('shop-modal').classList.remove('open');
}

function updateMiniPreview() {
  const container = document.getElementById('shop-mini-cat-container');
  const mainSvg = document.getElementById('main-cat-svg');
  if (container && mainSvg) {
    container.innerHTML = mainSvg.outerHTML;
  }
}

function switchShopTab(tabKey) {
  currentShopTab = tabKey;
  document.querySelectorAll('.shop-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = Array.from(document.querySelectorAll('.shop-tab-btn')).find(b => b.getAttribute('onclick').includes(tabKey));
  if (activeBtn) activeBtn.classList.add('active');
  renderCurrentShopTab();
}

function renderCurrentShopTab() {
  const area = document.getElementById('shop-content-area');
  if (!area) return;
  area.innerHTML = '';
  const cat = getCatalog();

  if (currentShopTab === 'acessorios') {
    const grid = document.createElement('div');
    grid.className = 'shop-items-grid';
    (cat.acessorios || []).forEach(item => {
      const isUnlocked = unlockedItems.includes(item.id);
      const isEquipped = equippedItems.includes(item.id);
      const currentColor = itemColors[item.id] || '#2b2725';
      const card = document.createElement('div');
      card.className = 'shop-card';

      const svgRendered = (item.svg || '').replace(/COLOR/g, currentColor);
      card.innerHTML = `
        <div class="shop-card-svg-preview">${svgRendered}</div>
        <div class="shop-card-name">${item.nome}</div>
        <div class="shop-card-price">${isUnlocked ? 'Desbloqueado' : `${item.preco} 🐟`}</div>
        ${isUnlocked ? `<button class="palette-btn" onclick="openColorModal('${item.id}', 'accessory', event)">🎨 Mudar Cor</button>` : ''}
        <button class="action-btn" style="width: 100%; padding: 4px; font-size: 0.85rem; justify-content: center; ${isEquipped ? 'background: var(--amber); color: #fff;' : ''}" onclick="handleAccessoryClick('${item.id}', ${item.preco})">
          ${isUnlocked ? (isEquipped ? 'Equipado ✓' : 'Usar') : 'Comprar'}
        </button>
      `;
      grid.appendChild(card);
    });
    area.appendChild(grid);
  } else if (currentShopTab === 'bocas') {
    renderGenericTabGrid(area, cat.bocas || [], m => activeMouth === m.id, m => {
      if (unlockedItems.includes(m.id)) {
        activeMouth = m.id;
      } else if (userCoins >= m.preco) {
        userCoins -= m.preco;
        unlockedItems.push(m.id);
        activeMouth = m.id;
        playPaperSound();
      } else {
        alert('Peixinhos insuficientes! 🐟');
        return;
      }
      saveStats();
      renderCurrentShopTab();
    });
  } else if (currentShopTab === 'expressoes') {
    renderGenericTabGrid(area, cat.expressoes || [], ex => activeExpr === ex.id, ex => {
      if (unlockedItems.includes(ex.id)) {
        activeExpr = ex.id;
      } else if (userCoins >= ex.preco) {
        userCoins -= ex.preco;
        unlockedItems.push(ex.id);
        activeExpr = ex.id;
        playPaperSound();
      } else {
        alert('Peixinhos insuficientes! 🐟');
        return;
      }
      saveStats();
      renderCurrentShopTab();
    });
  } else if (currentShopTab === 'pupilas') {
    renderGenericTabGrid(area, cat.pupilas || [], p => activePupil === p.id, p => {
      if (unlockedItems.includes(p.id)) {
        activePupil = p.id;
      } else if (userCoins >= p.preco) {
        userCoins -= p.preco;
        unlockedItems.push(p.id);
        activePupil = p.id;
        playPaperSound();
      } else {
        alert('Peixinhos insuficientes! 🐟');
        return;
      }
      saveStats();
      renderCurrentShopTab();
    });
  } else if (currentShopTab === 'olhos') {
    renderGenericTabGrid(area, cat.olhos || [], o => activeEyeColor === o.hex, o => {
      if (unlockedItems.includes(o.id)) {
        activeEyeColor = o.hex;
      } else if (userCoins >= o.preco) {
        userCoins -= o.preco;
        unlockedItems.push(o.id);
        activeEyeColor = o.hex;
        playPaperSound();
      } else {
        alert('Peixinhos insuficientes! 🐟');
        return;
      }
      saveStats();
      renderCurrentShopTab();
    });
  } else if (currentShopTab === 'racas') {
    renderGenericTabGrid(area, cat.racas || [], r => activeBreed === r.id, r => {
      if (unlockedItems.includes(r.id)) {
        activeBreed = r.id;
      } else if (userCoins >= r.preco) {
        userCoins -= r.preco;
        unlockedItems.push(r.id);
        activeBreed = r.id;
        playPaperSound();
      } else {
        alert('Peixinhos insuficientes! 🐟');
        return;
      }
      saveStats();
      renderCurrentShopTab();
    });
  } else if (currentShopTab === 'temas') {
    renderGenericTabGrid(area, cat.temas || [], t => activeTheme === t.id, t => {
      if (unlockedItems.includes(t.id)) {
        activeTheme = t.id;
        if (autoTimeEnabled) toggleAutoTime();
      } else if (userCoins >= t.preco) {
        userCoins -= t.preco;
        unlockedItems.push(t.id);
        activeTheme = t.id;
        if (autoTimeEnabled) toggleAutoTime();
        playPaperSound();
      } else {
        alert('Peixinhos insuficientes! 🐟');
        return;
      }
      saveStats();
      renderCurrentShopTab();
    });
  } else if (currentShopTab === 'efeitos') {
    const grid = document.createElement('div');
    grid.className = 'shop-items-grid';
    (cat.efeitos || []).forEach(e => {
      const isUnlocked = unlockedItems.includes(e.id);
      const isSelected = (activeEffect === e.type);
      const card = document.createElement('div');
      card.className = 'shop-card';

      card.innerHTML = `
        <div style="font-size: 2rem; margin: 2px 0;">${e.icone}</div>
        <div class="shop-card-name">${e.nome}</div>
        <div class="shop-card-price">${isUnlocked ? 'Disponível' : `${e.preco} 🐟`}</div>
        ${isUnlocked ? `<button class="palette-btn" onclick="openColorModal('${e.id}', 'effect', event)">🎨 Cor do Efeito</button>` : ''}
        <button class="action-btn" style="width: 100%; padding: 4px; font-size: 0.85rem; justify-content: center; ${isSelected ? 'background: var(--amber); color: #fff;' : ''}">
          ${isUnlocked ? (isSelected ? 'Equipado ✓' : 'Usar') : 'Comprar'}
        </button>
      `;

      card.querySelector('button.action-btn').onclick = () => {
        if (isUnlocked) {
          activeEffect = e.type;
        } else if (userCoins >= e.preco) {
          userCoins -= e.preco;
          unlockedItems.push(e.id);
          activeEffect = e.type;
          playPaperSound();
        } else {
          alert('Peixinhos insuficientes! 🐟');
          return;
        }
        saveStats();
        renderCurrentShopTab();
      };

      grid.appendChild(card);
    });
    area.appendChild(grid);
  } else if (currentShopTab === 'backup') {
    area.innerHTML = `
      <div style="padding: 10px 4px; text-align: center;">
        <p style="font-size: 1rem; margin-bottom: 12px; color: var(--pencil-light);">Guarde seus dados com segurança:</p>
        <div style="display: flex; gap: 10px;">
          <button class="action-btn" style="flex: 1; justify-content: center;" onclick="exportDataBackup()">📥 Salvar Backup</button>
          <button class="action-btn" style="flex: 1; justify-content: center;" onclick="document.getElementById('import-file-input').click()">📤 Restaurar</button>
          <input type="file" id="import-file-input" style="display: none;" accept=".json" onchange="importDataBackup(event)">
        </div>
      </div>
    `;
  }
}

function renderGenericTabGrid(container, items, isSelectedFn, onSelect) {
  const grid = document.createElement('div');
  grid.className = 'shop-items-grid';
  items.forEach(item => {
    const isUnlocked = unlockedItems.includes(item.id);
    const isSelected = isSelectedFn(item);
    const card = document.createElement('div');
    card.className = 'shop-card';

    let visualPreview = '';
    if (item.svg) {
      visualPreview = `<div class="shop-card-svg-preview">${item.svg}</div>`;
    } else if (item.hex) {
      visualPreview = `<div style="width: 32px; height: 32px; border-radius: 50%; background: ${item.hex}; border: 1.5px solid var(--charcoal); margin: 6px 0;"></div>`;
    } else {
      visualPreview = `<div style="font-size: 1.8rem; margin: 2px 0;">${item.icone || '✨'}</div>`;
    }

    card.innerHTML = `
      ${visualPreview}
      <div class="shop-card-name">${item.nome}</div>
      <div class="shop-card-price">${isUnlocked ? 'Disponível' : `${item.preco} 🐟`}</div>
      <button class="action-btn" style="width: 100%; margin-top: 4px; padding: 4px; font-size: 0.85rem; justify-content: center; ${isSelected ? 'background: var(--amber); color: #fff;' : ''}">
        ${isUnlocked ? (isSelected ? 'Equipado ✓' : 'Usar') : 'Comprar'}
      </button>
    `;
    card.querySelector('button').onclick = () => onSelect(item);
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

function handleAccessoryClick(id, preco) {
  if (unlockedItems.includes(id)) {
    equippedItems = equippedItems.includes(id) ? equippedItems.filter(x => x !== id) : [...equippedItems, id];
  } else if (userCoins >= preco) {
    userCoins -= preco;
    unlockedItems.push(id);
    equippedItems.push(id);
    playPaperSound();
  } else {
    alert('Peixinhos insuficientes! 🐟');
    return;
  }
  saveStats();
  renderCurrentShopTab();
}

let colorTargetItemId = null;
let colorTargetType = 'accessory';

function openColorModal(targetId, type, event) {
  if (event) event.stopPropagation();
  colorTargetItemId = targetId;
  colorTargetType = type;
  const modal = document.getElementById('color-modal');
  const grid = document.getElementById('color-picker-grid');
  grid.innerHTML = '';

  const cat = getCatalog();
  const tintas = cat.tintas || [];
  const currentColor = (type === 'effect') ? effectColor : (itemColors[targetId] || '#2b2725');

  tintas.forEach(t => {
    const colorKey = `${targetId}_color_${t.id}`;
    const isUnlocked = unlockedItems.includes(colorKey) || (t.id === 'c_ambar' && type === 'effect') || (t.id === 'c_preto' && targetId !== 'flower' && targetId !== 'crown') || (t.id === 'c_ambar' && (targetId === 'flower' || targetId === 'crown'));
    const isActive = currentColor === t.hex;

    const card = document.createElement('div');
    card.className = `color-swatch-card ${isActive ? 'active' : ''}`;
    card.innerHTML = `
      <div class="color-swatch-circle" style="background: ${t.hex}"></div>
      <div class="color-swatch-name">${t.nome}</div>
      <div style="font-size: 0.7rem; color: var(--amber); margin-top: 2px;">${isUnlocked ? '✓' : '1 🐟'}</div>
    `;

    card.onclick = (e) => {
      e.stopPropagation();
      if (isUnlocked) {
        if (colorTargetType === 'effect') effectColor = t.hex;
        else itemColors[colorTargetItemId] = t.hex;
        saveStats();
        closeColorModal();
        renderCurrentShopTab();
      } else if (userCoins >= 1) {
        userCoins -= 1;
        unlockedItems.push(colorKey);
        if (colorTargetType === 'effect') effectColor = t.hex;
        else itemColors[colorTargetItemId] = t.hex;
        playPaperSound();
        saveStats();
        closeColorModal();
        renderCurrentShopTab();
      } else {
        alert('Você precisa de 1 peixinho para comprar esta tinta! 🐟');
      }
    };

    grid.appendChild(card);
  });

  modal.classList.add('open');
}

function closeColorModal(event) {
  if (event) event.stopPropagation();
  document.getElementById('color-modal').classList.remove('open');
}

function applyManualTheme() {
  document.body.classList.remove('theme-cafe', 'theme-night');
  const cat = getCatalog();
  const found = (cat.temas || []).find(t => t.id === activeTheme);
  if (found && found.class) document.body.classList.add(found.class);
}

/* INICIALIZAÇÃO DA APLICAÇÃO */
window.addEventListener('DOMContentLoaded', () => {
  statusVisible = false;
  renderPartnerCatStage();
  applyStatusVisibility();

  sideNavOpen = false;
  const sideNav = document.getElementById('side-nav-container');
  const sideArrow = document.getElementById('side-nav-arrow');
  if (sideNav) sideNav.classList.add('collapsed');
  if (sideArrow) sideArrow.innerText = '▶';

  const tray = document.getElementById('inventory-tray');
  if (tray) {
    tray.classList.remove('visible');
    tray.style.display = 'none';
  }

  renderStatusBars();
  renderInventorySlots();
  updateCatStatsOverTime();
  updateLetterHoldingState();
  applyEquippedCosmetics();
  updateWalletUI();

  if (autoTimeEnabled) {
    const autoBtn = document.getElementById('auto-time-btn');
    if (autoBtn) autoBtn.classList.add('active');
    updateTimeTheme();
  }

  setTimeout(() => {
    scrollNavToIndex(1, false);
    updateNavFocus();
  }, 100);

  setTimeout(() => {
    const hint = document.getElementById('nav-swipe-hint');
    if (hint) {
      hint.classList.add('fade-out');
      setTimeout(() => { hint.style.display = 'none'; }, 500);
    }
  }, 4500);

  setInterval(updateCatStatsOverTime, 30000);
});
