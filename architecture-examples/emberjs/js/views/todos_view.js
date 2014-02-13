/*global Todos, Ember */
(function () {
	'use strict';

	Todos.TodosView = Ember.View.extend({
		focusInput: function () {
			this.$('#new-todo').focus();
		}.on('didInsertElement')
	});
})();
