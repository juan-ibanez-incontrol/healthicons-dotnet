import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tempRoot = path.join(root, "tools", "temp");
const packageRoot = path.join(root, "tools", "node_modules", "healthicons", "public", "icons", "svg");

const styles = [
  ["filled", path.join(tempRoot, "svg-filled-clean")],
  ["outline", path.join(tempRoot, "svg-outline-clean")]
];

await fs.rm(tempRoot, { recursive: true, force: true });

for (const [style, outputDir] of styles) {
  const inputDir = path.join(packageRoot, style);
  await fs.mkdir(outputDir, { recursive: true });
  const categories = await fs.readdir(inputDir, { withFileTypes: true });

  for (const category of categories.filter(x => x.isDirectory())) {
    const categoryDir = path.join(inputDir, category.name);
    const files = await fs.readdir(categoryDir);
    for (const file of files.filter(x => x.endsWith(".svg"))) {
      const sourcePath = path.join(categoryDir, file);
      const raw = await fs.readFile(sourcePath, "utf8");
      const optimized = optimize(raw, {
        multipass: true,
        plugins: [
          "preset-default",
          "removeDimensions",
          {
            name: "removeAttrs",
            params: { attrs: "(fill|stroke)" }
          }
        ]
      });

      const baseName = `${category.name}-${file.replace(/\.svg$/i, "")}.svg`;
      await fs.writeFile(path.join(outputDir, baseName), optimized.data, "utf8");
    }
  }
}

