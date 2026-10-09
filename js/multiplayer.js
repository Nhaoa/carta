/* =========================================================
   CONEXÃO MULTIPLAYER EM TEMPO REAL (PEERJS / WEBRTC)
========================================================= */

let peer = null;
let activeConnection = null;
let myPeerId = localStorage.getItem('cat_my_peer_id') || null;

// Inicializa o PeerJS com um identificador único estável
function initMultiplayerPeer() {
  if (!myPeerId) {
    myPeerId = 'cat_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('cat_my_peer_id', myPeerId);
  }

  peer = new Peer(myPeerId);

  peer.on('open', (id) => {
    console.log('📡 Meu ID PeerJS:', id);
    // Se já temos o parceiro vinculado, tenta conectar automaticamente
    if (partnerData && partnerData.peerId) {
      connectToPartnerPeer(partnerData.peerId);
    }
  });

  // Ouve conexões de entrada (quando a parceira conecta no seu ID)
  peer.on('connection', (conn) => {
    setupConnectionHandlers(conn);
  });

  peer.on('error', (err) => {
    console.warn('Erro PeerJS:', err);
  });
}

// Conectar ao Peer da parceira
function connectToPartnerPeer(targetId) {
  if (!peer || activeConnection) return;
  const conn = peer.connect(targetId);
  setupConnectionHandlers(conn);
}

// Configura troca de mensagens em tempo real
function setupConnectionHandlers(conn) {
  conn.on('open', () => {
    activeConnection = conn;
    console.log('💚 Conectado diretamente com a parceira!');
    updateOnlineBadge(true);

    // Se ainda não tínhamos o peerId dela gravado, guarda
    if (partnerData && !partnerData.peerId) {
      partnerData.peerId = conn.peer;
      localStorage.setItem('cat_partner_data', JSON.stringify(partnerData));
    }
  });

  conn.on('data', (data) => {
    handleIncomingMultiplayerData(data);
  });

  conn.on('close', () => {
    activeConnection = null;
    updateOnlineBadge(false);
  });
}

// Trata os eventos recebidos do parceiro em tempo real
function handleIncomingMultiplayerData(data) {
  if (data.type === 'CARINHO') {
    triggerReceivedRemotePet();
  }
}

// Envia dados para o parceiro
function sendMultiplayerPacket(payload) {
  if (activeConnection && activeConnection.open) {
    activeConnection.send(payload);
    return true;
  }
  return false;
}

// Atualiza o indicador visual de conexão na aba do casal
function updateOnlineBadge(isOnline) {
  const badge = document.getElementById('couple-online-indicator');
  if (badge) {
    badge.innerText = isOnline ? '🟢 Ao Vivo Juntos' : '⚪ Desconectado';
    badge.style.color = isOnline ? '#27ae60' : '#888';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initMultiplayerPeer();
});
