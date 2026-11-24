import sharp from 'sharp';
import fs from 'node:fs';

// Universal Recycling Symbol SVG (ISO 7000-1135 Mobius loop)
// Perfectly centered, thick bold bands (optimal visibility at 16px and 32px)
function getRecyclingSvg(size = 100, rx = 22) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <rect width="100" height="100" rx="${rx}" fill="#0B0F17"/>
  <g fill="#22C55E" transform="translate(50, 52) scale(0.85)">
    <g id="arrow-band">
      <!-- One folded arrow segment pointing clockwise with authentic thickness -->
      <path d="M -9,-38 L 9,-38 L 9,-30 L 22,-41.5 L 9,-53 L 9,-45 L -9,-45 C -21,-45 -31,-37 -36,-26 L -29,-22 C -25,-31 -18,-38 -9,-38 Z"/>
    </g>
    <use href="#arrow-band" transform="rotate(120)"/>
    <use href="#arrow-band" transform="rotate(240)"/>
  </g>
</svg>`;
}

// Function to assemble valid Windows ICO file from PNG buffers
function createIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type = 1
  header.writeUInt16LE(count, 4); // Number of images

  let offset = 6 + (16 * count);
  const dirEntries = [];
  const dataBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Colors (0 = no palette)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bit count
    entry.writeUInt32LE(img.buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    dirEntries.push(entry);
    dataBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...dataBuffers]);
}

async function buildFavicons() {
  console.log('Generating crisp branding and favicon assets...');

  const svgBase = getRecyclingSvg(512, 112);

  // 1. Write public/favicon.svg (viewBox 0 0 100 100)
  const faviconSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0B0F17"/>
  <g fill="#22C55E" transform="translate(50, 52) scale(0.85)">
    <g id="arrow-band">
      <path d="M -9,-38 L 9,-38 L 9,-30 L 22,-41.5 L 9,-53 L 9,-45 L -9,-45 C -21,-45 -31,-37 -36,-26 L -29,-22 C -25,-31 -18,-38 -9,-38 Z"/>
    </g>
    <use href="#arrow-band" transform="rotate(120)"/>
    <use href="#arrow-band" transform="rotate(240)"/>
  </g>
</svg>`;
  fs.writeFileSync('public/favicon.svg', faviconSvgContent);
  console.log('Written public/favicon.svg');

  // 2. High-res app icons: 512, 192, 180 (apple touch)
  const svgBuffer = Buffer.from(faviconSvgContent);
  await sharp(svgBuffer).resize(512, 512).png().toFile('public/icon-512.png');
  await sharp(svgBuffer).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  console.log('Written icon-512.png, icon-192.png, apple-touch-icon.png');

  // 3. Multi-resolution favicon.ico (16x16, 32x32, 48x48)
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('Written multi-size public/favicon.ico (16, 32, 48 px)');

  // 4. Also copy into dist/ if dist exists
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/favicon.svg', faviconSvgContent);
    fs.writeFileSync('dist/favicon.ico', icoBuffer);
    await sharp(svgBuffer).resize(512, 512).png().toFile('dist/icon-512.png');
    await sharp(svgBuffer).resize(192, 192).png().toFile('dist/icon-192.png');
    await sharp(svgBuffer).resize(180, 180).png().toFile('dist/apple-touch-icon.png');
    console.log('Synchronized into dist/');
  }

  // Also clean up temporary test files
  const testFiles = [
    'public/test-favicon.png',
    'public/test-lucide-32.png',
    'public/test-lucide.png',
    'public/test-solid.png',
    'public/test-classic.png',
    'public/test-official-512.png',
    'public/test-official-32.png',
    'public/test-official-16.png',
    'public/test-official-raw.png',
    'public/test-authentic-icon.png',
    'public/test-iso-64.png',
    'public/test-iso-32.png',
    'public/test-iso-16.png',
    'public/test-compare.html'
  ];
  for (const f of testFiles) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

buildFavicons();
