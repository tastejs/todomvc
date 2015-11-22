/*global angular */

/**
 * The main MVC app module
 *
 * @type {angular.Module}
 */
angular.module('tasker', [
	'ngRoute',
	'ngResource',
	'ngAnimate',
	'firebase'
])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'JobCtrl',
			templateUrl: 'job-new.html'
		};

		var landingConfig = {
			controller: 'JobCtrl',
			templateUrl: 'landing.html'
		};

		var jobsConfig = {
			controller: 'JobCtrl',
			templateUrl: 'joblist.html'
		};

		$routeProvider
			.when('/', landingConfig)
			.when('/jobs', jobsConfig)
			.when('/job/new', routeConfig)
			.when('/test', {
				controller: 'TestCtrl',
				templateUrl: 'test.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
