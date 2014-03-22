'use strict';

var route = require('util.route');

function highlightNavigator(filters, index) {
    for (var i = 0, len = filters.length; i < len; i++) {
        if (i === index) {
            filters[i].className = 'selected';
        } else {
            filters[i].className = '';
        }
    }
}

function todoCount(element, count) {
    if (count === 0) {
        element.innerHTML = '<strong>0</strong> items left';
    } else if (count === 1) {
        element.innerHTML = '<strong>1</strong> item left';
    } else {
        element.innerHTML = '<strong>' + count + '</strong> items left';
    }
}

function completeCount(element, count) {
    element.innerHTML = 'Clear completed (' + count + ')';
    if (count === 0) {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function hideFooter(element, scope) {
    if (!scope.get().length) {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function footer(str, scope, element) {
    var tc = element.querySelector('#todo-count');
    var cc = element.querySelector('#clear-completed');
    var navs = element.querySelectorAll('#filters li a');

    todoCount(tc, scope.getTodoCount());
    completeCount(cc, scope.getCompleteCount());
    hideFooter(element, scope);

    route
    .when('#/active', function () {
        highlightNavigator(navs, 1);
    })
    .when('#/completed', function () {
        highlightNavigator(navs, 2);
    })
    .others(function () {
        highlightNavigator(navs, 0);
    });
    route.nav();

    scope.onchange(function () {
        todoCount(tc, scope.getTodoCount());
        completeCount(cc, scope.getCompleteCount());
        hideFooter(element, scope);
    });
}

exports = module.exports = footer;
