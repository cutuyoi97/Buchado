/**
 * Formulario de contacto: validación en cliente con errores por campo,
 * estados de carga y envío a /api/contact (Resend vive solo en el backend).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = { name: 100, subject: 150, message: 2000 };

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnSpinner = submitBtn.querySelector(".btn-spinner");
    const statusBox = document.getElementById("formStatus");

    const fields = {
        name: form.elements.name,
        email: form.elements.email,
        subject: form.elements.subject,
        message: form.elements.message,
    };

    function setFieldError(field, message) {
        const wrapper = field.closest(".form-field");
        const errorEl = wrapper?.querySelector(".field-error");
        if (message) {
            wrapper?.classList.add("has-error");
            if (errorEl) errorEl.textContent = message;
        } else {
            wrapper?.classList.remove("has-error");
            if (errorEl) errorEl.textContent = "";
        }
    }

    function validate() {
        let firstInvalid = null;
        const errors = {};

        if (!fields.name.value.trim()) {
            errors.name = "Ingresa tu nombre completo.";
        } else if (fields.name.value.trim().length > MAX_LENGTH.name) {
            errors.name = `Máximo ${MAX_LENGTH.name} caracteres.`;
        }

        if (!EMAIL_REGEX.test(fields.email.value.trim())) {
            errors.email = "Ingresa un correo electrónico válido.";
        }

        if (!fields.subject.value.trim()) {
            errors.subject = "Cuéntanos el motivo de tu mensaje.";
        } else if (fields.subject.value.trim().length > MAX_LENGTH.subject) {
            errors.subject = `Máximo ${MAX_LENGTH.subject} caracteres.`;
        }

        if (!fields.message.value.trim()) {
            errors.message = "Escribe tu mensaje.";
        } else if (fields.message.value.trim().length > MAX_LENGTH.message) {
            errors.message = `Máximo ${MAX_LENGTH.message} caracteres.`;
        }

        Object.entries(fields).forEach(([key, field]) => {
            setFieldError(field, errors[key]);
            if (errors[key] && !firstInvalid) firstInvalid = field;
        });

        firstInvalid?.focus();
        return Object.keys(errors).length === 0;
    }

    function setStatus(type, message) {
        statusBox.className = "form-status " + type;
        statusBox.textContent = message;
        statusBox.hidden = false;
    }

    function clearStatus() {
        statusBox.hidden = true;
        statusBox.textContent = "";
    }

    function setLoading(loading) {
        submitBtn.disabled = loading;
        btnSpinner.hidden = !loading;
        btnText.textContent = loading ? "Enviando..." : "Enviar mensaje";
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearStatus();

        if (!validate()) return;

        const payload = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            subject: fields.subject.value.trim(),
            message: fields.message.value.trim(),
            company: form.elements.company.value.trim(), // honeypot
        };

        setLoading(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));

            if (response.ok && result.ok) {
                setStatus("success", "Mensaje enviado correctamente. Te responderemos pronto.");
                form.reset();
            } else {
                setStatus("error", "No fue posible enviar el mensaje. Inténtalo nuevamente.");
            }
        } catch {
            setStatus("error", "No fue posible enviar el mensaje. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    });
});
