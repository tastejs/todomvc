<script>
import { createEventDispatcher, tick } from 'svelte';
import { KeyCodes } from '../../../constants';

const dispatch = createEventDispatcher();

export let todo;

let editing = false;

let editingTodo = { ...todo };

const focus = (el) => ({
  async update(params) {
    if (params) {
      await tick();
      el.focus();
    }
  },
});

const handleToggle = (event) => dispatch('complete', { completed: event.target.checked });

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

const handleEditKeydown = ({ keyCode }) => {
  switch (keyCode) {
    case KeyCodes.Enter:
      return finishEdit(todo);
    case KeyCodes.Escape:
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
