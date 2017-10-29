import { Component } from '@angular/core';

import { TodoStoreService } from '../../services/todo-store.service';

@Component({
	selector: 'todo-header',
	templateUrl: './todo-header.template.html'
})
export class TodoHeaderComponent {
	newTodo = '';
	constructor(private todoStore:TodoStoreService) {}

	addTodo() {
		if (this.newTodo.trim().length) {
			this.todoStore.add(this.newTodo);
			this.newTodo = '';
		}
	}
}
