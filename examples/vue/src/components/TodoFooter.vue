<script>
import { RouterLink } from 'vue-router';

export default {
	props: {
		todos: Array,
	},
	computed: {
		remainingCount() {
			return this.todos.filter((t) => !t.completed).length;
		},
		remainingText() {
			return this.remainingCount === 1 ? 'item left' : 'items left';
		},
	},
};
</script>

<template>
	<footer v-show="todos.length > 0" class="footer">
		<span class="todo-count"><strong>{{ remainingCount }}</strong> {{ remainingText }}</span>
		<ul class="filters">
			<li>
				<RouterLink to="/" exact-active-class="selected"> All </RouterLink>
			</li>
			<li>
				<RouterLink to="/active" exact-active-class="selected">
					Active
				</RouterLink>
			</li>
			<li>
				<RouterLink to="/completed" exact-active-class="selected">
					Completed
				</RouterLink>
			</li>
		</ul>
		<button
			v-show="todos.some((todo) => todo.completed)"
			class="clear-completed"
			@click="$emit('clear-completed')"
		>
			Clear completed
		</button>
	</footer>
</template>
