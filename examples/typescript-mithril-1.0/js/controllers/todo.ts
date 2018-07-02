
'use strict';
// declare const stream: Mithril.StreamFactory;

class ToDoController {

	list: Array<TodoItem>;
	title: Stream<string>;
	filter: Stream<string>; 
	
	constructor() {
		// Todo collection
		const storedTodos = TodoStorage.get();
		// Update with Mithril Stream
		this.list = storedTodos.map(function (item) {
			return new TodoItem(item);
		});

		this.title = stream("");
		this.filter = stream(m.route.param('filter') || '');
	}

	add() {
		var title = this.title().trim();
		if (title) {
			const newItem = {} as ITodoData;
			newItem.title = title;
			this.list.push(new TodoItem(newItem));
			TodoStorage.put(this.list);
		}
		this.title('');
	}

	isVisible(todo) {
		switch (this.filter()) {
			case 'active':
				return !todo.completed();
			case 'completed':
				return todo.completed();
			default:
				return true;
		}
	};

	complete(todo) {
		if (todo.completed()) {
			todo.completed(false);
		} else {
			todo.completed(true);
		}
		TodoStorage.put(this.list);
	};

	edit(todo) {
		todo.previousTitle = todo.title();
		todo.editing(true);
	};

	doneEditing(todo, index) {
		if (!todo.editing()) {
			return;
		}

		todo.editing(false);
		todo.title(todo.title().trim());
		if (!todo.title()) {
			this.list.splice(index, 1);
		}
		TodoStorage.put(this.list);
	};

	cancelEditing(todo) {
		todo.title(todo.previousTitle);
		todo.editing(false);
	};

	clearTitle () {
		this.title('');
	};

	remove(key) {
		this.list.splice(key, 1);
		TodoStorage.put(this.list);
	};

	clearCompleted() {
		for (var i = this.list.length - 1; i >= 0; i--) {
			if (this.list[i].completed()) {
				this.list.splice(i, 1);
			}
		}
		TodoStorage.put(this.list);
	};

	amountCompleted() {
		var amount = 0;
		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].completed()) {
				amount++;
			}
		}
		return amount;
	};

	allCompleted() {
		for (var i = 0; i < this.list.length; i++) {
			if (!this.list[i].completed()) {
				return false;
			}
		}
		return true;
	};

	completeAll() {
		var allCompleted = this.allCompleted();
		for (var i = 0; i < this.list.length; i++) {
			this.list[i].completed(!allCompleted);
		}
		TodoStorage.put(this.list);
	};
}

