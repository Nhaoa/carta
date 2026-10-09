/* =========================================================
   VISUAL DO GATO, EXPRESSÕES, CARINHO E COSMÉTICOS
========================================================= */

function updateCatVisualExpression() {
  const wrapper = document.getElementById('cat-wrapper');
  const sleepyEyelids = document.getElementById('sleepy-eyelids');
  const mouthSad = document.getElementById('mouth-sad');
  const mouthHungry = document.getElementById('mouth-hungry');
  const happyBlush = document.getElementById('happy-blush');
  const sickMark = document.getElementById('sick-mark');

  if (wrapper) wrapper.classList.remove('sick', 'sleepy');
  if (sleepyEyelids) sleepyEyelids.style.display = 'none';
  if (mouthSad) mouthSad.style.display = 'none';
  if (mouthHungry) mouthHungry.style.display = 'none';
  if (happyBlush) happyBlush.style.display = 'none';
  if (sickMark) sickMark.style.display = 'none';

  if (catStats.health < 35) {
    if (wrapper) wrapper.classList.add('sick');
    if (sickMark) sickMark.style.display = 'block';
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (catStats.energy < 35) {
    if (wrapper) wrapper.classList.add('sleepy');
    if (sleepyEyelids) sleepyEyelids.style.display = 'block';
    return;
  }
  if (catStats.hunger < 30) {
    if (mouthHungry) mouthHungry.style.display = 'block';
    return;
  }
  if (catStats.happiness < 35) {
    if (mouthSad) mouthSad.style.display = 'block';
    return;
  }
  if (catStats.hunger >= 70 && catStats.energy >= 70 && catStats.happiness >= 70 && catStats.health >= 70) {
    if (happyBlush) happyBlush.style.display = 'block';
  }
}

function applyBreeds() {
  const bodyPath = document.getElementById('cat-body');
  const headNormal = document.getElementById('cat-head-normal');
  const headAirplane = document.getElementById('cat-head-airplane');
  const tailPath = document.getElementById('cat-tail');
  const tailStripes = document.getElementById('tail-stripes');

  ['breed-siamese', 'breed-tuxedo', 'breed-orange', 'body-tuxedo', 'body-orange'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  if (tailStripes) tailStripes.style.display = 'none';

  if (bodyPath && headNormal && headAirplane && tailPath) {
    bodyPath.setAttribute('fill', '#fffdf9');
    headNormal.setAttribute('fill', '#fffdf9');
    headAirplane.setAttribute('fill', '#fffdf9');
    tailPath.setAttribute('fill', '#fffdf9');
    tailPath.setAttribute('stroke', '#2b2725');
  }

  if (activeBreed === 'breed_siamese') {
    if (bodyPath && headNormal && headAirplane && tailPath) {
      bodyPath.setAttribute('fill', '#ebdcc9');
      headNormal.setAttribute('fill', '#ebdcc9');
      headAirplane.setAttribute('fill', '#ebdcc9');
      tailPath.setAttribute('fill', '#3d281d');
      tailPath.setAttribute('stroke', '#2b2725');
    }
    const breedEl = document.getElementById('breed-siamese');
    if (breedEl) breedEl.style.display = 'block';
  } else if (activeBreed === 'breed_tuxedo') {
    if (bodyPath && headNormal && headAirplane && tailPath) {
      bodyPath.setAttribute('fill', '#fffdf9');
      headNormal.setAttribute('fill', '#fffdf9');
      headAirplane.setAttribute('fill', '#fffdf9');
      tailPath.setAttribute('fill', '#2b2725');
      tailPath.setAttribute('stroke', '#2b2725');
    }
    const breedEl = document.getElementById('breed-tuxedo');
    const bodyTuxEl = document.getElementById('body-tuxedo');
    if (breedEl) breedEl.style.display = 'block';
    if (bodyTuxEl) bodyTuxEl.style.display = 'block';
  } else if (activeBreed === 'breed_orange') {
    if (bodyPath && headNormal && headAirplane && tailPath) {
      bodyPath.setAttribute('fill', '#e58e45');
      headNormal.setAttribute('fill', '#e58e45');
      headAirplane.setAttribute('fill', '#e58e45');
      tailPath.setAttribute('fill', '#e58e45');
      tailPath.setAttribute('stroke', '#b3581d');
    }
    if (tailStripes) tailStripes.style.display = 'block';
    const breedEl = document.getElementById('breed-orange');
    const bodyOraEl = document.getElementById('body-orange');
    if (breedEl) breedEl.style.display = 'block';
    if (bodyOraEl) bodyOraEl.style.display = 'block';
  }
}

function applyMouthAndExpressions() {
  ['mouth-cat-path', 'mouth-tongue-path', 'mouth-vampire-path', 'mouth-smile-path'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const mouthMap = {
    'mouth_cat': 'mouth-cat-path',
    'mouth_tongue': 'mouth-tongue-path',
    'mouth_vampire': 'mouth-vampire-path',
    'mouth_smile': 'mouth-smile-path'
  };

  const selectedMouthId = mouthMap[activeMouth] || 'mouth-cat-path';
  const activeMouthEl = document.getElementById(selectedMouthId);
  if (activeMouthEl) activeMouthEl.style.display = 'block';

  const headNormal = document.getElementById('cat-head-normal');
  const headAirplane = document.getElementById('cat-head-airplane');
  const headClipPath = document.getElementById('cat-head-clip-path');

  if (activeExpr === 'expr_airplane') {
    if (headNormal) headNormal.style.display = 'none';
    if (headAirplane) headAirplane.style.display = 'block';
    if (headClipPath && headAirplane) headClipPath.setAttribute('d', headAirplane.getAttribute('d'));
  } else {
    if (headNormal) headNormal.style.display = 'block';
    if (headAirplane) headAirplane.style.display = 'none';
    if (headClipPath && headNormal) headClipPath.setAttribute('d', headNormal.getAttribute('d'));
  }

  const detEl = document.getElementById('expr-determined-brows');
  if (detEl) detEl.style.display = (activeExpr === 'expr_determined') ? 'block' : 'none';

  const animeSparkleL = document.getElementById('anime-sparkle-left');
  const animeSparkleR = document.getElementById('anime-sparkle-right');
  const isAnime = (activeExpr === 'expr_anime');
  if (animeSparkleL) animeSparkleL.style.display = isAnime ? 'block' : 'none';
  if (animeSparkleR) animeSparkleR.style.display = isAnime ? 'block' : 'none';
}

function applyEyeColorAndPupils() {
  const leftEye = document.getElementById('eye-bg-left');
  const rightEye = document.getElementById('eye-bg-right');
  if (leftEye) leftEye.setAttribute('fill', activeEyeColor);
  if (rightEye) rightEye.setAttribute('fill', activeEyeColor);

  ['pupil-normal', 'pupil-slit', 'pupil-sparkle'].forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(el => el.style.display = 'none');
  });

  if (activePupil === 'pupil_slit') {
    document.querySelectorAll('.pupil-slit').forEach(el => el.style.display = 'block');
  } else if (activePupil === 'pupil_sparkle') {
    document.querySelectorAll('.pupil-sparkle').forEach(el => el.style.display = 'block');
  } else {
    document.querySelectorAll('.pupil-normal').forEach(el => el.style.display = 'block');
  }
}

function applyEquippedCosmetics() {
  ['bowtie', 'glasses', 'flower', 'crown'].forEach(id => {
    const el = document.getElementById(`cosmetic-${id}`);
    if (el) el.style.display = equippedItems.includes(id) ? 'block' : 'none';
  });

  const bowtieLeft = document.getElementById('bowtie-left');
  const bowtieRight = document.getElementById('bowtie-right');
  if (bowtieLeft && bowtieRight) {
    const c = itemColors['bowtie'] || '#2b2725';
    bowtieLeft.setAttribute('fill', c);
    bowtieRight.setAttribute('fill', c);
  }

  const glassesLeft = document.getElementById('glasses-left');
  const glassesRight = document.getElementById('glasses-right');
  const glassesBridge = document.getElementById('glasses-bridge');
  const glassesLegLeft = document.getElementById('glasses-leg-left');
  const glassesLegRight = document.getElementById('glasses-leg-right');
  if (glassesLeft && glassesRight) {
    const c = itemColors['glasses'] || '#2b2725';
    glassesLeft.setAttribute('stroke', c);
    glassesRight.setAttribute('stroke', c);
    if (glassesBridge) glassesBridge.setAttribute('stroke', c);
    if (glassesLegLeft) glassesLegLeft.setAttribute('stroke', c);
    if (glassesLegRight) glassesLegRight.setAttribute('stroke', c);
  }

  const flowerCenter = document.getElementById('flower-center');
  if (flowerCenter) flowerCenter.setAttribute('fill', itemColors['flower'] || '#c48b36');

  const crownBody = document.getElementById('crown-body');
  if (crownBody) crownBody.setAttribute('fill', itemColors['crown'] || '#ecd29b');
}

let petTimeout = null;
function petTheCat(event) {
  if (event) event.stopPropagation();
  playMeowSound();

  catStats.happiness = Math.min(100, catStats.happiness + 4);
  catStats.health = Math.min(100, catStats.health + 1);
  saveStats();

  const regEyes = document.getElementById('regular-eyes');
  const hapEyes = document.getElementById('happy-eyes');
  const wrapper = document.getElementById('cat-wrapper');

  if (regEyes) regEyes.style.display = 'none';
  if (hapEyes) hapEyes.style.display = 'block';
  if (wrapper) wrapper.classList.add('petting');

  const rect = document.getElementById('cat-wrapper').getBoundingClientRect();
  createFloatingParticles(rect.left + rect.width / 2, rect.top + 50, 6);

  clearTimeout(petTimeout);
  petTimeout = setTimeout(() => {
    if (regEyes) regEyes.style.display = 'block';
    if (hapEyes) hapEyes.style.display = 'none';
    if (wrapper) wrapper.classList.remove('petting');
    updateCatVisualExpression();
  }, 1000);
}

function handleCatClick(e) {
  const letterGroup = document.getElementById('cat-letter-group');
  if (letterGroup && letterGroup.style.display !== 'none') {
    openLetter(e);
  } else {
    petTheCat(e);
  }
}
