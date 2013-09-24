/*global Todos, Ember */
'use strict';

Todos.EditTodoView = Ember.TextField.extend({
	focusOnInsert: function () {
		this.$().focus();
	}.on('didInsertElement')
});

Ember.Handlebars.helper('edit-todo', Todos.EditTodoView);
