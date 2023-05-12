<script lang="ts" context="module">
export type Events = {
	complete: { completed: boolean; };
	remove: TodoItem;
	edit: TodoItem;
};
</script>

<script lang="ts">
import { createEventDispatcher, tick } from 'svelte';
import { Keys } from '../../../constants';
import type { TodoItem } from '../../../types/todo';

const dispatch = createEventDispatcher<Events>();

export let todo: TodoItem;

let editing = false;

let editingTodo = { ...todo };

const focus = (el: HTMLElement) => ({
  async update(params: boolean) {
    if (params) {
      await tick();
      el.focus();
    }
  },
});

const handleToggle = (event: HTMLElementEventMap['change']) =>
	dispatch('complete', { completed: (event.target as HTMLInputElement)!.checked });

const handleRemove = () => dispatch('remove', todo);

const handleBeginEdit = () => {
  editing = true;
  editingTodo = { ...todo };
};

const finishEdit = () => {
	if (!editing) {
		return;
	}

  editing = false;
  const trimedTitle = editingTodo.title?.trim?.();
  if (trimedTitle.length > 0) {
    dispatch('edit', { ...editingTodo, title: trimedTitle, });
  } else {
    dispatch('remove', todo);
  }
};

const cancelEdit = () => {
  editing = false;
};

const handleEditKeydown = ({ code }: KeyboardEvent) => {
  switch (code) {
    case Keys.Enter:
      return finishEdit();
    case Keys.Escape:
      return cancelEdit();
  }
};
</script>

<li
  class="todo"
  class:completed={todo.completed}
  class:editing
>
  <div class="view">
    <input
      class="toggle"
      type="checkbox"
      checked={todo.completed}
      on:change={handleToggle}
    >
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label on:dblclick={handleBeginEdit}>{todo.title}</label>
    <button class="destroy" on:click={handleRemove}></button>
  </div>
  <input
    class="edit"
    type="text"
    bind:value={editingTodo.title}
    use:focus={editing}
    on:keydown={handleEditKeydown}
    on:blur={finishEdit}
  >
</li>
