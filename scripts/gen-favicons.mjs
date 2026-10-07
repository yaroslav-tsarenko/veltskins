import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const full = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#86203A"/><path fill="#FBF6F0" d="M138 115h14v26h-14zM360 115h14v26h-14zM48 141h416v14H48zM150 335h212v32H150zM186 381h140v16H186z"/><path fill="none" stroke="#FBF6F0" stroke-width="14" stroke-linejoin="miter" d="M145 155 256 335 367 155"/></svg>`;

const small = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><rect width="256" height="256" fill="#86203A"/><path fill="#FBF6F0" d="M18 66h220v14H18zM70 170h116v20H70z"/><path fill="none" stroke="#FBF6F0" stroke-width="14" stroke-linejoin="miter" d="M60 80 128 170 196 80"/></svg>`;

const tiny = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><rect width="256" height="256" fill="#86203A"/><path fill="#FBF6F0" d="M12 58h232v26H12zM114 84h28v68h-28zM48 152h160v38H48z"/></svg>`;

const targets = [
  { size: 16, name: "favicon-16x16.png", source: tiny },
  { size: 32, name: "favicon-32x32.png", source: small },
  { size: 180, name: "apple-touch-icon.png", source: full },
  { size: 192, name: "android-chrome-192x192.png", source: full },
  { size: 512, name: "android-chrome-512x512.png", source: full },
];

async function render(source, size) {
  return sharp(Buffer.from(source), { density: Math.max(72, Math.ceil((72 * size) / 32)) })
    .resize(size, size)
    .png()
    .toBuffer();
}

for (const { size, name, source } of targets) {
  await writeFile(join(publicDir, name), await render(source, size));
  console.log("Generated", name);
}

const icoImages = [
  { size: 16, data: await render(tiny, 16) },
  { size: 32, data: await render(small, 32) },
  { size: 48, data: await render(small, 48) },
];

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);

let offset = 6 + icoImages.length * 16;
const entries = icoImages.map(({ size, data }) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(data.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += data.length;
  return entry;
});

await writeFile(join(publicDir, "favicon.ico"), Buffer.concat([header, ...entries, ...icoImages.map((i) => i.data)]));
console.log("Generated favicon.ico (16, 32, 48)");
