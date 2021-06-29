<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# semver-greatest-satisfied-range

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Find the greatest satisfied semver range from an array of ranges.

## Usage

```js
var findRange = require('semver-greatest-satisfied-range');

var range = findRange('1.1.0', ['^1.0.0', '^1.1.0', '^1.2.0']);
// range === '^1.1.0'
```

## API

### `findRange(version, rangeArray)`

Takes a version and array of ranges, returns the greatest satisfied range. Range support is defined by [sver-compat][range-support].

## License

MIT

[range-support]: https://github.com/phated/sver-compat#range-support

[downloads-image]: http://img.shields.io/npm/dm/semver-greatest-satisfied-range.svg
[npm-url]: https://www.npmjs.com/package/semver-greatest-satisfied-range
[npm-image]: http://img.shields.io/npm/v/semver-greatest-satisfied-range.svg

[travis-url]: https://travis-ci.org/gulpjs/semver-greatest-satisfied-range
[travis-image]: http://img.shields.io/travis/gulpjs/semver-greatest-satisfied-range.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/semver-greatest-satisfied-range
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/semver-greatest-satisfied-range.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/semver-greatest-satisfied-range
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/semver-greatest-satisfied-range/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
