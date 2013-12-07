/*global app */
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
		todo.controller.setView(document.location.hash);
	}.bind(this));
	window.addEventListener('hashchange', function () {
		todo.controller.setView(document.location.hash);
	}.bind(this));
})();
