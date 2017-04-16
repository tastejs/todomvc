/// <reference path="Model.ts" />

import TodoItem = Model.TodoItem;

class ViewModel {

	todos: KnockoutObservableArray<TodoItem>;

	current: KnockoutObservable<string>;

	showMode: KnockoutObservable<string>;

	filteredTodos: KnockoutComputed<Array<TodoItem>>;

	completedCount: KnockoutComputed<number>;

	remainingCount: KnockoutComputed<number>;

	allCompleted: KnockoutComputed<boolean>;

	constructor(todos: Array<TodoItem>) {
		this.todos = ko.observableArray(todos.map((todo: any): TodoItem => {
			return new TodoItem(todo.title, todo.completed);
		}));

		this.current = ko.observable('');

		this.showMode = ko.observable('all');

		this.filteredTodos = ko.computed((): Array<TodoItem> => {
			switch (this.showMode()) {
			case 'active':
				return this.todos().filter((todo: TodoItem): boolean => {
					return !todo.completed();
				});
			case 'completed':
				return this.todos().filter((todo: TodoItem): boolean => {
					return todo.completed();
				});
			default:
				return this.todos();
			}
		});

		// count of all completed todos
		this.completedCount = ko.computed((): number => {
			return this.todos().filter((todo: TodoItem): boolean => {
				return todo.completed();
			}).length;
		});

		// count of todos that are not complete
		this.remainingCount = ko.computed((): number => {
			return this.todos().length - this.completedCount();
		});

		// writeable computed observable to handle marking all complete/incomplete
		this.allCompleted = ko.computed({
			// always return true/false based on the done flag of all todos
			read: (): boolean => {
				return !this.remainingCount();
			},
			// set all todos to the written value (true/false)
			write: (newValue: boolean): void => {
				this.todos().forEach((todo: TodoItem): void => {
					// set even if value is the same, as subscribers are not notified in that case
					todo.completed(newValue);
				});
			}
		});

		// internal computed observable that fires whenever anything changes in our todos
		ko.computed((): void => {
			// store a clean copy to local storage, which also creates a dependency on the observableArray and all observables in each item
			localStorage.setItem('todos-typescript-knockoutjs', ko.toJSON(this.todos));
		}).extend({
			rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
		}); // save at most twice per second
	}

	// add a new todo, when enter key is pressed
	add(): void {
		var current = this.current().trim();
		if (current) {
			this.todos.push(new TodoItem(current));
			this.current('');
		}
	}

	// remove a single todo
	remove(todo: TodoItem): void {
		this.todos.remove(todo);
	}

	// remove all completed todos
	removeCompleted() {
		this.todos.remove(function (todo: TodoItem) {
			return todo.completed();
		});
	}

	// edit an item
	editItem(item: TodoItem): void {
		item.editing(true);
		item.previousTitle = item.title();
	}

	// stop editing an item.  Remove the item, if it is now empty
	saveEditing(item: TodoItem): void {
		var title = item.title(),
			trimmedTitle = title.trim();

		item.editing(false);

		// Observable value changes are not triggered if they're consisting of whitespaces only
		// Therefore we've to compare untrimmed version with a trimmed one to check whether anything changed
		// And if yes, we've to set the new value manually
		if (title !== trimmedTitle) {
			item.title(trimmedTitle);
		}

		if (!trimmedTitle) {
			this.remove(item);
		}
	}

	// cancel editing an item and revert to the previous content
	cancelEditing(item: TodoItem): void {
		item.editing(false);
		item.title(item.previousTitle);
	}

	// helper function to keep expressions out of markup
	getLabel(count: KnockoutObservable<number>): string {
		return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
	}
}