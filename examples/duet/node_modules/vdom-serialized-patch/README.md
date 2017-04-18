vdom-serialized-patch [![Build Status](https://travis-ci.org/nolanlawson/vdom-serialized-patch.svg)](https://travis-ci.org/nolanlawson/vdom-serialized-patch) [![Coverage Status](https://coveralls.io/repos/github/nolanlawson/vdom-serialized-patch/badge.svg?branch=master)](https://coveralls.io/github/nolanlawson/vdom-serialized-patch?branch=master)
========

Serialize [virtual-dom](https://github.com/Matt-Esch/virtual-dom) patches into a very efficient JSON format, and then patch the DOM directly from that object.

Designed for generating patches on the server or in a web worker and then sending that to the client. Basically this a more efficient and specialized version of [vdom-as-json](https://github.com/nolanlawson/vdom-as-json).

Motivation
----

The `virtual-dom` library is great, but the problem is that the `VirtualPatch` object structure is:

1. huge &ndash; containing the entire source node as well as the patch object and the object to be patched &ndash; and
2. unserializable, since it uses custom classes like `VirtualPatch` and `VirtualText`.

This library solves both those problems, although to do so it has to implement its own version of `virtual-dom/patch`. So you'll have to use this library's `patch` method.

Install
----

    npm install vdom-serialized-patch
    

Usage
---

```js
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var serializePatch = require('vdom-serialized-patch/serialize');
var applyPatch = require('vdom-serialized-patch/patch');

var node1 = h('span', 'hello');
var node2 = h('span.heavy', {style: {'font-weight': 'bold'}}, 'hello world');

var patch = diff(node1, node2);
var serializedPatch = serializePatch(patch);

applyPatch(document.querySelector('#my-element'), serializedPatch);
```

In this case, the serialized patch will look like this:

```json
{
  "0": [
    [
      4,
      {
        "style": {
          "font-weight": "bold"
        },
        "className": "heavy"
      },
      {
        "p": {}
      }
    ]
  ],
  "1": [
    [
      1,
      {
        "t": 1,
        "x": "hello world"
      }
    ]
  ],
  "a": [
    [
      null
    ],
    1
  ]
}
```

(This structure is not designed to be human-readable; it's designed to be efficient when doing `JSON.stringify`/`JSON.parse`).

Limitations
---

This library, like `vdom-as-json`, doesn't support thunks or hooks or any of that stuff, because it's not possible to serialize custom behavior.

Testing this library
---

Test in node using JSDom:

    npm test

Test in the browser using Zuul and PhantomJS:

    npm run test-phantom

Test locally in your browser of choice:

    npm run test-local

Test for code coverage:

    npm run coverage
