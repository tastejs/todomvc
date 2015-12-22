import {Component} from 'angular2/core';
import {TodoStore, Todo} from './services/store';

const ESC_KEY = 27;
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

	stopEditing(todo: Todo, editedTitle) {
		todo.setTitle(editedTitle.value);
		todo.editing = false;
	}

	cancelEditingTodo(todo: Todo) {
		todo.editing = false;
	}

	updateEditingTodo(editedTitle, todo: Todo) {
		editedTitle = editedTitle.value.trim();
		todo.editing = false;

		if (editedTitle.length === 0) {
			return this.todoStore.remove(todo);
		}

		todo.setTitle(editedTitle);
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

	addTodo($event, newtodo) {
		if ($event.which === ENTER_KEY && newtodo.value.trim().length) {
			this.todoStore.add(newtodo.value);
			newtodo.value = '';
		}
	}
}
