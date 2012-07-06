**NOTE: when.js's unit tests are all currently passing.**

There is a circular dependency between buster.js and when.js that is causing Travis builds to fail. To run the unit tests yourself and verify:

1. Clone the when.js repo
1. Install buster globally to avoid circular dep: `npm install -g buster`
1. `cd when && npm test`
1. Remove buster globally if you want to clean up: `npm remove -g buster`

[![Build Status](https://secure.travis-ci.org/cujojs/when.png)](http://travis-ci.org/cujojs/when)

A lightweight [CommonJS](http://wiki.commonjs.org/wiki/Promises) [Promises/A](http://wiki.commonjs.org/wiki/Promises/A) and `when()` implementation.  It also provides several other useful Promise-related concepts, such as joining and chaining, and has a robust unit test suite.

It's **just over 1k** when compiled with Google Closure (w/advanced optimizations) and gzipped.

when.js was derived from the async core of [wire.js](https://github.com/cujojs/wire).

What's New?
===========

### 1.3.0

* `npm install when` - Yep, that's a thing.
* Fixed a deviation from the Promises/A spec where returning undefined from a callback or errback would cause the previous value to be forwarded.  See [#31](https://github.com/cujojs/when/issues/31)
	* *This could be a breaking change* if you depended on this behavior.  If you encounter problems, the solution is to ensure that your promise callbacks (registered either with `when()` or `.then()`) return what you intend, keeping in mind that not returning something is equivalent to returning `undefined`.
* This change also restores compatibility with the promises returned by `jQuery.get()`, which seem to reject with themselves as the rejection value.  See [issue #41](https://github.com/cujojs/when/issues/43) for more information and discussion.  Thanks to [@KidkArolis](https://github.com/KidkArolis) for raising the issue.

### 1.2.0

* `promise.otherwise(errback)` as a shortcut for `promise.then(null, errback)`. See discussion [here](https://github.com/cujojs/when/issues/13) and [here](https://github.com/cujojs/when/issues/29). Thanks to [@jonnyreeves](https://github.com/jonnyreeves/) for suggesting the name "otherwise".
* [when/debug](https://github.com/cujojs/when/wiki/when-debug) now detects exceptions that typically represent coding errors, such as SyntaxError, ReferenceError, etc. and propagates them to the host environment.  In other words, you'll get a very loud stack trace.

### 1.1.1

* Updated [wiki](https://github.com/cujojs/when/wiki) map/reduce examples, and added simple promise forwarding example
* Fix for calling `when.any()` without a callback ([#33](https://github.com/cujojs/when/issues/33))
* Fix version number in `when.js` source ([#36](https://github.com/cujojs/when/issues/36))

### 1.1.0

* `when.all/any/some/map/reduce` can all now accept a promise for an array in addition to an actual array as input.  This allows composing functions to do interesting things like `when.reduce(when.map(...))`
* `when.reject(promiseOrValue)` that returns a new, rejected promise.
* `promise.always(callback)` as a shortcut for `promise.then(callback, callback)`
* **Highly experimental** [when/debug](https://github.com/cujojs/when/wiki/when-debug) module: a drop-in replacement for the main `when` module that enables debug logging for promises created or consumed by when.js

[Full Changelog](https://github.com/cujojs/when/wiki/Changelog)

Quick Start
===========

### AMD

1. `git clone https://github.com/cujojs/when` or `git submodule add https://github.com/cujojs/when`
1. Configure your loader with a package:

	```javascript
	packages: [
		{ name: 'when', location: 'path/to/when/', main: 'when' },
		// ... other packages ...
	]
	```

1. `define(['when', ...], function(when, ...) { ... });` or `require(['when', ...], function(when, ...) { ... });`

### Script Tag

1. `git clone https://github.com/cujojs/when` or `git submodule add https://github.com/cujojs/when`
1. `<script src="path/to/when/when.js"></script>`
1. `when` will be available as `window.when`

### Node

1. `npm install when`
1. `var when = require('when');`

### RingoJS

1. `ringo-admin install cujojs/when`
1. `var when = require('when');`

Docs & Examples
===============

See the API section below, and the [wiki for more detailed docs](https://github.com/cujojs/when/wiki) and [examples](https://github.com/cujojs/when/wiki/Examples)

API
===

when()
------

Register a handler for a promise or immediate value:

```javascript
when(promiseOrValue, callback, errback, progressback)

// Always returns a promise, so can be chained:

when(promiseOrValue, callback, errback, progressback).then(anotherCallback, anotherErrback, anotherProgressback)
```

**Getting an already-resolved Promise**

You can also use `when()` to get an already-resolved promise for a value, similarly to using `when.reject()` to get a rejected promise (see below):

```javascript
var resolved = when(anything);
```

when.defer()
------------

Create a new Deferred containing separate `promise` and `resolver` parts:

```javascript
var deferred = when.defer();

var promise = deferred.promise;
var resolver = deferred.resolver;
```

**Promise API**

```javascript
// var promise = deferred.promise;

// then()
// Main promise API
// Register callback, errback, and/or progressback
promise.then(callback, errback, progressback);
```

**Extended Promise API**

Convenience methods that are not part of the Promises/A proposal.

```js
// always()
// Register an alwaysback that will be called when the promise resolves or rejects
promise.always(alwaysback [, progressback]);

// otherwise()
// Convenience method to register only an errback
promise.otherwise(errback);
```

**Resolver API**

```javascript
// var resolver = deferred.resolver;
resolver.resolve(value);
resolver.reject(err);
resolver.progress(update);
```

The deferred has the full `promise` + `resolver` API:

```javascript
deferred.then(callback, errback, progressback);
deferred.resolve(value);
deferred.reject(reason);
deferred.progress(update);
```

when.reject()
-------------

```javascript
var rejected = when.reject(anything);
```

Return a rejected promise for the supplied promiseOrValue. If promiseOrValue is a value, it will be the rejection value of the returned promise.  If promiseOrValue is a promise, its completion value will be the rejected value of the returned promise.

This can be useful in situations where you need to reject a promise *without* throwing an exception.  For example, it allows you to propagate a rejection with the value of another promise.

```javascript
when(doSomething(),
	handleSuccess,
	function(error) {
		// doSomething failed, but we want to do some processing on the error
		// to return something more useful to the caller.
		// This allows processError to return either a value or a promise.
		return when.reject(processError(e));
	}
);
```

when.isPromise()
----------------

```javascript
var is = when.isPromise(anything);
```

Return true if `anything` is truthy and implements the then() promise API.  Note that this will return true for both a deferred (i.e. `when.defer()`), and a `deferred.promise` since both implement the promise API.

when.some()
-----------

```javascript
when.some(promisesOrValues, howMany, callback, errback, progressback)
```

Return a promise that will resolve when `howMany` of the supplied `promisesOrValues` have resolved.  The resolution value of the returned promise will be an array of length `howMany` containing the resolutions values of the triggering `promisesOrValues`.

when.all()
----------

```javascript
when.all(promisesOrValues, callback, errback, progressback)
```

Return a promise that will resolve only once *all* the supplied `promisesOrValues` have resolved.  The resolution value of the returned promise will be an array containing the resolution values of each of the `promisesOrValues`.

when.any()
----------

```javascript
when.any(promisesOrValues, callback, errback, progressback)
```

Return a promise that will resolve when any one of the supplied `promisesOrValues` has resolved.  The resolution value of the returned promise will be the resolution value of the triggering `promiseOrValue`.

when.chain()
------------

```javascript
when.chain(promiseOrValue, resolver, optionalValue)
```

Ensure that resolution of `promiseOrValue` will complete `resolver` with the completion value of `promiseOrValue`, or instead with `optionalValue` if it is provided.

Returns a new promise that will complete when `promiseOrValue` is completed, with the completion value of `promiseOrValue`, or instead with `optionalValue` if it is provided.

**Note:** If `promiseOrValue` is not an immediate value, it can be anything that supports the promise API (i.e. `then()`), so you can pass a `deferred` as well.  Similarly, `resolver` can be anything that supports the resolver API (i.e. `resolve()`, `reject()`), so a `deferred` will work there, too.

when.map()
----------

```javascript
when.map(promisesOrValues, mapFunc)
```

Traditional map function, similar to `Array.prototype.map()`, but allows input to contain promises and/or values, and mapFunc may return either a value or a promise.

The map function should have the signature:

```javascript
mapFunc(item)
```

Where:

* `item` is a fully resolved value of a promise or value in `promisesOrValues`

when.reduce()
-------------

```javascript
when.reduce(promisesOrValues, reduceFunc, initialValue)
```

Traditional reduce function, similar to `Array.prototype.reduce()`, but input may contain promises and/or values, and reduceFunc may return either a value or a promise, *and* initialValue may be a promise for the starting value.

The reduce function should have the signature:

```javascript
reduceFunc(currentValue, nextItem, index, total)
```

Where:

* `currentValue` is the current accumulated reduce value
* `nextItem` is the fully resolved value of the promise or value at `index` in `promisesOrValues`
* `index` the *basis* of `nextItem` ... practically speaking, this is the array index of the promiseOrValue corresponding to `nextItem`
* `total` is the total number of items in `promisesOrValues`

when/apply
----------

```javascript
function functionThatAcceptsMultipleArgs(array) {
    // ...
}

var functionThatAcceptsAnArray = apply(functionThatAcceptsMultipleArgs);
```

Helper that allows using callbacks that take multiple args, instead of an array, with `when.all/some/map`:

```javascript
when.all(arrayOfPromisesOrValues, apply(functionThatAcceptsMultipleArgs));
```

[See the wiki](https://github.com/cujojs/when/wiki/when-apply) for more info and examples.

Running the Unit Tests
======================

Install [buster.js](http://busterjs.org/)

`npm install -g buster`

Run unit tests in Node:

1. `buster test -e node`

Run unit tests in Browsers (and Node):

1. `buster server` - this will print a url
2. Point browsers at <buster server url>/capture, e.g. `localhost:1111/capture`
3. `buster test` or `buster test -e browser`

References
----------

Much of this code was inspired by @[unscriptable](https://github.com/unscriptable)'s [tiny promises](https://github.com/unscriptable/promises), the async innards of [wire.js](https://github.com/cujojs/wire), and some gists [here](https://gist.github.com/870729), [here](https://gist.github.com/892345), [here](https://gist.github.com/894356), and [here](https://gist.github.com/894360)

Some of the code has been influenced by the great work in [Q](https://github.com/kriskowal/q), [Dojo's Deferred](https://github.com/dojo/dojo), and [uber.js](https://github.com/phiggins42/uber.js).
