import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {TodoStore, Todo} from './services/store';

const ESC_KEY = 27;
const ENTER_KEY = 13;

@Component({
	selector: 'todo-app',
	template: `
		<section class="todoapp">
			<header class="header">
				<h1>todos</h1>
				<input class="new-todo" placeholder="What needs to be done?" autofocus="" #newtodo (keyup)="addTodo($event, newtodo)">
			</header>
			<section class="main" *ngIf="todoStore.todos.length > 0">
				<input class="toggle-all" type="checkbox" *ngIf="todoStore.todos.length" #toggleall [checked]="todoStore.allCompleted()" (click)="todoStore.setAllTo(toggleall)">
				<ul class="todo-list">
					<li *ngFor="#todo of todoStore.todos" [class.completed]="todo.completed" [class.editing]="todo.editing">
						<div class="view">
							<input class="toggle" type="checkbox" (click)="toggleCompletion(todo)" [checked]="todo.completed">
							<label (dblclick)="editTodo(todo)">{{todo.title}}</label>
							<button class="destroy" (click)="remove(todo)"></button>
						</div>
						<input class="edit" *ngIf="todo.editing" [value]="todo.title" #editedtodo (blur)="stopEditing(todo, editedtodo)" (keyup.enter)="updateEditingTodo(editedtodo, todo)" (keyup.escape)="cancelEditingTodo(todo)">
					</li>
				</ul>
			</section>
			<footer class="footer" *ngIf="todoStore.todos.length > 0">
				<span class="todo-count"><strong>{{todoStore.getRemaining().length}}</strong> {{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left</span>
				<button class="clear-completed" *ngIf="todoStore.getCompleted().length > 0" (click)="removeCompleted()">Clear completed</button>
			</footer>
		</section>`
})
class TodoApp {
	todoStore: TodoStore;
	constructor() {
		this.todoStore = new TodoStore();
	}
	stopEditing(todo: Todo, editedTitle) {
		todo.setTitle(editedTitle.value);
		todo.editing = false;
	}
	cancelEditingTodo(todo: Todo) { todo.editing = false; }
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

bootstrap(TodoApp);
