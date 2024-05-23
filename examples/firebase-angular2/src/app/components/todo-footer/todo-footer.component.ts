import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoStoreService } from '../../services/todo-store.service';

@Component({
  selector: 'todo-footer',
  templateUrl: './todo-footer.component.html',
})
export class TodoFooterComponent implements OnInit {

  currentStatus = '';

  counter: Number;
  remainingCount: Number;
  hasCompleted: Boolean;

  constructor(
    private todoStore: TodoStoreService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {

    //for css links
    this.route.params
      .map(params => params.status)
      .subscribe((status) => {
        this.currentStatus = status || '';
      });

    //gobal list size
    this.todoStore.getCount().subscribe(value => {
      this.counter = value;
    });

    //remaining list size
    this.todoStore.getRemainingCount().subscribe(value => {
      this.remainingCount = value;
    });

    //has completed items
    this.todoStore.hasCompleted().subscribe(value => {
      this.hasCompleted = value;
    });
  }

  removeCompleted() {
    this.todoStore.removeCompleted();
  }

}
