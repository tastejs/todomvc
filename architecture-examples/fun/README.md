Fun TodoMVC
===========

This is an implementation of the [TodoMVC example application](http://addyosmani.github.com/todomvc/) in [Fun](https://github.com/marcuswestin/fun), a new programming language for web apps.

Note that `index.html` is the compiled output - see `app.fun` for the original source.

Getting started
---------------

To make changes to the todos-fun example you need to install fun:

	git clone git://github.com/marcuswestin/fun.git
	cd fun && make setup

To compile, run

	./fun/bin/fun --compile app.fun --normalize.css=false > index.html

