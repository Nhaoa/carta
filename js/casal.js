/* =========================================================
   SISTEMA DE CASAL: PERFIL, VÍNCULO, STREAK, NFC, QR CODE,
   CARINHO REMOTO, STATUS MÚTUOS E DESVINCULAÇÃO
========================================================= */

let partnerData = JSON.parse(localStorage.getItem('cat_partner_data') || 'null');
let partnerStats = JSON.parse(localStorage.getItem('cat_partner_stats') || 'null');

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
    peerId: myPeerId || localStorage.getItem('cat_my_peer_id'),
    breed: activeBreed,
    eyeColor: activeEyeColor,
    pupil: activePupil,
    mouth: activeMouth,
    expr: activeExpr,
    equipped: equippedItems,
    itemColors: itemColors,
    stats: catStats,
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
    if (parsed.stats) {
      partnerStats = parsed.stats;
      localStorage.setItem('cat_partner_stats', JSON.stringify(partnerStats));
    }

    localStorage.setItem('cat_partner_data', JSON.stringify(partnerData));
    registerCoupleCheckin();
    renderCoupleTabUI();
    renderPartnerCatStage();

    // Se possui peerId e o peer estiver ativo, conecta na hora
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

// Desvincular gatinho do parceiro
function unlinkPartner() {
  if (!partnerData) return;

  const confirmUnlink = confirm('Tem certeza de que deseja desvincular o gatinho do seu parceiro? Vocês voltarão a jogar no modo solo.');
  if (!confirmUnlink) return;

  // Fecha conexão PeerJS ativa, se houver
  if (activeConnection) {
    try { activeConnection.close(); } catch(e) {}
    activeConnection = null;
  }

  partnerData = null;
  partnerStats = null;
  localStorage.removeItem('cat_partner_data');
  localStorage.removeItem('cat_partner_stats');

  renderCoupleTabUI();
  renderPartnerCatStage();
  updateOnlineBadge(false);

  alert('🐾 Gatinhos desvinculados com sucesso.');
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
  coupleStreak.ribbonCoins += 1;

  if (coupleStreak.current % 7 === 0) {
    coupleStreak.ribbonCoins += 5;
    alert(`🎉 Incrível! ${coupleStreak.current} dias de streak juntos! Bônus de +5 Laços 🎀!`);
  }

  localStorage.setItem('cat_couple_streak', JSON.stringify(coupleStreak));
}

// Leitura NFC
async function startNFCSharing() {
  if (!('NDEFReader' in window)) {
    alert('NFC não suportado neste navegador. Utilize o QR Code ou o link direto!');
    return;
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert('Aviso: O navegador bloqueia o NFC sem HTTPS seguro. Utilize o site hospedado em HTTPS ou o QR Code!');
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

// Compartilhar via WhatsApp
function sharePartnerLink() {
  const dna = exportMyCatDNA();
  const url = `${window.location.origin}${window.location.pathname}?parceiro=${dna}`;
  const msg = encodeURIComponent(`Amor, aqui está o vínculo do meu gatinho para abrir no jogo! 🐾💖\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

// Exibir QR Code
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

// Enviar carinho remoto
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

// Receber carinho remoto
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

  // Envia os status atualizados de volta para o parceiro
  if (typeof syncMyStatsToPartner === 'function') {
    syncMyStatsToPartner();
  }

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

// Receber atualização de status do parceiro via PeerJS
function updatePartnerStatsFromRemote(newStats) {
  partnerStats = newStats;
  localStorage.setItem('cat_partner_stats', JSON.stringify(partnerStats));
  renderPartnerCatStage();
  renderCoupleTabUI();
}

// Leitura de parâmetros na URL
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

  const pStats = partnerStats || { hunger: 80, energy: 80, happiness: 85, health: 95 };

  statusContainer.innerHTML = `
    <div class="couple-card-stitch">
      <div style="text-align: right; font-size: 0.8rem; font-weight: bold; margin-bottom: 6px;">
        <span id="couple-online-indicator">⚪ Desconectado</span>
      </div>

      <div class="couple-cats-row">
        <div class="couple-cat-box" id="couple-my-cat-preview"></div>
        <div class="couple-heart-divider">💖</div>
        <div class="couple-cat-box" id="couple-partner-cat-preview"></div>
      </div>

      <!-- STATUS COMPARATIVOS EM TEMPO REAL -->
      <div class="couple-status-compare">
        <div class="cat-status-mini-card">
          <div class="cat-mini-name">Meu Gato</div>
          <div class="mini-stat-bar-row">
            <span>🍗 Fome</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${catStats.hunger}%;"></div></div>
          </div>
          <div class="mini-stat-bar-row">
            <span>⚡ Energia</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${catStats.energy}%;"></div></div>
          </div>
          <div class="mini-stat-bar-row">
            <span>😺 Alegria</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${catStats.happiness}%;"></div></div>
          </div>
          <div class="mini-stat-bar-row">
            <span>❤️ Saúde</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${catStats.health}%;"></div></div>
          </div>
        </div>

        <div class="cat-status-mini-card">
          <div class="cat-mini-name">${partnerData.name || 'Gatinho Dela'}</div>
          <div class="mini-stat-bar-row">
            <span>🍗 Fome</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${pStats.hunger}%;"></div></div>
          </div>
          <div class="mini-stat-bar-row">
            <span>⚡ Energia</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${pStats.energy}%;"></div></div>
          </div>
          <div class="mini-stat-bar-row">
            <span>😺 Alegria</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${pStats.happiness}%;"></div></div>
          </div>
          <div class="mini-stat-bar-row">
            <span>❤️ Saúde</span>
            <div class="mini-stat-track"><div class="mini-stat-fill" style="width: ${pStats.health}%;"></div></div>
          </div>
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

      <!-- BOTÃO DE DESVINCULAR -->
      <button class="action-btn" style="width: 100%; justify-content: center; margin-top: 10px; font-size: 0.82rem; background: #fff1f0; color: #c0392b; border-color: #c0392b;" onclick="unlinkPartner()">
        💔 Desvincular Gatinho
      </button>
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

// Renderiza a miniatura SVG com os atributos e reações do parceiro
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

  // Acessórios
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

  // Reações visuais do parceiro de acordo com seus status
  const currentPStats = partnerStats || catAttrs.stats;
  if (currentPStats) {
    const sleepyEyelids = clone.querySelector('#sleepy-eyelids');
    const mouthSad = clone.querySelector('#mouth-sad');
    const mouthHungry = clone.querySelector('#mouth-hungry');
    const happyBlush = clone.querySelector('#happy-blush');
    const sickMark = clone.querySelector('#sick-mark');

    if (sleepyEyelids) sleepyEyelids.style.display = 'none';
    if (mouthSad) mouthSad.style.display = 'none';
    if (mouthHungry) mouthHungry.style.display = 'none';
    if (happyBlush) happyBlush.style.display = 'none';
    if (sickMark) sickMark.style.display = 'none';

    if (currentPStats.health < 35) {
      if (sickMark) sickMark.style.display = 'block';
      if (mouthSad) mouthSad.style.display = 'block';
    } else if (currentPStats.energy < 35) {
      if (sleepyEyelids) sleepyEyelids.style.display = 'block';
    } else if (currentPStats.hunger < 30) {
      if (mouthHungry) mouthHungry.style.display = 'block';
    } else if (currentPStats.happiness < 35) {
      if (mouthSad) mouthSad.style.display = 'block';
    } else if (currentPStats.hunger >= 70 && currentPStats.energy >= 70 && currentPStats.happiness >= 70) {
      if (happyBlush) happyBlush.style.display = 'block';
    }
  }

  container.innerHTML = '';
  container.appendChild(clone);
}

// Renderiza o gato parceiro ao lado do principal no cenário principal (lado a lado)
function renderPartnerCatStage() {
  const mainStage = document.querySelector('.stage');
  if (!mainStage) return;

  let row = document.getElementById('cats-stage-row');
  const mainWrapper = document.getElementById('cat-wrapper');

  if (!row && mainWrapper) {
    row = document.createElement('div');
    row.id = 'cats-stage-row';
    row.className = 'cats-stage-row';
    mainWrapper.parentNode.insertBefore(row, mainWrapper);
    row.appendChild(mainWrapper);
  }

  let partnerWrapper = document.getElementById('partner-cat-wrapper');

  if (!partnerData) {
    if (partnerWrapper) partnerWrapper.remove();
    return;
  }

  if (!partnerWrapper && row) {
    partnerWrapper = document.createElement('div');
    partnerWrapper.id = 'partner-cat-wrapper';
    partnerWrapper.className = 'cat-wrapper partner-cat';
    partnerWrapper.onclick = (e) => {
      e.stopPropagation();
      openCoupleModal(e);
    };
    row.appendChild(partnerWrapper);
  }

  if (partnerWrapper) {
    renderMiniCatInside('partner-cat-wrapper', partnerData);
  }
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
   SISTEMA DE CASAL
========================================================= */

window.partnerData = null;
try {
  const raw = localStorage.getItem('cat_partner_data');
  if (raw && raw !== 'null') window.partnerData = JSON.parse(raw);
} catch (e) { window.partnerData = null; }

window.coupleStreak = JSON.parse(localStorage.getItem('cat_couple_streak') || JSON.stringify({
  current: 0,
  max: 0,
  totalDays: 0,
  lastCheckinDate: null,
  ribbonCoins: 0,
  winsPlayer: 0,
  winsPartner: 0,
  draws: 0
}));

window.exportMyCatDNA = function() {
  const dnaObj = {
    name: localStorage.getItem('cat_name') || 'Mimi',
    peerId: window.myPeerId || localStorage.getItem('cat_my_peer_id'),
    breed: window.activeBreed,
    eyeColor: window.activeEyeColor,
    stats: window.catStats
  };
  return btoa(encodeURIComponent(JSON.stringify(dnaObj)));
};

window.importPartnerDNA = function(dnaString) {
  try {
    const raw = decodeURIComponent(atob(dnaString.trim()));
    const parsed = JSON.parse(raw);
    window.partnerData = parsed;
    localStorage.setItem('cat_partner_data', JSON.stringify(window.partnerData));
    window.renderPartnerCatStage();
    window.renderCoupleTabUI();
    alert('🐾 Vínculo estabelecido com sucesso!');
  } catch (err) {
    alert('Código inválido!');
  }
};

window.renderPartnerCatStage = function() {
  const wrapper = document.getElementById('partner-cat-wrapper');
  const slot = document.getElementById('partner-svg-slot');
  if (!wrapper || !slot) return;

  if (!window.partnerData) {
    wrapper.style.display = 'none';
    slot.innerHTML = '';
    return;
  }

  wrapper.style.display = 'flex';
  const mainSvg = document.getElementById('main-cat-svg');
  if (!mainSvg) return;
  slot.innerHTML = '';
  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');
  slot.appendChild(clone);
};

window.renderCoupleTabUI = function() {
  const container = document.getElementById('couple-status-container');
  if (!container) return;

  if (!window.partnerData) {
    container.innerHTML = `
      <div style="text-align: center; padding: 14px 6px;">
        <p style="margin-bottom: 12px;">Vocês ainda não vincularam os gatinhos!</p>
        <button class="action-btn" style="width: 100%; justify-content: center; margin-bottom: 8px;" onclick="promptPartnerCode()">📥 Inserir Código Dela</button>
        <button class="action-btn" style="width: 100%; justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="couple-card-stitch">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <b>Conectados! 🐾</b>
        <span id="couple-online-indicator">⚪ Conectando</span>
      </div>
      <div class="couple-stats-grid">
        <div class="couple-stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">${window.coupleStreak.current} dias</span>
          <span class="stat-label">Streak</span>
        </div>
        <div class="couple-stat-item">
          <span class="stat-icon">🎀</span>
          <span class="stat-value">${window.coupleStreak.ribbonCoins}</span>
          <span class="stat-label">Laços</span>
        </div>
      </div>
      <button class="action-btn" style="width: 100%; justify-content: center; margin-top: 8px;" onclick="sendRemotePet()">💌 Mandar Carinho</button>
      <button class="unlink-btn" onclick="unlinkCouple()">💔 Desvincular</button>
    </div>
  `;
};

window.promptPartnerCode = function() {
  const code = prompt('Cole aqui o código DNA do parceiro:');
  if (code) window.importPartnerDNA(code);
};

window.copyMyDNACode = function() {
  const dna = window.exportMyCatDNA();
  navigator.clipboard.writeText(dna).then(() => alert('Código copiado!')).catch(() => prompt('Copie:', dna));
};

window.sendRemotePet = function() {
  if (typeof sendMultiplayerPacket === 'function' && sendMultiplayerPacket({ type: 'CARINHO' })) {
    alert('🐾 Carinho enviado ao vivo!');
  } else {
    alert('Parceira offline no momento!');
  }
};

window.unlinkCouple = function() {
  if (confirm('Desvincular os gatinhos?')) {
    window.partnerData = null;
    localStorage.removeItem('cat_partner_data');
    window.renderPartnerCatStage();
    window.renderCoupleTabUI();
  }
};

window.openCoupleModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('couple-modal');
  if (!modal) return;
  modal.classList.add('open');
  window.renderCoupleTabUI();
};

window.closeCoupleModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('couple-modal');
  if (modal) modal.classList.remove('open');
};/* =========================================================
   SISTEMA DE CASAL: PERFIL, VÍNCULO, STREAK, NFC, QR CODE
   E SINCRONIZAÇÃO DE STATUS
========================================================= */

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

function exportMyCatDNA() {
  const dnaObj = {
    name: localStorage.getItem('cat_name') || 'Mimi',
    peerId: (typeof myPeerId !== 'undefined' ? myPeerId : null) || localStorage.getItem('cat_my_peer_id'),
    breed: typeof activeBreed !== 'undefined' ? activeBreed : 'breed_white',
    eyeColor: typeof activeEyeColor !== 'undefined' ? activeEyeColor : '#2b2725',
    pupil: typeof activePupil !== 'undefined' ? activePupil : 'pupil_normal',
    mouth: typeof activeMouth !== 'undefined' ? activeMouth : 'mouth_cat',
    expr: typeof activeExpr !== 'undefined' ? activeExpr : 'none',
    equipped: typeof equippedItems !== 'undefined' ? equippedItems : [],
    itemColors: typeof itemColors !== 'undefined' ? itemColors : {},
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

function importPartnerDNA(dnaString) {
  try {
    const raw = decodeURIComponent(atob(dnaString.trim()));
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.breed || !parsed.eyeColor) throw new Error('DNA inválido');
    partnerData = parsed;
    localStorage.setItem('cat_partner_data', JSON.stringify(partnerData));
    registerCoupleCheckin();
    renderPartnerCatStage();
    renderCoupleTabUI();

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

async function startNFCSharing() {
  if (!('NDEFReader' in window)) {
    alert('NFC não suportado neste navegador. Utilize o QR Code ou o link!');
    return;
  }

  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    alert('Aviso: O NFC requer HTTPS seguro. Utilize o QR Code!');
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    alert('📡 Sensor ativado! Aproxime uma tag NFC ou o celular do parceiro...');

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
    alert(`Não foi possível ativar o NFC: ${err.message || err.name}`);
  }
}

function sharePartnerLink() {
  const dna = exportMyCatDNA();
  const url = `${window.location.origin}${window.location.pathname}?parceiro=${dna}`;
  const msg = encodeURIComponent(`Amor, aqui está o vínculo do meu gatinho para você abrir no jogo! 🐾💖\n${url}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function showPartnerQRCode() {
  const dna = exportMyCatDNA();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(dna)}`;
  
  const container = document.getElementById('couple-status-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 10px;">
      <p style="font-weight: bold; margin-bottom: 8px; color: #542c13;">Aponte a câmera dela para o QR Code:</p>
      <img src="${qrUrl}" alt="QR Code" style="border: 2.5px solid var(--charcoal); border-radius: 12px; margin-bottom: 10px; background: white; padding: 6px;" />
      <button class="action-btn" style="width: 100%; justify-content: center;" onclick="renderCoupleTabUI()">⬅ Voltar</button>
    </div>
  `;
}

function sendRemotePet() {
  const sent = (typeof sendMultiplayerPacket === 'function') && sendMultiplayerPacket({ type: 'CARINHO' });

  if (sent) {
    if (typeof playPaperSound === 'function') playPaperSound();
    if (typeof createFloatingParticles === 'function') createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert('🐾 Carinho enviado ao vivo para a tela dela!');
  } else {
    if (confirm('O gatinho dela não parece estar com o jogo aberto agora. Deseja mandar o carinho pelo WhatsApp?')) {
      const url = `${window.location.origin}${window.location.pathname}?carinho=1`;
      const msg = encodeURIComponent(`Psst... Te mandei um carinho no jogo! Abre aqui para receber: 🐾💖\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
    }
  }
}

function triggerReceivedRemotePet() {
  if (typeof playMeowSound === 'function') playMeowSound();
  if (typeof createFloatingParticles === 'function') createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 16);

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
      }, 4000);
    }
  }, 2500);
}

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
    if (sickMark) sickMark.style.display = 'block';
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (stats.energy < 35) {
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

function renderPartnerCatStage() {
  const wrapper = document.getElementById('partner-cat-wrapper');
  const slot = document.getElementById('partner-svg-slot');
  const label = document.getElementById('partner-label-tag');

  if (!wrapper || !slot) return;

  if (!partnerData || !partnerData.breed) {
    wrapper.style.display = 'none';
    slot.innerHTML = '';
    return;
  }

  wrapper.style.display = 'flex';
  if (label) label.innerText = partnerData.name || 'Parceira';
  renderMiniCatInside('partner-svg-slot', partnerData);
}

function feedPartnerCat(foodId) {
  if (!userInventory[foodId] || userInventory[foodId] <= 0) return;

  const food = FOOD_ITEMS.find(f => f.id === foodId);
  if (!food) return;

  userInventory[foodId]--;
  if (userInventory[foodId] <= 0) delete userInventory[foodId];

  saveStats();
  renderInventorySlots();
  if (typeof playPaperSound === 'function') playPaperSound();

  const sent = (typeof sendMultiplayerPacket === 'function') && sendMultiplayerPacket({
    type: 'ALIMENTAR_PARCEIRO',
    foodId: foodId
  });

  if (sent) {
    if (typeof createFloatingParticles === 'function') createFloatingParticles(window.innerWidth / 2, window.innerHeight / 2, 8);
    alert(`Você alimentou o gatinho do seu amor com ${food.name}! 🍲💖`);
  } else {
    alert(`Você deu ${food.name} para o gatinho da parceira! 🐾`);
  }
}

function unlinkCouple() {
  if (confirm("Tem certeza que deseja desvincular os gatinhos?")) {
    partnerData = null;
    localStorage.removeItem('cat_partner_data');
    renderPartnerCatStage();
    renderCoupleTabUI();
    alert("Vínculo removido com sucesso.");
  }
}

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
    breed: typeof activeBreed !== 'undefined' ? activeBreed : 'breed_white',
    eyeColor: typeof activeEyeColor !== 'undefined' ? activeEyeColor : '#2b2725',
    pupil: typeof activePupil !== 'undefined' ? activePupil : 'pupil_normal',
    mouth: typeof activeMouth !== 'undefined' ? activeMouth : 'mouth_cat',
    expr: typeof activeExpr !== 'undefined' ? activeExpr : 'none',
    equipped: typeof equippedItems !== 'undefined' ? equippedItems : [],
    itemColors: typeof itemColors !== 'undefined' ? itemColors : {},
    stats: catStats
  });
  renderMiniCatInside('couple-partner-cat-preview', partnerData);

  if (typeof activeConnection !== 'undefined' && activeConnection && activeConnection.open) {
    if (typeof updateOnlineBadge === 'function') updateOnlineBadge(true);
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
  }
  const modal = document.getElementById('couple-modal');
  if (!modal) return;
  modal.classList.add('open');
  renderCoupleTabUI();
}

function closeCoupleModal(e) {
  if (e) {
    e.stopPropagation();
  }
  const modal = document.getElementById('couple-modal');
  if (modal) modal.classList.remove('open');
}

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

  renderPartnerCatStage();
});
