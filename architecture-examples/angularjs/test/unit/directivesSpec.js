/*global describe, it, beforeEach, inject, expect, angular*/
(function () {
	'use strict';

	beforeEach(module('todomvc'));

	describe('todoBlur directive', function () {
		var scope, compile;

		beforeEach(inject(function ($rootScope, $compile) {
			scope = $rootScope.$new();
			compile = $compile;
		}));

		it('should $apply on blur', function () {
			var el,
				mock = {
				called: false,
				call: function () { this.called = true; }
			};

			scope.mock = mock;
			el = angular.element('<input todo-blur="mock.call()">');
			compile(el)(scope);

			el.triggerHandler('blur');
			scope.$digest();

			expect(mock.called).toBeTruthy();
		});
	});

	describe('todoFocus directive', function () {
		var scope, compile, browser;

		beforeEach(inject(function ($rootScope, $compile, $browser) {
			scope = $rootScope.$new();
			compile = $compile;
			browser = $browser;
		}));

		it('should focus on truthy expression', function () {
			var el = angular.element('<input todo-focus="focus">');
			scope.focus = false;

			compile(el)(scope);
			expect(browser.deferredFns.length).toBe(0);

			scope.$apply(function () {
				scope.focus = true;
			});

			expect(browser.deferredFns.length).toBe(1);
		});
	});
}());
