/*global TodoApp */

(function () {
	'use strict';

	TodoApp.route('get', '#/completed', function () {
		TodoApp.trigger('fetchTodos', 'completed');
	});
})();
