/*global Sugar, Filter, Storage */

(function (exports, filter, storage) {
	/**
	 * TodoMVC app define
	 */
	var TodoMVC = Sugar.Component.extend({
		init: function (config) {
			var allTodos = storage.getAll();

			config = this.cover(config, {
				target: '.todoapp',
				model: {
					type: 'all',
					todos: [],
					newTodo: '',
					allTodos: allTodos,
					toggleAll: allTodos.length === filter.completed(allTodos).length,
					editingTodo: null
				},
				methods: {
					addTodo: this.addTodo,
					editTodo: this.editTodo,
					doneEdit: this.doneEdit,
					cancelEdit: this.cancelEdit,
					removeTodo: this.removeTodo,
					clearCompleted: this.clearCompleted
				},
				computed: {
					left: function computedLeft() {
						return filter.active(this.allTodos).length;
					},
					showClear: function computedShowClear() {
						return filter.completed(this.allTodos).length > 0;
					}
				},
				customs: {
					// make edit-input get focus
					// define custom directive refresh function
					focus: function focusEdit(editing) {
						if (editing) {
							this.el.focus();
						}
					}
				}
			});
			this.ready = true;
			this.Super('init', arguments);
		},

		afterRender: function () {
			// watch for `toggleAll` manual change
			// by the `allTodos` change, `toggleAll` will be updated checking-all
			this.vm.watch('toggleAll', function (checked) {
				if (!this.$checking) {
					this.vm.get('todos').forEach(function (todo) {
						todo.completed = checked;
					});
				}
			});

			// watch for `allTodos` deep change
			this.vm.watch('allTodos', function () {
				var data = this.vm.$data
				var allTodos = data.allTodos;

				// check checking status for `toggleAll`
				this.$checking = true;
				data.toggleAll = filter.active(allTodos).length === 0;
				this.$checking = false;

				if (this.ready) {
					this.updateList();
				}

				storage.save(allTodos);
			}, true);

			// watch for `type` change
			this.vm.watch('type', this.updateList);

			// build init for list data
			this.updateList();
		},

		/**
		 * update shown list
		 */
		updateList: function () {
			var data = this.vm.$data;
			data.todos = filter[data.type](data.allTodos);
		},

		/**
		 * add a todo by press enter
		 */
		addTodo: function () {
			var data = this.vm.$data;
			var todo = data.newTodo.trim();

			if (!todo) {
				return;
			}

			data.newTodo = '';
			data.allTodos.push({
				title: todo,
				completed: false
			});
		},

		/**
		 * double click todo label to edit
		 * @param   {Object}  todo
		 */
		editTodo: function (todo) {
			this.ready = false;
			this.titleCache = todo.title;
			this.vm.$data.editingTodo = todo;
		},

		/**
		 * complete edit, event `blur` or press enter
		 * @param   {Object}  todo
		 */
		doneEdit: function (todo) {
			var data = this.vm.$data;

			data.editingTodo = null;

			// remove it if it's empty
			if (!todo.title.trim()) {
				this.removeTodo(todo);
			}

			// sign for update
			this.ready = true;
		},

		/**
		 * cancel edit a todo, press esc
		 * @param   {Object}  todo
		 */
		cancelEdit: function (todo) {
			this.vm.$data.editingTodo = null;
			todo.title = this.titleCache;
		},

		/**
		 * remove a todo
		 * @param   {Object}  todo
		 */
		removeTodo: function (todo) {
			this.vm.get('allTodos').$remove(todo);
		},

		/**
		 * clear completed todos
		 */
		clearCompleted: function () {
			var data = this.vm.$data;
			data.allTodos = filter.active(data.allTodos);
		}
	});

	/**
	 * Create todomvc instance.
	 * @type  {Object}
	 */
	exports.todoMVC = Sugar.core.create('todoMVC', TodoMVC);

})(window, Filter, Storage);
