export default class AboutScreen {
    constructor(lang) {
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
            cabecalho.style.background = 'linear-gradient(rgb(0, 0, 0), rgb(68, 131, 88), rgb(94, 194, 127))'; 
            cabecalho.style.boxShadow = 'rgb(82 195 119) 0px 36px 36px 56px'; 
        }
    }
    render() {
        document.getElementById('titulo').innerHTML='About';
        const menuContainer = document.createElement('div');
        menuContainer.className = 'main';
        
        const mContainer = document.createElement('div');
        mContainer.className = 'container';
        mContainer.style.height='600px';

        const aboutContent = document.createElement('div');
        aboutContent.className = 'about-container';
        aboutContent.innerHTML = `
            <h1 data-i18n="aboutTitle">About the App</h1>
            <p data-i18n="aboutDescription">This application is a powerful tool for lottery enthusiasts...</p>
            <h2 data-i18n="technologiesUsed">Technologies Used:</h2>
            <ul>
                <li data-i18n="techHTMLCSS">HTML5 & CSS3 for layout and styling</li>
                <li data-i18n="techJavaScript">JavaScript for interactivity</li>
                <li data-i18n="techLocalStorage">LocalStorage API for data persistence</li>
            </ul>
            <h2 data-i18n="features">Features:</h2>
            <ul>
                <li data-i18n="featureGenerate">Generate lottery number combinations</li>
                <li data-i18n="featureSaveManage">Save and manage favorite combinations</li>
                <li data-i18n="featureAnalyze">Analyze past lottery results</li>
                <li data-i18n="featureCustomizeUI">Customizable user interface based on language preferences</li>
            </ul>
            <p data-i18n="closingRemark">Our application is designed to enhance your lottery experience...</p>
        `;

        this.loadLanguage();
        mContainer.appendChild(aboutContent);
        menuContainer.appendChild(mContainer);
        return {
            element: menuContainer
        };
    }
}

