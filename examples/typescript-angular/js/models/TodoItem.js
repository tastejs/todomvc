"use strict";
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    class TodoItem {
        constructor(title, completed) {
            this.title = title;
            this.completed = completed;
        }
    }
    todos.TodoItem = TodoItem;
})(todos || (todos = {}));
