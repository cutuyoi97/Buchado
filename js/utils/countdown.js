/**
 * Cuenta regresiva reutilizable para tarjetas de eventos.
 * Soporta un rango start→end opcional (barra de progreso + estado)
 * o solo una fecha límite (solo días/horas/min/seg).
 */

const DAY_MS = 1000 * 60 * 60 * 24;

function pad(value) {
    return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}

function setDigit(el, value) {
    if (!el) return;
    const next = pad(value);
    if (el.textContent !== next) {
        el.textContent = next;
        el.classList.remove("tick");
        void el.offsetWidth;
        el.classList.add("tick");
    }
}

/**
 * @param {HTMLElement} root - contenedor con [data-start]/[data-end] o [data-date]
 */
export function createCountdown(root) {
    const startRaw = root.dataset.start || root.dataset.date;
    const endRaw = root.dataset.end;

    const start = startRaw ? new Date(startRaw).getTime() : NaN;
    const end = endRaw ? new Date(endRaw).getTime() : NaN;

    if (Number.isNaN(start)) {
        root.hidden = true;
        return { stop() {} };
    }

    const els = {
        days: root.querySelector(".days"),
        hours: root.querySelector(".hours"),
        minutes: root.querySelector(".minutes"),
        seconds: root.querySelector(".seconds"),
        fill: root.querySelector(".event-progress-fill"),
        percentage: root.querySelector(".percentage"),
        status: root.querySelector(".status"),
        card: root,
    };

    function render() {
        const now = Date.now();
        const hasRange = !Number.isNaN(end);
        const targetEnd = hasRange ? end : start;

        if (now >= targetEnd) {
            setDigit(els.days, 0);
            setDigit(els.hours, 0);
            setDigit(els.minutes, 0);
            setDigit(els.seconds, 0);
            if (els.fill) els.fill.style.width = "100%";
            if (els.percentage) els.percentage.textContent = "100%";
            if (els.status) els.status.textContent = "Evento finalizado";
            els.card?.classList.add("is-ended");
            return false;
        }

        if (hasRange && now >= start && now < end) {
            const progress = ((now - start) / (end - start)) * 100;
            if (els.fill) els.fill.style.width = progress + "%";
            if (els.percentage) els.percentage.textContent = Math.floor(progress) + "%";
            if (els.status) els.status.textContent = "Evento en curso";
            setDigit(els.days, 0);
            setDigit(els.hours, 0);
            setDigit(els.minutes, 0);
            setDigit(els.seconds, 0);
            return true;
        }

        const distance = start - now;
        const days = Math.floor(distance / DAY_MS);
        const hours = Math.floor((distance % DAY_MS) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setDigit(els.days, days);
        setDigit(els.hours, hours);
        setDigit(els.minutes, minutes);
        setDigit(els.seconds, seconds);

        if (els.status) els.status.textContent = `Faltan ${days} día${days === 1 ? "" : "s"}`;

        if (els.fill) {
            const totalWindowDays = 30;
            const progress = Math.min(100, Math.max(0, ((totalWindowDays - days) / totalWindowDays) * 100));
            els.fill.style.width = progress + "%";
            if (els.percentage) els.percentage.textContent = Math.floor(progress) + "%";
        }

        return true;
    }

    const shouldContinue = render();
    const timer = shouldContinue ? setInterval(() => {
        if (!render()) clearInterval(timer);
    }, 1000) : null;

    return {
        stop() {
            if (timer) clearInterval(timer);
        },
    };
}
