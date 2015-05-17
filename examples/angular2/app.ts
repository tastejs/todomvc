/// <reference path="typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap, NgIf, NgFor} from 'angular2/angular2';
import {TodoStore, Todo} from 'services/store';

const ESC_KEY = 27;
const ENTER_KEY = 13;

@Component({
	selector: 'todo-app',
})
@View({
	directives: [NgIf, NgFor],
	template: `
		<section class="todoapp">
			<header class="header">
				<h1>todos</h1>
				<input class="new-todo" placeholder="What needs to be done?" autofocus="" #newtodo (keyup)="addTodo($event, newtodo)">
			</header>
			<section class="main" *ng-if="todoStore.todos.length > 0">
				<input class="toggle-all" type="checkbox" *ng-if="todoStore.todos.length" #toggleall [checked]="todoStore.allCompleted()" (click)="todoStore.setAllTo(toggleall)">
				<ul class="todo-list">
					<li *ng-for="#todo of todoStore.todos" [class.completed]="todo.completed" [class.editing]="todo.editing">
						<div class="view">
							<input class="toggle" type="checkbox" (click)="toggleCompletion(todo.uid)" [checked]="todo.completed">
							<label (dblclick)="editTodo(todo)">{{todo.title}}</label>
							<button class="destroy" (click)="remove(todo.uid)"></button>
						</div>
						<input class="edit" *ng-if="todo.editing" [value]="todo.title" #editedtodo (blur)="stopEditing(todo, editedtodo)" (keyup.enter)="updateEditingTodo(editedtodo, todo)" (keyup.escape)="cancelEditingTodo(todo)">
					</li>
				</ul>
			</section>
			<footer class="footer" *ng-if="todoStore.todos.length > 0">
				<span class="todo-count"><strong>{{todoStore.getRemaining().length}}</strong> {{todoStore.getRemaining().length == 1 ? 'item' : 'items'}} left</span>
				<button class="clear-completed" *ng-if="todoStore.getCompleted().length > 0" (click)="removeCompleted()">Clear completed</button>
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
			return this.todoStore.remove(todo.uid);
		}

		todo.setTitle(editedTitle);
	}
	editTodo(todo: Todo) {
		todo.editing = true;
	}
	removeCompleted() {
		this.todoStore.removeCompleted();
	}
	toggleCompletion(uid: String) {
		this.todoStore.toggleCompletion(uid);
	}
	remove(uid: String){
		this.todoStore.remove(uid);
	}
	addTodo($event, newtodo) {
		if ($event.which === ENTER_KEY && newtodo.value.trim().length) {
			this.todoStore.add(newtodo.value);
			newtodo.value = '';
		}
	}
}

bootstrap(TodoApp);
