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
