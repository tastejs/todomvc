define(
'views/edit_todo_view',
['Ember'],
function (Ember) {
	return Ember.TextField.extend({
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
			this.$().val(this.get('value')).focus();
		}
	});
});
