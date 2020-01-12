<script>
	import { onMount } from 'svelte';
	import Todo from './Todo.svelte';
	import { ALL, ACTIVE, COMPLETED } from '../helpers/filterCodes';

	export let todos = [];
	export let visible = true;
	export let filterBy = ALL;

	let toggleAllEl = null;
	let filteredList = ALL;

	const handleToggleAll = e => todos.toggleAll(e.target.checked);

	$: allCompleted = $todos.every(todo => todo.completed);
	$: switch (filterBy) {
		case ACTIVE:
			filteredList = $todos.filter(todo => !todo.completed);
			break;
		case COMPLETED:
			filteredList = $todos.filter(todo => todo.completed);
			break;
		default:
			filteredList = $todos;
	};
</script>

{#if $visible}
	<section class="main" data-testid="main">
		<input
			id="toggle-all"
			class="toggle-all"
			type="checkbox"
			data-testid="toggle-all"
			bind:checked={allCompleted}
			on:click={handleToggleAll}
		>
		<label for="toggle-all">Mark all as complete</label>
		<ul class="todo-list">
			{#each filteredList as todo (todo.id)}
				<Todo {todos} {todo}/>
			{/each}
		</ul>
	</section>
{/if}