import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    cssMinify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about/index.html"),
        gallery: resolve(__dirname, "apps/gallery/index.html"),
      },
    },
  },
});
