'use strict';
var TodoCtrl = (function () {
    function TodoCtrl($scope, $location, todoStorage, filterFilter) {
        this.$scope = $scope;
        this.todoStorage = todoStorage;
        this.filterFilter = filterFilter;
        var _this = this;
        this.todos = $scope.todos = todoStorage.get();
        $scope.newTodo = "";
        $scope.editedTodo = null;
        $scope.addTodo = function () {
            return _this.addTodo();
        };
        $scope.editTodo = function (t) {
            return _this.editTodo(t);
        };
        $scope.doneEditing = function (t) {
            return _this.doneEditing(t);
        };
        $scope.removeTodo = function (t) {
            return _this.removeTodo(t);
        };
        $scope.clearDoneTodos = function () {
            return _this.clearDoneTodos();
        };
        $scope.markAll = function (d) {
            return _this.markAll(d);
        };
        $scope.$watch('todos', function () {
            return _this.onTodos();
        }, true);
        $scope.$watch('location.path()', function (path) {
            return _this.onPath(path);
        });
        if($location.path() === '') {
            $location.path('/');
        }
        $scope.location = $location;
    }
    TodoCtrl.prototype.onPath = function (path) {
        this.$scope.statusFilter = (path == '/active') ? {
            completed: false
        } : (path == '/completed') ? {
            completed: true
        } : null;
    };
    TodoCtrl.prototype.onTodos = function () {
        this.$scope.remainingCount = this.filterFilter(this.todos, {
            completed: false
        }).length;
        this.$scope.doneCount = this.todos.length - this.$scope.remainingCount;
        this.$scope.allChecked = !this.$scope.remainingCount;
        this.todoStorage.put(this.todos);
    };
    TodoCtrl.prototype.addTodo = function () {
        if(!this.$scope.newTodo.length) {
            return;
        }
        this.todos.push({
            title: this.$scope.newTodo,
            completed: false
        });
        this.$scope.newTodo = '';
    };
    TodoCtrl.prototype.editTodo = function (todo) {
        this.$scope.editedTodo = todo;
    };
    TodoCtrl.prototype.doneEditing = function (todo) {
        this.$scope.editedTodo = null;
        if(!todo.title) {
            this.$scope.removeTodo(todo);
        }
    };
    TodoCtrl.prototype.removeTodo = function (todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
    };
    TodoCtrl.prototype.clearDoneTodos = function () {
        this.$scope.todos = this.todos = this.todos.filter(function (val) {
            return !val.completed;
        });
    };
    TodoCtrl.prototype.markAll = function (done) {
        this.todos.forEach(function (todo) {
            todo.completed = done;
        });
    };
    return TodoCtrl;
})();
//@ sourceMappingURL=TodoCtrl.js.map
