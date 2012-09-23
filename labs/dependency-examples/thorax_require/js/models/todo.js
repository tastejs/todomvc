define([
	'underscore',
	'backbone',
	'common'
], function( _, Backbone, Common ) {

	return Backbone.Model.extend({

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
			if (Common.TodoFilter === '') {
				return true;
			} else if (Common.TodoFilter === 'completed') {
				return isCompleted;
			} else if (Common.TodoFilter === 'active') {
				return !isCompleted;
			}
		}

	});

});
