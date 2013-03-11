# Backbone.Marionette TodoMVC app

[Backbone.Marionette](http://marionettejs.com) is a composite 
application library for Backbone.js that aims to simplify 
the construction of large scale JavaScript applications. 
It is a collection of common design and implementation patterns 
found in the applications that I (Derick Bailey) have been building 
with Backbone, and includes various pieces inspired by composite 
application architectures, such as Microsoft's "Prism" framework.

## Key Benefits

* Scale applications out with modular, event driven architecture
* Sensible defaults, such as using Underscore templates for view rendering
* Easy to modify to make it work with your applicaton's specific needs
* Reduce boilerplate for views, with specialized view types
* Build on a modular architecture with an Application and modules that attach to it
* Compose your application's visuals at runtime, with Region and Layout
* Nested views and layouts within visual regions
* Built-in memory management and zombie killing in views, regions and layouts
* Built-in event clean up with the EventBinder
* Event-driven architecture with the EventAggregator
* Flexible, "as-needed" architecture allowing you to pick and choose what you need
* And much, much more

This implementation of the application uses Marionette's module system. 
Variations using RequireJS and a more classic approach to JavaScript modules 
[are also available here](https://github.com/marionettejs/backbone.marionette/wiki/Projects-and-websites-using-marionette).