Todos.EditTodoView = Ember.TextField.extend({
	classNames: ['edit'],

  valueBinding: 'todo.title',

	change: function() {
		var value = this.get('value');

		if (Ember.isEmpty(value)) {
			var controller = this.get('controller');
			var todo = this.get('content');

			controller.removeObject(todo);
		}
	},

	focusOut: function() {
		this.set('controller.isEditing', false);
	},

	insertNewline: function() {
		this.set('controller.isEditing', false);
	},

	didInsertElement: function() {
		this.$().focus();
	}
});
