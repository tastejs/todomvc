'use strict';

function show(element, todos) {
    if (!todos.length) {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function main(str, scope, element) {
    show(element, scope.todos);
    scope.onchange('todos', function (todos) {
        show(element, todos);
    });
}


exports = module.exports = main;
