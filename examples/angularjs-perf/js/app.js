/* jshint undef: true, unused: true */
/*global angular */
(function () {
	'use strict';

	/**
	 * The main TodoMVC app module that pulls all dependency modules declared in same named files
	 *
	 * @type {angular.Module}
	 */
	angular.module('todomvc', ['todoCtrl', 'todoFocus', 'todoStorage']);
})();
