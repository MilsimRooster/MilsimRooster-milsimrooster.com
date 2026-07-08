export function generatePassword({ length = 20, upper = true, lower = true, numbers = true, symbols = true } = {}) {
  const sets = [
    upper && "ABCDEFGHJKLMNPQRSTUVWXYZ",
    lower && "abcdefghijkmnopqrstuvwxyz",
    numbers && "23456789",
    symbols && "!@#$%^&*_-+=?"
  ].filter(Boolean);
  if (!sets.length) throw new Error("Choose at least one character type.");
  const pool = sets.join("");
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => pool[value % pool.length]).join("");
}

export function uuidv4() {
  return crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

export async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function base64Encode(text) {
  return btoa(String.fromCodePoint(...new TextEncoder().encode(text)));
}

export function base64Decode(text) {
  const binary = atob(text.trim());
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

export function formatJson(text, spacing = 2) {
  return JSON.stringify(JSON.parse(text), null, spacing);
}

export function minifyJson(text) {
  return JSON.stringify(JSON.parse(text));
}

export function countWords(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.match(/\b[\w'-]+\b/g)?.length || 0 : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((part) => part.trim()).length : 0;
  return { words, characters, charactersNoSpaces, sentences, readingMinutes: Math.max(1, Math.ceil(words / 225)) };
}

const conversions = {
  length: { meter: 1, kilometer: 1000, centimeter: 0.01, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 },
  weight: { gram: 1, kilogram: 1000, ounce: 28.349523125, pound: 453.59237 },
};

export function convertUnit(value, from, to, kind) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) throw new Error("Enter a valid number.");
  if (kind === "temperature") {
    const c = from === "fahrenheit" ? (amount - 32) * 5 / 9 : from === "kelvin" ? amount - 273.15 : amount;
    return to === "fahrenheit" ? c * 9 / 5 + 32 : to === "kelvin" ? c + 273.15 : c;
  }
  const table = conversions[kind];
  if (!table?.[from] || !table?.[to]) throw new Error("Choose compatible units.");
  return amount * table[from] / table[to];
}

export function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
