/* global nx, localStorage */

(function () {
	'use strict';

	function setup(elem, state, next) {
		state.status = state.status || 'all';
		state.todos = {
			all: JSON.parse(localStorage.getItem('todos-nx')) || [],
			get completed() {
				return this.all.filter(todo => todo.completed);
			},
			get active() {
				return this.all.filter(todo => !todo.completed);
			},
			get allCompleted() {
				return this.all.every(todo => todo.completed);
			},
			set allCompleted(value) {
				if (value) {
					this.all.forEach(todo => todo.completed = true);
				} else {
					this.all.forEach(todo => todo.completed = false);
				}
			},
			create(event) {
				const title = event.target.value.trim();
				if (title) {
					this.all.push({title});
				}
				event.target.value = '';
			},
			edit(todo, event) {
				todo.title = event.target.value.trim();
				if (!todo.title) {
					state.todos.remove(todo);
				}
				todo.editing = false;
			},
			remove(todo) {
				const index = this.all.indexOf(todo);
				this.all.splice(index, 1);
			},
			clearCompleted() {
				this.all = this.active;
			},
			toJSON() {
				return this.all.map(todo => ({title: todo.title, completed: todo.completed}));
			}
		};

		elem.$observe(() => localStorage.setItem('todos-nx', JSON.stringify(state.todos)));

		return next();
	}

	nx.components.app()
		.use(nx.middlewares.params({
			status: { type: 'string', history: true }
		}))
		.use(setup)
		.register('todo-app');
})();
