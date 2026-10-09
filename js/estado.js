/* =========================================================
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
