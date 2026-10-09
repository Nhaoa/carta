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

// Exporta o DNA do próprio gatinho em string compacta
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

// Suporte ao toque por NFC
async function startNFCSharing() {
  if (!('NDEFReader' in window)) {
    alert('NFC não suportado neste navegador. Use o código de texto!');
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.write({
      records: [{ recordType: 'text', data: 'CAT_DNA:' + exportMyCatDNA() }]
    });

    alert('Aproxime o verso do celular da sua parceira para conectar...');

    await ndef.scan();
    ndef.onreading = (event) => {
      const decoder = new TextDecoder();
      for (const record of event.message.records) {
        const text = decoder.decode(record.data);
        if (text.startsWith('CAT_DNA:')) {
          const incomingDNA = text.replace('CAT_DNA:', '');
          importPartnerDNA(incomingDNA);
          break;
        }
      }
    };
  } catch (err) {
    alert('Erro ou permissão negada para o NFC.');
  }
}

// Renderiza a interface do modal do casal
function renderCoupleTabUI() {
  const statusContainer = document.getElementById('couple-status-container');
  if (!statusContainer) return;

  if (!partnerData) {
    statusContainer.innerHTML = `
      <div style="text-align: center; padding: 14px 6px;">
        <p style="font-size: 1.05rem; margin-bottom: 12px; color: var(--pencil);">Vocês ainda não vincularam os gatinhos!</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="action-btn" style="justify-content: center;" onclick="copyMyDNACode()">📋 Copiar Meu Código DNA</button>
          <button class="action-btn" style="justify-content: center;" onclick="promptPartnerCode()">📥 Inserir Código Dela</button>
          <button class="action-btn" style="justify-content: center; background: #faede1;" onclick="startNFCSharing()">📲 Conectar por Toque NFC</button>
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
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="copyMyDNACode()">📋 Atualizar Meu Código</button>
        <button class="action-btn" style="flex: 1; font-size: 0.8rem; justify-content: center;" onclick="promptPartnerCode()">🔄 Atualizar Código Dela</button>
      </div>
    </div>
  `;

  renderMiniCatInside('couple-my-cat-preview', {
    breed: activeBreed, eyeColor: activeEyeColor, pupil: activePupil, mouth: activeMouth, expr: activeExpr, equipped: equippedItems, itemColors: itemColors
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

  // Ajusta cores e pelagens do clone
  const tail = clone.querySelector('#cat-tail');
  const body = clone.querySelector('#cat-body');
  const head = clone.querySelector('#cat-head-normal');
  const eyeL = clone.querySelector('#eye-bg-left');
  const eyeR = clone.querySelector('#eye-bg-right');

  if (eyeL) eyeL.setAttribute('fill', catAttrs.eyeColor || '#2b2725');
  if (eyeR) eyeR.setAttribute('fill', catAttrs.eyeColor || '#2b2725');

  // Aplica pelagem
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
  } else if (catAttrs.breed === 'breed_orange') {
    if (body) body.setAttribute('fill', '#e58e45');
    if (head) head.setAttribute('fill', '#e58e45');
    if (tail) tail.setAttribute('fill', '#e58e45');
    const o = clone.querySelector('#breed-orange');
    const bo = clone.querySelector('#body-orange');
    if (o) o.style.display = 'block';
    if (bo) bo.style.display = 'block';
  }

  // Acessórios
  ['bowtie', 'glasses', 'flower', 'crown'].forEach(acc => {
    const el = clone.querySelector('#cosmetic-' + acc);
    if (el) el.style.display = (catAttrs.equipped && catAttrs.equipped.includes(acc)) ? 'block' : 'none';
  });

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
