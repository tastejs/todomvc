<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# replace-homedir

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

Replace user home in a string with another string. Useful for tildifying a path.

## Usage

```js
var replaceHomedir = require('replace-homedir');

var shortPath = replaceHomedir('/Users/phated/myProject', '~');
// shortPath === '~/myProject'
```

## API

### `replaceHomedir(path, replacement)`

Takes a string `path` as the first argument and a string or function `replacement` as the second argument. If the `path` is absolute and begins with the User's homedir, the homedir portion of the path is replaced with `replacement` using String#replace.

If `path` is not a string, the function will throw.

## License

MIT

[downloads-image]: http://img.shields.io/npm/dm/replace-homedir.svg
[npm-url]: https://www.npmjs.com/package/replace-homedir
[npm-image]: http://img.shields.io/npm/v/replace-homedir.svg

[travis-url]: https://travis-ci.org/gulpjs/replace-homedir
[travis-image]: http://img.shields.io/travis/gulpjs/replace-homedir.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/replace-homedir
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/replace-homedir.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulpjs/replace-homedir
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/replace-homedir/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg
