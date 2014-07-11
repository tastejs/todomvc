/*global Todos, Ember */
(function () {
	'use strict';

	Todos.TodoInputComponent = Ember.TextField.extend({
		focusOnInsert: function () {
			// Re-set input value to get rid of a reduntant text selection
			this.$().val(this.$().val());
			this.$().focus();
		}.on('didInsertElement')
	});
})();
