/*global Todos Ember */
'use strict';

Todos.EditTodoView = Ember.TextField.extend({
	classNames: ['edit'],

	valueBinding: 'todo.title',

	change: function () {
		var value = this.get('value');

		if (Ember.isEmpty(value)) {
			this.get('controller').removeTodo();
		}
	},

	focusOut: function () {
		this.set('controller.isEditing', false);
	},

	insertNewline: function () {
		this.set('controller.isEditing', false);
	},

	didInsertElement: function () {
		this.$().focus();
	}
});
