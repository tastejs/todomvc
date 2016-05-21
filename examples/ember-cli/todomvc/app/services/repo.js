import Ember from 'ember';

export default Ember.Service.extend({
	lastId: 0,
	data: null,
	findAll() {
		return this.get('data') ||
			this.set('data', JSON.parse(window.localStorage.getItem('todos') || '[]'));
	},

	add(attrs) {
		let todo = Object.assign({ id: this.incrementProperty('lastId') }, attrs);
		this.get('data').pushObject(todo);
		this.persist();
		return todo;
	},

	delete(todo) {
		this.get('data').removeObject(todo);
		this.persist();
	},

	persist() {
		window.localStorage.setItem('todos', JSON.stringify(this.get('data')));
	}
});
