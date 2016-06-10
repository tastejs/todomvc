/*global TodoApp */

(function () {
	'use strict';

	TodoApp.route('get', '#/', function () {
		TodoApp.trigger('fetchTodos');
	});
})();
