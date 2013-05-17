# Batman.js TodoMVC Example

> A client-side framework for Rails developers. Batman.js is a framework for building rich web applications with CoffeeScript.

> _[Batman.js - batmanjs.org](http://batmanjs.org)_


## Learning Batman.js

The [Batman.js website](http://batmanjs.org) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://batmanjs.org/docs/batman.html)
* [Get Started](http://batmanjs.org/download.html)
* [Applications built with Batman.js](http://batmanjs.org/examples.html)
* [Blog](http://batmanjs.org/2012/04/02/batman-packs-a-punch.html)
* [Batman.js on GitHub](https://github.com/shopify/batman)

Articles and guides from the community:

* [Simple address book app with Batman.js](http://kubyshkin.ru/posts/simple-address-book-app-with-batman-js.html)
* [Batman.js vs Knockout.js](http://blog.erlware.org/2011/08/28/batman-js-vs-knockout-js)

Get help from other Batman.js users:

* [Batman.js on StackOverflow](http://stackoverflow.com/questions/tagged/batman.js)
* [Mailing list on Google Groups](https://groups.google.com/forum/?fromgroups#!forum/batmanjs)
* [Batman.js on Twitter](http://twitter.com/batmanjs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

This app uses `Batman.LocalStorage` to persist the Todo records across page reloads. Batman's `localStorage` engine sticks each record under it's own key in `localStorage`, which is a departure from the TodoMVC application specification, which asks that all the records are stored under one key as a big blob. Batman stores records this way so that the whole set doesn't need to be parsed just to find one record or check if that record exists.


## Running

This app is written in [CoffeeScript](http://coffeescript.org/). If you wish to make changes, follow these steps to re-compile the code.

If you would like to install CoffeeScript globally:

	npm install -g coffee-script

If you wish to install CoffeeScript just for the purposes of this app:

	# from labs/architecture-examples/batman:
	npm install

Once CoffeeScript is installed:

	# from labs/architecture-examples/batman:
	npm run-script compile


## Credit

This TodoMVC application was created by [you]().
