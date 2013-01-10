/// <reference path='../_all.ts' />

module todos {
    'use strict';

    /**
     * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
     */
    export class TodoFocus {

        public link: ($scope: ng.IScope, element: JQuery, attributes: any) => any;

        public injection(): any[] {
            return [
                '$timeout',
                ($timeout) => { return new TodoFocus($timeout); }
            ]
        }

        constructor(private $timeout: ng.ITimeoutService) {
            this.link = ($scope, element, attributes) => this.linkFn($scope, element, attributes);
        }

        linkFn($scope: ng.IScope, element: JQuery, attributes: any): any {
            $scope.$watch(attributes.todoFocus, (newval) => {
                if (newval) {
                    this.$timeout(() => {
                        element[0].focus();
                    }, 0, false);
                }
            });
        };
    }
}