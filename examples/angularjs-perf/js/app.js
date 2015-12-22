/*global angular */
/*jshint unused:false */
(function () {
	'use strict';

	/**
	 * The main TodoMVC app module that pulls all dependency modules declared in same named files
	 *
	 * @type {angular.Module}
	 */
	angular.module('todomvc', ['todoCtrl', 'todoEscape', 'todoFocus', 'todoStorage']);
})();
