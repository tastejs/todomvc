/*global describe, it, beforeEach, inject, expect*/
(function () {
	'use strict';

	describe('Todo Controller', function () {
		var ctrl, scope;

			// Load the module containing the app, only 'ng' is loaded by default.
		beforeEach(module('todomvc'));

		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			ctrl = $controller('TodoCtrl', {$scope: scope});
		}));

		it('should not have an edited Todo on start', function () {
			expect(scope.editedTodo).toBeNull();
		});

		it('should not have any Todos on start', function () {
			expect(scope.todos.length).toBe(0);
		});

		it('should have all Todos completed', function () {
			scope.$digest();
			expect(scope.allChecked).toBeTruthy();
		});

		describe('the path', function () {
			it('should default to "/"', function () {
				expect(scope.location.path()).toBe('/');
			});

			describe('being at /active', function () {
				it('should filter non-completed', inject(function ($controller) {
					ctrl = $controller('TodoCtrl', {
						$scope: scope,
						$location: {
							path: function () { return '/active'; }
						}
					});

					scope.$digest();
					expect(scope.statusFilter.completed).toBeFalsy();
				}));
			});

			describe('being at /completed', function () {
				it('should filter completed', inject(function ($controller) {
					ctrl = $controller('TodoCtrl', {
						$scope: scope,
						$location: {
							path: function () { return '/completed'; }
						}
					});

					scope.$digest();
					expect(scope.statusFilter.completed).toBeTruthy();
				}));
			});
		});

		describe('having some saved Todos', function () {
			var todoList,
				todoStorage = {
				storage: {},
				get: function () {
					return this.storage;
				},
				put: function (value) {
					this.storage = value;
				}
			};

			beforeEach(inject(function ($controller) {
				todoList = [{
						'title': 'Uncompleted Item 0',
						'completed': false
					}, {
						'title': 'Uncompleted Item 1',
						'completed': false
					}, {
						'title': 'Uncompleted Item 2',
						'completed': false
					}, {
						'title': 'Completed Item 0',
						'completed': true
					}, {
						'title': 'Completed Item 1',
						'completed': true
					}];

				todoStorage.storage = todoList;
				ctrl = $controller('TodoCtrl', {
					$scope: scope,
					todoStorage: todoStorage
				});
				scope.$digest();
			}));

			it('should count Todos correctly', function () {
				expect(scope.todos.length).toBe(5);
				expect(scope.remainingCount).toBe(3);
				expect(scope.completedCount).toBe(2);
				expect(scope.allChecked).toBeFalsy();
			});

			it('should save Todos to local storage', function () {
				expect(todoStorage.storage.length).toBe(5);
			});

			it('should remove Todos w/o title on saving', function () {
				var todo = todoList[2];
				todo.title = '';

				scope.doneEditing(todo);
				expect(scope.todos.length).toBe(4);
			});

			it('clearCompletedTodos() should clear completed Todos', function () {
				scope.clearCompletedTodos();
				expect(scope.todos.length).toBe(3);
			});

			it('markAll() should mark all Todos completed', function () {
				scope.markAll();
				scope.$digest();
				expect(scope.completedCount).toBe(5);
			});
		});
	});
}());
