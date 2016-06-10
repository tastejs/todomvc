/* global define */
define([
	'can/util/library',
	'can/component',
	'../models/todo',
	'can/route'
], function (can, Component, Todo, route) {
	'use strict';

	var ESCAPE_KEY = 27;

	return Component.extend({
		// Create this component on a tag  like `<todo-app>`
		tag: 'todo-app',
		scope: {
			// Store the Todo model in the scope
			Todo: Todo,
			// A list of all Todos retrieved from LocalStorage
			todos: new Todo.List({}),
			// Edit a Todo
			edit: function (todo, el) {
				todo.attr('editing', true);
				el.parents('.todo').find('.edit').focus();
			},
			cancelEditing: function (todo, el, e) {
				if (e.which === ESCAPE_KEY) {
					el.val(todo.attr('text'));
					todo.attr('editing', false);
				}
			},
			// Returns a list of Todos filtered based on the route
			displayList: function () {
				var filter = route.attr('filter');
				return this.todos.filter(function (todo) {
					if (filter === 'completed') {
						return todo.attr('complete');
					}

					if (filter === 'active') {
						return !todo.attr('complete');
					}

					return true;
				});
			},
			updateTodo: function (todo, el) {
				var value = can.trim(el.val());

				if (value === '') {
					todo.destroy();
				} else {
					todo.attr({
						editing: false,
						text: value
					});
				}
			},
			createTodo: function (context, el) {
				var value = can.trim(el.val());
				var TodoModel = this.Todo;

				if (value !== '') {
					new TodoModel({
						text: value,
						complete: false
					}).save();

					route.removeAttr('filter');
					el.val('');
				}
			},
			toggleAll: function (scope, el) {
				var toggle = el.prop('checked');
				this.attr('todos').each(function (todo) {
					todo.attr('complete', toggle);
				});
			},
			clearCompleted: function () {
				this.attr('todos').completed().forEach(function (todo) {
					todo.destroy();
				});
			}
		},
		events: {
			// When a new Todo has been created, add it to the todo list
			'{Todo} created': function (Construct, ev, todo) {
				this.scope.attr('todos').push(todo);
			}
		},
		helpers: {
			link: function (name, filter) {
				var data = filter ? { filter: filter } : {};
				return route.link(name, data, {
					className: route.attr('filter') === filter ? 'selected' : ''
				});
			},
			plural: function (singular, num) {
				return num() === 1 ? singular : singular + 's';
			}
		}
	});
});
