import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import Unfonts from "unplugin-fonts/vite";
import vueDevTools from "vite-plugin-vue-devtools";

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
    Unfonts({
      google: {
        families: ["Noto Sans JP"],
      },
    }),
    vueDevTools(),
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
