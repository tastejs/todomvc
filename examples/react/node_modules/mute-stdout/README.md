<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# mute-stdout

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Travis Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Mute and unmute stdout.

## Usage

```js
var stdout = require('mute-stdout');

stdout.mute();

console.log('will not print');

stdout.unmute();

console.log('will print');
```

## API

### mute()

Mutes the `process.stdout` stream by replacing the `write` method with a no-op function.

### unmute()

Unmutes the `process.stdout` stream by restoring the original `write` method.

## License

MIT

[downloads-image]: http://img.shields.io/npm/dm/mute-stdout.svg
[npm-url]: https://www.npmjs.com/package/mute-stdout
[npm-image]: http://img.shields.io/npm/v/mute-stdout.svg

[travis-url]: https://travis-ci.org/gulpjs/mute-stdout
[travis-image]: http://img.shields.io/travis/gulpjs/mute-stdout.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/mute-stdout
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/mute-stdout.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/mute-stdout
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/mute-stdout/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
