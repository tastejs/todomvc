/// <reference path='../_all.ts' />

module todos {
    'use strict';
    
    /**
     * Directive that executes an expression when the element it is applied to loses focus.
     */
    export class TodoBlur {
        public link: ($scope: ng.IScope, element: JQuery, attributes: any) => any;

        public injection(): any[] {
            return [
                () => { return new TodoBlur(); }
            ]
        }

        constructor() {
            this.link = ($scope, element, attributes) => this.linkFn($scope, element, attributes);
        }

        linkFn($scope: ng.IScope, element: JQuery, attributes: any): any {
            element.bind('blur', () => {
                $scope.$apply(attributes.todoBlur);
            });
        };
    }
}