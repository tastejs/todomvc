'use strict';

/*
 * module dependence
 */

var route = require('util.route'),
    active = 'selected';


function clear(btns) {
    for (var i = 0, len = btns.length; i < len; i++) {
        btns[i].className = '';
    }
}

function show(element, todos) {
    if (!todos.length) {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function completnum(element, num) {

    var btn = element.querySelector('#clear-completed');
    if (num > 0) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
}

function activenum(element, len) {
    var todocont = element.querySelector('#todo-count');
    if (len > 1) {
        todocont.innerHTML = '<strong>' + len + '</strong> items left';
    } else if (len === 1) {
        todocont.innerHTML = '<strong>1</strong> item left';
    } else if (len === 0) {
        todocont.innerHTML = '<strong>0</strong> items left';
    }
}

function footer(str, scope, element) {
    show(element, scope.todos);
    completnum(element, scope.completednum, scope.todos.length);
    activenum(element, scope.activenum);

    scope.onchange('todos', function (todos) {
        show(element, todos);
    });

    scope.onchange('completednum', function (value) {
        completnum(element, value, scope.todos.length);
    });

    scope.onchange('activenum', function (value) {
        activenum(element, value);
    });

    route
    .when('#/', function () {
        var btns = element.querySelectorAll('#filters a');
        clear(btns);
        btns[0].className = active;
    })
    .when('#/active', function () {
        var btns = element.querySelectorAll('#filters a');
        clear(btns);
        btns[1].className = active;
    })
    .when('#/completed', function () {
        var btns = element.querySelectorAll('#filters a');
        clear(btns);
        btns[2].className = active;
    });
    route.nav();
}


exports = module.exports = footer;
