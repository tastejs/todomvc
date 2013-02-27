/*global define*/
'use strict';

/**
 * Services that persists and retrieves TODOs from localStorage.
 */
define(['app'], function (app) {
	app.factory('todoStorage', function () {
		var STORAGE_ID = 'todos-angularjs-requirejs';

		return {
			get: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			put: function (todos) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
			}
		};
	});
});
