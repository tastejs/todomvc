// Run cypress against one or more example apps. Usage:
//   node tests/cya.js                         # every framework not in excluded.js
//   node tests/cya.js --framework=react       # one framework
//   node tests/cya.js -f react -f vue         # multiple
//   node tests/cya.js --main                  # the curated "main" set
//   node tests/cya.js --browser=chrome -t 3   # custom browser, repeat 3 times

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import cypress from 'cypress';
import minimist from 'minimist';

import excludedFrameworks from './excluded.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = minimist(process.argv.slice(2), {
    string: ['framework', 'browser'],
    boolean: ['main', 'problems', 'record'],
    alias: { framework: 'f', times: 't', problems: 'p' },
    default: { times: 1, record: false },
});

const asArray = (value) =>
    value === undefined ? [] : Array.isArray(value) ? value : [value];

const examplesFolder = path.join(__dirname, '..', 'examples');
const allFrameworks = fs
    .readdirSync(examplesFolder)
    .filter((name) => !excludedFrameworks.includes(name))
    .filter((name) => fs.statSync(path.join(examplesFolder, name)).isDirectory());

// Curated set of apps that still build/run reliably. Edit freely.
const mainFrameworks = [
    'angular',
    'lit',
    'preact',
    'react',
    'react-redux',
    'svelte',
    'vue',
];

const problematicFrameworks = ['js_of_ocaml', 'flight'];

const explicit = asArray(args.framework);
const frameworksToTest = explicit.length
    ? explicit
    : args.main
      ? mainFrameworks
      : args.problems
        ? problematicFrameworks
        : allFrameworks;

if (frameworksToTest.length === 0) {
    console.log('nothing to test');
    process.exit(1);
}

console.log(`testing ${frameworksToTest.length} framework(s):`, frameworksToTest.join(', '));
if (args.times > 1) console.log(`running each spec ${args.times} times`);
if (args.browser) console.log(`browser: ${args.browser}`);

const results = [];

for (const app of frameworksToTest) {
    console.log(`\n=== ${app} ===`);
    try {
        const result = await cypress.run({
            browser: args.browser,
            record: args.record,
            env: { framework: app, times: args.times },
        });
        results.push({
            app,
            tests: result.totalTests,
            passing: result.totalPassed,
            failing: result.totalFailed,
            skipped: result.totalSkipped,
            duration: `${Math.round(result.totalDuration / 1000)}s`,
        });
    } catch (err) {
        console.error(`problem testing ${app}:`, err.message);
        results.push({ app, tests: 0, passing: 0, failing: '?', skipped: 0, duration: '-' });
    }
}

console.table(results);

const totalFailing = results.reduce(
    (n, r) => n + (typeof r.failing === 'number' ? r.failing : 1),
    0,
);
process.exit(totalFailing > 0 ? 1 : 0);
