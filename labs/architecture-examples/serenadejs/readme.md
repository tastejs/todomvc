# Serenade.js TodoMVC app

The Serenade.js app has a couple of dependencies which will be necessary if you wish to re-compile the source files.

Running `npm install` from this directory will give you [Serenade.js](http://serenadejs.org/) and [CoffeeScript](http://coffeescript.org/).

### Serenade.js
The latest release of Serenade.js is included in the `js/lib/` folder. The only way to upgrade is either by downloading the source from [their website](http://serenadejs.org/), or by compiling it yourself.

If you wish to compile it yourself, instructions are be available at [Serenade's website](http://serenadejs.org/development.html).

### CoffeeScript
The source code for the TodoMVC app was written in CoffeeScript. If you would like to re-compile the code, follow these instructions.

If you already have CoffeeScript globally installed, just run:

	coffee -co js/ js/

If you don't have CoffeeScript globally installed, you may either install it globally...

	npm install -g coffee-script
	coffee -co js/ js/

...or if you wish to install it just for the purposes of this app...

	cd to todomvc/labs/architecture-examples/serenadejs
	npm install
	npm run-script compile
