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
    plugins: [/** @type {any} */ (tailwindcss())],
    build: {
      sourcemap: false, // ANTI-ERROR #18: sin source maps en producción
    },
    // ANTI-ERROR #19/#20: elimina console.* y debugger del JS que llega al navegador
    esbuild: isBuild ? { drop: ['console', 'debugger'], legalComments: 'none' } : {},
  },
});
