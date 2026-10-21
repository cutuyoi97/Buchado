// Vercel Serverless Function: recibe el formulario de contacto, valida en el
// servidor y envía el correo con la API de Resend. La RESEND_API_KEY vive
// solo aquí — nunca se expone al navegador.

const RESEND_API_URL = "https://api.resend.com/emails";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = { name: 100, email: 200, subject: 150, message: 2000 };

// Rate limit best-effort: una instancia serverless "caliente" conserva este
// Map entre invocaciones, pero Vercel puede crear varias instancias en
// paralelo o reciclarlas en frío, así que esto no sustituye un límite real
// a nivel de infraestructura (Vercel Firewall / Upstash) para tráfico alto.
const requestLog = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip) {
    const now = Date.now();
    const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    timestamps.push(now);
    requestLog.set(ip, timestamps);

    if (requestLog.size > 500) {
        for (const [key, values] of requestLog) {
            if (values.every((t) => now - t > RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
        }
    }

    return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Método no permitido." });
    }

    const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
        .toString()
        .split(",")[0]
        .trim();

    if (isRateLimited(ip)) {
        return res.status(429).json({ ok: false, error: "Demasiadas solicitudes. Intenta más tarde." });
    }

    const { name, email, subject, message, company } = req.body || {};

    // Honeypot: si un bot llenó este campo oculto, respondemos "éxito" sin enviar nada.
    if (company) {
        return res.status(200).json({ ok: true });
    }

    const fields = { name, email, subject, message };
    const errors = [];

    if (!name || !String(name).trim()) errors.push("El nombre es obligatorio.");
    else if (String(name).trim().length > MAX_LENGTH.name) errors.push("El nombre es demasiado largo.");

    if (!email || !EMAIL_REGEX.test(String(email).trim())) errors.push("El correo no es válido.");
    else if (String(email).trim().length > MAX_LENGTH.email) errors.push("El correo es demasiado largo.");

    if (!subject || !String(subject).trim()) errors.push("El asunto es obligatorio.");
    else if (String(subject).trim().length > MAX_LENGTH.subject) errors.push("El asunto es demasiado largo.");

    if (!message || !String(message).trim()) errors.push("El mensaje es obligatorio.");
    else if (String(message).trim().length > MAX_LENGTH.message) errors.push("El mensaje es demasiado largo.");

    for (const value of Object.values(fields)) {
        if (typeof value !== "string" && value !== undefined) {
            errors.push("Datos inválidos.");
            break;
        }
    }

    if (errors.length) {
        // El detalle sirve para depurar en logs; al cliente solo llega ok:false.
        return res.status(400).json({ ok: false, error: errors.join(" ") });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error("Falta la variable de entorno RESEND_API_KEY.");
        return res.status(500).json({ ok: false, error: "El servicio de correo no está configurado." });
    }

    const toAddress = process.env.CONTACT_TO_EMAIL || "secretaria@buchado.com";
    const fromAddress = process.env.CONTACT_FROM_EMAIL || "I.E. Buchadó Fernando Botero Angulo <onboarding@resend.dev>";

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanSubject = String(subject).trim();
    const cleanMessage = String(message).trim();

    try {
        const response = await fetch(RESEND_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: fromAddress,
                to: toAddress,
                reply_to: cleanEmail,
                subject: `[Contacto web] ${cleanSubject}`,
                html: `
                    <h2>Nuevo mensaje desde el sitio web</h2>
                    <p><strong>Nombre:</strong> ${escapeHtml(cleanName)}</p>
                    <p><strong>Correo:</strong> ${escapeHtml(cleanEmail)}</p>
                    <p><strong>Asunto:</strong> ${escapeHtml(cleanSubject)}</p>
                    <p><strong>Mensaje:</strong></p>
                    <p>${escapeHtml(cleanMessage).replace(/\n/g, "<br>")}</p>
                `,
            }),
        });

        if (!response.ok) {
            const details = await response.text();
            console.error("Resend respondió con error:", response.status, details);
            return res.status(502).json({ ok: false, error: "No se pudo enviar el mensaje." });
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Error al llamar a Resend:", err);
        return res.status(500).json({ ok: false, error: "Ocurrió un error inesperado." });
    }
};
