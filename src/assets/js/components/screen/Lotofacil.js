export default class LotoFacilScreen {
    constructor(navigateCallback,lang) {
        this.navigateCallback = navigateCallback;
        this.menuItems = [
            { href: "conferefacil", icon: "assets/img/conf.png", text: "CONFERIR", id: "1-0" },
            { href: "listafacil", icon: "assets/img/list.png", text: "LISTAR", id: "1-1" },
            { href: "cadfacil", icon: "assets/img/cad.png", text: "CADASTRAR", id: "0-2" },
            { href: "combinacoesFacil", icon: "assets/img/combina.png", text: "COMBINACAO", id: "0-2" },
            { href: "lotofacilpares", icon: "assets/img/atual.png", text: "ATUAL", id: "0-2" },
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
            cabecalho.style.background = 'linear-gradient(to bottom, rgb(0 0 0), #c44bbc, rgb(194 71 187))'; 
            cabecalho.style.boxShadow = '0 36px 36px 56px rgb(199 86 194)'; 
        }
    }
    render() {
        document.getElementById('titulo').innerHTML='Lotofácil';
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

