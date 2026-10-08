"use client";

// Seller photos are stored as data URLs in localStorage until real uploads
// exist, so shrink them first: localStorage holds roughly 5MB per origin.

const MAX_EDGE = 1080;
const QUALITY = 0.82;

export async function downscaleImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't read that image");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", QUALITY);
}
