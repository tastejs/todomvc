/// <reference path='../libs/angular-1.0.d.ts' />
/// <reference path='../models/TodoItem.ts' />

'use strict';

interface ITodoScope extends ng.IScope {
    todos: TodoItem[];
    newTodo: string;
    editedTodo: TodoItem;
    remainingCount: number;
    doneCount: number;
    allChecked: bool;
    statusFilter: { completed: bool; };
    location: ng.ILocationService;

    addTodo: () =>void;
    editTodo: (item: TodoItem) =>void;
    doneEditing: (item: TodoItem) =>void;
    removeTodo: (item: TodoItem) =>void;
    clearDoneTodos: () =>void;
    markAll: (done: bool) =>void;
}
