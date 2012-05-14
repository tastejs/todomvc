# TodoMVC Closure Architecture Example

## Introduction

An example making use of the [Closure toolkit](https://developers.google.com/closure/). Note this project breaks with the convention of the others and uses spaces in place of tabs withing JavaScript files. This is to comply with the Google style guidelines which the Closure Linter enforces (see Linting below).

## Running

A third party build tool called [Plovr](http://plovr.com/) is used to make running and compiling the code easier. To serve the code for development purposes (the example should run in compiled mode without using Plovr), run the following command from this folder -

java -jar build/plovr.jar serve plovr.json

You'll also need to change the HTML file so that it references the served files instead of the compiled version, to do this remove the compiled script reference and add the following -

<script type="text/javascript" src="http://localhost:9810/compile?id=todomvc&mode=RAW"></script>

This will serve up the javascript files in RAW mode which is ideal for rapid development and debugging. To run the compiler, and therefore all the associated type checks etc., change RAW for ADVANCED -

<script type="text/javascript" src="http://localhost:9810/compile?id=todomvc&mode=ADVANCED"></script>


## Linting

Whilst Plovr features many of the tools from the Closure toolkit, one very useful one that's missing is the linter. The linter checks for common mistakes in your code, e.g. unused dependencies, whitespace errors. One restriction with the linter is that it will only permit code that adheres to the [Google JavaScript style guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml). In this case that means that we break with the project conventions and use space indentation instead of tabs.

The linter must be installed before use, the installation package is included in the build folder and the instructions are available on the [linter homepage](https://developers.google.com/closure/utilities/). Once installed run the following to check for errors -

gjslint **/*

## Compiling

To compile the code from the command line run Plovr like so -

java -jar build/plovr.jar build plovr.json

This will overwrite the js/compiled.js file with the new version, be sure to change the script tag reference in the HTML page.

## Credits

Template by [Sindre Sorhus](http://github.com/sindresorhus)

Created by [Chris Price](http://www.scottlogic.co.uk/blog/chris/)

Part of [TodoMVC](http://todomvc.com)

## License

Public Domain