# CoffeeScript TodoMVC Example

>  CoffeeScript is a little language that compiles into JavaScript. Underneath that awkward Java-esque patina, JavaScript has always had a gorgeous heart. CoffeeScript is an attempt to expose the good parts of JavaScript in a simple way.

> _(CoffeeScript - coffeescript.org)[coffeescript]_

This version of TodoMVC is a "vanilla" CoffeeScript implementation. Only the CoffeeScript NPM module is required to compile the `.coffee` files. No web frameworks are used.

# Running the app

Simply open the `src/index.html` file in your favorite modern browser. We
have taken the liberty of pre-compiling the CoffeeScript files into JavaScript for you.

# Editing and rebuilding

If you want to make changes to the app, follow these instructions.

## Installing CoffeeScript

First, install [Node.js][nodejs]. With Node.js installed, open a terminal and run

```
sudo npm install -g coffee-script
```

This will install the latest version of CoffeeScript for you.

## Compiling CoffeeScript to JavaScript

You need to compile the app into JavaScript to run in your browser. To do so, in a terminal run:

```
coffee --compile --output src/js src/coffee/
```

This will take the `.coffee` files from `src/coffee` and compile them one to one into JavaScript files in `src/js`.

# Learning CoffeeScript

The [CoffeeScript website][coffeescript] is a great resource for learning CoffeeScript

Here are some links you may find helpful:

* [CoffeeScript Wiki](http://github.com/jashkenas/coffee-script/wiki)
* [Books, Screencasts and Examples on coffeescript.org](http://coffeescript.org/#resources)
* [FAQ](http://github.com/jashkenas/coffee-script/wiki/FAQ)

Get help from other Dart users:

* [CoffeeScript on StackOverflow](http://stackoverflow.com/questions/tagged/coffeescript)
* [CoffeeScript Google Group](https://groups.google.com/forum/#!forum/coffeescript)

_If you have other helpful links to share, or find any of the links above no
longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._

[coffeescript]: http://coffeescript.org
[nodejs]: http://nodejs.org/