(function (todo) {

	'use strict';

	todo.Model = function () {

		var storeKey = 'todos-somajs';

		return {
			get: function () {
				// get the data from the local storage
				return JSON.parse(localStorage.getItem(storeKey) || '[]');
			},
			set: function (items) {
				// set the data to the local storage
				localStorage.setItem(storeKey, JSON.stringify(items));
			},
			getActive: function () {
				// returns items that are not completed
				return this.get().filter(function (item) {
					return !item.completed;
				}).length;
			}
		};
	};

})(window.todo = window.todo || {});
