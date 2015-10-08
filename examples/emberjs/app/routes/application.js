import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		createTodo(newTodo) {
			const title = newTodo.get('title').trim();

			if (title) {
				newTodo.set('title', title);
				newTodo.save().then(() => this.refresh());
			}
		}
	},

	model() {
		return this.store.createRecord('todo');
	}
});
