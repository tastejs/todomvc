'use strict';

function header(str, scope, element) {
    var newtodo = element.querySelector('#new-todo');

    newtodo.onkeypress = function (event) {
        if (event.keyCode === 13) {
            scope.add(newtodo.value);
            scope.apply();
            newtodo.value = '';
        }
    };
}

exports = module.exports = header;
