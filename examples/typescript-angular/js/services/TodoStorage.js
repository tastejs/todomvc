/// <reference path='../_all.ts' />
var todos;
(function (todos) {
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
    todos.TodoStorage = TodoStorage;
})(todos || (todos = {}));
