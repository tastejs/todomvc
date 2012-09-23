Thorax TodoMVC
==============
This is a modified version of the Backbone TodoMVC app that uses [Thorax](http://thoraxjs.org).

The Backbone implementation has code to manage the list items which are present on the page. Thorax provides collection bindings with the `collection` helper, which eleminate the need for most of this code:

		{{#collection todosCollection filter="filterTodoItem"
		  item-view="todo-item" tag="ul" id="todo-list"}}

`todosCollection` was specified in js/views/app.js:initialize, all instance variables of the view are automatically made available to the associated template. The `item-view` attribute is optional for collections, but specified here since we want to initialize an `todo-item` view for each item. This class is defined in js/views/todo-item.js and is referenced here by it's `name` attribute which is defined in that file.

The `filter` attribute specifies a function to be called for each model in the collection and hide or show that item depending on wether the function returns true or false. It is called when the collection is first rendered, then as models are added or a model fires a change event. If a `filter` event is triggered on the collection (which it is in routers/router.js:setFilter) it will force the collection to re-filter each model in the colleciton.

In this implementation the `stats` view has it's own view class and is re-rendered instead of the `app` view being re-rendered. Thorax provides the ability to embed views by name or reference with the `view` helper:

		{{view "stats"}}