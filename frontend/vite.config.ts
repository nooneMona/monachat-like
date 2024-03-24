import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import VitePluginFonts from "vite-plugin-fonts";

export default defineConfig({
  build: {
    outDir: "../backend/src/dist",
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    VitePluginFonts({
      google: {
        families: ["Noto Sans JP"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    port: 2108,
    watch: {
      usePolling: true,
    },
  },
  test: {
    globals: true,
  },
});
