/* jshint undef: true, unused: true */
/*global angular */

/*
 * Line below lets us save `this` as `TC`
 * to make properties look exactly the same as in the template
 */
//jscs:disable safeContextKeyword
(function () {
	'use strict';

	angular.module('todoCtrl', [])

	/**
	 * The main controller for the app. The controller:
	 * - retrieves and persists the model via the todoStorage service
	 * - exposes the model to the template and provides event handlers
	 */
	.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage) {
		var TC = this;
		var todos = TC.todos = todoStorage.get();

		// 3rd argument `true` for deep object watching
		$scope.$watch('TC.todos', function () {
			todoStorage.put(todos);
		}, true);
	});
})();
//jscs:enable
