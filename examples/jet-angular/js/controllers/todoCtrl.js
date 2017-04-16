/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter) {
		'use strict';

		var peer = new jet.Peer({
			url: 'ws://jet.nodejitsu.com:80'
		})

		var todos = $scope.todos = [];

		$scope.newTodo = '';
		$scope.editedTodo = null;

		peer.fetch({
			path: {
				startsWith: 'todo/#'
			},
			sort: {
				byValueField: {
					id: 'number'
				},
				from: 1,
				to: 100,
				asArray: true
			}
		}, function (todos) {
			$scope.$apply(function () {
				todos = todos.map(function (todo) {
					return {
						completed: todo.value.completed,
						title: todo.value.title,
						id: todo.value.id,
						path: todo.path
					};
				});

				angular.copy(todos, $scope.todos);
			});

		});

		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';

			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : null;
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
			peer.call('todo/add', [newTodo], {
				success: function () {
					$scope.$apply(function () {
						$scope.newTodo = '';
						$scope.saving = false;
					});
				},
				error: function () {
					$scope.saving = false;
				}
			});
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function (todo, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			if (todo.title === $scope.originalTodo.title) {
				return;
			}

			if (todo.title) {
				peer.set(todo.path, todo, {
					success: function () {
						$scope.$apply(function() {
							$scope.editedTodo = null;
						});
					},
					error: function () {
						$scope.$apply(function() {
							todo.title = $scope.originalTodo.title;
							$scope.editedTodo = null;
						});
					}
				})
			} else {
				peer.call('todo/remove', [todo]);
				$scope.editedTodo = null;
			}

		};

		$scope.revertEdits = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (todo) {
			peer.call('todo/remove', [todo]);
		};

		$scope.saveTodo = function (todo) {
			peer.set(todo.path, todo);
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			peer.set(todo.path, todo);
		};

		$scope.clearCompletedTodos = function () {
			var completedTodos = $scope.todos.filter(function (todo) {
				return todo.completed === true;
			});
			peer.call('todo/remove', completedTodos);
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				if (todo.completed !== completed) {
					$scope.toggleCompleted(todo, completed);
				}
			});
		};
	});
