import { defineConfig } from 'cypress';

export default defineConfig({
    projectId: 'n4ynap',
    e2e: {
        baseUrl: 'http://localhost:8000/examples/',
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: 'cypress/support/e2e.js',
        viewportWidth: 890,
        numTestsKeptInMemory: 1,
        // Lit, Polymer, and other web-component examples render their UI
        // inside shadow roots. Enabling shadow-dom piercing globally is a
        // no-op for light-DOM apps (vue, react, etc.) but is required for
        // the spec's selectors to find anything in the web-component apps.
        includeShadowDom: true,
        // The framework name comes in via --env framework=<name>; without it
        // the spec throws early. Apps with non-default builds map to subpaths
        // below so we can serve their built dist/ output without touching the
        // app sources.
    },
});
