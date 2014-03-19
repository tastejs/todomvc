'use strict';

/*
 * module dependence
 */

var route = require('util.route');


function status(scope) {
    return scope.todo.status;
}

function writeView(element) {
    var t = element.className;
    element.className = t + ' editing';
    element.querySelector('.edit').focus();
}

function readView(element) {
    var t = element.className;
    element.className = t.replace(/\sediting/, '');
}

function todo(str, scope, element) {
    var editinput = element.querySelector('.edit');
    var label = element.querySelector('label');

    route
    .when('#/', function () {
        element.style.display = 'block';
    })
    .when('#/active', function () {
        var sta = status(scope);
        if (sta === 'active') {
            element.style.display = 'block';
        } else if (sta === 'completed') {
            element.style.display = 'none';
        }
    })
    .when('#/completed', function () {
        var sta = status(scope);
        if (sta === 'active') {
            element.style.display = 'none';
        } else if (sta === 'completed') {
            element.style.display = 'block';
        }
    });

    route.nav();

    //on status change
    scope.onchange('status', function () {
        route.nav();
    });

    //db click on label show writeView
    label.ondblclick = function () {
        editinput.value = scope.todo.desc;
        writeView(element);
    };

    var byEsc = false;
    var byEnter = false;

    //blur on input.edit show readView
    editinput.onblur = function () {
        if (byEsc || byEnter) { return; }
        scope.update(scope.todo, editinput.value);
        scope.apply();
        readView(element);
    };

    //when user stroke enter or esc key show readView
    editinput.onkeydown = function (event) {
        byEsc = false;
        byEnter = false;
        var enter = event.keyCode === 13 || false;
        var esc = event.keyCode === 27 || false;
        if (enter) {
            byEnter = true;
            scope.update(scope.todo, editinput.value);
            scope.apply();
            readView(element, scope);
        } else if (esc) {
            event.preventDefault();
            byEsc = true;
            readView(element, scope);
        }
    };
}

exports = module.exports = todo;

