export default class MenuGenerator {
    constructor(navigateCallback,lang) {
        this.navigateCallback = navigateCallback;
        this.menuItems = [
            { href: "facil", icon: "assets/img/lotofacil.png", text: "LOTOFACIL", id: "1-0" },
            { href: "mega", icon: "assets/img/megasena.png", text: "MEGASENA", id: "1-1" },
            { href: "quina", icon: "assets/img/quina.png", text: "QUINA", id: "0-2" },
            { href: "mania", icon: "assets/img/lotomania.png", text: "LOTOMANIA", id: "0-0" }
        ];
        this.userLanguage = lang; 
        this.loadLanguage();
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
    render() {
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
