'use strict';

function toggleAllButton(tall, scope) {
    var todos = scope.get();
    var completedCount = scope.getCompleteCount();

    tall.checked = todos.length === completedCount ? true : false;
}

function hideMain(element, todos) {
    if (!todos.length) {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function main(str, scope, element) {

    var tall = element.querySelector('#toggle-all');
    toggleAllButton(tall, scope);
    hideMain(element, scope.todos);

    tall.onclick = function () {
        scope.toggleAll();
        scope.apply();
    };

    scope.onchange('todos', function (todos) {
        hideMain(element, todos);
        toggleAllButton(tall, scope);
    });
}



exports = module.exports = main;
