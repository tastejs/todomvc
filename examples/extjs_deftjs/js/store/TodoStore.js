/**
* A persistent collection of To-Do models.
*/
Ext.define('TodoDeftJS.store.TodoStore', {
	extend: 'Ext.data.Store',
	requires: ['TodoDeftJS.model.Todo'],

	model: 'TodoDeftJS.model.Todo',
	autoLoad: true,
	autoSync: true,

	proxy: {
		type: 'localstorage',
		id: 'todos-deftjs'
	},

	completedCount: function () {
		var numberComplete;
		numberComplete = 0;

		this.each(function (todo) {
			if (todo.get('completed')) {
				return numberComplete++;
			}
		});

		return numberComplete;
	},

	incompleteCount: function () {
		var numberInomplete;
		numberInomplete = 0;

		this.each(function (todo) {
			if (!todo.get('completed')) {
				return numberInomplete++;
			}
		});

		return numberInomplete;
	},

	findEditingTodo: function () {
		var editingTodo;
		editingTodo = null;

		this.each(function (todo) {
			if (todo.get('editing')) {
				editingTodo = todo;
				return false;
			}
		});

		return editingTodo;
	},

	toggleAllCompleted: function (isCompleted) {
		this.each(function (todo) {
			return todo.set('completed', isCompleted);
		});
	},

	deleteCompleted: function () {
		var removedTodos;
		removedTodos = [];

		this.each(function (todo) {
			if (todo.get('completed')) {
				return removedTodos.push(todo);
			}
		});

		if (removedTodos.length) {
			this.remove(removedTodos);
		}
	}

});