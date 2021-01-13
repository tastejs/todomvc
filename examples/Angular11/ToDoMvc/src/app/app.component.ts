import { Component } from '@angular/core';
import { Todo } from './models/todo.model';
import { TodoStoreService } from './services/todo-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	newTodoText = '';

	constructor(public todoStore: TodoStoreService) {
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

	addTodo() {
		if (this.newTodoText.trim().length) {
			this.todoStore.add(this.newTodoText);
			this.newTodoText = '';
		}
	}
}
