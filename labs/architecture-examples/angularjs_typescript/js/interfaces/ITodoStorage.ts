/// <reference path='../libs/angular-1.0.d.ts' />
/// <reference path='../models/TodoItem.ts' />

'use strict';

interface ITodoStorage {
    get(): TodoItem[];
    put(todos: TodoItem[]);
}
