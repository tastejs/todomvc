# [copy-props][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

Copy properties between two objects deeply.

## Install

To install from npm:

```sh
$ npm i copy-props --save
```

## Load this module

For Node.js:

```js
const copyProps = require('copy-props');
```

For Web browser:

```html
<script src="copy-props.min.js"></script>
```

## Usage

Copy *src* to *dst* simply (and return *dst*) :

```js
var src = { a: 1, b: { b1: 'bbb' }, c: 'ccc' };
var dst = { a: 2, b: { b1: 'xxx', b2: 'yyy' } };

copyProps(src, dst);
// => { a: 1, b: { b1: 'bbb', b2: 'yyy' }, c: 'ccc' }
```

Copy *src* to *dst* with property mapping (and return *dst*) :

```js
var src = { a: 1, b: { b1: 'bbb' }, c: 'ccc', d: 'ddd' };
var dst = { f: { a: 2, b1: 'xxx', b2: 'yyy' }, e: 'zzz' };

copyProps(src, dst, {
  a: 'f.a',
  'b.b1': 'f.b1',
  'b.b2': 'f.b2',
  'c': 'f.c',
});
// => { f: { a: 1, b1: 'bbb', b2: 'yyy', c: 'ccc' }, e: 'zzz' }
```

Copy *src* to *dst* with convert function (and return *dst*) :

```js
var src = { a: 1, b: { b1: 'bbb' } };
var dst = { a: 0 };

copyProps(src, dst, function(srcInfo) {
  if (srcInfo.keyChain === 'a') {
    return srcInfo.value * 2;
  }
  if (srcInfo.keyChain === 'b.b1') {
    return srcInfo.value.toUpperCase();
  }
});
// => { a: 2, b: { b1: 'BBB' } }
```

Can use an array instead of a map as property mapping :

```js
var src = { a: 1, b: { c: 'CCC' }, d: { e: 'EEE' } };
var dst = { a: 9, b: { c: 'xxx' }, d: { e: 'yyy' } };
var fromto = [ 'b.c', 'd.e' ];
copyProps(src, dst, fromto);
// => { a: 9, b: { c: 'CCC' }, d: { e: 'EEE' } }
```

Can copy reversively (from *dst* to *src*) by reverse flag (and return *src*):

```js
var src = { a: 1, b: { b1: 'bbb' }, c: 'ccc' };
var dst = { a: 2, b: { b1: 'xxx', b2: 'yyy' } };

copyProps(src, dst, true);
// => { a: 2, b: { b1: 'xxx', b2: 'yyy' }, c: 'ccc' }
```

```js
var src = { a: 1, b: { b1: 'bbb' }, c: 'ccc', d: 'ddd' };
var dst = { f: { a: 2, b1: 'xxx', b2: 'yyy' }, e: 'zzz' };

copyProps(src, dst, {
  a: 'f.a',
  'b.b2': 'f.b2',
  'c': 'f.c',
}, true);
// => { a: 2, b: { b1: 'bbb', b2: 'yyy' }, c: 'ccc', d: 'ddd' }
```

If a value of source property is undefined (when not using converter), or a result of converter is undefined (when using converter), the value is not copied.

```js
var src = { a: 'A', b: undefined, c: null, d: 1 };
var dst = { a: 'a', b: 'b', c: 'c' };

copyProps(src, dst, function(srcInfo) {
  if (srcInfo.keyChain === 'd') {
    return undefined;
  } else {
    return srcInfo.value;
  }
});
// => { a: 'A', b: 'b', c: null }
```

You can operate the parent node object directly in converter.

```js
var src = { a: 1, b: 2 };
var dst = {};

copyProps(src, dst, function(srcInfo, dstInfo) {
  Object.defineProperty(dstInfo.parent, dstInfo.key, {
    writable: false,
    enumerable: true,
    configurable: false,
    value: srcInfo.value * 2
  })
}); // => { a: 2, b: 4 }

dst // => { a: 2, b: 4 }
dst.a = 9
dst // -> { a: 2, b: 4 }
```

## API

### <u>copyProps(src, dst [, fromto] [, converter] [, reverse]) => object</u>

Copy properties of *src* to *dst* deeply.
If *fromto* is given, it is able to copy between different properties.
If *converter* is given, it is able to convert the terminal values.

#### Parameters:

| Parameter   |  Type  | Description                                      |
|:------------|:------:|:-------------------------------------------------|
| *src*       | object | A source object of copy.                         |
| *dst*       | object | A destinate object of copy.                      |
| *fromto*    | object &#124; array | An object mapping properties between *src* and *dst*. (Optional) |
| *converter* |function| A function to convert terminal values in *src*. (Optional) |
| *reverse*   |boolean | True, if copying reversively from dst to src and returns src object. `fromto` is also reversively used from value to key. This default value is `false`. (Optional) |

#### Returns:

*dst* object after copying.

**Type:** object

* **Format of <i>fromto</i>**

    *fromto* is a non-nested key-value object. And the *key*s are property key    chains of *src* and the *value*s are property key chains of *dst*. 
    The key chain is a string which is concatenated property keys on each level with dots, like `'aaa.bbb.ccc'`.

    The following example copys the value of `src.aaa.bbb.ccc` to `dst.xxx.yyy`.

    ```js
    copyProps(src, dst, {
      'aaa.bbb.ccc' : 'xxx.yyy'
    })
    ```

    *fromto* can be an array. In that case, the array works as a map which has pairs of same key and value.
    
* **API of <i>converter</i>**

    **<u>converter(srcInfo, dstInfo) : Any</u>**

    *converter* is a function to convert terminal values of propeerties of *src*.

    **Parameters:**

    | Parameter   |  Type  | Description                                  |
    |:------------|:------:|:---------------------------------------------|
    | *srcInfo*   | object | An object which has informations about the current node of *src*. |
    | *dstInfo*   | object | An object which has informations about the current node of *dst*. |
    
    **Return:**
    
    The converted value to be set as a destination property value. If this value is undefined, the destination property is not set to the destination node object.
    
    **Type:** *Any*
    
    * **Properties of <i>srcInfo</i> and <i>dstInfo</i>**

        *srcInfo* and *dstInfo* has same properties, as follows:
    
        | Property   |  Type  | Description                               |
        |:-----------|:------:|:------------------------------------------|
        | *value*    | *Any*  | The value of the current node.            |
        | *key*      | string | The key name of the current node.         |
        | *keyChain* | string | The full key of the current node concatenated with dot. |
        | *depth*    | number | The depth of the current node.            |
        | *parent*   | object | The parent node of the current node.      |


## License

Copyright (C) 2016-2021 Gulp Team.

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/gulpjs/copy-props/
[npm-img]: https://img.shields.io/badge/npm-v2.0.5-blue.svg
[npm-url]: https://www.npmjs.org/package/copy-props/
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses.MIT
[travis-img]: https://travis-ci.org/gulpjs/copy-props.svg?branch=master
[travis-url]: https://travis-ci.org/gulpjs/copy-props
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/gulpjs/copy-props?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/gulpjs/copy-props
[coverage-img]: https://coveralls.io/repos/github/gulpjs/copy-props/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/gulpjs/copy-props?branch=master
