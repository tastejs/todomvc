Please Note: this project has moved from briancavalier/wire to cujojs/wire.
Any existing forks have been automatically moved to cujojs/wire. However,
you'll need to update your clone and submodule remotes manually.

Update the url in your .git/config, and also .gitmodules for submodules:

```
git://github.com/cujojs/wire.git
https://cujojs@github.com/cujojs/wire.git
```

Helpful link for updating submodules:
[Git Submodules: Adding, Using, Removing, Updating](http://chrisjean.com/2009/04/20/git-submodules-adding-using-removing-and-updating/)

----

# wire.js

Wire.js is an [Inversion of Control Container](http://martinfowler.com/articles/injection.html "Inversion of Control Containers and the Dependency Injection pattern") for Javascript apps.

With wire.js, you can focus on coding the business logic of your components and let wire.js handle the bootstrapping and the glue that connects them together.  You write a simple [wiring spec](https://github.com/cujojs/wire/wiki/Wire-specs) in JSON (or Javascript) that describes how your components should be wired together, and wire will load, configure, and connect those components to create your application, and will clean them up later.

### Specifically, wire.js provides:

* Component lifecycle management
* Dependency Inversion via constructor and setter Dependency Injection
* Automatic dependency ordering
* Connectors
* Service locator pattern and reference resolution

### Plugins

Wire.js also has a plugin architecture that allows plugins to provide new capabilities to wire.js *and syntax* to wiring specs.  Here are some of the capabilities provided by the bundled plugins:

* Dependency Injection for DOM nodes.  For example, you can reference DOM nodes by id *or dom query*, and inject them into your views.
* Event and PubSub connectors. Write your components without any glue code, and connect them together in the wiring spec using events or pubsub.  The event connector works for DOM nodes, too!
* Aspect Oriented Programming (AOP).  Wire.js comes with an AOP plugin that allows you to declaratively apply decorators, before/after/around advice, and to introduce mixins on the fly.

### Framework integration

Plugins also allow you to use capabilities of your existing modules/libraries/frameworks.  For example, wire.js has a set of plugins for Dojo that allow it to integrate with Dijit's widget system, to use dojo.connect as the event connector, and dojo.publish/subscribe as the pubsub connector.  If you are already using those aspects of Dojo, you can use wire.js's Dojo plugins to integrate easily with all your existing components.

# Ok, What Now?

1. [Read about](https://github.com/briancavalier/hello-wire.js) and [try out](http://briancavalier.com/code/hello-wire) the Hello Wire introduction.
1. Check out the [wire.js presentation from JSConf 2011](http://bit.ly/mkWy1L "wire.js - Javascript IOC Container w/Dependency Injection").
1. Get the code for the [Piratescript or N00bscript](https://github.com/briancavalier/piratescript) game from the presentation. *Docs coming soon!*
1. See the [wiki for more documentation](https://github.com/cujojs/wire/wiki).
1. Fork it and try it out!

# What's new

### 0.8.1

* Compatible with [when.js](https://github.com/cujojs/when) v1.0.x - v1.3.0

### 0.8.0

* See the [full release notes](https://github.com/cujojs/wire/wiki/release-notes-080) for more detail, documentation, and examples of all the new features.
* Node and RingoJS
* New wire/dom/render plugin
* Plenty of other new DOM features
* Easier `wire/aop` single advices
* Improved debugging with `wire/debug`

### 0.7.6

* New `waitParent` option for the [wire factory](https://github.com/cujojs/wire/wiki/Factories).  When set to `true`, it guarantees a child context will not even start wiring until the encompassing parent has completed.
* Update to [when.js](https://github.com/cujojs/when) v1.0.2

### 0.7.5

* Minor fix for using wire in a non-AMD browser environment
* Update to [when.js](https://github.com/cujojs/when) v0.10.4
* Update to [aop.js](https://github.com/cujojs/aop) v0.5.2

### 0.7.4

* `wire/debug` plugin now supports runtime app tracing.  Check out the [new options](https://github.com/cujojs/wire/wiki/wire-debug).
* Fix for all known instances where wire would not notice errors that happen during wiring.
* Baby steps toward Node compatibility for the wire.js core.  *We're currently targetting v0.8.0 as the first Node-compatible version*.
* Update to [when.js](https://github.com/cujojs/when) v0.10.3
* Update to [aop.js](https://github.com/cujojs/aop) v0.5.0

### 0.7.3

* Updated `wire/domReady` helper to work with latest [RequireJS](https://github.com/jrburke/requirejs) `domReady!` plugin, while maintaining backward compatibility with older versions of RequireJS that use `require.ready`
* Updates for compatibility with [curl](https://github.com/unscriptable/curl) v0.5.4 and curl `domReady!` plugin
* `wire/debug` plugin - Simplified solution for broken/missing console in IE < 8

### 0.7.2

* Updated build/optimizer support for [cram](https://github.com/unscriptable/cram) v0.2+

### 0.7.1

* Improved logging in `wire/debug`, now with stack traces, and guards against missing `console` in IE.
* Guard against null when scanning plugins
* Update to [when.js](https://github.com/cujojs/when) v0.9.4

### 0.7.0

* New [wire factory](https://github.com/cujojs/wire/wiki/Factories) (aka wire inception!) that allows wiring chains of other specs, or injecting functions for deferred wiring.  [See the docs](https://github.com/cujojs/wire/wiki/Factories)
* [wire/dojo/dijit](https://github.com/cujojs/wire/wiki/wire-dojo-dijit) plugin:
    * `placeAt` feature that allows easier placement of Dijit widgets.
    * supports easy dijit theming via its `theme` option
* New [wire/dojo/data](https://github.com/cujojs/wire/wiki/wire-dojo-data) plugin that supports legacy `dojo/data` datastores
* [wire/dom](https://github.com/cujojs/wire/wiki/wire-dom) plugin now supports options for adding/removing classes to `<html>` during wiring.
* Now using [when.js](https://github.com/cujojs/when) v0.9.3 for promises and async handling.  See also the Deprecated Functionality below.
* The wire.js core is now **only 2.5k** with Google Closure + gzip!
* **Limited support** for using wire in a non-AMD setup.  This is intended to aid in transitioning to AMD and CommonJS modules, and *it's unlikely that wire's full functionality will ever be extended to cover non-AMD/CommonJS environments.*
	* wire.js can now create components using raw constructors in addition to AMD module ids.  This allows wire.js to create components instances from libraries that haven't yet fully committed to AMD or CommonJS.
* **Deprecated functionality** - to be removed in v0.8.0
    * Injecting a reference to the [full current context](https://github.com/cujojs/wire/wiki/Contexts) via `{ $ref: 'wire!context' }`
    	* The components in the current context will always be in an incomplete state, and relying on this is potentially dangerous.
    	* I may consider allowing injecting a *promise* for the current context, which would resolve after the current context has finished wiring.
    	* If you were using the `wire()` method of a context injected via `{ $ref: 'wire!context' }`, you can use `{ $ref: 'wire!' }` instead, which provides a direct reference to the `wire()` method itself--i.e. it injects a *function* that works just like `context.wire()`.
	* Many plugin methods received a `wire` parameter that had several promise helper methods, such as `wire.when`, `wire.whenAll`, etc.  These are deprecated in favor of simply using [when.js](https://github.com/cujojs/when) instead, which is provided as a submodule in the support dir.

### 0.6.0

* [wire/aop](https://github.com/cujojs/wire/wiki/wire-aop) plugin: AOP weaving with pointcuts, and before, after, afterReturning, afterThrowing, after (aka "afterFinally") advice using [aop.js](https://github.com/cujojs/aop)
* Experimental optimizer/build tool support for [cram](https://github.com/unscriptable/cram). Point cram at your wire spec and let it optimize your entire app! *Docs coming soon*
* [wire/debug](https://github.com/cujojs/wire/wiki/wire-debug) plugin: tracks components and tells you which ones couldn't be wired and why
* Improved memory management, especially when destroying contexts.
* **Breaking Changes**
    * The plugin format has changed to support new, more powerful async plugins.  See the [Plugin format wiki](https://github.com/cujojs/wire/wiki/Plugin-format) for more information
    * [wire/aop](https://github.com/cujojs/wire/wiki/wire-aop) decorator and introduction options have changed.  See the [wire/aop wiki](https://github.com/cujojs/wire/wiki/wire-aop) for more information

### 0.5.2

* Fix for [wire/sizzle](https://github.com/cujojs/wire/wiki/wire-aop) plugin
* Updated to work with [curl v0.5](https://github.com/unscriptable/curl) domReady.
* **NOTE** wire.js v0.5.2 now requires curl.js 0.5 or later.  It will also work with any recent version of RequireJS, and with dojo 1.6 or later.

### 0.5.1

* `create` factory now supports the `isConstructor` option, when `true`, forces an object instance to be created using `new`.
* Improved debug output when using [wire/debug](https://github.com/cujojs/wire/wiki/wire-debug) plugin,
* Slimmed down [wire/aop](https://github.com/cujojs/wire/wiki/wire-aop) plugin in preparation for a new version in an upcoming release,
* Automated unit tests using [Dojo DOH](http://dojotoolkit.org/reference-guide/util/doh.html),
* Semantic versioning

### 0.5

* Re-engineered core: smaller, faster, and more loader-independent,
* Can be used as either an AMD module or an AMD plugin,
* Tested with [curl.js](https://github.com/unscriptable/curl), and [RequireJS](http://requirejs.org/).  Should also work with the upcoming [dojo 1.7 loader](http://dojotoolkit.org/) (but hasn't been tested yet),
* Improved plugin system,
* AOP plugin, [wire/aop](https://github.com/cujojs/wire/wiki/wire-aop): Decorators and Introductions.  *Coming Soon*: before, after, afterReturning, afterThrowing, and around advice,
* Prototype factory plugin allows using the JS prototype chain to create new objects directly from other objects in your wire spec.
* Sizzle plugin, `wire/sizzle`, courtesy of [@unscriptable](https://twitter.com/unscriptable)
* Not entirely new to 0.5, but worth mentioning Dojo integration, including:
	* pubsub connector, subscribe *and publish* non-invasively using `dojo.publish/subscribe`
	* event connector that uses dojo.connect
	* easy JsonRest datastores via `resource!` reference resolver
	* `dom.query!` reference resolver that uses `dojo.query`

# Roadmap

### v0.8.0

* Plugin namespacing
* CommonJS compatibility
* Node.js compatibility

## Future

* Library/Framework agnostic event and pubsub connectors
* AOP weaving support for decorators and introductions
* Support for more AMD loaders
* Integration with more libs and frameworks.

# License

wire.js is licensed under [The MIT License](http://www.opensource.org/licenses/mit-license.php).
