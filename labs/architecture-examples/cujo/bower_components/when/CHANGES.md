### 2.1.0

* New [`when.settle`](docs/api.md#whensettle) that settles an array of promises, regardless of whether the fulfill or reject.
* New [`when/guard`](docs/api.md#whenguard) generalized concurrency guarding and limiting
* New [`promise.inspect`](docs/api.md#inspect) for synchronously getting a snapshot of a promise's state at a particular instant.
* Significant performance improvements when resolving promises with non-primitives (Arrays, Objects, etc.)
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

### 1.8.1

* Last 1.x.x release before 2.0.0 barring critical fixes.
	* To prepare for 2.0.0, [test your code against the dev-200 branch](https://github.com/cujojs/when/tree/dev-200). It is fully API compatible, but has fully asynchronous resolutions.
* Performance improvements for [when/function](docs/api.md#synchronous-functions).
* [Documentation](docs/api.md) updates and fixes. Thanks, [@unscriptable](https://github.com/unscriptable)!
* **DEPRECATED:** `deferred.progress` and `deferred.resolver.progress`. Use [`deferred.notify`](docs/api.md#progress-events) and [`deferred.resolver.notify`](docs/api.md#progress-events) instead.
* **DEPRECATED:** [`when.chain`](docs/api.md#whenchain). Use [`resolver.resolve(promise)`](docs/api.md#resolver) or `resolver.resolve(promise.yield)` ([see `promise.yield`](docs/api.md#yield)) instead.
* **DEPRECATED:** `when/timed` module.  Use [`when/delay`](docs/api.md#whendelay) and [`when/timeout`](docs/api.md#whentimeout) modules instead.

### 1.8.0

* New [when/function](docs/api.md#synchronous-functions), [when/node/function](docs/api.md#node-style-asynchronous-functions), and [when/callbacks](docs/api.md#asynchronous-functions) with functional programming goodness, and adapters for turning callback-based APIs into promise-based APIs. Kudos [@riccieri](https://github.com/riccieri)!
* New [when/unfold](docs/api.md#whenunfold), and [when/unfold/list](docs/api.md#whenunfoldlist) promise-aware anamorphic unfolds that can be used to generate and/or process unbounded lists.
* New [when/poll](docs/api.md#whenpoll) promise-based periodic polling and task execution. Kudos [@scothis](https://github.com/scothis)!

### 1.7.1

* Removed leftover internal usages of `deferred.then`.
* [when/debug](https://github.com/cujojs/when/wiki/when-debug) allows configuring the set of "fatal" error types that will be rethrown to the host env.

### 1.7.0

* **DEPRECATED:** `deferred.then` [is deprecated](docs/api.md#deferred) and will be removed in an upcoming release.  Use `deferred.promise.then` instead.
* [promise.yield](docs/api.md#yield)(promiseOrValue) convenience API for substituting a new value into a promise chain.
* [promise.spread](docs/api.md#spread)(variadicFunction) convenience API for spreading an array onto a fulfill handler that accepts variadic arguments. [Mmmm, buttery](http://s.shld.net/is/image/Sears/033W048977110001_20100422100331516?hei=1600&wid=1600&op_sharpen=1&resMode=sharp&op_usm=0.9,0.5,0,0)
* Doc improvements:
	* [when()](docs/api.md#when) and [promise.then()](docs/api.md#main-promise-api) have more info about callbacks and chaining behavior.
	* More info and clarifications about the roles of [Deferred](docs/api.md#deferred) and [Resolver](docs/api.md#resolver)
	* Several minor clarifications for various APIs
* Internal improvements to assimilation and interoperability with other promise implementations.

### 1.6.1

* Fix for accidental coercion of non-promises. See [#62](https://github.com/cujojs/when/issues/60).

### 1.6.0

* New [when.join](docs/api.md#whenjoin) - Joins 2 or more promises together into a single promise.
* [when.some](docs/api.md#whensome) and [when.any](docs/api.md#whenany) now act like competitive races, and have generally more useful behavior.  [Read the discussion in #60](https://github.com/cujojs/when/issues/60).
* *Experimental* progress event propagation.  Progress events will propagate through promise chains. [Read the details here](docs/api.md#progress-events).
* *Temporarily* removed calls to `Object.freeze`. Promises are no longer frozen due to a horrendous v8 performance penalty.  [Read discussion here](https://groups.google.com/d/topic/cujojs/w_olYqorbsY/discussion).
    * **IMPORTANT:** Continue to treat promises as if they are frozen, since `freeze()` will be reintroduced once v8 performance improves.
* [when/debug](https://github.com/cujojs/when/wiki/when-debug) now allows setting global a debugging callback for rejected promises.

### 1.5.2

* Integrate @domenic's [Promises/A Test Suite](https://github.com/domenic/promise-tests). Runs via `npm test`.
* No functional change

### 1.5.1

* Performance optimization for [when.defer](docs/api.md#whendefer), up to 1.5x in some cases.
* [when/debug](docs/api.md#whendebug) can now log exceptions and rejections in deeper promise chains, in some cases, even when the promises involved aren't when.js promises.

### 1.5.0

* New task execution and concurrency management: [when/sequence](docs/api.md#whensequence), [when/pipeline](docs/api.md#whenpipeline), and [when/parallel](docs/api.md#whenparallel).
* Performance optimizations for [when.all](docs/api.md#whenall) and [when.map](docs/api.md#whenmap), up to 2x in some cases.
* Options for disabling [paranoid mode](docs/api.md#paranoid-mode) that provides a significant performance gain in v8 (e.g. Node and Chrome). See this [v8 performance problem with Object.freeze](http://stackoverflow.com/questions/8435080/any-performance-benefit-to-locking-down-javascript-objects) for more info.
* **Important:** `deferred` and `deferred.resolver` no longer throw when resolved/rejected multiple times.  They will return silently as if the they had succeeded.  This prevents parties to whom *only* the `resolver` has been given from using `try/catch` to determine the state of the associated promise.
    * For debugging, you can use the [when/debug](https://github.com/cujojs/when/wiki/when-debug) module, which will still throw when a deferred is resolved/rejected multiple times.

### 1.4.4

* Change UMD boilerplate to check for `exports` to avoid a problem with QUnit.  See [#54](https://github.com/cujojs/when/issues/54) for more info.

### 1.4.3

* Fix for infinite promise coercion between when.js and Q (See [#50](https://github.com/cujojs/when/issues/50)). Thanks [@kriskowal](https://github.com/kriskowal) and [@domenic](https://github.com/domenic)

### 1.4.2

* Fix for IE8 infinite recursion (See [#49](https://github.com/cujojs/when/issues/49))

### 1.4.1

* Code and unit test cleanup and streamlining--no functional changes.

### 1.4.0

* Create a resolved promise: `when.resolve(value)` creates a resolved promise for `value`. See [API docs](docs/api.md#whenresolve).
* Resolve/reject return something useful: `deferred.resolve` and `deferred.reject` now return a promise for the fulfilled or rejected value.
* Resolve a deferred with another promise: `deferred.resolve(promise)` - when `promise` resolves or rejects, so will `deferred`.

### 1.3.0

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

### 1.0.4

* [Travis CI](http://travis-ci.org/cujojs/when) integration
* Fix for cancelable deferred not invoking progress callbacks. ([#24](https://github.com/cujojs/when/pull/24) Thanks [@scothis](https://github.com/scothis))
* The promise returned by `when.chain` now rejects when the input promise rejects.

### 1.0.3

* Fix for specific situation where `null` could incorrectly be used as a promise resolution value ([#23](https://github.com/cujojs/when/pull/23))

### 1.0.2

* Updated README for running unit tests in both Node and Browsers.  See **Running the Unit Tests** below.
* Set package name to 'when' in package.json

### 1.0.1

* Fix for rejections propagating in some cases when they shouldn't have been ([#19](https://github.com/cujojs/when/issues/19))
* Using [buster.js](http://busterjs.org/) for unit tests now.

### 1.0.0

* First official when.js release as a part of [cujojs](https://github.com/cujojs).
* Added [when/cancelable](https://github.com/cujojs/when/wiki/when-cancelable) decorator for creating cancelable deferreds
* Added [when/delay](https://github.com/cujojs/when/wiki/when-delay) and [when/timeout](https://github.com/cujojs/when/wiki/when-timeout) helpers for creating delayed promises and promises that timeout and reject if not resolved first.

### 0.11.1

* Added [when/apply](https://github.com/cujojs/when/wiki/when-apply) helper module for using arguments-based and variadic callbacks with `when.all`, `when.some`, `when.map`, or any promise that resolves to an array. ([#14](https://github.com/cujojs/when/issues/14))
* `.then()`, `when()`, and all other methods that accept callback/errback/progress handlers will throw if you pass something that's not a function. ([#15](https://github.com/cujojs/when/issues/15))

### 0.11.0

* `when.js` now *assimilates* thenables that pass the [Promises/A duck-type test](http://wiki.commonjs.org/wiki/Promises/A), but which may not be fully Promises/A compliant, such as [jQuery's Deferred](http://api.jquery.com/category/deferred-object/) and [curl's global API](https://github.com/cujojs/curl) (See the **API at a glance** section)
    * `when()`, and `when.all/some/any/map/reduce/chain()` are all now guaranteed to return a fully Promises/A compliant promise, even when their input is not compliant.
    * Any non-compliant thenable returned by a callback or errback will also be assimilated to protect subsequent promises and callbacks in a promise chain, and preserve Promises/A forwarding guarantees.


### 0.10.4

* **Important Fix for some AMD build/optimizer tools**: Switching back to more verbose, builder-friendly boilerplate
    * If you are using when.js 0.10.3 with the dojo or RequireJS build tools, you should update to v.10.4 as soon as possible.

### 0.10.3

**Warning**: This version will not work with most AMD build tools.  You should update to 0.10.4 as soon as possible.

* Minor `package.json` updates
* Slightly smaller module boilerplate

### 0.10.2

* Performance optimizations for `when.map()` (thanks @[smitranic](https://github.com/smitranic)), especially for large arrays where the `mapFunc` is also async (i.e. returns a promise)
* `when.all/some/any/map/reduce` handle sparse arrays (thanks @[rwaldrn](https://github.com/rwldrn/))
* Other minor performance optimizations

### 0.10.1

* Minor tweaks (thanks @[johan](https://github.com/johan))
	* Add missing semis that WebStorm didn't catch
	* Fix DOH submodule ref, and update README with info for running unit tests

### 0.10.0

* `when.map` and `when.reduce` - just like Array.map and Array.reduce, but they operate on promises and arrays of promises
* Lots of internal size and performance optimizations
* Still only 1k!

### 0.9.4

* Important fix for break in promise chains
