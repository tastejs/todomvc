[![Build Status](https://secure.travis-ci.org/cujojs/meld.png)](http://travis-ci.org/cujojs/meld)

[Aspect Oriented Programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming "Aspect-oriented programming - Wikipedia, the free encyclopedia") for Javascript.  It allows you to change the behavior of, or add behavior to methods and functions (including constructors) *non-invasively*.

As a simple example, instead of changing code, you can use meld to log the result of `myObject.doSomething`:

```js
var myObject = {
	doSomething: function(a, b) {
		return a + b;
	}
};

// Call a function after myObject.doSomething returns
var remover = meld.after(myObject, 'doSomething', function(result) {
	console.log('myObject.doSomething returned: ' + result);
});

myObject.doSomething(1, 2); // Logs: "myObject.doSomething returned: 3"

remover.remove();

myObject.doSomething(1, 2); // Nothing logged
```

# Docs

* [API](docs/api.md)
* [Reference](docs/reference.md)
* [Aspects](docs/aspects.md)

# Quick Start

### AMD

1. Get it using one of the following
	1. `yeoman install meld`, or
	1. `bower install meld`, or
	1. `git clone https://github.com/cujojs/meld`, or
	1. `git submodule add https://github.com/cujojs/meld`

1. Configure your loader with a package:

	```js
	packages: [
		{ name: 'meld', location: 'path/to/meld', main: 'meld' },
		// ... other packages ...
	]
	```

1. `define(['meld', ...], function(meld, ...) { ... });` or `require(['meld', ...], function(meld, ...) { ... });`

### Node

1. `npm install meld`
1. `var meld = require('meld');`

### RingoJS

1. `ringo-admin install cujojs/meld`
1. `var meld = require('meld');`

Running the Unit Tests
======================

Install [buster.js](http://busterjs.org/)

`npm install -g buster`

Run unit tests in Node:

`buster test`

# What's New

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

See the [full Changelog here](CHANGES.md)

# References

* [AspectJ](http://www.eclipse.org/aspectj/) and [Spring Framework AOP](http://static.springsource.org/spring/docs/3.0.x/reference/meld.html) for inspiration and great docs
* Implementation ideas from @phiggins42's [uber.js AOP](https://github.com/phiggins42/uber.js/blob/master/lib/meld.js)
* API ideas from [jquery-aop](http://code.google.com/p/jquery-aop/)