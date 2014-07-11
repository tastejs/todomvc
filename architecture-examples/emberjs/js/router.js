/*global Ember, Todos */
(function () {
	'use strict';

	Todos.Router.map(function () {
		this.resource('todos', { path: '/' }, function () {
			this.route('active');
			this.route('completed');
		});
	});

	Todos.TodosRoute = Ember.Route.extend({
		model: function () {
			return this.store.find('todo');
		}
	});

	Todos.TodosIndexRoute = Todos.TodosRoute.extend({
		templateName: 'todo-list'
	});

	Todos.TodosActiveRoute = Todos.TodosIndexRoute.extend({
		model: function(){
			return this.store.filter('todo', function (todo) {
				return !todo.get('isCompleted');
			});
		}
	});

	Todos.TodosCompletedRoute = Todos.TodosRoute.extend({
		model: function(){
			return this.store.filter('todo', function (todo) {
				return todo.get('isCompleted');
			});
		}
	});
})();
