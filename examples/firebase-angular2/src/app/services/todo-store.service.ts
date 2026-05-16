import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { TodoModel } from '../models/todo.model';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class TodoStoreService {

	todos: AngularFireList<TodoModel>;

	constructor(db: AngularFireDatabase) {
		this.todos = db.list<TodoModel>('todos');
	}

	add(todo) {
		this.todos.push(todo);
	}

	update(todo) {
		this.todos.set(todo.uid,todo);
	}

	remove(uid) {
		this.todos.remove(uid);
	}

	getTodos(status?): Observable<any> {
		let result = this.todos.snapshotChanges()
			// Use snapshotChanges().map() to store the key
			.map(changes => {
				return changes.map(c => ({ uid: c.payload.key, ...c.payload.val() }));
			});

		return this.filterByStatus(status, result);
	}

	filterByStatus(status, result) {
		if (status !== undefined) {
			status = status === "completed" ? true : false;
			result = result.map(changes => {
				return changes.filter((todo) => todo.completed === status);
			});
		}
		return result;
	}

	setAllTo(completed: Boolean) {		
 		this.getTodos().first().subscribe(todos => {
			todos.forEach(todo => {
				if(todo.completed != completed){
					todo.completed = completed;
					this.update(todo);
				}
			});
		});
	}

	removeCompleted() {
		this.getTodos("completed").first().subscribe(items => {
			items.forEach(item => {
				this.remove(item.uid);
			});
		});
	}

	getCount(): Observable<Number> {
		return new Observable(observer => {
			this.getTodos().subscribe(items =>{
				observer.next(items.length);
			});
		});
	}

	getRemainingCount(): Observable<Number> {
		return new Observable(observer => {
			this.getTodos().subscribe(items =>{
				observer.next(items.filter(x => x.completed == false).length);
			});
		});
	}

	hasCompleted(): Observable<Boolean> {
		return new Observable(observer => {
			this.getTodos().subscribe(items =>{
				observer.next(items.filter(x => x.completed == true).length > 0);
			});
		});
	}

	getAllCompleted(): Observable<Boolean> {
		return new Observable(observer => {
			this.getTodos().subscribe(items =>{
				observer.next(items.filter(x => x.completed == false).length == 0);
			});
		});
	}

}