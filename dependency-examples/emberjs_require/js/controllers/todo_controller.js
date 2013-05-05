define(
'controllers/todo_controller',
['Ember'],
function (Ember) {
	return Ember.ObjectController.extend({
		isEditing: false,

		editTodo: function () {
			this.set('isEditing', true);
		},

		removeTodo: function () {
			var todo = this.get('model');

			todo.deleteRecord();

			todo.get('store').commit();
		}
	});
});
