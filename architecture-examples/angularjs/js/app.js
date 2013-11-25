/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var todomvc = angular.module('todomvc', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/overview', {
                templateUrl: 'templates/overview.html',
                controller: 'TodoCtrl'
            }).
            when('/overview/:status', {
                templateUrl: 'templates/overview.html',
                controller: 'TodoCtrl'
            }).
            otherwise({
                redirectTo: '/overview'
            });
    }]);
