# CanJS TodoMVC Example

> CanJS is a MIT-licensed, client-side, JavaScript framework that makes building rich web applications easy.

> _[CanJS - canjs.com](http://canjs.com)_


## Learning CanJS

The [CanJS website](http://canjs.com) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://donejs.com/docs.html#!canjs)
* [Why CanJS](http://canjs.com/#why_canjs)
* [Applications built with CanJS](http://canjs.com/#examples)
* [Blog](http://bitovi.com/blog/tag/canjs)
* [Getting started video](http://www.youtube.com/watch?v=GdT4Oq6ZQ68)

Articles and guides from the community:

* [Diving into CanJS](http://net.tutsplus.com/tutorials/javascript-ajax/diving-into-canjs)

Get help from other CanJS users:

* [CanJS on StackOverflow](http://stackoverflow.com/questions/tagged/canjs)
* [CanJS Forums](http://forum.javascriptmvc.com/#Forum/canjs)
* [CanJS on Twitter](http://twitter.com/canjs)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Implementation

### CanJS and JavaScriptMVC

CanJS is the extracted, more modern and more library-like MVC parts of [JavaScriptMVC](http://javascriptmvc.com), formerly known as jQueryMX.

JavaScriptMVC 3.3 uses CanJS for the MVC structure so this TodoMVC example applies to JavaScriptMVC as well.

Additionally, JavaScriptMVC contains:

- [CanJS](http://canjs.com) - For the MVC parts
- [jQuery++](http://jquerypp.com) - jQuery's missing utils and special events
- [StealJS](http://javascriptmvc.com/docs.html#!stealjs) - A JavaScript package manager
- [DocumentJS](http://javascriptmvc.com/docs.html#!DocumentJS) - A documentation engine
- [FuncUnit](http://funcunit.com) - jQuery style functional unit testing


### View engines

CanJS supports both live binding [EJS](http://canjs.us/#can_ejs) and [Mustache/Handlebars](http://canjs.us/#can_mustache)
templates. By default the Mustache view will be used but an EJS example is available as well.
You can easily change it by modifying the `view` option in the `js/app.js` file:

```js
Models.Todo.findAll({}, function (todos) {
	new Todos('#todoapp', {
		todos: todos,
		state: can.route,
		view: 'views/todos.ejs'
	});
});
```
