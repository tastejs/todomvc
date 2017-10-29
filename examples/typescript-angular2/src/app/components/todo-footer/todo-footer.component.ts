import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoStoreService } from '../../services/todo-store.service';

@Component({
	selector: 'todo-footer',
	templateUrl: './todo-footer.template.html'
})
export class TodoFooterComponent implements OnInit{
    private currentStatus: string;

	constructor(private todoStore: TodoStoreService, private route: ActivatedRoute) {
		this.currentStatus = '';
	}

	ngOnInit() {
		this.route.params
			.map(params => params.status)
			.subscribe((status) => {
				this.currentStatus = status || '';
			});
	}

	removeCompleted() {
		this.todoStore.removeCompleted();
	}

	getCount() {
		return this.todoStore.todos.length;
	}

	getRemainingCount() {
		return this.todoStore.remaining.length;
	}

	hasCompleted() {
		return this.todoStore.completed.length > 0;
	}
}
