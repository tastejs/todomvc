/// <reference path='_all.ts' />

/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
module todos {

    var module: ng.IModule = angular.module('todomvc', [
        'ngRoute'
    ]).config(['$locationProvider', ($locationProvider: ng.ILocationProvider) => {
        $locationProvider.hashPrefix('!');
    }]);

}
