import path from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // legacy({
    //   targets: ["defaults", "not IE 11"],
    // }),
  ],
  resolve: {
    alias: {
      "/@": path.resolve(__dirname, "/src"),
    },
  },
  base: "./",
})
