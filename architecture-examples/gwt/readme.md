# Google Web Toolkit TodoMVC Example

> Google Web Toolkit (GWT) is a development toolkit for building and optimizing complex browser-based applications. GWT is used by many products at Google, including Google AdWords and Orkut. It's open source, completely free, and used by thousands of developers around the world.

> _[Google Web Toolkit - developers.google.com/web-toolkit](https://developers.google.com/web-toolkit)_


## Learning Google Web Toolkit

The [Google Web Toolkit website](https://developers.google.com/web-toolkit/) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](https://developers.google.com/web-toolkit/doc/latest/DevGuide)
* [Getting Started with the GWT SDK](https://developers.google.com/web-toolkit/gettingstarted)
* [Articles](https://developers.google.com/web-toolkit/articles)
* [Case Studies](https://developers.google.com/web-toolkit/casestudies)
* [Blog](http://googlewebtoolkit.blogspot.com)
* [FAQ](https://developers.google.com/web-toolkit/doc/latest/FAQ)

Get help from other Google Web Toolkit users:

* [Google Web Toolkit on StackOverflow](http://stackoverflow.com/questions/tagged/gwt)
* [Mailing list on Google Groups](http://groups.google.com/group/Google-Web-Toolkit)
* [Google Web Toolkit on Twitter](http://twitter.com/googledevtools)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

This application is rather different than most of the other TodoMVC versions in that it is written in Java which is compiled to JavaScript. The files within the `gwttodo` folder are the result of running the GWT compilation process on the Java files found within the src folder. The UI pattern used by this application is Model-View-Presenter.

Whilst this application is very different to the other implementations, it still makes for an interesting comparison. Large-scale JavaScript applications are often written with GWT or Closure, with the resulting JavaScript code delivered to the client being compiled.

You can read more about the implementation on [my blog](http://www.scottlogic.co.uk/blog/colin/2012/03/developing-a-gwt-todomvc-application).


## Folder Structure

- `css` - includes GWT specific `app.css`, most styling is taken from the base CSS file `../../assets/base.css`
- `gwttodo` - the GWT compiled output, this includes various HTML files, which contain the JavaScript
code for each <a href "http://code.google.com/webtoolkit/doc/latest/tutorial/compile.html">GWT permutation</a>. This
folder also includes some redundant files, see the issue <a href="https://github.com/ColinEberhardt/todomvc/issues/9">
Remove redundant compiler output</a>.
- `src` - the Java source for this application


## Building this application

The GWT TodoMVC application was built with Java 1.6 and GWT 2.4.0. The easiest way to build this application
is to [download the GWT SDK](http://code.google.com/webtoolkit/gettingstarted.html), or together with the [Eclipse plugin](http://code.google.com/webtoolkit/usingeclipse.html).
