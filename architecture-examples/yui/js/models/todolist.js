/*global YUI*/
YUI.add('todo-list', function (Y) {
	'use strict';

	// Dependencies from Y.MVC.
	var TodoList;
	var Todo = Y.TodoMVC.Todo;

	// -- TodoList Model list -----
	TodoList = Y.Base.create('todoList', Y.ModelList, [Y.ModelSync.Local], {
		// The related Model for our Model List.
		model: Todo,

		// The root used for our localStorage key.
		root: 'todos-yui',

		// Return a ModelList of our completed Models.
		completed: function () {
			return this.filter({asList: true}, function (todo) {
				return todo.get('completed');
			});
		},

		// Return an ModelList of our un-completed Models.
		remaining: function () {
			return this.filter({asList: true}, function (todo) {
				return !todo.get('completed');
			});
		}
	});

	// Set this Model List under our custom Y.MVC namespace.
	Y.namespace('TodoMVC').TodoList = TodoList;

}, '@VERSION@', {
	requires: [
		'gallery-model-sync-local',
		'model-list',
		'todo'
	]
});
