import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		clearCompleted(completed) {
			completed.invoke('deleteRecord');
			completed.invoke('save');
		},

		toggleAll(savedTodos, allCompleted) {
			savedTodos.setEach('isCompleted', !allCompleted);
			savedTodos.invoke('save');
		}
	},

	allCompleted: Ember.computed('savedTodos.@each.isCompleted', {
		get() {
			return this.get('savedTodos').isEvery('isCompleted');
		}
	}),

	completed: Ember.computed.filterBy('model', 'isCompleted', true),
	remaining: Ember.computed.filterBy('model', 'isCompleted', false),
	savedTodos: Ember.computed.filterBy('model', 'isNew', false)
});
