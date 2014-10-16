/*global TodoApp */

(function () {
	'use strict';

	TodoApp.route('get', '#/active', function () {
		TodoApp.trigger('fetchTodos', 'active');
	});
})();
