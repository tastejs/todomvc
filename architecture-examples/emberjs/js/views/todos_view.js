/*global Todos, Ember */
'use strict';

Todos.TodosView = Ember.View.extend({
	focusInput: function () {
		this.$('#new-todo').focus();
	}.on('didInsertElement')
});
