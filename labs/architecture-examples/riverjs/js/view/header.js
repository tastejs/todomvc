'use strict';

function header(str, scope, element) {
    var newTodo = element.querySelector('#new-todo');
    
    newTodo.onkeydown = function (event) {
        //when user hint enter, add newTodo
        if (event.keyCode === 13) {
            scope.add(newTodo.value);
            scope.apply();
            newTodo.value = '';
        }
    };
}

exports = module.exports = header;
