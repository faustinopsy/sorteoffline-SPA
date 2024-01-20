export default class QuinaScreen {
  constructor(navigateCallback,lang) {
      this.navigateCallback = navigateCallback;
      this.menuItems = [
          { href: "conferir", icon: "assets/img/conf.png", text: "CONFERIR", id: "1-0" },
          { href: "listar", icon: "assets/img/list.png", text: "LISTAR", id: "1-1" },
          { href: "cadastrar", icon: "assets/img/cad.png", text: "CADASTRAR", id: "0-2" },
      ];
      this.userLanguage = lang; 
      this.loadLanguage();
      this.init();
  }
  loadLanguage() {
      this.userLanguage = this.userLanguage.split('-')[0];
      fetch(`assets/js/lang/${this.userLanguage}.json`)
          .then(response => response.json())
          .then(translations => {
              document.querySelectorAll("[data-i18n]").forEach(elem => {
                  const key = elem.getAttribute("data-i18n");
                  elem.textContent = translations[key];
              });
          });
  }

  init() {
    this.atualizaEstiloCabecalho();
  }

  atualizaEstiloCabecalho() {
      const cabecalho = document.querySelector('.app-header');
      if (cabecalho) {
          cabecalho.style.background = 'linear-gradient(rgb(0, 0, 0), rgb(63 98 230), rgb(47 118 200))'; 
          cabecalho.style.boxShadow = 'rgb(47 118 200) 0px 36px 36px 56px'; 
      }
  }
  render() {
      document.getElementById('titulo').innerHTML='Quina';
      const menuContainer = document.createElement('div');
      menuContainer.className = 'main';
      menuContainer.classList.add = 'container';
      this.menuItems.forEach(item => {
          const link = document.createElement('a');
          link.href = '#';
          link.onclick = () => this.navigateCallback(item.href);

          const menuItem = document.createElement('div');
          menuItem.className = 'menu__item';
          menuItem.id = item.id;

          const icon = document.createElement('img');
          icon.className = 'menu__icon';
          icon.src = item.icon;

          const menuContent = document.createElement('div');
          menuContent.className = 'menu__content';
          for (let i = 0; i < 2; i++) {
              const span = document.createElement('span');
              span.className = 'menu__span';
              menuContent.appendChild(span);
          }

          menuItem.appendChild(icon);
          menuItem.appendChild(menuContent);
          link.appendChild(menuItem);

          const textSpan = document.createElement('span');
          textSpan.setAttribute('data-i18n', item.text);
          link.appendChild(textSpan);

          menuContainer.appendChild(link);
      });

      const currentDiv = document.createElement('div');
      currentDiv.className = 'is-active';
      currentDiv.id = 'current';
      menuContainer.appendChild(currentDiv);
      return {
          element: menuContainer
      };
  }
}

