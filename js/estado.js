/* =========================================================
   ESTADO GLOBAL, SALVAMENTO (LOCALSTORAGE) E TEMPORIZADORES
========================================================= */

const FOOD_ITEMS = [
  { id: 'food_bread', name: 'Pão Quentinho', icon: '🍞', price: 2, hunger: +18, health: 0, energy: +5, joy: +2 },
  { id: 'food_starfruit', name: 'Fruta Estrela', icon: '🍏', price: 3, hunger: +22, health: +5, energy: 0, joy: +10 },
  { id: 'food_salmon', name: 'Sachê Salmão', icon: '🐟', price: 4, hunger: +35, health: +8, energy: 0, joy: +12 },
  { id: 'food_steak', name: 'Bife Suculento', icon: '🥩', price: 5, hunger: +45, health: +5, energy: +12, joy: +15 },
  { id: 'food_milk', name: 'Leitinho Fresco', icon: '🥛', price: 2, hunger: +15, health: +2, energy: +18, joy: +8 },
  { id: 'food_potion', name: 'Poção Revigorante', icon: '🧪', price: 6, hunger: +20, health: +35, energy: +10, joy: +5 }
];

let userInventory = JSON.parse(localStorage.getItem('cat_inventory') || '{"food_bread": 2, "food_milk": 1}');
let catStats = JSON.parse(localStorage.getItem('cat_stats') || JSON.stringify({
  hunger: 80, energy: 80, happiness: 85, health: 95, lastUpdate: Date.now()
}));

let userCoins = parseInt(localStorage.getItem('cat_coins') || '0', 10);
let userPawCoins = parseInt(localStorage.getItem('cat_paw_coins') || '20', 10);
let unlockedItems = JSON.parse(localStorage.getItem('cat_unlocked') || '["theme_default", "fx_hearts", "breed_default", "eye_charcoal", "pupil_round", "mouth_cat", "expr_neutral", "bowtie_color_c_preto", "glasses_color_c_preto", "flower_color_c_ambar", "crown_color_c_ambar"]');
let equippedItems = JSON.parse(localStorage.getItem('cat_equipped') || '["fx_hearts"]');
let itemColors = JSON.parse(localStorage.getItem('cat_item_colors') || '{"bowtie":"#2b2725","glasses":"#2b2725","flower":"#c48b36","crown":"#ecd29b"}');
let activeEyeColor = localStorage.getItem('cat_active_eye_color') || '#2b2725';
let activePupil = localStorage.getItem('cat_active_pupil') || 'pupil_round';
let activeBreed = localStorage.getItem('cat_active_breed') || 'breed_default';
let activeMouth = localStorage.getItem('cat_active_mouth') || 'mouth_cat';
let activeExpr = localStorage.getItem('cat_active_expr') || 'expr_neutral';
let activeTheme = localStorage.getItem('cat_active_theme') || 'theme_default';
let activeEffect = localStorage.getItem('cat_active_effect') || 'heart';
let effectColor = localStorage.getItem('cat_effect_color') || '#c48b36';
let currentShopTab = 'acessorios';

function getCatalog() {
  return (window.CATALOGO_COSMETICOS && window.CATALOGO_COSMETICOS.acessorios) ? window.CATALOGO_COSMETICOS : {};
}

function saveStats() {
  localStorage.setItem('cat_stats', JSON.stringify(catStats));
  localStorage.setItem('cat_inventory', JSON.stringify(userInventory));
  localStorage.setItem('cat_paw_coins', userPawCoins);
  localStorage.setItem('cat_coins', userCoins);
  localStorage.setItem('cat_unlocked', JSON.stringify(unlockedItems));
  localStorage.setItem('cat_equipped', JSON.stringify(equippedItems));
  localStorage.setItem('cat_item_colors', JSON.stringify(itemColors));
  localStorage.setItem('cat_active_eye_color', activeEyeColor);
  localStorage.setItem('cat_active_pupil', activePupil);
  localStorage.setItem('cat_active_breed', activeBreed);
  localStorage.setItem('cat_active_mouth', activeMouth);
  localStorage.setItem('cat_active_expr', activeExpr);
  localStorage.setItem('cat_active_theme', activeTheme);
  localStorage.setItem('cat_active_effect', activeEffect);
  localStorage.setItem('cat_effect_color', effectColor);

  renderStatusBars();
  updateCatVisualExpression();
  applyEquippedCosmetics();
  applyBreeds();
  applyEyeColorAndPupils();
  applyMouthAndExpressions();
  updateMiniPreview();
  updateWalletUI();
  if (!autoTimeEnabled) applyManualTheme();

  // Se houver conexão com o parceiro, sincroniza os novos status
  if (typeof syncMyStatsToPartner === 'function') {
    syncMyStatsToPartner();
  }
}

function isStatusCritical() {
  return catStats.hunger < 30 || catStats.energy < 30 || catStats.happiness < 30 || catStats.health < 30;
}

function updateCatStatsOverTime() {
  const now = Date.now();
  const elapsedMinutes = (now - catStats.lastUpdate) / (1000 * 60);

  if (elapsedMinutes >= 1) {
    const decayUnits = Math.floor(elapsedMinutes / 10);
    if (decayUnits > 0) {
      catStats.hunger = Math.max(0, catStats.hunger - decayUnits * 2);
      catStats.energy = Math.max(0, catStats.energy - decayUnits * 1.5);
      catStats.happiness = Math.max(0, catStats.happiness - decayUnits * 2);
      
      if (catStats.hunger < 25 || catStats.energy < 25) {
        catStats.health = Math.max(0, catStats.health - decayUnits * 3);
      }
      catStats.lastUpdate = now;
      saveStats();
    }
  }
  renderStatusBars();
  updateCatVisualExpression();
}

function renderStatusBars() {
  const updateSquareFill = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.height = `${val}%`;
    if (val <= 30) {
      el.style.backgroundColor = '#c0392b';
    } else if (val >= 70) {
      el.style.backgroundColor = '#27ae60';
    } else {
      el.style.backgroundColor = 'var(--amber)';
    }
  };

  updateSquareFill('fill-hunger', catStats.hunger);
  updateSquareFill('fill-energy', catStats.energy);
  updateSquareFill('fill-happiness', catStats.happiness);
  updateSquareFill('fill-health', catStats.health);
}

function openWalletModal(e) {
  if (e) e.stopPropagation();
  updateWalletUI();
  document.getElementById('wallet-modal').classList.add('open');
}

function closeWalletModal(e) {
  if (e) e.stopPropagation();
  document.getElementById('wallet-modal').classList.remove('open');
}

function updateWalletUI() {
  const wCoins = document.getElementById('wallet-coin-val');
  const wPaws = document.getElementById('wallet-paw-val');
  if (wCoins) wCoins.innerText = userCoins;
  if (wPaws) wPaws.innerText = userPawCoins;
}

function checkDailyRewardManual() {
  if (isStatusCritical()) {
    alert("O gatinho está muito debilitado ou com fome para pescar hoje... Cuide dele primeiro! 😿");
    return;
  }
  const today = new Date().toDateString();
  const lastClaim = localStorage.getItem('cat_last_reward_date');

  if (lastClaim !== today) {
    userCoins += 1;
    localStorage.setItem('cat_last_reward_date', today);
    saveStats();
    playPaperSound();
    alert("🎁 Você resgatou 1 Peixinho Diário com sucesso! 🐟");
  } else {
    alert("Você já resgatou o peixinho de hoje! Volte amanhã 🐾");
  }
}

function exportDataBackup() {
  const backupData = {
    cat_coins: userCoins,
    cat_paw_coins: userPawCoins,
    cat_stats: catStats,
    cat_inventory: userInventory,
    cat_unlocked: unlockedItems,
    cat_equipped: equippedItems,
    cat_item_colors: itemColors,
    cat_active_eye_color: activeEyeColor,
    cat_active_pupil: activePupil,
    cat_active_breed: activeBreed,
    cat_active_mouth: activeMouth,
    cat_active_expr: activeExpr,
    cat_active_theme: activeTheme,
    cat_active_effect: activeEffect,
    cat_effect_color: effectColor,
    cat_last_reward_date: localStorage.getItem('cat_last_reward_date'),
    cat_last_opened_period: localStorage.getItem('cat_last_opened_period'),
    backup_date: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "backup_gatinho.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importDataBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.cat_coins !== undefined) userCoins = data.cat_coins;
      if (data.cat_paw_coins !== undefined) userPawCoins = data.cat_paw_coins;
      if (data.cat_stats) catStats = data.cat_stats;
      if (data.cat_inventory) userInventory = data.cat_inventory;
      if (Array.isArray(data.cat_unlocked)) unlockedItems = data.cat_unlocked;
      if (Array.isArray(data.cat_equipped)) equippedItems = data.cat_equipped;
      if (data.cat_item_colors) itemColors = data.cat_item_colors;
      if (data.cat_active_eye_color) activeEyeColor = data.cat_active_eye_color;
      if (data.cat_active_pupil) activePupil = data.cat_active_pupil;
      if (data.cat_active_breed) activeBreed = data.cat_active_breed;
      if (data.cat_active_mouth) activeMouth = data.cat_active_mouth;
      if (data.cat_active_expr) activeExpr = data.cat_active_expr;
      if (data.cat_active_theme) activeTheme = data.cat_active_theme;
      if (data.cat_active_effect) activeEffect = data.cat_active_effect;
      if (data.cat_effect_color) effectColor = data.cat_effect_color;

      saveStats();
      updateLetterHoldingState();
      renderInventorySlots();
      renderCurrentShopTab();
      alert('Backup restaurado com sucesso!');
    } catch (err) {
      alert('Erro ao carregar o arquivo de backup.');
    }
  };
  reader.readAsText(file);
}/* =========================================================
   ESTADO GLOBAL DO JOGADOR
========================================================= */

window.catStats = {
  hunger: 80,
  energy: 80,
  happiness: 80,
  health: 90,
  fishCoins: 2,
  pawCoins: 10,
  lastRewardDate: null
};

window.userInventory = {
  food_salmon: 2,
  food_milk: 1
};

window.equippedItems = [];
window.itemColors = {};
window.activeBreed = 'breed_white';
window.activeEyeColor = '#2b2725';
window.activePupil = 'pupil_normal';
window.activeMouth = 'mouth_cat';
window.activeExpr = 'none';

window.loadStats = function() {
  const saved = localStorage.getItem('cat_user_stats');
  if (saved) {
    try {
      window.catStats = Object.assign(window.catStats, JSON.parse(saved));
    } catch (e) {}
  }
  const savedInv = localStorage.getItem('cat_user_inventory');
  if (savedInv) {
    try {
      window.userInventory = JSON.parse(savedInv);
    } catch (e) {}
  }
  const savedBreed = localStorage.getItem('cat_breed');
  if (savedBreed) window.activeBreed = savedBreed;

  const savedEye = localStorage.getItem('cat_eyecolor');
  if (savedEye) window.activeEyeColor = savedEye;

  updateStatusBars();
};

window.saveStats = function() {
  localStorage.setItem('cat_user_stats', JSON.stringify(window.catStats));
  localStorage.setItem('cat_user_inventory', JSON.stringify(window.userInventory));
  updateStatusBars();
};

window.updateStatusBars = function() {
  const fH = document.getElementById('fill-hunger');
  const fE = document.getElementById('fill-energy');
  const fHa = document.getElementById('fill-happiness');
  const fHe = document.getElementById('fill-health');

  if (fH) fH.style.height = `${window.catStats.hunger}%`;
  if (fE) fE.style.height = `${window.catStats.energy}%`;
  if (fHa) fHa.style.height = `${window.catStats.happiness}%`;
  if (fHe) fHe.style.height = `${window.catStats.health}%`;
};
