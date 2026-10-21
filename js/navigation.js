/**
 * Navegación compartida: header fijo al hacer scroll, barra de progreso,
 * menú móvil accesible (teclado + foco) y desplegable de redes sociales.
 * Sin dependencias externas (reemplaza jQuery).
 */

(() => {
    const header = document.querySelector(".site-header");
    const progressBar = document.querySelector(".scroll-progress-bar");
    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const menuClose = document.querySelector(".mobile-menu-close");
    const overlay = document.querySelector(".nav-overlay");

    /* ----- Header fijo + barra de progreso ----- */

    function onScroll() {
        if (header) header.classList.toggle("is-fixed", window.scrollY > 80);

        if (progressBar) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            progressBar.style.width = progress + "%";
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ----- Menú móvil ----- */

    if (navToggle && mobileMenu) {
        const getFocusable = () =>
            mobileMenu.querySelectorAll('a[href], button:not([disabled])');

        function openMenu() {
            mobileMenu.classList.add("is-open");
            mobileMenu.removeAttribute("aria-hidden");
            overlay?.classList.add("is-visible");
            navToggle.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden";
            const focusable = getFocusable();
            focusable[0]?.focus();
        }

        function closeMenu({ restoreFocus = true } = {}) {
            mobileMenu.classList.remove("is-open");
            mobileMenu.setAttribute("aria-hidden", "true");
            overlay?.classList.remove("is-visible");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
            if (restoreFocus) navToggle.focus();
        }

        navToggle.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.contains("is-open");
            isOpen ? closeMenu() : openMenu();
        });

        menuClose?.addEventListener("click", () => closeMenu());
        overlay?.addEventListener("click", () => closeMenu());

        document.addEventListener("keydown", (event) => {
            if (!mobileMenu.classList.contains("is-open")) return;

            if (event.key === "Escape") {
                closeMenu();
                return;
            }

            if (event.key === "Tab") {
                const focusable = Array.from(getFocusable());
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1180 && mobileMenu.classList.contains("is-open")) {
                closeMenu({ restoreFocus: false });
            }
        });
    }

    /* ----- Submenús de navegación (escritorio) -----
       El cierre se controla por estado (clase .is-open) en lugar de
       depender solo de :hover en CSS: así, mover el cursor lentamente o
       en diagonal hacia el panel no lo cierra a mitad de camino, y se
       aplica un pequeño retraso antes de cerrar al salir del área. */

    const navDropdowns = document.querySelectorAll(".nav-item-dropdown");
    const CLOSE_DELAY_MS = 300;

    function closeAllNavDropdowns(except) {
        navDropdowns.forEach((dropdown) => {
            if (dropdown === except) return;
            dropdown.classList.remove("is-open");
            dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
        });
    }

    navDropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");
        if (!toggle) return;

        let closeTimer = null;

        function open() {
            clearTimeout(closeTimer);
            closeAllNavDropdowns(dropdown);
            dropdown.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
        }

        function scheduleClose() {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                dropdown.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }, CLOSE_DELAY_MS);
        }

        // Hover con intención (solo dispositivos con mouse real): abre al
        // entrar, programa el cierre al salir del grupo completo
        // (enlace + botón + panel), y lo cancela si vuelve a entrar.
        dropdown.addEventListener("mouseenter", () => {
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) open();
        });
        dropdown.addEventListener("mouseleave", () => {
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) scheduleClose();
        });

        // Clic/tap en la flecha: alterna el submenú (táctil y teclado).
        toggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = dropdown.classList.contains("is-open");
            clearTimeout(closeTimer);
            if (isOpen) {
                dropdown.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            } else {
                open();
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".nav-item-dropdown")) closeAllNavDropdowns();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAllNavDropdowns();
    });

    /* ----- Desplegable de redes sociales dentro del menú móvil ----- */

    document.querySelectorAll(".mobile-menu-dropdown").forEach((dropdown) => {
        const trigger = dropdown.querySelector("button");
        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const isOpen = dropdown.dataset.open === "true";
            dropdown.dataset.open = String(!isOpen);
            trigger.setAttribute("aria-expanded", String(!isOpen));
        });
    });
})();
