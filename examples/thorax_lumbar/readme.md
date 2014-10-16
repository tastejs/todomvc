# Thorax & Lumbar TodoMVC Example

> An opinionated, battle-tested Backbone + Handlebars framework to build large scale web applications.

> _[Thorax - thoraxjs.org](http://thoraxjs.org)_


## Learning Thorax

The [Thorax website](http://thoraxjs.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Getting Started](http://thoraxjs.org/start.html)
* [API Reference](http://thoraxjs.org/api.html)
* [Screencast - Introduction to Thorax](http://vimeo.com/60230630)
* [Seed Project](https://github.com/walmartlabs/thorax-seed)
* [Thorax on GitHub](https://github.com/walmartlabs/thorax)

Get help from other Thorax users:

* [Thorax on Twitter](http://twitter.com/walmartlabs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

To re-compile the files, run:

	# from labs/dependency-examples/thorax_lumbar
	npm install
	npm start

Lumbar will create a `public/base.js` file that contains the core libraries needed to run the application, as well as a master router that listens to all routes defined in `lumbar.json`. When one of those routes is visited, the appropriate module file is loaded-- in this case, `public/todomvc.js`.
