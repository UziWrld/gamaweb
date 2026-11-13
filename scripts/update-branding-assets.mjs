import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

async function generateBranding() {
  console.log('Generating branding assets from business card & LogoGama.png...');

  // 1. Ensure logo.png (trimmed original) and logo-white.png (trimmed with white text)
  const trimmedBuffer = await sharp('public/LogoGama.png').trim().toBuffer({ resolveWithObject: true });
  await sharp(trimmedBuffer.data).png().toFile('public/logo.png');

  // Create logo-white.png
  const rawObj = await sharp('public/logo.png').raw().toBuffer({ resolveWithObject: true });
  const rawData = Buffer.from(rawObj.data);
  for (let i = 0; i < rawData.length; i += 4) {
    const a = rawData[i + 3];
    if (a > 20) {
      const r = rawData[i], g = rawData[i + 1], b = rawData[i + 2];
      const isGreen = g > r + 20 && g > b + 20;
      if (!isGreen) {
        // Dark text -> pure white
        rawData[i] = 255;
        rawData[i + 1] = 255;
        rawData[i + 2] = 255;
      }
    }
  }
  await sharp(rawData, { raw: rawObj.info }).png().toFile('public/logo-white.png');

  // 2. Extract authentic icon (x: 0 to 611, y: 0 to 603)
  const iconRaw = await sharp('public/logo.png')
    .extract({ left: 0, top: 0, width: 611, height: 603 })
    .trim()
    .toBuffer();

  // Create square icon with dark background (#0B0F17) for app icons
  const createSquareAppIcon = async (size) => {
    const padding = Math.round(size * 0.15);
    const innerSize = size - padding * 2;
    const resizedIcon = await sharp(iconRaw)
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    // Dark rounded rect background
    const bgSvg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#0B0F17"/>
      </svg>
    `;

    return sharp(Buffer.from(bgSvg))
      .composite([{ input: resizedIcon, top: padding, left: padding }])
      .png();
  };

  // 192x192 & 512x512 & apple-touch-icon (180x180)
  await (await createSquareAppIcon(512)).toFile('public/icon-512.png');
  await (await createSquareAppIcon(192)).toFile('public/icon-192.png');
  await (await createSquareAppIcon(180)).toFile('public/apple-touch-icon.png');

  // 32x32 for favicon.ico
  const ico32Buffer = await (await createSquareAppIcon(32)).toBuffer();
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(1, 4);

  const icoDirEntry = Buffer.alloc(16);
  icoDirEntry.writeUInt8(32, 0);
  icoDirEntry.writeUInt8(32, 1);
  icoDirEntry.writeUInt8(0, 2);
  icoDirEntry.writeUInt8(0, 3);
  icoDirEntry.writeUInt8(1, 4);
  icoDirEntry.writeUInt16LE(32, 6);
  icoDirEntry.writeUInt32LE(ico32Buffer.length, 8);
  icoDirEntry.writeUInt32LE(22, 12);

  writeFileSync('public/favicon.ico', Buffer.concat([icoHeader, icoDirEntry, ico32Buffer]));

  // SVG Favicon using clean recycling arrows
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0B0F17"/>
  <!-- Clean geometric recycling symbol -->
  <g fill="#22C55E">
    <path d="M32 10 L38 20 L26 20 Z" />
    <path d="M48 38 L54 28 L42 28 Z" />
    <path d="M16 38 L22 48 L10 48 Z" />
    <path d="M26 18 C34 18 44 22 46 29 L42 31 C40 26 33 22 26 22 Z" />
    <path d="M46 33 C48 41 42 50 34 52 L33 48 C39 46 44 39 42 33 Z" />
    <path d="M28 50 C20 48 16 38 18 30 L22 32 C20 38 23 46 29 47 Z" />
  </g>
</svg>`;
  writeFileSync('public/favicon.svg', svgFavicon);

  // 3. Generate OG image (1200x630) based on the business card
  // Convert logo-white to a resized buffer for compositing
  const logoWhiteResized = await sharp('public/logo-white.png')
    .resize(600, null, { fit: 'inside' })
    .toBuffer();

  const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Card inspired gradients -->
    <radialGradient id="gradGreen" cx="90%" cy="10%" r="55%">
      <stop offset="0%" stop-color="#22C55E" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0B0F17" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gradBlue" cx="10%" cy="90%" r="50%">
      <stop offset="0%" stop-color="#0284C7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0B0F17" stop-opacity="0"/>
    </radialGradient>
    <!-- Business card geometric polygons -->
    <linearGradient id="facetGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#15803D"/>
    </linearGradient>
    <linearGradient id="facetBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
    <pattern id="hazard" width="28" height="28" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="28" stroke="#22C55E" stroke-width="14" />
      <line x1="14" y1="0" x2="14" y2="28" stroke="#0B0F17" stroke-width="14" />
    </pattern>
  </defs>

  <!-- Deep dark carbon background -->
  <rect width="1200" height="630" fill="#0B0F17"/>
  <rect width="1200" height="630" fill="url(#gradGreen)"/>
  <rect width="1200" height="630" fill="url(#gradBlue)"/>

  <!-- Top-right geometric facets (inspired by business card corner) -->
  <polygon points="1200,0 1020,0 1200,180" fill="url(#facetGreen)" opacity="0.85"/>
  <polygon points="1200,80 1100,0 1200,0" fill="#4ADE80" opacity="0.6"/>
  <polygon points="1020,0 950,0 1200,250 1200,180" fill="url(#facetBlue)" opacity="0.5"/>

  <!-- Bottom-left geometric facets -->
  <polygon points="0,630 0,480 150,630" fill="url(#facetGreen)" opacity="0.8"/>
  <polygon points="0,630 0,550 80,630" fill="#4ADE80" opacity="0.7"/>

  <!-- Experience Badge -->
  <rect x="80" y="55" width="460" height="42" rx="8" fill="#166534"/>
  <text x="310" y="82" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="17" fill="#DCFCE7" text-anchor="middle" letter-spacing="2">
    COMPRA Y VENTA DE MATERIALES RECICLABLES
  </text>

  <!-- Subtitle and offerings -->
  <text x="80" y="275" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="36" fill="#FFFFFF">
    Chatarrería y Recicladora en Bucaramanga
  </text>
  <text x="80" y="325" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="24" fill="#94A3B8">
    Cobre · Aluminio · Hierro · Bronce · Baterías · Recolección desde 300 kg
  </text>

  <!-- Contact boxes -->
  <!-- WhatsApp 1 -->
  <rect x="80" y="380" width="370" height="76" rx="14" fill="#22C55E"/>
  <text x="110" y="428" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="24" fill="#0B0F17">
    📲 316 270 0257
  </text>

  <!-- WhatsApp 2 / Llamadas -->
  <rect x="470" y="380" width="370" height="76" rx="14" fill="#1E293B" stroke="#334155" stroke-width="2"/>
  <text x="500" y="428" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF">
    📞 317 645 9772
  </text>

  <!-- Address info -->
  <text x="80" y="525" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="22" fill="#E2E8F0">
    📍 Carrera 11 # 23-35, Bucaramanga · Plus Code: 4VF9+J5
  </text>

  <!-- Slogan -->
  <text x="80" y="565" font-family="'Segoe UI', Roboto, sans-serif" font-weight="bold" font-size="18" fill="#22C55E">
    "Nunca pares, nunca te conformes, insiste."
  </text>

  <!-- Bottom hazard bar with green & carbon -->
  <rect x="0" y="614" width="1200" height="16" fill="url(#hazard)"/>
</svg>
`;

  // Composite the real logo-white onto the OG background around x:80, y:120
  await sharp(Buffer.from(ogSvg))
    .composite([{ input: logoWhiteResized, top: 120, left: 80 }])
    .jpeg({ quality: 92 })
    .toFile('public/og/default.jpg');

  console.log('Branding assets generated successfully!');
}

generateBranding().catch((err) => {
  console.error(err);
  process.exit(1);
});

