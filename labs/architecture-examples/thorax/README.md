Thorax TodoMVC
==============
This is a modified version of the Backbone TodoMVC app that uses [Thorax](http://thoraxjs.org).

The Backbone implementation has code to manage the list items which are present on the page. Thorax provides collection bindings with the `collection` helper, which eleminate the need for most of this code:

		{{#collection item-view="todo-item" tag="ul" id="todo-list"}}

`collection` was specified in `js/app.js`, all instance variables of the view are automatically made available to the associated template. The `item-view` attribute is optional for collections, but specified here since we want to initialize an `todo-item` view for each item. This class is defined in `js/views/todo-item.js` and is referenced here by it's `name` attribute which is defined in that file.

Because the view containing the collection helper has an `itemFilter` method (in `views/app.js`) the collection will automatically be filtered on initial render, then as models are added, removed or changed. To force the collection to re-filter a `filter` event is triggered on the collection in `routers/router.js`.

In this implementation the `stats` view has it's own view class and is re-rendered instead of the `app` view being re-rendered. Thorax provides the ability to embed views by name or reference with the `view` helper:

		{{view "stats"}}