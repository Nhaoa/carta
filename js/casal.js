/* =========================================================
   SISTEMA DE CASAL: PERFIL, VÍNCULO, STREAK, NFC E CÓDIGO DNA
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

  // Bônus no 7º dia consecutivo
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
    alert('Aviso: O navegador bloqueia o NFC sem HTTPS seguro. Use o site hospedado em HTTPS ou use o QR Code!');
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

// Exibir QR Code na tela para o outro escanear
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

// Auto-conectar se abriu por link compartilhado (?parceiro=...)
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const dnaParam = params.get('parceiro');
  if (dnaParam) {
    setTimeout(() => {
      importPartnerDNA(dnaParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 600);
  }
});

// Renderiza a interface do modal do casal
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

      <div style="display: flex; gap: 8px; margin-top: 10px;">
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

// Desenha miniatura SVG com os atributos de um gato especificado
function renderMiniCatInside(containerId, catAttrs) {
  const container = document.getElementById(containerId);
  if (!container || !catAttrs) return;
  const mainSvg = document.getElementById('main-cat-svg');
  if (!mainSvg) return;

  const clone = mainSvg.cloneNode(true);
  clone.removeAttribute('id');

  // Ajusta cores dos olhos
  const eyeL = clone.querySelector('#eye-bg-left');
  const eyeR = clone.querySelector('#eye-bg-right');
  if (eyeL) eyeL.setAttribute('fill', catAttrs.eyeColor || '#2b2725');
  if (eyeR) eyeR.setAttribute('fill', catAttrs.eyeColor || '#2b2725');

  // Base do corpo e rabo
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

  // Esconde todas as pelagens antes de ativar a correta
  ['breed-siamese', 'breed-tuxedo', 'breed-orange', 'body-tuxedo', 'body-orange'].forEach(id => {
    const el = clone.querySelector('#' + id);
    if (el) el.style.display = 'none';
  });

  // Raças
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

  // Acessórios e cores
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
