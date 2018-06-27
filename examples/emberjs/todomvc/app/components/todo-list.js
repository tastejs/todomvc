import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { set } from '@ember/object';

export default Component.extend({
	repo: service(),
	tagName: 'section',
	elementId: 'main',
	canToggle: true,
	allCompleted: computed('todos.@each.completed', function () {
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
			this.get('todos').forEach(todo => set(todo, 'completed', !allCompleted));
			this.get('repo').persist();
		}
	}
});
