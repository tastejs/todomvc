# hyperscript-attribute-to-property [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/feross/hyperscript-attribute-to-property/master.svg
[travis-url]: https://travis-ci.org/feross/hyperscript-attribute-to-property
[npm-image]: https://img.shields.io/npm/v/hyperscript-attribute-to-property.svg
[npm-url]: https://npmjs.org/package/hyperscript-attribute-to-property
[downloads-image]: https://img.shields.io/npm/dm/hyperscript-attribute-to-property.svg
[downloads-url]: https://npmjs.org/package/hyperscript-attribute-to-property

### Convert hyperscript attributes to properties

Some html attributes have different JavaScript property names. The most annoying of these
is `class` v.s. `className`.

With this package, you can do this:

```js
var vnode = h('div', { class: 'my-class' })
```

Instead of this:

```js
var vnode = h('div', { className: 'my-class' })
```

Works with [virtual-dom](https://www.npmjs.com/package/virtual-dom), [react](https://www.npmjs.com/package/react), [hyperscript](https://www.npmjs.com/package/hyperscript), or any DOM builder with a hyperscript-style API: `h(tagName, attrs, children)`.

## install

```
npm install hyperscript-attribute-to-property
```

## usage

###  example

```js
var attrToProp = require('hyperscript-attribute-to-property')
var h = attrToProp(require('virtual-dom/h'))
```

## hyperx

If you use the [hyperx](https://npmjs.com/package/hyperx) package, then this functionality
is built-in and implemented via this package :)

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
