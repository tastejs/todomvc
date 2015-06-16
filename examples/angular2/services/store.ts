/// <reference path="../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../typings/storejs/storejs.d.ts" />
/// <reference path="../typings/angular2/angular2.d.ts" />

import {Injectable} from 'angular2/angular2';
import * as uuid from 'node-uuid';

export class Todo {
	completed: Boolean;
	editing: Boolean;
	title: String;
	uid: String;
	setTitle(title: String) {
		this.title = title.trim();
	}
	constructor(title: String) {
		this.uid = uuid.v4();
		this.completed = false;
		this.editing = false;
		this.title = title.trim();
	}
}

@Injectable()
export class TodoStore {
	todos: Array<Todo>;
	constructor() {
		let persistedTodos = store.get('angular2-todos') || [];
		// Normalize back into classes
		this.todos = persistedTodos.map( (todo: {title: String, completed: Boolean, uid: String}) => {
			let ret = new Todo(todo.title);
			ret.completed = todo.completed;
			ret.uid = todo.uid;
			return ret;
		});
	}
	_updateStore() {
		store.set('angular2-todos', this.todos);
	}
	get(state: {completed: Boolean}) {
		return this.todos.filter((todo: Todo) => todo.completed === state.completed);
	}
	allCompleted() {
		return this.todos.length === this.getCompleted().length;
	}
	setAllTo(toggler) {
		this.todos.forEach((t: Todo) => t.completed = toggler.checked);
		this._updateStore();
	}
	removeCompleted() {
		this.todos = this.get({completed: false});
	}
	getRemaining() {
		return this.get({completed: false});
	}
	getCompleted() {
		return this.get({completed: true});
	}
	toggleCompletion(uid: String) {
		for (let todo of this.todos) {
			if (todo.uid === uid) {
				todo.completed = !todo.completed;
				break;
			}
		};
		this._updateStore();
	}
	remove(uid: String) {
		for (let todo of this.todos) {
			if (todo.uid === uid) {
				this.todos.splice(this.todos.indexOf(todo), 1);
				break;
			}
		}
		this._updateStore();
	}
	add(title: String) {
		this.todos.push(new Todo(title));
		this._updateStore();
	}
}
