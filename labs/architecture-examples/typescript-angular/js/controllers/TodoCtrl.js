var todos;
(function (todos) {
    'use strict';
    var TodoCtrl = (function () {
        function TodoCtrl($scope, $location, todoStorage, filterFilter) {
            this.$scope = $scope;
            this.$location = $location;
            this.todoStorage = todoStorage;
            this.filterFilter = filterFilter;
            var _this = this;
            this.todos = $scope.todos = todoStorage.get();
            $scope.newTodo = '';
            $scope.editedTodo = null;
            $scope.addTodo = function () {
                return _this.addTodo();
            };
            $scope.editTodo = function (todoItem) {
                return _this.editTodo(todoItem);
            };
            $scope.doneEditing = function (todoItem) {
                return _this.doneEditing(todoItem);
            };
            $scope.removeTodo = function (todoItem) {
                return _this.removeTodo(todoItem);
            };
            $scope.clearDoneTodos = function () {
                return _this.clearDoneTodos();
            };
            $scope.markAll = function (completed) {
                return _this.markAll(completed);
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
        TodoCtrl.prototype.injection = function () {
            return [
                '$scope', 
                '$location', 
                'todoStorage', 
                'filterFilter', 
                TodoCtrl
            ];
        };
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
            this.todos.push(new todos.TodoItem(this.$scope.newTodo, false));
            this.$scope.newTodo = '';
        };
        TodoCtrl.prototype.editTodo = function (todoItem) {
            this.$scope.editedTodo = todoItem;
        };
        TodoCtrl.prototype.doneEditing = function (todoItem) {
            this.$scope.editedTodo = null;
            if(!todoItem.title) {
                this.$scope.removeTodo(todoItem);
            }
        };
        TodoCtrl.prototype.removeTodo = function (todoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        };
        TodoCtrl.prototype.clearDoneTodos = function () {
            this.$scope.todos = this.todos = this.todos.filter(function (todoItem) {
                return !todoItem.completed;
            });
        };
        TodoCtrl.prototype.markAll = function (completed) {
            this.todos.forEach(function (todoItem) {
                todoItem.completed = completed;
            });
        };
        return TodoCtrl;
    })();
    todos.TodoCtrl = TodoCtrl;    
})(todos || (todos = {}));
//@ sourceMappingURL=TodoCtrl.js.map
