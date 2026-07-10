let deferredPrompt; 
let setupButton;
history.pushState(null, document.title, location.href);

document.addEventListener('DOMContentLoaded', () => {
        const acesso = localStorage.getItem('acesso') ? true : false;
         if(!acesso){
           //mostrarModalNaoFechavel();
           localStorage.setItem('acesso',true)
         }
});

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function mostrarModalNaoFechavel() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.backdropFilter = 'blur(15px)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.position = 'relative';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.background = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };

    modalContent.innerHTML += `
        <h2>🚀 Embarque na Aventura!</h2>
        <p>Olá, esse app é para você gerenciar seus jogos de loteria.</p>
        <p> Todos os talões são armazenados localmente no seu navegador!</p>
        <p>Espero que goste, feito de um jogador, para jogadores.</p> 
    `;

    modal.appendChild(modalContent);
    modalContent.appendChild(closeButton);
    document.body.appendChild(modal);
}


if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then(serviceWorker => {
        console.log('Rodando serviço: ' + serviceWorker);
      })
      .catch(error => {
        console.log('Error registering the Service Worker: ' + error);
      });
  }
  function registerNotification() {
      Notification.requestPermission(permission => {
          if (permission === 'granted'){ registerBackgroundSync() }
          else console.error("Sem permissão.")
      })
  }
  function registerBackgroundSync() {
      if (!navigator.serviceWorker){
          return console.error("Serviço não suportado")
      }
      navigator.serviceWorker.ready
      .then(registration => registration.sync.register('syncAttendees'))
      .then(() => console.log("Registered background sync"))
      .catch(err => console.error("Error registering background sync", err))
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Não mostrar se já instalado ou dispensado recentemente (7 dias)
    if (localStorage.getItem('lmania_installed') === '1') return;
    const dismissed = localStorage.getItem('lmania_install_dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Aguardar 2s para não interromper o carregamento inicial
    setTimeout(showInstallPrompt, 2000);
  });

  function showInstallPrompt() {
    if (document.getElementById('install-prompt')) return;

    const overlay = document.createElement('div');
    overlay.id = 'install-prompt';
    overlay.innerHTML = `
      <div id="install-prompt__backdrop"></div>
      <div id="install-prompt__sheet" role="dialog" aria-modal="true" aria-label="Instalar LMania">
        <div class="ip-handle"></div>
        <div class="ip-icon-wrap">
          <img src="assets/img/logo.png" alt="LMania" class="ip-icon" onerror="this.style.display='none'">
        </div>
        <p class="ip-eyebrow">Aplicativo disponível</p>
        <h2 class="ip-title">Instalar LMania</h2>
        <p class="ip-desc">Adicione à tela inicial para acesso rápido, experiência em tela cheia e uso offline.</p>
        <div class="ip-features">
          <span class="ip-feature"><span class="ip-feature__dot" style="background:#22c55e"></span>Funciona offline</span>
          <span class="ip-feature"><span class="ip-feature__dot" style="background:#3b82f6"></span>Tela cheia</span>
          <span class="ip-feature"><span class="ip-feature__dot" style="background:#f97316"></span>Acesso rápido</span>
        </div>
        <button id="ip-install-btn">Instalar agora</button>
        <button id="ip-dismiss-btn">Agora não</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Animar entrada
    requestAnimationFrame(() => {
      overlay.classList.add('ip-visible');
    });

    function close() {
      overlay.classList.remove('ip-visible');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }

    document.getElementById('ip-install-btn').addEventListener('click', () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(result => {
        if (result.outcome === 'accepted') {
          localStorage.setItem('lmania_installed', '1');
        } else {
          localStorage.setItem('lmania_install_dismissed', String(Date.now()));
        }
        deferredPrompt = null;
        close();
      });
    });

    document.getElementById('ip-dismiss-btn').addEventListener('click', () => {
      localStorage.setItem('lmania_install_dismissed', String(Date.now()));
      close();
    });

    document.getElementById('install-prompt__backdrop').addEventListener('click', () => {
      localStorage.setItem('lmania_install_dismissed', String(Date.now()));
      close();
    });
  }

  window.addEventListener('appinstalled', () => {
    localStorage.setItem('lmania_installed', '1');
    const prompt = document.getElementById('install-prompt');
    if (prompt) prompt.remove();
  });
  


