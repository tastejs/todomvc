# cujoJS TodoMVC Example

> cujo is an architectural toolkit for next generation JavaScript applications. It encourages highly modular development, declarative application assembly, and embraces the asynchronous nature of JavaScript and its fusion of object-oriented and functional programming styles.

> _[cujoJS - cujojs.com](http://cujojs.com)_


## Learning cujoJS

The [cujoJS website](http://cujojs.com) is a great resource for getting started.

Here are some links you may find helpful:

* [know cujoJS](http://know.cujojs.com/)
* [cujoJS on GitHub](https://github.com/cujojs)

Articles and guides from the community:

* [An introductory presentation](http://www.youtube.com/watch?v=TqX-CqYYwEc)

Get help from other cujoJS users:

* [Google Groups mailing list](https://groups.google.com/forum/#!forum/cujojs)
* [cujoJS on Twitter](http://twitter.com/cujojs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

Some things we feel are interesting about cujoJS's TodoMVC as compared to other implementations:

* Application composition is separate from application logic
* Code is *highly* modular and organized into components, each consisting of
  one or more of the following:
	* Composition specification (a.k.a. "wire spec")
	* JavaScript controller module
	* helper modules
	* localization bundle (strings.js)
	* HTML template (template.html)
	* CSS file, typically unthemed (structure.css)
* HTML templates are clean and simple, editable by mere mortals.
* OOCSS principles
	* Separates structural CSS from theme (skin)
	* visual state changes done via CSS
		* zero direct style manipulation
		* drastically simplifies HTML templates
* JavaScript environment is shimmed, rather than abstracted
	* code to modern standards, not to abstraction layers
* All strings are easily internationalized
* Application code has no explicit dependencies on:
	* DOMReady - the application lifecycle, even DOMReady, is managed
	  transparently.  Things that can happen before DOMReady, do.
	  Things that can't, don't.
	* DOM Query engine
	* DOM Event library
