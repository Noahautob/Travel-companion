// Generates the home-screen / PWA icons from an inline SVG travel scene.
// Run with: node scripts/make-icons.mjs
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#15304d"/>
      <stop offset="0.42" stop-color="#3f6d8e"/>
      <stop offset="0.68" stop-color="#e8965f"/>
      <stop offset="1" stop-color="#f6c579"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eaa96d"/>
      <stop offset="0.5" stop-color="#2f6d7a"/>
      <stop offset="1" stop-color="#123c46"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff4d6"/>
      <stop offset="0.55" stop-color="#ffd98a" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#ffcf76" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="512" height="512" fill="url(#sky)"/>

  <!-- sun -->
  <circle cx="256" cy="292" r="160" fill="url(#sunGlow)"/>
  <circle cx="256" cy="292" r="64" fill="#fff1d0"/>

  <!-- birds -->
  <g stroke="#16303f" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75">
    <path d="M126 156 q15 -13 30 0 q15 -13 30 0"/>
    <path d="M356 126 q12 -10 24 0 q12 -10 24 0"/>
  </g>

  <!-- far mountains -->
  <path d="M0 332 L96 250 L178 316 L256 232 L338 320 L424 250 L512 330 L512 372 L0 372 Z" fill="#3a5f74" opacity="0.9"/>
  <!-- near mountains -->
  <path d="M0 372 L118 288 L214 360 L300 306 L404 366 L512 308 L512 372 Z" fill="#25495a"/>

  <!-- water -->
  <rect y="372" width="512" height="140" fill="url(#water)"/>
  <rect x="238" y="372" width="36" height="140" fill="#ffe6b0" opacity="0.45"/>
  <g fill="#ffedcf" opacity="0.35">
    <rect x="150" y="398" width="82" height="5" rx="2.5"/>
    <rect x="300" y="416" width="72" height="5" rx="2.5"/>
    <rect x="118" y="444" width="120" height="6" rx="3"/>
    <rect x="288" y="466" width="112" height="6" rx="3"/>
  </g>
</svg>`;

const targets = [
  { size: 512, name: "icon-512.png" },
  { size: 192, name: "icon-192.png" },
  { size: 180, name: "apple-touch-icon.png" },
];

for (const t of targets) {
  await sharp(Buffer.from(svg))
    .resize(t.size, t.size)
    .png()
    .toFile(path.join(publicDir, t.name));
  console.log("wrote", t.name);
}
