import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import SVGIcons2SVGFontStream from "svgicons2svgfont";
import svg2ttf from "svg2ttf";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempRoot = path.join(root, "tools", "temp");
const outputDir = path.join(root, "src", "HealthIcons.Maui", "Resources", "Fonts");

await fsPromises.mkdir(outputDir, { recursive: true });

function toUnicode(codepoint) {
  return String.fromCodePoint(codepoint);
}

function readSvgFiles(dir) {
  return fs.readdirSync(dir)
    .filter(name => name.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b))
    .map(name => path.join(dir, name));
}

async function buildSvgFont(inputDir, fontName, startCodepoint) {
  const files = readSvgFiles(inputDir);
  if (files.length === 0) {
    throw new Error(`No SVGs found in ${inputDir}`);
  }

  const codepoints = {};

  const svgFont = await new Promise((resolve, reject) => {
    let fontContent = Buffer.alloc(0);
    const stream = new SVGIcons2SVGFontStream({
      fontName,
      normalize: true,
      fontHeight: 1024,
      log: () => null
    });

    stream.on("data", chunk => {
      fontContent = Buffer.concat([fontContent, chunk]);
    });
    stream.on("finish", () => resolve(fontContent.toString("utf8")));
    stream.on("error", reject);

    files.forEach((filePath, index) => {
      const basename = path.basename(filePath, ".svg");
      const codepoint = startCodepoint + index;
      codepoints[basename] = codepoint;

      const glyph = fs.createReadStream(filePath);
      glyph.metadata = {
        name: basename,
        unicode: [toUnicode(codepoint)]
      };

      stream.write(glyph);
    });

    stream.end();
  });

  return { svgFont, codepoints };
}

async function writeFontArtifacts(name, inputSuffix, startCodepoint) {
  const inputDir = path.join(tempRoot, inputSuffix);
  const { svgFont, codepoints } = await buildSvgFont(inputDir, name, startCodepoint);
  const ttf = svg2ttf(svgFont, { ts: 0 });

  await fsPromises.writeFile(path.join(outputDir, `${name}.svg`), svgFont, "utf8");
  await fsPromises.writeFile(path.join(outputDir, `${name}.ttf`), Buffer.from(ttf.buffer));
  await fsPromises.writeFile(
    path.join(outputDir, `${name}.json`),
    JSON.stringify(codepoints, null, 2),
    "utf8"
  );
}

await writeFontArtifacts("HealthIcons-Filled", "svg-filled-clean", 0xE001);
await writeFontArtifacts("HealthIcons-Outline", "svg-outline-clean", 0xF001);
