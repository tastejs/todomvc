'use strict';

class TodoStorage {
	static STORAGE_ID = 'todos-mithril';

	static get() : Array<ITodoData> {
		return JSON.parse(localStorage.getItem(TodoStorage.STORAGE_ID) || '[]');
	}

	static put(todos: Array<TodoItem>): void {
		localStorage.setItem(TodoStorage.STORAGE_ID, JSON.stringify(todos));
	}
}

