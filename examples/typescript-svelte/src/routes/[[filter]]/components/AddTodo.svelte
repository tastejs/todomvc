<script lang="ts" context="module">
export type Events = {
	newTodo: {
		value: string;
	};
};
</script>

<script lang="ts">
import { createEventDispatcher, tick } from 'svelte';
import { Keys } from '../../../constants';

const dispatch = createEventDispatcher<Events>();

let value = '';

const onKeydown = (event: KeyboardEvent) => {
  const trimed = value?.trim?.();
  if (event.code === Keys.Enter && trimed) {
    dispatch('newTodo', { value: trimed });
    value = '';
  }
};

const focus = (el: HTMLElement) => {
	(async () => {
		await tick();
		el?.focus?.();
	})();

	return {};
};
</script>

<input
  class="new-todo"
  placeholder="What needs to be done?"
  bind:value
	use:focus
  on:keydown={onKeydown}
/>
