<script>
export default {
	emits: ['add-todo'],
	data() {
		return {
			newTodo: '',
		};
	},
	methods: {
		addTodo() {
			const title = this.newTodo.trim();
			if (title) {
				this.$emit('add-todo', title);
				this.newTodo = '';
			}
		},
	},
};
</script>

<template>
	<header class="header">
    <RouterLink to="/"><h1>todos</h1></RouterLink>
		<input
			type="text"
			class="new-todo"
			autofocus
			autoComplete="off"
			placeholder="What needs to be done?"
			@keyup.enter="addTodo"
			v-model="newTodo"
		/>
	</header>
</template>
