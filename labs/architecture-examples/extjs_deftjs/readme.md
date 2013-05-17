# ExtJS with DeftJS TodoMVC Example


## Learning Ext JS

The [Ext JS website](http://sencha.com/products/extjs) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://docs.sencha.com/extjs/4.2.0)
* [API Reference](http://docs.sencha.com/extjs/4.1.3)
* [Tutorials, Screencasts, Guides, FAQs](http://www.sencha.com/learn/extjs)
* [Applications built with Ext JS](http://docs.sencha.com/extjs/4.2.0/extjs-build/examples)
* [Sencha Blog](http://www.sencha.com/blog)

* [Ext JS on StackOverflow](http://stackoverflow.com/questions/tagged/extjs)
* [Ext JS on Twitter](http://twitter.com/extjs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

This is an example of the TodoMVC application using [Sencha's ExtJS](http://www.sencha.com/) enhanced with the [DeftJS library](http://deftjs.org/). DeftJS is an MVC framework and inversion of control (IoC) container, and provides many other features such as a Promises API, live event listeners, etc.

Instead of the singleton-based, stateless controllers promoted by Sencha's built-in MVC system, DeftJS uses ViewControllers which are dynamically attached to each view. This is essentially an implementation of the [Passive View pattern](http://martinfowler.com/eaaDev/PassiveScreen.html), similar to Cocoa's UIViewControllers. The source code and full documentation can be found via the [DeftJS home page](http://deftjs.org/).

Because the application is quite small, the benefits of ViewControllers and IoC aren't very obvious. The advantages become pronounced on larger applications.

It's also worth noting that the TodoMVC application is **not** very typical of an ExtJS-based application. ExtJS is more applicable to large-scale [rich internet application (RIA)](http://en.wikipedia.org/wiki/Rich_Internet_application) development. The XTemplate approach used here to more easily leverage the mandated CSS and layout is not a very common sight.

ExtJS has a very advanced layout and component system, along with full-blown SASS-based themes. So while this example looks and functions exactly as the TodoMVC App Specification mandates, this isn't really how views in a "normal" ExtJS or Sencha Touch application would be set up. Sencha has [many examples of the available components and layouts](http://docs.sencha.com/ext-js/4-1/#!/example), if you'd like to see the more typical options.
