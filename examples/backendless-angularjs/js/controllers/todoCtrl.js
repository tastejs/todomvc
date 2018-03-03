/*global angular */

angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, todoStorage) {
		'use strict';

		$scope.todos = [];
		$scope.newTodo = '';
		$scope.editedTodo = null;
		$scope.todoInputFocus = true;

		todoStorage.load().then(rebindTodos);

		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')($scope.todos, {completed: false}).length;
			$scope.completedCount = $scope.todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';

			$scope.statusFilter = (status === 'active')
				? {completed: false}
				: (status === 'completed') ? {completed: true} : {};
		});

		$scope.addTodo = function () {
			var newTodo = {
				title: $scope.newTodo.trim(),
				completed: false
			};

			if (!newTodo.title) {
				return;
			}

			$scope.saving = true;
			$scope.todoInputFocus = false;
			todoStorage.insert(newTodo)
				.then(function success() {
					$scope.newTodo = '';
				})
				.finally(function () {
					$scope.saving = false;
					$scope.todoInputFocus = true;
				});
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function (todo, event) {
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				$scope.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			if (todo.title === $scope.originalTodo.title) {
				$scope.editedTodo = null;
				return;
			}

			todoStorage[todo.title ? 'put' : 'delete'](todo)
				.then(function success() {}, function error() {
					todo.title = $scope.originalTodo.title;
				})
				.finally(function () {
					$scope.editedTodo = null;
				});
		};

		$scope.revertEdits = function (todo) {
			$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (todo) {
			todoStorage.delete(todo).then(rebindTodos);
		};

		$scope.toggleCompleted = function (todo, completed) {
			var index = $scope.todos.indexOf(todo);

			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}

			todoStorage.put(todo).then(function (savedItem) {
				$scope.todos[index] = savedItem;
			});
		};

		$scope.clearCompletedTodos = function () {
			todoStorage.clearCompleted().then(rebindTodos);
		};

		$scope.markAll = function (completed) {
			$scope.todos.forEach(function (todo) {
				if (todo.completed !== completed) {
					$scope.toggleCompleted(todo, completed);
				}
			});
		};

		function rebindTodos() {
			$scope.todos = todoStorage.todos;
		}
	});
