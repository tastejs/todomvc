/// <reference path='libs/angular-1.0.d.ts' />
/// <reference path='directives/TodoFocus.ts' />
/// <reference path='directives/TodoBlur.ts' />
/// <reference path='controllers/TodoCtrl.ts' />
/// <reference path='services/TodoStorage.ts' />
'use strict';

/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
var todomvc = angular.module('todomvc', [])
        .controller('todoCtrl', TodoCtrl)
        .directive('todoBlur', () => { return new TodoBlur(); })
        .directive('todoFocus', ($timeout: ng.ITimeoutService) => { return new TodoFocus($timeout); })
        .service('todoStorage', TodoStorage)
    ;
