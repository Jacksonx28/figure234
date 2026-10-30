// src/lib/sanity.js
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  projectId: "cfktf6lt",
  dataset: "figure234",
  useCdn: true, // true for fast response, false for real-time (instant) updates
  apiVersion: "2026-03-25",
});

const builder = createImageUrlBuilder(client);

// This helper function turns Sanity's image data into a usable URL
export function urlFor(source) {
  return builder.image(source);
}
