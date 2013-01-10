/// <reference path='../_all.ts' />

module todos {
    'use strict';

    export interface ITodoStorage {
        get (): TodoItem[];
        put(todos: TodoItem[]);
    }
}