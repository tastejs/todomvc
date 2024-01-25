"use strict";
/// <reference path='../_all.ts' />
var todos;
(function (todos_1) {
    'use strict';
    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    class TodoStorage {
        constructor() {
            this.STORAGE_ID = 'todos-angularjs-typescript';
        }
        get() {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        }
        put(todos) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        }
    }
    todos_1.TodoStorage = TodoStorage;
})(todos || (todos = {}));
