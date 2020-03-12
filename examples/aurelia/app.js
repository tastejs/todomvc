var KNOWN_ROUTES = Object.assign(Object.create(null), {
	active: 'active',
	completed: 'completed'
});
const ENTER_KEY = 13;
const ESC_KEY = 27;
const STORAGE_NAME = 'todomvc-aurelia';

/**
 * Simple ES5 style factory fn
 */
function App() {

	var app = {
		init: function() {
			this.load();
			this.filter = '';
			this.filterVersion = 0; // This is observed by the filterTodos value converter to avoid dirty checking
			this.configureRouting();
		},

		// Simplest form of routing, for the todomvc app. Can also be done with `aurelia-router` (see https://aurelia.io/docs/routing/) for apps that use setRoot
		configureRouting: function() {
			var handleHashChange = function() {
				var fragment = location.hash;
				var filter = fragment.replace(/^#?\/?/, '');
				app.filter = KNOWN_ROUTES[filter] || '';
				if (!(filter in KNOWN_ROUTES)) {
					location.hash = '#/';
				}
			};
			handleHashChange();
			window.onhashchange = handleHashChange;
		},

		addNewTodo: function(title) {
			if (title === undefined) {
				title = this.newTodoTitle;
			}
			title = title && title.trim();
			if (!title) {
				return;
			}
	
			this.todos.push({ title: title, isCompleted: false });
	
			this.newTodoTitle = '';
			this.save();
		},

		beginEdit: function(todo) {
			todo.isEditing = true;
			todo.tempTitle = todo.title;
		},

		commitEdit: function(todo) {
			todo.title = todo.tempTitle.trim();
			todo.isEditing = false;
			this.save();
		},

		cancelEdit: function(todo) {
			todo.tempTitle = todo.title;
			todo.isEditing = false;
		},

		deleteTodo: function(todo) {
			this.todos.splice(this.todos.indexOf(todo), 1);
			this.save();
		},

		toggleTodo: function(todo) {
			todo.isCompleted = !todo.isCompleted;
			this.filterVersion++;
			this.save();
		},

		toggleAll: function() {
			const allCompleted = this.todos.every(function(todo) { return todo.isCompleted; });
			this.todos.forEach(function(todo) {
				return todo.isCompleted = !allCompleted;
			});
			this.filterVersion++;
		},

		clearCompletedTodos: function() {
			this.todos = this.todos.filter(function(todo) { return !todo.isCompleted; });
			this.save();
		},

		handleKeyup: function(todo, ev) {
			if (ev.keyCode === ENTER_KEY) {
				this.commitEdit(todo);
			} else if (ev.keyCode === ESC_KEY) {
				ev.target.blur();
			}
		},

		load: function() {
			const storageContent = localStorage.getItem(STORAGE_NAME);
			this.todos = storageContent && JSON.parse(storageContent) || [];
		},

		save: function() {
			localStorage.setItem(STORAGE_NAME, JSON.stringify(this.todos));
		}
	};

	app.init();
	return app;
}

// A value converter for filtering todos based supplied arguments (see https://aurelia.io/docs/binding/value-converters#introduction)
function FilterTodoValueConverter() {
	return {
		toView: function(todos, filter) {
			if (!Array.isArray(todos)) return [];
			if (filter === 'all' || !filter) return todos;
	
			const isCompleted = filter !== 'active';
			return todos.filter(function(todo) { return todo.isCompleted === isCompleted; });
		}
	}
}
