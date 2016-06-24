/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    var TodoItem = (function () {
        function TodoItem(title, completed) {
            this.title = title;
            this.completed = completed;
        }
        return TodoItem;
    })();
    todos.TodoItem = TodoItem;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
     */
    function todoFocus($timeout) {
        return {
            link: function ($scope, element, attributes) {
                $scope.$watch(attributes.todoFocus, function (newval) {
                    if (newval) {
                        $timeout(function () { return element[0].focus(); }, 0, false);
                    }
                });
            }
        };
    }
    todos.todoFocus = todoFocus;
    todoFocus.$inject = ['$timeout'];
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * Directive that executes an expression when the element it is applied to loses focus.
     */
    function todoBlur() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('blur', function () { $scope.$apply(attributes.todoBlur); });
                $scope.$on('$destroy', function () { element.unbind('blur'); });
            }
        };
    }
    todos.todoBlur = todoBlur;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    var ESCAPE_KEY = 27;
    /**
     * Directive that cancels editing a todo if the user presses the Esc key.
     */
    function todoEscape() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('keydown', function (event) {
                    if (event.keyCode === ESCAPE_KEY) {
                        $scope.$apply(attributes.todoEscape);
                    }
                });
                $scope.$on('$destroy', function () { element.unbind('keydown'); });
            }
        };
    }
    todos.todoEscape = todoEscape;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos_1) {
    'use strict';
    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    var TodoStorage = (function () {
        function TodoStorage() {
            this.STORAGE_ID = 'todos-angularjs-typescript';
        }
        TodoStorage.prototype.get = function () {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        };
        TodoStorage.prototype.put = function (todos) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        };
        return TodoStorage;
    })();
    todos_1.TodoStorage = TodoStorage;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    var TodoCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function TodoCtrl($scope, $location, todoStorage, filterFilter) {
            var _this = this;
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
            $scope.$watch('todos', function () { return _this.onTodos(); }, true);
            $scope.$watch('location.path()', function (path) { return _this.onPath(path); });
            if ($location.path() === '')
                $location.path('/');
            $scope.location = $location;
        }
        TodoCtrl.prototype.onPath = function (path) {
            this.$scope.statusFilter = (path === '/active') ?
                { completed: false } : (path === '/completed') ?
                { completed: true } : {};
        };
        TodoCtrl.prototype.onTodos = function () {
            this.$scope.remainingCount = this.filterFilter(this.todos, { completed: false }).length;
            this.$scope.doneCount = this.todos.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount;
            this.todoStorage.put(this.todos);
        };
        TodoCtrl.prototype.addTodo = function () {
            var newTodo = this.$scope.newTodo.trim();
            if (!newTodo.length) {
                return;
            }
            this.todos.push(new todos.TodoItem(newTodo, false));
            this.$scope.newTodo = '';
        };
        TodoCtrl.prototype.editTodo = function (todoItem) {
            this.$scope.editedTodo = todoItem;
            // Clone the original todo in case editing is cancelled.
            this.$scope.originalTodo = angular.extend({}, todoItem);
        };
        TodoCtrl.prototype.revertEdits = function (todoItem) {
            this.todos[this.todos.indexOf(todoItem)] = this.$scope.originalTodo;
            this.$scope.reverted = true;
        };
        TodoCtrl.prototype.doneEditing = function (todoItem) {
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
        };
        TodoCtrl.prototype.removeTodo = function (todoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        };
        TodoCtrl.prototype.clearDoneTodos = function () {
            this.$scope.todos = this.todos = this.todos.filter(function (todoItem) { return !todoItem.completed; });
        };
        TodoCtrl.prototype.markAll = function (completed) {
            this.todos.forEach(function (todoItem) { todoItem.completed = completed; });
        };
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
        return TodoCtrl;
    })();
    todos.TodoCtrl = TodoCtrl;
})(todos || (todos = {}));
/// <reference path='_all.ts' />
/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
var todos;
(function (todos) {
    'use strict';
    var todomvc = angular.module('todomvc', [])
        .controller('todoCtrl', todos.TodoCtrl)
        .directive('todoBlur', todos.todoBlur)
        .directive('todoFocus', todos.todoFocus)
        .directive('todoEscape', todos.todoEscape)
        .service('todoStorage', todos.TodoStorage);
})(todos || (todos = {}));
/// <reference path='libs/jquery/jquery.d.ts' />
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path='models/TodoItem.ts' />
/// <reference path='interfaces/ITodoScope.ts' />
/// <reference path='interfaces/ITodoStorage.ts' />
/// <reference path='directives/TodoFocus.ts' />
/// <reference path='directives/TodoBlur.ts' />
/// <reference path='directives/TodoEscape.ts' />
/// <reference path='services/TodoStorage.ts' />
/// <reference path='controllers/TodoCtrl.ts' />
/// <reference path='Application.ts' />
//# sourceMappingURL=Application.js.map