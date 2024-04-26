import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    supportFile: false,
    specPattern: "./cypress/e2e/**/*.cy.ts",
  },
});
