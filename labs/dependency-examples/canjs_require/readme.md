# CanJS

[CanJS](http://canjs.us) is a client-side, JavaScript framework that makes building rich web applications easy.
It provides:

 - *can.Model* - for connecting to RESTful JSON interfaces
 - *can.View* - for template loading and caching
 - *can.Observe* - for key-value binding
 - *can.EJS* - live binding templates
 - *can.Control* - declarative event bindings
 - *can.route* - routing support

And works with jQuery, Zepto, YUI, Dojo and Mootools.

## CanJS and RequireJS

CanJS is currently one of the few MVC libraries that fully supports the AMD module concept.
This means, that any part of CanJS can be loaded as its own module which in turn only loads the
dependencies actually required. Only need on page Controls? Just `define(['can/control'], function(Control) {});`.
You can also obtain the `can` object by requiring `can/util/library`. This will provide all utility functions and
also any loaded module.
This makes it easier to move existing CanJS applications to RequireJS and use the utility functions:

```javascript
define(['can/util/library', 'can/control', 'can/view/ejs'], function(can) {
  can.Control // -> Construct
  can.view // -> now able to render EJS views
});
```

For more information read up in the [Using CanJS - AMD](http://canjs.us/#using_canjs-amd) section of the
documentation.

The available modules are

- `can/construct` - Inheritable constructor functions
  - `can/construct/super` - Call super methods
  - `can/construct/proxy` - Proxy construct methods
- `can/observe` - Observable key-value bindings
  - `can/observe/attributes` - Attribute conversion and model associations
  - `can/observe/backup` - Backup and restore Observe states
  - `can/observe/validations` - Validate observes
- `can/control` - Declarative event bindings
  - `can/control/plugin` - Turns Controls into jQuery plugins
  - `can/control/route` - Declarative route bindings
- `can/view` - Template loading, caching, rendering
  - `can/view/ejs` - Live binding embedded JavaScript
  - `can/view/mustache` - Live binding Mustache / Handlebars templates
  - `can/view/modifiers` - Adds view rendering abilities to jQuery modifiers (like `.html`, `.append` etc.)
- `can/route` - Back button and bookmarking support

## CanJS and JavaScriptMVC

*CanJS* is the extracted, more modern and more library-like MVC parts of [JavaScriptMVC](http://javascriptmvc.com)
(formerly known as *jQueryMX*).

*JavaScriptMVC 3.3* uses CanJS for the MVC structure so this TodoMVC example **applies to JavaScriptMVC** as well.
Additionally JavaScriptMVC contains:

- [CanJS](http://canjs.us) - For the MVC parts
- [jQuery++](http://jquerypp.com) - jQuery's missing utils and special events
- [StealJS](http://javascriptmvc.com/docs.html#!stealjs) - A JavaScript package manager
- [DocumentJS](http://javascriptmvc.com/docs.html#!DocumentJS) - A documentation engine
- [FuncUnit](http://funcunit.com) - jQuery style functional unit testing

## View engines

CanJS supports both live binding [EJS](http://canjs.us/#can_ejs) and [Mustache/Handlebars](http://canjs.us/#can_mustache)
templates. By default the Mustache view will be used but an EJS example is available as well.
You can easily change it by modifying the `view` option in the `js/app.js` file:

```js
Model.findAll({}, function (todos) {
  // Wire it up. Instantiate a new Todos control
  new Todos('#todoapp', {
    // The (Todo) model that the control should use
    Model: Model,
    // The list of Todos retrieved from the model
    todos: todos,
    // The control state for filtering the view (in our case the router)
    state: can.route,
    // The view to render
    view: 'views/todos.ejs'
  });
});
```
