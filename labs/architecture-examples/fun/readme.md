Fun TodoMVC
===========

This is an implementation of the [TodoMVC example application](http://addyosmani.github.com/todomvc/) in [Fun](https://github.com/marcuswestin/fun), a new programming language for web apps.

Note that `index.html` is the compiled output - see `app.fun` for the original source.

Getting started
---------------

To make changes to the todos-fun example you need to install fun:

	sudo npm install fun@0.2.22 -g
	fun app.fun --normalize.css=false

To compile, run

	fun --compile app.fun --normalize.css=false > index.html

