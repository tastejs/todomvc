/*global $$, app */
(function () {
	'use strict';

	/**
	 * Sets up a brand new Todo list.
	 *
	 * @param {string} name The name of your new to do list.
	 */
	function Todo(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var todo = new Todo('todos-vanillajs');

	window.addEventListener('load', function () {
		var page = document.location.hash.split('/')[1];
		todo.controller.setView(page);
	}.bind(this));
	window.addEventListener('hashchange', function () {
		var page = document.location.hash.split('/')[1];
		todo.controller.setView(page);
	}.bind(this));

	/**
	 * Finds the model ID of the clicked DOM element
	 *
	 * @param {object} target The starting point in the DOM for it to try to find
	 * the ID of the model.
	 */
	function lookupId(target) {
		var lookup = target;

		while (lookup.nodeName !== 'LI') {
			lookup = lookup.parentNode;
		}

		return lookup.dataset.id;
	}

	// A delegation event. Will check what item was clicked whenever you click on any
	// part of a list item.
	$$('#todo-list').addEventListener('click', function (e) {
		var target = e.target;

		// If you click a destroy button
		if (target.className.indexOf('destroy') > -1) {
			todo.controller.removeItem(lookupId(target));
		}

		// If you click the checkmark
		if (target.className.indexOf('toggle') > -1) {
			todo.controller.toggleComplete(lookupId(target), target);
		}

	});

	$$('#todo-list').addEventListener('dblclick', function (e) {
		var target = e.target;

		if (target.nodeName === 'LABEL') {
			todo.controller.editItem(lookupId(target), target);
		}
	});

	$$('#toggle-all').addEventListener('click', function (e) {
		todo.controller.toggleAll(e);
	});

	$$('#clear-completed').addEventListener('click', function () {
		todo.controller.removeCompletedItems();
	});
})();
