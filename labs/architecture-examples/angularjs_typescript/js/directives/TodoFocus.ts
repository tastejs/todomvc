/// <reference path='../libs/angular-1.0.d.ts' />
'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
 */
class TodoFocus {

    public link: ($scope: ng.IScope, elem: JQuery, attrs: any) => any;

    constructor(private $timeout: ng.ITimeoutService) {
        this.link = (s, e, a) => this.linkFn(s, e, a);
    }

    linkFn($scope: ng.IScope, elem: JQuery, attrs: any): any {
        $scope.$watch(attrs.todoFocus, (newval) => {
            if (newval) {
                this.$timeout(() => {
                    elem[0].focus();
                }, 0, false);
            }
        });
    };
}
