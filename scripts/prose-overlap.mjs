import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const args = process.argv.slice(2);
const verbose = args.includes("--list");
const roots = args.filter((a) => !a.startsWith("--"));
const A = roots[0] ?? "/home/claude/veltskins";
const B = roots[1] ?? "/home/claude/patinaskins";

const BRAND = /\b(veltskins|patinaskins|velt|patina)\b/gi;

function walk(dir, test, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, test, out);
    else if (test(full)) out.push(full);
  }
  return out;
}

function stringsFromJson(value, out) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const item of value) stringsFromJson(item, out);
  else if (value && typeof value === "object") for (const item of Object.values(value)) stringsFromJson(item, out);
  return out;
}

const ENTITIES = { "&trade;": "\u2122", "&amp;": "&", "&nbsp;": " ", "&rsquo;": "\u2019", "&lsquo;": "\u2018", "&ldquo;": "\u201c", "&rdquo;": "\u201d", "&mdash;": "\u2014", "&ndash;": "\u2013", "&pound;": "\u00a3", "&hellip;": "\u2026" };

function decode(text) {
  return text.replace(/&[a-z]+;/g, (m) => ENTITIES[m] ?? " ");
}

const BLOCK = /<\/?(?:p|li|ul|ol|h[1-6]|dt|dd|td|th|tr|div|section|figcaption|blockquote|summary|details)\b[^<>]*>|<\s*\/?\s*>|<br\s*\/?>/g;
const HOLD = " «v» ";

function stringsFromSource(source) {
  const out = [];
  for (const match of source.matchAll(/`((?:[^`\\]|\\.)*)`/g)) {
    const raw = match[1];
    if (/\n\s*(?:const|import|return|function|export)\b/.test(raw)) continue;
    out.push(decode(raw.replace(/\$\{[^}]*\}/g, HOLD)));
  }
  for (const match of source.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
    out.push(decode((match[1] ?? match[2] ?? "").replace(/\\"/g, '"').replace(/\\'/g, "'")));
  }
  let text = source
    .replace(/^\s*import .*$/gm, " ")
    .replace(/`(?:[^`\\]|\\.)*`/g, HOLD)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
  for (let i = 0; i < 3; i += 1) text = text.replace(/\{[^{}\n]{0,120}\}/g, HOLD);
  text = text.replace(BLOCK, "\n\n").replace(/<[^<>]*>/g, "");
  for (const block of text.split(/\n{2,}/)) out.push(decode(block));
  return out;
}

function isProse(sentence) {
  if (/["[\]{}<>|=]|=>|\$/.test(sentence)) return false;
  const tokens = sentence.split(/\s+/).filter(Boolean);
  if (tokens.length < 5) return false;
  if (!/[a-z]{3}/.test(sentence)) return false;
  if (tokens.filter((t) => /^[A-Za-z\u00a3\u2019'-]+$/.test(t)).length / tokens.length < 0.6) return false;
  const code = tokens.filter((t) => /--|\w:\w|^[a-z0-9]+(?:-[a-z0-9]+){1,}$/.test(t)).length;
  return code / tokens.length < 0.2;
}

function sentences(text) {
  return text
    .replace(/\$\{[^}]*\}/g, " \u00abv\u00bb ")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z\u201c(\u00a30-9\u00ab])/)
    .map((s) => s.trim())
    .filter(isProse);
}

function normalise(sentence) {
  return sentence
    .replace(BRAND, "«brand»")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .trim()
    .toLowerCase();
}

function collect(root) {
  const files = [
    ...walk(join(root, "messages"), (f) => f.endsWith(".json")),
    ...walk(join(root, "src/app/(store)/policies"), (f) => f.endsWith(".tsx")),
    ...walk(join(root, "src/components/layout/PolicyLayout"), (f) => f.endsWith(".tsx")),
    join(root, "src/config/store-policy.ts"),
    join(root, "src/config/restricted-countries.ts"),
    join(root, "src/lib/company.ts"),
  ].filter((f) => existsSync(f));
  const map = new Map();
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const raws = file.endsWith(".json") ? stringsFromJson(JSON.parse(source), []) : stringsFromSource(source);
    for (const raw of raws) {
      for (const sentence of sentences(raw)) {
        const key = normalise(sentence);
        if (!map.has(key)) map.set(key, { sentence, file: relative(root, file) });
      }
    }
  }
  return map;
}

function shingles(key) {
  const tokens = key.split(/[^a-z0-9«»£]+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 2 < tokens.length; i += 1) set.add(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
  if (set.size === 0) set.add(tokens.join(" "));
  return set;
}

function similarity(x, y) {
  let hit = 0;
  for (const item of x) if (y.has(item)) hit += 1;
  return hit / (x.size + y.size - hit);
}

if (process.env.PER_FILE) {
  const counts = new Map();
  for (const v of collect(A).values()) counts.set(v.file, (counts.get(v.file) ?? 0) + 1);
  for (const [f, c] of [...counts].sort((x, y) => y[1] - x[1])) console.log(`${c.toString().padStart(4)}  ${f}`);
  process.exit(0);
}

const a = collect(A);
const b = collect(B);
const shared = [...a.keys()].filter((k) => b.has(k));
const byFile = new Map();
for (const key of shared) {
  const file = a.get(key).file;
  byFile.set(file, (byFile.get(file) ?? 0) + 1);
}

console.log(`A ${A}`);
console.log(`B ${B}`);
console.log(`  sentences in A: ${a.size}`);
console.log(`  sentences in B: ${b.size}`);
console.log(`  verbatim shared (brand-normalised): ${shared.length}`);
console.log(`  share of A: ${((shared.length / a.size) * 100).toFixed(1)}%`);

const bShingles = [...b.keys()].map((k) => [k, shingles(k)]);
const near = [];
for (const key of a.keys()) {
  if (b.has(key)) continue;
  const mine = shingles(key);
  let best = 0;
  let match = "";
  for (const [other, theirs] of bShingles) {
    const score = similarity(mine, theirs);
    if (score > best) {
      best = score;
      match = other;
    }
  }
  if (best >= 0.6) near.push({ key, best, match });
}
console.log(`  near-duplicate (>=0.60 trigram Jaccard, not exact): ${near.length}`);
console.log(`  distinct prose in A: ${a.size - shared.length - near.length} of ${a.size} (${(((a.size - shared.length - near.length) / a.size) * 100).toFixed(1)}%)`);
if (verbose && near.length) {
  console.log("  near-duplicates:");
  for (const n of near.sort((x, y) => y.best - x.best)) {
    console.log(`    ${n.best.toFixed(2)} [${a.get(n.key).file}] ${a.get(n.key).sentence}`);
    console.log(`         B: ${b.get(n.match).sentence}`);
  }
}
if (byFile.size) {
  console.log("  by file:");
  for (const [file, count] of [...byFile].sort((x, y) => y[1] - x[1])) console.log(`    ${count.toString().padStart(4)}  ${file}`);
}
if (verbose) {
  console.log("  shared sentences:");
  for (const key of shared) console.log(`    [${a.get(key).file}] ${a.get(key).sentence}`);
}
