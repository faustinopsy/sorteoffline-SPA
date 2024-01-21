let deferredPrompt; 
let setupButton;
history.pushState(null, document.title, location.href);

document.addEventListener('DOMContentLoaded', () => {
    //if (!isMobileDevice()) {
        mostrarModalNaoFechavel();
    //}
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
        console.log('Rodando serviÃ§o: ' + serviceWorker);
      })
      .catch(error => {
        console.log('Error registering the Service Worker: ' + error);
      });
  }
  function registerNotification() {
      Notification.requestPermission(permission => {
          if (permission === 'granted'){ registerBackgroundSync() }
          else console.error("Sem permissÃ£o.")
      })
  }
  function registerBackgroundSync() {
      if (!navigator.serviceWorker){
          return console.error("ServiÃ§o nÃ£o suportado")
      }
      navigator.serviceWorker.ready
      .then(registration => registration.sync.register('syncAttendees'))
      .then(() => console.log("Registered background sync"))
      .catch(err => console.error("Error registering background sync", err))
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installModal = document.createElement('div');
    installModal.setAttribute('id', 'installModal');
    installModal.innerHTML = `
        <div class="app-footer">
            <h2>Instalar Aplicativo</h2>
            <p>Quer instalar para uma experiência completa?</p>
            <button id="installBtn" class="button4">Instalar</button>
            <button id="cancelInstallBtn" class="button4">Cancelar</button>
        </div>
    `;
    document.body.appendChild(installModal);

    installModal.style.display = 'block';
    document.getElementById('installBtn').addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('UsuÃ¡rio aceitou a instalaÃ§Ã£o do PWA');
            } else {
                console.log('UsuÃ¡rio recusou a instalaÃ§Ã£o do PWA');
            }
            deferredPrompt = null;
            installModal.style.display = 'none';
        });
    });

    document.getElementById('cancelInstallBtn').addEventListener('click', () => {
        installModal.style.display = 'none';
    });
});

  function installApp() {
      deferredPrompt.prompt();
      setupButton.disabled = true;
      deferredPrompt.userChoice
          .then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                  console.log('PWA setup accepted');
                  setupButton.style.display = 'none';
              } else {
                  console.log('PWA setup rejected');
              }
              deferredPrompt = null;
          });
  }
  window.addEventListener('appinstalled', (evt) => {
      console.log("appinstalled fired", evt);
  });
  


