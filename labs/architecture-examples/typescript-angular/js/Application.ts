/// <reference path='_all.ts' />

/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
module todos {
    'use strict';

    var todomvc = angular.module('todomvc', [])
            .controller('todoCtrl', TodoCtrl.prototype.injection())
            .directive('todoBlur', TodoBlur.prototype.injection())
            .directive('todoFocus', TodoFocus.prototype.injection())
            .service('todoStorage', TodoStorage.prototype.injection());
}