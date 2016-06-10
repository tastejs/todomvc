# Ractive.js TodoMVC app

> Ractive.js solves some of the biggest headaches in web development – data binding, efficient DOM updates, event handling – and does so with almost no learning curve.

> _[Ractive.js - ractivejs.org](http://ractivejs.org)_


## Learning Ractive.js

[Try the 60 second setup](http://www.ractivejs.org/60-second-setup), or [follow the interactive tutorials](http://learn.ractivejs.org).

You can find the [API documentation on docs.ractivejs.org](http://docs.ractivejs.org/latest/get-started).

If you have questions, try [Stack Overflow](http://stackoverflow.com/questions/tagged/ractivejs) or [@RactiveJS on Twitter](http://twitter.com/RactiveJS).

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

Ractive.js isn't an MVC framework in the traditional sense. There are no Model classes, just a plain old array of task objects, and there is only one view object. The app lives in a single file, with two tiny extra files to handle persistence and routing.

This is because Ractive is optimised for developer sanity (as well as performance!). It was initially developed to create interactive news apps at [theguardian.com](http://theguardian.com), which have to be built against punishing deadlines and moving goalposts. Because it embraces reactive programming principles, the developer has less to worry about. Ractive's API is totally straightforward - you can learn it in 5 minutes and master it in a few hours.

It has a number of innovative features: animations, easier event handling, declarative transitions, first-class SVG support, logical expressions in templates with sophisticated dependency tracking. For many developers, it hits the sweet spot between the flexibility of a library like Backbone and the power of a framework like Angular.


## Credit

This TodoMVC application was created by [Rich Harris](http://rich-harris.co.uk).
