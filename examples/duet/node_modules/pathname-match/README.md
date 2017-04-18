# pathname-match
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

Strip a url to only match the `pathname`. Weighs only 200 bytes gzipped.

## Installation
```bash
$ npm install pathname-match
```

## Usage
```js
const pathMatch = require('pathname-match')
const wayfarer  = require('wayfarer')

const router = wayfarer('/')

router.on('/', => console.log('home'))
router.on('/derp', => console.log('derp'))
router.on('/404', => console.log('not found'))

router.match(pathMatch('/derp/#foo?bin=baz'))
// => '/derp'
```

## Why?
It's meant to feed the output to a router such as [wayfarer][wayfarer], and not
having to worry about hashes in the url. This used to be part of wayfarer, but
has been stripped out to make the api even smaller.

## See Also
- [wayfarer][wayfarer]
- [hash-match](https://github.com/sethvincent/hash-match)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/pathname-match.svg?style=flat-square
[npm-url]: https://npmjs.org/package/pathname-match
[travis-image]: https://img.shields.io/travis/yoshuawuyts/pathname-match.svg?style=flat-square
[travis-url]: https://travis-ci.org/yoshuawuyts/pathname-match
[coveralls-image]: https://img.shields.io/coveralls/yoshuawuyts/pathname-match.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yoshuawuyts/pathname-match?branch=master
[downloads-image]: http://img.shields.io/npm/dm/pathname-match.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/pathname-match

[wayfarer]: https://github.com/yoshuawuyts/wayfarer
