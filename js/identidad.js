/**
 * Página Nuestra Identidad: contadores animados, acordeón de valores
 * y aparición progresiva de bloques al hacer scroll.
 */

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");

    function startCounter(counter) {
        const target = Number(counter.dataset.target) || 0;
        const duration = 1400;
        const startTime = performance.now();

        function step(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            counter.textContent = Math.floor(progress * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                if (entry.target.classList.contains("counter")) {
                    startCounter(entry.target);
                }
                revealObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.25 }
    );

    document.querySelectorAll(".reveal, .counter").forEach((el) => revealObserver.observe(el));
});

document.querySelectorAll(".value-item").forEach((item) => {
    const trigger = item.querySelector(".value-trigger");
    trigger?.addEventListener("click", () => {
        const isActive = item.classList.contains("is-active");
        item.classList.toggle("is-active");
        trigger.setAttribute("aria-expanded", String(!isActive));
    });
});
