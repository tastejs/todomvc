import Ember from 'ember';

export default Ember.Component.extend({
	repo: Ember.inject.service(),
	tagName: 'li',
	editing: false,
	classNameBindings: ['todo.completed', 'editing'],

	actions: {
		startEditing() {
			this.get('onStartEdit')();
			this.set('editing', true);
			Ember.run.scheduleOnce('afterRender', this, 'focusInput');
		},

		doneEditing(e) {
			let newTitle = e.target.value.trim();
			if (Ember.isBlank(newTitle)) {
				this.send('removeTodo');
			} else if (this.get('editing')) {
				this.set('todo.title', newTitle);
				this.set('editing', false);
				this.get('onEndEdit')();
			}
		},

		handleKeydown(e) {
			if (e.keyCode === 13) {
				this.send('doneEditing', e);
			} else if (e.keyCode === 27) {
				this.set('editing', false);
			}
		},

		toggleCompleted(e) {
			let todo = this.get('todo');
			Ember.set(todo, 'completed', e.target.checked);
			this.get('repo').persist();
		},

		removeTodo() {
			this.get('repo').delete(this.get('todo'));
		}
	},

	focusInput() {
		this.element.querySelector('input.edit').focus();
	}
});
