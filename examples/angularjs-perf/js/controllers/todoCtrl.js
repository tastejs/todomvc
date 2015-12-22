/*global angular */
(function () {
	'use strict';

	angular.module('todoCtrl', [])

	/**
	 * The main controller for the app. The controller:
	 * - retrieves and persists the model via the todoStorage service
	 * - exposes the model to the template and provides event handlers
	 */
	.controller('TodoCtrl', function TodoCtrl($scope, $location, $filter, todoStorage) {
		var TC = this;
		var todos = TC.todos = todoStorage.get();

		TC.newTodo = '';
		TC.remainingCount = $filter('filter')(todos, {completed: false}).length;
		TC.editedTodo = null;

		if ($location.path() === '') {
			$location.path('/');
		}

		TC.location = $location;

		$scope.$watch('TC.location.path()', function (path) {
			TC.statusFilter = { '/active': {completed: false}, '/completed': {completed: true} }[path];
		});

		$scope.$watch('TC.remainingCount == 0', function (val) {
			TC.allChecked = val;
		});

		TC.addTodo = function () {
			var newTodo = TC.newTodo.trim();
			if (newTodo.length === 0) {
				return;
			}

			todos.push({
				title: newTodo,
				completed: false
			});
			todoStorage.put(todos);

			TC.newTodo = '';
			TC.remainingCount++;
		};

		TC.editTodo = function (todo) {
			TC.editedTodo = todo;
			
			// Clone the original todo to restore it on demand.
			TC.originalTodo = angular.extend({}, todo);
		};

		TC.doneEditing = function (todo) {
			TC.editedTodo = null;
			todo.title = todo.title.trim();

			if (!todo.title) {
				TC.removeTodo(todo);
			}

			todoStorage.put(todos);
		};

		TC.revertEditing = function (todo) {
			todos[todos.indexOf(todo)] = TC.originalTodo;
			TC.doneEditing(TC.originalTodo);
		};

		TC.removeTodo = function (todo) {
			TC.remainingCount -= todo.completed ? 0 : 1;
			todos.splice(todos.indexOf(todo), 1);
			todoStorage.put(todos);
		};

		TC.todoCompleted = function (todo) {
			TC.remainingCount += todo.completed ? -1 : 1;
			todoStorage.put(todos);
		};

		TC.clearCompletedTodos = function () {
			TC.todos = todos = todos.filter(function (val) {
				return !val.completed;
			});
			todoStorage.put(todos);
		};

		TC.markAll = function (completed) {
			todos.forEach(function (todo) {
				todo.completed = completed;
			});
			TC.remainingCount = completed ? 0 : todos.length;
			todoStorage.put(todos);
		};
	});
})();
