/**
 * Build contact sheets of the downloaded photography so every image can be
 * visually verified for relevance and authenticity before it is used.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "src/assets/images";
const OUT = "scripts/review";
const COLS = 4;
const CW = 460;
const CH = 300;
const PER_SHEET = 12;

fs.mkdirSync(OUT, exist => exist, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const files = fs
  .readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort();

console.log(`${files.length} images`);

for (let s = 0; s * PER_SHEET < files.length; s++) {
  const batch = files.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
  const rows = Math.ceil(batch.length / COLS);
  const canvas = sharp({
    create: {
      width: COLS * CW,
      height: rows * CH,
      channels: 3,
      background: { r: 20, g: 24, b: 38 },
    },
  });
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const buf = await sharp(path.join(SRC, batch[i]))
      .resize(CW - 8, CH - 8, { fit: "cover" })
      .jpeg({ quality: 78 })
      .toBuffer();
    composites.push({
      input: buf,
      left: (i % COLS) * CW + 4,
      top: Math.floor(i / COLS) * CH + 4,
    });
  }
  const out = path.join(OUT, `sheet-${s + 1}.jpg`);
  await canvas.composite(composites).jpeg({ quality: 82 }).toFile(out);
  console.log(`\n=== ${out} ===`);
  batch.forEach((f, i) =>
    console.log(`  r${Math.floor(i / COLS) + 1}c${(i % COLS) + 1}  ${f}`)
  );
}
