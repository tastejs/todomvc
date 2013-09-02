/*global Todos Ember */
'use strict';

Todos.EditTodoView = Ember.TextField.extend({
	classNames: ['edit'],

	change: function () {
		var value = this.get('value');

		if (Ember.isEmpty(value)) {
      Ember.run.next(this, function(){
        this.get('controller').send('removeTodo');
      });
		}
	},

	focusOut: function () {
    this.get('controller').send('endEditing');
	},

	insertNewline: function () {
    this.get('controller').send('endEditing');
	},

	focusTodo: function () {
		this.$().focus();
	}.on('didInsertElement')
});
