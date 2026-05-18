<script>
import TodoItem from './TodoItem.vue';

export default {
	components: {
		TodoItem,
	},
	props: {
		todos: Array,
	},
};
</script>

<template>
	<section v-show="todos.length > 0" class="main">
		<input
			id="toggle-all"
			class="toggle-all"
			type="checkbox"
			@click="$emit('toggle-all')"
		/>
		<label for="toggle-all">Mark all as complete</label>
		<ul class="todo-list">
			<TodoItem
				v-for="todo in todos"
				:key="todo.id"
				:todo
				@update-todo="$emit('update-todo', $event)"
				@delete-todo="$emit('delete-todo', $event)"
			/>
		</ul>
	</section>
</template>
