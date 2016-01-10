'use strict';
import {Component, EventEmitter, Output} from 'angular2/core';
import {TodoLocalStore} from '../services/store';
import todoHeaderTemplate from './todo_header.html';

@Component({
	selector: 'todo-header',
	template: todoHeaderTemplate
})
export class TodoHeader {
	newTodo = '';

	constructor(todoStore:TodoLocalStore) {
		this._todoStore = todoStore;
	}

	addTodo() {
		if (this.newTodo.trim().length) {
			this._todoStore.add(this.newTodo);
			this.newTodo = '';
		}
	}
}
