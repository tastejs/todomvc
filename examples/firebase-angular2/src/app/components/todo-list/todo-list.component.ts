import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoStoreService } from '../../services/todo-store.service';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit {

  todos;
  allCompleted;

  constructor(
    private todoStore: TodoStoreService,
    private route: ActivatedRoute) {

      this.todoStore.getAllCompleted().subscribe(value => {
        this.allCompleted = value;
      });
  }

  ngOnInit() {
    this.route.params
      .map(params => params.status)
      .subscribe((status) => {
        this.getTodos(status);
      });
  }

  getTodos(status){
    this.todoStore.getTodos(status).subscribe(items => {
      this.todos = items;
    });
  }

  remove(todo) {
    this.todoStore.remove(todo.uid);
  }

  update(todo) {
    this.todoStore.update(todo);
  }

	setAllTo(toggleAll) {
		this.todoStore.setAllTo(toggleAll.checked);
  }
  
  toggleCompletion(todo) {
    todo.completed = !todo.completed;
    this.update(todo);
  }

}