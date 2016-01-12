import Ember from 'ember';

export default Ember.Service.extend({
	lastId: 0,
	findAll() {
		if (this.data) {
			return this.data;
		} else {
			return this.data = JSON.parse(window.localStorage.getItem('todos') || '[]');
		}
	},

	add(attrs) {
		let todo = this.data.pushObject(Object.assign({ id: this.incrementProperty('lastId') }, attrs));
		this.persist();
		return todo;
	},

	delete(todo) {
		this.data.removeObject(todo);
		this.persist();
	},

	persist() {
		window.localStorage.setItem('todos', JSON.stringify(this.data));
	}
});
