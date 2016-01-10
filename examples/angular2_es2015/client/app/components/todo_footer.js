'use strict';
import {Component} from 'angular2/core';
import {TodoLocalStore} from '../services/store';
import todoFooterTemplate from './todo_footer.html';

@Component({
	selector: 'todo-footer',
	template: todoFooterTemplate
})
export class TodoFooter {
	constructor(todoStore:TodoLocalStore) {
		this._todoStore = todoStore;
	}

	removeCompleted() {
		this._todoStore.removeCompleted();
	}

	getCount() {
		return this._todoStore.todos.length;
	}

	getRemainingCount() {
		return this._todoStore.getRemaining().length;
	}

	hasCompleted() {
		return this._todoStore.getCompleted().length > 0;
	}
}
