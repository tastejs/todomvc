<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# default-resolution

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Get the default resolution time based on the current node version, optionally overridable.

Originally implemented by [@dinoboff][dinoboff] in [gulpjs/undertaker#17][original].

Split out for standalone use.

## Usage

```js
var defaultResolution = require('default-resolution');

defaultResolution();
//-> 1000 (1 second) in node 0.10
//-> 1 (millisecond) in node 0.11+

// use a different value
defaultResolution(12);
//-> 12 always
```

## API

### `defaultResolution([resolution])`

Returns the default resolution, based on the node platform. See [Default resolution table][default-table] below for resolutions.

Optionally takes a resolution number to force override any platform resolutions.

### Default resolutions

| node version | resolution |
|--------------|------------|
| 0.10         | 1s         |
| 0.11+        | 1ms        |

More information at https://github.com/gulpjs/undertaker/pull/17#issuecomment-82374512

# License

MIT

[dinoboff]: https://github.com/dinoboff
[original]: https://github.com/gulpjs/undertaker/pull/17
[default-table]: #default-resolutions

[downloads-image]: http://img.shields.io/npm/dm/default-resolution.svg
[npm-url]: https://www.npmjs.com/package/default-resolution
[npm-image]: http://img.shields.io/npm/v/default-resolution.svg

[travis-url]: https://travis-ci.org/gulpjs/default-resolution
[travis-image]: http://img.shields.io/travis/gulpjs/default-resolution.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/default-resolution
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/default-resolution.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/default-resolution
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/default-resolution/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
