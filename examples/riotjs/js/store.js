/*global riot, constants */
(function (exports) {
	'use strict';

	/**
	 * Todo Object struct
	 * @private
	 */
	const TODO_STRUCT = Object.seal({
		title: '',
		isVisible: true,
		isCompleted: false,
		isEditing: false
	});

	exports.store = Object.seal(riot.observable({

		/**
		 * Items collection, the initial state will be fetched from the local storage
		 */
		todos: JSON.parse(localStorage.getItem(constants.STORAGE_KEY) || '[]'),

		/**
		 * Filter the todos
		 * @param {string} filterId - either 'completed' 'active' or 'all'
		 * @returns {store} self
		 */
		filter(filterId) {
			const showAll = filterId === 'all';

			if (filterId) {
				this.todos.forEach(todo => {
					todo.isVisible = showAll ? true : filterId === 'completed' ? todo.isCompleted : !todo.isCompleted;
				});
			}

			this
				.trigger('todos:filtered', filterId)
				.trigger('todos:updated')
				.save();

			return this;
		},

		/**
		 * Add a todo item
		 * @param {object} todo
		 * @param {object} todo.title - the title value of the todo item
		 * @returns {store} self
		 */
		add(todo) {
			const newTodo = Object.seal(
				Object.assign({}, TODO_STRUCT, todo)
			);

			this.todos.push(newTodo);

			this
				.trigger('todo:added', newTodo)
				.trigger('todos:updated')
				.save();

			return this;
		},

		/**
		 * Remove a todo item from the collection
		 * @param   {object} todo - item we want to remove
		 * @returns {store} self
		 */
		remove(todo) {
			if (this.todos.includes(todo)) {
				this.todos.splice(this.todos.indexOf(todo), 1);
			}

			this
				.trigger('todo:removed', todo)
				.trigger('todos:updated')
				.save();

			return this;
		},

		/**
		 * Update a single property for a single todo item
		 * @param   {object} todo - todo object we want to update
		 * @param {object} props - attributes to update
		 * @returns {store} self
		 */
		updateTodo(todo, props) {
			if (this.todos.includes(todo)) {
				Object.assign(todo, props);
				this
					.trigger('todo:updated', todo)
					.trigger('todos:updated')
					.save();
			}

			return this;
		},

		/**
		 * Update a single property for all the todo items
		 * @param {object} props - attributes to update
		 * @returns {store} self
		 */
		updateAll(props) {
			this.todos.forEach(todo => {
				Object.assign(todo, props);
			});

			this.trigger('todos:updated').save();

			return this;
		},

		/**
		 * Remove only the completed todo items
		 * @returns {store} self
		 */
		removeCompleted() {
			this.todos = this.todos.filter(todo => !todo.isCompleted);

			this.trigger('todos:updated').save();

			return this;
		},

		/**
		 * Save the items in the localStorage
		 * @returns {store} self
		 */
		save() {
			localStorage.setItem(constants.STORAGE_KEY, JSON.stringify(this.todos));

			this.trigger('todos:saved');

			return this;
		}
	}));
})(window);
