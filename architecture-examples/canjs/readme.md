# CanJS TodoMVC Example

> CanJS is a MIT-licensed, client-side, JavaScript framework that makes building rich web applications easy.

> _[CanJS - canjs.com](http://canjs.com)_

## Learning CanJS

The [CanJS website](http://canjs.com) is a great resource for getting started.

Here are some links you may find helpful:

* [CanJS guides documentation](http://canjs.com/guides/index.html)
* [API documentation](http://canjs.com/docs/index.html)
* [Blog](http://bitovi.com/blog/tag/canjs)
* [Getting started video](http://www.youtube.com/watch?v=GdT4Oq6ZQ68)

Get help from other CanJS users:

* [CanJS on StackOverflow](http://stackoverflow.com/questions/tagged/canjs)
* [CanJS Forums](http://forum.javascriptmvc.com/#Forum/canjs)
* [CanJS on Twitter](http://twitter.com/canjs)
* [#canjs](http://webchat.freenode.net/?channels=canjs) IRC channel on Freenode

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

The CanJS TodoMVC example uses [can.Component](http://canjs.com/guides/Components.html) introduced in CanJS 2.0.
can.Component supports declarative view bindings using Mustache/Handlebars as the template syntax.

Version 2 is mostly backwards compatible with previous 1.1.x version. For alternative architecture examples have a look at
the [TodoMVC 1.2.0 CanJS example](https://github.com/tastejs/todomvc/tree/1.2.0/architecture-examples/canjs).

### CanJS and JavaScriptMVC

CanJS is the extracted, more modern and more library-like MVC parts of [JavaScriptMVC](http://javascriptmvc.com), formerly known as jQueryMX.

JavaScriptMVC 3.3 uses CanJS for the MVC structure so this TodoMVC example applies to JavaScriptMVC as well.

Additionally, JavaScriptMVC contains:

- [CanJS](http://canjs.com) - For the MVC parts
- [jQuery++](http://jquerypp.com) - jQuery's missing utils and special events
- [StealJS](http://javascriptmvc.com/docs.html#!stealjs) - A JavaScript package manager
- [DocumentJS](http://javascriptmvc.com/docs.html#!DocumentJS) - A documentation engine
- [FuncUnit](http://funcunit.com) - jQuery style functional unit testing
