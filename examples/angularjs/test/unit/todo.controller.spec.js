/*global describe, it, beforeEach, inject, expect*/
(function () {
	'use strict';

	describe('Todo Controller', function () {
		var todoController, scope, store;

		// Load the module containing the app, only 'ng' is loaded by default.
		beforeEach(module('todomvc'));

		beforeEach(inject(function ($controller, $rootScope, localStorage) {
			scope = $rootScope.$new();

			store = localStorage;

			localStorage.todos = [];

			localStorage._getFromLocalStorage = function () {
				return [];
			};

			localStorage._saveToLocalStorage = function (todos) {
				localStorage.todos = todos;
			};

			todoController = $controller('TodoController', {
				$scope: scope,
				store: store
			});
		}));

		it('should not have an edited Todo on start', function () {
			expect(todoController.editedTodo).toBeNull();
		});

		it('should not have any Todos on start', function () {
			expect(todoController.todos.length).toBe(0);
		});

		it('should have all Todos completed', function () {
			scope.$digest();
			expect(todoController.allChecked).toBeTruthy();
		});

		describe('the filter', function () {
			it('should default to ""', function () {
				scope.$emit('$routeChangeSuccess');

				expect(todoController.status).toBe('');
				expect(todoController.statusFilter).toEqual({});
			});

			describe('being at /active', function () {
				it('should filter non-completed', inject(function ($controller) {
					todoController = $controller('TodoController', {
						$scope: scope,
						store: store,
						$routeParams: {
							status: 'active'
						}
					});

					scope.$emit('$routeChangeSuccess');
					expect(todoController.statusFilter.completed).toBeFalsy();
				}));
			});

			describe('being at /completed', function () {
				it('should filter completed', inject(function ($controller) {
					todoController = $controller('TodoController', {
						$scope: scope,
						$routeParams: {
							status: 'completed'
						},
						store: store
					});

					scope.$emit('$routeChangeSuccess');

					expect(todoController.statusFilter.completed).toBeTruthy();
				}));
			});
		});

		describe('having no Todos', function () {
			var todoController;

			beforeEach(inject(function ($controller) {
        todoController = $controller('TodoController', {
					$scope: scope,
					store: store
				});
				scope.$digest();
			}));

			it('should not add empty Todos', function () {
        todoController.newTodo = '';

        todoController.addTodo();

				scope.$digest();
				expect(todoController.todos.length).toBe(0);
			});

			it('should not add items consisting only of whitespaces', function () {
        todoController.newTodo = '   ';

        todoController.addTodo();

				scope.$digest();

				expect(todoController.todos.length).toBe(0);
			});

			it('should trim whitespace from new Todos', function () {
        todoController.newTodo = '  buy some unicorns  ';

        todoController.addTodo();

				scope.$digest();
				expect(todoController.todos.length).toBe(1);
				expect(todoController.todos[0].title).toBe('buy some unicorns');
			});
		});

		describe('having some saved Todos', function () {
			var todoController;

			beforeEach(inject(function ($controller) {
        todoController = $controller('TodoController', {
					$scope: scope,
					store: store
				});

				store.insert({ title: 'Uncompleted Item 0', completed: false });
				store.insert({ title: 'Uncompleted Item 1', completed: false });
				store.insert({ title: 'Uncompleted Item 2', completed: false });
				store.insert({ title: 'Completed Item 0', completed: true });
				store.insert({ title: 'Completed Item 1', completed: true });

				scope.$digest();
			}));

			it('should count Todos correctly', function () {
				expect(todoController.todos.length).toBe(5);
				expect(todoController.remainingCount).toBe(3);
				expect(todoController.completedCount).toBe(2);
				expect(todoController.allChecked).toBeFalsy();
			});

			it('should save Todos to local storage', function () {
				expect(todoController.todos.length).toBe(5);
			});

			it('should remove Todos w/o title on saving', function () {
				var todo = store.todos[2];

        todoController.editTodo(todo);
				todo.title = '';

        todoController.saveEdits(todo);

				expect(todoController.todos.length).toBe(4);
			});

			it('should trim Todos on saving', function () {
				var todo = store.todos[0];

        todoController.editTodo(todo);

				todo.title = ' buy moar unicorns  ';
        todoController.saveEdits(todo);

				expect(todoController.todos[0].title).toBe('buy moar unicorns');
			});

			it('clearCompletedTodos() should clear completed Todos', function () {
        todoController.clearCompletedTodos();

				expect(todoController.todos.length).toBe(3);
			});

			xit('markAll() should mark all Todos completed', function () {
        todoController.completedCount = 0;
        todoController.markAll(true);

				scope.$digest();

				expect(todoController.completedCount).toBe(5);
			});

			it('revertTodo() get a Todo to its previous state', function () {
				var todo = store.todos[0];

        todoController.editTodo(todo);

				todo.title = 'Unicorn sparkly skypuffles.';
        todoController.revertEdits(todo);

				scope.$digest();

				expect(todoController.todos[0].title).toBe('Uncompleted Item 0');
			});
		});
	});
}());
