'use strict';

function main(str, scope, element) {
    scope.onchange('todos', function (todos) {
        if (!todos.length) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
        }
    });
}

exports = module.exports = main;
