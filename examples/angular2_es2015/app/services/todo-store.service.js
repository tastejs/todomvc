import { Injectable } from '@angular/core';

import { TodoModel } from '../models/todo.model';

@Injectable()
export class TodoStoreService {
	todos = [];

	constructor() {
		let persistedTodos = JSON.parse(localStorage.getItem('angular2-todos')) || [];

		this.todos = persistedTodos.map((todo) => {
			let ret = new TodoModel(todo.title);
			ret.completed = todo.completed;
			ret.uid = todo.uid;
			return ret;
		});
	}

	get(state) {
		return this.todos.filter((todo) => todo.completed === state.completed);
	}

	allCompleted() {
		return this.todos.length === this.getCompleted().length;
	}

	setAllTo(completed) {
		this.todos.forEach((todo) => todo.completed = completed);
		this.persist();
	}

	removeCompleted() {
		this.todos = this.get({ completed: false });
		this.persist();
	}

	getRemaining() {
		if (!this.remainingTodos) {
			this.remainingTodos = this.get({ completed: false });
		}

		return this.remainingTodos;
	}

	getCompleted() {
		if (!this.completedTodos) {
			this.completedTodos = this.get({ completed: true });
		}

		return this.completedTodos;
	}

	toggleCompletion(uid) {
		let todo = this._findByUid(uid);

		if (todo) {
			todo.completed = !todo.completed;
			this.persist();
		}
	}

	remove(uid) {
		let todo = this._findByUid(uid);

		if (todo) {
			this.todos.splice(this.todos.indexOf(todo), 1);
			this.persist();
		}
	}

	add(title) {
		this.todos.push(new TodoModel(title));
		this.persist();
	}

	persist() {
		this._clearCache();
		localStorage.setItem('angular2-todos', JSON.stringify(this.todos));
	}

	_findByUid(uid) {
		return this.todos.find((todo) => todo.uid == uid);
	}

	_clearCache() {
		this.completedTodos = null;
		this.remainingTodos = null;
	}
}
