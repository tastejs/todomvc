import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
	repo: service(),
	tagName: 'section',
	classNames: ['main'],
	canToggle: true,
	allCompleted: computed('todos.@each.completed', function () {
		return this.todos.isEvery('completed');
	}),

	actions: {
		enableToggle() {
			this.set('canToggle', true);
		},

		disableToggle() {
			this.set('canToggle', false);
		},

		toggleAll() {
			let allCompleted = this.allCompleted;
			this.todos.forEach(todo => set(todo, 'completed', !allCompleted));
			this.repo.persist();
		}
	}
});
