(function (window) {
	'use strict';

	window.todoapp = function() {
		return {

			// app initial state
			todos: window.todoStorage.fetch(),
			newTodoTitle: '',
			editingTodo: null,
			visibility: 'all',

			// computed properties
			get completed() {
				return this.todos.filter(function (todo) {
					return todo.completed;
				});
			},

			get active() {
				return this.todos.filter(function (todo) {
					return ! todo.completed;
				});
			},

			get filteredTodos() {
				if (this.visibility == 'active') {
					return this.active;
				}

				if (this.visibility == 'completed') {
					return this.completed;
				}

				// by default show "all" todos
				return this.todos;
			},

			// initialize
			initTodoApp: function () {
				this.$watch('todos', function (todos) {
					window.todoStorage.save(todos);
				});
				window.setUpTodoAppRouter(this);
			},

			// methods
			add: function () {
				var title = this.newTodoTitle.trim();
				if (!title) {
					return;
				}
				this.todos.push({ id:Date.now(), title: title, completed: false });
				this.newTodoTitle = '';
			},

			edit: function (todo) {
				this.cancelEdit();
				todo.editingBuffer = todo.title;
				this.editingTodo = todo;
			},

			cancelEdit: function () {
				if(!this.editingTodo) {
					return;
				}
				delete this.editingTodo.editingBuffer;
				this.editingTodo = null;
			},

			saveEdit: function () {
				var newTitle = this.editingTodo.editingBuffer.trim();

				if (!this.editingTodo) {
					return;
				}

				if (newTitle == '') {
					this.remove(this.editingTodo);
					return;
				}
				this.editingTodo.title = newTitle;
				this.cancelEdit();
			},

			remove: function (todo) {
				var index = this.todos.indexOf(todo);
				this.todos.splice(index, 1);
			},

			removeCompleted: function () {
				this.todos = this.active;
			},

			toggleAllCompleted: function () {
				if (!this.active.length) {
					this.todos.forEach(function (todo) {
						todo.completed = false;
					});
					return;
				}

				this.todos.forEach(function (todo) {
					todo.completed = true;
				});
			}
		};
	};

})(window);
