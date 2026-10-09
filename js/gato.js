/* =========================================================
   COMPORTAMENTO, EXPRESSÕES E VISUAL COMPLETO DO GATINHO
========================================================= */

window.activeBreed = localStorage.getItem('cat_breed') || 'breed_white';
window.activeEyeColor = localStorage.getItem('cat_eyecolor') || '#2b2725';
window.activePupil = localStorage.getItem('cat_pupil') || 'pupil_normal';
window.activeMouth = localStorage.getItem('cat_mouth') || 'mouth_cat';
window.activeExpr = localStorage.getItem('cat_expr') || 'none';
window.equippedItems = JSON.parse(localStorage.getItem('cat_equipped') || '[]');
window.itemColors = JSON.parse(localStorage.getItem('cat_item_colors') || '{}');

window.handleCatClick = function(e) {
  if (e) e.stopPropagation();
  window.catStats.happiness = Math.min(100, window.catStats.happiness + 4);
  window.saveStats();
  if (typeof window.playMeowSound === 'function') window.playMeowSound();
  
  const rect = document.getElementById('cat-wrapper').getBoundingClientRect();
  if (typeof window.createFloatingParticles === 'function') {
    window.createFloatingParticles(rect.left + rect.width / 2, rect.top + 40, 8);
  }

  const wrapper = document.getElementById('cat-wrapper');
  if (wrapper) {
    wrapper.classList.add('petting');
    setTimeout(() => wrapper.classList.remove('petting'), 400);
  }

  window.openLetter();
};

window.renderCatAppearence = function() {
  const svg = document.getElementById('main-cat-svg');
  if (!svg) return;

  // 1. Olhos e Cor
  const eyeL = svg.querySelector('#eye-bg-left');
  const eyeR = svg.querySelector('#eye-bg-right');
  if (eyeL) eyeL.setAttribute('fill', window.activeEyeColor);
  if (eyeR) eyeR.setAttribute('fill', window.activeEyeColor);

  // 2. Pupilas
  const isNormalPupil = window.activePupil === 'pupil_normal';
  const isSlitPupil = window.activePupil === 'pupil_slit';
  const isSparklePupil = window.activePupil === 'pupil_sparkle';
  const isAnimePupil = window.activePupil === 'pupil_anime';

  svg.querySelectorAll('.pupil-normal').forEach(el => el.style.display = isNormalPupil ? 'block' : 'none');
  svg.querySelectorAll('.pupil-slit').forEach(el => el.style.display = isSlitPupil ? 'block' : 'none');
  svg.querySelectorAll('.pupil-sparkle').forEach(el => el.style.display = isSparklePupil ? 'block' : 'none');
  
  const animeL = svg.querySelector('#anime-sparkle-left');
  const animeR = svg.querySelector('#anime-sparkle-right');
  if (animeL) animeL.style.display = isAnimePupil ? 'block' : 'none';
  if (animeR) animeR.style.display = isAnimePupil ? 'block' : 'none';

  // 3. Raças e Pelagens
  const body = svg.querySelector('#cat-body');
  const head = svg.querySelector('#cat-head-normal');
  const tail = svg.querySelector('#cat-tail');
  const tailStripes = svg.querySelector('#tail-stripes');

  // Reset base
  if (body) body.setAttribute('fill', '#fffdf9');
  if (head) head.setAttribute('fill', '#fffdf9');
  if (tail) {
    tail.setAttribute('fill', '#fffdf9');
    tail.setAttribute('stroke', '#2b2725');
  }
  if (tailStripes) tailStripes.style.display = 'none';

  ['breed-siamese', 'breed-tuxedo', 'breed-orange', 'body-tuxedo', 'body-orange'].forEach(id => {
    const el = svg.querySelector('#' + id);
    if (el) el.style.display = 'none';
  });

  if (window.activeBreed === 'breed_siamese') {
    if (body) body.setAttribute('fill', '#ebdcc9');
    if (head) head.setAttribute('fill', '#ebdcc9');
    if (tail) tail.setAttribute('fill', '#3d281d');
    const s = svg.querySelector('#breed-siamese');
    if (s) s.style.display = 'block';
  } else if (window.activeBreed === 'breed_tuxedo') {
    if (tail) tail.setAttribute('fill', '#2b2725');
    const tH = svg.querySelector('#breed-tuxedo');
    const tB = svg.querySelector('#body-tuxedo');
    if (tH) tH.style.display = 'block';
    if (tB) tB.style.display = 'block';
  } else if (window.activeBreed === 'breed_orange') {
    if (body) body.setAttribute('fill', '#e58e45');
    if (head) head.setAttribute('fill', '#e58e45');
    if (tail) {
      tail.setAttribute('fill', '#e58e45');
      tail.setAttribute('stroke', '#b3581d');
    }
    if (tailStripes) tailStripes.style.display = 'block';
    const oH = svg.querySelector('#breed-orange');
    const oB = svg.querySelector('#body-orange');
    if (oH) oH.style.display = 'block';
    if (oB) oB.style.display = 'block';
  }

  // 4. Expressões e Bocas
  window.applyMouthAndExpressions();

  // 5. Acessórios e Cores Customizadas
  ['bowtie', 'glasses', 'flower', 'crown'].forEach(acc => {
    const el = svg.querySelector('#cosmetic-' + acc);
    if (el) el.style.display = window.equippedItems.includes(acc) ? 'block' : 'none';
  });

  const bL = svg.querySelector('#bowtie-left');
  const bR = svg.querySelector('#bowtie-right');
  if (bL && bR && window.itemColors['bowtie']) {
    bL.setAttribute('fill', window.itemColors['bowtie']);
    bR.setAttribute('fill', window.itemColors['bowtie']);
  }

  const gL = svg.querySelector('#glasses-left');
  const gR = svg.querySelector('#glasses-right');
  const gB = svg.querySelector('#glasses-bridge');
  if (gL && gR && window.itemColors['glasses']) {
    gL.setAttribute('stroke', window.itemColors['glasses']);
    gR.setAttribute('stroke', window.itemColors['glasses']);
    if (gB) gB.setAttribute('stroke', window.itemColors['glasses']);
  }

  const fC = svg.querySelector('#flower-center');
  if (fC && window.itemColors['flower']) fC.setAttribute('fill', window.itemColors['flower']);

  const cB = svg.querySelector('#crown-body');
  if (cB && window.itemColors['crown']) cB.setAttribute('fill', window.itemColors['crown']);
};

window.applyMouthAndExpressions = function() {
  const svg = document.getElementById('main-cat-svg');
  if (!svg) return;

  const mCat = svg.querySelector('#mouth-cat-path');
  const mTongue = svg.querySelector('#mouth-tongue-path');
  const mVamp = svg.querySelector('#mouth-vampire-path');
  const mSmile = svg.querySelector('#mouth-smile-path');

  if (mCat) mCat.style.display = window.activeMouth === 'mouth_cat' ? 'block' : 'none';
  if (mTongue) mTongue.style.display = window.activeMouth === 'mouth_tongue' ? 'block' : 'none';
  if (mVamp) mVamp.style.display = window.activeMouth === 'mouth_vampire' ? 'block' : 'none';
  if (mSmile) mSmile.style.display = window.activeMouth === 'mouth_smile' ? 'block' : 'none';

  // Expressões especiais (Determinado, Orelha de Avião)
  const brows = svg.querySelector('#expr-determined-brows');
  if (brows) brows.style.display = window.activeExpr === 'expr_determined' ? 'block' : 'none';

  const normalHead = svg.querySelector('#cat-head-normal');
  const airplaneHead = svg.querySelector('#cat-head-airplane');
  if (normalHead && airplaneHead) {
    if (window.activeExpr === 'expr_airplane') {
      normalHead.style.display = 'none';
      airplaneHead.style.display = 'block';
    } else {
      normalHead.style.display = 'block';
      airplaneHead.style.display = 'none';
    }
  }

  // Reações por Necessidades Vitais
  const mSad = svg.querySelector('#mouth-sad');
  const mHungry = svg.querySelector('#mouth-hungry');
  const sleepy = svg.querySelector('#sleepy-eyelids');
  const sick = svg.querySelector('#sick-mark');
  const blush = svg.querySelector('#happy-blush');

  if (mSad) mSad.style.display = 'none';
  if (mHungry) mHungry.style.display = 'none';
  if (sleepy) sleepy.style.display = 'none';
  if (sick) sick.style.display = 'none';
  if (blush) blush.style.display = 'none';

  if (window.catStats.health < 35) {
    if (sick) sick.style.display = 'block';
    if (mSad) mSad.style.display = 'block';
  } else if (window.catStats.energy < 30) {
    if (sleepy) sleepy.style.display = 'block';
  } else if (window.catStats.hunger < 30) {
    if (mHungry) mHungry.style.display = 'block';
  } else if (window.catStats.happiness >= 75) {
    if (blush) blush.style.display = 'block';
  }
};
