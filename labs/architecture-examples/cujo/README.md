# Cujojs TodoMVC

[Cujojs](http://cujojs.com) is an *architectural framework* for building highly modular, scalable, maintainable applications in Javascript.  It provides architectural plumbing, such as modules (AMD and CommonJS), declarative application composition, declarative connections, and aspect oriented programming.

It is not a typical MV\* framework, although it does provide MV\* building blocks, such as templating and data binding.

## Highlights:

Some things we feel are interesting about cujojs's TodoMVC as compared to other implementations:

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
