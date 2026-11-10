# Arquitectura y guía de implementación: sitio web de **Gama Metales** (Bucaramanga)

> Chatarrería y recicladora de metales con más de 20 años de servicio. Sitio estático, sin base de datos ni backend. Objetivo: posicionar en Google y en motores de respuesta por IA (ChatGPT, Claude, Perplexity, Gemini) y convertir por **WhatsApp**.

---

## 0. Resumen ejecutivo y decisiones tomadas

| Tema | Decisión | Motivo |
|---|---|---|
| Framework | **Astro** + Tailwind CSS v4 (SSG) | HTML completo en *View Source*, ~0 KB de JS por defecto, el mejor punto de partida para Core Web Vitals. |
| Hosting | **Cloudflare Pages** (plan gratuito) | $0/mes, ancho de banda estático ilimitado, CDN global y uso comercial permitido. Vercel Hobby es solo para uso no comercial, por lo que un negocio terminaría en el plan Pro (~USD 20/mes). *Verifica límites y precios vigentes antes de contratar.* |
| Dominio | Comprar **después** de terminar el sitio. Costo típico de un `.com`: ~USD 10 a 13 por año. | El proyecto queda listo para cambiar de dominio con **una sola variable de entorno** (`SITE_URL`). |
| Precios en el sitio | **No se publican** | Cambian a diario. Todo CTA lleva al WhatsApp ("pide la lista de precios de hoy"). |
| Diferenciadores (reales) | +20 años de experiencia · compran todo tipo de metales · recolección desde 300 kg · lista de precios actualizada cada día · hacen casi toda la disposición del material | No se inventa nada (báscula certificada, pagos, certificados). Se pueden añadir cuando los confirmen. |
| Páginas | Inicio · Materiales (hub + 7 páginas de material) · Recolección · Empresas · Contacto · 404 | Una URL por intención de búsqueda. **Empresas** se añade por el objetivo de temporada. |
| Reseñas y fotos | Sección de reseñas reales copiadas de Google Business y galería de la bodega | Sin reseñas inventadas. Ver sección 13. |

### Datos asumidos (confírmalos, están marcados con `TODO` en el código)

1. **Barrio/sector** de la bodega: no lo diste, déjalo vacío o complétalo en `site.ts`.
2. **Zonas de recolección**: asumí Bucaramanga, Floridablanca, Girón y Piedecuesta. Ajusta según la realidad.
3. **Domingos y festivos**: asumí cerrado.
4. **Coordenadas**: derivadas del plus code `4VF9+J5` (≈ 7.1241, -73.1320). **Verifícalas** haciendo clic derecho sobre tu pin en Google Maps y copiando lat/lng.
5. **WhatsApp principal**: 316 270 0257. El 317 645 9772 queda como segundo contacto.
6. **Logo**: lo harás tú. Mientras tanto el sitio usa un wordmark de texto y un favicon provisional.

---

## 1. Stack tecnológico

| Capa | Herramienta |
|---|---|
| Framework | Astro 5+ (salida 100 % estática) |
| Estilos | Tailwind CSS v4 (plugin de Vite) |
| Tipografías | `@fontsource` (autoalojadas, sin pedir nada a Google Fonts) |
| Imágenes | `astro:assets` (`<Image>`/`<Picture>`, genera WebP/AVIF con `sharp`) |
| Sitemap | `@astrojs/sitemap` |
| JS en cliente | Solo ~1 KB (un formulario que construye el enlace de WhatsApp). El resto es HTML/CSS |
| Hosting | Cloudflare Pages |

**Por qué no React + Vite puro (CSR):** el HTML inicial estaría vacío (`<div id="root">`), Google lo indexaría tarde y muchos rastreadores de IA ni ejecutan JavaScript. Con Astro el HTML final está completo en el build.

> Si prefieres Next.js: usa `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }` y `productionBrowserSourceMaps: false`. Toda la lógica de este documento (datos, SEO, JSON-LD, WhatsApp) se traslada igual, pero Astro enviará menos JS.

---

## 2. Estructura de carpetas

```text
gama-metales/
├─ public/
│  ├─ _headers                  # cabeceras y caché (Cloudflare Pages)
│  ├─ favicon.svg
│  ├─ favicon.ico
│  ├─ apple-touch-icon.png      # 180x180
│  ├─ icon-192.png
│  ├─ icon-512.png
│  ├─ site.webmanifest
│  ├─ logo.png                  # tu logo (para JSON-LD)
│  └─ og/default.jpg            # 1200x630
├─ scripts/
│  └─ check-seo.mjs             # valida el HTML generado (corre tras el build)
├─ src/
│  ├─ assets/bodega/            # fotos reales de la bodega (jpg/png)
│  ├─ components/
│  │  ├─ SEO.astro
│  │  ├─ Header.astro
│  │  ├─ Footer.astro
│  │  ├─ WhatsAppFloat.astro
│  │  ├─ MaterialCard.astro
│  │  ├─ QuoteForm.astro
│  │  └─ FaqList.astro
│  ├─ data/
│  │  ├─ site.ts                # fuente única de verdad del negocio
│  │  ├─ seo.ts                 # title/description por página
│  │  ├─ materials.ts
│  │  ├─ faqs.ts
│  │  ├─ reviews.ts
│  │  └─ gallery.ts
│  ├─ layouts/Layout.astro
│  ├─ lib/
│  │  ├─ whatsapp.ts
│  │  └─ schema.ts              # generadores JSON-LD
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ materiales/index.astro
│  │  ├─ materiales/[slug].astro
│  │  ├─ recoleccion-de-chatarra.astro
│  │  ├─ empresas.astro
│  │  ├─ contacto.astro
│  │  ├─ 404.astro
│  │  ├─ robots.txt.ts          # dinámico (usa SITE_URL)
│  │  └─ llms.txt.ts            # dinámico (usa SITE_URL)
│  └─ styles/global.css
├─ .env                         # local, no se sube a git
├─ .env.example
├─ astro.config.mjs
└─ package.json
```

> **¿Por qué `robots.txt` y `llms.txt` son endpoints y no archivos en `/public`?** Porque necesitan la URL del sitemap y enlaces absolutos, y todavía no tienes dominio. Así se generan en cada build con el `SITE_URL` correcto, y en modo vista previa bloquean el rastreo automáticamente. El resultado final en `/robots.txt` y `/llms.txt` es el mismo que si fueran archivos estáticos.

---

## 3. Inicialización y dependencias

Requiere Node.js 20 o superior.

```bash
npm create astro@latest gama-metales -- --template minimal --typescript strict --git --install
cd gama-metales

# Integraciones (el asistente instala la versión compatible y edita la config)
npx astro add tailwind sitemap

# Tipografías autoalojadas
npm i @fontsource-variable/inter @fontsource/barlow-condensed

# Procesamiento de imágenes (Astro lo usa si está instalado)
npm i sharp

# Opcional: verificación de tipos
npm i -D @astrojs/check typescript
```

`.env.example`:

```bash
# Dominio de producción SIN barra final. Mientras no tengas dominio, usa la URL de vista previa.
SITE_URL=https://gama-metales.pages.dev
# "true" SOLO cuando SITE_URL sea tu dominio propio. En false: noindex + robots bloqueado.
ALLOW_INDEXING=false
```

`package.json` (scripts):

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && node scripts/check-seo.mjs",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

---

## 4. Configuración principal

### 4.1 `astro.config.mjs` (anti-errores #1, #11, #15, #18, #19, #20)

```js
// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

// Lee .env (local) y process.env (Cloudflare). process.env gana.
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };

const SITE_URL = (env.SITE_URL ?? 'http://localhost:4321').replace(/\/$/, '');
const ALLOW_INDEXING = env.ALLOW_INDEXING === 'true';
const isBuild = process.argv.includes('build');

// ANTI-ERROR #1: el build FALLA si intentas indexar con un dominio de plataforma.
if (isBuild && ALLOW_INDEXING && /vercel\.app|pages\.dev|workers\.dev|netlify\.app|localhost/.test(SITE_URL)) {
  throw new Error(
    `[SEO] ALLOW_INDEXING=true pero SITE_URL="${SITE_URL}". Configura tu dominio propio antes de indexar.`
  );
}

export default defineConfig({
  site: SITE_URL, // Astro.site -> base de canonical, OG y sitemap
  trailingSlash: 'always', // una sola variante de URL (evita contenido duplicado)
  compressHTML: true,
  build: { format: 'directory', inlineStylesheets: 'auto' },

  // ANTI-ERROR #15: genera sitemap-index.xml + sitemap-0.xml en cada build
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],

  env: {
    schema: {
      ALLOW_INDEXING: envField.boolean({ context: 'server', access: 'public', default: false }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false, // ANTI-ERROR #18: sin source maps en producción
    },
    // ANTI-ERROR #19/#20: elimina console.* y debugger del JS que llega al navegador
    esbuild: isBuild ? { drop: ['console', 'debugger'], legalComments: 'none' } : {},
  },
});
```

> **Equivalente en Next.js (`next.config.js`)**
> ```js
> module.exports = { output: 'export', trailingSlash: true, productionBrowserSourceMaps: false,
>   images: { unoptimized: true }, compiler: { removeConsole: true } };
> ```

### 4.2 `public/_headers` (Cloudflare Pages)

```text
# Las URLs *.pages.dev NUNCA deben indexarse (anti-error #1)
https://:project.pages.dev/*
  X-Robots-Tag: noindex

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# Archivos con hash: caché de 1 año
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/og/*
  Cache-Control: public, max-age=86400
```

### 4.3 Cómo se evita enviar JavaScript innecesario (anti-error #20)

- Astro **no envía JS** salvo que uses `<script>` o islas (`client:*`). Aquí no se usa ningún framework de UI en cliente.
- El menú móvil usa `<details>`, el carrusel de materiales es CSS, el botón flotante es un `<a>`. Todo sin JS.
- Único script: `QuoteForm.astro` (~1 KB), que Vite empaqueta y minifica.
- Tipografías: solo los pesos usados (Barlow Condensed 700/800 + Inter variable), con `font-display: swap` incluido por Fontsource.
- Imágenes: `<Image>`/`<Picture>` generan WebP/AVIF con `width`/`height` (sin CLS) y `loading="lazy"`; solo la imagen LCP lleva `loading="eager"` y `fetchpriority="high"`.
- Sin librerías de iconos, sin carruseles JS, sin Google Maps embebido (se usa un enlace "Cómo llegar").

---

## 5. Identidad visual

### 5.1 Concepto

Tu lista de precios ya usa **violeta + dorado/naranja cobre**: es un código visual propio que ningún competidor usa (la mayoría va en verde reciclaje o gris industrial). Lo llevamos al sitio: un violeta profundo y casi negro como base, **dorado cobre** como color de acción, y un motivo de **fichas de tabla periódica** (Cu, Al, Fe, Pb) en cada material. Se complementa con una cinta de precaución industrial (hazard) y una tipografía condensada y contundente. Lema como firma: *"Nunca pares, nunca te conformes, insiste."*

### 5.2 Paleta

| Token | Hex | Uso |
|---|---|---|
| `brand-950` | `#1A0833` | Fondo hero, footer |
| `brand-900` | `#2A0F4D` | Secciones oscuras |
| `brand-700` | `#5B1B9A` | Violeta de marca (enlaces, títulos sobre blanco) |
| `brand-100` | `#EFE6FA` | Fondos suaves |
| `brand-50` | `#F8F4FD` | Fondo general |
| `copper-500` | `#FFB400` | **Botones y acentos** (texto encima: siempre `brand-950`) |
| `copper-400` | `#FFC83D` | Hover |
| `ink` | `#17101F` | Texto principal |
| `wa` | `#25D366` | Botón de WhatsApp (texto oscuro encima para contraste) |

Contraste: dorado sobre `brand-950` y texto oscuro sobre dorado cumplen WCAG AA. No uses dorado como texto sobre fondo blanco.

### 5.3 `src/styles/global.css`

```css
@import "tailwindcss";
@import "@fontsource-variable/inter";
@import "@fontsource/barlow-condensed/700.css";
@import "@fontsource/barlow-condensed/800.css";

@theme {
  --color-brand-950: #1a0833;
  --color-brand-900: #2a0f4d;
  --color-brand-800: #3d1670;
  --color-brand-700: #5b1b9a;
  --color-brand-100: #efe6fa;
  --color-brand-50: #f8f4fd;
  --color-copper-400: #ffc83d;
  --color-copper-500: #ffb400;
  --color-ink: #17101f;
  --color-wa: #25d366;
  --font-display: "Barlow Condensed", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
  body { @apply bg-brand-50 font-sans text-ink antialiased; }
  h1, h2, h3 { @apply font-display font-extrabold uppercase leading-[0.95] tracking-tight; }
  :focus-visible { outline: 3px solid var(--color-copper-500); outline-offset: 3px; }
}

@layer components {
  .btn { @apply inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-bold transition; }
  .btn-primary { @apply bg-copper-500 text-brand-950 hover:bg-copper-400; }
  .btn-wa { @apply bg-wa text-ink hover:brightness-95; }
  .btn-ghost { @apply border border-white/40 text-white hover:bg-white/10; }
  .btn-outline { @apply border-2 border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white; }
  .container-x { @apply mx-auto w-full max-w-6xl px-4 sm:px-6; }
  .tile { @apply relative flex h-20 w-20 flex-none flex-col justify-between rounded-md bg-brand-900 p-2 text-copper-500; }
}

/* Cinta de precaución industrial */
.hazard {
  height: 10px;
  background: repeating-linear-gradient(-45deg, var(--color-copper-500) 0 14px, var(--color-brand-950) 14px 28px);
}

/* Cinta de materiales (CSS puro) */
.ticker-track { display: flex; width: max-content; animation: ticker 40s linear infinite; }
@keyframes ticker { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; }
  html { scroll-behavior: auto; }
}

/* Fondo del hero: sin imagen (cero peso). Sustituible por foto real. */
.hero-bg {
  background:
    radial-gradient(60rem 30rem at 85% -10%, rgb(255 180 0 / 0.22), transparent 60%),
    radial-gradient(40rem 25rem at 0% 110%, rgb(91 27 154 / 0.7), transparent 60%),
    var(--color-brand-950);
}
```

---

## 6. Datos del negocio (fuente única de verdad)

### 6.1 `src/data/site.ts`

```ts
export const SITE = {
  name: 'Gama Metales',
  slogan: 'Nunca pares, nunca te conformes, insiste.',
  description:
    'Chatarrería y recicladora de metales en Bucaramanga con más de 20 años de experiencia. Compramos cobre, bronce, aluminio, hierro, acero, plomo, baterías y electrodomésticos.',
  lang: 'es-CO',
  locale: 'es_CO',
  city: 'Bucaramanga',
  region: 'Santander',
  country: 'CO',

  address: {
    street: 'Carrera 11 # 23-35',
    neighborhood: '', // TODO: barrio/sector exacto
    postalCode: '', // TODO: opcional
    plusCode: '4VF9+J5 Bucaramanga',
  },
  // TODO: verifica en Google Maps (derivadas del plus code 4VF9+J5)
  geo: { lat: 7.1241, lng: -73.132 },
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('4VF9+J5 Bucaramanga')}`,
  gbpUrl: '', // TODO: enlace al perfil de Google Business cuando lo recuperes

  phones: [
    { label: 'WhatsApp principal', display: '316 270 0257', e164: '+573162700257', wa: '573162700257' },
    { label: 'WhatsApp / llamadas', display: '317 645 9772', e164: '+573176459772', wa: '573176459772' },
  ],

  hours: [
    { label: 'Lunes a viernes', display: '7:00 a. m. a 5:30 p. m.', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:30' },
    { label: 'Sábados', display: '7:00 a. m. a 1:30 p. m.', days: ['Saturday'], opens: '07:00', closes: '13:30' },
  ],
  closedNote: 'Domingos y festivos cerrado.', // TODO: confirmar

  pickup: {
    minKg: 300,
    zones: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'], // TODO: confirmar cobertura
  },

  sameAs: [] as string[], // TODO: Facebook, Instagram, GBP, cuando existan
  yearsOfExperience: '20',
} as const;

export const NAV = [
  { href: '/materiales/', label: 'Materiales' },
  { href: '/recoleccion-de-chatarra/', label: 'Recolección' },
  { href: '/empresas/', label: 'Empresas' },
  { href: '/contacto/', label: 'Contacto' },
] as const;
```

### 6.2 `src/data/seo.ts` (anti-errores #5 y #6)

Títulos únicos de ≤ 60 caracteres y descripciones de 120 a 155 (validadas). Evita comillas y apóstrofes en ellas: el script de verificación cuenta caracteres sobre el HTML.

```ts
export const PAGES = {
  home: {
    title: 'Chatarrería en Bucaramanga | Compra de Chatarra y Metales',
    description: 'Chatarrería en Bucaramanga con más de 20 años. Compramos cobre, aluminio, hierro, bronce y baterías. Cotiza por WhatsApp y recibe el precio del día.',
  },
  materiales: {
    title: 'Compra de Metales en Bucaramanga: Cobre, Aluminio y Hierro',
    description: 'Compramos todo tipo de metales en Bucaramanga: cobre, bronce, aluminio, hierro, acero, plomo, baterías y electrodomésticos. Cotiza por WhatsApp.',
  },
  recoleccion: {
    title: 'Recolección de Chatarra a Domicilio en Bucaramanga',
    description: 'Recolección de chatarra a domicilio en Bucaramanga desde 300 kg. Escríbenos por WhatsApp, coordinamos la visita y te cotizamos el material.',
  },
  empresas: {
    title: 'Venta de Chatarra para Empresas en Bucaramanga',
    description: 'Empresas en Bucaramanga: vende la chatarra y los excedentes de metal acumulados en el año. Cotización por WhatsApp y recolección desde 300 kg.',
  },
  contacto: {
    title: 'Chatarrería Gama Metales Bucaramanga | Dirección y Horarios',
    description: 'Chatarrería Gama Metales en la Carrera 11 # 23-35, Bucaramanga. Lunes a viernes 7:00 a. m. a 5:30 p. m. y sábados hasta 1:30 p. m. Escríbenos por WhatsApp.',
  },
  notFound: {
    title: 'Página no encontrada | Gama Metales',
    description: 'La página que buscas no existe. Consulta los metales que compramos en Bucaramanga o escríbenos por WhatsApp para cotizar tu chatarra.',
  },
} as const;
```

### 6.3 `src/data/materials.ts`

Una sola lista alimenta: tarjetas, páginas de detalle, JSON-LD (`hasOfferCatalog`), `llms.txt` y sitemap. **No lista los 60 ítems de tu tabla**: agrupa por familia de metal (la intención de búsqueda real) y menciona las variantes como texto.

```ts
export interface Material {
  slug: string;
  name: string; // nombre corto (tarjetas, schema)
  h1: string;
  symbol: string; // ficha estilo tabla periódica
  number: string;
  priority: 1 | 2 | 3; // 1 = destacado en portada
  short: string; // texto de tarjeta
  metaTitle: string;
  metaDescription: string;
  items: string[]; // variantes que se compran
  intro: string;
  tips: string[]; // cómo cotizan mejor
  faqs?: { q: string; a: string }[];
}

export const MATERIALS: Material[] = [
  {
    slug: 'cobre',
    name: 'Cobre',
    h1: 'Compra de cobre en Bucaramanga',
    symbol: 'Cu', number: '29', priority: 1,
    short: 'Cobre brillante, 1B y mixto. El metal que mejor se paga: llévalo limpio y separado.',
    metaTitle: 'Compra de Cobre en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de cobre en Bucaramanga: cobre brillante, 1B y mixto. Cotiza por WhatsApp con tu peso y fotos y vende hoy en Gama Metales.',
    items: ['Cobre brillante', 'Cobre 1B (primera)', 'Cobre mixto', 'Cable y alambre de cobre (consulta por WhatsApp)'],
    intro: 'En Gama Metales compramos cobre en todas sus calidades. El precio depende del tipo y de la limpieza del material, y cambia cada día, por eso lo cotizamos por WhatsApp con el peso aproximado y una foto.',
    tips: [
      'Separa el cobre brillante del mixto: mezclados se cotizan al precio más bajo.',
      'Quita plásticos, soldaduras y partes de otros metales cuando sea posible.',
      'Envía una foto clara y el peso aproximado para una cotización rápida.',
    ],
    faqs: [
      { q: '¿A cómo está el kilo de cobre hoy en Bucaramanga?', a: 'El precio cambia todos los días según el mercado y la calidad del cobre. Escríbenos por WhatsApp con el tipo y el peso y te damos el precio del día.' },
      { q: '¿Qué diferencia hay entre cobre brillante, 1B y mixto?', a: 'Es la calidad y limpieza del material: el brillante y el 1B son los más limpios y el mixto trae otros materiales o recubrimientos. Mientras más limpio, mejor se cotiza.' },
    ],
  },
  {
    slug: 'aluminio',
    name: 'Aluminio',
    h1: 'Compra de aluminio en Bucaramanga',
    symbol: 'Al', number: '13', priority: 1,
    short: 'Perfil, ollas, potes, guaya, rines y más. Limpio paga mucho más que contaminado.',
    metaTitle: 'Compra de Aluminio en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de aluminio en Bucaramanga: perfil, ollas, potes, guaya y rines. Mientras más limpio, mejor se cotiza. Pide el precio del día por WhatsApp.',
    items: ['Aluminio perfil limpio', 'Aluminio grueso y blando', 'Ollas y potes de aluminio', 'Guaya de aluminio', 'Planchas de litografía', 'Rines de auto, camión y bicicleta', 'Cilindros de moto', 'Persiana y aluminio contaminado'],
    intro: 'El aluminio es uno de los materiales que más se mueve en nuestra bodega. Compramos desde perfil limpio hasta aluminio revuelto o contaminado; el precio por kilo varía según el tipo y la limpieza.',
    tips: [
      'El perfil limpio (sin tornillos, caucho ni vidrio) se paga muy por encima del contaminado.',
      'Separa ollas y potes del aluminio grueso.',
      'Si son rines, indica si son de auto, camión o bicicleta.',
    ],
    faqs: [
      { q: '¿Compran aluminio revuelto o contaminado?', a: 'Sí, compramos todo tipo de aluminio. El aluminio limpio y separado se cotiza mejor que el revuelto o contaminado.' },
    ],
  },
  {
    slug: 'chatarra-hierro-acero',
    name: 'Chatarra de hierro y acero',
    h1: 'Compra de chatarra de hierro y acero en Bucaramanga',
    symbol: 'Fe', number: '26', priority: 1,
    short: 'Hierro, acero y chatarra ferrosa en grandes volúmenes, con recolección desde 300 kg.',
    metaTitle: 'Compra de Chatarra de Hierro y Acero en Bucaramanga',
    metaDescription: 'Compra de chatarra de hierro y acero en Bucaramanga. Recibimos grandes volúmenes y recogemos desde 300 kg. Cotiza por WhatsApp hoy mismo.',
    items: ['Hierro gris (fundición)', 'Chatarra de hierro', 'Acero', 'Acero papelillo', 'Acero voluminoso', 'Viruta de acero'],
    intro: 'La chatarra ferrosa es el material de mayor volumen. Si acumulas hierro o acero en tu casa, taller, obra o empresa, lo recibimos en bodega o lo recogemos desde 300 kg.',
    tips: [
      'Para volúmenes grandes, pide recolección: ahorras flete y tiempo.',
      'Indica si es hierro gris, acero o material voluminoso: se cotizan distinto.',
    ],
    faqs: [
      { q: '¿Desde cuántos kilos hacen recolección de chatarra?', a: 'Hacemos recolección desde 300 kg. Escríbenos por WhatsApp con tu ubicación y el material para coordinar.' },
    ],
  },
  {
    slug: 'bronce-y-radiadores',
    name: 'Bronce y radiadores',
    h1: 'Compra de bronce y radiadores en Bucaramanga',
    symbol: 'Cu·Sn', number: '29·50', priority: 2,
    short: 'Bronce, bronce pintado, radiadores de cobre, mixtos y de aluminio.',
    metaTitle: 'Compra de Bronce y Radiadores en Bucaramanga',
    metaDescription: 'Compramos bronce y radiadores de cobre, mixtos y de aluminio en Bucaramanga. Envía fotos y peso por WhatsApp y recibe tu cotización del día.',
    items: ['Bronce', 'Bronce pintado', 'Bronce vainilla', 'Viruta de bronce', 'Radiador de cobre', 'Radiador mixto', 'Radiador de aluminio'],
    intro: 'Compramos bronce en sus variantes y radiadores de distintos materiales. Cada tipo tiene un precio diferente, así que una foto del material acelera la cotización.',
    tips: ['Indica si el radiador es de cobre, mixto o aluminio.', 'No mezcles bronce con otros metales.'],
  },
  {
    slug: 'baterias',
    name: 'Baterías usadas',
    h1: 'Compra de baterías usadas en Bucaramanga',
    symbol: 'Pb', number: '82', priority: 2,
    short: 'Baterías de carro, camión, moto y estacionarias. Cotiza por tipo y cantidad.',
    metaTitle: 'Compra de Baterías Usadas en Bucaramanga | Gama Metales',
    metaDescription: 'Compra de baterías usadas en Bucaramanga: de carro, camión, moto y estacionarias. Cotiza por WhatsApp según el tipo de batería y la cantidad.',
    items: ['Baterías de carro (N40, N42, N48, N27)', 'Baterías 30H, 4D y 8D (camión y maquinaria)', 'Baterías de moto', 'Baterías estacionarias'],
    intro: 'Compramos baterías usadas de todos los tamaños. El valor depende del tipo (referencia) y de la cantidad, por eso pedimos que nos escribas la referencia que aparece en la batería.',
    tips: ['Envía la referencia (por ejemplo N40, 4D, 8D) y cuántas tienes.', 'Transpórtalas en posición vertical y sin abrirlas.'],
  },
  {
    slug: 'plomo-y-antimonio',
    name: 'Plomo y antimonio',
    h1: 'Compra de plomo y antimonio en Bucaramanga',
    symbol: 'Pb', number: '82', priority: 3,
    short: 'Plomo limpio, balancín y antimonio.',
    metaTitle: 'Compra de Plomo y Antimonio en Bucaramanga',
    metaDescription: 'Compra de plomo y antimonio en Bucaramanga: plomo limpio y balancín. Envía el peso aproximado por WhatsApp y te damos la cotización del día.',
    items: ['Plomo limpio', 'Balancín', 'Antimonio'],
    intro: 'Compramos plomo y antimonio. Cotizamos según el tipo y el peso, con el precio del día.',
    tips: ['Indica si es plomo limpio o balancín.'],
  },
  {
    slug: 'electrodomesticos',
    name: 'Neveras, lavadoras y televisores',
    h1: 'Compra de neveras, lavadoras y televisores usados en Bucaramanga',
    symbol: 'Cu·Al·Fe', number: '', priority: 2,
    short: 'Electrodomésticos y equipos electrónicos en desuso. Consulta por recolección.',
    metaTitle: 'Compra de Neveras, Lavadoras y TV Usados en Bucaramanga',
    metaDescription: 'Compramos neveras, lavadoras y televisores usados en Bucaramanga. Cotiza por WhatsApp con una foto y consulta por recolección desde 300 kg.',
    items: ['Neveras', 'Lavadoras', 'Televisores', 'Otros electrodomésticos y chatarra electrónica (consulta)'],
    intro: 'Si tienes electrodomésticos en desuso, te los compramos. Escríbenos con una foto y la cantidad; si son varios, coordinamos la recolección.',
    tips: ['Envía foto y cantidad.', 'Si completas 300 kg o más, podemos recogerlos.'],
  },
];
```

### 6.4 `src/data/faqs.ts`

```ts
export interface Faq { q: string; a: string }

export const HOME_FAQS: Faq[] = [
  { q: '¿Cuánto pagan por kilo de chatarra hoy?', a: 'Los precios cambian a diario según el mercado y la calidad del material. Escríbenos por WhatsApp con el tipo de metal, el peso aproximado y una foto, y te damos el precio del día.' },
  { q: '¿Qué metales compran en Bucaramanga?', a: 'Compramos todo tipo de metales: cobre, bronce, aluminio, hierro, acero, plomo, antimonio, radiadores, rines, baterías y electrodomésticos como neveras, lavadoras y televisores.' },
  { q: '¿Hacen recolección de chatarra a domicilio?', a: 'Sí, hacemos recolección desde 300 kg en Bucaramanga y municipios cercanos. Escríbenos por WhatsApp para coordinar.' },
  { q: '¿Cuál es el horario de la chatarrería?', a: 'Atendemos de lunes a viernes de 7:00 a. m. a 5:30 p. m. y los sábados de 7:00 a. m. a 1:30 p. m.' },
  { q: '¿Dónde queda Gama Metales?', a: 'Estamos en la Carrera 11 # 23-35, Bucaramanga, Santander. Plus code: 4VF9+J5.' },
  { q: '¿Compran material a empresas y talleres?', a: 'Sí. Atendemos a público en general y también a empresas, talleres e industrias que quieren vender chatarra y excedentes de metal acumulados.' },
];
```

### 6.5 `src/data/reviews.ts` y `src/data/gallery.ts`

```ts
// reviews.ts: copia SOLO reseñas reales de tu perfil de Google (con su autor).
export interface Review { author: string; text: string; date?: string }
export const REVIEWS: Review[] = [
  // { author: 'Nombre del cliente', text: 'Texto exacto de la reseña…', date: '2026-05' },
];
```

```ts
// gallery.ts: pon las fotos en src/assets/bodega/
import type { ImageMetadata } from 'astro';
// import bodega01 from '../assets/bodega/bodega-01.jpg';

export const GALLERY: { src: ImageMetadata; alt: string }[] = [
  // { src: bodega01, alt: 'Patio de la bodega de Gama Metales en Bucaramanga con metales clasificados' }, // TODO: describe lo que SÍ se ve
];
```

Las secciones de reseñas y galería **solo se renderizan si hay contenido**, así que el sitio no se ve vacío ni muestra datos falsos.


---

## 7. Utilidades: WhatsApp y JSON-LD

### 7.1 `src/lib/whatsapp.ts` (conversión sin base de datos)

El mensaje prellenado pide justo lo que necesitas para cotizar rápido: **tipo de metal, peso aproximado, si requiere recolección, ubicación y foto**. (WhatsApp no permite adjuntar fotos desde un enlace, por eso el mensaje avisa que la foto va en el siguiente envío.)

```ts
import { SITE } from '../data/site';

export const waLink = (text: string, number: string = SITE.phones[0].wa) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/** Mensaje para cotizar un material concreto (botón de cada tarjeta). */
export function quoteMessage({ material, pickup = false }: { material: string; pickup?: boolean }) {
  return [
    `Hola ${SITE.name}, quiero cotizar: *${material}*.`,
    `- Peso aproximado: ___ kg`,
    `- ¿Necesita recolección?: ${pickup ? `Sí (tengo ${SITE.pickup.minKg} kg o más)` : 'No, lo llevo a la bodega'}`,
    `- Ubicación o barrio: ___`,
    `Te envío una foto del material en el siguiente mensaje.`,
  ].join('\n');
}

export const priceListMessage = () =>
  `Hola ${SITE.name}, ¿me comparten la lista de precios de hoy, por favor?`;

export const generalMessage = () =>
  [
    `Hola ${SITE.name}, quiero cotizar mi chatarra.`,
    `- Tipo de metal: ___`,
    `- Peso aproximado: ___ kg`,
    `- ¿Necesita recolección?: ___`,
    `- Ubicación o barrio: ___`,
  ].join('\n');
```

### 7.2 `src/lib/schema.ts` (anti-error #8)

`RecyclingCenter` es un subtipo de `LocalBusiness` en schema.org; se declaran ambos. **No se incluye `priceRange`** (decidiste no publicar precios; no es obligatorio) ni `aggregateRating` (Google no muestra estrellas por reseñas que el propio negocio marca en su web; las reseñas se muestran como contenido visible).

```ts
import { SITE } from '../data/site';
import { MATERIALS } from '../data/materials';
import type { Faq } from '../data/faqs';

export const businessSchema = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': ['RecyclingCenter', 'LocalBusiness'],
  '@id': `${siteUrl}/#negocio`,
  name: SITE.name,
  alternateName: `Chatarrería ${SITE.name}`,
  description: SITE.description,
  slogan: SITE.slogan,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/logo.png`,
  image: [`${siteUrl}/og/default.jpg`],
  telephone: SITE.phones[0].e164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
    ...(SITE.address.postalCode && { postalCode: SITE.address.postalCode }),
  },
  geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  hasMap: SITE.mapsUrl,
  openingHoursSpecification: SITE.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  areaServed: SITE.pickup.zones.map((z) => ({ '@type': 'City', name: z })),
  contactPoint: SITE.phones.map((p) => ({
    '@type': 'ContactPoint',
    telephone: p.e164,
    contactType: 'customer service',
    areaServed: 'CO',
    availableLanguage: 'Spanish',
  })),
  knowsAbout: ['Compra de chatarra', 'Reciclaje de metales', 'Cobre', 'Aluminio', 'Hierro', 'Bronce', 'Baterías usadas'],
  ...(SITE.sameAs.length && { sameAs: SITE.sameAs }),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Compra de chatarra y metales',
    itemListElement: MATERIALS.map((m) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: `Compra de ${m.name.toLowerCase()}`,
        serviceType: 'Compra de chatarra y reciclaje de metales',
        areaServed: SITE.city,
        url: `${siteUrl}/materiales/${m.slug}/`,
      },
    })),
  },
});

export const websiteSchema = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#web`,
  url: `${siteUrl}/`,
  name: SITE.name,
  inLanguage: SITE.lang,
  publisher: { '@id': `${siteUrl}/#negocio` },
});

export const breadcrumbSchema = (siteUrl: string, items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Inicio', path: '/' }, ...items].map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${siteUrl}${it.path}`,
  })),
});

// Las FAQ deben coincidir 1:1 con el texto visible de la página.
export const faqSchema = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
```

---

## 8. Componentes y layout

### 8.1 `src/components/SEO.astro` (anti-errores #1, #5, #6, #7, #8, #11, #14)

```astro
---
import { SITE } from '../data/site';
import { ALLOW_INDEXING } from 'astro:env/server';

export interface Props {
  title: string;
  description: string;
  image?: string; // ruta en /public o URL absoluta, 1200x630
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object[];
}

const {
  title,
  description,
  image = '/og/default.jpg',
  imageAlt = `${SITE.name}: chatarrería y compra de metales en ${SITE.city}`,
  type = 'website',
  noindex = false,
  jsonLd = [],
} = Astro.props;

// Canonical SIEMPRE sobre el dominio configurado en SITE_URL (nunca el host que sirva la petición).
const canonical = new URL(Astro.url.pathname, Astro.site).href;
const ogImage = new URL(image, Astro.site).href;
const robots = ALLOW_INDEXING && !noindex ? 'index, follow, max-image-preview:large' : 'noindex, nofollow';
const ld = (o: object) => JSON.stringify(o).replace(/</g, '\\u003c');
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta name="robots" content={robots} />
<meta name="theme-color" content="#1a0833" />

<!-- Favicons (anti-error #14) -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="sitemap" href="/sitemap-index.xml" />

<!-- Open Graph + Twitter (anti-error #7) -->
<meta property="og:type" content={type} />
<meta property="og:site_name" content={SITE.name} />
<meta property="og:locale" content={SITE.locale} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={imageAlt} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- Datos estructurados (anti-error #8) -->
{jsonLd.map((obj) => <script is:inline type="application/ld+json" set:html={ld(obj)} />)}
```

### 8.2 `src/layouts/Layout.astro` (anti-error #16)

```astro
---
import '../styles/global.css';
import SEO from '../components/SEO.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import WhatsAppFloat from '../components/WhatsAppFloat.astro';

interface Props {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  jsonLd?: object[];
}
const props = Astro.props;
---

<!doctype html>
<html lang="es-CO">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEO {...props} />
  </head>
  <body class="pb-20 sm:pb-0">
    <a href="#contenido" class="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-copper-500 focus:px-4 focus:py-2 focus:font-bold focus:text-brand-950">Saltar al contenido</a>
    <Header />
    <main id="contenido"><slot /></main>
    <Footer />
    <WhatsAppFloat />
  </body>
</html>
```

> El `<h1>` **nunca** va en el Layout ni en Header/Footer: lo declara cada página (anti-errores #9 y #10). El logo es un `<a>`, no un encabezado.

### 8.3 `src/components/Header.astro` (menú móvil sin JS)

```astro
---
import { NAV, SITE } from '../data/site';
import { waLink, priceListMessage } from '../lib/whatsapp';
const path = Astro.url.pathname;
const current = (href: string) => (path.startsWith(href) ? 'page' : undefined);
---

<header class="sticky top-0 z-40 border-b border-white/10 bg-brand-950/95 text-white backdrop-blur">
  <div class="container-x flex h-16 items-center justify-between gap-4">
    <a href="/" class="font-display text-2xl font-extrabold uppercase tracking-tight" aria-label={`${SITE.name}, ir al inicio`}>
      Gama<span class="text-copper-500">Metales</span>
    </a>

    <nav aria-label="Principal" class="hidden items-center gap-7 md:flex">
      {NAV.map((i) => <a href={i.href} aria-current={current(i.href)} class="text-sm font-semibold hover:text-copper-500 aria-[current=page]:text-copper-500">{i.label}</a>)}
    </nav>

    <div class="flex items-center gap-2">
      <a href={waLink(priceListMessage())} target="_blank" rel="noopener noreferrer" class="btn btn-wa !px-4 !py-2 text-sm">Precio de hoy</a>
      <details class="relative md:hidden">
        <summary class="cursor-pointer list-none rounded-md border border-white/30 px-3 py-2 text-sm font-bold">Menú</summary>
        <nav aria-label="Menú móvil" class="absolute right-0 mt-2 w-56 rounded-lg bg-brand-900 p-2 shadow-xl">
          {NAV.map((i) => <a href={i.href} class="block rounded px-3 py-3 font-semibold hover:bg-white/10">{i.label}</a>)}
        </nav>
      </details>
    </div>
  </div>
</header>
```

### 8.4 `src/components/Footer.astro` (NAP consistente con Google Business)

```astro
---
import { SITE, NAV } from '../data/site';
const year = new Date().getFullYear();
---

<footer class="bg-brand-950 text-white/80">
  <div class="hazard" aria-hidden="true"></div>
  <div class="container-x grid gap-10 py-12 md:grid-cols-3">
    <div>
      <p class="font-display text-3xl font-extrabold uppercase text-white">Gama<span class="text-copper-500">Metales</span></p>
      <p class="mt-2 text-sm">{SITE.slogan}</p>
      <p class="mt-4 text-sm">Chatarrería en {SITE.city} con más de {SITE.yearsOfExperience} años de servicio.</p>
    </div>
    <address class="text-sm not-italic">
      <p class="font-bold text-white">Dirección</p>
      <p>{SITE.address.street}{SITE.address.neighborhood && `, ${SITE.address.neighborhood}`}</p>
      <p>{SITE.city}, {SITE.region}</p>
      <a class="mt-1 inline-block text-copper-500 underline" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
      <p class="mt-4 font-bold text-white">Teléfonos / WhatsApp</p>
      {SITE.phones.map((p) => <p><a class="hover:text-copper-500" href={`tel:${p.e164}`}>{p.display}</a></p>)}
      <p class="mt-4 font-bold text-white">Horario</p>
      {SITE.hours.map((h) => <p>{h.label}: {h.display}</p>)}
    </address>
    <nav aria-label="Pie de página" class="text-sm">
      <p class="font-bold text-white">Explora</p>
      <ul class="mt-2 space-y-2">
        {NAV.map((i) => <li><a class="hover:text-copper-500" href={i.href}>{i.label}</a></li>)}
      </ul>
    </nav>
  </div>
  <p class="border-t border-white/10 py-4 text-center text-xs">© {year} {SITE.name}. Compra de chatarra y reciclaje de metales en {SITE.city}.</p>
</footer>
```

### 8.5 `src/components/WhatsAppFloat.astro` (botón flotante accesible)

Es un enlace normal (cero JS). En móvil es un círculo de 56 px, respeta la zona segura del iPhone y el `<body>` lleva `pb-20` para que **nunca tape el último contenido**.

```astro
---
import { SITE } from '../data/site';
import { waLink, generalMessage } from '../lib/whatsapp';
---

<a
  href={waLink(generalMessage())}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`Escribir por WhatsApp a ${SITE.name} para cotizar tu chatarra (se abre en una pestaña nueva)`}
  class="fixed right-4 z-50 flex h-14 items-center justify-center gap-2 rounded-full bg-wa px-4 font-bold text-ink shadow-xl ring-2 ring-white/70 transition hover:scale-105 sm:px-6"
  style="bottom: max(1rem, env(safe-area-inset-bottom))"
>
  <svg viewBox="0 0 24 24" class="h-7 w-7 flex-none" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2z" />
    <path fill="#25d366" d="M9 7.6c-.3 0-.6.1-.8.4-.5.6-.9 1.3-.5 2.4.6 1.7 2.2 3.5 4 4.4 1.3.6 2 .5 2.7.1.3-.2.7-.6.8-1 .1-.3 0-.5-.2-.6l-1.5-.8c-.2-.1-.4 0-.5.1l-.6.7c-.1.1-.3.2-.5.1-.9-.4-1.9-1.3-2.4-2.2-.1-.2-.1-.4 0-.5l.5-.6c.1-.1.1-.3 0-.5l-.7-1.6c-.1-.2-.3-.3-.5-.3z" />
  </svg>
  <span class="hidden sm:inline">Cotiza por WhatsApp</span>
</a>
```

> Sustituye el ícono por el logo oficial de WhatsApp (Brand Resources de WhatsApp o `simple-icons`) cuando quieras. Mantén `aria-hidden="true"` en el SVG.

### 8.6 `src/components/MaterialCard.astro` ("Cotizar este material ahora")

Cada tarjeta tiene **dos botones sin JS**: cotizar (lo llevo a la bodega) y pedir recolección. Los dos abren `wa.me` con el material y el tipo de entrega ya escritos.

```astro
---
import type { Material } from '../data/materials';
import { waLink, quoteMessage } from '../lib/whatsapp';

interface Props { material: Material; level?: 'h2' | 'h3' }
const { material: m, level = 'h3' } = Astro.props;
const Heading = level;
const compact = m.symbol.length > 3;
---

<article class="flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
  <div class="flex items-start gap-4">
    <div class="tile" aria-hidden="true">
      <span class="text-[10px] font-bold leading-none">{m.number}</span>
      <span class:list={['font-display font-extrabold leading-none', compact ? 'text-xl' : 'text-4xl']}>{m.symbol}</span>
    </div>
    <div>
      <Heading class="text-2xl text-brand-900">
        <a href={`/materiales/${m.slug}/`} class="hover:text-brand-700">{m.name}</a>
      </Heading>
      <p class="mt-1 text-sm text-ink/80">{m.short}</p>
    </div>
  </div>

  <ul class="mt-4 flex flex-wrap gap-2 text-xs">
    {m.items.slice(0, 4).map((i) => <li class="rounded-full bg-brand-100 px-3 py-1 font-semibold text-brand-900">{i}</li>)}
  </ul>

  <div class="mt-auto grid gap-2 pt-5">
    <a
      class="btn btn-primary"
      href={waLink(quoteMessage({ material: m.name }))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Cotizar ${m.name} por WhatsApp (se abre en una pestaña nueva)`}
    >Cotizar este material ahora</a>
    <a
      class="btn btn-outline !py-2 text-sm"
      href={waLink(quoteMessage({ material: m.name, pickup: true }))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Pedir recolección de ${m.name} por WhatsApp (se abre en una pestaña nueva)`}
    >Necesito recolección ({'+'}300 kg)</a>
  </div>
</article>
```

### 8.7 `src/components/FaqList.astro`

```astro
---
import type { Faq } from '../data/faqs';
interface Props { faqs: Faq[] }
const { faqs } = Astro.props;
---

<div class="divide-y divide-brand-100 overflow-hidden rounded-xl border border-brand-100 bg-white">
  {faqs.map((f) => (
    <details class="p-5 open:bg-brand-50">
      <summary class="cursor-pointer font-bold text-brand-900">
        <h3 class="inline font-sans text-lg font-bold normal-case leading-snug tracking-normal">{f.q}</h3>
      </summary>
      <p class="mt-3 text-ink/80">{f.a}</p>
    </details>
  ))}
</div>
```

### 8.8 `src/components/QuoteForm.astro` (único JS del sitio, ~1 KB)

Construye en vivo el enlace de WhatsApp con material, peso, recolección y barrio. **Sin JS sigue funcionando**: el botón trae un enlace por defecto.

```astro
---
import { MATERIALS } from '../data/materials';
import { SITE } from '../data/site';
import { waLink, generalMessage } from '../lib/whatsapp';
---

<form id="quote-form" data-wa={SITE.phones[0].wa} data-brand={SITE.name} class="grid gap-4 rounded-2xl bg-white p-6 shadow-lg" aria-labelledby="quote-title" onsubmit="return false">
  <p id="quote-title" class="font-display text-3xl font-extrabold uppercase text-brand-900">Cotiza en 30 segundos</p>
  <label class="grid gap-1 text-sm font-semibold">Material
    <select name="material" class="rounded-lg border border-brand-100 bg-white p-3 font-normal">
      {MATERIALS.map((m) => <option value={m.name}>{m.name}</option>)}
      <option value="Otro metal">Otro metal</option>
    </select>
  </label>
  <label class="grid gap-1 text-sm font-semibold">Peso aproximado (kg)
    <input name="kg" inputmode="numeric" placeholder="Ej. 150" class="rounded-lg border border-brand-100 p-3 font-normal" />
  </label>
  <label class="grid gap-1 text-sm font-semibold">Barrio o ubicación
    <input name="zona" autocomplete="off" placeholder="Ej. Floridablanca" class="rounded-lg border border-brand-100 p-3 font-normal" />
  </label>
  <label class="flex items-center gap-3 text-sm font-semibold">
    <input type="checkbox" name="pickup" class="h-5 w-5 accent-brand-700" /> Necesito recolección en mi sitio
  </label>
  <a id="quote-link" class="btn btn-wa" href={waLink(generalMessage())} target="_blank" rel="noopener noreferrer">Enviar cotización por WhatsApp</a>
  <p class="text-xs text-ink/70">Después de abrir WhatsApp, adjunta una foto del material para cotizarte más rápido.</p>
</form>

<script>
  const form = document.querySelector<HTMLFormElement>('#quote-form');
  const link = document.querySelector<HTMLAnchorElement>('#quote-link');
  if (form && link) {
    const update = () => {
      const d = new FormData(form);
      const kg = String(d.get('kg') ?? '').trim();
      const zona = String(d.get('zona') ?? '').trim();
      const text = [
        `Hola ${form.dataset.brand}, quiero cotizar: *${d.get('material')}*.`,
        `- Peso aproximado: ${kg ? kg + ' kg' : '___ kg'}`,
        `- ¿Necesita recolección?: ${d.get('pickup') ? 'Sí' : 'No, lo llevo a la bodega'}`,
        `- Ubicación o barrio: ${zona || '___'}`,
        `Te envío una foto del material en el siguiente mensaje.`,
      ].join('\n');
      link.href = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`;
    };
    form.addEventListener('input', update);
    update();
  }
</script>
```

---

## 9. Páginas

### 9.1 `src/pages/index.astro` (Inicio)

```astro
---
import Layout from '../layouts/Layout.astro';
import MaterialCard from '../components/MaterialCard.astro';
import FaqList from '../components/FaqList.astro';
import { Image } from 'astro:assets';
import { SITE } from '../data/site';
import { PAGES } from '../data/seo';
import { MATERIALS } from '../data/materials';
import { HOME_FAQS } from '../data/faqs';
import { REVIEWS } from '../data/reviews';
import { GALLERY } from '../data/gallery';
import { waLink, priceListMessage, generalMessage } from '../lib/whatsapp';
import { businessSchema, websiteSchema, faqSchema } from '../lib/schema';

const siteUrl = Astro.site!.origin;
const ticker = ['Cobre', 'Bronce', 'Aluminio', 'Hierro', 'Acero', 'Plomo', 'Baterías', 'Radiadores', 'Neveras', 'Rines'];
---

<Layout {...PAGES.home} jsonLd={[websiteSchema(siteUrl), businessSchema(siteUrl), faqSchema(HOME_FAQS)]}>
  <!-- HERO -->
  <section class="hero-bg text-white">
    <div class="container-x grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div>
        <p class="mb-4 inline-block rounded bg-copper-500 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-950">
          +{SITE.yearsOfExperience} años · {SITE.city}, {SITE.region}
        </p>
        <h1 class="text-5xl sm:text-7xl">
          Chatarrería en Bucaramanga: <span class="text-copper-500">compramos tu chatarra y todo tipo de metales</span>
        </h1>
        <p class="mt-6 max-w-xl text-lg text-white/85">
          Cobre, aluminio, hierro, bronce, baterías y más. Escríbenos por WhatsApp, recibe el <strong>precio del día</strong> y vende hoy. Recolección desde {SITE.pickup.minKg} kg.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a class="btn btn-wa text-lg" href={waLink(generalMessage())} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp</a>
          <a class="btn btn-ghost text-lg" href="/materiales/">Ver qué compramos</a>
        </div>
        <p class="mt-6 font-display text-xl font-bold uppercase tracking-wide text-copper-500">{SITE.slogan}</p>
      </div>

      <!-- Tarjeta "lista de precios del día" (diferenciador + conversión) -->
      <aside class="rotate-1 rounded-2xl border-4 border-copper-500 bg-white p-6 text-ink shadow-2xl" aria-label="Lista de precios del día">
        <p class="text-xs font-extrabold uppercase tracking-widest text-brand-700">Se actualiza todos los días</p>
        <p class="mt-1 font-display text-4xl font-extrabold uppercase text-brand-900">Lista de precios de hoy</p>
        <p class="mt-2 text-sm text-ink/80">Los precios por kilo cambian a diario. Pídela y te la enviamos por WhatsApp.</p>
        <a class="btn btn-primary mt-4 w-full" href={waLink(priceListMessage())} target="_blank" rel="noopener noreferrer">Pedir precios de hoy</a>
      </aside>
    </div>

    <!-- Cinta de materiales (CSS puro) -->
    <div class="overflow-hidden border-y border-white/10 bg-brand-900 py-3" aria-hidden="true">
      <div class="ticker-track font-display text-2xl font-bold uppercase tracking-widest text-white/80">
        {[0, 1].map(() => ticker.map((t) => <span class="px-6">{t} <span class="text-copper-500">◆</span></span>))}
      </div>
    </div>
    <div class="hazard" aria-hidden="true"></div>
  </section>

  <!-- CONFIANZA -->
  <section class="container-x grid gap-4 py-10 sm:grid-cols-3" aria-label="Por qué elegirnos">
    {[
      [`+${SITE.yearsOfExperience} años`, 'de experiencia comprando chatarra en Bucaramanga'],
      ['Lun a sáb', 'Lunes a viernes 7:00 a. m. a 5:30 p. m. · sábados hasta 1:30 p. m.'],
      [`Desde ${SITE.pickup.minKg} kg`, 'recolección a domicilio en Bucaramanga y zonas cercanas'],
    ].map(([big, small]) => (
      <div class="rounded-xl bg-white p-5 shadow-sm"><p class="font-display text-4xl font-extrabold uppercase text-brand-700">{big}</p><p class="text-sm text-ink/80">{small}</p></div>
    ))}
  </section>

  <!-- MATERIALES -->
  <section class="container-x py-12" aria-labelledby="materiales">
    <h2 id="materiales" class="text-4xl text-brand-900 sm:text-5xl">Qué metales compramos en Bucaramanga</h2>
    <p class="mt-3 max-w-2xl text-ink/80">Compramos todo tipo de metales y chatarra. Estas son las familias más frecuentes; si no ves el tuyo, escríbenos: lo más probable es que también lo recibamos.</p>
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {MATERIALS.map((m) => <MaterialCard material={m} level="h3" />)}
    </div>
  </section>

  <!-- CÓMO FUNCIONA -->
  <section class="bg-brand-900 py-14 text-white" aria-labelledby="como">
    <div class="container-x">
      <h2 id="como" class="text-4xl sm:text-5xl">Cómo vender tu chatarra en 3 pasos</h2>
      <ol class="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ['1', 'Escríbenos por WhatsApp', 'Cuéntanos el tipo de metal, el peso aproximado y envía una foto.'],
          ['2', 'Recibe tu cotización', 'Te damos el precio del día según el material y su limpieza.'],
          ['3', 'Llévalo o lo recogemos', `Tráelo a la bodega o coordinamos recolección desde ${SITE.pickup.minKg} kg.`],
        ].map(([n, t, d]) => (
          <li class="rounded-xl border border-white/15 bg-white/5 p-6"><p class="font-display text-6xl font-extrabold text-copper-500">{n}</p><h3 class="mt-1 text-2xl">{t}</h3><p class="mt-2 text-white/80">{d}</p></li>
        ))}
      </ol>
    </div>
  </section>

  <!-- EMPRESAS (temporada) -->
  <section class="container-x py-14" aria-labelledby="empresas">
    <div class="grid items-center gap-6 rounded-2xl bg-copper-500 p-8 text-brand-950 md:grid-cols-[1fr_auto]">
      <div>
        <h2 id="empresas" class="text-4xl sm:text-5xl">¿Tu empresa acumuló chatarra este año?</h2>
        <p class="mt-3 max-w-2xl font-medium">Es el momento de despejar bodegas y convertir excedentes de metal en dinero. Atendemos empresas, talleres e industrias de Bucaramanga y el área metropolitana.</p>
      </div>
      <a class="btn bg-brand-950 text-white hover:bg-brand-900" href="/empresas/">Vender mis excedentes</a>
    </div>
  </section>

  <!-- GALERÍA (solo si hay fotos) -->
  {GALLERY.length > 0 && (
    <section class="container-x pb-14" aria-labelledby="bodega">
      <h2 id="bodega" class="text-4xl text-brand-900 sm:text-5xl">Nuestra bodega en Bucaramanga</h2>
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map((g) => <Image src={g.src} alt={g.alt} widths={[400, 800]} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" class="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />)}
      </div>
    </section>
  )}

  <!-- RESEÑAS (solo si hay reseñas reales) -->
  {REVIEWS.length > 0 && (
    <section class="bg-white py-14" aria-labelledby="resenas">
      <div class="container-x">
        <h2 id="resenas" class="text-4xl text-brand-900 sm:text-5xl">Lo que dicen nuestros clientes</h2>
        <div class="mt-6 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure class="rounded-xl bg-brand-50 p-6"><blockquote class="text-ink/90">{r.text}</blockquote><figcaption class="mt-3 text-sm font-bold text-brand-700">{r.author}{r.date && ` · ${r.date}`}</figcaption></figure>
          ))}
        </div>
        {SITE.gbpUrl && <a class="mt-6 inline-block font-bold text-brand-700 underline" href={SITE.gbpUrl} target="_blank" rel="noopener noreferrer">Ver todas las reseñas en Google</a>}
      </div>
    </section>
  )}

  <!-- UBICACIÓN + FAQ -->
  <section class="container-x grid gap-10 py-14 lg:grid-cols-2" aria-labelledby="ubicacion">
    <div>
      <h2 id="ubicacion" class="text-4xl text-brand-900 sm:text-5xl">Dónde estamos en Bucaramanga</h2>
      <address class="mt-4 not-italic text-lg">
        <p><strong>{SITE.address.street}</strong>, {SITE.city}, {SITE.region}</p>
        <p class="text-sm text-ink/70">Plus code: {SITE.address.plusCode}</p>
        {SITE.hours.map((h) => <p class="mt-1">{h.label}: {h.display}</p>)}
      </address>
      <a class="btn btn-outline mt-5" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar en Google Maps</a>
    </div>
    <div>
      <h2 class="text-4xl text-brand-900 sm:text-5xl">Preguntas frecuentes</h2>
      <div class="mt-6"><FaqList faqs={HOME_FAQS} /></div>
    </div>
  </section>
</Layout>
```

**Jerarquía de encabezados de Inicio:** `H1` (único, keyword + ciudad) → `H2` Qué metales compramos → `H3` por material · `H2` Cómo vender en 3 pasos → `H3` por paso · `H2` Empresas · `H2` Bodega · `H2` Reseñas · `H2` Dónde estamos · `H2` Preguntas frecuentes → `H3` por pregunta.

### 9.2 `src/pages/materiales/index.astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
import MaterialCard from '../../components/MaterialCard.astro';
import { PAGES } from '../../data/seo';
import { MATERIALS } from '../../data/materials';
import { waLink, priceListMessage } from '../../lib/whatsapp';
import { breadcrumbSchema } from '../../lib/schema';
const siteUrl = Astro.site!.origin;
---

<Layout {...PAGES.materiales} jsonLd={[breadcrumbSchema(siteUrl, [{ name: 'Materiales', path: '/materiales/' }])]}>
  <section class="hero-bg text-white">
    <div class="container-x py-14 sm:py-20">
      <h1 class="max-w-4xl text-5xl sm:text-6xl">Compra de metales y chatarra en <span class="text-copper-500">Bucaramanga</span></h1>
      <p class="mt-5 max-w-2xl text-lg text-white/85">Compramos todo tipo de metales: cobre, bronce, aluminio, hierro, acero, plomo, baterías, radiadores, rines y electrodomésticos. Pagamos según el precio del día, que cambia a diario: escríbenos y te cotizamos.</p>
      <a class="btn btn-wa mt-7 text-lg" href={waLink(priceListMessage())} target="_blank" rel="noopener noreferrer">Pedir precios de hoy</a>
    </div>
    <div class="hazard" aria-hidden="true"></div>
  </section>

  <section class="container-x py-12" aria-labelledby="lista">
    <h2 id="lista" class="text-4xl text-brand-900">Materiales que recibimos</h2>
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {MATERIALS.map((m) => <MaterialCard material={m} level="h3" />)}
    </div>
  </section>

  <section class="container-x pb-14" aria-labelledby="otros">
    <h2 id="otros" class="text-4xl text-brand-900">¿No ves tu material?</h2>
    <p class="mt-3 max-w-2xl text-ink/80">Si es metal, lo más probable es que lo compremos. Envíanos una foto por WhatsApp con el peso aproximado y te confirmamos.</p>
  </section>
</Layout>
```

### 9.3 `src/pages/materiales/[slug].astro` (7 URLs generadas desde los datos)

```astro
---
import Layout from '../../layouts/Layout.astro';
import FaqList from '../../components/FaqList.astro';
import MaterialCard from '../../components/MaterialCard.astro';
import { MATERIALS } from '../../data/materials';
import { SITE } from '../../data/site';
import { waLink, quoteMessage } from '../../lib/whatsapp';
import { breadcrumbSchema, faqSchema } from '../../lib/schema';

export function getStaticPaths() {
  return MATERIALS.map((m) => ({ params: { slug: m.slug }, props: { m } }));
}
const { m } = Astro.props;
const siteUrl = Astro.site!.origin;
const related = MATERIALS.filter((x) => x.slug !== m.slug).slice(0, 3);
const ld = [
  breadcrumbSchema(siteUrl, [{ name: 'Materiales', path: '/materiales/' }, { name: m.name, path: `/materiales/${m.slug}/` }]),
  ...(m.faqs?.length ? [faqSchema(m.faqs)] : []),
];
---

<Layout title={m.metaTitle} description={m.metaDescription} jsonLd={ld}>
  <section class="hero-bg text-white">
    <div class="container-x py-14 sm:py-20">
      <nav aria-label="Migas de pan" class="mb-4 text-sm text-white/70"><a href="/" class="underline">Inicio</a> / <a href="/materiales/" class="underline">Materiales</a> / {m.name}</nav>
      <h1 class="max-w-4xl text-5xl sm:text-6xl">{m.h1}</h1>
      <p class="mt-5 max-w-2xl text-lg text-white/85">{m.intro}</p>
      <div class="mt-7 flex flex-wrap gap-3">
        <a class="btn btn-wa text-lg" href={waLink(quoteMessage({ material: m.name }))} target="_blank" rel="noopener noreferrer">Cotizar este material ahora</a>
        <a class="btn btn-ghost text-lg" href={waLink(quoteMessage({ material: m.name, pickup: true }))} target="_blank" rel="noopener noreferrer">Pedir recolección</a>
      </div>
    </div>
    <div class="hazard" aria-hidden="true"></div>
  </section>

  <div class="container-x grid gap-12 py-12 lg:grid-cols-2">
    <section aria-labelledby="que">
      <h2 id="que" class="text-4xl text-brand-900">Qué tipos de {m.name.toLowerCase()} compramos</h2>
      <ul class="mt-5 grid gap-2">{m.items.map((i) => <li class="rounded-lg bg-white p-3 font-semibold shadow-sm">✓ {i}</li>)}</ul>
    </section>
    <section aria-labelledby="tips">
      <h2 id="tips" class="text-4xl text-brand-900">Cómo conseguir una mejor cotización</h2>
      <ul class="mt-5 grid gap-3">{m.tips.map((t) => <li class="rounded-lg border-l-4 border-copper-500 bg-white p-4">{t}</li>)}</ul>
      <p class="mt-5 text-sm text-ink/80">El precio por kilo cambia cada día. Escríbenos por WhatsApp y te damos el valor actual. Atendemos en {SITE.address.street}, {SITE.city}.</p>
    </section>
  </div>

  {m.faqs && (
    <section class="container-x pb-12" aria-labelledby="faq">
      <h2 id="faq" class="text-4xl text-brand-900">Preguntas frecuentes sobre {m.name.toLowerCase()}</h2>
      <div class="mt-6 max-w-3xl"><FaqList faqs={m.faqs} /></div>
    </section>
  )}

  <section class="container-x pb-14" aria-labelledby="otros">
    <h2 id="otros" class="text-4xl text-brand-900">También compramos</h2>
    <div class="mt-6 grid gap-5 md:grid-cols-3">{related.map((r) => <MaterialCard material={r} level="h3" />)}</div>
  </section>
</Layout>
```

### 9.4 `src/pages/recoleccion-de-chatarra.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import FaqList from '../components/FaqList.astro';
import { PAGES } from '../data/seo';
import { SITE } from '../data/site';
import { waLink, quoteMessage } from '../lib/whatsapp';
import { breadcrumbSchema, faqSchema } from '../lib/schema';

const siteUrl = Astro.site!.origin;
const faqs = [
  { q: '¿Desde cuántos kilos recogen la chatarra?', a: `Hacemos recolección a domicilio desde ${SITE.pickup.minKg} kg.` },
  { q: '¿Qué zonas cubren?', a: `Atendemos ${SITE.pickup.zones.join(', ')}. Escríbenos tu ubicación y te confirmamos.` },
  { q: '¿Cuánto cuesta la recolección?', a: 'Depende del material, el peso y la ubicación. Cuéntanos por WhatsApp y lo coordinamos junto con tu cotización.' },
];
---

<Layout {...PAGES.recoleccion} jsonLd={[breadcrumbSchema(siteUrl, [{ name: 'Recolección de chatarra', path: '/recoleccion-de-chatarra/' }]), faqSchema(faqs)]}>
  <section class="hero-bg text-white">
    <div class="container-x py-14 sm:py-20">
      <h1 class="max-w-4xl text-5xl sm:text-6xl">Recolección de chatarra a domicilio en <span class="text-copper-500">Bucaramanga</span></h1>
      <p class="mt-5 max-w-2xl text-lg text-white/85">¿Tienes {SITE.pickup.minKg} kg o más de chatarra? Vamos por ella. Cotizamos el material y coordinamos la visita por WhatsApp.</p>
      <a class="btn btn-wa mt-7 text-lg" href={waLink(quoteMessage({ material: 'Chatarra (varios metales)', pickup: true }))} target="_blank" rel="noopener noreferrer">Solicitar recolección</a>
    </div>
    <div class="hazard" aria-hidden="true"></div>
  </section>

  <div class="container-x grid gap-12 py-12 lg:grid-cols-2">
    <section aria-labelledby="como">
      <h2 id="como" class="text-4xl text-brand-900">Cómo funciona la recolección</h2>
      <ol class="mt-5 grid gap-3">
        <li class="rounded-lg bg-white p-4 shadow-sm"><h3 class="text-xl text-brand-700">1. Escríbenos</h3><p>Material, peso aproximado, ubicación y una foto.</p></li>
        <li class="rounded-lg bg-white p-4 shadow-sm"><h3 class="text-xl text-brand-700">2. Cotizamos</h3><p>Te damos el precio del día y confirmamos la cobertura.</p></li>
        <li class="rounded-lg bg-white p-4 shadow-sm"><h3 class="text-xl text-brand-700">3. Recogemos</h3><p>Coordinamos día y hora, pesamos y liquidamos.</p></li>
      </ol>
    </section>
    <section aria-labelledby="zonas">
      <h2 id="zonas" class="text-4xl text-brand-900">Zonas de cobertura</h2>
      <ul class="mt-5 flex flex-wrap gap-2">{SITE.pickup.zones.map((z) => <li class="rounded-full bg-brand-900 px-4 py-2 font-bold text-white">{z}</li>)}</ul>
      <h2 class="mt-10 text-4xl text-brand-900">Qué enviar por WhatsApp</h2>
      <ul class="mt-4 list-disc space-y-1 pl-5"><li>Tipo de metal</li><li>Peso aproximado</li><li>Dirección o barrio</li><li>Foto del material</li></ul>
    </section>
  </div>

  <section class="container-x pb-14" aria-labelledby="faq">
    <h2 id="faq" class="text-4xl text-brand-900">Preguntas frecuentes</h2>
    <div class="mt-6 max-w-3xl"><FaqList faqs={faqs} /></div>
  </section>
</Layout>
```

### 9.5 `src/pages/empresas.astro`

Sin prometer servicios que no confirmaste (certificados de disposición, desmontes): se centra en **venta de excedentes y material acumulado**.

```astro
---
import Layout from '../layouts/Layout.astro';
import { PAGES } from '../data/seo';
import { SITE } from '../data/site';
import { waLink, quoteMessage } from '../lib/whatsapp';
import { breadcrumbSchema } from '../lib/schema';
const siteUrl = Astro.site!.origin;
---

<Layout {...PAGES.empresas} jsonLd={[breadcrumbSchema(siteUrl, [{ name: 'Empresas', path: '/empresas/' }])]}>
  <section class="hero-bg text-white">
    <div class="container-x py-14 sm:py-20">
      <h1 class="max-w-4xl text-5xl sm:text-6xl">Venta de chatarra y excedentes de metal para empresas en <span class="text-copper-500">Bucaramanga</span></h1>
      <p class="mt-5 max-w-2xl text-lg text-white/85">¿Tu empresa, taller o fábrica guardó material durante el año? Cotizamos grandes volúmenes y coordinamos la recolección desde {SITE.pickup.minKg} kg.</p>
      <a class="btn btn-wa mt-7 text-lg" href={waLink(quoteMessage({ material: 'Excedentes de metal de mi empresa', pickup: true }))} target="_blank" rel="noopener noreferrer">Cotizar para mi empresa</a>
    </div>
    <div class="hazard" aria-hidden="true"></div>
  </section>

  <div class="container-x grid gap-12 py-12 lg:grid-cols-2">
    <section aria-labelledby="que">
      <h2 id="que" class="text-4xl text-brand-900">Qué materiales industriales compramos</h2>
      <ul class="mt-5 grid gap-2">
        {['Chatarra de hierro y acero', 'Cobre, bronce y aluminio', 'Viruta de bronce, acero y aluminio', 'Radiadores, rines y baterías', 'Plomo y antimonio', 'Equipos y electrodomésticos en desuso'].map((i) => <li class="rounded-lg bg-white p-3 font-semibold shadow-sm">✓ {i}</li>)}
      </ul>
    </section>
    <section aria-labelledby="temporada">
      <h2 id="temporada" class="text-4xl text-brand-900">Despeja tu bodega antes de cerrar el año</h2>
      <p class="mt-4 text-ink/80">Muchas empresas acumulan metal durante meses. Venderlo a tiempo libera espacio y genera ingresos. Envíanos una lista o fotos del material y te respondemos con una cotización.</p>
      <h3 class="mt-6 text-2xl text-brand-700">Cómo trabajamos con empresas</h3>
      <ol class="mt-3 list-decimal space-y-1 pl-5"><li>Nos envías tipo de material y volumen estimado.</li><li>Cotizamos con el precio del día.</li><li>Coordinamos recolección o entrega en bodega.</li></ol>
    </section>
  </div>
</Layout>
```

### 9.6 `src/pages/contacto.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import QuoteForm from '../components/QuoteForm.astro';
import { PAGES } from '../data/seo';
import { SITE } from '../data/site';
import { waLink, generalMessage } from '../lib/whatsapp';
import { businessSchema, breadcrumbSchema } from '../lib/schema';
const siteUrl = Astro.site!.origin;
---

<Layout {...PAGES.contacto} jsonLd={[businessSchema(siteUrl), breadcrumbSchema(siteUrl, [{ name: 'Contacto', path: '/contacto/' }])]}>
  <section class="hero-bg text-white">
    <div class="container-x py-14 sm:py-20">
      <h1 class="max-w-4xl text-5xl sm:text-6xl">Chatarrería Gama Metales: ubicación, horarios y contacto en <span class="text-copper-500">Bucaramanga</span></h1>
    </div>
    <div class="hazard" aria-hidden="true"></div>
  </section>

  <div class="container-x grid gap-10 py-12 lg:grid-cols-2">
    <div>
      <h2 class="text-4xl text-brand-900">Dónde encontrarnos</h2>
      <address class="mt-4 text-lg not-italic">
        <p><strong>{SITE.address.street}</strong>, {SITE.city}, {SITE.region}</p>
        <p class="text-sm text-ink/70">Plus code: {SITE.address.plusCode}</p>
      </address>
      <a class="btn btn-outline mt-4" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar en Google Maps</a>

      <h2 class="mt-10 text-4xl text-brand-900">Horario de atención</h2>
      <table class="mt-4 w-full max-w-md text-left">
        <caption class="sr-only">Horario de atención de Gama Metales</caption>
        <tbody>
          {SITE.hours.map((h) => <tr class="border-b border-brand-100"><th scope="row" class="py-2 pr-4 font-semibold">{h.label}</th><td class="py-2">{h.display}</td></tr>)}
        </tbody>
      </table>
      <p class="mt-2 text-sm text-ink/70">{SITE.closedNote}</p>

      <h2 class="mt-10 text-4xl text-brand-900">WhatsApp y llamadas</h2>
      <ul class="mt-4 grid gap-3">
        {SITE.phones.map((p) => (
          <li class="flex flex-wrap items-center gap-3">
            <a class="btn btn-wa" href={waLink(generalMessage(), p.wa)} target="_blank" rel="noopener noreferrer">WhatsApp {p.display}</a>
            <a class="font-bold text-brand-700 underline" href={`tel:${p.e164}`}>Llamar</a>
          </li>
        ))}
      </ul>
    </div>
    <div><QuoteForm /></div>
  </div>
</Layout>
```

### 9.7 `src/pages/404.astro` (anti-error #3)

Retiene al usuario con los materiales y el botón directo a WhatsApp. Cloudflare Pages sirve automáticamente `404.html` para rutas inexistentes (devuelve estado 404). `noindex` evita que se indexe.

```astro
---
import Layout from '../layouts/Layout.astro';
import { PAGES } from '../data/seo';
import { MATERIALS } from '../data/materials';
import { waLink, generalMessage } from '../lib/whatsapp';
---

<Layout {...PAGES.notFound} noindex>
  <section class="hero-bg text-white">
    <div class="container-x py-20 text-center">
      <p class="font-display text-8xl font-extrabold text-copper-500" aria-hidden="true">404</p>
      <h1 class="text-4xl sm:text-6xl">Página no encontrada</h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-white/85">Esta página no existe o cambió de lugar. Mientras tanto, consulta los metales que compramos o cotiza directo por WhatsApp.</p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a class="btn btn-wa text-lg" href={waLink(generalMessage())} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp</a>
        <a class="btn btn-ghost text-lg" href="/">Ir al inicio</a>
      </div>
    </div>
    <div class="hazard" aria-hidden="true"></div>
  </section>

  <section class="container-x py-12" aria-labelledby="mats">
    <h2 id="mats" class="text-3xl text-brand-900">Lo que más buscan nuestros clientes</h2>
    <ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {MATERIALS.map((m) => <li><a class="block rounded-lg bg-white p-4 font-bold text-brand-700 shadow-sm hover:shadow-md" href={`/materiales/${m.slug}/`}>{m.h1}</a></li>)}
    </ul>
  </section>
</Layout>
```

---

## 10. Archivos de rastreo, IA e identidad (`robots`, `llms`, sitemap, favicons, OG)

### 10.1 `src/pages/robots.txt.ts` (anti-error #13)

Permite explícitamente buscadores tradicionales **y** agentes de IA. En vista previa (`ALLOW_INDEXING=false`) bloquea todo.

```ts
import type { APIRoute } from 'astro';
import { ALLOW_INDEXING } from 'astro:env/server';

const BOTS = [
  'Googlebot', 'Bingbot', 'Applebot',
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended',
];

export const GET: APIRoute = ({ site }) => {
  const origin = new URL(site!).origin;
  const body = ALLOW_INDEXING
    ? [
        ...BOTS.map((b) => `User-agent: ${b}\nAllow: /\n`),
        'User-agent: *\nAllow: /\n',
        `Sitemap: ${origin}/sitemap-index.xml`,
      ].join('\n')
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

Resultado en producción (`/robots.txt`):

```text
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

(… y el resto de agentes de la lista …)

User-agent: *
Allow: /

Sitemap: https://TU-DOMINIO.com/sitemap-index.xml
```

> ⚠️ **Trampa importante de Cloudflare (aplica a tu hosting).** En dominios nuevos servidos por Cloudflare existe un ajuste que **bloquea rastreadores de IA por defecto** y puede añadir su propio `robots.txt` administrado, aunque tu archivo los permita. Tras conectar tu dominio, entra al panel de Cloudflare → *Security → Bots* y desactiva el bloqueo de "AI Scrapers and Crawlers" / "Block AI bots", y desactiva el *Managed robots.txt*. Los nombres de las opciones pueden cambiar; la idea es que ningún filtro de Cloudflare bloquee a GPTBot, ClaudeBot o PerplexityBot. Verifícalo con el comando de la sección 14.
>
> `Google-Extended` no es un rastreador independiente sino un control: indica si Google puede usar tu contenido para Gemini. Googlebot sigue indexando para Búsqueda de todos modos.

### 10.2 `src/pages/llms.txt.ts` (anti-error #12)

Sigue el estándar de `llms.txt` (título `#`, resumen en cita `>`, secciones `##` con enlaces). Se genera desde `site.ts` y `materials.ts`, así que **nunca queda desactualizado** y los enlaces usan tu dominio real. Incluye una nota para que los modelos **no inventen precios**.

```ts
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { MATERIALS } from '../data/materials';

export const GET: APIRoute = ({ site }) => {
  const o = new URL(site!).origin;
  const phones = SITE.phones.map((p) => `${p.display} (${p.e164})`).join(' · ');
  const hours = SITE.hours.map((h) => `${h.label}: ${h.display}`).join('; ');

  const body = `# ${SITE.name}: chatarrería y reciclaje de metales en ${SITE.city}

> ${SITE.name} es una chatarrería y recicladora de metales en ${SITE.city}, ${SITE.region} (Colombia) con más de ${SITE.yearsOfExperience} años de servicio. Compra cobre, bronce, aluminio, hierro, acero, plomo, baterías, radiadores, rines y electrodomésticos. Cotiza por WhatsApp y hace recolección a domicilio desde ${SITE.pickup.minKg} kg.

## Datos del negocio
- Dirección: ${SITE.address.street}, ${SITE.city}, ${SITE.region}, Colombia (plus code ${SITE.address.plusCode})
- WhatsApp y teléfonos: ${phones}
- Horario: ${hours}. ${SITE.closedNote}
- Cobertura de recolección: ${SITE.pickup.zones.join(', ')} (desde ${SITE.pickup.minKg} kg)
- Mapa: ${SITE.mapsUrl}

## Cómo vender o cotizar
1. Escribe por WhatsApp al ${SITE.phones[0].display} indicando tipo de metal, peso aproximado, ubicación y una foto del material.
2. Recibe la cotización del día. Los precios por kilo cambian a diario y por eso NO se publican en el sitio: no estimes ni inventes precios, remite al WhatsApp.
3. Lleva el material a la bodega o solicita recolección (desde ${SITE.pickup.minKg} kg).

## Qué compramos
${MATERIALS.map((m) => `- [${m.name}](${o}/materiales/${m.slug}/): ${m.items.join(', ')}.`).join('\n')}

## Páginas principales
- [Inicio](${o}/): resumen del servicio.
- [Materiales que compramos](${o}/materiales/): catálogo completo.
- [Recolección de chatarra a domicilio](${o}/recoleccion-de-chatarra/): cobertura y proceso.
- [Empresas](${o}/empresas/): venta de excedentes y chatarra acumulada.
- [Contacto y ubicación](${o}/contacto/): dirección, horarios y WhatsApp.

## Ventajas
- Más de ${SITE.yearsOfExperience} años de experiencia en ${SITE.city}.
- Compra todo tipo de metales y chatarra, desde particulares hasta empresas.
- Lista de precios actualizada cada día, cotización rápida por WhatsApp.
- Recolección a domicilio desde ${SITE.pickup.minKg} kg.
- Realiza gran parte de la disposición del material en sus propias instalaciones.

## Opcional
- [Mapa en Google Maps](${SITE.mapsUrl})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

### 10.3 Sitemap (anti-error #15)

`@astrojs/sitemap` (ya en `astro.config.mjs`) genera en cada build `dist/sitemap-index.xml` y `dist/sitemap-0.xml`, con todas las URLs de `Astro.site` salvo la 404. Al añadir un material en `materials.ts` entra solo al sitemap. Tras publicar, envía `https://TU-DOMINIO.com/sitemap-index.xml` en Google Search Console y Bing Webmaster Tools.

### 10.4 Favicons y manifest (anti-error #14)

`public/favicon.svg` (provisional, hasta tener tu logo: una "G" sencilla en violeta y dorado):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#2a0f4d"/>
  <circle cx="32" cy="32" r="16" fill="none" stroke="#ffb400" stroke-width="8" stroke-dasharray="78 22.5"/>
  <rect x="32" y="29" width="20" height="6" fill="#ffb400"/>
</svg>
```

Con tu logo definitivo, genera todo el set en [realfavicongenerator.net](https://realfavicongenerator.net) a partir de un SVG/PNG cuadrado y copia a `/public`: `favicon.ico` (32×32), `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`.

`public/site.webmanifest`:

```json
{
  "name": "Gama Metales",
  "short_name": "Gama Metales",
  "description": "Chatarrería y reciclaje de metales en Bucaramanga",
  "lang": "es-CO",
  "start_url": "/",
  "display": "browser",
  "background_color": "#1a0833",
  "theme_color": "#1a0833",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 10.5 Imagen Open Graph (anti-error #7)

- Archivo: `public/og/default.jpg`, **1200×630 px**, JPG/PNG, < 300 KB.
- Diseño: fondo `#1A0833`, tu logo grande, texto "Chatarrería en Bucaramanga · Compramos cobre, aluminio y hierro", cinta hazard dorada y el WhatsApp 316 270 0257. Texto grande: en WhatsApp la tarjeta se ve pequeña.
- El tag `og:image` es absoluto (lo arma `SEO.astro` con `Astro.site`). Prueba el resultado pegando tu URL en [opengraph.xyz](https://www.opengraph.xyz) y compartiéndola en un chat de WhatsApp. WhatsApp guarda caché, así que usa otro chat si cambias la imagen.

---

## 11. Script de validación automática: `scripts/check-seo.mjs`

Corre después de cada build (`npm run build`) y **hace fallar el despliegue** si algún HTML incumple las reglas críticas (H1 único, idioma, título/description únicos y en rango, canonical, OG, `alt`, source maps, archivos obligatorios). Detecta solo si estás en modo producción mirando si el inicio lleva `noindex`.

```js
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const all = walk(DIST);
const pages = all.filter((f) => f.endsWith('.html'));
const errors = [];
const titles = new Map();

const home = readFileSync(join(DIST, 'index.html'), 'utf8');
const prod = !/content="noindex/.test(home); // producción = home indexable

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const is404 = file.endsWith('404.html');
  const err = (m) => errors.push(`${file}: ${m}`);

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(`debe tener 1 <h1> y tiene ${h1} (#9/#10)`);
  if (!/<html[^>]*\slang="es-CO"/.test(html)) err('falta lang="es-CO" (#16)');

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) err('falta <title> (#5)');
  else {
    if (title.length > 65) err(`title de ${title.length} caracteres (máx. 65)`);
    if (titles.has(title)) err(`title repetido con ${titles.get(title)} (#5)`);
    titles.set(title, file);
  }

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) err('falta meta description (#6)');
  else if (desc.length < 120 || desc.length > 155) err(`description de ${desc.length} caracteres (rango 120-155) (#6)`);

  if (!is404) {
    if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) err('falta canonical absoluto (#11)');
    if (!/<meta property="og:image" content="https?:\/\/[^"]+"/.test(html)) err('falta og:image absoluta (#7)');
    if (!/application\/ld\+json/.test(html) && file.endsWith('index.html')) err('falta JSON-LD (#8)');
  }

  const sinAlt = html.match(/<img(?![^>]*\salt=)[^>]*>/g) || [];
  if (sinAlt.length) err(`${sinAlt.length} <img> sin atributo alt (#17)`);

  if (prod && /vercel\.app|pages\.dev|workers\.dev|netlify\.app|localhost/.test(html)) err('contiene un dominio de plataforma (#1)');
}

// Archivos obligatorios
for (const f of ['404.html', 'sitemap-index.xml', 'sitemap-0.xml', 'robots.txt', 'llms.txt', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'site.webmanifest']) {
  if (!existsSync(join(DIST, f))) errors.push(`falta dist/${f}`);
}
if (all.some((f) => f.endsWith('.map'))) errors.push('hay archivos .map en dist (#18)');
if (prod && existsSync(join(DIST, 'robots.txt')) && !/Sitemap:\s*https?:\/\//.test(readFileSync(join(DIST, 'robots.txt'), 'utf8'))) errors.push('robots.txt sin línea Sitemap (#13/#15)');

if (errors.length) {
  console.error(`\n✖ SEO check: ${errors.length} problema(s)\n` + errors.map((e) => ' - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✔ SEO check OK (${pages.length} páginas, modo ${prod ? 'PRODUCCIÓN' : 'vista previa'})`);
```

> Este script se ejecuta con `console.log` de **Node durante el build**, no llega al navegador: no afecta la regla de "consola limpia".

---

## 12. Estrategia de palabras clave y estructura de encabezados

### 12.1 Mapa de intención de búsqueda (una intención principal por URL)

| URL | Keyword principal (+ Bucaramanga) | Secundarias | Intención |
|---|---|---|---|
| `/` | chatarrería en Bucaramanga | compra de chatarra, venta de metales por kilo, chatarrería cerca de mí, reciclaje de metales | Comercial / local |
| `/materiales/` | compra de metales Bucaramanga | qué metales compran, compra de chatarra por kilo | Comercial |
| `/materiales/cobre/` | compra de cobre Bucaramanga | cobre brillante, cobre 1B, precio del cobre hoy, venta de cobre | Transaccional |
| `/materiales/aluminio/` | compra de aluminio Bucaramanga | aluminio perfil, venta de aluminio, rines de aluminio | Transaccional |
| `/materiales/chatarra-hierro-acero/` | compra de chatarra de hierro Bucaramanga | chatarra ferrosa, vender hierro, chatarra por kilo | Transaccional |
| `/materiales/bronce-y-radiadores/` | compra de bronce Bucaramanga | compra de radiadores, radiador de cobre | Transaccional |
| `/materiales/baterias/` | compra de baterías usadas Bucaramanga | vender baterías de carro, baterías 4D/8D | Transaccional |
| `/materiales/plomo-y-antimonio/` | compra de plomo Bucaramanga | venta de plomo, balancín | Transaccional |
| `/materiales/electrodomesticos/` | compra de neveras usadas Bucaramanga | compro lavadoras, televisores usados, RAEE | Transaccional |
| `/recoleccion-de-chatarra/` | recolección de chatarra a domicilio Bucaramanga | recogen chatarra, chatarra a domicilio, desde 300 kg | Servicio local |
| `/empresas/` | venta de chatarra para empresas Bucaramanga | excedentes industriales, chatarra industrial, viruta de bronce | B2B (temporada) |
| `/contacto/` | Gama Metales Bucaramanga | chatarrería dirección, horario, Carrera 11 | Navegacional |

**Consulta clave sin precio publicado:** "¿a cómo está el kilo de cobre hoy?". La respondemos en la FAQ ("cambia a diario, pídelo por WhatsApp") y con la tarjeta "Lista de precios de hoy". Captura la búsqueda y la convierte en chat, sin comprometerte con cifras que caducan.

### 12.2 Jerarquía de encabezados (exactamente un `H1` por URL)

| URL | H1 | H2 principales | H3 |
|---|---|---|---|
| `/` | Chatarrería en Bucaramanga: compramos tu chatarra y todo tipo de metales | Qué metales compramos · Cómo vender en 3 pasos · ¿Tu empresa acumuló chatarra? · Nuestra bodega · Lo que dicen nuestros clientes · Dónde estamos · Preguntas frecuentes | Un material por tarjeta · Un paso por bloque · Una pregunta por FAQ |
| `/materiales/` | Compra de metales y chatarra en Bucaramanga | Materiales que recibimos · ¿No ves tu material? | Una por tarjeta |
| `/materiales/[slug]/` | Compra de {material} en Bucaramanga | Qué tipos de {material} compramos · Cómo conseguir una mejor cotización · Preguntas frecuentes · También compramos | Una por FAQ y tarjeta |
| `/recoleccion-de-chatarra/` | Recolección de chatarra a domicilio en Bucaramanga | Cómo funciona · Zonas de cobertura · Qué enviar por WhatsApp · Preguntas frecuentes | Los 3 pasos |
| `/empresas/` | Venta de chatarra y excedentes de metal para empresas en Bucaramanga | Qué materiales industriales compramos · Despeja tu bodega antes de cerrar el año | Cómo trabajamos con empresas |
| `/contacto/` | Chatarrería Gama Metales: ubicación, horarios y contacto en Bucaramanga | Dónde encontrarnos · Horario · WhatsApp y llamadas | (formulario) |
| `/404` | Página no encontrada | Lo que más buscan nuestros clientes | (noindex) |

**Reglas de redacción:** keyword principal + ciudad en el H1 y en los primeros 100 palabras; `alt` descriptivo y natural (ver 6.5); evita repetir "Bucaramanga" de forma forzada en cada frase; incluye siempre la dirección y el horario como texto (no solo en imagen); enlaza entre materiales y desde cada material al WhatsApp.

---

## 13. SEO local, GEO (IA) y plan de contenidos

### 13.1 Google Business Profile (el factor #1 de "chatarrería cerca de mí")

1. **Recuperar la propiedad del perfil existente.** Busca "Gama Metales Bucaramanga" en Google Maps. Si aparece "Reclamar este negocio" o "Administrar", úsalo. Si ya tiene dueño, usa "Solicitar acceso", o prueba iniciando sesión en `business.google.com` con los correos que alguien del equipo usó hace años (administración, contador, proveedor de internet). Si fue creado por un tercero que ya no responde, Google ofrece un proceso de verificación por video o llamada. No crees un perfil duplicado: perjudica el posicionamiento.
2. Categoría principal: **Chatarrería** (en inglés, *Scrap metal dealer*). Secundaria: **Centro de reciclaje**.
3. Mismos datos que el sitio (NAP idéntico): nombre `Gama Metales`, `Carrera 11 # 23-35`, teléfonos y horarios.
4. Enlace al sitio web (cuando tengas dominio) con la URL canónica; agrega el segundo WhatsApp como teléfono adicional.
5. Fotos reales: fachada, báscula, patio, camión, materiales clasificados (mínimo 10, y suma 2 o 3 cada mes).
6. Servicios: una entrada por material (cobre, aluminio, hierro, baterías, neveras…).
7. Publicaciones semanales: "Lista de precios de la semana" (imagen de tu tabla), temporada de empresas.
8. **Reseñas:** pide a cada cliente satisfecho que reseñe (enlace corto + código QR en el mostrador). Responde a todas. Copia las mejores a `reviews.ts` con permiso de su autor.
9. Cuando tengas el enlace del perfil, pégalo en `SITE.gbpUrl` y en `SITE.sameAs`.

### 13.2 Presencia y consistencia

- Crea al menos **Facebook** e **Instagram** de la empresa (hoy no tienen redes) y enlázalos desde el sitio y desde `SITE.sameAs`.
- Usa **WhatsApp Business** en los dos números: perfil con dirección y horario, saludo automático, mensaje de ausencia fuera de horario y etiquetas (cotizando / recolección / cerrado).
- Directorios locales (Páginas Amarillas Colombia, Cámara de Comercio de Bucaramanga, etc.) con el mismo NAP.

### 13.3 Optimización para motores de respuesta (GEO)

- **Respuestas directas y citables:** cada página abre con 1 o 2 frases que responden a la pregunta ("Compramos cobre brillante, 1B y mixto en Bucaramanga; el precio cambia a diario y se cotiza por WhatsApp").
- **FAQ con la redacción de preguntas reales** y marcado `FAQPage` idéntico al texto visible. (Google ya no muestra resultados enriquecidos de FAQ para la mayoría de sitios, pero los datos siguen ayudando a que otros motores entiendan la página.)
- **Hechos verificables y consistentes** (dirección, horario, kilos mínimos de recolección) repetidos igual en sitio, `llms.txt`, JSON-LD y Google Business.
- **Contenido nuevo (fase 2, 1 artículo cada 2 semanas):** "Cómo clasificar el cobre para venderlo mejor", "Diferencia entre aluminio limpio y contaminado", "Qué hacer con una nevera vieja en Bucaramanga", "Guía de chatarra para talleres y empresas". Crea `src/pages/blog/` con la misma estructura y enlaza a las páginas de material.
- Para medir si te citan: pregunta mensualmente a ChatGPT, Perplexity, Gemini y Claude "¿dónde vender chatarra en Bucaramanga?" y anota si aparece Gama Metales.

### 13.4 Medición (opcional, fase 2)

Cloudflare Web Analytics (gratuito, sin cookies) o Google Analytics 4. Cualquiera añade JS externo: cárgalo con `defer` y al final del `<body>`. Para contar clics a WhatsApp, agrega a los enlaces `data-evento="whatsapp"` y envía el evento con un único listener delegado. Mide también las llamadas y "Cómo llegar" desde el propio perfil de Google Business.

---

## 14. Despliegue (Cloudflare Pages) y dominio

### 14.1 Fase A: vista previa sin dominio

1. Sube el proyecto a GitHub (`git init`, repositorio privado).
2. Cloudflare → *Workers & Pages* → *Create* → *Pages* → *Connect to Git*.
3. Build command: `npm run build` · Output directory: `dist` · Node: variable `NODE_VERSION=20`.
4. Variables de entorno de producción:
   - `SITE_URL=https://TU-PROYECTO.pages.dev`
   - `ALLOW_INDEXING=false`
5. Resultado: el sitio carga con `noindex`, `robots.txt` bloqueado y cabecera `X-Robots-Tag: noindex`. Perfecto para revisar y mostrarlo al equipo sin riesgo de indexar la URL temporal (anti-error #1).

### 14.2 Fase B: lanzamiento con dominio propio

1. Compra el dominio (por ejemplo `gamametales.com`; verifica disponibilidad) en el registrador que prefieras. En Cloudflare Registrar se cobra al costo.
2. Si el dominio no está en Cloudflare, cambia sus *nameservers* a los que te indique Cloudflare.
3. *Pages → tu proyecto → Custom domains* → añade el dominio raíz y `www`.
4. Elige **una** versión canónica (recomendado: sin `www`) y crea una *Redirect Rule* de `www` a la raíz (301).
5. Cambia las variables: `SITE_URL=https://gamametales.com` y `ALLOW_INDEXING=true`. Haz un nuevo despliegue. Si pones `ALLOW_INDEXING=true` con un dominio de plataforma, el build falla a propósito.
6. Cloudflare → *Security → Bots*: desbloquea los rastreadores de IA (ver sección 10.1).
7. Verifica el dominio en **Google Search Console** (registro TXT en DNS) y en **Bing Webmaster Tools**; envía `sitemap-index.xml`. Solicita la indexación de la portada y de las 7 páginas de material.
8. Actualiza el sitio web en Google Business Profile.

### 14.3 Comandos de verificación

```bash
# El HTML crudo contiene el contenido (anti-errores #2 y #4)
curl -s https://gamametales.com/ | grep -o '<h1[^>]*>.*</h1>'

# Canonical correcto y sin vercel.app/pages.dev
curl -s https://gamametales.com/ | grep -o '<link rel="canonical"[^>]*>'

# Cabeceras: 200 y sin X-Robots-Tag noindex en el dominio real
curl -sI https://gamametales.com/ | head -n 15

# Los rastreadores de IA NO están bloqueados (esperado: 200)
for ua in GPTBot OAI-SearchBot ClaudeBot PerplexityBot Googlebot; do
  printf "%s -> " "$ua"; curl -s -o /dev/null -w "%{http_code}\n" -A "$ua" https://gamametales.com/
done

# Una URL inexistente responde 404 con tu página personalizada (anti-error #3)
curl -s -o /dev/null -w "%{http_code}\n" https://gamametales.com/no-existe/

curl -s https://gamametales.com/robots.txt
curl -s https://gamametales.com/llms.txt
curl -s https://gamametales.com/sitemap-index.xml
```

Herramientas: PageSpeed Insights / Lighthouse (objetivo móvil: Rendimiento ≥ 95, SEO 100, Accesibilidad ≥ 95, Buenas prácticas 100), [Rich Results Test](https://search.google.com/test/rich-results) y [validator.schema.org](https://validator.schema.org) para el JSON-LD.

---

## 15. Mapa de los 20 anti-errores

| # | Anti-error | Solución en este proyecto | Dónde |
|---|---|---|---|
| 1 | URL de `vercel.app` | `SITE_URL` por entorno, canonical siempre al dominio real, `noindex` en `*.pages.dev`, build falla si se indexa con dominio de plataforma | 4.1, 4.2, 8.1 |
| 2 | *View Source* vacío | HTML generado en el build (SSG) | 1, 4.1 |
| 3 | Sin página 404 | `404.astro` personalizada con materiales y WhatsApp | 9.7 |
| 4 | Todo en Vite + React (CSR) | Astro estático, sin hidratación de frameworks | 1 |
| 5 | Mismo título en todo | `seo.ts` con títulos únicos ≤ 60 caracteres; el script detecta duplicados | 6.2, 11 |
| 6 | Sin meta description | Descripciones de 120 a 155 caracteres por página; el script las mide | 6.2, 11 |
| 7 | Sin imagen OG | Bloque OG + Twitter completo, imagen 1200×630 absoluta | 8.1, 10.5 |
| 8 | Datos sin estructura | JSON-LD `RecyclingCenter` + `LocalBusiness`, `WebSite`, `BreadcrumbList`, `FAQPage`, `hasOfferCatalog` | 7.2, 8.1 |
| 9 | Varios H1 | Un solo `<h1>` por página; Layout/Header/Footer no usan H1; el script lo valida | 8.2, 11, 12.2 |
| 10 | Ningún H1 | Idem; cada página declara el suyo | 9.x, 12.2 |
| 11 | Sin canonical | `<link rel="canonical">` generado con `Astro.site` | 8.1 |
| 12 | Sin `llms.txt` | Endpoint que lo genera desde los datos del negocio | 10.2 |
| 13 | `robots.txt` bloquea IA | Permite Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended y otros; aviso del bloqueo por defecto de Cloudflare | 10.1 |
| 14 | Sin favicon | `favicon.svg`, `.ico`, `apple-touch-icon`, `site.webmanifest` | 10.4 |
| 15 | Sin sitemap | `@astrojs/sitemap` (`sitemap-index.xml` + `sitemap-0.xml`) | 4.1, 10.3 |
| 16 | Sin atributo de idioma | `<html lang="es-CO">` | 8.2 |
| 17 | Imágenes sin `alt` | `<Image alt>` obligatorio en `gallery.ts`; iconos decorativos con `aria-hidden`; el script detecta `<img>` sin alt | 6.5, 11 |
| 18 | Source maps expuestos | `vite.build.sourcemap: false`; el script falla si hay `.map` en `dist` | 4.1, 11 |
| 19 | Errores en consola | Sin recursos de terceros que fallen, sin embeds, `console.*` eliminado del bundle, `<Image>` con dimensiones, validación manual con DevTools | 4.1, 4.3, 15.1 |
| 20 | `bundle.js` gigante | Arquitectura de islas: ~1 KB de JS (solo `QuoteForm`), sin librerías de UI, fuentes autoalojadas y AVIF/WebP | 4.3 |

### 15.1 Regla de consola limpia (#19)

- No uses `console.log` en el código del sitio (Vite lo elimina del build, pero no dependas de eso).
- Todos los recursos referenciados deben existir (favicons, `og/default.jpg`, `logo.png`, imágenes): revisa la pestaña *Network* sin 404.
- No incluyas iframes ni scripts de terceros hasta que sean imprescindibles.
- Abre cada página en Chrome (modo incógnito, DevTools → Console) y confirma 0 errores y 0 advertencias antes de publicar.

---

## 16. Checklist final de validación pre-despliegue

**Build y arquitectura**
- [ ] `npm run build` termina con `✔ SEO check OK` (modo PRODUCCIÓN en el build final).
- [ ] *View Source* de `/`, `/materiales/cobre/` y `/contacto/` muestra H1, textos y JSON-LD completos (#2, #4).
- [ ] `dist/` no contiene archivos `.map` (#18).
- [ ] El JS total de una página es ≤ ~5 KB (Network → JS) (#20).
- [ ] Consola sin errores ni advertencias en todas las páginas (#19).

**SEO técnico**
- [ ] `SITE_URL` = dominio real y `ALLOW_INDEXING=true` solo en producción (#1).
- [ ] Cada página: un solo `<h1>`, `<title>` único, description de 120 a 155 caracteres (#5, #6, #9, #10).
- [ ] Canonical absoluto y correcto en todas las páginas (#11).
- [ ] `<html lang="es-CO">` (#16).
- [ ] Todas las imágenes de contenido con `alt` descriptivo (#17).
- [ ] `/404` personalizada: URL inexistente responde 404 (#3).

**Visibilidad IA y rastreo**
- [ ] JSON-LD válido en Rich Results Test y validator.schema.org (#8).
- [ ] `/llms.txt` accesible y con enlaces absolutos al dominio real (#12).
- [ ] `/robots.txt` permite bots tradicionales y de IA e incluye el sitemap (#13).
- [ ] `/sitemap-index.xml` y `/sitemap-0.xml` accesibles y sin la 404 (#15).
- [ ] Prueba de `curl -A GPTBot/ClaudeBot/PerplexityBot` devuelve 200 (Cloudflare no bloquea IA).

**Identidad y conversión**
- [ ] Favicons y manifest cargan (`favicon.svg`, `.ico`, `apple-touch-icon`) (#14).
- [ ] La tarjeta OG se ve bien al compartir en WhatsApp (#7).
- [ ] Botón flotante de WhatsApp visible, con `aria-label`, sin tapar contenido en móvil (probar en 360 px de ancho).
- [ ] Cada tarjeta abre WhatsApp con el material correcto y el texto de recolección cuando aplica.
- [ ] Los dos números (316 270 0257 y 317 645 9772) abren el chat correcto.
- [ ] Dirección, teléfonos y horarios coinciden exactamente con Google Business Profile.

**Rendimiento y accesibilidad (Lighthouse móvil)**
- [ ] Rendimiento ≥ 95 · SEO 100 · Accesibilidad ≥ 95 · Buenas prácticas 100.
- [ ] LCP < 2,5 s, CLS < 0,1, INP < 200 ms.
- [ ] Navegación completa por teclado y foco visible; contraste correcto.

**Postlanzamiento (primera semana)**
- [ ] Dominio verificado y sitemap enviado en Search Console y Bing Webmaster.
- [ ] Indexación solicitada para `/` y las páginas de material.
- [ ] Google Business Profile recuperado, con sitio web, fotos y servicios.
- [ ] Primeras reseñas reales copiadas a `reviews.ts` y fotos de bodega en `gallery.ts`.

---

## 17. Pendientes para completar (con la información real del negocio)

| Pendiente | Dónde se completa |
|---|---|
| Logo definitivo y set de favicons | `public/` (10.4) y `Header.astro`/`Footer.astro` |
| Barrio/sector exacto, coordenadas verificadas | `site.ts` |
| Confirmar zonas de recolección y si abren domingos o festivos | `site.ts` |
| Enlace del Google Business Profile | `SITE.gbpUrl`, `SITE.sameAs` |
| Fotos reales de la bodega (con `alt` fiel a lo que muestran) | `src/assets/bodega/` y `gallery.ts` |
| Reseñas reales de Google | `reviews.ts` |
| Imagen OG 1200×630 | `public/og/default.jpg` |
| Diferenciadores adicionales (báscula, formas de pago, certificados) solo si son ciertos | Textos de Inicio, `llms.txt`, `site.ts` |
| Dominio comprado y variables de entorno | Cloudflare Pages (14.2) |

---

*Fin del documento. Siguiente paso recomendado: ejecutar la sección 3, copiar los archivos de las secciones 4 a 11 y desplegar la Fase A para revisar el sitio antes de comprar el dominio.*
