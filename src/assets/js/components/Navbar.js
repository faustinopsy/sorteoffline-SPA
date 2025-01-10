export default class Navbar {
    constructor(navigateCallback, menuItems) {
        this.navigateCallback = navigateCallback;
        this.menuItems = menuItems || [];
    }
    init() {
        const navbarElement = document.getElementById('navbar');
        if (!navbarElement) return; 
    
        let lastScrollTop = 0;
    
        window.addEventListener("scroll", function() {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > lastScrollTop) {
                navbarElement.style.bottom = "-80px"; 
            } else {
                navbarElement.style.bottom = "0"; 
            }
            lastScrollTop = currentScroll;
        }, false);
    }
    
    render() {
        const navbarElement = document.createElement('header');
        navbarElement.id = 'navbar';
        const menuItems = ['L', 'M', 'M','Q'];

        this.menuItems.forEach(item => {
            const linkElement = document.createElement('a');
            linkElement.href = '#';
            linkElement.className = 'btn';
            //linkElement.textContent = item.charAt(0).toUpperCase() + item.slice(1); 
            const icon = document.createElement('img');
            icon.className = 'icon';
            icon.src = item.icon;

            linkElement.dataset.link = item.text;
            linkElement.addEventListener('click', (event) => this.onNavigate(event, item.text));
            linkElement.appendChild(icon);
            navbarElement.appendChild(linkElement);
        });

        return navbarElement;
    }

    onNavigate(event, link) {
        event.preventDefault();
        this.navigateCallback(link);
    }

    toggleHamburgerMenu() {
        const navbarElement = document.querySelector('.navbar');
        navbarElement.classList.toggle('responsive');
    }
    update() {
        const navbarElement = this.render();
        document.body.replaceChild(navbarElement, document.querySelector('header'));
    }
    
}
