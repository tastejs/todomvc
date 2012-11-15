/// <reference path='../libs/angular-1.0.d.ts' />
/// <reference path='../models/TodoItem.js' />
/// <reference path='../interfaces/ITodoStorage.js' />
'use strict';

/**
 * Services that persists and retrieves TODOs from localStorage.
 */
class TodoStorage implements ITodoStorage {
    STORAGE_ID = 'todos-angularjs-requirejs';

    get(): TodoItem[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    }

    put(todos: TodoItem[]) {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
    }
}