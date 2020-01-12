<script>
	import { onMount } from 'svelte';
	import { ENTER_KEY } from '../helpers/keyCodes';
	import { valid } from '../models/todo';

	export let todos = [];

	let inputEl = null;
	let title = '';

	onMount(async() => inputEl.focus());

	const addItem = function () {
		const newItem = { title }
		if (!valid(newItem)) {
			return;
		}

		todos.add(newItem)
		title = null;
	};

	const handleSubmit = el => {
		if (el.keyCode !== ENTER_KEY) { return; }

		addItem();
	};
</script>

<header class="header">
	<h1>todos</h1>
	<input
		class="new-todo"
		autocomplete="off"
		placeholder="What needs to be done?"
		bind:this={inputEl}
		bind:value={title}
		on:keydown={handleSubmit}
	>
</header>
