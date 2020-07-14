# normalize-html-whitespace [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Safely remove repeating whitespace from HTML text.


Using `\s` to normalize HTML whitespace will strip out characters that are actually rendered by a web browser. Such would be classified as a lossy change and would produce a different visual result. This package will collapse multiple whitespace characters down to a single space, while ignoring the following characters:

* `\u00a0` or `&nbsp;` (non-breaking space)
* `\ufeff` or `&#65279;` (zero-width non-breaking space)

…as well as these lesser-known ones:

* `\u1680`​ or `&#5760;` (Ogham space mark)
* `\u180e` or `&#6158;` (Mongolian vowel separator)
* `\u2000​` or `&#8192;` (en quad)
* `\u2001` or `&#8193;` (em quad)
* `\u2002` or `&#8194;` (en space)
* `\u2003` or `&#8195;` (em space)
* `\u2004` or `&#8196;` (three-per-em space)
* `\u2005` or `&#8197;` (four-per-em space)
* `\u2006` or `&#8198;` (six-per-em space)
* `\u2007` or `&#8199;` (figure space)
* `\u2008` or `&#8200;` (punctuation space)
* `\u2009` or `&#8201;` (thin space)
* `\u200a` or `&#8202;` (hair space)
* `\u2028` or `&#8232;` (line separator)
* `\u2029` or `&#8233;` (paragraph separator)
* `\u202f` or `&#8239;` (narrow non-breaking space)
* `\u205f` or `&#8287;` (medium mathematical space)
* `\u3000` or `&#12288;` (ideographic space)

For the sake of completeness, the following characters which are not part of `\s` will also not be affected:

* `\u200b` or `&#8203;` (zero-width breaking space)

Note: this package does not contain an HTML parser. It is meant to be used on text nodes only.


## Installation
[Node.js](http://nodejs.org/) `>= 8` is required. Type this at the command line:
```shell
npm install normalize-html-whitespace
```


## Usage
```js
const normalizeWhitespace = require('normalize-html-whitespace');

normalizeWhitespace('  foo bar     baz ');
//-> ' foo bar baz '
```


[npm-image]: https://img.shields.io/npm/v/normalize-html-whitespace.svg
[npm-url]: https://npmjs.com/package/normalize-html-whitespace
[travis-image]: https://img.shields.io/travis/stevenvachon/normalize-html-whitespace.svg
[travis-url]: https://travis-ci.org/stevenvachon/normalize-html-whitespace
