import Ember from 'ember';

export default Ember.Controller.extend({
	repo: Ember.inject.service(),
	remaining: Ember.computed.filterBy('model', 'completed', false),
	completed: Ember.computed.filterBy('model', 'completed'),
	actions: {
		createTodo(e) {
			if (e.keyCode === 13 && !Ember.isBlank(e.target.value)) {
				this.get('repo').add({ title: e.target.value.trim(), completed: false });
				e.target.value = '';
			}
		},

		clearCompleted() {
			this.get('model').removeObjects(this.get('completed'));
			this.get('repo').persist();
		}
	}
});
