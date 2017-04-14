# ExtJS with DeftJS TodoMVC Example

This is an example of the TodoMVC application using [Sencha's ExtJS](http://www.sencha.com/) enhanced with the [DeftJS library](http://deftjs.org/). DeftJS is an MVC framework and inversion of control (IoC) container, and provides many other features such as a Promises API, live event listeners, etc. 

Instead of the singleton-based, stateless controllers promoted by Sencha's built-in MVC system, DeftJS uses ViewControllers which are dynamically attached to each view. This is essentially an implementation of the [Passive View pattern](http://martinfowler.com/eaaDev/PassiveScreen.html), similar to Cocoa's UIViewControllers. The source code and full documentation can be found via the [DeftJS home page](http://deftjs.org/).

Because the application is quite small, the benefits of ViewControllers and IoC aren't very obvious. The advantages become pronounced on larger applications.

It's also worth noting that the TodoMVC application is **not** very typical of an ExtJS-based application. ExtJS is more applicable to large-scale [rich internet application (RIA)](http://en.wikipedia.org/wiki/Rich_Internet_application) development. The XTemplate approach used here to more easily leverage the mandated CSS and layout is not a very common sight. 

ExtJS has a very advanced layout and component system, along with full-blown SASS-based themes. So while this example looks and functions exactly as the TodoMVC App Specification mandates, this isn't really how views in a "normal" ExtJS or Sencha Touch application would be set up. Sencha has [many examples of the available components and layouts](http://docs.sencha.com/ext-js/4-1/#!/example), if you'd like to see the more typical options. 