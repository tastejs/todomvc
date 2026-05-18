import { defineStore } from 'pinia';

interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

export const useTodoStore = defineStore('todo', {
	state: () => ({
		todos: [] as Todo[],
	}),

	actions: {
		addTodo(title: string) {
			this.todos.push({ id: Date.now(), title, completed: false });
		},
		updateTodo(editedTodo: Todo) {
			const todo = this.todos.find((t) => t.id === editedTodo.id);
			if (todo) todo.title = editedTodo.title;
		},
		deleteTodo(deletedTodo: Todo) {
			this.todos = this.todos.filter((t) => t.id !== deletedTodo.id);
		},
		clearCompleted() {
			this.todos = this.todos.filter((t) => !t.completed);
		},
		toggleAll() {
			const allCompleted = this.todos.every((t) => t.completed);
			this.todos.forEach((t) => (t.completed = !allCompleted));
		},
	},
});
