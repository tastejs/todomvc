'use strict';
import {Component, Inject} from 'angular2/core';
import {TodoLocalStore} from '../services/store';
import todoTemplate from './todo.html';
import {TodoHeader} from './todo_header';
import {TodoFooter} from './todo_footer';
import {TodoItem} from './todo_item';

@Component({
  selector: 'todo-app',
  template: todoTemplate,
  directives: [TodoHeader, TodoFooter, TodoItem]
})
export class TodoApp {
  constructor(todoStore: TodoLocalStore) {
    this._todoStore = todoStore;
  }

  remove(uid) {
    this._todoStore.remove(uid);
  }

  update() {
    this._todoStore.persist();
  }

  getTodos() {
    return this._todoStore.todos;
  }

  allCompleted() {
    return this._todoStore.allCompleted();
  }

  setAllTo(toggleAll) {
    this._todoStore.setAllTo(toggleAll.checked);
  }
}
