<script>
	import { tick } from 'svelte';
	import { ENTER_KEY, ESCAPE_KEY} from '../helpers/keyCodes';
	import { valid } from '../models/todo';

	export let todos = [];
	export let todo = {};
	let editing = false;
	let editEl = null;
	let labelKey = `todo-${todo.id}`;

	$: completed = todo.completed;

	const cancelEditing = function () {
		handleEditEnd();
	};
	const handleToggle = el => todos.toggle(todo.id, el.target.checked);
	const handleRemove = () => todos.remove(todo.id);
	const handleEditStart = async function () {
		editEl.value = todo.title
		editing = true;
		await tick();
		editEl.focus();
	};
	const handleEditEnd = function () {
		editing = false;
	}
	const handleKeyDown = el => {
		switch (el.keyCode) {
			case ESCAPE_KEY:
				return cancelEditing();
			case ENTER_KEY:
				return handleSubmit();
		}
	};
	const handleSubmit = function () {
		if (!editing) { return; }

		const title = editEl.value
		if (valid({title})) {
			todos.updateTitle(todo.id, title)
		} else {
			todos.remove(todo.id)
		}
		handleEditEnd();
	};
</script>

<li class="todo"
	data-testid="todo"
	class:completed
	class:editing
	on:dblclick={handleEditStart}
>
	<div class="view">
		<input
			class="toggle"
			aria-labelledby={labelKey}
			type="checkbox"
			data-testid="toggle"
			bind:checked={completed}
			on:click={handleToggle}
		>
		<label id={labelKey} data-testid="title">{todo.title}</label>
		<button class="destroy" on:click={handleRemove} />
	</div>
	<input
		class="edit"
		type="text"
		data-testid="edit"
		bind:this={editEl}
		on:blur={handleSubmit}
		on:keydown={handleKeyDown}
	>
</li>