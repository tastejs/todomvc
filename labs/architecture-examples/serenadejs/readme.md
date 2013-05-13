# Serenade.js TodoMVC app

The Serenade.js app has a couple of dependencies which will be necessary if you wish to re-compile the source files.

Running `npm install` from this directory will give you [Serenade.js](http://serenadejs.org/) and [CoffeeScript](http://coffeescript.org/).

### Serenade.js
The latest release of Serenade.js is included in the `js/lib/` folder. The only way to upgrade is either by downloading the source from [their website](http://serenadejs.org/), or by compiling it yourself.

If you wish to compile it yourself, instructions are be available at [Serenade's website](http://serenadejs.org/development.html).

### Build
This app is written in [CoffeeScript](http://coffeescript.org/). If you wish to make changes, follow these steps to re-compile the code.

If you would like to install CoffeeScript globally:

	npm install -g coffee-script

If you wish to install CoffeeScript just for the purposes of this app:

	# from labs/architecture-examples/serenadejs:
	npm install

Once CoffeeScript is installed:

	# from labs/architecture-examples/serenadejs:
	npm run-script compile
