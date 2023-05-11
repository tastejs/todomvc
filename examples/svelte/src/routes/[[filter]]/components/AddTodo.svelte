<script lang="ts" context="module">
export type Events = {
	newTodo: {
		value: string;
	};
};
</script>

<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { KeyCodes } from '../../../constants';

const dispatch = createEventDispatcher<Events>();

let value = '';

const onKeydown = (event: KeyboardEvent) => {
  const trimed = value?.trim?.();
  if (event.keyCode === KeyCodes.Enter && trimed) {
    dispatch('newTodo', { value: trimed });
    value = '';
  }
};
</script>

<input
  class="new-todo"
  placeholder="What needs to be done?"
  bind:value
  on:keydown={onKeydown}
/>
