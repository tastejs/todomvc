/*global define */
define(function () {
	'use strict';

	return function (todo) {
		todo.text = todo.text && todo.text.trim() || '';
		todo.complete = !!todo.complete;

		return todo;
	};
});
