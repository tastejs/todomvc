import {store, uuid} from './utils';

class TodoModel {
	constructor(key) {
		this.key = key;
		this.todos = store(key);
	}

	addTodo(title) {
		this.todos = this.todos.concat({
			id: uuid(),
			title: title,
			completed: false
		});
		store(this.key, this.todos);
	}

	toggleAll(checked) {
		this.todos = this.todos.map(
			todo => Object.assign(todo, {completed: checked})
		);
		store(this.key, this.todos);
	}

	toggle(todoToToggle) {
		this.todos = this.todos.map(
			todo => todo !== todoToToggle ? todo : Object.assign(todo, {completed: !todo.completed})
		)
		store(this.key, this.todos);
	}

	destroy(todo) {
		this.todos = this.todos.filter(candidate => candidate !== todo);
		store(this.key, this.todos);
	}

	save(todoToSave, text) {
		this.todos = this.todos.map(
			todo => todo !== todoToSave ? todo : Object.assign(todo, {title: text})
		);
		store(this.key, this.todos);
	}

	clearCompleted() {
		this.todos = this.todos.filter(todo => !todo.completed);
		store(this.key, this.todos);
	}
}

export default TodoModel;
