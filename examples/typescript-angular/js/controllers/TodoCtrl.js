"use strict";
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    class TodoCtrl {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor($scope, $location, todoStorage, filterFilter) {
            this.$scope = $scope;
            this.$location = $location;
            this.todoStorage = todoStorage;
            this.filterFilter = filterFilter;
            this.todos = $scope.todos = todoStorage.get();
            $scope.newTodo = '';
            $scope.editedTodo = null;
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            $scope.$watch('todos', () => this.onTodos(), true);
            $scope.$watch('location.path()', path => this.onPath(path));
            if ($location.path() === '')
                $location.path('/');
            $scope.location = $location;
        }
        onPath(path) {
            this.$scope.statusFilter = (path === '/active') ?
                { completed: false } : (path === '/completed') ?
                { completed: true } : {};
        }
        onTodos() {
            this.$scope.remainingCount = this.filterFilter(this.todos, { completed: false }).length;
            this.$scope.doneCount = this.todos.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount;
            this.todoStorage.put(this.todos);
        }
        addTodo() {
            var newTodo = this.$scope.newTodo.trim();
            if (!newTodo.length) {
                return;
            }
            this.todos.push(new todos.TodoItem(newTodo, false));
            this.$scope.newTodo = '';
        }
        editTodo(todoItem) {
            this.$scope.editedTodo = todoItem;
            // Clone the original todo in case editing is cancelled.
            this.$scope.originalTodo = angular.extend({}, todoItem);
        }
        revertEdits(todoItem) {
            this.todos[this.todos.indexOf(todoItem)] = this.$scope.originalTodo;
            this.$scope.reverted = true;
        }
        doneEditing(todoItem) {
            this.$scope.editedTodo = null;
            this.$scope.originalTodo = null;
            if (this.$scope.reverted) {
                // Todo edits were reverted, don't save.
                this.$scope.reverted = null;
                return;
            }
            todoItem.title = todoItem.title.trim();
            if (!todoItem.title) {
                this.removeTodo(todoItem);
            }
        }
        removeTodo(todoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        }
        clearDoneTodos() {
            this.$scope.todos = this.todos = this.todos.filter(todoItem => !todoItem.completed);
        }
        markAll(completed) {
            this.todos.forEach(todoItem => { todoItem.completed = completed; });
        }
    }
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    TodoCtrl.$inject = [
        '$scope',
        '$location',
        'todoStorage',
        'filterFilter'
    ];
    todos.TodoCtrl = TodoCtrl;
})(todos || (todos = {}));
