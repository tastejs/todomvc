/* jshint undef: true, unused: true */
/*global angular */
(function () {
	'use strict';

	angular.module('todoImportDirective', [])

	/**
	 * Directive to import a service by name and make it available on the directive scope
	 */
	.directive('todoImport', function ($injector) {
		return function (scope, elem, attrs) {
			var serviceName = attrs.service;
			scope[serviceName] = $injector.get(serviceName);
		};
	});
})();
