/// <reference path='../libs/angular-1.0.d.ts' />
'use strict';


/**
 * Directive that executes an expression when the element it is applied to loses focus.
 */
class TodoBlur {
    public link: ($scope: ng.IScope, elem: JQuery, attrs: any) => any;

    constructor() {
        this.link = (s, e, a) => this.linkFn(s, e, a);
    }

    linkFn($scope: ng.IScope, elem: JQuery, attrs: any): any {
        elem.bind('blur', () => {
            $scope.$apply(attrs.todoBlur);
        });
    };
}
