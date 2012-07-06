# Cujojs TodoMVC

[Cujojs](http://cujojs.com) is an *architectural framework* for building highly modular, scalable, maintainable applications in Javascript.  It provides architectural plumbing, such as module (AMD and CommonJS), declarative application composition, and declarative connections and aspect oriented programming.

It is not a typical MV* framework, although it does provide MV* building blocks, such as templating and data binding.

## Highlights:

Some thing we feel are interesting about cujojs's TodoMVC as compared to other implementations:

* Application composition separate from application logic
* Highly modularized: JS, HTML, *and CSS* are all modularized
* Clean HTML templates, editable by mere mortals.
* OOCSS for visual state changes, zero direct style manipulation
* Fully internationalized
* Application code has no explicit dependencies on:
	* DOMReady - application lifecycle, even DOMReady is managed transparently.  Things that can happen before DOMReady, do.  Things that can't, don't.
	* DOM Query engine
	* DOM Event library

## Credit

TodoMVC Template Created by [Sindre Sorhus](http://sindresorhus.com)