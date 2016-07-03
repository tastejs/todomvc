import Ember from 'ember';

export default Ember.Component.extend({
	repo: Ember.inject.service(),
	tagName: 'section',
	elementId: 'main',
	canToggle: true,
	allCompleted: Ember.computed('todos.@each.completed', function () {
		return this.get('todos').isEvery('completed');
	}),

	actions: {
		enableToggle() {
			this.set('canToggle', true);
		},

		disableToggle() {
			this.set('canToggle', false);
		},

		toggleAll() {
			let allCompleted = this.get('allCompleted');
			this.get('todos').forEach(todo => Ember.set(todo, 'completed', !allCompleted));
			this.get('repo').persist();
		}
	}
});
