# PlastronJS TodoMVC Example

> PlastronJS is an MVC library which uses the Google Closure library for use with the Closure Compiler.

> _[PlastronJS - rhysbrettbowen.github.io/PlastronJS](http://rhysbrettbowen.github.io/PlastronJS)_


## Learning PlastronJS

The [PlastronJS website](http://rhysbrettbowen.github.io/PlastronJS) is a great resource for getting started.

Here are some links you may find helpful:

* [PlastronJS on GitHub](https://github.com/rhysbrettbowen/PlastronJS)

Articles and guides from the community:

* [The Future of PlastronJS](http://modernjavascript.blogspot.com/2012/11/the-future-of-plastronjs.html)
* [Krisztian Toth's JavaScript Games, XRegExp, PlastronJS](http://dailyjs.com/2012/04/06/toth-xregexp-plastron)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

The app is built with [Plovr](http://plovr.com). To run the unminified version you need to:

1. [Download Plovr](http://plovr.com/download.html)
2. Create a directory called `build`
3. Put the jar file in the build folder
4. Create a folder, `js/lib`
5. Download and move the contents of [PlastronJS](https://github.com/rhysbrettbowen/PlastronJS) to `js/lib`

Then run the following command in your terminal:

	java -jar build/plovr.jar serve plovr.json

Change the script src at the bottom of `index.html` from:

	js/compiled.js

to

	http://localhost:9810/compile?id=todomvc&mode=raw


You can now view the uncompiled example and play around with it!


## Compiling

Once you have done the steps above, you can compile any changes you make by running the below command:

	java -jar build/plovr.jar build plovr.json

View the compiled version for the page by changing the bottom script `src` back to `js/compiled`.


## Credit

This TodoMVC application was created by [Rhys Brett-Bowen](http://rhysbrettbowen.com).
