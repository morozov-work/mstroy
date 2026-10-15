/// <reference types="vitest/config" />

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('./src/composables/index.ts', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types/index.ts', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    benchmark: {
      include: ["tests/**/*.bench.ts"],
    },
  },
});
