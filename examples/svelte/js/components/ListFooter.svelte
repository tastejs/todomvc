<script>
	import { ALL, ACTIVE, COMPLETED } from '../helpers/filterCodes';

	export let todos = [];
	export let visible = true;
	export let filterBy = ALL;

	const handleClearCompleted = () => todos.clearAllCompleteds();

	$: remaining =
		$todos.reduce(
			(total, todo) => todo.completed ? total : total + 1
		, 0);
	$: hasCompletedItems = $todos.some(todo => todo.completed);
	$: items = remaining === 1 ? 'item' : 'items';

</script>

{#if $visible}
	<footer class="footer" data-testid="footer">
		<span class="todo-count" data-testid="todo-count">
			<strong>{remaining}</strong> {items} left
		</span>
		<ul class="filters">
			<li><a href="#/all" class:selected={filterBy===ALL}>All</a></li>
			<li><a href="#/active" class:selected={filterBy===ACTIVE}>Active</a></li>
			<li><a href="#/completed" class:selected={filterBy===COMPLETED}>Completed</a></li>
		</ul>
		{#if hasCompletedItems}
			<button class="clear-completed" on:click={handleClearCompleted}>
				Clear completed
			</button>
		{/if}
	</footer>
{/if}