# TodoMVC Browser Tests

A single Cypress spec runs the official TodoMVC behavioural tests against
every example app. Each example should be functionally identical, so the
same spec is parameterised over the framework name.

## Running

Boot the static server and run cypress for every framework:

```sh
$ npm run test:all
```

Run against a single framework:

```sh
$ npm run server &
$ npx cypress run --env framework=react
```

Or, to iterate interactively:

```sh
$ npm run server &
$ npm run cy:open
```

then enter the framework name as `--env framework=<name>` in the
Cypress UI's settings, or via `CYPRESS_framework=react npm run cy:open`.

## How it works

- `tests/server.js` serves the repo root on `http://localhost:8000`.
- `cypress.config.js` sets `baseUrl` to `http://localhost:8000/examples/`.
- `cypress/e2e/spec.cy.js` drives the actual TodoMVC behaviour
  (add/edit/toggle/route/persist) against the app at
  `examples/<framework>/`.
- For frameworks that build into a `dist/` (or `dist/browser/`), the
  spec's `frameworkFolders` map points to the built output. Build the
  app first (`npm run build` inside the example) before running the
  spec — the static server only serves what's on disk.
- `tests/cya.js` runs cypress sequentially for many frameworks. Use
  `--main` for the curated modern set, `--framework=<name>` (repeatable)
  for explicit picks.
- `tests/excluded.js` lists frameworks the multi-app runner skips.
- `tests/knownIssues.js` lists test names that are skipped automatically
  when the matching framework is being tested.
