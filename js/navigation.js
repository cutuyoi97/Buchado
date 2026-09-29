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
            if (window.innerWidth > 960 && mobileMenu.classList.contains("is-open")) {
                closeMenu({ restoreFocus: false });
            }
        });
    }

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
