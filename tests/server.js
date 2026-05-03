// Static file server for the cypress tests. Serves the repo root on
// http://localhost:8000 so the tests can `cy.visit('/examples/<name>/...')`.
//
// Replaces the legacy `gulp test-server` task: gulp 3 doesn't run on
// modern Node and the task itself was a single `app.listen(8000)` call.

import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 8000;

const app = express();
app.use(express.static(repoRoot));

app.listen(port, () => {
    console.log(`todomvc test server listening on http://localhost:${port}`);
});
