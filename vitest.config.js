/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    reporters: ["default", "html"],
    setupFiles: ["vitest.setup.ts"],
    coverage: {
      enabled: true,
      include: ["api_*/**/*"],
      reporters: ["default", "html"],
    },
  },
});
