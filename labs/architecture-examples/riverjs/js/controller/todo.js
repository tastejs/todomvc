'use strict';
/*
 * module dependence
 */

var route = require('util.route'),
    model = require('model.todo');

route
    .look(exports)
    .when('#/active', function () {
        var todos = model.get();
        exports.todos = todos.filter(function (d) {
            if (!d.completed) { return d; }
        });
    })
    .when('#/completed', function () {
        var todos = model.get();
        exports.todos = todos.filter(function (d) {
            if (d.completed) { return d; }
        });
    })
    .others(function () {
        exports.todos = model.get();
    });

route.nav();

exports.add = function (title) {
    title = title.trim();
    if (!title) { return; }
    model.add(title);
    route.nav();
};

exports.remove = function (todo) {
    model.remove(todo);
    route.nav();
};

exports.update = function (todo) {
    todo.title = todo.title.trim();
    //if user input blank string,remove it.
    if (!todo.title) { exports.remove(todo); }
    else {
        model.update(todo);
        route.nav();
    }
};

exports.get = function () {
    return model.get();
};

exports.getCompleteCount = function () {
    return model.getCount(true);
};

exports.getTodoCount = function () {
    return model.getCount(false);
};

exports.toggleAll = function () {
    model.toggleAll();
    route.nav();
};

exports.clearCompleted = function () {
    model.clearCompleted();
    route.nav();
};
