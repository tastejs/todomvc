/*global angular */

/**
 * Services that persists and retrieves todos from Backendless API
 *
 * returning promises for all changes to the model.
 */
angular.module('todomvc')
	.factory('todoStorage', function ($q) {
		'use strict';

		var todosQuery = {
			options: {pageSize: 100, sortBy: 'order asc'}
		};

		var BackendlessTodoStorage = Backendless.Persistence.of('Todo');

		var TodosDeferred = $q.defer();

		BackendlessTodoStorage.find(todosQuery, new Backendless.Async(function (result) {
			store.todos = store.todos || result.data;

			TodosDeferred.resolve(store.todos);
		}, function () {
			TodosDeferred.reject.apply(deferred, arguments);
		}));

		var store = {
			todos: null,

			clearCompleted: function () {
				var deferred = $q.defer();
				var incompleteTodos = [];
				var completeTodos = [];
				var removedCound = 0;

				for (var i = 0; i < store.todos.length; i++) {
					if (store.todos[i].completed) {
						completeTodos.push(store.todos[i]);
					} else {
						incompleteTodos.push(store.todos[i]);
					}
				}

				for (var j = 0; j < completeTodos.length; j++) {
					store.delete(completeTodos[j]).then(function success() {
						removedCound++;

						if (removedCound === completeTodos.length) {
							deferred.resolve(store.todos = incompleteTodos);
						}
					}, function error() {
						deferred.reject.apply(deferred, arguments);
					});
				}

				return deferred.promise;
			},

			load: function () {
				return TodosDeferred.promise;
			},

			insert: function (todo) {
				var deferred = $q.defer();

				BackendlessTodoStorage.save(todo, new Backendless.Async(function (newTodo) {
					store.todos.push(newTodo);
					deferred.resolve(newTodo);
				}, function () {
					deferred.reject.apply(deferred, arguments);
				}));

				return deferred.promise;
			},

			put: function (todo) {
				var deferred = $q.defer();

				BackendlessTodoStorage.save(todo, new Backendless.Async(function (savedItem) {
					deferred.resolve(store.todos[store.todos.indexOf(todo)] = savedItem);
				}, function () {
					deferred.reject.apply(deferred, arguments);
				}));

				return deferred.promise;
			},

			delete: function (todo) {
				var deferred = $q.defer();

				BackendlessTodoStorage.remove(todo, new Backendless.Async(function () {
					store.todos.splice(store.todos.indexOf(todo), 1);

					deferred.resolve.apply(deferred, arguments);
				}, function () {
					deferred.reject.apply(deferred, arguments);
				}));

				return deferred.promise;
			}
		};

		return store;
	});
