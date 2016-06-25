import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoStoreService } from '../../services/todo-store.service';
import template from './todo-list.template.html';
import { TodoHeaderComponent } from '../todo-header/todo-header.component';
import { TodoFooterComponent } from '../todo-footer/todo-footer.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'todo-list',
  template: template,
  directives: [TodoHeaderComponent, TodoFooterComponent, TodoItemComponent]
})
export class TodoComponent {
  constructor(todoStore: TodoStoreService, route: ActivatedRoute) {
    this._todoStore = todoStore;
    this._route = route;
    this._currentStatus = '';
  }

  ngOnInit() {
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this._currentStatus = status;
      });
  }

  remove(uid) {
    this._todoStore.remove(uid);
  }

  update() {
    this._todoStore.persist();
  }

  getTodos() {
    if (this._currentStatus == 'completed') {
      return this._todoStore.getCompleted();
    }
    else if (this._currentStatus == 'active') {
      return this._todoStore.getRemaining();
    }
    else {
      return this._todoStore.todos;
    }
  }

  allCompleted() {
    return this._todoStore.allCompleted();
  }

  setAllTo(toggleAll) {
    this._todoStore.setAllTo(toggleAll.checked);
  }
}
