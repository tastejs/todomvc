import { v4 as uuidv4 } from 'uuid';
import { STATUS_ACTIVE, STATUS_COMPLETED } from './consts.js';

export default class TodosAPI {
	constructor() {
		this.todos = [];
	}

	getFilteredTodos(filter) {
		let result = this.todos;
		// If the filter is "all" we simply don't filter at all
		if (filter !== 'all') {
			result = this.todos.filter((todo) => todo.status === filter);
		}
		return result;
	}

	addTodo(label) {
		const newTodo = {
			id: uuidv4(),
			label,
			status: STATUS_ACTIVE,
		};
		this.todos.push(newTodo);
		return newTodo;
	}

	deleteTodo(id) {
		const todoToDeleteIndex = this.todos.findIndex((todo) => todo.id === id);
		if (todoToDeleteIndex !== -1) {
			const todoToDelete = this.todos.splice(todoToDeleteIndex, 1)[0];
			return todoToDelete;
		}
	}

	markAllAs(status) {
		this.todos.forEach((todo) => (todo.status = status));
	}

	markSingleAs(id, status) {
		const todo = this.todos.find((todo) => todo.id === id);
		if (todo) {
			todo.status = status;
		}
		return todo;
	}

	editTodoLabel(id, label) {
		const todo = this.todos.find((todo) => todo.id === id);
		if (todo) {
			todo.label = label;
		}
		return todo;
	}

	deleteCompleted() {
		this.todos = this.todos.filter((todo) => todo.status !== STATUS_COMPLETED);
	}
}
