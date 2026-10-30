import { client, urlFor } from "./lib/sanity.js";

export const money = (value) =>
  Number.isFinite(value)
    ? `₦${value.toLocaleString("en-NG")}`
    : "Price on request";
export const whatsappNumber = "2348077778313";
export const whatsappLink = (message) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export async function fetchCatalogue() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  let data;
  try {
    data = await client.fetch(
      '*[_type == "product"] | order(_createdAt asc)',
      {},
      { signal: controller.signal },
    );
  } finally {
    clearTimeout(timeout);
  }
  const unique = new Map();
  for (const item of data) {
    if (!item.name?.trim()) continue;
    const ref = item.image?.asset?._ref || "";
    const key = `${item.name.trim().toLowerCase()}|${ref}|${item.price}`;
    const colors = Array.isArray(item.colors)
      ? item.colors.filter((v) => typeof v === "string" && v.trim())
      : [];
    const heights = Array.isArray(item.heights)
      ? item.heights.filter((v) => typeof v === "string" && v.trim())
      : [];
    if (unique.has(key)) {
      const previous = unique.get(key);
      previous.colors = [...new Set([...previous.colors, ...colors])];
      previous.heights = [...new Set([...previous.heights, ...heights])];
      if (item.section?.toLowerCase() === "premium")
        previous.section = "premium";
      continue;
    }
    unique.set(key, {
      id: item._id,
      name: item.name.trim(),
      price:
        typeof item.price === "number" && item.price >= 0 ? item.price : null,
      section: item.section?.toLowerCase() || "other",
      img: ref
        ? urlFor(item.image).width(900).quality(85).auto("format").url()
        : "",
      heights: heights.length ? heights : ["Enquire for sizes"],
      colors: colors.length ? colors : ["Enquire for colours"],
    });
  }
  return [...unique.values()];
}

export function readBag() {
  try {
    const value = JSON.parse(localStorage.getItem("figure234-bag-v2") || "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (i) =>
          i &&
          typeof i.id === "string" &&
          typeof i.name === "string" &&
          typeof i.selectedHeight === "string" &&
          typeof i.selectedColor === "string" &&
          typeof i.img === "string" &&
          (i.price === null || (Number.isFinite(i.price) && i.price >= 0)) &&
          Number.isInteger(i.quantity) &&
          i.quantity > 0 &&
          i.quantity <= 99,
      )
      .slice(0, 50);
  } catch {
    return [];
  }
}

export const variantKey = (item) =>
  `${item.id}|${item.selectedHeight}|${item.selectedColor}`;
