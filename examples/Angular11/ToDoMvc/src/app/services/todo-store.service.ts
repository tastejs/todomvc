import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoStoreService {

  public todos: Array<Todo>;

	constructor() {
		let persistedTodos = JSON.parse(localStorage.getItem('angular11-todos') || '[]');
		// Normalize back into classes
		this.todos = persistedTodos.map( (todo: {_title: String, completed: boolean}) => {
			let ret:Todo = new Todo(todo._title);
			ret.completed = todo.completed;
			return ret;
		});
	}

	private updateStore() {
		localStorage.setItem('angular11-todos', JSON.stringify(this.todos));
	}

	private getWithCompleted(completed: Boolean) {
		return this.todos.filter((todo: Todo) => todo.completed === completed);
	}

	allCompleted() {
		return this.todos.length === this.getCompleted().length;
	}

	setAllTo(completed: boolean) {
		this.todos.forEach((t: Todo) => t.completed = completed);
		this.updateStore();
	}

	removeCompleted() {
		this.todos = this.getWithCompleted(false);
		this.updateStore();
	}

	getRemaining() {
		return this.getWithCompleted(false);
	}

	getCompleted() {
		return this.getWithCompleted(true);
	}

	toggleCompletion(todo: Todo) {
		todo.completed = !todo.completed;
		this.updateStore();
	}

	remove(todo: Todo) {
		this.todos.splice(this.todos.indexOf(todo), 1);
		this.updateStore();
	}

	add(title: String) {
		this.todos.push(new Todo(title));
		this.updateStore();
	}
}
