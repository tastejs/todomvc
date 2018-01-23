/* jshint undef: true, unused: true */
/*global angular */
(function () {
	'use strict';

	angular.module('todoStorage', [])

	/**
	 * Services that persists and retrieves TODOs from localStorage
	*/
	.factory('todoStorage', function () {
		var STORAGE_ID = 'todos-angularjs-expr';

		return {
			get: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			put: function (todos) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
			}
		};
	});
})();
