define([
	'directives/todoEscape',
	'jquery',
	'angular-mocks'
], function (todoEscapeDir, jQuery) {
	'use strict';

	beforeEach(module(todoEscapeDir));

	var triggerKeyDown = function (element, keyCode) {
		var e = jQuery.Event("keydown");
		e.keyCode = keyCode;
		element.triggerHandler(e);
	};

	describe('todoEscape directive', function () {
		var scope, compile, browser;

		beforeEach(inject(function ($rootScope, $compile, $browser) {
			scope = $rootScope.$new();
			compile = $compile;
			browser = $browser;
		}));

		it('should evaluate the expression binded to the directive', function () {
			var someValue = false,
				el = angular.element('<input todo-escape="doSomething()">');

			scope.doSomething = function () {
				someValue = !someValue;
			};

			compile(el)(scope);

			triggerKeyDown(el, 27);

			expect(someValue).toBe(true);
		});
	});
});
