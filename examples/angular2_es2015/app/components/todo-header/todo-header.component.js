import { Component } from '@angular/core';

import { TodoStoreService } from '../../services/todo-store.service';
import template from './todo-header.template.html';

@Component({
	selector: 'todo-header',
	template: template
})
export class TodoHeaderComponent {
	newTodo = '';

	pickedDate = ""

	constructor(todoStore:TodoStoreService) {
		this._todoStore = todoStore;
	}

	addTodo() {
		if (this.newTodo.trim().length && this.pickedDate) {
			this._todoStore.add(this.newTodo,this.pickedDate);
			this.newTodo = '';
		}else {
			alert('please fill all the fields.')
		}
	}
}
