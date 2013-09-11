/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the angularFire service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, angularFire) {
	this.onDataLoaded = function onDataLoaded($scope, $location, url) {
		$scope.$watch('todos', function () {
			var total = 0;
			var remaining = 0;
			angular.forEach($scope.todos, function (todo) {
				total++;
				if (todo.completed === false) {
					remaining++;
				}
			});
			$scope.remainingCount = remaining;
			$scope.completedCount = total - remaining;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		$scope.addTodo = function () {
			var newTodo = $scope.newTodo.trim();
			if (!newTodo.length) {
				return;
			}
			$scope.todos[new Firebase(url).push().name()] = {
				title: newTodo,
				completed: false
			};
			$scope.newTodo = '';
		};

		$scope.editTodo = function (id) {
			$scope.editedTodo = $scope.todos[id];
			$scope.originalTodo = angular.extend({}, $scope.editedTodo);
		};

		$scope.doneEditing = function (id) {
			$scope.editedTodo = null;
			var title = $scope.todos[id].title.trim();
			if (!title) {
				$scope.removeTodo(id);
			}
		};

		$scope.revertEditing = function (id) {
			$scope.todos[id] = $scope.originalTodo;
			$scope.doneEditing(id);
		};

		$scope.removeTodo = function (id) {
			delete $scope.todos[id];
		};

		$scope.clearCompletedTodos = function () {
			var notCompleted = {};
			angular.forEach($scope.todos, function (todo, id) {
				if (!todo.completed) {
					notCompleted[id] = todo;
				}
			});
			$scope.todos = notCompleted;
		};

		$scope.markAll = function (completed) {
			angular.forEach($scope.todos, function (todo) {
				todo.completed = completed;
			});
		};
	};

	var url = 'https://todomvc-angular.firebaseio.com/';
	$scope.newTodo = '';
	$scope.editedTodo = null;

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;

	angularFire(url, $scope, 'todos', {}).then(function () {
		this.onDataLoaded($scope, $location, url);
	}.bind(this));
});
