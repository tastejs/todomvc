'use strict';

var route = require('util.route');

function label(filters, index) {
    for (var i = 0, len = filters.length; i < len; i++) {
        if (i === index) {
            filters[i].className = 'selected';
        } else {
            filters[i].className = '';
        }
    }
}

function todoCount(element, todos) {
    var count = 0;
    for (var i = 0, len = todos.length; i < len; i++) {
        if (!todos[i].completed) {
            count++;
        }
    }

    if (count === 0) {
        element.innerHTML = '<strong>0</strong> items left';
    } else if (count === 1) {
        element.innerHTML = '<strong>1</strong> item left';
    } else {
        element.innerHTML = '<strong>' + count + '</strong> items left';
    }
}

function completeCount(element, todos) {
    var count = 0;
    for (var i = 0, len = todos.length; i < len; i++) {
        if (todos[i].completed) {
            count++;
        }
        
    }
    element.innerHTML = 'Clear completed (' + count + ')';
    if (count === 0) {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function footer(str, scope, element) {
    route
    .when('#/active', function () {
        label(element.querySelectorAll('#filters li a'), 1);
    })
    .when('#/completed', function () {
        label(element.querySelectorAll('#filters li a'), 2);
    })
    .others(function () {
        label(element.querySelectorAll('#filters li a'), 0);
    });
    route.nav();

    scope.onchange('todos', function () {
        todoCount(element.querySelector('#todo-count'), scope.get());
        completeCount(element.querySelector('#clear-completed'), scope.get());
    });
    todoCount(element.querySelector('#todo-count'), scope.get());
    completeCount(element.querySelector('#clear-completed'), scope.get());
}

exports = module.exports = footer;
