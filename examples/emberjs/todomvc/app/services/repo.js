import Service from '@ember/service';

export default Service.extend({
	lastId: 0,
	data: null,
	findAll() {
		return this.data ||
			this.set('data', JSON.parse(window.localStorage.getItem('todos') || '[]'));
	},

	add(attrs) {
		let todo = Object.assign({ id: this.incrementProperty('lastId') }, attrs);
		this.data.pushObject(todo);
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
