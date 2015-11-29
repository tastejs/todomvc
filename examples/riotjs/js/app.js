/*global riot */
(function () {
	'use strict';

	var STORAGE_KEY = 'todos-riotjs';

	window.todoStorage = {
		get: function () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		set: function (todos) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		}
	};

	riot.mount('todo', {
		data: todoStorage.get()
	});
})();
