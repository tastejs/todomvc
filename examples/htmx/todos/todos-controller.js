import TodosAPI from './todos-api.js';
import ejs from 'ejs';

export default class TodosController {
	constructor() {
		this.todoApi = new TodosAPI();
	}

	async renderIndexPage(filter = 'all') {
		const todosMarkup = await this.renderTodos(filter);
		const indexMarkup = await ejs.renderFile('templates/index.ejs', {
			todosMarkup,
		});

		return indexMarkup;
	}

	async renderTodos(filter = 'all') {
		const filteredTodos = this.todoApi.getFilteredTodos(filter);
		const activeTodos = this.todoApi.getFilteredTodos('active');
		const completedTodos = this.todoApi.getFilteredTodos('completed');
		const allTodos = [...activeTodos, ...completedTodos];
		const todosMarkup = await ejs.renderFile('templates/todos.ejs', {
			filteredTodos,
			allTodos,
			filter,
			activeTodos,
			completedTodos,
		});

		return todosMarkup;
	}

	async editTodoLabel(id, label) {
		const updatedTodo = this.todoApi.editTodoLabel(id, label);
		const markup = await ejs.renderFile('templates/single-todo.ejs', {
			todo: updatedTodo,
		});

		return markup;
	}

	deleteCompleted() {
		this.todoApi.deleteCompleted();
	}

	addTodo(label) {
		this.todoApi.addTodo(label);
	}

	deleteTodo(id) {
		this.todoApi.deleteTodo(id);
	}

	markAllAs(status) {
		this.todoApi.markAllAs(status);
	}

	markSingleAs(id, status) {
		this.todoApi.markSingleAs(id, status);
	}
}
