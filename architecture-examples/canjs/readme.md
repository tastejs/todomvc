# CanJS

CanJS is a client-side, JavaScript framework that makes building rich web applications easy. It provides:

 - *can.Model* - for connecting to RESTful JSON interfaces
 - *can.View* - for template loading and caching
 - *can.Observe* - for key-value binding
 - *can.EJS* - live binding templates
 - *can.Control* - declarative event bindings
 - *can.route* - routing support

And works with jQuery, Zepto, YUI, Dojo and Mootools.

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
Models.Todo.findAll({}, function(todos) {
	new Todos('#todoapp', {
		todos: todos,
		state : can.route,
		view : 'views/todos.ejs'
	});
});
```
