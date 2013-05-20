### 1.3.0

* [`meld()`](docs/api.md#adding-aspects) is now a function that adds aspects.
	* **DEPRECATED:** `meld.add()`.  Use `meld()` instead.

### 1.2.2

* Remove stray `console.log`.

### 1.2.1

* Fix for IE8-specific issue with meld's internal use of `Object.defineProperty`.
* Internally shim Object.create if not available to so that meld no longer requires an Object.create shim to advise constructors in pre-ES5 environments.

### 1.2.0

* `meld.joinpoint()` - [Access the current joinpoint](docs/api.md#meldjoinpoint) from any advice type.
* [Bundled aspects](docs/aspects.md):
	* trace: trace method call entry/return/throw
	* memoize: simple memoization for methods and functions
	* cache: configurable caching aspect to do more than simple memoization

### 1.1.0

* Advice can be applied directly to methods on a function.
* Removed undocumented behavior that implicitly adds constructor prototype advice: to advise a prototype, pass the prototype as the advice target.

### 1.0.0

* **Removed browser global** - `window.meld` is no longer supported. See [this post on the cujo.js Google Group](https://groups.google.com/d/topic/cujojs/K0VGuvpYQ34/discussion) for an explanation.
* No functional change beyond browser global removal.

### 0.8.0

* 1.0.0 Release Candidate 1
* Documentation! Check out the new [reference](docs/reference.md) and [api](docs/api.md) docs.
* **Deprecated browser global** - meld.js will drop support for browser global for 1.0.0 and will support modular environments only.

### 0.7.2

* Fix for context when advising constructors: `this` is now the constructed instance in all advice functions.

### 0.7.1

* Fix for global name when using meld as a browser global. Thanks [@scothis](https://github.com/scothis)
* Update unit tests to run in browser using `buster server`, in addition to node. Thanks again, [@scothis](https://github.com/scothis) :)

### 0.7.0

* Advice can be applied directly to functions without a context.
* Advice can be applied to constructors.
* `joinpoint.proceed()` can be called multiple times. This makes it possible to implement "retry" types of advice.

### 0.6.0

* aop.js is now meld.js
* Use [Travis CI](http://travis-ci.org/cujojs/meld)

### 0.5.4

* Optimizations to run time advice invocation, especially around advice
* Fix for passing new args to `joinpoint.proceed()` in around advice
* Added `joinpoint.proceedApply(array)` for proceeding and supplying new arguments as an array
* Ported unit tests to [BusterJS](http://busterjs.org)

### 0.5.3

* First official release as part of [cujojs](http://github.com/cujojs)
* Minor doc and package.json tweaks

### 0.5.2

* Revert to larger, more builder-friendly module boilerplate.  No functional change.

### 0.5.1

* Minor corrections and updates to `package.json`

### 0.5.0

* Rewritten Advisor that allows entire aspects to be unwoven (removed) easily.