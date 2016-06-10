/*global Sammy, jQuery, TodoApp */

(function (window, $) {
	'use strict';

	window.TodoApp = Sammy('#todoapp').use('Template');

	TodoApp.notFound = function () {
		this.runRoute('get', '#/');
	};

	$(function () {
		TodoApp.run('#/');
	});
})(window, jQuery);
