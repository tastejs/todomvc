"use strict";
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * Directive that executes an expression when the element it is applied to loses focus.
     */
    function todoBlur() {
        return {
            link: ($scope, element, attributes) => {
                element.bind('blur', () => { $scope.$apply(attributes.todoBlur); });
                $scope.$on('$destroy', () => { element.unbind('blur'); });
            }
        };
    }
    todos.todoBlur = todoBlur;
})(todos || (todos = {}));
