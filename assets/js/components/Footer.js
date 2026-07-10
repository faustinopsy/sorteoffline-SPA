/**
 * Footer.js — Rodapé institucional com links legais.
 * Deve ser inserido ao final de cada tela de conteúdo.
 */
export default class Footer {
    constructor(navigateCallback) {
        this.navigate = navigateCallback;
    }

    render() {
        const footer = document.createElement('footer');
        footer.className = 'app-footer';
        footer.setAttribute('role', 'contentinfo');

        const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

        footer.innerHTML = `
            <p class="app-footer__disclaimer">
                ${infoIcon} Ferramenta educacional e matemática · Aposte com responsabilidade
            </p>
            <nav class="app-footer__links" aria-label="Links institucionais">
                <a href="#" data-nav="about"       class="app-footer__link">Sobre</a>
                <span class="app-footer__sep" aria-hidden="true">·</span>
                <a href="#" data-nav="privacidade" class="app-footer__link">Privacidade</a>
                <span class="app-footer__sep" aria-hidden="true">·</span>
                <a href="#" data-nav="politicas"   class="app-footer__link">Termos</a>
                <span class="app-footer__sep" aria-hidden="true">·</span>
                <a href="#" data-nav="contato"     class="app-footer__link">Contato</a>
                <span class="app-footer__sep" aria-hidden="true">·</span>
                <a href="#" data-nav="blog"        class="app-footer__link">Blog</a>
            </nav>
            <p class="app-footer__copy">© ${new Date().getFullYear()} LMania · Desenvolvido por Rodrigo Faustino</p>
        `;

        // Delegação de eventos nos links data-nav
        footer.addEventListener('click', e => {
            const link = e.target.closest('[data-nav]');
            if (link && this.navigate) {
                e.preventDefault();
                this.navigate(link.dataset.nav);
            }
        });

        return footer;
    }
}
