Fun TodoMVC
===========

This is an implementation of the [TodoMVC example application](http://addyosmani.github.com/todomvc/) in [Fun](https://github.com/marcuswestin/fun), a new programming language for web apps.

Note that `index.html` is the compiled output - see `app.fun` for the original source.

Getting started
---------------

To make changes to the todos-fun example you need to install fun:

	npm install fun@0.3.0 -g

To develop the app:

	fun app.fun --normalize.css=false

To compile a static build:

	fun compile app.fun --normalize.css=false > index.html

