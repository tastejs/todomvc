# Serenade.js TodoMVC Example

> Serenade.js is a client side framework built on the MVC pattern. It makes it simple to create rich client side applications by freeing you from having to keep the DOM up to date with your data through powerful data bindings.

> _[Serenade.js - serenadejs.org](http://serenadejs.org)_


## Learning Serenade.js

The [Serenade.js website](http://serenadejs.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Introduction](http://serenadejs.org/introduction.html)
* [Applications built with Serenade.js](http://serenade.herokuapp.com)
* [Serenade.js on GitHub](https://github.com/elabs/serenade.js)

Get help from other Serenade.js users:

* [Serenade.js on Twitter](http://twitter.com/serenadejs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

The Serenade.js app has a couple of dependencies which will be necessary if you wish to re-compile the source files.

Running `npm install` from this directory will give you [Serenade.js](http://serenadejs.org/) and [CoffeeScript](http://coffeescript.org/).

The latest release of Serenade.js is included in the `js/lib/` folder. The only way to upgrade is either by downloading the source from [their website](http://serenadejs.org/), or by compiling it yourself.

If you wish to compile it yourself, instructions are be available at [Serenade's website](http://serenadejs.org/development.html).


## Running
This app is written in [CoffeeScript](http://coffeescript.org/). If you wish to make changes, follow these steps to re-compile the code.

If you would like to install CoffeeScript globally:

	npm install -g coffee-script

If you wish to install CoffeeScript just for the purposes of this app:

	# from labs/architecture-examples/serenadejs:
	npm install

Once CoffeeScript is installed:

	# from labs/architecture-examples/serenadejs:
	npm run-script compile
