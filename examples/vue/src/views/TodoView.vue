<script>
import TodoFooter from '../components/TodoFooter.vue';
import TodoHeader from '../components/TodoHeader.vue';
import TodoList from '../components/TodoList.vue';
import { useTodoStore } from '../stores/TodoStore';

export default {
	components: {
		TodoFooter,
		TodoHeader,
		TodoList,
	},
	computed: {
		filteredTodos() {
			switch (this.$route.name) {
				case 'active':
					return this.todoStore.todos.filter((t) => !t.completed);
				case 'completed':
					return this.todoStore.todos.filter((t) => t.completed);
				default:
					return this.todoStore.todos;
			}
		},
	},
	created() {
		this.todoStore = useTodoStore();
	},
};
</script>

<template>
	<TodoHeader @add-todo="todoStore.addTodo" />
	<TodoList
		:todos="filteredTodos"
		@update-todo="todoStore.updateTodo"
		@delete-todo="todoStore.deleteTodo"
		@toggle-all="todoStore.toggleAll"
	/>
	<TodoFooter
		:todos="todoStore.todos"
		@clear-completed="todoStore.clearCompleted"
	/>
</template>
