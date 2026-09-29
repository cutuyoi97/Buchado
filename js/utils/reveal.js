/** Revela elementos con una transición suave cuando entran al viewport. */
export function observeReveal(selector, { threshold = 0.2, stagger = 0.1 } = {}) {
    const items = document.querySelectorAll(selector);
    if (!items.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold }
    );

    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * stagger}s`;
        observer.observe(item);
    });
}
