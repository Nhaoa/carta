/* =========================================================
   APP INICIALIZAÇÃO E NAVEGAÇÃO
========================================================= */

window.toggleSideNav = function() {
  const sideNav = document.getElementById('side-nav-container');
  const arrow = document.getElementById('side-nav-arrow');
  if (!sideNav) return;
  const isCollapsed = sideNav.classList.toggle('collapsed');
  if (arrow) arrow.innerText = isCollapsed ? '▶' : '◀';
};

window.toggleStatusVisibility = function() {
  const statusContainer = document.getElementById('status-container');
  const arrow = document.getElementById('status-arrow-icon');
  if (!statusContainer) return;
  const isHidden = statusContainer.classList.toggle('hidden');
  if (arrow) arrow.innerText = isHidden ? '▼' : '▲';
};

window.openWalletModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.add('open');
};

window.closeWalletModal = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('wallet-modal');
  if (modal) modal.classList.remove('open');
};

window.openChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.add('open');
};

window.closeChangelog = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('changelog-modal');
  if (modal) modal.classList.remove('open');
};

window.openLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  const content = document.getElementById('letter-content');
  if (content) content.innerText = 'Para a pessoa mais especial do mundo: \n\nObrigado por estar sempre comigo! 💖🐾';
  if (modal) modal.classList.add('open');
};

window.closeLetter = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('letter-modal');
  if (modal) modal.classList.remove('open');
};

window.openShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (modal) modal.classList.add('open');
};

window.closeShop = function(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('shop-modal');
  if (modal) modal.classList.remove('open');
};

window.handleNavClick = function(index, callback, event) {
  if (event) event.stopPropagation();
  const navButtons = document.querySelectorAll('.bottom-nav-bar .bottom-nav-btn');
  navButtons.forEach((btn, i) => {
    if (i === index) btn.classList.add('active-focus');
    else btn.classList.remove('active-focus');
  });

  if (typeof callback === 'function') callback(event);
};

window.toggleAutoTime = function() {
  document.body.classList.toggle('time-night');
};

window.addEventListener('DOMContentLoaded', () => {
  window.loadStats();
  window.initFXCanvas();
  window.renderCatAppearence();
  window.renderPartnerCatStage();
});
