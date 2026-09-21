/**
 * Generates the raster brand assets that can't be SVG:
 *   - apple-touch-icon.png / icon-512.png
 *   - Open Graph social cards (1200x630) for each page group
 *
 * OG cards are composed from real photography plus the brand lockup, so shared
 * links look considered without inventing any content.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const OUT_OG = "public/og";
const IMG = "src/assets/images";
fs.mkdirSync(OUT_OG, { recursive: true });

const NAVY = "#0a1428";
const ORANGE = "#e8481a";
const TEAL = "#2a9d9d";

const waveMark = (scale, x, y, color = ORANGE) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <path fill="${color}" d="M0 9.5C9 -1.2 22.5 -1.8 34.5 5.2c5.5 3.2 10 5 14.5 5.2v21.4c-7.5 0-13.5-2.4-20-6.2C20.5 20.6 10.5 20 3 27.4Z"/>
    <path fill="${color}" d="M56.5 9.5C65.5 -1.2 79 -1.8 91 5.2c5.5 3.2 10 5 14.5 5.2v21.4c-7.5 0-13.5-2.4-20-6.2-8.5-5-18.5-5.6-26-1.8Z"/>
  </g>`;

/* ------------------------------------------------------------------- icons */

const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${NAVY}"/>
  ${waveMark(0.43, 6, 17)}
</svg>`;

await sharp(Buffer.from(iconSvg(180)))
  .png()
  .toFile("public/apple-touch-icon.png");
await sharp(Buffer.from(iconSvg(512))).png().toFile("public/icon-512.png");
console.log("icons written");

/* ---------------------------------------------------------------- og cards */

const W = 1200;
const H = 630;

/** slug -> { image, title, kind } */
const CARDS = {
  default: { image: "construction-cranes-city-skyline", title: "Construction &amp; Engineering", kind: "spartcon" },
  home: { image: "construction-cranes-city-skyline", title: "Construction &amp; Engineering", kind: "spartcon" },
  about: { image: "structural-steel-welding", title: "About Spartcon", kind: "spartcon" },
  services: { image: "concrete-pour-base-slab", title: "Services", kind: "spartcon" },
  "building-construction": { image: "construction-cranes-city-skyline", title: "Building Construction", kind: "spartcon" },
  "civil-engineering": { image: "road-cape-town-stellenbosch", title: "Civil Engineering", kind: "spartcon" },
  "construction-support-solutions": { image: "standby-generator-installation", title: "Construction Support", kind: "spartcon" },
  industries: { image: "ferrochrome-smelter-mpumalanga", title: "Industries", kind: "spartcon" },
  capabilities: { image: "cooling-water-pumps-pipework", title: "Capabilities", kind: "spartcon" },
  credentials: { image: "municipal-administration-building", title: "Credentials", kind: "spartcon" },
  projects: { image: "pipeline-construction-trench", title: "Projects &amp; Experience", kind: "spartcon" },
  contact: { image: "johannesburg-city-skyline", title: "Contact Spartcon", kind: "spartcon" },
  "facilities-engineering": { image: "mechanical-plant-room", title: "Facilities Engineering", kind: "tech" },
  "engineering-services": { image: "heat-exchanger-bundle-extraction", title: "Engineering Services", kind: "tech" },
  "maintenance-operations": { image: "centrifugal-pump", title: "Maintenance &amp; Operations", kind: "tech" },
  "building-systems": { image: "air-cooled-liquid-chiller", title: "Building Systems", kind: "tech" },
  "energy-utilities": { image: "electrical-substation-switchyard", title: "Energy &amp; Utilities", kind: "tech" },
  "maintenance-management": { image: "air-handling-units-commercial", title: "Maintenance Management", kind: "tech" },
  "contact-tech": { image: "air-handling-unit-plantroom", title: "Contact Spartcon Tech", kind: "tech" },
};

const esc = (s) => s.replace(/&(?!amp;)/g, "&amp;");

for (const [slug, cfg] of Object.entries(CARDS)) {
  const src = path.join(IMG, `${cfg.image}.jpg`);
  if (!fs.existsSync(src)) {
    console.warn(`  skip ${slug}: missing ${src}`);
    continue;
  }

  const isTech = cfg.kind === "tech";

  // Photo layer, darkened flatly (no gradient) so type stays legible.
  const photo = await sharp(src)
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.52, saturation: 0.85 })
    .toBuffer();

  const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${NAVY}" opacity="0.55"/>
  <!-- Left accent rule -->
  <rect x="0" y="0" width="${isTech ? 10 : 10}" height="${H}" fill="${isTech ? TEAL : ORANGE}"/>
  <!-- Brand lockup. The wave mark spans the wordmark width, as in the artwork. -->
  ${waveMark(1.95, 74, 60)}
  <text x="72" y="214" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="62" font-weight="700" fill="#ffffff" letter-spacing="-2">Spartcon</text>
  ${
    isTech
      ? `<text x="77" y="248" font-family="Helvetica, Arial, sans-serif" font-size="19" font-weight="500" fill="${TEAL}" letter-spacing="7.5">TECHNOLOGIES</text>`
      : ""
  }
  <!-- Page title -->
  <text x="72" y="${isTech ? 424 : 410}" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="64" font-weight="600" fill="#ffffff" letter-spacing="-2">${esc(cfg.title)}</text>
  <!-- Footer strip -->
  <rect x="72" y="${H - 116}" width="${W - 144}" height="1" fill="#ffffff" opacity="0.25"/>
  <text x="72" y="${H - 76}" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="#dde3ec">${
    isTech
      ? "Facilities Engineering by Spartcon"
      : "Professional construction solutions for the African environment"
  }</text>
</svg>`);

  await sharp(photo)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT_OG, `${slug}.jpg`));

  console.log(`  og/${slug}.jpg`);
}

console.log("og cards written");
