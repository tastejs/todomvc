/*jshint unused:false */

(function (exports) {
	/**
	 * Data filter, change by router type
	 * @type  {Object}
	 */
	exports.Filter = {
		all: function (todos) {
			return todos;
		},
		active: function (todos) {
			return todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		completed: function (todos) {
			return todos.filter(function (todo) {
				return todo.completed;
			});
		}
	}

	/**
	 * Todos localStorage
	 * @type  {Object}
	 */
	var todoKey = 'sugar-todos';
	exports.Storage = {
		save: function (todos) {
			localStorage.setItem(todoKey, JSON.stringify(todos));
		},
		getAll: function () {
			return JSON.parse(localStorage.getItem(todoKey) || '[]');
		}
	}

})(window);
