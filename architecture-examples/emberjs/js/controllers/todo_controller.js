/*global Todos, Ember */
'use strict';

Todos.TodoController = Ember.ObjectController.extend({
	isEditing: false,

	// We use the bufferedTitle to store the original value of
	// the model's title so that we can roll it back later in the
	// `cancelEditing` action.
	bufferedTitle: Ember.computed.oneWay('title'),

	actions: {
		editTodo: function () {
			this.set('isEditing', true);
		},

		doneEditing: function () {
			var bufferedTitle = this.get('bufferedTitle').trim();

			if (Ember.isEmpty(bufferedTitle)) {
				// The `doneEditing` action gets sent twice when the user hits
				// enter (once via 'insert-newline' and once via 'focus-out').
				//
				// We debounce our call to 'removeTodo' so that it only gets
				// sent once.
				Ember.run.debounce(this, this.send, 'removeTodo', 0);
			} else {
				var todo = this.get('model');
				todo.set('title', bufferedTitle);
				todo.save();
			}

			// Re-set our newly edited title to persist it's trimmed version
			this.set('bufferedTitle', bufferedTitle);
			this.set('isEditing', false);
		},

		cancelEditing: function () {
			this.set('bufferedTitle', this.get('title'));
			this.set('isEditing', false);
		},

		removeTodo: function () {
			var todo = this.get('model');

			todo.deleteRecord();
			todo.save();
		}
	}
});
