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

  // 2. High-contrast Universal Recycling Symbol (ISO 7000-1135 Mobius loop)
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 141 137">
  <path fill="#22C55E" d="m 69.354446,101.88511 14.89909,-26.728603 0.07083,9.77531 31.356544,-0.0708 c 5.60294,-0.59389 10.51526,-2.87142 14.07266,-7.15441 -11.35361,23.224743 -14.62376,39.657983 -38.180359,39.667893 h -7.248845 l -0.07083,10.86145 z m -35.889999,15.7255 C 16.700024,112.51251 8.878305,91.859047 1.210673,77.305177 c 3.514375,3.19524 10.091148,7.76897 13.911042,7.76935 7.326307,0.0171 14.652641,0.0308 21.978959,0.0462 h 22.195134 l -0.07084,32.395433 -0.07083,0.0945 z M 0,68.842237 10.71446,46.989097 0.266195,41.249927 h 31.309304 l 15.135199,27.48417 -10.264323,-6.14596 c -3.292197,6.95205 -6.584391,13.90409 -9.876589,20.85613 -3.788885,-0.0663 -7.57777,-0.13252 -11.366656,-0.19879 C 7.815082,81.522977 2.675268,75.708847 0,68.842237 Z M 104.63055,83.113707 90.794007,57.612917 118.75045,40.683247 132.28,67.789607 c 0.40966,6.48698 -10.06394,15.51407 -16.56466,15.44384 z M 22.791894,23.446554 37.075173,2.040204 C 50.928643,-3.11938 58.95345,8.0193796 64.018171,15.040736 L 50.55943,40.872087 Z M 76.91024,34.969127 C 74.037439,28.196447 70.199044,20.449415 65.399134,13.713557 61.101835,7.6830406 55.909596,2.421532 51.976134,0.07082 L 88.102273,0 c 6.487814,0.582446 9.640194,4.364747 13.080937,9.5391756 l 5.19458,9.1377864 8.02805,-5.123763 -15.111563,26.917529 -32.584352,0.0708 z" />
</svg>`;
  writeFileSync('public/favicon.svg', svgFavicon);

  const darkBgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0B0F17"/>
  <g transform="translate(68, 68) scale(2.7)">
    <path fill="#22C55E" d="m 69.354446,101.88511 14.89909,-26.728603 0.07083,9.77531 31.356544,-0.0708 c 5.60294,-0.59389 10.51526,-2.87142 14.07266,-7.15441 -11.35361,23.224743 -14.62376,39.657983 -38.180359,39.667893 h -7.248845 l -0.07083,10.86145 z m -35.889999,15.7255 C 16.700024,112.51251 8.878305,91.859047 1.210673,77.305177 c 3.514375,3.19524 10.091148,7.76897 13.911042,7.76935 7.326307,0.0171 14.652641,0.0308 21.978959,0.0462 h 22.195134 l -0.07084,32.395433 -0.07083,0.0945 z M 0,68.842237 10.71446,46.989097 0.266195,41.249927 h 31.309304 l 15.135199,27.48417 -10.264323,-6.14596 c -3.292197,6.95205 -6.584391,13.90409 -9.876589,20.85613 -3.788885,-0.0663 -7.57777,-0.13252 -11.366656,-0.19879 C 7.815082,81.522977 2.675268,75.708847 0,68.842237 Z M 104.63055,83.113707 90.794007,57.612917 118.75045,40.683247 132.28,67.789607 c 0.40966,6.48698 -10.06394,15.51407 -16.56466,15.44384 z M 22.791894,23.446554 37.075173,2.040204 C 50.928643,-3.11938 58.95345,8.0193796 64.018171,15.040736 L 50.55943,40.872087 Z M 76.91024,34.969127 C 74.037439,28.196447 70.199044,20.449415 65.399134,13.713557 61.101835,7.6830406 55.909596,2.421532 51.976134,0.07082 L 88.102273,0 c 6.487814,0.582446 9.640194,4.364747 13.080937,9.5391756 l 5.19458,9.1377864 8.02805,-5.123763 -15.111563,26.917529 -32.584352,0.0708 z" />
  </g>
</svg>`;

  // App icons: 512, 192, 180 (apple touch)
  const darkBuf = Buffer.from(darkBgSvg);
  await sharp(darkBuf).resize(512, 512).png().toFile('public/icon-512.png');
  await sharp(darkBuf).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(darkBuf).resize(180, 180).png().toFile('public/apple-touch-icon.png');

  // Multi-resolution favicon.ico (16, 32, 48 px)
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  const icoImages = [
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ];

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(icoImages.length, 4);

  let offset = 6 + (16 * icoImages.length);
  const dirEntries = [];
  const dataBuffers = [];

  for (const img of icoImages) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);

    dirEntries.push(entry);
    dataBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  writeFileSync('public/favicon.ico', Buffer.concat([icoHeader, ...dirEntries, ...dataBuffers]));

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

  <!-- Slogan / Promesa -->
  <text x="80" y="565" font-family="'Segoe UI', Roboto, sans-serif" font-weight="bold" font-size="20" fill="#22C55E">
    ✓ PESAJE EXACTO A LA VISTA · PAGO INMEDIATO DE CONTADO
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

