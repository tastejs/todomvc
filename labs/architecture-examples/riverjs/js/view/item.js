'use strict';

function item(str, scope, element) {

    var cbx     = element.querySelector('.toggle'),
        edit    = element.querySelector('.edit'),
        byEnter = false,
        byEsc   = false;

    cbx.onclick = function () {
        scope.todo.completed = !scope.todo.completed;
        scope.update(scope.todo);
        scope.apply();
    };

    element.ondblclick = function () {
        element.className = element.className + ' editing';
        edit.value = scope.todo.title;
        edit.focus();
    };

    edit.onblur = function () {
        element.className = element.className.replace(/\sediting/, '');
        if (byEsc) { return; }
        scope.todo.title = this.value;
        scope.update(scope.todo);
        scope.apply();
    };

    edit.onkeydown = function (event) {
        byEnter = event.keyCode === 13;
        byEsc   = event.keyCode === 27;

        if (byEnter || byEsc) {
            element.className = element.className.replace(/\sediting/, '');
        }
    };

    var isCompleted = scope.todo.completed;
    element.className = isCompleted ? 'completed' : '';
    cbx.checked  = isCompleted ? true : false;
}


exports = module.exports = item;
