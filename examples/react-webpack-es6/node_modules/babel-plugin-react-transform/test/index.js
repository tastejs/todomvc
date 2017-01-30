import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('finds React components', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath).code;

      const expected = fs.readFileSync(
        path.join(fixtureDir, 'expected.js')
      ).toString().replace(/%FIXTURE_PATH%/g, actualPath);

      assert.equal(trim(actual), trim(expected));
    });
  });
});
