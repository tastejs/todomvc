/*global Todos Ember */
'use strict';

Todos.TodoView = Ember.View.extend({
	tagName: 'li',
	classNameBindings: [
		'todo.isCompleted:completed',
		'isEditing:editing'
	],
	doubleClick: function () {
		this.set('isEditing', true);
	}
});
