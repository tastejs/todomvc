import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['todo-list'],
	tagName: 'ul',

	actions: {
		cancelEditing(todo) {
			todo.set('isEditing', false);
			todo.rollbackAttributes();
		},

		deleteTodo(todo) {
			todo.destroyRecord();
		},

		editTodo(todo) {
			todo.set('isEditing', true);

			Ember.run.schedule('afterRender', () => {
				this.$('.edit').trigger('focus');
			});
		},

		toggleTodo(todo) {
			todo.toggleProperty('isCompleted');
			todo.save();
		},

		updateTodo(todo) {
			const title = todo.get('title').trim();

			if (title) {
				todo.set('title', title);
				todo.set('isEditing', false);
				todo.save();
			} else {
				this.send('cancelEditing', todo);
			}
		}
	}
});
