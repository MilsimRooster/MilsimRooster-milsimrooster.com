import { resolve } from "node:path";
import { defineConfig } from "vite";

const toolSlugs = [
  "pdf",
  "qr-code-generator",
  "password-generator",
  "uuid-generator",
  "sha256-hash-generator",
  "base64-encode-decode",
  "json-formatter",
  "word-counter",
  "unit-converter",
  "image-resize",
  "jpg-to-pdf",
];

export default defineConfig({
  build: {
    cssMinify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about/index.html"),
        downloads: resolve(__dirname, "downloads/index.html"),
        gallery: resolve(__dirname, "apps/gallery/index.html"),
        tools: resolve(__dirname, "tools/index.html"),
        ...Object.fromEntries(toolSlugs.map((slug) => [`tool-${slug}`, resolve(__dirname, `tools/${slug}/index.html`)])),
      },
    },
  },
});
