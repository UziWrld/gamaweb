import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';

if (!existsSync('public/og')) {
  mkdirSync('public/og', { recursive: true });
}

// 1. Icon SVG template
const getIconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#2A0F4D"/>
  <!-- Stylized G with periodic table industrial accent -->
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.28}" fill="none" stroke="#FFB400" stroke-width="${size * 0.125}" stroke-dasharray="${size * 1.25} ${size * 0.35}"/>
  <rect x="${size * 0.5}" y="${size * 0.45}" width="${size * 0.32}" height="${size * 0.1}" fill="#FFB400" rx="${size * 0.02}"/>
  <text x="${size * 0.15}" y="${size * 0.25}" font-family="sans-serif" font-weight="900" font-size="${size * 0.1}" fill="#EFE6FA">20+</text>
</svg>
`;

// 2. Logo SVG
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="160" viewBox="0 0 600 160">
  <rect width="600" height="160" rx="16" fill="#1A0833"/>
  <rect x="30" y="30" width="100" height="100" rx="16" fill="#2A0F4D" stroke="#FFB400" stroke-width="4"/>
  <text x="45" y="55" font-family="sans-serif" font-weight="bold" font-size="16" fill="#FFB400">Gm</text>
  <text x="80" y="105" font-family="sans-serif" font-weight="900" font-size="48" fill="#FFB400" text-anchor="middle">G</text>
  
  <text x="155" y="90" font-family="Impact, 'Barlow Condensed', sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="1">GAMA<tspan fill="#FFB400">METALES</tspan></text>
  <text x="158" y="118" font-family="sans-serif" font-weight="bold" font-size="16" fill="#EFE6FA" letter-spacing="2">CHATARRERÍA &amp; RECICLAJE · BUCARAMANGA</text>
</svg>
`;

// 3. OG Image SVG (1200x630)
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="grad1" cx="85%" cy="0%" r="60%">
      <stop offset="0%" stop-color="#FFB400" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#1A0833" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="grad2" cx="10%" cy="100%" r="50%">
      <stop offset="0%" stop-color="#5B1B9A" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#1A0833" stop-opacity="0"/>
    </radialGradient>
    <pattern id="hazard" width="28" height="28" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="28" stroke="#FFB400" stroke-width="14" />
      <line x1="14" y1="0" x2="14" y2="28" stroke="#1A0833" stroke-width="14" />
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#1A0833"/>
  <rect width="1200" height="630" fill="url(#grad1)"/>
  <rect width="1200" height="630" fill="url(#grad2)"/>

  <!-- Badge experience -->
  <rect x="80" y="70" width="360" height="40" rx="8" fill="#FFB400"/>
  <text x="260" y="96" font-family="sans-serif" font-weight="900" font-size="18" fill="#1A0833" text-anchor="middle" letter-spacing="2">+20 AÑOS · BUCARAMANGA</text>

  <!-- Title -->
  <text x="80" y="210" font-family="Impact, 'Barlow Condensed', sans-serif" font-weight="900" font-size="96" fill="#FFFFFF" letter-spacing="2">GAMA<tspan fill="#FFB400">METALES</tspan></text>

  <!-- Subtitle -->
  <text x="80" y="280" font-family="sans-serif" font-weight="800" font-size="34" fill="#FFFFFF">Compra de Chatarra y Metales al Mejor Precio</text>
  <text x="80" y="325" font-family="sans-serif" font-weight="500" font-size="24" fill="#EFE6FA">Cobre · Aluminio · Hierro · Bronce · Baterías · Recolección desde 300 kg</text>

  <!-- WhatsApp CTA Box -->
  <rect x="80" y="380" width="580" height="90" rx="16" fill="#25D366"/>
  <text x="120" y="435" font-family="sans-serif" font-weight="900" font-size="30" fill="#17101F">📲 WhatsApp: 316 270 0257</text>

  <!-- Slogan -->
  <text x="80" y="535" font-family="Impact, 'Barlow Condensed', sans-serif" font-size="26" fill="#FFB400" letter-spacing="1">"NUNCA PARES, NUNCA TE CONFORMES, INSISTE."</text>

  <!-- Location info -->
  <text x="1120" y="535" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF" text-anchor="end">Carrera 11 # 23-35, Bucaramanga</text>

  <!-- Bottom Hazard Bar -->
  <rect x="0" y="610" width="1200" height="20" fill="url(#hazard)"/>
</svg>
`;

async function run() {
  console.log('Generating images...');
  
  // icon-512.png
  await sharp(Buffer.from(getIconSvg(512))).png().toFile('public/icon-512.png');
  // icon-192.png
  await sharp(Buffer.from(getIconSvg(192))).png().toFile('public/icon-192.png');
  // apple-touch-icon.png (180x180)
  await sharp(Buffer.from(getIconSvg(180))).png().toFile('public/apple-touch-icon.png');
  // 32x32 for favicon.ico
  const ico32Buffer = await sharp(Buffer.from(getIconSvg(32))).png().toBuffer();
  
  // Minimal valid ICO file wrapper around 32x32 PNG
  // An ICO header (6 bytes) + 1 directory entry (16 bytes) + PNG data
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // Number of images

  const icoDirEntry = Buffer.alloc(16);
  icoDirEntry.writeUInt8(32, 0); // Width 32
  icoDirEntry.writeUInt8(32, 1); // Height 32
  icoDirEntry.writeUInt8(0, 2);  // Color count 0
  icoDirEntry.writeUInt8(0, 3);  // Reserved
  icoDirEntry.writeUInt16LE(1, 4); // Color planes
  icoDirEntry.writeUInt16LE(32, 6); // Bits per pixel
  icoDirEntry.writeUInt32LE(ico32Buffer.length, 8); // Size of image data
  icoDirEntry.writeUInt32LE(22, 12); // Offset of image data (6 + 16 = 22)

  const icoBuffer = Buffer.concat([icoHeader, icoDirEntry, ico32Buffer]);
  writeFileSync('public/favicon.ico', icoBuffer);

  // logo.png
  await sharp(Buffer.from(logoSvg)).png().toFile('public/logo.png');

  // og/default.jpg (1200x630)
  await sharp(Buffer.from(ogSvg)).jpeg({ quality: 90 }).toFile('public/og/default.jpg');

  console.log('Images generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
