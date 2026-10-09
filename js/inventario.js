/* =========================================================
   MOCHILA E DRAG & DROP
========================================================= */

window.toggleBackpack = function(e) {
  if (e) e.stopPropagation();
  const tray = document.getElementById('inventory-tray');
  const btn = document.getElementById('backpack-toggle-btn');
  if (!tray) return;

  const isVisible = tray.classList.contains('visible');
  if (!isVisible) {
    window.renderInventorySlots();
    tray.classList.add('visible');
    if (btn) btn.classList.add('active');
  } else {
    tray.classList.remove('visible');
    if (btn) btn.classList.remove('active');
  }
};

window.renderInventorySlots = function() {
  const container = document.getElementById('inventory-slots-container');
  if (!container) return;
  container.innerHTML = '';

  const foodList = (typeof FOOD_ITEMS !== 'undefined') ? FOOD_ITEMS : [
    { id: 'food_salmon', name: 'Salmão', icon: '🐟', hunger: 30, joy: 20, health: 10, energy: 5 },
    { id: 'food_milk', name: 'Leite', icon: '🥛', hunger: 15, joy: 10, health: 5, energy: 10 }
  ];

  const keys = Object.keys(window.userInventory).filter(k => window.userInventory[k] > 0);
  if (keys.length === 0) {
    container.innerHTML = `<span style="color:#ffd6ad; font-size:0.9rem;">Mochila vazia! Compre na tenda.</span>`;
    return;
  }

  keys.forEach(k => {
    const item = foodList.find(f => f.id === k) || { name: k, icon: '🥫' };
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    slot.innerHTML = `
      <span class="slot-icon">${item.icon}</span>
      <span class="slot-qty">${window.userInventory[k]}</span>
    `;
    slot.onclick = () => window.feedCat(k);
    container.appendChild(slot);
  });
};

window.feedCat = function(foodId) {
  if (!window.userInventory[foodId] || window.userInventory[foodId] <= 0) return;
  window.userInventory[foodId]--;
  if (window.userInventory[foodId] <= 0) delete window.userInventory[foodId];

  window.catStats.hunger = Math.min(100, window.catStats.hunger + 30);
  window.catStats.happiness = Math.min(100, window.catStats.happiness + 15);
  window.saveStats();
  window.renderInventorySlots();
  window.createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 10);
  alert('Gatinho alimentado! 🍲🐾');
};
