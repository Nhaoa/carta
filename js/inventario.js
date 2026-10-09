/* =========================================================
   MOCHILA DE COMIDINHAS, DRAG & DROP E ALIMENTAÇÃO
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
    tray.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    { id: 'food_milk', name: 'Leite', icon: '🥛', hunger: 15, joy: 10, health: 5, energy: 10 },
    { id: 'food_treat', name: 'Petisco', icon: '🍪', hunger: 20, joy: 25, health: 5, energy: 5 },
    { id: 'food_tuna', name: 'Atum', icon: '🥫', hunger: 35, joy: 20, health: 15, energy: 10 }
  ];

  const keys = Object.keys(window.userInventory).filter(k => window.userInventory[k] > 0);
  if (keys.length === 0) {
    container.innerHTML = `<span style="color:#ffd6ad; font-size:0.9rem; padding: 6px;">Mochila vazia! Compre comidinhas na tenda.</span>`;
    return;
  }

  keys.forEach(k => {
    const item = foodList.find(f => f.id === k) || { name: k, icon: '🥫' };
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    slot.draggable = true;
    slot.title = `Arraste até o gatinho ou toque para comer! (+${item.hunger || 20} Fome)`;
    slot.innerHTML = `
      <span class="slot-icon">${item.icon}</span>
      <span class="slot-qty">${window.userInventory[k]}</span>
    `;

    // Suporte ao arrasto via rato desktop
    slot.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', k);
    });

    // Suporte ao toque móvel (touch drag com preview flutuante)
    slot.addEventListener('pointerdown', (e) => {
      handleTouchDrag(e, k, item.icon);
    });

    container.appendChild(slot);
  });
};

function handleTouchDrag(event, foodId, iconChar) {
  if (event.pointerType === 'mouse') return;

  const float = document.createElement('div');
  float.innerText = iconChar;
  float.style.position = 'fixed';
  float.style.fontSize = '2.4rem';
  float.style.pointerEvents = 'none';
  float.style.zIndex = '9999';
  float.style.transform = 'translate(-50%, -50%)';
  float.style.left = `${event.clientX}px`;
  float.style.top = `${event.clientY}px`;
  document.body.appendChild(float);

  const cat1 = document.getElementById('cat-wrapper');
  const cat2 = document.getElementById('partner-cat-wrapper');

  function onMove(e) {
    float.style.left = `${e.clientX}px`;
    float.style.top = `${e.clientY}px`;

    const r1 = cat1 ? cat1.getBoundingClientRect() : null;
    const r2 = (cat2 && cat2.style.display !== 'none') ? cat2.getBoundingClientRect() : null;

    if (r1 && e.clientX >= r1.left && e.clientX <= r1.right && e.clientY >= r1.top && e.clientY <= r1.bottom) {
      cat1.classList.add('drag-over');
    } else if (cat1) {
      cat1.classList.remove('drag-over');
    }

    if (r2 && e.clientX >= r2.left && e.clientX <= r2.right && e.clientY >= r2.top && e.clientY <= r2.bottom) {
      cat2.classList.add('drag-over');
    } else if (cat2) {
      cat2.classList.remove('drag-over');
    }
  }

  function onUp(e) {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    float.remove();

    if (cat1) cat1.classList.remove('drag-over');
    if (cat2) cat2.classList.remove('drag-over');

    const r1 = cat1 ? cat1.getBoundingClientRect() : null;
    const r2 = (cat2 && cat2.style.display !== 'none') ? cat2.getBoundingClientRect() : null;

    if (r1 && e.clientX >= r1.left && e.clientX <= r1.right && e.clientY >= r1.top && e.clientY <= r1.bottom) {
      window.feedCat(foodId);
    } else if (r2 && e.clientX >= r2.left && e.clientX <= r2.right && e.clientY >= r2.top && e.clientY <= r2.bottom) {
      if (typeof window.feedPartnerCat === 'function') window.feedPartnerCat(foodId);
    }
  }

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
}

window.feedCat = function(foodId) {
  if (!window.userInventory[foodId] || window.userInventory[foodId] <= 0) return;

  const foodList = (typeof FOOD_ITEMS !== 'undefined') ? FOOD_ITEMS : [];
  const food = foodList.find(f => f.id === foodId) || { hunger: 25, joy: 15, health: 10, energy: 10 };

  window.userInventory[foodId]--;
  if (window.userInventory[foodId] <= 0) delete window.userInventory[foodId];

  window.catStats.hunger = Math.min(100, window.catStats.hunger + (food.hunger || 25));
  window.catStats.happiness = Math.min(100, window.catStats.happiness + (food.joy || 15));
  window.catStats.health = Math.min(100, window.catStats.health + (food.health || 10));
  window.catStats.energy = Math.min(100, window.catStats.energy + (food.energy || 10));

  window.saveStats();
  window.renderInventorySlots();
  if (typeof window.playPaperSound === 'function') window.playPaperSound();
  if (typeof window.playMeowSound === 'function') window.playMeowSound();

  if (typeof window.sendMyCurrentStats === 'function') {
    window.sendMyCurrentStats();
  }

  // Animação de mastigação com abertura de boca
  const svg = document.getElementById('main-cat-svg');
  if (svg) {
    const hungryMouth = svg.querySelector('#mouth-hungry');
    if (hungryMouth) hungryMouth.style.display = 'block';
    setTimeout(() => {
      if (hungryMouth) hungryMouth.style.display = 'none';
      window.applyMouthAndExpressions();
    }, 900);
  }

  const rect = document.getElementById('cat-wrapper').getBoundingClientRect();
  window.createFloatingParticles(rect.left + rect.width / 2, rect.top + 40, 10);
};

// Registar os listeners do drag & drop no carregamento
window.addEventListener('DOMContentLoaded', () => {
  const cat1 = document.getElementById('cat-wrapper');
  if (cat1) {
    cat1.addEventListener('dragover', (e) => { e.preventDefault(); cat1.classList.add('drag-over'); });
    cat1.addEventListener('dragleave', () => cat1.classList.remove('drag-over'));
    cat1.addEventListener('drop', (e) => {
      e.preventDefault();
      cat1.classList.remove('drag-over');
      const foodId = e.dataTransfer.getData('text/plain');
      window.feedCat(foodId);
    });
  }

  const cat2 = document.getElementById('partner-cat-wrapper');
  if (cat2) {
    cat2.addEventListener('dragover', (e) => { e.preventDefault(); cat2.classList.add('drag-over'); });
    cat2.addEventListener('dragleave', () => cat2.classList.remove('drag-over'));
    cat2.addEventListener('drop', (e) => {
      e.preventDefault();
      cat2.classList.remove('drag-over');
      const foodId = e.dataTransfer.getData('text/plain');
      if (typeof window.feedPartnerCat === 'function') window.feedPartnerCat(foodId);
    });
  }
});/* =========================================================
   MOCHILA DE COMIDINHAS, DRAG & DROP E ALIMENTAÇÃO
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
    tray.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    { id: 'food_milk', name: 'Leite', icon: '🥛', hunger: 15, joy: 10, health: 5, energy: 10 },
    { id: 'food_treat', name: 'Petisco', icon: '🍪', hunger: 20, joy: 25, health: 5, energy: 5 },
    { id: 'food_tuna', name: 'Atum', icon: '🥫', hunger: 35, joy: 20, health: 15, energy: 10 }
  ];

  const keys = Object.keys(window.userInventory).filter(k => window.userInventory[k] > 0);
  if (keys.length === 0) {
    container.innerHTML = `<span style="color:#ffd6ad; font-size:0.9rem; padding: 6px;">Mochila vazia! Compre na tenda de comidas.</span>`;
    return;
  }

  keys.forEach(k => {
    const item = foodList.find(f => f.id === k) || { name: k, icon: '🥫' };
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    slot.draggable = true;
    slot.innerHTML = `
      <span class="slot-icon">${item.icon}</span>
      <span class="slot-qty">${window.userInventory[k]}</span>
    `;

    slot.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', k);
    });

    slot.addEventListener('pointerdown', (e) => {
      handleTouchDrag(e, k, item.icon);
    });

    slot.onclick = () => window.feedCat(k);
    container.appendChild(slot);
  });
};

function handleTouchDrag(event, foodId, iconChar) {
  if (event.pointerType === 'mouse') return;

  const float = document.createElement('div');
  float.innerText = iconChar;
  float.style.position = 'fixed';
  float.style.fontSize = '2.4rem';
  float.style.pointerEvents = 'none';
  float.style.zIndex = '9999';
  float.style.transform = 'translate(-50%, -50%)';
  float.style.left = `${event.clientX}px`;
  float.style.top = `${event.clientY}px`;
  document.body.appendChild(float);

  const cat1 = document.getElementById('cat-wrapper');
  const cat2 = document.getElementById('partner-cat-wrapper');

  function onMove(e) {
    float.style.left = `${e.clientX}px`;
    float.style.top = `${e.clientY}px`;

    const r1 = cat1 ? cat1.getBoundingClientRect() : null;
    const r2 = (cat2 && cat2.style.display !== 'none') ? cat2.getBoundingClientRect() : null;

    if (r1 && e.clientX >= r1.left && e.clientX <= r1.right && e.clientY >= r1.top && e.clientY <= r1.bottom) {
      cat1.classList.add('drag-over');
    } else if (cat1) {
      cat1.classList.remove('drag-over');
    }

    if (r2 && e.clientX >= r2.left && e.clientX <= r2.right && e.clientY >= r2.top && e.clientY <= r2.bottom) {
      cat2.classList.add('drag-over');
    } else if (cat2) {
      cat2.classList.remove('drag-over');
    }
  }

  function onUp(e) {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    float.remove();

    if (cat1) cat1.classList.remove('drag-over');
    if (cat2) cat2.classList.remove('drag-over');

    const r1 = cat1 ? cat1.getBoundingClientRect() : null;
    const r2 = (cat2 && cat2.style.display !== 'none') ? cat2.getBoundingClientRect() : null;

    if (r1 && e.clientX >= r1.left && e.clientX <= r1.right && e.clientY >= r1.top && e.clientY <= r1.bottom) {
      window.feedCat(foodId);
    } else if (r2 && e.clientX >= r2.left && e.clientX <= r2.right && e.clientY >= r2.top && e.clientY <= r2.bottom) {
      if (typeof window.feedPartnerCat === 'function') window.feedPartnerCat(foodId);
    }
  }

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
}

window.feedCat = function(foodId) {
  if (!window.userInventory[foodId] || window.userInventory[foodId] <= 0) return;

  const foodList = (typeof FOOD_ITEMS !== 'undefined') ? FOOD_ITEMS : [];
  const food = foodList.find(f => f.id === foodId) || { hunger: 25, joy: 15, health: 10, energy: 10 };

  window.userInventory[foodId]--;
  if (window.userInventory[foodId] <= 0) delete window.userInventory[foodId];

  window.catStats.hunger = Math.min(100, window.catStats.hunger + (food.hunger || 25));
  window.catStats.happiness = Math.min(100, window.catStats.happiness + (food.joy || 15));
  window.catStats.health = Math.min(100, window.catStats.health + (food.health || 10));
  window.catStats.energy = Math.min(100, window.catStats.energy + (food.energy || 10));

  window.saveStats();
  window.renderInventorySlots();
  if (typeof window.playPaperSound === 'function') window.playPaperSound();
  if (typeof window.playMeowSound === 'function') window.playMeowSound();

  if (typeof window.sendMyCurrentStats === 'function') {
    window.sendMyCurrentStats();
  }

  const svg = document.getElementById('main-cat-svg');
  if (svg) {
    const hungryMouth = svg.querySelector('#mouth-hungry');
    if (hungryMouth) hungryMouth.style.display = 'block';
    setTimeout(() => {
      if (hungryMouth) hungryMouth.style.display = 'none';
      window.applyMouthAndExpressions();
    }, 800);
  }

  const rect = document.getElementById('cat-wrapper').getBoundingClientRect();
  window.createFloatingParticles(rect.left + rect.width / 2, rect.top + 40, 10);
};

// Listeners de drop no desktop
window.addEventListener('DOMContentLoaded', () => {
  const cat1 = document.getElementById('cat-wrapper');
  if (cat1) {
    cat1.addEventListener('dragover', (e) => { e.preventDefault(); cat1.classList.add('drag-over'); });
    cat1.addEventListener('dragleave', () => cat1.classList.remove('drag-over'));
    cat1.addEventListener('drop', (e) => {
      e.preventDefault();
      cat1.classList.remove('drag-over');
      const foodId = e.dataTransfer.getData('text/plain');
      window.feedCat(foodId);
    });
  }
});/* =========================================================
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
