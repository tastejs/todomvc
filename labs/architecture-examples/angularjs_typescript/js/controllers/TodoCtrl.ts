/// <reference path='../libs/angular-1.0.d.ts' />
/// <reference path='../services/TodoStorage.ts' />
/// <reference path='../models/TodoItem.ts' />
/// <reference path='../interfaces/ITodoStorage.ts' />
/// <reference path='../interfaces/ITodoScope.ts' />

'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
class TodoCtrl {
    private todos;

    constructor(private $scope: ITodoScope, $location: ng.ILocationService, private todoStorage: ITodoStorage, private filterFilter) {
        this.todos = $scope.todos = todoStorage.get();

        $scope.newTodo = "";
        $scope.editedTodo = null;

        $scope.addTodo = () => this.addTodo();
        $scope.editTodo = (t) => this.editTodo(t);
        $scope.doneEditing = (t) => this.doneEditing(t);
        $scope.removeTodo = (t) => this.removeTodo(t);
        $scope.clearDoneTodos = () => this.clearDoneTodos();
        $scope.markAll = (d) => this.markAll(d);


        $scope.$watch('todos', () => this.onTodos(), true);
        $scope.$watch('location.path()', (path) => this.onPath(path));

        if ($location.path() === '') $location.path('/');
        $scope.location = $location;
    }

    onPath(path) {
        this.$scope.statusFilter = (path == '/active') ?
          { completed: false } : (path == '/completed') ?
            { completed: true } : null;
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

        this.todos.push({
            title: this.$scope.newTodo,
            completed: false
        });

        this.$scope.newTodo = '';
    };

    editTodo(todo: TodoItem) {
        this.$scope.editedTodo = todo;
    };

    doneEditing(todo: TodoItem) {
        this.$scope.editedTodo = null;
        if (!todo.title) {
            this.$scope.removeTodo(todo);
        }
    };

    removeTodo(todo: TodoItem) {
        this.todos.splice(this.todos.indexOf(todo), 1);
    };

    clearDoneTodos() {
        this.$scope.todos = this.todos = this.todos.filter((val) => {
            return !val.completed;
        });
    };

    markAll(done: bool) {
        this.todos.forEach((todo: TodoItem) => {
            todo.completed = done;
        });
    };
}

