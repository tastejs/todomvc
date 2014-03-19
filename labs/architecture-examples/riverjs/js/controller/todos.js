'use strict';
/*
 * module dependence
 */

var model = require('model.local'),
    todos = exports.todos = model.get();

exports.newtodo = '';

//caculate current active items number and completed number
function calStatus() {
    exports.activenum = 0;
    exports.completednum = 0;
    for (var i = 0, len = todos.length; i < len; i++) {
        if (todos[i].status === 'active') {
            exports.activenum++;
        } else {
            exports.completednum++;
        }
    }
}

//save to local 
function save(todos) {
    calStatus();
    model.save(todos);
}

exports.save = save;

// calculate active,completed item when page init;
calStatus();


//add new todo
exports.add = function (event) {
    var newtodo = exports.newtodo.trim();
    if (event.keyCode === 13 && newtodo) {
        todos.push({
            desc: newtodo,
            status: 'active'
        });
        exports.newtodo = '';
        save(todos);
    }
};

function remove(todo) {
    var index = todos.indexOf(todo);
    todos.splice(index, 1);
    save(todos);
}
//remove todo from todo list
exports.remove = remove;

//update todo
exports.update = function (todo, value) {
    value = value.trim();
    if (!value) {
        remove(todo);
    } else {
        //trim entered text
        todo.desc = value;
        save(todos);
    }
};




//toggle all todo items status
exports.toggleall = function () {
    todos.forEach(function (d) {
        if (exports.completednum >= 0 && exports.completednum < todos.length) {
            d.status = 'completed';
        } else {
            d.status = 'active';
        }
    });
    save(todos);
};

//for each item toggle status
exports.toggleStatus = function (todo) {
    if (todo.status === 'active') {
        todo.status = 'completed';
    } else {
        todo.status = 'active';
    }
    save(todos);
};

//remove completed items from todo list
exports.removeCompleted = function () {
    exports.completednum = 0;
    todos = exports.todos = todos.filter(function (d) {
        if (d.status !== 'completed') {
            return true;
        }
    });
    save(todos);
};
