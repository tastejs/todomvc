(function (exports) {
	/**
	 * data filter, change by router type
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
	 * todos localStorage
	 * @type  {Object}
	 */
	exports.Storage = {
		save: function (todos) {
			localStorage.setItem('TODOS', JSON.stringify(todos));
		},
		getAll: function () {
			return JSON.parse(localStorage.getItem('TODOS') || '[]');
		}
	}

})(window);