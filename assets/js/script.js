let deferredPrompt; 
let setupButton;
history.pushState(null, document.title, location.href);
window.addEventListener('popstate', function(event) {
    if (!isIndexPage()) {
        window.location.href = "/index.html";
    } else {
        var resultado = confirm("Deseja fechar o aplicativo?");
        if (resultado) {
           window.close();
        } else {
            history.pushState(null, document.title, location.href);
        }
    }
});
function isIndexPage() {
    if(location.pathname === "/index.html" || location.pathname === "/"){
        return true;
    }
}
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
    modal.style.backdropFilter= 'blur(15px)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.innerHTML = `
    <h2>🚀 Embarque na Aventura!</h2>
    <p>Olá, esse app é para você gerenciar seus jogos de loteria.</p>
    <p> Todos os talões são armazenados localmente no seu navegador!</p>
    <p>Espero que goste, feito de um jogador, para jogadores.</p> 

`;
    modal.appendChild(modalContent);
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
                console.log('Usuário aceitou a instalação do PWA');
            } else {
                console.log('Usuário recusou a instalação do PWA');
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
  