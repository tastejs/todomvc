/* jshint undef: true, unused: true */
/*global angular */

/*
 * Line below lets us save `this` as `tC`
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
		var tC = this;
		var todos = tC.todos = todoStorage.get();

		tC.ESCAPE_KEY = 27;
		tC.editedTodo = {};

		function resetTodo() {
			tC.newTodo = {title: '', completed: false};
		}

		resetTodo();

		if ($location.path() === '') {
			$location.path('/');
		}

		tC.location = $location;

		$scope.$watch('tC.location.path()', function (path) {
			tC.statusFilter = { '/active': {completed: false}, '/completed': {completed: true} }[path];
		});

		// 3rd argument `true` for deep object watching
		$scope.$watch('tC.todos', function () {
			tC.remainingCount = todos.filter(function (todo) { return !todo.completed; }).length;
			tC.allChecked = (tC.remainingCount === 0);

			// Save any changes to localStorage
			todoStorage.put(todos);
		}, true);

		tC.addTodo = function () {
			var newTitle = tC.newTodo.title = tC.newTodo.title.trim();
			if (newTitle.length === 0) {
				return;
			}

			todos.push(tC.newTodo);
			resetTodo();
		};

		tC.editTodo = function (todo) {
			tC.editedTodo = todo;

			// Clone the original todo to restore it on demand.
			tC.originalTodo = angular.copy(todo);
		};

		tC.doneEditing = function (todo, index) {
			tC.editedTodo = {};
			todo.title = todo.title.trim();

			if (!todo.title) {
				tC.removeTodo(index);
			}
		};

		tC.revertEditing = function (index) {
			tC.editedTodo = {};
			todos[index] = tC.originalTodo;
		};

		tC.removeTodo = function (index) {
			todos.splice(index, 1);
		};

		tC.clearCompletedTodos = function () {
			tC.todos = todos = todos.filter(function (val) {
				return !val.completed;
			});
		};

		tC.markAll = function (completed) {
			todos.forEach(function (todo) {
				todo.completed = completed;
			});
		};
	});
})();
//jscs:enable
