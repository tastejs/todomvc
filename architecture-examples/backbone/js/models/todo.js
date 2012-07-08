(function() {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	window.app.Todo = Backbone.Model.extend({

		// Default attributes for the todo.
		defaults: {
			title: "empty todo...",
			completed: false
		},

		// Ensure that each todo created has `title`.
		initialize: function() {
			if (!this.get("title")) {
				this.set({"title": this.defaults.title});
			}
		},

		// Toggle the `completed` state of this todo item.
		toggle: function() {
			this.save({completed: !this.get("completed")});
		},

		// Remove this Todo from *localStorage* and delete its view.
		clear: function() {
			this.destroy();
		}

	});


})();