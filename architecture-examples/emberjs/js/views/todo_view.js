Todos.TodoView = Ember.View.extend({
	tagName: 'li',
	classNameBindings: ['todo.isCompleted:completed', 'isEditing:editing'],

	doubleClick: function(event) {
		this.set('isEditing', true);
	}
});
