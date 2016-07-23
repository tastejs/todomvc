/*global define, ko */
define([
	'bower_components/durandal/app',
	'js/viewmodels/shell'
], function (app, shell) {
	'use strict';

	// represent a single todo item
	var Todo = function (title, completed) {
		this.title = ko.observable(title);
		this.completed = ko.observable(completed);
	};

	var ViewModel = function () {
		var self = this;

		self.activate = function () {
			// initialize the show mode
			var filter = shell.filter;

			if (filter === undefined) {
				filter = 'all';
			}

			self.showMode(filter);

			// check local storage for todos
			var todosFromlocalStorage = ko.utils.parseJson(localStorage.getItem('todos-durandal'));

			todosFromlocalStorage = ko.utils.arrayMap(todosFromlocalStorage, function (todo) {
				return new Todo(todo.title, todo.completed);
			});

			self.todos(todosFromlocalStorage);

			// internal computed observable that fires whenever anything changes in
			// our todos
			ko.computed(function () {
				// store a clean copy to local storage, which also creates a dependency
				// on the observableArray and all observables in each item
				localStorage.setItem('todos-durandal', ko.toJSON(self.todos()));
			}).extend({
				// save at most twice per second
				throttle: 500
			});

		};

		app.on('todoitem', function (item) {
			self.todos.push(new Todo(item));
		});

		// map array of passed in todos to an observableArray of Todo objects
		self.todos = ko.observableArray();

		self.showMode = ko.observable('all');

		self.filteredTodos = ko.computed(function () {
			switch (self.showMode()) {
				case 'active':
					return self.todos().filter(function (todo) {
						return !todo.completed();
					});
				case 'completed':
					return self.todos().filter(function (todo) {
						return todo.completed();
					});
				default:
					return self.todos();
			}
		});

		self.itemBeingEdited = ko.observable(undefined);

		// remove a single todo
		self.remove = function (todo) {
			self.todos.remove(todo);
		};

		// shadow variable so that the edit can be discarded on escape
		self.editTitle = ko.observable('');
		self.cancelEdit = false;

		// remove all completed todos
		self.removeCompleted = function () {
			self.todos.remove(function (todo) {
				return todo.completed();
			});
		};

		self.isThisItemBeingEdited = function (todo) {
			return (todo === self.itemBeingEdited());
		};

		self.cancelEditing = function () {
			self.itemBeingEdited(undefined);
			self.cancelEdit = true;
		};

		// edit an item
		self.editItem = function (item) {
			self.itemBeingEdited(item);
			self.editTitle(item.title());
			self.cancelEdit = false;
		};

		// stop editing an item.  Remove the item, if it is now empty
		self.stopEditing = function (item) {
			if (!self.cancelEdit) {
				self.itemBeingEdited(undefined);

				// trim and save back
				var trimmed = self.editTitle().trim();
				item.title(trimmed);

				if (!trimmed) {
					self.remove(item);
				}
			}
		};

		// count of all completed todos
		self.completedCount = ko.computed(function () {
			return ko.utils.arrayFilter(self.todos(), function (todo) {
				return todo.completed();
			}).length;
		});

		// count of todos that are not complete
		self.remainingCount = ko.computed(function () {
			return self.todos().length - self.completedCount();
		});

		// writeable computed observable to handle marking all complete/incomplete
		self.allCompleted = ko.computed({
			// always return true/false based on the done flag of all todos
			read: function () {
				return !self.remainingCount();
			},

			// set all todos to the written value (true/false)
			write: function (newValue) {
				ko.utils.arrayForEach(self.todos(), function (todo) {
					// set even if value is the same, as subscribers are not notified in
					// that case
					todo.completed(newValue);
				});
			}
		});

		// helper function to keep expressions out of markup
		self.getLabel = function (count) {
			return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
		};
	};

	return ViewModel;
});
