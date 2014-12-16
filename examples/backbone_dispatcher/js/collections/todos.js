/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Collection
	// ---------------

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	var Todos = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Todo,

		initialize: function() {

			app.dispatcher.register('createOnEnter', this);
			app.dispatcher.register('clearCompleted', this);
			app.dispatcher.register('toggleAllComplete', this);
			app.dispatcher.register('toggleTodoComplete', this);
			app.dispatcher.register('editTodo', this);
			app.dispatcher.register('removeTodo', this);
			app.dispatcher.register('filterOne', this);
			app.dispatcher.register('filterAll', this);

		},

		// Save all of the todo items under the `"todos"` namespace.
		localStorage: new Backbone.LocalStorage('todos-backbone'),

		// Filter down the list of all todo items that are finished.
		completed: function () {
			return this.where({completed: true});
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function () {
			return this.where({completed: false});
		},

		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		createOnEnter: function(title) {
			var self = this;

			this.create({
				title: title,
				order: self.nextOrder()
			});
		},

		clearCompleted: function() {
			_.invoke(this.completed(), 'destroy');
		},

		toggleAllComplete: function(completed) {

			this.each(function (todo) {
				todo.save({
					completed: completed
				});
			});
		},

		toggleTodoComplete: function(todo) {
			todo.toggle();
		},

		editTodo: function(payload) {
			var value = payload.inputVal;
			var trimmedValue = value.trim();

			payload.model.save({
				title: trimmedValue
			});

			if (value !== trimmedValue) {
				// Model values changes consisting of whitespaces only are
				// not causing change to be triggered Therefore we've to
				// compare untrimmed version with a trimmed one to check
				// whether anything changed
				// And if yes, we've to trigger change event ourselves
				payload.model.trigger('change');
			}
		},

		removeTodo: function(todo) {
			todo.destroy();
		},

		filterOne: function(todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			this.each(this.filterOne, this);
		},

		// Todos are sorted by their original insertion order.
		comparator: 'order'
	});

	// Create our global collection of **Todos**.
	app.todos = new Todos();
})();
