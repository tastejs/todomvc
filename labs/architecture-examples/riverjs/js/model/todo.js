'use strict';

var tool  = require('river.core.tools');

var STORAGE_ID = 'todos-riverjs';

exports.get = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
};

function save(todos) {
    localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
}

exports.add = function (title) {
    var newTodo = {
        id : tool.guid(),
        title   : title,
        completed : false
    };
    var todos = exports.get();
    todos.push(newTodo);
    save(todos);
};

exports.remove = function (todo) {
    var todos = exports.get();
    todos = todos.filter(function (d) {
        if (d.id !== todo.id) {
            return d;
        }
    });
    save(todos);
};

exports.update = function (todo) {
    var todos = exports.get();
    for (var i = 0, len = todos.length; i < len; i++) {
        if (todo.id === todos[i].id) {
            todos[i].title = todo.title;
            todos[i].completed = todo.completed;
            break;
        }
    }
    save(todos);
};

exports.getCount = function (completed) {
    var todos = exports.get();
    var count = 0;
    for (var i = 0, len = todos.length; i < len; i++) {
        if (todos[i].completed === completed) {
            count++;
        }
    }
    return count;
};

exports.toggleAll = function () {
    var todos = exports.get();
    var completedCount = exports.getCount(true);
    for (var i = 0, len = todos.length; i < len; i++) {
        if (todos.length === completedCount) {
            todos[i].completed = false;
        } else {
            todos[i].completed = true;
        }
    }
    save(todos);
};


exports.clearCompleted = function () {
    var todos = exports.get().filter(function (d) {
        if (!d.completed) {
            return d;
        }
    });
    save(todos);
};
