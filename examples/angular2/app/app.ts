import {Component} from 'angular2/core';
import {TodoStore, Todo} from './services/store';

const ENTER_KEY = 13;

@Component({
	selector: 'todo-app',
	templateUrl: 'app/app.html'
})
export default class TodoApp {
	todoStore: TodoStore;

	constructor() {
		this.todoStore = new TodoStore();
	}

	stopEditing(todo: Todo, editedTitle: string) {
		todo.title = editedTitle;
		todo.editing = false;
	}

	cancelEditingTodo(todo: Todo) {
		todo.editing = false;
	}

	updateEditingTodo(todo: Todo, editedTitle: string) {
		editedTitle = editedTitle.trim();
		todo.editing = false;

		if (editedTitle.length === 0) {
			return this.todoStore.remove(todo);
		}

		todo.title = editedTitle;
	}

	editTodo(todo: Todo) {
		todo.editing = true;
	}

	removeCompleted() {
		this.todoStore.removeCompleted();
	}

	toggleCompletion(todo: Todo) {
		this.todoStore.toggleCompletion(todo);
	}

	remove(todo: Todo){
		this.todoStore.remove(todo);
	}

	addTodo($event: KeyboardEvent, newtodo: HTMLInputElement) {
		if ($event.which === ENTER_KEY && newtodo.value.trim().length) {
			this.todoStore.add(newtodo.value);
			newtodo.value = '';
		}
	}
}
