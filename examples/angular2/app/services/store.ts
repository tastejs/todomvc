export class Todo {
	completed: Boolean;
	editing: Boolean;
	title: String;

	setTitle(title: String) {
		this.title = title.trim();
	}

	constructor(title: String) {
		this.completed = false;
		this.editing = false;
		this.title = title.trim();
	}
}

export class TodoStore {
	todos: Array<Todo>;

	constructor() {
		let persistedTodos = JSON.parse(localStorage.getItem('angular2-todos') || '[]');
		// Normalize back into classes
		this.todos = persistedTodos.map( (todo: {title: String, completed: Boolean}) => {
			let ret = new Todo(todo.title);
			ret.completed = todo.completed;
			return ret;
		});
	}

	_updateStore() {
		localStorage.setItem('angular2-todos', JSON.stringify(this.todos));
	}

	get(state: {completed: Boolean}) {
		return this.todos.filter((todo: Todo) => todo.completed === state.completed);
	}

	allCompleted() {
		return this.todos.length === this.getCompleted().length;
	}

	setAllTo(toggler) {
		this.todos.forEach((t: Todo) => t.completed = toggler.checked);
		this._updateStore();
	}

	removeCompleted() {
		this.todos = this.get({completed: false});
	}

	getRemaining() {
		return this.get({completed: false});
	}

	getCompleted() {
		return this.get({completed: true});
	}

	toggleCompletion(todo: Todo) {
		todo.completed = !todo.completed;
		this._updateStore();
	}

	remove(todo: Todo) {
		this.todos.splice(this.todos.indexOf(todo), 1);
		this._updateStore();
	}

	add(title: String) {
		this.todos.push(new Todo(title));
		this._updateStore();
	}
}
