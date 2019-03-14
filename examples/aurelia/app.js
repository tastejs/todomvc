const KNOWN_ROUTES = Object.assign(Object.create(null), {
	active: 'active',
	completed: 'completed'
});
const ENTER_KEY = 13;
const ESC_KEY = 27;
const STORAGE_NAME = 'todomvc-aurelia';

export class App {

	constructor() {
		this.load();
		this.filter = '';
		this.filterVersion = 0; // This is observed by the filterTodos value converter to avoid dirty checking
		this.configureRouting();
	}

	// Simplest form of routing, for the todomvc app. Can also be done with `aurelia-router` (see https://aurelia.io/docs/routing/) for apps that use setRoot
	configureRouting() {
		const handleHashChange = () => {
			const fragment = location.hash;
			const filter = fragment.replace(/^#?\/?/, '');
			this.filter = KNOWN_ROUTES[filter] || '';
			if (!(filter in KNOWN_ROUTES)) {
				location.hash = '#/';
			}
		};
		handleHashChange();
		window.onhashchange = handleHashChange;
	}

	addNewTodo(title = this.newTodoTitle) {
		if (title === undefined) {
			return;
		}

		title = title.trim();
		if (title.length === 0) {
			return;
		}

		this.todos.push({ title });

		this.newTodoTitle = '';
		this.save();
	}

	beginEdit(todo) {
		todo.isEditing = true;
		todo.tempTitle = todo.title;
	}

	commitEdit(todo) {
		todo.title = todo.tempTitle.trim();
		todo.isEditing = false;
		this.save();
	}

	cancelEdit(todo) {
		todo.tempTitle = todo.title;
		todo.isEditing = false;
	}

	deleteTodo(todo) {
		this.todos.splice(this.todos.indexOf(todo), 1);
		this.save();
	}

	toggleTodo(todo) {
		todo.isCompleted = !todo.isCompleted;
		this.filterVersion++;
		this.save();
	}

	toggleAll() {
		const allCompleted = this.todos.every(todo => todo.isCompleted);
		this.todos.forEach(todo => {
			todo.isCompleted = allCompleted ? false : true;
		});
		this.filterVersion++;
	}

	clearCompletedTodos() {
		this.todos = this.todos.filter(todo => !todo.isCompleted);
		this.save();
	}

	onKeyUpTodo(todo, ev) {
		if (ev.keyCode === ENTER_KEY) {
			this.commitEdit(todo);
		}
		if (ev.keyCode === ESC_KEY) {
			ev.target.blur();
		}
	}

	load() {
		const storageContent = localStorage.getItem(STORAGE_NAME);
		this.todos = storageContent === null ? [] : JSON.parse(storageContent);
	}

	save() {
		localStorage.setItem(STORAGE_NAME, JSON.stringify(this.todos));
	}
}

// A value converter for filtering todos based supplied arguments (see https://aurelia.io/docs/binding/value-converters#introduction)
export class FilterTodoValueConverter {
	toView(todos, filter) {
		if (!Array.isArray(todos)) return [];
		if (filter === 'all' || !filter) return todos;

		const isCompleted = filter !== 'active';
		return todos.filter(todo => todo.isCompleted === isCompleted);
	}
}
