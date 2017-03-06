/*global angular */

// 'IIFE' method is what i use in most of my js files (cf. example in this one)
// Here the function is written...
(function() {

	/**
	 * The main TodoMVC app module
	 *
	 * @type {angular.Module}
	 */
	angular.module('todomvc', ['ngRoute', 'ngResource'])
		.config(function ($routeProvider) {
			'use strict';

			var routeConfig = {
				// Here I name the controller so it's easier to find in html files
				// NB: usually i use the $ctrl variable but in this version of angular it doesn't seem to work
				controller: 'TodoCtrl as vm',
				templateUrl: 'todomvc-index.html',
				resolve: {
					// I prefer to use named functions to detect bugs faster
					store: function getStorage(todoStorage) {
						// Get the correct module (API or localStorage).
						return todoStorage.then(function (module) {
							module.get(); // Fetch the todo records in the background.
							return module;
						});
					}
				}
			};

			$routeProvider
				.when('/', routeConfig)
				.when('/:status', routeConfig)
				.otherwise({
					redirectTo: '/'
				});


		});
// ... and here it is executed
})();
