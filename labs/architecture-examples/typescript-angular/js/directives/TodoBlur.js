/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';

    /**
    * Directive that executes an expression when the element it is applied to loses focus.
    */
    function todoBlur() {
        return {
            link: function ($scope, element, attributes) {
                element.bind('blur', function () {
                    $scope.$apply(attributes.todoBlur);
                });
            }
        };
    }
    todos.todoBlur = todoBlur;
})(todos || (todos = {}));
