var todos;
(function (todos) {
    'use strict';
    var todomvc = angular.module('todomvc', []).controller('todoCtrl', todos.TodoCtrl.prototype.injection()).directive('todoBlur', todos.TodoBlur.prototype.injection()).directive('todoFocus', todos.TodoFocus.prototype.injection()).service('todoStorage', todos.TodoStorage.prototype.injection());
})(todos || (todos = {}));
//@ sourceMappingURL=Application.js.map
