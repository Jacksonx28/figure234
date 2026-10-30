// Refresh the fallback from the existing public CMS. No CMS records are changed.
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { fetchCatalogue } from "../src/catalogue.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const products = await fetchCatalogue();
if (!products.length)
  throw new Error(
    "The CMS returned no pieces; the saved catalogue was not replaced.",
  );
await mkdir(`${root}public/editorial`, { recursive: true });
const saved = [];
for (const item of products) {
  const editorial = item.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const response = await fetch(item.img);
  if (!response.ok)
    throw new Error(
      `Image download failed for ${item.name}: ${response.status}`,
    );
  await writeFile(
    `${root}public/editorial/${editorial}.jpg`,
    Buffer.from(await response.arrayBuffer()),
  );
  const { img, ...record } = item;
  saved.push({ ...record, editorial });
}
await writeFile(
  `${root}src/catalogue-snapshot.json`,
  JSON.stringify(
    { updatedAt: new Date().toISOString().slice(0, 10), products: saved },
    null,
    2,
  ) + "\n",
);
console.log(`Saved ${saved.length} unique pieces and their images.`);
