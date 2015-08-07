**Knockout** is a JavaScript [MVVM](http://en.wikipedia.org/wiki/Model_View_ViewModel) (a modern variant of MVC) library that makes it easier to create rich, desktop-like user interfaces with JavaScript and HTML. It uses *observers* to make your UI automatically stay in sync with an underlying data model, along with a powerful and extensible set of *declarative bindings* to enable productive development.

##Getting started

**Totally new to Knockout?** The most fun place to start is the [online interactive tutorials](http://learn.knockoutjs.com/).

For more details, see

 * Documentation on [the project's website](http://knockoutjs.com/documentation/introduction.html)
 * Online examples at [http://knockoutjs.com/examples/](http://knockoutjs.com/examples/)

##Downloading Knockout

You can [download released versions of Knockout](http://knockoutjs.com/downloads/) from the project's website.

For Node.js developers, Knockout is also available from [npm](https://npmjs.org/) - just run `npm install knockout`.

##Building Knockout from sources

If you prefer to build the library yourself:

 1. **Clone the repo from GitHub**

        git clone https://github.com/knockout/knockout.git
        cd knockout

 2. **Acquire build dependencies.** Make sure you have [Node.js](http://nodejs.org/) installed on your workstation. This is only needed to _build_ Knockout from sources. Knockout itself has no dependency on Node.js once it is built (it works with any server technology or none). Now run:

        npm install -g grunt-cli
        npm install

    The first `npm` command sets up the popular [Grunt](http://gruntjs.com/) build tool. You might need to run this command with `sudo` if you're on Linux or Mac OS X, or in an Administrator command prompt on Windows. The second `npm` command fetches the remaining build dependencies.

 3. **Run the build tool**

        grunt

    Now you'll find the built files in `build/output/`.

## Running the tests

If you have [phantomjs](http://phantomjs.org/download.html) installed, then the `grunt` script will automatically run the specification suite and report its results.

Or, if you want to run the specs in a browser (e.g., for debugging), simply open `spec/runner.html` in your browser.

##License

MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
