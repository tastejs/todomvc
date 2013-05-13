# Batman TodoMVC app

> [Batman.js](http://batmanjs.org/) is a framework for building rich web applications with CoffeeScript.


## Persistence

This app uses `Batman.LocalStorage` to persist the Todo records across page reloads. Batman's `localStorage` engine sticks each record under it's own key in `localStorage`, which is a departure from the TodoMVC application specification, which asks that all the records are stored under one key as a big blob. Batman stores records this way so that the whole set doesn't need to be parsed just to find one record or check if that record exists.


## Build

This app is written in [CoffeeScript](http://coffeescript.org/). If you wish to make changes, follow these steps to re-compile the code.

If you would like to install CoffeeScript globally:

	npm install -g coffee-script

If you wish to install CoffeeScript just for the purposes of this app:

	# from labs/architecture-examples/batman:
	npm install

Once CoffeeScript is installed:

	# from labs/architecture-examples/batman:
	npm run-script compile
