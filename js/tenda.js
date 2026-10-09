/* =========================================================
   TENDA DE COMIDA RÚSTICA COM VENDEDOR INTERATIVO
========================================================= */

window.openFoodStall = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('stall-modal');
  if (!modal) return;
  modal.classList.add('open');
  renderFoodStallShelf();
};

window.closeFoodStall = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('stall-modal');
  if (modal) modal.classList.remove('open');
};

function renderFoodStallShelf() {
  const grid = document.getElementById('stall-shelf-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const foodList = (typeof FOOD_ITEMS !== 'undefined') ? FOOD_ITEMS : [
    { id: 'food_salmon', name: 'Salmão Fresco', icon: '🐟', price: 2, hunger: 35, joy: 20 },
    { id: 'food_milk', name: 'Tigela de Leite', icon: '🥛', price: 1, hunger: 15, joy: 10 },
    { id: 'food_treat', name: 'Biscoitinho', icon: '🍪', price: 1, hunger: 20, joy: 25 },
    { id: 'food_tuna', name: 'Lata de Atum', icon: '🥫', price: 2, hunger: 40, joy: 20 },
    { id: 'food_shrimp', name: 'Camarãozin', icon: '🦐', price: 3, hunger: 45, joy: 30 }
  ];

  foodList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shelf-item-card';
    card.innerHTML = `
      <span class="shelf-item-icon">${item.icon}</span>
      <span class="shelf-item-name">${item.name}</span>
      <span class="shelf-item-price">${item.price} 🐟</span>
      <button class="shelf-buy-btn" onclick="buyFoodItem('${item.id}', ${item.price}, '${item.name}')">Comprar</button>
    `;
    grid.appendChild(card);
  });
}

window.buyFoodItem = function(foodId, price, foodName) {
  if (window.catStats.fishCoins < price) {
    const bubble = document.getElementById('vendor-speech-bubble');
    if (bubble) bubble.innerText = "Miau... você não tem peixinhos suficientes! 🐟❌";
    return;
  }

  window.catStats.fishCoins -= price;
  window.userInventory[foodId] = (window.userInventory[foodId] || 0) + 1;
  window.saveStats();

  // Reação do gato vendedor
  const vendorCat = document.getElementById('vendor-cat-svg');
  const bubble = document.getElementById('vendor-speech-bubble');
  const eyesNormal = document.getElementById('vendor-eyes-normal');
  const eyesHappy = document.getElementById('vendor-eyes-happy');

  if (vendorCat) vendorCat.classList.add('happy');
  if (eyesNormal) eyesNormal.style.display = 'none';
  if (eyesHappy) eyesHappy.style.display = 'block';

  if (bubble) bubble.innerText = `Obrigado! Um ${foodName} fresquinho pra você! 🍲💖`;
  if (typeof window.playPaperSound === 'function') window.playPaperSound();

  setTimeout(() => {
    if (vendorCat) vendorCat.classList.remove('happy');
    if (eyesNormal) eyesNormal.style.display = 'block';
    if (eyesHappy) eyesHappy.style.display = 'none';
  }, 1200);

  // Atualizar a mochila se estiver aberta
  window.renderInventorySlots();
};/* =========================================================
   TENDA DE COMIDA
========================================================= */

window.openFoodStall = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('stall-modal');
  if (!modal) return;
  modal.classList.add('open');
  renderFoodStallShelf();
};

window.closeFoodStall = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('stall-modal');
  if (modal) modal.classList.remove('open');
};

function renderFoodStallShelf() {
  const grid = document.getElementById('stall-shelf-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="shelf-item-card" onclick="buyFood('food_salmon', 1)">
      <span style="font-size: 2rem;">🐟</span>
      <b>Salmão</b>
      <span>1 🐟</span>
    </div>
    <div class="shelf-item-card" onclick="buyFood('food_milk', 1)">
      <span style="font-size: 2rem;">🥛</span>
      <b>Leite</b>
      <span>1 🐟</span>
    </div>
  `;
}

window.buyFood = function(id, price) {
  if (window.catStats.fishCoins < price) {
    alert('Peixinhos insuficientes!');
    return;
  }
  window.catStats.fishCoins -= price;
  window.userInventory[id] = (window.userInventory[id] || 0) + 1;
  window.saveStats();
  alert('Comida comprada com sucesso!');
};/* =========================================================
   TENDA DE COMIDA, VENDEDOR E COMPRAS
========================================================= */

const VENDOR_GREETINGS = [
  "Miau! Seja muito bem-vindo à feira! 🧺",
  "Tudo fresquinho, colhido hoje mesmo! 🍲",
  "Procurando algo gostoso pro seu bichano? 🐾",
  "Sinta o cheirinho desse pão quente! 🍞"
];

const VENDOR_THANKS = [
  "Muito obrigado! Seu gatinho vai adorar! 😻",
  "Miau! Excelente escolha, bem saboroso!",
  "Embrulhado com muito carinho! Volte sempre!",
  "Que delícia! Bom apetite pro seu bichano! 🐟"
];

function setVendorSpeech(text) {
  const bubble = document.getElementById('vendor-speech-bubble');
  if (bubble) bubble.innerText = text;
}

function triggerVendorHappyAnimation() {
  const catSvg = document.getElementById('vendor-cat-svg');
  const eyesNormal = document.getElementById('vendor-eyes-normal');
  const eyesHappy = document.getElementById('vendor-eyes-happy');

  if (catSvg && eyesNormal && eyesHappy) {
    catSvg.classList.add('happy');
    eyesNormal.style.display = 'none';
    eyesHappy.style.display = 'block';

    setTimeout(() => {
      catSvg.classList.remove('happy');
      eyesNormal.style.display = 'block';
      eyesHappy.style.display = 'none';
    }, 1200);
  }
}

function openFoodStall(e) {
  if (e) e.stopPropagation();
  renderFoodStallShelves();
  const greeting = VENDOR_GREETINGS[Math.floor(Math.random() * VENDOR_GREETINGS.length)];
  setVendorSpeech(greeting);
  document.getElementById('stall-modal').classList.add('open');
}

function closeFoodStall(e) {
  if (e) e.stopPropagation();
  setVendorSpeech("Até a próxima visita! Miau! 👋");
  setTimeout(() => {
    document.getElementById('stall-modal').classList.remove('open');
  }, 250);
}

function renderFoodStallShelves() {
  const grid = document.getElementById('stall-shelf-grid');
  if (!grid) return;
  grid.innerHTML = '';

  FOOD_ITEMS.forEach(food => {
    const card = document.createElement('div');
    card.className = 'shelf-item-card';
    card.innerHTML = `
      <div class="shelf-item-icon">${food.icon}</div>
      <div class="shelf-item-name">${food.name}</div>
      <div class="shelf-item-price">${food.price} 🐾</div>
      <button class="shelf-buy-btn" onclick="buyFoodItem('${food.id}')">Comprar</button>
    `;
    grid.appendChild(card);
  });
}

function buyFoodItem(foodId) {
  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  if (userPawCoins >= food.price) {
    userPawCoins -= food.price;
    userInventory[foodId] = (userInventory[foodId] || 0) + 1;
    saveStats();
    playPaperSound();
    renderInventorySlots();
    updateWalletUI();
    createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 6);

    triggerVendorHappyAnimation();
    const thanks = VENDOR_THANKS[Math.floor(Math.random() * VENDOR_THANKS.length)];
    setVendorSpeech(thanks);
  } else {
    setVendorSpeech("Miau... faltam patinhas! Jogue no 'Brincar' lá fora! 🐾");
  }
}
