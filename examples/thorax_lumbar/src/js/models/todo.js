(function() {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	window.app.Todo = Thorax.Model.extend({

		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function() {
			this.save({
				completed: !this.get('completed')
			});
		},

		isVisible: function () {
			var isCompleted = this.get('completed');
			if (window.app.TodoFilter === '') {
				return true;
			} else if (window.app.TodoFilter === 'completed') {
				return isCompleted;
			} else if (window.app.TodoFilter === 'active') {
				return !isCompleted;
			}
		}

	});

}());
