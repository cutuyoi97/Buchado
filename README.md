# Buchado Colegio

Sitio web institucional del Buchado Colegio: una institución educativa
(contenido de ejemplo/ficticio para fines de este proyecto) que presenta su
identidad, sus eventos y un formulario de contacto funcional.

## Tecnologías

- HTML5 semántico
- CSS3 (variables de diseño, Grid y Flexbox, sin frameworks)
- JavaScript moderno (ES Modules, sin jQuery ni librerías de carrusel)
- Vercel Serverless Functions (Node.js) para el backend del formulario
- [Resend](https://resend.com) para el envío de correos

## Estructura del proyecto

```
buchado-colegio/
├── index.html              → Página de inicio
├── pages/
│   ├── identidad.html      → Nuestra Identidad
│   ├── eventos.html        → Eventos
│   └── contacto.html       → Contacto
├── assets/
│   ├── images/
│   │   ├── logo/            → Logo y escudo institucional
│   │   └── institucional/   → Fotografías institucionales y logos de aliados
│   └── icons/               → Iconos propios (ícono de teléfono, etc.)
├── css/
│   ├── base.css             → Reset, variables de diseño, tipografía, utilidades
│   ├── components.css       → Navbar, menú móvil, footer, botones, tarjetas, formularios
│   ├── home.css              → Estilos específicos de inicio
│   ├── identidad.css        → Estilos específicos de Nuestra Identidad
│   ├── eventos.css          → Estilos específicos de Eventos
│   └── contacto.css         → Estilos específicos de Contacto
├── js/
│   ├── navigation.js        → Menú móvil, header fijo, barra de progreso (todas las páginas)
│   ├── home.js               → Contadores y animaciones de la página de inicio
│   ├── identidad.js         → Contadores animados y acordeón de valores
│   ├── events.js            → Contador, filtros y galería con lightbox
│   ├── contact.js           → Validación y envío del formulario de contacto
│   └── utils/
│       ├── countdown.js     → Lógica de cuenta regresiva reutilizable
│       └── reveal.js        → Animación de aparición al hacer scroll
├── api/
│   └── contact.js           → Función serverless: valida y envía el correo con Resend
├── .env.example              → Plantilla de variables de entorno (sin valores reales)
└── package.json
```

Todas las rutas internas (CSS, JS, imágenes, navegación) usan rutas absolutas
(`/css/...`, `/js/...`, `/pages/...`) para que funcionen igual sin importar
la profundidad de la página.

## Instalación y ejecución local

Este proyecto es un sitio estático + una función serverless, pensado para
desplegarse en [Vercel](https://vercel.com).

```bash
npm install -g vercel   # si no lo tienes instalado
vercel dev              # sirve el sitio y /api/contact localmente
```

También puedes previsualizar solo el front-end (sin el formulario funcional)
con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## Variables de entorno

Copia `.env.example` como `.env.local` y complétalo con tus propios valores.
**Nunca subas un archivo `.env` con valores reales al repositorio** (ya está
excluido en `.gitignore`).

| Variable              | Descripción                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `RESEND_API_KEY`       | API key de tu cuenta de Resend (Dashboard → API Keys).         |
| `CONTACT_TO_EMAIL`     | Correo que recibe los mensajes del formulario.                 |
| `CONTACT_FROM_EMAIL`   | Remitente del correo; debe pertenecer a un dominio verificado en Resend, o usar `onboarding@resend.dev` mientras tanto. |

En producción, configura estas mismas variables en **Vercel → Project
Settings → Environment Variables**.

## Formulario de contacto

Flujo: `formulario (frontend)` → `fetch a /api/contact` → `validación y
honeypot en el servidor` → `Resend` → `correo`.

- La API key de Resend vive únicamente en el backend (`api/contact.js`);
  nunca se expone al navegador.
- El formulario valida en el cliente (mensajes de error por campo) y
  **vuelve a validar en el servidor** (la validación de cliente nunca es
  suficiente por sí sola).
- Incluye un campo honeypot oculto contra bots simples y un límite básico
  de solicitudes por IP (rate limiting best-effort; ver comentario en
  `api/contact.js` sobre sus límites en un entorno serverless).

## Estado del proyecto / próximos pasos

- Las fotografías de eventos, galería y el rector son marcadores de
  posición (se reutilizan las fotos institucionales disponibles, o un
  ícono cuando no aplica una foto real) hasta contar con material real.
- La sección "Documentos institucionales" está preparada visualmente pero
  sin archivos reales; agrégalos cuando estén disponibles.
- Las noticias son contenido estático de ejemplo; la estructura de tarjetas
  permite conectarlas a una fuente de datos real en el futuro sin cambiar
  el diseño.
