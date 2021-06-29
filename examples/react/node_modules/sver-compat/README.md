# sver-compat

[![Build Status](https://travis-ci.org/phated/sver-compat.svg?branch=master)](https://travis-ci.org/phated/sver-compat)

Fork of @guybedford's [Sver](https://github.com/guybedford/sver) library. Adds compatibility for node <6.

```
npm install sver-compat
```

```js
var Semver = require('sver-compat').Semver;
var SemverRange = require('sver-compat').SemverRange;

// Static usage:
SemverRange.match('^1.2.3', '1.2.4'); // true

// Class usage:
var range = new SemverRange('^1.2.3');
var version = new Semver('1.2.4');
version.matches(range);               // true
range.has(version);                   // true
```

### Range support

Restricts version ranges to the simplified cases:
* `*`: Wildcard range
* `MAJOR`: Match exact major
* `MAJOR.MINOR` Match exact major and minor
* `MAJOR.MINOR.PATCH[-PRE]` Match exact semver
* `~MAJOR.MINOR.PATCH[-PRE]`: Match patch bumps
* `^MAJOR.MINOR.PATCH[-PRE]`: Match minor and patch bumps

Invalid ranges will fallback to being detected as exact string matches.

### Prerelease Matching

By default, as per convention, ranges like `^1.2.3-alpha` only match prerelease ranges on the same patch (`1.2.3-alpha.4`), but
not prerelease ranges from further patches (`1.3.4-alpha`).

To alter this matching, a third boolean argument can be provided to the match function to support these unstable matches:

```js
SemverRange.match('^1.2.3', '1.5.6-beta');       // false
SemverRange.match('^1.2.3', '1.5.6-beta', true); // true
```

### Best Version Match

```js
var versions = ['1.2.3', '1.3.4-alpha', '1.3.4-alpha.1', '1.3.4-beta'];
var range = new SemverRange('*');

var bestStableMatch = range.bestMatch(versions);
bestStableMatch.toString();                     // 1.2.3

var bestUnstableMatch = range.bestMatch(versions, true);
bestUnstableMatch.toString();                   // 1.3.4-beta
```

### Version and Range Sorting

```js
var versions = ['2.4.5', '2.3.4-alpha', '1.2.3', '2.3.4-alpha.2'];
var ranges = ['^1.2.3', '1.2', '2.3.4'];

versions.sort(Semver.compare);   // [1.2.3, 2.3.4-alpha, 2.3.4-alpha.2, 2.4.5]
ranges.sort(SemverRange.compare) // [1.2, ^1.2.3, 2.3.4]
```

### Conversion from Node Semver Ranges

A utility function is included to convert Node Semver ranges into Semver ranges.

This requires `semver` to be installed in the application running this process.

_Note this conversion is lossy by definition._

```js
var convertRange = require('sver-compat/convert-range');

convertRange('>=2.3.4 <3.0.0').toString(); // ^2.3.4
convertRange('1 || 2 || 3').toString();    // ^3.0.0
```

### Semver and Semver Range Validation

When a version string fails semver validation it falls back to being treated as a tag, still as a `Semver` instance.

For example:

```js
var version = new Semver('x.y.z');
version.tag === 'x.y.z';             // true

version = new Semver('^1.2.3');
version.major === undefined;         // true
version.tag === '^1.2.3';            // true
```

For validation, rather use `Semver.isValid` and `SemverRange.isValid`:

```js
Semver.isValid('x.y.z');             // false
Semver.isValid('^1.2.3');            // false
SemverRange.isValid('^1.2.3');       // true
```

## API

### Semver

Static methods:

* `Semver.isValid(version: string): boolean`: Whether the given string is a valid semver.
* `Semver.compare(v1: Semver|string, v2: Semver|string): number`: 1 if v1 > v2, -1 if v1 < v2, 0 if equal.

For a given Semver instance `version = new Semver('X.Y.Z')`,

* `version.major`: The major version number.
* `version.minor`: The minor version number.
* `version.patch`: The patch version number.
* `version.pre`: The prerelease identifer, as an array of strings (`.`-separated).
* `version.build`: The build identifier, as a string.
* `version.tag`: If not a valid semver, the full tag string.
* `version.gt(otherVersion: Semver|string): bool`: Whether this version is greater than the other version.
* `version.lt(otherVersion: Semver|string): bool`: Whether this version is less than the other version.
* `version.eq(otherVerion: Semver|string): bool`: Whether this version equals the other version.
* `version.matches(range: SemverRange|string, unstable?: bool): bool`: Whether this version matches the given version range.
* `version.toString(): string`: Convert the version back to a string.

### SemverRange

Static methods:

* `SemverRange.match(range: SemverRange|string, version: Semver|string, unstable = false): bool`: Whether the version matches the range.
* `SemverRange.isValid(range: string): bool`: Whether the given range string is a valid semver range (in this simplified grammar).
* `SemverRange.compare(r1: SemverRange|string, r2: SemverRange|string): number`: 1 if r1 > r2, -1 if r1 < r2, 0 if equal.

For a given SemverRange instance `range = new SemverRange('^X.Y.Z')`,

* `range.type: string`: Returns `'wildcard'`, `'major'`, `'stable'` or `'exact'`.
* `range.version: Smever`: Returns the `Semver` instance corresponding to the range.
* `range.isExact: string`: Returns true if the range is an exact version only.
* `range.isStable: string`: Returns true if the range is a stable version range.
* `range.isMajor: string`: Returns true if the range is a major version range.
* `range.isWildcard: string`: Returns true if the range is the wildcard version range.
* `range.gt(otherRange: SemverRange|string): bool`: Whether the range is greater than the other range.
* `range.lt(otherRange: SemverRange|string): bool`: Whether the range is less than the other range.
* `range.eq(otherRange: SemverRange|string): bool`: Whether the range is exactly the same as the other range.
* `range.has(version: Semver|string, unstable = false): bool`: Whether the range includes the given version.
* `range.contains(otherRange: SemverRange|string): bool`: Whether the range fully contains the other range.
* `range.intersect(otherRange: SemverRange|string): SemverRange|undefined`: The intersection range, if any.
* `range.bestMatch(versions: (Semver|string)[], unstable = false): Semver|undefined`: The intersection range, if any.
* `range.toString()`: Convert the range back to a string.

## License

MIT
