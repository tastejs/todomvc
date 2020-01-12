<script>
	import { todos, visible }  from '../stores/todos';

	import NewItem from './NewItem.svelte';
	import TodoList from './TodoList.svelte';
	import ListFooter from './ListFooter.svelte';
	import PageFooter from './PageFooter.svelte';
	import Router from './Router.svelte';
</script>

<Router let:filterBy={filterBy}>
	<section class="todoapp">
		<NewItem {todos} />
		<TodoList {todos} {visible} {filterBy} />
		<ListFooter {todos} {visible} {filterBy}/>
	</section>
	<PageFooter />
</Router>
