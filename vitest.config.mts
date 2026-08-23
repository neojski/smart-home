import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          include: ["ui/**/*.test.tsx"],
          exclude: ["ui/**/*.browser.test.tsx"],
        },
      },
      {
        test: {
          name: "browser",
          globals: true,
          include: ["ui/**/*.browser.test.tsx"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
