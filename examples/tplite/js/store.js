(function (exports) {

	'use strict';

	var STORAGE_KEY = 'todos-tplite';

	exports.todoStorage = {
		fetch: function () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function (todos) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		}
	};

})(window);
