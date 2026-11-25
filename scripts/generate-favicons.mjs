import sharp from 'sharp';
import fs from 'node:fs';

// Official Universal Recycling Symbol SVG (ISO 7000 / Wikimedia continuous Möbius loop)
// Perfectly proportioned, 3 continuous folded arrows, high contrast green (#22C55E)
const RECYCLING_SVG_TRANSPARENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 141 137">
  <path fill="#22C55E" d="m 69.354446,101.88511 14.89909,-26.728603 0.07083,9.77531 31.356544,-0.0708 c 5.60294,-0.59389 10.51526,-2.87142 14.07266,-7.15441 -11.35361,23.224743 -14.62376,39.657983 -38.180359,39.667893 h -7.248845 l -0.07083,10.86145 z m -35.889999,15.7255 C 16.700024,112.51251 8.878305,91.859047 1.210673,77.305177 c 3.514375,3.19524 10.091148,7.76897 13.911042,7.76935 7.326307,0.0171 14.652641,0.0308 21.978959,0.0462 h 22.195134 l -0.07084,32.395433 -0.07083,0.0945 z M 0,68.842237 10.71446,46.989097 0.266195,41.249927 h 31.309304 l 15.135199,27.48417 -10.264323,-6.14596 c -3.292197,6.95205 -6.584391,13.90409 -9.876589,20.85613 -3.788885,-0.0663 -7.57777,-0.13252 -11.366656,-0.19879 C 7.815082,81.522977 2.675268,75.708847 0,68.842237 Z M 104.63055,83.113707 90.794007,57.612917 118.75045,40.683247 132.28,67.789607 c 0.40966,6.48698 -10.06394,15.51407 -16.56466,15.44384 z M 22.791894,23.446554 37.075173,2.040204 C 50.928643,-3.11938 58.95345,8.0193796 64.018171,15.040736 L 50.55943,40.872087 Z M 76.91024,34.969127 C 74.037439,28.196447 70.199044,20.449415 65.399134,13.713557 61.101835,7.6830406 55.909596,2.421532 51.976134,0.07082 L 88.102273,0 c 6.487814,0.582446 9.640194,4.364747 13.080937,9.5391756 l 5.19458,9.1377864 8.02805,-5.123763 -15.111563,26.917529 -32.584352,0.0708 z" />
</svg>`;

const RECYCLING_SVG_DARK_BG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0B0F17"/>
  <g transform="translate(68, 68) scale(2.7)">
    <path fill="#22C55E" d="m 69.354446,101.88511 14.89909,-26.728603 0.07083,9.77531 31.356544,-0.0708 c 5.60294,-0.59389 10.51526,-2.87142 14.07266,-7.15441 -11.35361,23.224743 -14.62376,39.657983 -38.180359,39.667893 h -7.248845 l -0.07083,10.86145 z m -35.889999,15.7255 C 16.700024,112.51251 8.878305,91.859047 1.210673,77.305177 c 3.514375,3.19524 10.091148,7.76897 13.911042,7.76935 7.326307,0.0171 14.652641,0.0308 21.978959,0.0462 h 22.195134 l -0.07084,32.395433 -0.07083,0.0945 z M 0,68.842237 10.71446,46.989097 0.266195,41.249927 h 31.309304 l 15.135199,27.48417 -10.264323,-6.14596 c -3.292197,6.95205 -6.584391,13.90409 -9.876589,20.85613 -3.788885,-0.0663 -7.57777,-0.13252 -11.366656,-0.19879 C 7.815082,81.522977 2.675268,75.708847 0,68.842237 Z M 104.63055,83.113707 90.794007,57.612917 118.75045,40.683247 132.28,67.789607 c 0.40966,6.48698 -10.06394,15.51407 -16.56466,15.44384 z M 22.791894,23.446554 37.075173,2.040204 C 50.928643,-3.11938 58.95345,8.0193796 64.018171,15.040736 L 50.55943,40.872087 Z M 76.91024,34.969127 C 74.037439,28.196447 70.199044,20.449415 65.399134,13.713557 61.101835,7.6830406 55.909596,2.421532 51.976134,0.07082 L 88.102273,0 c 6.487814,0.582446 9.640194,4.364747 13.080937,9.5391756 l 5.19458,9.1377864 8.02805,-5.123763 -15.111563,26.917529 -32.584352,0.0708 z" />
  </g>
</svg>`;

// Function to assemble valid Windows ICO file from PNG buffers
function createIco(images) {
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

  // 1. Write public/favicon.svg (transparent background for crisp native browser tab rendering)
  fs.writeFileSync('public/favicon.svg', RECYCLING_SVG_TRANSPARENT);
  console.log('Written public/favicon.svg (authentic continuous recycling symbol)');

  // 2. High-res app icons: 512, 192, 180 (apple touch) with brand dark background
  const darkBgBuffer = Buffer.from(RECYCLING_SVG_DARK_BG);
  await sharp(darkBgBuffer).resize(512, 512).png().toFile('public/icon-512.png');
  await sharp(darkBgBuffer).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(darkBgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  console.log('Written icon-512.png, icon-192.png, apple-touch-icon.png');

  // 3. Multi-resolution favicon.ico (16x16, 32x32, 48x48) with transparent background
  const transBuffer = Buffer.from(RECYCLING_SVG_TRANSPARENT);
  const p16 = await sharp(transBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(transBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(transBuffer).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('Written multi-size public/favicon.ico (16, 32, 48 px)');

  // 4. Standalone PNG favicons for older browsers and explicit links
  await sharp(transBuffer).resize(32, 32).png().toFile('public/favicon-32x32.png');
  await sharp(transBuffer).resize(16, 16).png().toFile('public/favicon-16x16.png');

  // 5. Also copy into dist/ if dist exists
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/favicon.svg', RECYCLING_SVG_TRANSPARENT);
    fs.writeFileSync('dist/favicon.ico', icoBuffer);
    fs.copyFileSync('public/favicon-32x32.png', 'dist/favicon-32x32.png');
    fs.copyFileSync('public/favicon-16x16.png', 'dist/favicon-16x16.png');
    await sharp(darkBgBuffer).resize(512, 512).png().toFile('dist/icon-512.png');
    await sharp(darkBgBuffer).resize(192, 192).png().toFile('dist/icon-192.png');
    await sharp(darkBgBuffer).resize(180, 180).png().toFile('dist/apple-touch-icon.png');
    console.log('Synchronized into dist/');
  }

  // Clean up temporary test files
  const testFiles = [
    'public/test-recycle-official.png',
    'public/test-official.png',
    'public/test-brand-16.png',
    'public/test-brand-32.png',
    'public/test-brand-48.png',
    'public/test-brand-180.png',
    'public/test-brand-192.png',
    'public/test-brand-512.png',
    'public/test-vec-16.png',
    'public/test-vec-32.png',
    'public/test-vec-48.png',
    'public/test-vec-180.png',
    'public/test-vec-192.png',
    'public/test-vec-512.png',
  ];
  for (const f of testFiles) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

buildFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
