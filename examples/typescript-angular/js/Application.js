"use strict";
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
