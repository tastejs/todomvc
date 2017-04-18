vdom-as-json [![Build Status](https://travis-ci.org/nolanlawson/vdom-as-json.svg)](https://travis-ci.org/nolanlawson/vdom-as-json) [![Coverage Status](https://coveralls.io/repos/nolanlawson/vdom-as-json/badge.svg?branch=master&service=github)](https://coveralls.io/github/nolanlawson/vdom-as-json?branch=master)
----

Convert [virtual-dom](https://github.com/Matt-Esch/virtual-dom) objects to and from JSON. Designed for generating patches on the server or in a web worker and then sending that to the client. Can convert virtual trees, nodes, and patches.

Install
---

```
npm install vdom-as-json
```

If you need an AMD or browser-ready version, please use `dist/vdom-as-json.js` when you `npm install`, or [download from wzrd.in](https://wzrd.in/standalone/vdom-as-json@latest). It will give you a global `vdomAsJson` object.

Usage
---

```js
var toJson = require('vdom-as-json/toJson'); // convert node/patch to JSON

var fromJson = require('vdom-as-json/fromJson'); // rehydrate node/patch from JSON
```

Examples
---

### Convert a node to and from JSON

```js
var h = require('virtual-dom/h');
var toJson = require('vdom-as-json/toJson');
var fromJson = require('vdom-as-json/fromJson');

var node = h("div", "hello");

// convert the node to json
var json = toJson(node);

// re-hydrate the node from json
var rehydratedNode = fromJson(json);
```

### Convert a patch to and from JSON

```js
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var toJson = require('vdom-as-json/toJson');
var fromJson = require('vdom-as-json/fromJson');

var node1 = h("div", "hello");
var node2 = h("div", "goodbye");
var patch = diff(node1, node2);

// convert the patch to json
var json = toJson(patch);

// re-hydrate the patch from json
var rehydratedPatch = fromJson(json);
```


### Stringify and parse

The API returns pure JSON objects. So if you need strings, then use `JSON.parse()` and `JSON.stringify()`:

```js
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var toJson = require('vdom-as-json/toJson');
var fromJson = require('vdom-as-json/fromJson');

var node1 = h("div", "hello");
var node2 = h("div", "goodbye");
var patch = diff(node1, node2);

// convert the patch to a string
var jsonString = JSON.stringify(toJson(patch));

// re-hydrate the patch from a string
var rehydratedPatch = fromJson(JSON.parse(jsonString));
```


### Standalone

Using browserify/webpack:

```js
var toJson = require('vdom-as-json').toJson;
var fromJson = require('vdom-as-json').fromJson;
```

Using the standalone browser bundle (`dist/vdom-as-json.js`):

```js
var toJson = vdomAsJson.toJson;
var fromJson = vdomAsJson.fromJson;
```