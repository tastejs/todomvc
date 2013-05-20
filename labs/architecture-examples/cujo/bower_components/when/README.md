<a href="http://promises-aplus.github.com/promises-spec"><img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png" alt="Promises/A+ logo" align="right" /></a>

[![Build Status](https://secure.travis-ci.org/cujojs/when.png)](http://travis-ci.org/cujojs/when) 

# when.js

When.js is cujoJS's lightweight [Promises/A+](http://promises-aplus.github.com/promises-spec) and `when()` implementation that powers the async core of [wire.js](https://github.com/cujojs/wire), cujoJS's IOC Container.  It features:

* A rock solid, battle-tested Promise implementation
* Resolving, settling, mapping, and reducing arrays of promises
* Executing tasks in parallel and sequence
* Transforming Node-style and other callback-based APIs into promise-based APIs

It passes the [Promises/A+ Test Suite](https://github.com/promises-aplus/promises-tests), is [very fast](https://github.com/cujojs/promise-perf-tests#test-results), is under 1.5k when compiled with Google Closure + gzip, and has no external dependencies.

# What's New?

### 2.1.0

* New [`when.settle`](docs/api.md#whensettle) that settles an array of promises
* New [`when/guard`](docs/api.md#whenguard) generalized concurrency guarding and limiting
* New [`promise.inspect`](docs/api.md#inspect) for synchronously getting a snapshot of a promise's state at a particular instant.
* Significant performance improvements when resolving promises with non-primitives (e.g. with Arrays, Objects, etc.)
* Experimental [vert.x](http://vertx.io) support
* **DEPRECATED**: `onFulfilled`, `onRejected`, `onProgress` handler arguments to `when.all`, `when.any`, `when.some`.  Use the returned promise's `then()` (or `otherwise()`, `ensure()`, etc) to register handlers instead.
	* For example, do this: `when.all(array).then(onFulfilled, onRejected)` instead of this: `when.all(array, onFulfilled, onRejected)`.  The functionality is equivalent.

### 2.0.1

* Account for the fact that Mocha creates a global named `process`. Thanks [Narsul](https://github.com/cujojs/when/pull/136)

### 2.0.0

* Fully asynchronous resolutions.
* [Promises/A+](http://promises-aplus.github.com/promises-spec) compliance.
* New [`when/keys`](docs/api.md#object-keys) module with `all()` and `map()` for object keys/values.
* New [`promise.ensure`](docs/api.md#ensure) as a better, and safer, replacement for `promise.always`.  [See discussion](https://github.com/cujojs/when/issues/103) as to why `promise.always` is mistake-prone.
	* **DEPRECATED:** `promise.always`
* `lift()` is now the preferred name for what was `bind()` in [when/function](docs/api.md#synchronous-functions), [when/node/function](docs/api.md#node-style-asynchronous-functions), and [when/callbacks](docs/api.md#asynchronous-functions).
	* **DEPRECATED:** `bind()` in `when/function`, `when/node/function`, and `when/callbacks`.  Use `lift()` instead.

[Full Changelog](CHANGES.md)

# Docs & Examples

[API docs](docs/api.md#api)

[More info on the wiki](https://github.com/cujojs/when/wiki)

[Examples](https://github.com/cujojs/when/wiki/Examples)

Quick Start
===========

### AMD

1. Get it
	- `bower install when` or `yeoman install when`, *or*
	- `git clone https://github.com/cujojs/when` or `git submodule add https://github.com/cujojs/when`
1. Configure your loader with a package:

	```js
	packages: [
		{ name: 'when', location: 'path/to/when/', main: 'when' },
		// ... other packages ...
	]
	```

1. `define(['when', ...], function(when, ...) { ... });` or `require(['when', ...], function(when, ...) { ... });`

### Node

1. `npm install when`
1. `var when = require('when');`

### RingoJS

1. `ringo-admin install cujojs/when`
1. `var when = require('when');`

### Legacy environments

1. `git clone https://github.com/cujojs/when` or `git submodule add https://github.com/cujojs/when`
1. Add a transient `define` shim, and a `<script>` element for when.js

	```html
	<script>
		window.define = function(factory) {
			try{ delete window.define; } catch(e){ window.define = void 0; } // IE
			window.when = factory();
		};
		window.define.amd = {};
	</script>
	<script src="path/to/when/when.js"></script>
	```

1. `when` will be available as `window.when`

# Running the Unit Tests

## Node

Note that when.js includes the [Promises/A+ Test Suite](https://github.com/promises-aplus/promise-tests).  Running unit tests in Node will run both when.js's own test suite, and the Promises/A+ Test Suite.

1. `npm install`
1. `npm test`

## Browsers

1. `npm install`
1. `npm start` - starts buster server & prints a url
1. Point browsers at <buster server url>/capture, e.g. `localhost:1111/capture`
1. `npm run-script test-browser`

References
----------

Much of this code was inspired by the async innards of [wire.js](https://github.com/cujojs/wire), and has been influenced by the great work in [Q](https://github.com/kriskowal/q), [Dojo's Deferred](https://github.com/dojo/dojo), and [uber.js](https://github.com/phiggins42/uber.js).
