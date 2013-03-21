/// <reference path='../_all.ts' />

module todos {
    'use strict';

    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    export class TodoCtrl {

        private todos: TodoItem[];

        // this method is called on prototype during registration into IoC container. 
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        public injection(): any[] {
            return [
                '$scope',
                '$location',
                'todoStorage',
                'filterFilter',
                TodoCtrl
            ]
        }

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in App.ts and invoked from ng-controller attribute in index.html
        constructor(
            private $scope: ITodoScope,
            private $location: ng.ILocationService,
            private todoStorage: ITodoStorage,
            private filterFilter
            ) {
            this.todos = $scope.todos = todoStorage.get();

            $scope.newTodo = '';
            $scope.editedTodo = null;

            // adding event handlers to the scope, so they could be bound from view/HTML
            // these lambdas fix this keyword in JS world
            $scope.addTodo = () => this.addTodo();
            $scope.editTodo = (todoItem) => this.editTodo(todoItem);
            $scope.doneEditing = (todoItem) => this.doneEditing(todoItem);
            $scope.removeTodo = (todoItem) => this.removeTodo(todoItem);
            $scope.clearDoneTodos = () => this.clearDoneTodos();
            $scope.markAll = (completed) => this.markAll(completed);

            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            $scope.$watch('todos', () => this.onTodos(), true);
            $scope.$watch('location.path()', (path) => this.onPath(path))

            if ($location.path() === '') $location.path('/');
            $scope.location = $location;
        }

        onPath(path: string) {
            this.$scope.statusFilter = 
                (path == '/active')
                    ? { completed: false }
                    : (path == '/completed')
                        ? { completed: true }
                        : null;
        }

        onTodos() {
            this.$scope.remainingCount = this.filterFilter(this.todos, { completed: false }).length;
            this.$scope.doneCount = this.todos.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount
            this.todoStorage.put(this.todos);
        }

        addTodo() {
            if (!this.$scope.newTodo.length) {
                return;
            }

            this.todos.push(new TodoItem(this.$scope.newTodo, false));
            this.$scope.newTodo = '';
        };

        editTodo(todoItem: TodoItem) {
            this.$scope.editedTodo = todoItem;
        };

        doneEditing(todoItem: TodoItem) {
            this.$scope.editedTodo = null;
            if (!todoItem.title) {
                this.$scope.removeTodo(todoItem);
            }
        };

        removeTodo(todoItem: TodoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        };

        clearDoneTodos() {
            this.$scope.todos = this.todos = this.todos.filter((todoItem) => {
                return !todoItem.completed;
            });
        };

        markAll(completed: bool) {
            this.todos.forEach((todoItem: TodoItem) => {
                todoItem.completed = completed;
            });
        };
    }

}
