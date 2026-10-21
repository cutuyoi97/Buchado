/**
 * Header, menú móvil y footer compartidos por todas las páginas.
 * Cada página declara `window.CURRENT_PAGE` antes de cargar este script
 * y coloca los contenedores #site-header-mount / #mobile-nav-mount /
 * #site-footer-mount donde corresponda. Se renderiza de forma síncrona
 * (sin esperar DOMContentLoaded) para evitar parpadeos de layout.
 */

(() => {
    // Nombre oficial centralizado: cualquier cambio futuro solo se hace aquí.
    const INSTITUTION_NAME_FULL = "Institución Educativa Buchadó Fernando Botero Angulo";
    const INSTITUTION_NAME_SHORT = "I.E. Buchadó Fernando Botero Angulo";

    const NAV_ITEMS = [
        { id: "home", href: "/", label: "Inicio", icon: "fa-home" },
        {
            id: "identidad", href: "/pages/identidad.html", label: "Nuestra Identidad", icon: "fa-university",
            children: [
                { href: "/pages/identidad.html#institucional", label: "Información institucional" },
                { href: "/pages/identidad.html#valores", label: "Principios y valores" },
                { href: "/pages/identidad.html#sedes", label: "Sedes educativas" },
            ],
        },
        { id: "docentes", href: "/pages/docentes.html", label: "Personal Docente", icon: "fa-users" },
        {
            id: "eventos", href: "/pages/eventos.html", label: "Eventos y Centros de Interés", icon: "fa-calendar",
            children: [
                { href: "/pages/eventos.html#centros-interes", label: "Centros de interés" },
                { href: "/pages/eventos.html#eventos-grid", label: "Eventos institucionales" },
                { href: "/pages/eventos.html#galeria", label: "Galería" },
            ],
        },
        {
            id: "academica", href: "/pages/academica.html", label: "Información Académica", icon: "fa-graduation-cap",
            children: [
                { href: "/pages/academica.html#pei", label: "Proyecto Educativo Institucional" },
                { href: "/pages/academica.html#calendario", label: "Calendario institucional" },
                { href: "/pages/academica.html#matricula", label: "Proceso de matrícula" },
                { href: "https://www.seduca.gov.co/", label: "SEDUCA", external: true },
            ],
        },
        {
            id: "contacto", href: "/pages/contacto.html", label: "Contáctanos", icon: "fa-envelope", isContact: true,
            children: [
                { href: "/pages/contacto.html#formulario", label: "Formulario de contacto" },
                { href: "/pages/contacto.html#dependencias", label: "Dependencias y personal de apoyo" },
                { href: "/pages/contacto.html#canales", label: "Canales de contacto" },
            ],
        },
    ];

    const SOCIAL_LINKS = [
        { href: "https://www.facebook.com", label: "Facebook", icon: "fa-facebook" },
        { href: "https://www.instagram.com", label: "Instagram", icon: "fa-instagram" },
        { href: "https://www.youtube.com", label: "YouTube", icon: "fa-youtube-play" },
        { href: "https://twitter.com", label: "Twitter", icon: "fa-twitter" },
    ];

    const current = window.CURRENT_PAGE || "";

    function externalAttrs(item) {
        return item.external ? ' target="_blank" rel="noopener"' : "";
    }

    function desktopNavLink(item) {
        const isCurrent = item.id === current;
        const classAttr = item.isContact ? ' class="btn-contact"' : "";
        const currentAttr = isCurrent ? ' aria-current="page"' : "";
        const link = `<a href="${item.href}"${classAttr}${currentAttr}>${item.label}</a>`;

        if (!item.children) return link;

        const toggleClass = item.isContact ? "dropdown-toggle dropdown-toggle--contact" : "dropdown-toggle";
        const panelLinks = item.children
            .map((child) => `<a href="${child.href}"${externalAttrs(child)}>${child.label}</a>`)
            .join("");

        return `
            <div class="nav-item-dropdown">
                ${link}
                <button type="button" class="${toggleClass}" aria-expanded="false" aria-label="Submenú de ${item.label}">
                    <i class="fa fa-chevron-down" aria-hidden="true"></i>
                </button>
                <div class="nav-dropdown-panel">${panelLinks}</div>
            </div>
        `;
    }

    function mobileNavItem(item) {
        const isCurrent = item.id === current;
        const currentAttr = isCurrent ? ' aria-current="page"' : "";

        if (!item.children) {
            return `<li><a href="${item.href}"${currentAttr}><i class="fa ${item.icon}" aria-hidden="true"></i> ${item.label}</a></li>`;
        }

        const panelLinks = [`<a href="${item.href}">Ver página completa</a>`]
            .concat(item.children.map((child) => `<a href="${child.href}"${externalAttrs(child)}>${child.label}</a>`))
            .join("");

        return `
            <li class="mobile-menu-dropdown" data-open="false">
                <button type="button" aria-expanded="false"${currentAttr}>
                    <span class="flex" style="gap:15px;align-items:center">
                        <i class="fa ${item.icon}" aria-hidden="true"></i> ${item.label}
                    </span>
                    <i class="fa fa-chevron-down chevron" aria-hidden="true"></i>
                </button>
                <div class="mobile-menu-dropdown-panel">${panelLinks}</div>
            </li>
        `;
    }

    function renderHeader() {
        return `
            <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
            <div class="scroll-progress" aria-hidden="true"><div class="scroll-progress-bar"></div></div>
            <header class="site-header">
                <a href="/" class="logo">
                    <img src="/assets/images/logo/logo-buchado.png" alt="Escudo de la ${INSTITUTION_NAME_FULL}" width="60" height="60">
                    <span class="logo-text">
                        <strong>${INSTITUTION_NAME_SHORT}</strong>
                        <span>Institución Educativa Oficial</span>
                    </span>
                </a>
                <nav class="nav-links" aria-label="Navegación principal">
                    ${NAV_ITEMS.map(desktopNavLink).join("")}
                </nav>
                <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="mobileMenu" aria-label="Abrir menú de navegación">
                    <i class="fa fa-bars" aria-hidden="true"></i>
                </button>
            </header>
            <div class="identity-stripe" aria-hidden="true"></div>
        `;
    }

    function renderMobileNav() {
        const socialLinks = SOCIAL_LINKS
            .map((s) => `<a href="${s.href}" target="_blank" rel="noopener"><i class="fa ${s.icon}" aria-hidden="true"></i> ${s.label}</a>`)
            .join("");

        return `
            <nav id="mobileMenu" class="mobile-menu" aria-label="Menú móvil" aria-hidden="true">
                <button type="button" class="mobile-menu-close" aria-label="Cerrar menú">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
                <div class="mobile-menu-header">
                    <img src="/assets/images/logo/logo-buchado.png" alt="" width="80" height="80">
                    <h2>${INSTITUTION_NAME_SHORT}</h2>
                    <p>Institución Educativa Oficial</p>
                </div>
                <ul>
                    ${NAV_ITEMS.map(mobileNavItem).join("")}
                    <li class="mobile-menu-dropdown" data-open="false">
                        <button type="button" aria-expanded="false">
                            <span class="flex" style="gap:15px;align-items:center">
                                <i class="fa fa-share-alt" aria-hidden="true"></i> Redes sociales
                            </span>
                            <i class="fa fa-chevron-down chevron" aria-hidden="true"></i>
                        </button>
                        <div class="mobile-menu-dropdown-panel">${socialLinks}</div>
                    </li>
                </ul>
            </nav>
            <div class="nav-overlay"></div>
        `;
    }

    function renderFooter() {
        return `
            <footer class="site-footer">
                <div class="footer-top">
                    <figure><img src="/assets/images/logo/logo-buchado.png" alt="" width="150" height="150"></figure>
                    <div>
                        <h2>${INSTITUTION_NAME_FULL}</h2>
                        <p>Formando ciudadanos con valores, conocimiento y compromiso desde nuestra comunidad educativa.</p>
                        <div class="footer-links">
                            <a href="/pages/eventos.html"><i class="fa fa-calendar" aria-hidden="true"></i> Eventos y centros de interés</a>
                            <a href="/pages/contacto.html"><i class="fa fa-envelope" aria-hidden="true"></i> PQRS y contacto</a>
                        </div>
                    </div>
                </div>
                <div class="footer-body">
                    <section>
                        <div class="logo">
                            <img src="/assets/images/logo/logo-buchado.png" alt="" width="60" height="60" style="border-radius:50%">
                            <span class="logo-text"><strong>${INSTITUTION_NAME_SHORT}</strong><span>Institución Educativa Oficial</span></span>
                        </div>
                        <p><i class="fa fa-map-marker" aria-hidden="true"></i> Dirección de la institución (por definir)</p>
                        <p><i class="fa fa-phone" aria-hidden="true"></i> (604) 123 4567</p>
                        <p><i class="fa fa-envelope" aria-hidden="true"></i> contacto@buchado.edu.co</p>
                        <p><i class="fa fa-clock-o" aria-hidden="true"></i> Lunes a viernes · 7:00 a. m. – 4:00 p. m.</p>
                    </section>
                    <section>
                        <h3>Navegación</h3>
                        <a href="/pages/identidad.html">Nuestra Identidad</a>
                        <a href="/pages/docentes.html">Personal Docente</a>
                        <a href="/pages/eventos.html">Eventos y Centros de Interés</a>
                        <a href="/pages/academica.html">Información Académica</a>
                        <a href="/pages/contacto.html">Contáctanos</a>
                    </section>
                    <section>
                        <h3>Información académica</h3>
                        <a href="/pages/academica.html#pei">Proyecto Educativo Institucional</a>
                        <a href="/pages/academica.html#calendario">Calendario institucional</a>
                        <a href="/pages/academica.html#matricula">Proceso de matrícula</a>
                        <a href="https://www.seduca.gov.co/" target="_blank" rel="noopener">SEDUCA</a>
                        <a href="/pages/contacto.html#dependencias">Dependencias y personal de apoyo</a>
                    </section>
                </div>
                <div class="footer-bottom">
                    <p>© 2026 ${INSTITUTION_NAME_FULL}. Todos los derechos reservados.</p>
                    <div class="footer-legal">
                        <a href="#">Aviso de privacidad</a>
                        <a href="#">Términos de uso</a>
                        <a href="#">Mapa del sitio</a>
                    </div>
                    <div class="footer-social">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa fa-youtube-play" aria-hidden="true"></i></a>
                        <a href="/pages/contacto.html" aria-label="Contacto"><i class="fa fa-envelope" aria-hidden="true"></i></a>
                    </div>
                </div>
            </footer>
        `;
    }

    const headerMount = document.getElementById("site-header-mount");
    const mobileMount = document.getElementById("mobile-nav-mount");
    const footerMount = document.getElementById("site-footer-mount");

    if (headerMount) headerMount.outerHTML = renderHeader();
    if (mobileMount) mobileMount.outerHTML = renderMobileNav();
    if (footerMount) footerMount.outerHTML = renderFooter();
})();
