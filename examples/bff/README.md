# Basic Front-end Foundation (BFF) TodoMVC Example

BFF is a collection of generic building blocks that can be used to minimize the amount of boilerplate code needed to create an interactive web application. The modules are designed with the MVC pattern in mind, although most of them are generic enough to be usable in many other patterns. Each of the seven modules (Record, List, View, Extend, Event Emitter, Event Listener, and Patch DOM) can be used on its own, but together they create a web development foundation that is stronger than the sum of the individual parts. This todo list example application combines all modules in an idiomatic way.


## Resources

- [Website](https://github.com/oskargustafsson/BFF)
- [Documentation](http://oskargustafsson.github.io/BFF/)


### Support

- [Issue tracker](https://github.com/oskargustafsson/BFF/issues)
- [Wiki](https://github.com/oskargustafsson/BFF/wiki)

*Let us [know](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


## Implementation

The app is structured into two major components; the _app view_ handles everything related to adding, removing and filtering list items, and the _item view_ handles logic related to updating a single list item. Both the app view and the list item views are combined controllers and views (in classic MVC terminology), because there is no reason to separate them in an app this simple.

The general ide behind the program flow is that all application state is stored in the data layer, i.e. the views are completely stateless. This allows us to use a shotgun approach to keeping the data and views in sync; "when the data changes in some way, just redraw everything". In practice, the typical flow is as follows:
1. A DOM event (e.g. a click) triggers a view to update the data layer (e.g. changing a list item's "completed" flag).
1. The views associated with that particular piece of data re-renders themselves. The Patch DOM module ensures that a differential DOM update is performed - only the affected parts of the views representations are redrawn.


## Credit

Created by [Oskar Gustafsson](https://github.com/oskargustafsson)
