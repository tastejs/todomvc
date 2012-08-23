curl (cujo resource loader)
=====================

Check out the newly updated [wiki](https://github.com/cujojs/curl/wiki)!

See the [wiki](https://github.com/cujojs/curl/wiki) for information about using
curl.js with jQuery, dojo, or underscore.

Please Note: this project has moved from unscriptable/curl to cujojs/curl.
Any existing forks have been automatically moved to cujojs/curl. However,
you will need to update your clone and submodule remotes manually.

Update the url in your .git/config, and also .gitmodules for submodules:
	git://github.com/cujojs/curl.git
	https://cujojs@github.com/cujojs/curl.git

Helpful link for updating submodules:
[Git Submodules: Adding, Using, Removing, Updating](http://chrisjean.com/2009/04/20/git-submodules-adding-using-removing-and-updating/)

What's New?
=======

* 0.6.6
	* Fix for Safari 6's strict treatment of string properties in un-compiled
	  files (paths were broken -- thanks Tiago!)
* 0.6.5
	* better support when unning under RingoJS and node.js (still experimental)
	* fixed bugs with apiContext/apiName or defineContext/defineName
	* added package.json
	* configuration can be overridden by successive calls: `curl({})`
* 0.6.4
	* curl now restores any previous curl() or define() if the dev reassigns
	  either using apiContext/apiName or defineContext/defineName
* 0.6.3
	* fix !exports option of js! plugin when file is compressed
	* now resolves arbitrarily deep double-dot module ids (dojo and node compatibility)
	* more non-standard dojo-isms added to shim/dojo16 (dojo 1.6.x and 1.7.x)
	* correctly locates relative dependencies from main modules
	* scoped `define` (e.g. `mylib.define()`)
	* new tdd/runner and tdd/undefine modules
	* new experimental shim/ssjs (to be released by v0.7)
	* minor improvements to interpretation of unwrapped CJS modules
* 0.6.2
	* curl no longer repeatedly downloads modules that don't return any value
	  (bug introduced in 0.6 refactor) fixes issue #63
* 0.6.1
	* better CommonJS modules compatibility and circular dependency checking
	* fixes an issue in which curl.js could attempt to download the same module
	  file twice if the module is required using relative paths from
	  different locations
* 0.6
	* works with underscore fork at [amdjs](https://github.com/amdjs/underscore)
	* tested and works with dojo 1.7.1 (using curl/shim/dojo16 as a preload)
	* allows normal, non-AMD js files to return values to AMD modules (!exports
	  option)
	* unwrapped CommonJS Modules/1.1 compatibility (experimental)
	* non-AMD module loading via moduleLoader config property
	* updated to latest AMD plugin specifications
	* preloads config array to ensure shims (or other modules) are loaded
	  first
	* package-specific configurations
	* avoids circular dependencies when using cjsm modules
	* folder reorganization. shims were moved into their own folder
	* many bugs fixed, including #21, #22, #28, #34, #36, #39, #40
* 0.5.4
	* jQuery 1.7 support!!!
	* curl.js indicates to jQuery that it is a jQuery-aware AMD loader (#31)
	* AMD/CJSM Hybrid format (see Manual Conversion section of this
	  page: http://requirejs.org/docs/commonjs.html)
	* Now supports node's module.exports = x; export model
	* bug fixes:
		* multiple .next() calls now pass variables correctly
	* curl.js now ignores blank or falsy module ids for better compatibility
	  wth yepnope and has! (#32)
* 0.5.3
	* fix to js! plugin (now works without !order option)
* 0.5.2
	* better CDN support!
		* protocol-relative urls fixed
		* plugin-specific paths (for segmenting by file type)
		* robust 404 detection for non-module js resources
	* better AMD plugin compliance
		* new `dynamic: true` to prevent resource caching
		* `normalize()` API for non-module-like resource names
	* faster domReady detection in non-IE browsers
	* link! plugin for ultra-simple css loading (no waiting, no embedding)
	* new apiContext config param to keep curl API off global object
	* `curl()` allows a single dependency to be specified without an array
	* removed broken !noexec option for js! plugin since it no longer worked
	  in the current browsers
* 0.5.1:
	* fixes to domReady! in the compiled dist/ versions and
	* fixes for commonjs compatibility caused by google-closure in dist/
	  versions
	* support for parent module ids (../sibling-of-parent)
* 0.5:
	* dojo 1.6 support has been moved to separate module (curl/dojo16Compat)
	* curl/domReady now returns a callback function (not a promise)
	* new async! plugin to allow a module to defer definition
	* new css! plugin that inlines css into javascript when used with cram
	* cram (AMD builder) support (css! and async! plugins)
	* `require` is no longer an alias for `curl` unless you set the
	  `apiName` config param to "require"
	* configuration parameters for plugins are now defined in a sub-object
	  of the main config object: { css: { cssOption: true } }

TODO:

* finish i18n plugin!
* document plugin configuration options and how to use each plugin
* notes about using JSONP (it works for objects, arrays, functions, numbers
  and strings! use ?callback=define)

----------------------------------------

What is curl.js?
================

curl.js is a small and very fast AMD-compliant asynchronous loader.
Size: 5KB (2.5KB gzipped) using Google's Closure Compiler.

If you'd like to use curl.js for non-AMD modules (ordinary javascript files),
you'll want to  use a version with the js! plugin built in.  You may also
want to build-in the domReady module.  The combined curl+js+domReady loader
is still only 6.5KB (3KB gzipped).

What the heck is "cujo"?  cujo.js is a web app development platform.
See the bottom of this file for more info.

What is "cram"? cram (cujo resource assembler) is the build tool companion to
curl.js.  You use cram to compile all of your modules into a small number of
javascript files which are loaded much faster into the browsers.

----------------------------------------

Features at a glance:
=====================

* Loads CommonJS AMD-formatted javascript modules in parallel (fast!)
* Loads CommonJS Modules (v1.1 when wrapped in a `define()`) (fast!)
* Loads CommonJS Packages (v1.1 modules wrapped in a `define()`) (fast!)
* Loads non-AMD javascript files in parallel, too (fast! via js! plugin)
* Loads CSS files and text files in parallel (fast! via plugins)
* Waits for dependencies (js, css, text, etc) before executing javascript
* Waits for domReady, if/when desired
* Allows for virtually limitless combinations of files and dependencies
* Tested with Chrome, FF3+, Safari 3.2+, IE6-8, Opera 9.5+

Oh, did we mention?  It's fast!  It's even faster than the leading non-AMD
script loaders.

----------------------------------------

How to get support
===============

1. Go to the issues section of the curl repo (https://github.com/cujojs/curl/issues)
	and search for an answer to your question or problem.
2. If no answer exists, file a new ticket!  Somebody will typically respond within a
	few hours.

It's that easy.

----------------------------------------

API at a glance
===============

For a complete description, check out the [wiki](https://github.com/cujojs/curl/wiki).

```javascript
curl(['dep1', 'dep2', 'dep3' /* etc */], callback);
```

Loads dependencies and the executes callback.

* ['dep1', 'dep2', 'dep3']: Module names or plugin-prefixed resource files
* callback: Function to receive modules or resources. This is where you'd
  typically start up your app.

---------

```javascript
curl(['dep1', 'dep2', 'dep3' /* etc */])
	.then(callback, errorback);
```

Promises-based API for executing callbacks.

* ['dep1', 'dep2', 'dep3']: Module names or plugin-prefixed resource files
* callback: Function to receive modules or resources
* errorback: Function to call if an exception occurred while loading
* For full CommonJS Promises/A compliance, use [when.js](https://github.com/cujojs/when)
    * `when(curl(['dep1'])).then(callback);`

---------

```javascript
curl(config, ['dep1', 'dep2', 'dep3' /* etc */], callback);
```
Specify configuration options, load dependencies, and execute callback.

* config: Object containing curl configuration options (paths, etc.)
* ['dep1', 'dep2', 'dep3']: Module names or plugin-prefixed resource files
* callback: Function to receive modules or resources

---------

```javascript
curl(['domReady!', 'dep2', 'dep3' /* etc */])
	.then(
		callback,
		errorback
	);
curl(['dep1', 'dep2', 'domReady!' /* etc */], function (dep1, dep2) {
	// do something here
});
```

Executes the callback when the dom is ready for manipulation AND
all dependencies have loaded.

* callback: No parameters except the domReady object
* errorback: Function to call if an exception occurred while loading

---------

```javascript
curl(['domReady!', 'js!nonAMD.js!order', 'js!another.js!order']), function () {
	/* do something cool here */
});
```

Executes the function when the non-AMD javascript files are loaded and
the dom is ready. The another.js file will wait for the nonAMD.js file
before executing.

---------

```javascript
curl(['js!nonAMD.js'])
	.next(['dep1', 'dep2', 'dep3'], function (dep1, dep2, dep3) {
		// do something before the dom is ready
	})
	.next(['domReady!'])
	.then(
		function () {
			// do something after the dom is ready
		},
		function (ex) {
			// show an error to the user
		}
	);
```

Executes callbacks in stages using `.next(deps, callback)`.

---------

```javascript
curl = {
	baseUrl: '/path/to/my/js',
	pluginPath: 'for/some/reason/plugins/r/here',
	paths: {
		curl: 'curl/src/curl',
		cssx: 'cssx/src/cssx',
		my: '../../my-lib/'
	},
	apiName: 'someOtherName'
};
```

If called before the `<script>` that loads curl.js, configures curl.js.  All of
the configuration parameters are optional. curl.js tries to do something sensible
in their absence. :)

* baseUrl: the root folder to find all modules, default is the document's folder
* paths: a mapping of module paths to relative paths (from baseUrl)
* pluginPath: the place to find plugins when they are specified without a path
(e.g. "css!myCssFile" vs. "cssx/css!myCssFile") and there is no paths
mapping that applies.
* apiName: an alternate name to `curl` and `require` for curl.js's global
  variable
* apiContext: an object, rather than `window`, to place curl on when using
  `apiName`

---------

```javascript
define(['dep1', 'dep2', 'dep3' /* etc */], definition);
define(['dep1', 'dep2', 'dep3' /* etc */], module);
define(['dep1', 'dep2', 'dep3' /* etc */], promise);
define(module);
define(name, ['dep1', 'dep2', 'dep3' /* etc */], definition);
define(name, ['dep1', 'dep2', 'dep3' /* etc */], module);
define(name, ['dep1', 'dep2', 'dep3' /* etc */], promise);
define(name, module);
```

Defines a module per the CommonJS AMD proposed specification.

* ['dep1', 'dep2', 'dep3']: Module names or plugin-prefixed resource files.
Dependencies may be named 'require', 'exports', or 'module' and will behave
as defined in the CommonJS Modules 1.1 proposal.
* definition: Function called to define the module
* module: Any javascript object, function, constructor, or primitive
* name: String used to name a module (not necessary nor recommended)

----------------------------------------

Very Simple Example
===================

```html
<script>

	// configure curl
	curl = {
		paths: {
			cssx: 'cssx/src/cssx/',
			stuff: 'my/stuff/'
		}
	};

</script>
<script src="../js/curl.js" type="text/javascript"></script>
<script type="text/javascript">

	curl(
		// fetch all of these resources ("dependencies")
		[
			'stuff/three', // an AMD module
			'cssx/css!stuff/base', // a css file
			'i18n!stuff/nls/strings', // a translation file
			'text!stuff/template.html', // an html template
			'domReady!'
		]
	)
	// when they are loaded
	.then(
		// execute this callback, passing all dependencies as params
		function (three, link, strings, template) {
			var body = document.body;
			if (body) {
				body.appendChild(document.createTextNode('three == ' + three.toString() + ' '));
				body.appendChild(document.createElement('br'));
				body.appendChild(document.createTextNode(strings.hello));
				body.appendChild(document.createElement('div')).innerHTML = template;
			}
		},
		// execute this callback if there was a problem
		function (ex) {
			var msg = 'OH SNAP: ' + ex.message;
			alert(msg);
		}
	);

</script>
```

The file structure for this example would look as follows:

	js/
		curl/
			plugin/
				i18n.js
				text.js
			domReady.js
		cssx/
			src/
				cssx/
					css.js
		my/
			stuff/
				nls/
					strings.js
				base.css
				template.html
				three.js
		curl.js

----------------------------------------

What is an asynchronous loader?
===============================

Web apps, especially large ones, require many modules and resources. Most of
these modules and resources need to be loaded at page load, but some may be
loaded later, either in the background or "just in time". They also need to be
loaded as quickly as possible.

The traditional way to load javascript modules is via a `<SCRIPT>` element in
an HTML page. Similarly, CSS files are loaded via a `<LINK>` element, and
text resources are either loaded in the page or via XHR calls.

The problem with `<SCRIPT>` and `<LINK>` elements is that a browser must execute
them sequentially since it has no idea if one may depend on another. It just
assumes the developer has placed them in the correct order and that there are
dependencies. (The term "synchronous loading" is used to describe this process
since the elements are executed in a single timeline.)

If there are no dependencies between two files, loading them sequentially is
a waste of time. These files could be loaded and executed in parallel (i.e
at the same time).

An asynchronous loader does just that: it loads javascript files (and
other types of files) in parallel whenever possible.

curl.js has lots of company. Other async loaders include LABjs, Steal.js,
yepnope.js, $script.js, the Backdraft loader (bdLoad), and RequireJS.

[(a more complete list)](https://spreadsheets.google.com/ccc?key=0Aqln2akPWiMIdERkY3J2OXdOUVJDTkNSQ2ZsV3hoWVE&hl=en#gid=2)

----------------------------------------

What is AMD?
============

Asynchronous Module Definition is the CommonJS proposed standard for
javascript modules that can be loaded by asynchronous loaders. It defines
a simple API that developers can use to write their javascript modules so
that they may be loaded by any AMD-compliant loader.

[CommonJS AMD Proposal](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition)

The AMD proposal follows the [CommonJS Modules](http://wiki.commonjs.org/wiki/Modules/1.1)
proposal as much as possible.  Because of the way browsers load and
evaluate scripts, AMD can't follow it completely without causing significant
processing overhead.  Instead, AMD allows us to place a lightweight wrapper
around javascript modules to help work around the shortcomings.

Ultimately, both proposals (AMD and Modules 1.1) are in preparation for an
official [javascript modules](http://wiki.ecmascript.org/doku.php?id=harmony:modules)
specification and eventual implementation in browsers.

If you don't want to wait for official javascript modules, then don't.  The future
is now.  AMD works now -- and it's awesome.

AMD's API focuses on one globally-available function: `define()` and some
CommonJS-inspired variables, `require()`, `exports`, and `module`.
`require()` specifies a list of dependent modules or resources that must be
loaded before running a set of code. This code resides in a callback function
that is executed asynchronously, i.e. it runs later, not in the current
"thread".  Specifically, it executes when all of the dependencies are loaded
and ready.

The proposal does not mandate that `require()` be specified globally.  In fact,
at a global level, the concerns of a loader are about application bootstrapping
and not about finding dependencies. To keep the confusion about these two
concepts to a minimum, curl.js uses `curl()` for the public API.  You may rename
this API back to `require()` by supplying the `apiName` config param
(`apiName: "require"`), but this is not receommended.

It's more important that the `define()` method be consistent.  This is the
method that tells the loader what modules have been loaded by a script.
`define()`  also specifies a list of dependencies and a callback function that
defines and/or creates the resource when the dependencies are ready.
Optionally, `define()` also takes a name parameter, but this is mainly for build
tools and optimizers.

Inside the `define()`, the `require()` method acts like other AMD loaders.

AMD's API also helps code reuse by providing compatibility with CommonJS
(server) modules. AMD-compliant loaders support the same `require()` syntax and
argument signatures as server-side javascript (ssjs) modules.

Not all async loaders are AMD-compliant. Of the list above, only the following
are AMD-compliant:

curl.js <http://github.com/cujojs/curl>

RequireJS <http://requirejs.org/>

backdraft loader <http://bdframework.org/bdLoad>

The beauty of AMD loaders is their ability to remove the drudgery of manually
managing dependencies.  Since all dependencies are listed within the
modules, the loader will ensure that everything is loaded into the browser --
and in the right order.

----------------------------------------

What makes curl different from other AMD loaders?
=================================================

curl.js is much smaller than other AMD loaders. Less than 1/2 the size of the
others in the list above. It's able to achieve this via a Promises-based
design. (Promises are another [CommonJS proposed standard](http://wiki.commonjs.org/wiki/Promises).)

curl.js communicates with it's plugins via Promises, rather than a simple
callback function. This allows proactive error handling, rather than detecting
problems via a timeout, which can be tricky to set correctly. curl does this in
a backwards-compatible way so AMD-compliant plugins will still work in curl.

curl.js will also return a promise from `curl()` calls. This allows you to
write code like this:

```javascript
curl(
	[
		'myApp/moduleA',
		'myApp/moduleB'
	],
).then(
	function success (A, B) {
		// load myApp here!
	},
	function failure (ex) {
		alert('myApp didn't load. reason: ' + ex.message);
	}
);
```

(When using `require` as a dependency, it does not return a promise.
This is so that 100% CommonJS compliance is assured inside modules.)

----------------------------------------

Can curl.js work with non-AMD javascript files?
===============================================

Yes, but why would you?  Once you start using AMD, you'll never go back! :)

You may use non-AMD javascript files by specifying the js! plugin prefix
like this:

```javascript
curl(
	[
		'js!plainOldJsFile1.js!order',
		'js!anotherPlainOldJsFile.js!order'
	]
).then(
	function () {
		/* do something with your plain, boring javascript files */
	},
	function () {
		/* do something if any fail to load */
	}
);
```

The !order suffix instructs curl.js to wait for previous scripts to execute
before executing the current script. All scripts download in parallel, though,
unless you specify `prefetch: false` in the config.  Be sure to have proper
cache headers set if you plan to use `prefetch: true` or scripts will get
downloaded twice in browsers that don't support `async="false"`.

----------------------------------------

Can curl.js load non-javascript files?
=======================

Yes, curl.js follows the CommonJS Loader Plugin specification, so you can use
any compatible plugin. The following plugins are included:

js! -- loads non-AMD javascript files. more info on the [wiki](https://github.com/cujojs/curl/wiki/js)

text! -- loads text files

link! -- loads css files via a link element (simple, fast)

css! -- loads css files (lots of options)

domReady! -- resolves when the dom is ready for manipulation

async! -- resolves when a module signals it's ready

The following plugins are in progress:

i18n! -- loads text strings and other locale-specific constants

Complete plugin docs are on the [wiki](https://github.com/cujojs/curl/wiki/Plugins).

----------------------------------------

How are modules loaded?
=======================

curl.js uses `<script>` element injection rather than XHR/eval.  This allows
curl.js to load cross-domain scripts as well as local scripts.

To find scripts and other resources, curl.js uses module names.  A module name
looks just like a file path, but typically without the file extension.  If a
module requires a plugin in order to load correctly, it will have a prefix
delimited by a "!" and will also often have a file extension when a plugin
may load different types of files.

Some examples of module names:

* dojo/store/JsonRest
* my/lib/string/format
* js!my/lib/js/plain-old-js.js
* css!my/styles/reset.css
* http://some-cdn/uber/module

By default, curl.js will look in the same folder as the current document's location.
For instance, if your web page is located at `http://my-domain/apps/myApp.html`,
curl.js will look for the JsonRest module at `http://my-domain/apps/dojo/store/JsonRest.js`.

You can tell curl.js to find modules in other locations by specifying a baseUrl or
individual paths for each of your libraries.  For example, if you specify a baseUrl of
`/resources/` and the following paths:

```javascript
paths: {
	dojo: "third-party/dojo",
	css: "third-party/cssmojo/css",
	my: "my-cool-app-v1.3",
	"my/lib/js": "old-js-libs"
}
```

Then the modules listed above will be sought in the following locations:

* /resources/third-party/dojo/store/JsonRest.js
* /resources/my-cool-app-v1.3/lib/string/format.js
* /resources/old-js-libs/plain-old-js.js
* /resources/my-cool-app-v1.3/styles/reset.css
* http://some-cdn/uber/module.js

Note: you will need to create a path to curl.js's plugins and other modules if
the curl folder isn't directly under the same folder as your web page. curl.js
uses the same mechanism to find its own modules.

----------------------------------------

What are AMD plugins?
=====================

AMD supports the notion of plugins. Plugins are AMD modules that can be used to
load javascript modules -- or other types of resources. curl comes with several
plugins already, including a text plugin (for templates or other text
resources), two different css plugins, a dojo 1.6 compatibility plugin,
a dom-ready plugin and a debug plugin (for collecting and logging details of the
inner workings of curl).

Plugins are designated by a prefix on the name of the module or resource to be
loaded. They are delineated by a ! symbol. The following example shows the use
of some plugins:

```javascript
define(
	[
		'text!myTemplate.html',
		'css!myCssFile'
	],
	function (templateString, cssLinkNode) {
		// do something with the template and css here
	}
);
```

Since plugins are just AMD modules, they would typically be referenced using
their fully-pathed names. curl provides a pluginPath configuration option that
allows you to specify the folder where [most of] your plugins reside so you
don't have to specify their full paths.  This also helps with compatibility
with other AMD loaders that assume that certain plugins are bundled and
internally mapped.

If one or more of your plugins does not reside in the folder specified by the
pluginPath config option, you can use its full path or you can specify a path
for it in curl's paths config object.

```javascript
// example of a fully-pathed plugin under the cssx folder
define(['/css!myCssFile'], function (cssxDef) {
	// do some awesome css stuff here
});
```

Plugins can also have configuration options. Global options can be specified
on curl's configuration object. Options can also be supplied to plugins via
suffixes. Suffixes are also delineated by the ! symbol. Here's an example of
a plugin using options:

```javascript
// don't try to repair IE6-8 opacity issues in my css file
define(['css!myCssFile!ignore:opacity'], function (cssxDef) {
	// do some awesome css stuff here
});
```

----------------------------------------

How do I use curl.js?
=====================

1. Learn about AMD-formatted javascript modules if you don't already know how.
2. Clone or download curl to your local machine or server.
3. Figure out the baseUrl and paths configuration that makes sense for your
   project.
4. Check out the "API at a glance" section above to figure out which loading
   methodology you want to use.
5. Study the "Very Simple Example" and some of the test files.
6. Try it on your own files.

----------------------------------------

Too Many Modules!
=================

I have dozens (or hundreds) of modules. Even with parallel loading, the
performance sucks! What can I do about that?

True! No parallel loader can lessen the latency required to create an HTTP
connection. If you have dozens or hundreds of files to download, it's going to
take time to initiate each of the connections.

However, there are tools to that are designed to fix this problem! There are
builders and compilers. dojo users are probably already familiar with dojo's
build tool and optimizer. RequireJS comes with a build tool and Google's
Closure compiler.

The build tool is used to concatenate several modules (and/or resources)
into just a few files. It does this by following the dependency chain
specified in the define() and require() calls. You can specify which top-level
modules or resources are in each file and the build tool finds the rest.

After the build tool creates the concatenated files, the files can be passed
into a compiler (also called a shrinker or compressor).

We're writing curl to be compatible with RequireJS's build tool, but there's
also another cujo project in the pipeline: [cram](https://github.com/cujojs/cram).
Cram is the Cujo Resource Assembler.

----------------------------------------

CommonJS Package Support
========================

cujo.js supports the CommonJS Packages 1.1 specification.  Packages are
defined in the packages configuration parameter:

```javascript
cujo = {
	baseUrl: 'path/to/js',
	packages: {
		'my-package': {
			path: 'path/to/my-package',
			main: 'main/main-module-file',
			lib: 'location/of/other/modules'
		}
	}
};
```

The path property describes where to find the package in relation to the
baseUrl parameter.  The main and lib properties describe where to find modules
inside the package.  The main property gives the relative path to the package's
main module.  The lib property reflects the path to all other modules in the
package.

In the example above, the main module of the package can be obtained as follows

```javascript
curl(['my-package'], callback);
```

and will be fetched from the following path:

	path/to/js/path/to/my-package/main/main-module-file.js

Some other file in the package would be obtained as follows:

```javascript
curl(['my-package/other-module'], callback);
```

and will be fetched from the following path:

	path/to/js/path/to/my-package/location/of/other/modules/other-module.js

----------------------------------------

What is cujo?
=====================

cujo.js is a web app development platform.  It employs MVC, IOC, AMD
and lots of other TLAs. :)  curl.js is one of the many micro-libs we're pulling
out of cujo.js.  Our goal is to make the advanced concepts in cujo.js more
palatable by breaking them down into easier-to-grok chunks.  Other cujo.js
libs include:

* [canhaz](https://github.com/cujojs/canhaz): a project and code bootstrapping tool that will save you tons of typing.
* [wire](https://github.com/cujojs/wire): A light, fast, flexible Javascript IOC container
* [when.js](https://github.com/cujojs/when): A small, fast Promises/A compliant promises implementation
* [cram](https://github.com/cujojs/cram): a javascript compressor, concatenator, and optimizer meant to be used with curl.js

Kudos
=================

Many thanks to Bryan Forbes ([@bryanforbes](http://www.twitter.com/bryanforbes)) for helping to clean up my code and
for making cujo's domReady much more robust.
More about Bryan: <http://www.reigndropsfall.net/>

Kudos also to James Burke ([@jrburke](http://www.twitter.com/jrburke)) who instigated the CommonJS AMD proposal
and paved the way to create AMD-style loaders.
More about James: <http://tagneto.blogspot.com/>

Shout out to Kris Zyp ([@kriszyp](http://www.twitter.com/kriszyp)) for excellent ideas and feedback and to Kyle
Simpson ([@getify](http://www.twitter.com/getify)) who is inarguably the godfather of javascript loading.
