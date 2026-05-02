# TodoMVC Browser Tests

A single Cypress spec runs the official TodoMVC behavioural tests
(add / edit / toggle / route / persist) against every example app.
Each example should be functionally identical, so the same spec is
parameterised over the framework name.

## Running

The default `npm run test:all` runs the spec against the curated set
of modern, actively-maintained framework examples:

```sh
$ npm run test:all
```

That set is currently angular, preact, react, react-redux, svelte,
and vue — see `tests/cya.js`'s `mainFrameworks` array. Lit is omitted
from the default set; see "Notes on lit" below.

Run a single framework:

```sh
$ npm run server &
$ npx cypress run --env framework=react
```

Run a specific list:

```sh
$ npm run server &
$ node tests/cya.js -f vue -f svelte -f preact
```

Run **everything** in `examples/` that isn't in `excluded.js`,
including the legacy framework showcases (backbone, knockout, ember,
canjs, angular-dart, etc.):

```sh
$ npm run server &
$ node tests/cya.js --all
```

Many of the legacy apps still pass cleanly; some don't. See "Notes on
the legacy apps" below.

To iterate interactively:

```sh
$ npm run server &
$ npm run cy:open
```

then enter the framework via `CYPRESS_framework=react npm run cy:open`.

## How it works

- `tests/server.js` serves the repo root on `http://localhost:8000`.
- `cypress.config.js` sets `baseUrl` to `http://localhost:8000/examples/`.
- `cypress/e2e/spec.cy.js` is the spec, parameterised by
  `Cypress.env('framework')`.
- The spec's `frameworkFolders` map points apps that build to `dist/`
  (or `dist/browser/` for Angular) at their built output. Build the
  app first (`npm run build` inside the example) before running — the
  static server only serves what's on disk.
- `tests/cya.js` runs cypress sequentially for many frameworks and
  prints a summary table.
- `tests/excluded.js` lists frameworks the multi-app runner always
  skips (e.g. ones that need a hosted backend).
- `tests/knownIssues.js` lists `<framework>, <test name>` patterns
  that are auto-skipped per framework. Useful for "we know this one's
  broken; don't gate CI on it."

## Notes on lit

The lit example uses three nested shadow roots
(`<todo-app>` → `<todo-list>` → `<todo-item>`), which is the right
pattern for web components. Cypress's `includeShadowDom: true`
pierces one or two levels of shadow but doesn't traverse the
descendant combinator across three, so spec selectors like
`.todo-list li` can't find anything once items are added. The lit
app itself is correct; the test runner can't drive it.

To see what does pass:

```sh
$ npm run server &
$ npx cypress run --env framework=lit
```

Roughly 6/29 tests pass. The rest fail at "find todo li" rather than
on actual app behaviour. Properly fixing this needs spec-side helpers
that walk shadow roots explicitly (or a different test framework).

## Notes on the legacy apps

The non-default apps in `examples/` predate the current spec by
years and are largely unmaintained. Running `--all` will show:

- Several with full or near-full passes (knockback, enyo_backbone,
  reagent, exoskeleton, backbone_require, typescript-backbone, …).
  These still work.
- Some with 3–6 failures from minor spec drift (canjs, dojo,
  knockoutjs, mithril, etc.).
- A handful that cascade-fail at the very first test
  (backbone, emberjs, jquery, web-components, javascript-es5/6,
  aurelia). The apps don't bootstrap into the state the spec
  expects — these are pre-existing issues, not regressions from
  recent work.

Don't gate work on the legacy column; treat it as a state-of-the-
world snapshot.
