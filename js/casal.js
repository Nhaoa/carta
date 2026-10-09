/* =========================================================
   SISTEMA DE CASAL: PERFIL, VÍNCULO, STREAK, NFC, QR CODE
   E SINCRONIZAÇÃO DE STATUS
========================================================= */

// Validação rigorosa para impedir lixo de memória
let partnerData = null;
try {
  const rawPartner = localStorage.getItem('cat_partner_data');
  if (rawPartner && rawPartner !== 'null' && rawPartner !== 'undefined') {
    const parsed = JSON.parse(rawPartner);
    if (parsed && typeof parsed === 'object' && parsed.breed && parsed.eyeColor) {
      partnerData = parsed;
    } else {
      partnerData = null;
    }
  }
} catch (e) {
  partnerData = null;
}

let coupleStreak = JSON.parse(localStorage.getItem('cat_couple_streak') || JSON.stringify({
  current: 0,
  max: 0,
  totalDays: 0,
  lastCheckinDate: null,
  ribbonCoins: 0,
  winsPlayer: 0,
  winsPartner: 0,
  draws: 0
}));

// Exporta o DNA do gatinho incluindo os status atuais
function exportMyCatDNA() {
  const dnaObj = {
    name: localStorage.getItem('cat_name') || 'Mimi',
    peerId: (typeof myPeerId !== 'undefined' ? myPeerId : null) || localStorage.getItem('cat_my_peer_id'),
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    stats: {
      hunger: catStats.hunger,
      energy: catStats.energy,
      happiness: catStats.happiness,
      health: catStats.health
    },
    timestamp: Date.now()
  };
  return btoa(encodeURIComponent(JSON.stringify(dnaObj)));
}

// Importa e salva o parceiro via código
function importPartnerDNA(dnaString) {
  try {
    const raw = decodeURIComponent(atob(dnaString.trim()));
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.breed || !parsed.eyeColor) throw new Error('DNA inválido');
    partnerData = parsed;
    localStorage.setItem('cat_partner_data', JSON.stringify(partnerData));
    registerCoupleCheckin();
    renderCoupleTabUI();
    renderPartnerCatStage();

    if (partnerData.peerId && typeof connectToPartnerPeer === 'function') {
      connectToPartnerPeer(partnerData.peerId);
    }

    alert('🐾 Vínculo estabelecido com sucesso! O gatinho do seu amor agora está com você.');
    return true;
  } catch (err) {
    alert('Código de parceiro inválido ou corrompido.');
    return false;
  }
}

// Registro diário de conexão e cálculo de Streak
function registerCoupleCheckin() {
  const today = new Date().toDateString();
  if (coupleStreak.lastCheckinDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (coupleStreak.lastCheckinDate === yesterday) {
    coupleStreak.current += 1;
  } else if (coupleStreak.lastCheckinDate !== today) {
    coupleStreak.current = 1;
  }

  if (coupleStreak.current > coupleStreak.max) {
    coupleStreak.max = coupleStreak.current;
  }

  coupleStreak.totalDays += 1;
  coupleStreak.lastCheckinDate = today;
  coupleStreak.ribbonCoins += 1;

  if (coupleStreak.current % 7 === 0) {
    coupleStreak.ribbonCoins += 5;
    alert(`🎉 Incrível! ${coupleStreak.current} dias de streak juntos! Bônus de +5 Laços 🎀!`);
  }

  localStorage.setItem('cat_couple_streak', JSON.stringify(coupleStreak));
}

// Iniciar leitura NFC com diagnóstico claro de erro
async function startNFCSharing() {
  if (!('NDEFReader' in window)) {
    alert('NFC não suportado neste navegador. Utilize o QR Code ou o link direto!');
    return;
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert('Aviso: O navegador bloqueia o NFC sem HTTPS seguro. Utilize o site hospedado em HTTPS ou utilize o QR Code!');
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    alert('📡 Sensor ativado! Aproxime uma tag NFC ou o celular do seu amor...');

    ndef.onreading = (event) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        const text = decoder.decode(record.data);
        if (text.includes('CAT_DNA:')) {
          const incomingDNA = text.split('CAT_DNA:')[1];
          importPartnerDNA(incomingDNA);
          break;
        }
      }
    };
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      alert('Permissão de NFC negada nas configurações do site no navegador.');
    } else {
      alert(`Não foi possível ativar o sensor: ${err.message || err.name}`);
    }
  }
}

// Compartilhar link direto por WhatsApp
function sharePartnerLink() {
  const dna = exportMyCatDNA();
  const url = `${window.location.origin}${window.location.pathname}?parceiro=${dna}`;
  const msg = encodeURIComponent(`Amor, aqui está o vínculo do meu gatinho para você abrir no jogo! 🐾💖\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

// Exibir QR Code na tela para o parceiro escanear
function showPartnerQRCode() {
  const dna = exportMyCatDNA();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(dna)}`;
  
  const container = document.getElementById('couple-status-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 10px;">
      <p style="font-weight: bold; margin-bottom: 8px; color: #542c13;">Aponte a câmera dela para o QR Code:</p>
      <img src="${qrUrl}" alt="QR Code do Gatinho" style="border: 2.5px solid var(--charcoal); border-radius: 12px; margin-bottom: 10px; background: white; padding: 6px;" />
      <button class="action-btn" style="width: 100%; justify-content: center;" onclick="renderCoupleTabUI()">⬅ Voltar</button>
    </div>
  `;
}

// Enviar carinho para a parceira via PeerJS ou WhatsApp
function sendRemotePet() {
  const sent = (typeof sendMultiplayerPacket === 'function') && sendMultiplayerPacket({ type: 'CARINHO' });

  if (sent) {
    playPaperSound();
    createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert('🐾 Carinho enviado ao vivo para a tela dela!');
  } else {
    if (confirm('O gatinho dela não parece estar com o jogo aberto agora. Deseja mandar o carinho pelo WhatsApp?')) {
      const url = `${window.location.origin}${window.location.pathname}?carinho=1`;
      const msg = encodeURIComponent(`Psst... Te mandei um carinho no jogo! Abre aqui para receber: 🐾💖\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    }
  }
}

// Executar animação e efeito visual ao receber carinho remoto
function triggerReceivedRemotePet() {
  playMeowSound();
  createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 16);

  const regEyes = document.getElementById('regular-eyes');
  const hapEyes = document.getElementById('happy-eyes');
  const wrapper = document.getElementById('cat-wrapper');
  const bubble = document.getElementById('speech-bubble');

  if (regEyes) regEyes.style.display = 'none';
  if (hapEyes) hapEyes.style.display = 'block';
  if (wrapper) wrapper.classList.add('petting');

  if (bubble) {
    bubble.innerText = "Seu amor acabou de te mandar um carinho com muito amor! 🐾💖";
    bubble.style.display = 'block';
    bubble.classList.remove('fade-out');
  }

  catStats.happiness = Math.min(100, catStats.happiness + 15);
  catStats.health = Math.min(100, catStats.health + 5);
  saveStats();

  setTimeout(() => {
    if (regEyes) regEyes.style.display = 'block';
    if (hapEyes) hapEyes.style.display = 'none';
    if (wrapper) wrapper.classList.remove('petting');
    if (bubble) {
      setTimeout(() => {
        bubble.classList.add('fade-out');
        setTimeout(() => { bubble.style.display = 'none'; }, 400);
      }, 5000);
    }
  }, 2500);
}

// Aplica reações visuais de acordo com os status reais do parceiro
function applyPartnerReactions(clone, stats) {
  if (!stats) return;

  const mouthSad = clone.querySelector('#mouth-sad');
  const mouthHungry = clone.querySelector('#mouth-hungry');
  const sleepyEyelids = clone.querySelector('#sleepy-eyelids');
  const sickMark = clone.querySelector('#sick-mark');
  const happyBlush = clone.querySelector('#happy-blush');

  if (mouthSad) mouthSad.style.display = 'none';
  if (mouthHungry) mouthHungry.style.display = 'none';
  if (sleepyEyelids) sleepyEyelids.style.display = 'none';
  if (sickMark) sickMark.style.display = 'none';
  if (happyBlush) happyBlush.style.display = 'none';

  if (stats.health < 35) {
    clone.classList.add('sick');
    if (sickMark) sickMark.style.display = 'block';
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (stats.energy < 35) {
    clone.classList.add('sleepy');
    if (sleepyEyelids) sleepyEyelids.style.display = 'block';
    return;
  }
  if (stats.hunger < 30) {
    if (mouthHungry) mouthHungry.style.display = 'block';
    return;
  }
  if (stats.happiness < 35) {
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (stats.hunger >= 70 && stats.energy >= 70 && stats.happiness >= 70 && stats.health >= 70) {
    if (happyBlush) happyBlush.style.display = 'block';
  }
}

// Desenha o SVG dentro de um container específico de forma limpa
function renderMiniCatInside(containerId, catAttrs) {
  const container = document.getElementById(containerId);
  if (!container || !catAttrs) return;
  const mainSvg = document.getElementById('main-cat-svg');
  if (!mainSvg) return;

  container.innerHTML = '';

  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');

  const eyeL = clone.querySelector('#eye-bg-left');
  const eyeR = clone.querySelector('#eye-bg-right');
  if (eyeL) eyeL.setAttribute('fill', catAttrs.eyeColor || '#2b2725');
  if (eyeR) eyeR.setAttribute('fill', catAttrs.eyeColor || '#2b2725');

  const body = clone.querySelector('#cat-body');
  const head = clone.querySelector('#cat-head-normal');
  const tail = clone.querySelector('#cat-tail');
  const tailStripes = clone.querySelector('#tail-stripes');

  if (body) body.setAttribute('fill', '#fffdf9');
  if (head) head.setAttribute('fill', '#fffdf9');
  if (tail) {
    tail.setAttribute('fill', '#fffdf9');
    tail.setAttribute('stroke', '#2b2725');
  }
  if (tailStripes) tailStripes.style.display = 'none';

  ['breed-siamese', 'breed-tuxedo', 'breed-orange', 'body-tuxedo', 'body-orange'].forEach(id => {
    const el = clone.querySelector('#' + id);
    if (el) el.style.display = 'none';
  });

  if (catAttrs.breed === 'breed_siamese') {
    if (body) body.setAttribute('fill', '#ebdcc9');
    if (head) head.setAttribute('fill', '#ebdcc9');
    if (tail) tail.setAttribute('fill', '#3d281d');
    const s = clone.querySelector('#breed-siamese');
    if (s) s.style.display = 'block';
  } else if (catAttrs.breed === 'breed_tuxedo') {
    if (tail) tail.setAttribute('fill', '#2b2725');
    const tHead = clone.querySelector('#breed-tuxedo');
    const tBody = clone.querySelector('#body-tuxedo');
    if (tHead) tHead.style.display = 'block';
    if (tBody) tBody.style.display = 'block';
  } else if (catAttrs.breed === 'breed_orange') {
    if (body) body.setAttribute('fill', '#e58e45');
    if (head) head.setAttribute('fill', '#e58e45');
    if (tail) {
      tail.setAttribute('fill', '#e58e45');
      tail.setAttribute('stroke', '#b3581d');
    }
    if (tailStripes) tailStripes.style.display = 'block';
    const oHead = clone.querySelector('#breed-orange');
    const oBody = clone.querySelector('#body-orange');
    if (oHead) oHead.style.display = 'block';
    if (oBody) oBody.style.display = 'block';
  }

  const colors = catAttrs.itemColors || {};
  ['bowtie', 'glasses', 'flower', 'crown'].forEach(acc => {
    const el = clone.querySelector('#cosmetic-' + acc);
    const isEquipped = catAttrs.equipped && catAttrs.equipped.includes(acc);
    if (el) el.style.display = isEquipped ? 'block' : 'none';
  });

  const bL = clone.querySelector('#bowtie-left');
  const bR = clone.querySelector('#bowtie-right');
  if (bL && bR && colors['bowtie']) {
    bL.setAttribute('fill', colors['bowtie']);
    bR.setAttribute('fill', colors['bowtie']);
  }

  const gL = clone.querySelector('#glasses-left');
  const gR = clone.querySelector('#glasses-right');
  const gB = clone.querySelector('#glasses-bridge');
  if (gL && gR && colors['glasses']) {
    gL.setAttribute('stroke', colors['glasses']);
    gR.setAttribute('stroke', colors['glasses']);
    if (gB) gB.setAttribute('stroke', colors['glasses']);
  }

  const fC = clone.querySelector('#flower-center');
  if (fC && colors['flower']) fC.setAttribute('fill', colors['flower']);

  const cB = clone.querySelector('#crown-body');
  if (cB && colors['crown']) cB.setAttribute('fill', colors['crown']);

  if (catAttrs.stats) {
    applyPartnerReactions(clone, catAttrs.stats);
  }

  container.appendChild(clone);
}

// CONTROLADOR DO PALCO: Apenas liga/desliga o slot já existente no HTML
function renderPartnerCatStage() {
  const wrapper = document.getElementById('partner-cat-wrapper');
  const slot = document.getElementById('partner-svg-slot');
  const label = document.getElementById('partner-label-tag');

  if (!wrapper || !slot) return;

  // Se não houver parceiro ou faltar dados vitais, desliga o slot
  if (!partnerData || !partnerData.breed) {
    wrapper.style.display = 'none';
    slot.innerHTML = '';
    return;
  }

  // Se houver parceiro válido, exibe o slot e preenche o SVG
  wrapper.style.display = 'flex';
  if (label) label.innerText = partnerData.name || 'Parceira';
  renderMiniCatInside('partner-svg-slot', partnerData);
}

// Alimentar o gatinho do parceiro remotamente
function feedPartnerCat(foodId) {
  if (!userInventory[foodId] || userInventory[foodId] <= 0) return;

  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  userInventory[foodId]--;
  if (userInventory[foodId] <= 0) delete userInventory[foodId];

  saveStats();
  renderInventorySlots();
  playPaperSound();

  const sent = (typeof sendMultiplayerPacket === 'function') && sendMultiplayerPacket({
    type: 'ALIMENTAR_PARCEIRO',
    foodId: foodId
  });

  if (sent) {
    createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert(`Você alimentou o gatinho do seu amor com ${food.name}! 🍲💖`);
  } else {
    alert(`Você deu ${food.name} para o gatinho da parceira! (Ele comerá assim que ela conectar) 🐾`);
  }
}

// Desvincular os gatinhos
function unlinkCouple() {
  if (confirm("Tem certeza que deseja desvincular os gatinhos? O histórico e o gatinho do parceiro serão removidos deste dispositivo.")) {
    partnerData = null;
    localStorage.removeItem('cat_partner_data');
    renderPartnerCatStage();
    renderCoupleTabUI();
    alert("Vínculo removido com sucesso.");
  }
}

// Leitura de parâmetros na URL (?parceiro=... ou ?carinho=1)
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const dnaParam = params.get('parceiro');
  const carinhoParam = params.get('carinho');

  if (dnaParam) {
    setTimeout(() => {
      importPartnerDNA(dnaParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 600);
  }

  if (carinhoParam) {
    setTimeout(() => {
      triggerReceivedRemotePet();
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 800);
  }

  // Atualização garantida na inicialização
  renderPartnerCatStage();
});

// Renderização da interface do modal do casal
function renderCoupleTabUI() {
  const statusContainer = document.getElementById('couple-status-container');
  if (!statusContainer) return;

  if (!partnerData || !partnerData.breed) {
    statusContainer.innerHTML = `
      <div style="text-align: center; padding: 14px 6px;">
        <p style="font-size: 1.05rem; margin-bottom: 12px; color: var(--pencil);">Vocês ainda não vincularam os gatinhos!</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="action-btn" style="justify-content: center; background: #eef7e8;" onclick="sharePartnerLink()">💬 Enviar Link para Ela (WhatsApp)</button>
          <button class="action-btn" style="justify-content: center;" onclick="showPartnerQRCode()">📷 Mostrar QR Code para Ela</button>
          <button class="action-btn" style="justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código DNA</button>
          <button class="action-btn" style="justify-content: center;" onclick="promptPartnerCode()">📥 Inserir Código Dela</button>
          <button class="action-btn" style="justify-content: center; font-size: 0.82rem;" onclick="startNFCSharing()">📲 Tentar Toque NFC</button>
        </div>
      </div>
    `;
    return;
  }

  const pStats = partnerData.stats || { hunger: 80, energy: 80, happiness: 80, health: 80 };

  statusContainer.innerHTML = `
    <div class="couple-card-stitch">
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold; margin-bottom: 6px;">
        <span style="color: #6e4425;">Status de ${partnerData.name || 'Parceira'}</span>
        <span id="couple-online-indicator">⚪ Desconectado</span>
      </div>

      <div class="couple-cats-row">
        <div class="couple-cat-box" id="couple-my-cat-preview"></div>
        <div class="couple-heart-divider">💖</div>
        <div class="couple-cat-box" id="couple-partner-cat-preview"></div>
      </div>

      <!-- Barras de Status do Parceiro -->
      <div class="partner-mini-bars">
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.hunger}%; background-color: ${pStats.hunger <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Fome</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.energy}%; background-color: ${pStats.energy <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Energia</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.happiness}%; background-color: ${pStats.happiness <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Alegria</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.health}%; background-color: ${pStats.health <= 30 ? '#c0392b' : '#27ae60'};"></div>
          </div>
          <span>Saúde</span>
        </div>
      </div>

      <div class="couple-stats-grid">
        <div class="couple-stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">${coupleStreak.current} dias</span>
          <span class="stat-label">Streak Atual</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🏆</span>
          <span class="stat-value">${coupleStreak.max} dias</span>
          <span class="stat-label">Maior Streak</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🎀</span>
          <span class="stat-value">${coupleStreak.ribbonCoins}</span>
          <span class="stat-label">Laços de Afeto</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">📅</span>
          <span class="stat-value">${coupleStreak.totalDays}</span>
          <span class="stat-label">Dias Conectados</span>
        </div>
      </div>

      <div class="couple-match-score">
        <div style="font-weight: bold; margin-bottom: 4px; color: #4a2912;">Placar de Jogos</div>
        <div style="display: flex; justify-content: space-around; font-size: 0.95rem;">
          <span>Você: <b>${coupleStreak.winsPlayer}</b></span>
          <span>Empates: <b>${coupleStreak.draws}</b></span>
          <span>Parceira: <b>${coupleStreak.winsPartner}</b></span>
        </div>
      </div>

      <button class="action-btn" style="width: 100%; justify-content: center; margin-top: 8px; background: #faeedb; color: #542c13;" onclick="sendRemotePet()">
        💌 Mandar Carinho / Ronrom Remoto
      </button>

      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código</button>
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="promptPartnerCode()">🔄 Atualizar Código Dela</button>
      </div>

      <button class="unlink-btn" onclick="unlinkCouple()">💔 Desvincular Gatinhos</button>
    </div>
  `;

  renderMiniCatInside('couple-my-cat-preview', {
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    stats: catStats
  });
  renderMiniCatInside('couple-partner-cat-preview', partnerData);

  if (typeof activeConnection !== 'undefined' && activeConnection && activeConnection.open) {
    updateOnlineBadge(true);
  }
}

function copyMyDNACode() {
  const dna = exportMyCatDNA();
  navigator.clipboard.writeText(dna).then(() => {
    alert('Código DNA copiado para a área de transferência! Envie para o seu amor.');
  }).catch(() => {
    prompt('Copie o seu código abaixo:', dna);
  });
}

function promptPartnerCode() {
  const code = prompt('Cole aqui o código do gatinho da sua parceira:');
  if (code) importPartnerDNA(code);
}

function openCoupleModal(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const modal = document.getElementById('couple-modal');
  if (!modal) return;
  
  modal.classList.add('open');
  // Renderiza a interface após garantir que o modal está visível no DOM
  renderCoupleTabUI();
}

function closeCoupleModal(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const modal = document.getElementById('couple-modal');
  if (modal) modal.classList.remove('open');
}
/* =========================================================
   SISTEMA DE CASAL: PERFIL, VÍNCULO, STREAK, NFC, QR CODE
   E SINCRONIZAÇÃO DE STATUS
========================================================= */

// Leitura limpa do LocalStorage garantindo null real se não houver dados válidos
let partnerData = null;
try {
  const rawPartner = localStorage.getItem('cat_partner_data');
  if (rawPartner && rawPartner !== 'null' && rawPartner !== 'undefined') {
    const parsed = JSON.parse(rawPartner);
    if (parsed && typeof parsed === 'object' && parsed.breed) {
      partnerData = parsed;
    }
  }
} catch (e) {
  partnerData = null;
}

let coupleStreak = JSON.parse(localStorage.getItem('cat_couple_streak') || JSON.stringify({
  current: 0,
  max: 0,
  totalDays: 0,
  lastCheckinDate: null,
  ribbonCoins: 0,
  winsPlayer: 0,
  winsPartner: 0,
  draws: 0
}));

// Exporta o DNA do gatinho incluindo os status atuais
function exportMyCatDNA() {
  const dnaObj = {
    name: localStorage.getItem('cat_name') || 'Mimi',
    peerId: (typeof myPeerId !== 'undefined' ? myPeerId : null) || localStorage.getItem('cat_my_peer_id'),
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    stats: {
      hunger: catStats.hunger,
      energy: catStats.energy,
      happiness: catStats.happiness,
      health: catStats.health
    },
    timestamp: Date.now()
  };
  return btoa(encodeURIComponent(JSON.stringify(dnaObj)));
}

// Importa e salva o parceiro via código
function importPartnerDNA(dnaString) {
  try {
    const raw = decodeURIComponent(atob(dnaString.trim()));
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.breed || !parsed.eyeColor) throw new Error('DNA inválido');
    partnerData = parsed;
    localStorage.setItem('cat_partner_data', JSON.stringify(partnerData));
    registerCoupleCheckin();
    renderCoupleTabUI();
    renderPartnerCatStage();

    if (partnerData.peerId && typeof connectToPartnerPeer === 'function') {
      connectToPartnerPeer(partnerData.peerId);
    }

    alert('🐾 Vínculo estabelecido com sucesso! O gatinho do seu amor agora está com você.');
    return true;
  } catch (err) {
    alert('Código de parceiro inválido ou corrompido.');
    return false;
  }
}

// Registro diário de conexão e cálculo de Streak
function registerCoupleCheckin() {
  const today = new Date().toDateString();
  if (coupleStreak.lastCheckinDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (coupleStreak.lastCheckinDate === yesterday) {
    coupleStreak.current += 1;
  } else if (coupleStreak.lastCheckinDate !== today) {
    coupleStreak.current = 1;
  }

  if (coupleStreak.current > coupleStreak.max) {
    coupleStreak.max = coupleStreak.current;
  }

  coupleStreak.totalDays += 1;
  coupleStreak.lastCheckinDate = today;
  coupleStreak.ribbonCoins += 1;

  if (coupleStreak.current % 7 === 0) {
    coupleStreak.ribbonCoins += 5;
    alert(`🎉 Incrível! ${coupleStreak.current} dias de streak juntos! Bônus de +5 Laços 🎀!`);
  }

  localStorage.setItem('cat_couple_streak', JSON.stringify(coupleStreak));
}

// Iniciar leitura NFC com diagnóstico claro de erro
async function startNFCSharing() {
  if (!('NDEFReader' in window)) {
    alert('NFC não suportado neste navegador. Utilize o QR Code ou o link direto!');
    return;
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert('Aviso: O navegador bloqueia o NFC sem HTTPS seguro. Utilize o site hospedado em HTTPS ou utilize o QR Code!');
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    alert('📡 Sensor ativado! Aproxime uma tag NFC ou o celular do seu amor...');

    ndef.onreading = (event) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        const text = decoder.decode(record.data);
        if (text.includes('CAT_DNA:')) {
          const incomingDNA = text.split('CAT_DNA:')[1];
          importPartnerDNA(incomingDNA);
          break;
        }
      }
    };
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      alert('Permissão de NFC negada nas configurações do site no navegador.');
    } else {
      alert(`Não foi possível ativar o sensor: ${err.message || err.name}`);
    }
  }
}

// Compartilhar link direto por WhatsApp
function sharePartnerLink() {
  const dna = exportMyCatDNA();
  const url = `${window.location.origin}${window.location.pathname}?parceiro=${dna}`;
  const msg = encodeURIComponent(`Amor, aqui está o vínculo do meu gatinho para você abrir no jogo! 🐾💖\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

// Exibir QR Code na tela para o parceiro escanear
function showPartnerQRCode() {
  const dna = exportMyCatDNA();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(dna)}`;
  
  const container = document.getElementById('couple-status-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 10px;">
      <p style="font-weight: bold; margin-bottom: 8px; color: #542c13;">Aponte a câmera dela para o QR Code:</p>
      <img src="${qrUrl}" alt="QR Code do Gatinho" style="border: 2.5px solid var(--charcoal); border-radius: 12px; margin-bottom: 10px; background: white; padding: 6px;" />
      <button class="action-btn" style="width: 100%; justify-content: center;" onclick="renderCoupleTabUI()">⬅ Voltar</button>
    </div>
  `;
}

// Enviar carinho para a parceira via PeerJS ou WhatsApp
function sendRemotePet() {
  const sent = (typeof sendMultiplayerPacket === 'function') && sendMultiplayerPacket({ type: 'CARINHO' });

  if (sent) {
    playPaperSound();
    createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert('🐾 Carinho enviado ao vivo para a tela dela!');
  } else {
    if (confirm('O gatinho dela não parece estar com o jogo aberto agora. Deseja mandar o carinho pelo WhatsApp?')) {
      const url = `${window.location.origin}${window.location.pathname}?carinho=1`;
      const msg = encodeURIComponent(`Psst... Te mandei um carinho no jogo! Abre aqui para receber: 🐾💖\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    }
  }
}

// Executar animação e efeito visual ao receber carinho remoto
function triggerReceivedRemotePet() {
  playMeowSound();
  createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 16);

  const regEyes = document.getElementById('regular-eyes');
  const hapEyes = document.getElementById('happy-eyes');
  const wrapper = document.getElementById('cat-wrapper');
  const bubble = document.getElementById('speech-bubble');

  if (regEyes) regEyes.style.display = 'none';
  if (hapEyes) hapEyes.style.display = 'block';
  if (wrapper) wrapper.classList.add('petting');

  if (bubble) {
    bubble.innerText = "Seu amor acabou de te mandar um carinho com muito amor! 🐾💖";
    bubble.style.display = 'block';
    bubble.classList.remove('fade-out');
  }

  catStats.happiness = Math.min(100, catStats.happiness + 15);
  catStats.health = Math.min(100, catStats.health + 5);
  saveStats();

  setTimeout(() => {
    if (regEyes) regEyes.style.display = 'block';
    if (hapEyes) hapEyes.style.display = 'none';
    if (wrapper) wrapper.classList.remove('petting');
    if (bubble) {
      setTimeout(() => {
        bubble.classList.add('fade-out');
        setTimeout(() => { bubble.style.display = 'none'; }, 400);
      }, 5000);
    }
  }, 2500);
}

// Aplica reações visuais de acordo com os status reais do parceiro
function applyPartnerReactions(clone, stats) {
  if (!stats) return;

  const mouthSad = clone.querySelector('#mouth-sad');
  const mouthHungry = clone.querySelector('#mouth-hungry');
  const sleepyEyelids = clone.querySelector('#sleepy-eyelids');
  const sickMark = clone.querySelector('#sick-mark');
  const happyBlush = clone.querySelector('#happy-blush');

  if (mouthSad) mouthSad.style.display = 'none';
  if (mouthHungry) mouthHungry.style.display = 'none';
  if (sleepyEyelids) sleepyEyelids.style.display = 'none';
  if (sickMark) sickMark.style.display = 'none';
  if (happyBlush) happyBlush.style.display = 'none';

  if (stats.health < 35) {
    clone.classList.add('sick');
    if (sickMark) sickMark.style.display = 'block';
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (stats.energy < 35) {
    clone.classList.add('sleepy');
    if (sleepyEyelids) sleepyEyelids.style.display = 'block';
    return;
  }
  if (stats.hunger < 30) {
    if (mouthHungry) mouthHungry.style.display = 'block';
    return;
  }
  if (stats.happiness < 35) {
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (stats.hunger >= 70 && stats.energy >= 70 && stats.happiness >= 70 && stats.health >= 70) {
    if (happyBlush) happyBlush.style.display = 'block';
  }
}

// Desenha a miniatura SVG limpando o container e evitando auto-aninhamento
// Renderiza o SVG dentro do container garantindo limpeza total prévia
function renderMiniCatInside(containerId, catAttrs) {
  const container = document.getElementById(containerId);
  if (!container || !catAttrs) return;
  const mainSvg = document.getElementById('main-cat-svg');
  if (!mainSvg) return;

  // Limpa completamente antes de injetar
  container.innerHTML = '';

  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');

  const eyeL = clone.querySelector('#eye-bg-left');
  const eyeR = clone.querySelector('#eye-bg-right');
  if (eyeL) eyeL.setAttribute('fill', catAttrs.eyeColor || '#2b2725');
  if (eyeR) eyeR.setAttribute('fill', catAttrs.eyeColor || '#2b2725');

  const body = clone.querySelector('#cat-body');
  const head = clone.querySelector('#cat-head-normal');
  const tail = clone.querySelector('#cat-tail');
  const tailStripes = clone.querySelector('#tail-stripes');

  if (body) body.setAttribute('fill', '#fffdf9');
  if (head) head.setAttribute('fill', '#fffdf9');
  if (tail) {
    tail.setAttribute('fill', '#fffdf9');
    tail.setAttribute('stroke', '#2b2725');
  }
  if (tailStripes) tailStripes.style.display = 'none';

  ['breed-siamese', 'breed-tuxedo', 'breed-orange', 'body-tuxedo', 'body-orange'].forEach(id => {
    const el = clone.querySelector('#' + id);
    if (el) el.style.display = 'none';
  });

  if (catAttrs.breed === 'breed_siamese') {
    if (body) body.setAttribute('fill', '#ebdcc9');
    if (head) head.setAttribute('fill', '#ebdcc9');
    if (tail) tail.setAttribute('fill', '#3d281d');
    const s = clone.querySelector('#breed-siamese');
    if (s) s.style.display = 'block';
  } else if (catAttrs.breed === 'breed_tuxedo') {
    if (tail) tail.setAttribute('fill', '#2b2725');
    const tHead = clone.querySelector('#breed-tuxedo');
    const tBody = clone.querySelector('#body-tuxedo');
    if (tHead) tHead.style.display = 'block';
    if (tBody) tBody.style.display = 'block';
  } else if (catAttrs.breed === 'breed_orange') {
    if (body) body.setAttribute('fill', '#e58e45');
    if (head) head.setAttribute('fill', '#e58e45');
    if (tail) {
      tail.setAttribute('fill', '#e58e45');
      tail.setAttribute('stroke', '#b3581d');
    }
    if (tailStripes) tailStripes.style.display = 'block';
    const oHead = clone.querySelector('#breed-orange');
    const oBody = clone.querySelector('#body-orange');
    if (oHead) oHead.style.display = 'block';
    if (oBody) oBody.style.display = 'block';
  }

  const colors = catAttrs.itemColors || {};
  ['bowtie', 'glasses', 'flower', 'crown'].forEach(acc => {
    const el = clone.querySelector('#cosmetic-' + acc);
    const isEquipped = catAttrs.equipped && catAttrs.equipped.includes(acc);
    if (el) el.style.display = isEquipped ? 'block' : 'none';
  });

  const bL = clone.querySelector('#bowtie-left');
  const bR = clone.querySelector('#bowtie-right');
  if (bL && bR && colors['bowtie']) {
    bL.setAttribute('fill', colors['bowtie']);
    bR.setAttribute('fill', colors['bowtie']);
  }

  const gL = clone.querySelector('#glasses-left');
  const gR = clone.querySelector('#glasses-right');
  const gB = clone.querySelector('#glasses-bridge');
  if (gL && gR && colors['glasses']) {
    gL.setAttribute('stroke', colors['glasses']);
    gR.setAttribute('stroke', colors['glasses']);
    if (gB) gB.setAttribute('stroke', colors['glasses']);
  }

  const fC = clone.querySelector('#flower-center');
  if (fC && colors['flower']) fC.setAttribute('fill', colors['flower']);

  const cB = clone.querySelector('#crown-body');
  if (cB && colors['crown']) cB.setAttribute('fill', colors['crown']);

  if (catAttrs.stats) {
    applyPartnerReactions(clone, catAttrs.stats);
  }

  container.appendChild(clone);
}

// Controla o gatinho do parceiro usando estritamente o slot fixo
function renderPartnerCatStage() {
  const wrapper = document.getElementById('partner-cat-wrapper');
  const slot = document.getElementById('partner-svg-slot');
  const label = document.getElementById('partner-label-tag');

  if (!wrapper || !slot) return;

  // Se não houver parceiro conectado, oculta e esvazia
  if (!partnerData || !partnerData.breed) {
    wrapper.style.display = 'none';
    slot.innerHTML = '';
    return;
  }

  // Se houver parceiro, exibe e renderiza apenas dentro do slot SVG
  wrapper.style.display = 'flex';
  if (label) label.innerText = partnerData.name || 'Parceira';
  renderMiniCatInside('partner-svg-slot', partnerData);
}



  const duoContainer = document.getElementById('cats-duo-stage');
  if (!duoContainer) return;

  let partnerWrapper = existingPartner;

  if (!partnerWrapper) {
    partnerWrapper = document.createElement('div');
    partnerWrapper.id = 'partner-cat-wrapper';
    partnerWrapper.className = 'cat-wrapper partner-cat';
    partnerWrapper.onclick = (e) => {
      e.stopPropagation();
      openCoupleModal(e);
    };

    partnerWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      partnerWrapper.classList.add('drag-over');
    });
    partnerWrapper.addEventListener('dragleave', () => {
      partnerWrapper.classList.remove('drag-over');
    });
    partnerWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      partnerWrapper.classList.remove('drag-over');
      const foodId = e.dataTransfer.getData('text/plain');
      feedPartnerCat(foodId);
    });

    duoContainer.appendChild(partnerWrapper);
  }

  renderMiniCatInside('partner-cat-wrapper', partnerData);

  // Adiciona a etiqueta com o nome sem duplicar
  const label = document.createElement('span');
  label.className = 'cat-label-tag';
  label.innerText = partnerData.name || 'Parceira';
  partnerWrapper.appendChild(label);
}

// Alimentar o gatinho do parceiro remotamente
function feedPartnerCat(foodId) {
  if (!userInventory[foodId] || userInventory[foodId] <= 0) return;

  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  userInventory[foodId]--;
  if (userInventory[foodId] <= 0) delete userInventory[foodId];

  saveStats();
  renderInventorySlots();
  playPaperSound();

  const sent = (typeof sendMultiplayerPacket === 'function') && sendMultiplayerPacket({
    type: 'ALIMENTAR_PARCEIRO',
    foodId: foodId
  });

  if (sent) {
    createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert(`Você alimentou o gatinho do seu amor com ${food.name}! 🍲💖`);
  } else {
    alert(`Você deu ${food.name} para o gatinho da parceira! (Ele comerá assim que ela conectar) 🐾`);
  }
}

// Desvincular os gatinhos
function unlinkCouple() {
  if (confirm("Tem certeza que deseja desvincular os gatinhos? O histórico e o gatinho do parceiro serão removidos deste dispositivo.")) {
    partnerData = null;
    localStorage.removeItem('cat_partner_data');
    renderPartnerCatStage();
    renderCoupleTabUI();
    alert("Vínculo removido com sucesso.");
  }
}

// Leitura de parâmetros na URL (?parceiro=... ou ?carinho=1)
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const dnaParam = params.get('parceiro');
  const carinhoParam = params.get('carinho');

  if (dnaParam) {
    setTimeout(() => {
      importPartnerDNA(dnaParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 600);
  }

  if (carinhoParam) {
    setTimeout(() => {
      triggerReceivedRemotePet();
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 800);
  }

  // Garante a verificação correta na inicialização
  renderPartnerCatStage();
});

// Renderização da interface do modal do casal
function renderCoupleTabUI() {
  const statusContainer = document.getElementById('couple-status-container');
  if (!statusContainer) return;

  if (!partnerData || !partnerData.breed) {
    statusContainer.innerHTML = `
      <div style="text-align: center; padding: 14px 6px;">
        <p style="font-size: 1.05rem; margin-bottom: 12px; color: var(--pencil);">Vocês ainda não vincularam os gatinhos!</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="action-btn" style="justify-content: center; background: #eef7e8;" onclick="sharePartnerLink()">💬 Enviar Link para Ela (WhatsApp)</button>
          <button class="action-btn" style="justify-content: center;" onclick="showPartnerQRCode()">📷 Mostrar QR Code para Ela</button>
          <button class="action-btn" style="justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código DNA</button>
          <button class="action-btn" style="justify-content: center;" onclick="promptPartnerCode()">📥 Inserir Código Dela</button>
          <button class="action-btn" style="justify-content: center; font-size: 0.82rem;" onclick="startNFCSharing()">📲 Tentar Toque NFC</button>
        </div>
      </div>
    `;
    return;
  }

  const pStats = partnerData.stats || { hunger: 80, energy: 80, happiness: 80, health: 80 };

  statusContainer.innerHTML = `
    <div class="couple-card-stitch">
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold; margin-bottom: 6px;">
        <span style="color: #6e4425;">Status de ${partnerData.name || 'Parceira'}</span>
        <span id="couple-online-indicator">⚪ Desconectado</span>
      </div>

      <div class="couple-cats-row">
        <div class="couple-cat-box" id="couple-my-cat-preview"></div>
        <div class="couple-heart-divider">💖</div>
        <div class="couple-cat-box" id="couple-partner-cat-preview"></div>
      </div>

      <!-- Barras de Status do Parceiro -->
      <div class="partner-mini-bars">
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.hunger}%; background-color: ${pStats.hunger <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Fome</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.energy}%; background-color: ${pStats.energy <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Energia</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.happiness}%; background-color: ${pStats.happiness <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Alegria</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.health}%; background-color: ${pStats.health <= 30 ? '#c0392b' : '#27ae60'};"></div>
          </div>
          <span>Saúde</span>
        </div>
      </div>

      <div class="couple-stats-grid">
        <div class="couple-stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">${coupleStreak.current} dias</span>
          <span class="stat-label">Streak Atual</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🏆</span>
          <span class="stat-value">${coupleStreak.max} dias</span>
          <span class="stat-label">Maior Streak</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🎀</span>
          <span class="stat-value">${coupleStreak.ribbonCoins}</span>
          <span class="stat-label">Laços de Afeto</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">📅</span>
          <span class="stat-value">${coupleStreak.totalDays}</span>
          <span class="stat-label">Dias Conectados</span>
        </div>
      </div>

      <div class="couple-match-score">
        <div style="font-weight: bold; margin-bottom: 4px; color: #4a2912;">Placar de Jogos</div>
        <div style="display: flex; justify-content: space-around; font-size: 0.95rem;">
          <span>Você: <b>${coupleStreak.winsPlayer}</b></span>
          <span>Empates: <b>${coupleStreak.draws}</b></span>
          <span>Parceira: <b>${coupleStreak.winsPartner}</b></span>
        </div>
      </div>

      <button class="action-btn" style="width: 100%; justify-content: center; margin-top: 8px; background: #faeedb; color: #542c13;" onclick="sendRemotePet()">
        💌 Mandar Carinho / Ronrom Remoto
      </button>

      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código</button>
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="promptPartnerCode()">🔄 Atualizar Código Dela</button>
      </div>

      <button class="unlink-btn" onclick="unlinkCouple()">💔 Desvincular Gatinhos</button>
    </div>
  `;

  renderMiniCatInside('couple-my-cat-preview', {
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    stats: catStats
  });
  renderMiniCatInside('couple-partner-cat-preview', partnerData);

  if (typeof activeConnection !== 'undefined' && activeConnection && activeConnection.open) {
    updateOnlineBadge(true);
  }
}

function copyMyDNACode() {
  const dna = exportMyCatDNA();
  navigator.clipboard.writeText(dna).then(() => {
    alert('Código DNA copiado para a área de transferência! Envie para o seu amor.');
  }).catch(() => {
    prompt('Copie o seu código abaixo:', dna);
  });
}

function promptPartnerCode() {
  const code = prompt('Cole aqui o código do gatinho da sua parceira:');
  if (code) importPartnerDNA(code);
}

function openCoupleModal(e) {
  if (e) e.stopPropagation();
  renderCoupleTabUI();
  document.getElementById('couple-modal').classList.add('open');
}

function closeCoupleModal(e) {
  if (e) e.stopPropagation();
  document.getElementById('couple-modal').classList.remove('open');
}/* =========================================================
   SISTEMA DE CASAL: PERFIL, VÍNCULO, STREAK, NFC, QR CODE
   E SINCRONIZAÇÃO DE STATUS
========================================================= */

let partnerData = JSON.parse(localStorage.getItem('cat_partner_data') || 'null');
let coupleStreak = JSON.parse(localStorage.getItem('cat_couple_streak') || JSON.stringify({
  current: 0,
  max: 0,
  totalDays: 0,
  lastCheckinDate: null,
  ribbonCoins: 0,
  winsPlayer: 0,
  winsPartner: 0,
  draws: 0
}));

// Exporta o DNA do gatinho incluindo os status atuais
function exportMyCatDNA() {
  const dnaObj = {
    name: localStorage.getItem('cat_name') || 'Mimi',
    peerId: myPeerId || localStorage.getItem('cat_my_peer_id'),
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    stats: {
      hunger: catStats.hunger,
      energy: catStats.energy,
      happiness: catStats.happiness,
      health: catStats.health
    },
    timestamp: Date.now()
  };
  return btoa(encodeURIComponent(JSON.stringify(dnaObj)));
}

// Importa e salva o parceiro via código
function importPartnerDNA(dnaString) {
  try {
    const raw = decodeURIComponent(atob(dnaString.trim()));
    const parsed = JSON.parse(raw);
    if (!parsed.breed || !parsed.eyeColor) throw new Error('DNA inválido');
    partnerData = parsed;
    localStorage.setItem('cat_partner_data', JSON.stringify(partnerData));
    registerCoupleCheckin();
    renderCoupleTabUI();
    renderPartnerCatStage();

    if (partnerData.peerId && typeof connectToPartnerPeer === 'function') {
      connectToPartnerPeer(partnerData.peerId);
    }

    alert('🐾 Vínculo estabelecido com sucesso! O gatinho do seu amor agora está com você.');
    return true;
  } catch (err) {
    alert('Código de parceiro inválido ou corrompido.');
    return false;
  }
}

// Registro diário de conexão e cálculo de Streak
function registerCoupleCheckin() {
  const today = new Date().toDateString();
  if (coupleStreak.lastCheckinDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (coupleStreak.lastCheckinDate === yesterday) {
    coupleStreak.current += 1;
  } else if (coupleStreak.lastCheckinDate !== today) {
    coupleStreak.current = 1;
  }

  if (coupleStreak.current > coupleStreak.max) {
    coupleStreak.max = coupleStreak.current;
  }

  coupleStreak.totalDays += 1;
  coupleStreak.lastCheckinDate = today;
  coupleStreak.ribbonCoins += 1; // 1 Laço de Afeto diário

  if (coupleStreak.current % 7 === 0) {
    coupleStreak.ribbonCoins += 5;
    alert(`🎉 Incrível! ${coupleStreak.current} dias de streak juntos! Bônus de +5 Laços 🎀!`);
  }

  localStorage.setItem('cat_couple_streak', JSON.stringify(coupleStreak));
}

// Iniciar leitura NFC com diagnóstico claro de erro
async function startNFCSharing() {
  if (!('NDEFReader' in window)) {
    alert('NFC não suportado neste navegador. Utilize o QR Code ou o link direto!');
    return;
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert('Aviso: O navegador bloqueia o NFC sem HTTPS seguro. Utilize o site hospedado em HTTPS ou utilize o QR Code!');
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    alert('📡 Sensor ativado! Aproxime uma tag NFC ou o celular do seu amor...');

    ndef.onreading = (event) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        const text = decoder.decode(record.data);
        if (text.includes('CAT_DNA:')) {
          const incomingDNA = text.split('CAT_DNA:')[1];
          importPartnerDNA(incomingDNA);
          break;
        }
      }
    };
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      alert('Permissão de NFC negada nas configurações do site no navegador.');
    } else {
      alert(`Não foi possível ativar o sensor: ${err.message || err.name}`);
    }
  }
}

// Compartilhar link direto por WhatsApp
function sharePartnerLink() {
  const dna = exportMyCatDNA();
  const url = `${window.location.origin}${window.location.pathname}?parceiro=${dna}`;
  const msg = encodeURIComponent(`Amor, aqui está o vínculo do meu gatinho para você abrir no jogo! 🐾💖\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

// Exibir QR Code na tela para o parceiro escanear
function showPartnerQRCode() {
  const dna = exportMyCatDNA();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(dna)}`;
  
  const container = document.getElementById('couple-status-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 10px;">
      <p style="font-weight: bold; margin-bottom: 8px; color: #542c13;">Aponte a câmera dela para o QR Code:</p>
      <img src="${qrUrl}" alt="QR Code do Gatinho" style="border: 2.5px solid var(--charcoal); border-radius: 12px; margin-bottom: 10px; background: white; padding: 6px;" />
      <button class="action-btn" style="width: 100%; justify-content: center;" onclick="renderCoupleTabUI()">⬅ Voltar</button>
    </div>
  `;
}

// Enviar carinho para a parceira via PeerJS ou WhatsApp
function sendRemotePet() {
  const sent = sendMultiplayerPacket({ type: 'CARINHO' });

  if (sent) {
    playPaperSound();
    createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert('🐾 Carinho enviado ao vivo para a tela dela!');
  } else {
    if (confirm('O gatinho dela não parece estar com o jogo aberto agora. Deseja mandar o carinho pelo WhatsApp?')) {
      const url = `${window.location.origin}${window.location.pathname}?carinho=1`;
      const msg = encodeURIComponent(`Psst... Te mandei um carinho no jogo! Abre aqui para receber: 🐾💖\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    }
  }
}

// Executar animação e efeito visual ao receber carinho remoto
function triggerReceivedRemotePet() {
  playMeowSound();
  createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 16);

  const regEyes = document.getElementById('regular-eyes');
  const hapEyes = document.getElementById('happy-eyes');
  const wrapper = document.getElementById('cat-wrapper');
  const bubble = document.getElementById('speech-bubble');

  if (regEyes) regEyes.style.display = 'none';
  if (hapEyes) hapEyes.style.display = 'block';
  if (wrapper) wrapper.classList.add('petting');

  if (bubble) {
    bubble.innerText = "Seu amor acabou de te mandar um carinho com muito amor! 🐾💖";
    bubble.style.display = 'block';
    bubble.classList.remove('fade-out');
  }

  catStats.happiness = Math.min(100, catStats.happiness + 15);
  catStats.health = Math.min(100, catStats.health + 5);
  saveStats();

  setTimeout(() => {
    if (regEyes) regEyes.style.display = 'block';
    if (hapEyes) hapEyes.style.display = 'none';
    if (wrapper) wrapper.classList.remove('petting');
    if (bubble) {
      setTimeout(() => {
        bubble.classList.add('fade-out');
        setTimeout(() => { bubble.style.display = 'none'; }, 400);
      }, 5000);
    }
  }, 2500);
}

// Aplica reações visuais de acordo com os status reais do parceiro
function applyPartnerReactions(clone, stats) {
  if (!stats) return;

  const mouthSad = clone.querySelector('#mouth-sad');
  const mouthHungry = clone.querySelector('#mouth-hungry');
  const sleepyEyelids = clone.querySelector('#sleepy-eyelids');
  const sickMark = clone.querySelector('#sick-mark');
  const happyBlush = clone.querySelector('#happy-blush');

  if (mouthSad) mouthSad.style.display = 'none';
  if (mouthHungry) mouthHungry.style.display = 'none';
  if (sleepyEyelids) sleepyEyelids.style.display = 'none';
  if (sickMark) sickMark.style.display = 'none';
  if (happyBlush) happyBlush.style.display = 'none';

  if (stats.health < 35) {
    clone.classList.add('sick');
    if (sickMark) sickMark.style.display = 'block';
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (stats.energy < 35) {
    clone.classList.add('sleepy');
    if (sleepyEyelids) sleepyEyelids.style.display = 'block';
    return;
  }
  if (stats.hunger < 30) {
    if (mouthHungry) mouthHungry.style.display = 'block';
    return;
  }
  if (stats.happiness < 35) {
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (stats.hunger >= 70 && stats.energy >= 70 && stats.happiness >= 70 && stats.health >= 70) {
    if (happyBlush) happyBlush.style.display = 'block';
  }
}

// Desenha a miniatura SVG com os atributos e reações do parceiro
function renderMiniCatInside(containerId, catAttrs) {
  const container = document.getElementById(containerId);
  if (!container || !catAttrs) return;
  const mainSvg = document.getElementById('main-cat-svg');
  if (!mainSvg) return;

  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');

  const eyeL = clone.querySelector('#eye-bg-left');
  const eyeR = clone.querySelector('#eye-bg-right');
  if (eyeL) eyeL.setAttribute('fill', catAttrs.eyeColor || '#2b2725');
  if (eyeR) eyeR.setAttribute('fill', catAttrs.eyeColor || '#2b2725');

  const body = clone.querySelector('#cat-body');
  const head = clone.querySelector('#cat-head-normal');
  const tail = clone.querySelector('#cat-tail');
  const tailStripes = clone.querySelector('#tail-stripes');

  if (body) body.setAttribute('fill', '#fffdf9');
  if (head) head.setAttribute('fill', '#fffdf9');
  if (tail) {
    tail.setAttribute('fill', '#fffdf9');
    tail.setAttribute('stroke', '#2b2725');
  }
  if (tailStripes) tailStripes.style.display = 'none';

  ['breed-siamese', 'breed-tuxedo', 'breed-orange', 'body-tuxedo', 'body-orange'].forEach(id => {
    const el = clone.querySelector('#' + id);
    if (el) el.style.display = 'none';
  });

  if (catAttrs.breed === 'breed_siamese') {
    if (body) body.setAttribute('fill', '#ebdcc9');
    if (head) head.setAttribute('fill', '#ebdcc9');
    if (tail) tail.setAttribute('fill', '#3d281d');
    const s = clone.querySelector('#breed-siamese');
    if (s) s.style.display = 'block';
  } else if (catAttrs.breed === 'breed_tuxedo') {
    if (tail) tail.setAttribute('fill', '#2b2725');
    const tHead = clone.querySelector('#breed-tuxedo');
    const tBody = clone.querySelector('#body-tuxedo');
    if (tHead) tHead.style.display = 'block';
    if (tBody) tBody.style.display = 'block';
  } else if (catAttrs.breed === 'breed_orange') {
    if (body) body.setAttribute('fill', '#e58e45');
    if (head) head.setAttribute('fill', '#e58e45');
    if (tail) {
      tail.setAttribute('fill', '#e58e45');
      tail.setAttribute('stroke', '#b3581d');
    }
    if (tailStripes) tailStripes.style.display = 'block';
    const oHead = clone.querySelector('#breed-orange');
    const oBody = clone.querySelector('#body-orange');
    if (oHead) oHead.style.display = 'block';
    if (oBody) oBody.style.display = 'block';
  }

  const colors = catAttrs.itemColors || {};
  ['bowtie', 'glasses', 'flower', 'crown'].forEach(acc => {
    const el = clone.querySelector('#cosmetic-' + acc);
    const isEquipped = catAttrs.equipped && catAttrs.equipped.includes(acc);
    if (el) el.style.display = isEquipped ? 'block' : 'none';
  });

  const bL = clone.querySelector('#bowtie-left');
  const bR = clone.querySelector('#bowtie-right');
  if (bL && bR && colors['bowtie']) {
    bL.setAttribute('fill', colors['bowtie']);
    bR.setAttribute('fill', colors['bowtie']);
  }

  const gL = clone.querySelector('#glasses-left');
  const gR = clone.querySelector('#glasses-right');
  const gB = clone.querySelector('#glasses-bridge');
  if (gL && gR && colors['glasses']) {
    gL.setAttribute('stroke', colors['glasses']);
    gR.setAttribute('stroke', colors['glasses']);
    if (gB) gB.setAttribute('stroke', colors['glasses']);
  }

  const fC = clone.querySelector('#flower-center');
  if (fC && colors['flower']) fC.setAttribute('fill', colors['flower']);

  const cB = clone.querySelector('#crown-body');
  if (cB && colors['crown']) cB.setAttribute('fill', colors['crown']);

  if (catAttrs.stats) {
    applyPartnerReactions(clone, catAttrs.stats);
  }

  container.innerHTML = '';
  container.appendChild(clone);
}

// Renderiza o gato parceiro ao lado do principal no palco
function renderPartnerCatStage() {
  let partnerWrapper = document.getElementById('partner-cat-wrapper');
  const duoContainer = document.getElementById('cats-duo-stage');

  if (!partnerData) {
    if (partnerWrapper) partnerWrapper.remove();
    return;
  }

  if (!partnerWrapper && duoContainer) {
    partnerWrapper = document.createElement('div');
    partnerWrapper.id = 'partner-cat-wrapper';
    partnerWrapper.className = 'cat-wrapper partner-cat';
    partnerWrapper.onclick = (e) => {
      e.stopPropagation();
      openCoupleModal(e);
    };

    partnerWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      partnerWrapper.classList.add('drag-over');
    });
    partnerWrapper.addEventListener('dragleave', () => {
      partnerWrapper.classList.remove('drag-over');
    });
    partnerWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      partnerWrapper.classList.remove('drag-over');
      const foodId = e.dataTransfer.getData('text/plain');
      feedPartnerCat(foodId);
    });

    duoContainer.appendChild(partnerWrapper);
  }

  if (partnerWrapper) {
    renderMiniCatInside('partner-cat-wrapper', partnerData);
    if (!partnerWrapper.querySelector('.cat-label-tag')) {
      const label = document.createElement('span');
      label.className = 'cat-label-tag';
      label.innerText = partnerData.name || 'Parceira';
      partnerWrapper.appendChild(label);
    }
  }
}

// Alimentar o gatinho do parceiro remotamente
function feedPartnerCat(foodId) {
  if (!userInventory[foodId] || userInventory[foodId] <= 0) return;

  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  userInventory[foodId]--;
  if (userInventory[foodId] <= 0) delete userInventory[foodId];

  saveStats();
  renderInventorySlots();
  playPaperSound();

  const sent = sendMultiplayerPacket({
    type: 'ALIMENTAR_PARCEIRO',
    foodId: foodId
  });

  if (sent) {
    createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert(`Você alimentou o gatinho do seu amor com ${food.name}! 🍲💖`);
  } else {
    alert(`Você deu ${food.name} para o gatinho da parceira! (Ele comerá assim que ela conectar) 🐾`);
  }
}

// Desvincular os gatinhos
function unlinkCouple() {
  if (confirm("Tem certeza que deseja desvincular os gatinhos? O histórico e o gatinho do parceiro serão removidos deste dispositivo.")) {
    partnerData = null;
    localStorage.removeItem('cat_partner_data');
    renderPartnerCatStage();
    renderCoupleTabUI();
    alert("Vínculo removido com sucesso.");
  }
}

// Leitura de parâmetros na URL (?parceiro=... ou ?carinho=1)
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const dnaParam = params.get('parceiro');
  const carinhoParam = params.get('carinho');

  if (dnaParam) {
    setTimeout(() => {
      importPartnerDNA(dnaParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 600);
  }

  if (carinhoParam) {
    setTimeout(() => {
      triggerReceivedRemotePet();
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 800);
  }
});

// Renderização da interface do modal do casal
function renderCoupleTabUI() {
  const statusContainer = document.getElementById('couple-status-container');
  if (!statusContainer) return;

  if (!partnerData) {
    statusContainer.innerHTML = `
      <div style="text-align: center; padding: 14px 6px;">
        <p style="font-size: 1.05rem; margin-bottom: 12px; color: var(--pencil);">Vocês ainda não vincularam os gatinhos!</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="action-btn" style="justify-content: center; background: #eef7e8;" onclick="sharePartnerLink()">💬 Enviar Link para Ela (WhatsApp)</button>
          <button class="action-btn" style="justify-content: center;" onclick="showPartnerQRCode()">📷 Mostrar QR Code para Ela</button>
          <button class="action-btn" style="justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código DNA</button>
          <button class="action-btn" style="justify-content: center;" onclick="promptPartnerCode()">📥 Inserir Código Dela</button>
          <button class="action-btn" style="justify-content: center; font-size: 0.82rem;" onclick="startNFCSharing()">📲 Tentar Toque NFC</button>
        </div>
      </div>
    `;
    return;
  }

  const pStats = partnerData.stats || { hunger: 80, energy: 80, happiness: 80, health: 80 };

  statusContainer.innerHTML = `
    <div class="couple-card-stitch">
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold; margin-bottom: 6px;">
        <span style="color: #6e4425;">Status de ${partnerData.name || 'Parceira'}</span>
        <span id="couple-online-indicator">⚪ Desconectado</span>
      </div>

      <div class="couple-cats-row">
        <div class="couple-cat-box" id="couple-my-cat-preview"></div>
        <div class="couple-heart-divider">💖</div>
        <div class="couple-cat-box" id="couple-partner-cat-preview"></div>
      </div>

      <!-- Barras de Status do Parceiro -->
      <div class="partner-mini-bars">
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.hunger}%; background-color: ${pStats.hunger <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Fome</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.energy}%; background-color: ${pStats.energy <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Energia</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.happiness}%; background-color: ${pStats.happiness <= 30 ? '#c0392b' : '#c48b36'};"></div>
          </div>
          <span>Alegria</span>
        </div>
        <div class="partner-mini-bar-item">
          <div class="partner-bar-track">
            <div class="partner-bar-fill" style="height: ${pStats.health}%; background-color: ${pStats.health <= 30 ? '#c0392b' : '#27ae60'};"></div>
          </div>
          <span>Saúde</span>
        </div>
      </div>

      <div class="couple-stats-grid">
        <div class="couple-stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">${coupleStreak.current} dias</span>
          <span class="stat-label">Streak Atual</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🏆</span>
          <span class="stat-value">${coupleStreak.max} dias</span>
          <span class="stat-label">Maior Streak</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🎀</span>
          <span class="stat-value">${coupleStreak.ribbonCoins}</span>
          <span class="stat-label">Laços de Afeto</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">📅</span>
          <span class="stat-value">${coupleStreak.totalDays}</span>
          <span class="stat-label">Dias Conectados</span>
        </div>
      </div>

      <div class="couple-match-score">
        <div style="font-weight: bold; margin-bottom: 4px; color: #4a2912;">Placar de Jogos</div>
        <div style="display: flex; justify-content: space-around; font-size: 0.95rem;">
          <span>Você: <b>${coupleStreak.winsPlayer}</b></span>
          <span>Empates: <b>${coupleStreak.draws}</b></span>
          <span>Parceira: <b>${coupleStreak.winsPartner}</b></span>
        </div>
      </div>

      <button class="action-btn" style="width: 100%; justify-content: center; margin-top: 8px; background: #faeedb; color: #542c13;" onclick="sendRemotePet()">
        💌 Mandar Carinho / Ronrom Remoto
      </button>

      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código</button>
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="promptPartnerCode()">🔄 Atualizar Código Dela</button>
      </div>

      <button class="unlink-btn" onclick="unlinkCouple()">💔 Desvincular Gatinhos</button>
    </div>
  `;

  renderMiniCatInside('couple-my-cat-preview', {
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    stats: catStats
  });
  renderMiniCatInside('couple-partner-cat-preview', partnerData);

  if (activeConnection && activeConnection.open) {
    updateOnlineBadge(true);
  }
}

function copyMyDNACode() {
  const dna = exportMyCatDNA();
  navigator.clipboard.writeText(dna).then(() => {
    alert('Código DNA copiado para a área de transferência! Envie para o seu amor.');
  }).catch(() => {
    prompt('Copie o seu código abaixo:', dna);
  });
}

function promptPartnerCode() {
  const code = prompt('Cole aqui o código do gatinho da sua parceira:');
  if (code) importPartnerDNA(code);
}

function openCoupleModal(e) {
  if (e) e.stopPropagation();
  renderCoupleTabUI();
  document.getElementById('couple-modal').classList.add('open');
}

function closeCoupleModal(e) {
  if (e) e.stopPropagation();
  document.getElementById('couple-modal').classList.remove('open');
}/* =========================================================
   SISTEMA DE CASAL: PERFIL, VÍNCULO, STREAK, NFC, QR CODE
   E CARINHO REMOTO
========================================================= */

let partnerData = JSON.parse(localStorage.getItem('cat_partner_data') || 'null');
let coupleStreak = JSON.parse(localStorage.getItem('cat_couple_streak') || JSON.stringify({
  current: 0,
  max: 0,
  totalDays: 0,
  lastCheckinDate: null,
  ribbonCoins: 0,
  winsPlayer: 0,
  winsPartner: 0,
  draws: 0
}));

// Exporta o DNA do próprio gatinho em string compacta (Base64)
function exportMyCatDNA() {
  const dnaObj = {
    name: localStorage.getItem('cat_name') || 'Mimi',
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    timestamp: Date.now()
  };
  return btoa(encodeURIComponent(JSON.stringify(dnaObj)));
}

// Importa e guarda o parceiro via código
function importPartnerDNA(dnaString) {
  try {
    const raw = decodeURIComponent(atob(dnaString.trim()));
    const parsed = JSON.parse(raw);
    if (!parsed.breed || !parsed.eyeColor) throw new Error('DNA inválido');
    partnerData = parsed;
    localStorage.setItem('cat_partner_data', JSON.stringify(partnerData));
    registerCoupleCheckin();
    renderCoupleTabUI();
    renderPartnerCatStage();
    alert('🐾 Vínculo estabelecido com sucesso! O gatinho do seu amor agora está consigo.');
    return true;
  } catch (err) {
    alert('Código de parceiro inválido ou corrompido.');
    return false;
  }
}

// Registo diário de conexão e cálculo de Streak
function registerCoupleCheckin() {
  const today = new Date().toDateString();
  if (coupleStreak.lastCheckinDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (coupleStreak.lastCheckinDate === yesterday) {
    coupleStreak.current += 1;
  } else if (coupleStreak.lastCheckinDate !== today) {
    coupleStreak.current = 1;
  }

  if (coupleStreak.current > coupleStreak.max) {
    coupleStreak.max = coupleStreak.current;
  }

  coupleStreak.totalDays += 1;
  coupleStreak.lastCheckinDate = today;
  coupleStreak.ribbonCoins += 1; // 1 Laço de Afeto diário

  // Bónus no 7º dia consecutivo
  if (coupleStreak.current % 7 === 0) {
    coupleStreak.ribbonCoins += 5;
    alert(`🎉 Incrível! ${coupleStreak.current} dias de streak juntos! Bónus de +5 Laços 🎀!`);
  }

  localStorage.setItem('cat_couple_streak', JSON.stringify(coupleStreak));
}

// Iniciar leitura NFC com diagnóstico de permissão
async function startNFCSharing() {
  if (!('NDEFReader' in window)) {
    alert('NFC não suportado neste navegador. Utilize o QR Code ou a ligação direta!');
    return;
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert('Aviso: O navegador bloqueia o NFC sem HTTPS seguro. Utilize o site hospedado em HTTPS ou utilize o QR Code!');
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    alert('📡 Sensor ativado! Aproxime uma tag NFC ou o telemóvel do seu amor...');

    ndef.onreading = (event) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        const text = decoder.decode(record.data);
        if (text.includes('CAT_DNA:')) {
          const incomingDNA = text.split('CAT_DNA:')[1];
          importPartnerDNA(incomingDNA);
          break;
        }
      }
    };
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      alert('Permissão de NFC negada nas configurações do site no navegador.');
    } else {
      alert(`Não foi possível ativar o sensor: ${err.message || err.name}`);
    }
  }
}

// Partilhar ligação direta por WhatsApp
function sharePartnerLink() {
  const dna = exportMyCatDNA();
  const url = `${window.location.origin}${window.location.pathname}?parceiro=${dna}`;
  const msg = encodeURIComponent(`Amor, aqui está o vínculo do meu gatinho para abrires no jogo! 🐾💖\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

// Exibir QR Code no ecrã para o parceiro ler
function showPartnerQRCode() {
  const dna = exportMyCatDNA();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(dna)}`;
  
  const container = document.getElementById('couple-status-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 10px;">
      <p style="font-weight: bold; margin-bottom: 8px; color: #542c13;">Aponte a câmara dela para o QR Code:</p>
      <img src="${qrUrl}" alt="QR Code do Gatinho" style="border: 2.5px solid var(--charcoal); border-radius: 12px; margin-bottom: 10px; background: white; padding: 6px;" />
      <button class="action-btn" style="width: 100%; justify-content: center;" onclick="renderCoupleTabUI()">⬅ Voltar</button>
    </div>
  `;
}

// Enviar carinho para a parceira via ligação do WhatsApp
function sendRemotePet() {
  const url = `${window.location.origin}${window.location.pathname}?carinho=1`;
  const msg = encodeURIComponent(`Psst... Mandei-te um carinho e um ronrom no jogo! Abre aqui para receber: 🐾💖\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

// Executar animação e efeito visual ao receber carinho remoto
function triggerReceivedRemotePet() {
  playMeowSound();
  
  // Chuva de partículas comemorativas no centro do ecrã
  createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 16);

  const regEyes = document.getElementById('regular-eyes');
  const hapEyes = document.getElementById('happy-eyes');
  const wrapper = document.getElementById('cat-wrapper');
  const bubble = document.getElementById('speech-bubble');

  if (regEyes) regEyes.style.display = 'none';
  if (hapEyes) hapEyes.style.display = 'block';
  if (wrapper) wrapper.classList.add('petting');

  if (bubble) {
    bubble.innerText = "O seu amor acabou de lhe mandar um carinho com muito amor! 🐾💖";
    bubble.style.display = 'block';
    bubble.classList.remove('fade-out');
  }

  // Bonificação de alegria e saúde
  catStats.happiness = Math.min(100, catStats.happiness + 15);
  catStats.health = Math.min(100, catStats.health + 5);
  saveStats();

  setTimeout(() => {
    if (regEyes) regEyes.style.display = 'block';
    if (hapEyes) hapEyes.style.display = 'none';
    if (wrapper) wrapper.classList.remove('petting');
    if (bubble) {
      setTimeout(() => {
        bubble.classList.add('fade-out');
        setTimeout(() => { bubble.style.display = 'none'; }, 400);
      }, 5000);
    }
  }, 2500);
}

// Leitura de parâmetros na URL (?parceiro=... ou ?carinho=1)
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const dnaParam = params.get('parceiro');
  const carinhoParam = params.get('carinho');

  if (dnaParam) {
    setTimeout(() => {
      importPartnerDNA(dnaParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 600);
  }

  if (carinhoParam) {
    setTimeout(() => {
      triggerReceivedRemotePet();
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 800);
  }
});

// Renderização da interface do modal do casal
function renderCoupleTabUI() {
  const statusContainer = document.getElementById('couple-status-container');
  if (!statusContainer) return;

  if (!partnerData) {
    statusContainer.innerHTML = `
      <div style="text-align: center; padding: 14px 6px;">
        <p style="font-size: 1.05rem; margin-bottom: 12px; color: var(--pencil);">Ainda não vincularam os vossos gatinhos!</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="action-btn" style="justify-content: center; background: #eef7e8;" onclick="sharePartnerLink()">💬 Enviar Ligação para Ela (WhatsApp)</button>
          <button class="action-btn" style="justify-content: center;" onclick="showPartnerQRCode()">📷 Mostrar QR Code para Ela</button>
          <button class="action-btn" style="justify-content: center;" onclick="copyMyDNACode()">📋 Copiar o Meu Código DNA</button>
          <button class="action-btn" style="justify-content: center;" onclick="promptPartnerCode()">📥 Inserir Código Dela</button>
          <button class="action-btn" style="justify-content: center; font-size: 0.82rem;" onclick="startNFCSharing()">📲 Tentar Toque NFC</button>
        </div>
      </div>
    `;
    return;
  }

  statusContainer.innerHTML = `
    <div class="couple-card-stitch">
      <div class="couple-cats-row">
        <div class="couple-cat-box" id="couple-my-cat-preview"></div>
        <div class="couple-heart-divider">💖</div>
        <div class="couple-cat-box" id="couple-partner-cat-preview"></div>
      </div>

      <div class="couple-stats-grid">
        <div class="couple-stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">${coupleStreak.current} dias</span>
          <span class="stat-label">Streak Atual</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🏆</span>
          <span class="stat-value">${coupleStreak.max} dias</span>
          <span class="stat-label">Maior Streak</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🎀</span>
          <span class="stat-value">${coupleStreak.ribbonCoins}</span>
          <span class="stat-label">Laços de Afeto</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">📅</span>
          <span class="stat-value">${coupleStreak.totalDays}</span>
          <span class="stat-label">Dias Conectados</span>
        </div>
      </div>

      <div class="couple-match-score">
        <div style="font-weight: bold; margin-bottom: 4px; color: #4a2912;">Placar de Jogos</div>
        <div style="display: flex; justify-content: space-around; font-size: 0.95rem;">
          <span>Você: <b>${coupleStreak.winsPlayer}</b></span>
          <span>Empates: <b>${coupleStreak.draws}</b></span>
          <span>Parceira: <b>${coupleStreak.winsPartner}</b></span>
        </div>
      </div>

      <button class="action-btn" style="width: 100%; justify-content: center; margin-top: 8px; background: #faeedb; color: #542c13;" onclick="sendRemotePet()">
        💌 Mandar Carinho / Ronrom Remoto
      </button>

      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código</button>
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="promptPartnerCode()">🔄 Atualizar Código Dela</button>
      </div>
    </div>
  `;

  renderMiniCatInside('couple-my-cat-preview', {
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors
  });
  renderMiniCatInside('couple-partner-cat-preview', partnerData);
}

function copyMyDNACode() {
  const dna = exportMyCatDNA();
  navigator.clipboard.writeText(dna).then(() => {
    alert('Código DNA copiado para a área de transferência! Envie para o seu amor.');
  }).catch(() => {
    prompt('Copie o seu código abaixo:', dna);
  });
}

function promptPartnerCode() {
  const code = prompt('Cole aqui o código do gatinho da sua parceira:');
  if (code) importPartnerDNA(code);
}

// Desenha a miniatura SVG com os atributos exatos do gatinho parceiro
function renderMiniCatInside(containerId, catAttrs) {
  const container = document.getElementById(containerId);
  if (!container || !catAttrs) return;
  const mainSvg = document.getElementById('main-cat-svg');
  if (!mainSvg) return;

  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');

  // Cores dos olhos
  const eyeL = clone.querySelector('#eye-bg-left');
  const eyeR = clone.querySelector('#eye-bg-right');
  if (eyeL) eyeL.setAttribute('fill', catAttrs.eyeColor || '#2b2725');
  if (eyeR) eyeR.setAttribute('fill', catAttrs.eyeColor || '#2b2725');

  // Base do corpo e cauda
  const body = clone.querySelector('#cat-body');
  const head = clone.querySelector('#cat-head-normal');
  const tail = clone.querySelector('#cat-tail');
  const tailStripes = clone.querySelector('#tail-stripes');

  if (body) body.setAttribute('fill', '#fffdf9');
  if (head) head.setAttribute('fill', '#fffdf9');
  if (tail) {
    tail.setAttribute('fill', '#fffdf9');
    tail.setAttribute('stroke', '#2b2725');
  }
  if (tailStripes) tailStripes.style.display = 'none';

  // Esconder marcações antes de aplicar a raça selecionada
  ['breed-siamese', 'breed-tuxedo', 'breed-orange', 'body-tuxedo', 'body-orange'].forEach(id => {
    const el = clone.querySelector('#' + id);
    if (el) el.style.display = 'none';
  });

  if (catAttrs.breed === 'breed_siamese') {
    if (body) body.setAttribute('fill', '#ebdcc9');
    if (head) head.setAttribute('fill', '#ebdcc9');
    if (tail) tail.setAttribute('fill', '#3d281d');
    const s = clone.querySelector('#breed-siamese');
    if (s) s.style.display = 'block';
  } else if (catAttrs.breed === 'breed_tuxedo') {
    if (tail) tail.setAttribute('fill', '#2b2725');
    const tHead = clone.querySelector('#breed-tuxedo');
    const tBody = clone.querySelector('#body-tuxedo');
    if (tHead) tHead.style.display = 'block';
    if (tBody) tBody.style.display = 'block';
  } else if (catAttrs.breed === 'breed_orange') {
    if (body) body.setAttribute('fill', '#e58e45');
    if (head) head.setAttribute('fill', '#e58e45');
    if (tail) {
      tail.setAttribute('fill', '#e58e45');
      tail.setAttribute('stroke', '#b3581d');
    }
    if (tailStripes) tailStripes.style.display = 'block';
    const oHead = clone.querySelector('#breed-orange');
    const oBody = clone.querySelector('#body-orange');
    if (oHead) oHead.style.display = 'block';
    if (oBody) oBody.style.display = 'block';
  }

  // Acessórios e cores personalizadas
  const colors = catAttrs.itemColors || {};
  ['bowtie', 'glasses', 'flower', 'crown'].forEach(acc => {
    const el = clone.querySelector('#cosmetic-' + acc);
    const isEquipped = catAttrs.equipped && catAttrs.equipped.includes(acc);
    if (el) el.style.display = isEquipped ? 'block' : 'none';
  });

  const bL = clone.querySelector('#bowtie-left');
  const bR = clone.querySelector('#bowtie-right');
  if (bL && bR && colors['bowtie']) {
    bL.setAttribute('fill', colors['bowtie']);
    bR.setAttribute('fill', colors['bowtie']);
  }

  const gL = clone.querySelector('#glasses-left');
  const gR = clone.querySelector('#glasses-right');
  const gB = clone.querySelector('#glasses-bridge');
  if (gL && gR && colors['glasses']) {
    gL.setAttribute('stroke', colors['glasses']);
    gR.setAttribute('stroke', colors['glasses']);
    if (gB) gB.setAttribute('stroke', colors['glasses']);
  }

  const fC = clone.querySelector('#flower-center');
  if (fC && colors['flower']) fC.setAttribute('fill', colors['flower']);

  const cB = clone.querySelector('#crown-body');
  if (cB && colors['crown']) cB.setAttribute('fill', colors['crown']);

  container.innerHTML = '';
  container.appendChild(clone);
}

// Renderiza o gato parceiro ao lado do principal no cenário principal
function renderPartnerCatStage() {
  let partnerWrapper = document.getElementById('partner-cat-wrapper');
  if (!partnerData) {
    if (partnerWrapper) partnerWrapper.style.display = 'none';
    return;
  }

  if (!partnerWrapper) {
    partnerWrapper = document.createElement('div');
    partnerWrapper.id = 'partner-cat-wrapper';
    partnerWrapper.className = 'cat-wrapper partner-cat';
    partnerWrapper.style.marginLeft = '-45px';
    partnerWrapper.style.transform = 'scale(0.85)';
    const mainWrapper = document.getElementById('cat-wrapper');
    if (mainWrapper && mainWrapper.parentNode) {
      mainWrapper.parentNode.insertBefore(partnerWrapper, mainWrapper.nextSibling);
    }
  }

  partnerWrapper.style.display = 'flex';
  renderMiniCatInside('partner-cat-wrapper', partnerData);
}

function openCoupleModal(e) {
  if (e) e.stopPropagation();
  renderCoupleTabUI();
  document.getElementById('couple-modal').classList.add('open');
}

function closeCoupleModal(e) {
  if (e) e.stopPropagation();
  document.getElementById('couple-modal').classList.remove('open');
}
