/* =========================================================
   MOCHILA DE COMIDINHAS, DRAG & DROP E ALIMENTAÇÃO
========================================================= */

function toggleBackpack(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const tray = document.getElementById('inventory-tray');
  const btn = document.getElementById('backpack-toggle-btn');
  if (!tray) return;

  const isHidden = tray.style.display === 'none' || !tray.classList.contains('visible');

  if (isHidden) {
    tray.style.display = 'block';
    renderInventorySlots();
    // Força reflow antes de adicionar classe para a transição funcionar
    void tray.offsetWidth;
    tray.classList.add('visible');
    if (btn) btn.classList.add('active');
  } else {
    tray.classList.remove('visible');
    if (btn) btn.classList.remove('active');
    setTimeout(() => {
      if (!tray.classList.contains('visible')) {
        tray.style.display = 'none';
      }
    }, 280);
  }
}

function renderInventorySlots() {
  const container = document.getElementById('inventory-slots-container');
  if (!container) return;
  container.innerHTML = '';

  const ownedKeys = Object.keys(userInventory).filter(k => userInventory[k] > 0);

  if (ownedKeys.length === 0) {
    container.innerHTML = `<span style="font-size:0.9rem; color: #ffd6ad; padding: 8px;">A mochila está vazia. Visite a tenda de comidas!</span>`;
    return;
  }

  ownedKeys.forEach(key => {
    const food = FOOD_ITEMS.find(f => f.id === key);
    if (!food) return;

    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    slot.draggable = true;
    slot.innerHTML = `
      <span class="slot-icon">${food.icon}</span>
      <span class="slot-qty">${userInventory[key]}</span>
    `;

    slot.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', key);
    });

    slot.addEventListener('pointerdown', (e) => {
      handleTouchDragFood(e, key, food.icon);
    });

    container.appendChild(slot);
  });
}

// Configuração de Drag & Drop para o gatinho principal
const catWrapper = document.getElementById('cat-wrapper');

if (catWrapper) {
  catWrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
    catWrapper.classList.add('drag-over');
  });

  catWrapper.addEventListener('dragleave', () => {
    catWrapper.classList.remove('drag-over');
  });

  catWrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    catWrapper.classList.remove('drag-over');
    const foodId = e.dataTransfer.getData('text/plain');
    feedCat(foodId);
  });
}

function handleTouchDragFood(event, foodId, iconChar) {
  if (event.pointerType === 'mouse') return;

  const floatingElem = document.createElement('div');
  floatingElem.innerText = iconChar;
  floatingElem.style.position = 'fixed';
  floatingElem.style.fontSize = '2.4rem';
  floatingElem.style.pointerEvents = 'none';
  floatingElem.style.zIndex = '999';
  floatingElem.style.transform = 'translate(-50%, -50%)';
  floatingElem.style.left = `${event.clientX}px`;
  floatingElem.style.top = `${event.clientY}px`;
  document.body.appendChild(floatingElem);

  function onPointerMove(e) {
    floatingElem.style.left = `${e.clientX}px`;
    floatingElem.style.top = `${e.clientY}px`;

    const myRect = catWrapper ? catWrapper.getBoundingClientRect() : null;
    const partnerElem = document.getElementById('partner-cat-wrapper');
    const partnerRect = partnerElem ? partnerElem.getBoundingClientRect() : null;

    if (myRect && e.clientX >= myRect.left && e.clientX <= myRect.right && e.clientY >= myRect.top && e.clientY <= myRect.bottom) {
      catWrapper.classList.add('drag-over');
    } else if (catWrapper) {
      catWrapper.classList.remove('drag-over');
    }

    if (partnerRect && e.clientX >= partnerRect.left && e.clientX <= partnerRect.right && e.clientY >= partnerRect.top && e.clientY <= partnerRect.bottom) {
      partnerElem.classList.add('drag-over');
    } else if (partnerElem) {
      partnerElem.classList.remove('drag-over');
    }
  }

  function onPointerUp(e) {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    floatingElem.remove();

    if (catWrapper) catWrapper.classList.remove('drag-over');
    const partnerElem = document.getElementById('partner-cat-wrapper');
    if (partnerElem) partnerElem.classList.remove('drag-over');

    const myRect = catWrapper ? catWrapper.getBoundingClientRect() : null;
    const partnerRect = partnerElem ? partnerElem.getBoundingClientRect() : null;

    if (myRect && e.clientX >= myRect.left && e.clientX <= myRect.right && e.clientY >= myRect.top && e.clientY <= myRect.bottom) {
      feedCat(foodId);
    } else if (partnerRect && e.clientX >= partnerRect.left && e.clientX <= partnerRect.right && e.clientY >= partnerRect.top && e.clientY <= partnerRect.bottom) {
      if (typeof feedPartnerCat === 'function') {
        feedPartnerCat(foodId);
      }
    }
  }

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
}

function feedCat(foodId) {
  if (!userInventory[foodId] || userInventory[foodId] <= 0) return;

  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  userInventory[foodId]--;
  if (userInventory[foodId] <= 0) delete userInventory[foodId];

  catStats.hunger = Math.min(100, catStats.hunger + food.hunger);
  catStats.health = Math.min(100, catStats.health + food.health);
  catStats.energy = Math.min(100, catStats.energy + food.energy);
  catStats.happiness = Math.min(100, catStats.happiness + food.joy);

  playPaperSound();
  playMeowSound();
  saveStats();
  renderInventorySlots();

  // Envia atualização de status em tempo real para a parceira via PeerJS
  if (typeof sendMyCurrentStats === 'function') {
    sendMyCurrentStats();
  }

  const mouthVariants = ['mouth-cat-path', 'mouth-tongue-path', 'mouth-vampire-path', 'mouth-smile-path', 'mouth-sad'];
  mouthVariants.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const hungryMouth = document.getElementById('mouth-hungry');
  if (hungryMouth) hungryMouth.style.display = 'block';

  const rect = catWrapper.getBoundingClientRect();
  createFloatingParticles(rect.left + rect.width / 2, rect.top + 60, 8);

  setTimeout(() => {
    if (hungryMouth) hungryMouth.style.display = 'none';
    updateCatVisualExpression();
    applyMouthAndExpressions();
  }, 1000);
}/* =========================================================
   MOCHILA DE COMIDINHAS, DRAG & DROP E ALIMENTAÇÃO
========================================================= */

function toggleBackpack(e) {
  if (e) e.stopPropagation();
  const tray = document.getElementById('inventory-tray');
  const btn = document.getElementById('backpack-toggle-btn');
  if (!tray) return;

  const isHidden = !tray.classList.contains('visible') || tray.style.display === 'none';

  if (isHidden) {
    tray.style.display = 'block';
    requestAnimationFrame(() => {
      tray.classList.add('visible');
    });
    if (btn) btn.classList.add('active');
    renderInventorySlots();
    tray.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    tray.classList.remove('visible');
    if (btn) btn.classList.remove('active');
    setTimeout(() => {
      if (!tray.classList.contains('visible')) {
        tray.style.display = 'none';
      }
    }, 280);
  }
}

function renderInventorySlots() {
  const container = document.getElementById('inventory-slots-container');
  if (!container) return;
  container.innerHTML = '';

  const ownedKeys = Object.keys(userInventory).filter(k => userInventory[k] > 0);

  if (ownedKeys.length === 0) {
    container.innerHTML = `<span style="font-size:0.9rem; color: #ffd6ad; padding: 8px;">A mochila está vazia. Visite a tenda de comidas!</span>`;
    return;
  }

  ownedKeys.forEach(key => {
    const food = FOOD_ITEMS.find(f => f.id === key);
    if (!food) return;

    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    slot.draggable = true;
    slot.innerHTML = `
      <span class="slot-icon">${food.icon}</span>
      <span class="slot-qty">${userInventory[key]}</span>
    `;

    slot.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', key);
    });

    slot.addEventListener('pointerdown', (e) => {
      handleTouchDragFood(e, key, food.icon);
    });

    container.appendChild(slot);
  });
}

const catWrapper = document.getElementById('cat-wrapper');

if (catWrapper) {
  catWrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
    catWrapper.classList.add('drag-over');
  });

  catWrapper.addEventListener('dragleave', () => {
    catWrapper.classList.remove('drag-over');
  });

  catWrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    catWrapper.classList.remove('drag-over');
    const foodId = e.dataTransfer.getData('text/plain');
    feedCat(foodId);
  });
}

function handleTouchDragFood(event, foodId, iconChar) {
  if (event.pointerType === 'mouse') return;

  const floatingElem = document.createElement('div');
  floatingElem.innerText = iconChar;
  floatingElem.style.position = 'fixed';
  floatingElem.style.fontSize = '2.4rem';
  floatingElem.style.pointerEvents = 'none';
  floatingElem.style.zIndex = '999';
  floatingElem.style.transform = 'translate(-50%, -50%)';
  floatingElem.style.left = `${event.clientX}px`;
  floatingElem.style.top = `${event.clientY}px`;
  document.body.appendChild(floatingElem);

  function onPointerMove(e) {
    floatingElem.style.left = `${e.clientX}px`;
    floatingElem.style.top = `${e.clientY}px`;

    const catRect = catWrapper.getBoundingClientRect();
    if (
      e.clientX >= catRect.left &&
      e.clientX <= catRect.right &&
      e.clientY >= catRect.top &&
      e.clientY <= catRect.bottom
    ) {
      catWrapper.classList.add('drag-over');
    } else {
      catWrapper.classList.remove('drag-over');
    }
  }

  function onPointerUp(e) {
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    floatingElem.remove();
    catWrapper.classList.remove('drag-over');

    const catRect = catWrapper.getBoundingClientRect();
    if (
      e.clientX >= catRect.left &&
      e.clientX <= catRect.right &&
      e.clientY >= catRect.top &&
      e.clientY <= catRect.bottom
    ) {
      feedCat(foodId);
    }
  }

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
}

function feedCat(foodId) {
  if (!userInventory[foodId] || userInventory[foodId] <= 0) return;

  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  userInventory[foodId]--;
  if (userInventory[foodId] <= 0) delete userInventory[foodId];

  catStats.hunger = Math.min(100, catStats.hunger + food.hunger);
  catStats.health = Math.min(100, catStats.health + food.health);
  catStats.energy = Math.min(100, catStats.energy + food.energy);
  catStats.happiness = Math.min(100, catStats.happiness + food.joy);

  playPaperSound();
  playMeowSound();
  saveStats();
  renderInventorySlots();

  const mouthVariants = ['mouth-cat-path', 'mouth-tongue-path', 'mouth-vampire-path', 'mouth-smile-path', 'mouth-sad'];
  mouthVariants.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const hungryMouth = document.getElementById('mouth-hungry');
  if (hungryMouth) hungryMouth.style.display = 'block';

  const rect = catWrapper.getBoundingClientRect();
  createFloatingParticles(rect.left + rect.width / 2, rect.top + 60, 8);

  setTimeout(() => {
    if (hungryMouth) hungryMouth.style.display = 'none';
    updateCatVisualExpression();
    applyMouthAndExpressions();
  }, 1000);
}
