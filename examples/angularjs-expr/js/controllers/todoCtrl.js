/* jshint undef: true, unused: true */
/*global angular */

/*
 * Line below lets us save `this` as `TC`
 * to make properties look exactly the same as in the template
 */
//jscs:disable safeContextKeyword
(function () {
	'use strict';

	angular.module('todoCtrl', [])

	/**
	 * The main controller for the app. The controller:
	 * - retrieves and persists the model via the todoStorage service
	 * - exposes the model to the template and provides event handlers
	 */
	.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage) {
		var TC = this;
		var todos = TC.todos = todoStorage.get();

		TC.ESCAPE_KEY = 27;
		TC.editedTodo = {};

		if ($location.path() === '') {
			$location.path('/');
		}

		TC.location = $location;

		$scope.$watch('TC.location.path()', function (path) {
			TC.statusFilter = { '/active': {completed: false}, '/completed': {completed: true} }[path];
		});

		// 3rd argument `true` for deep object watching
		$scope.$watch('TC.todos', function () {
			todoStorage.put(todos);
		}, true);

		TC.editTodo = function (todo) {
			TC.editedTodo = todo;

			// Clone the original todo to restore it on demand.
			TC.originalTodo = angular.copy(todo);
		};

		TC.doneEditing = function (todo, index) {
			TC.editedTodo = {};
			todo.title = todo.title.trim();

			if (!todo.title) {
				TC.removeTodo(index);
			}
		};

		TC.revertEditing = function (index) {
			TC.editedTodo = {};
			todos[index] = TC.originalTodo;
		};

		TC.clearCompletedTodos = function () {
			TC.todos = todos = todos.filter(function (val) {
				return !val.completed;
			});
		};
	});
})();
//jscs:enable
