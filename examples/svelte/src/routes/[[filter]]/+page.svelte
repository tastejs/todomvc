<script>
import { tick } from 'svelte';
import { get } from 'svelte/store';
import { localStorage } from '$lib/localStorage';
import AddTodo from './components/AddTodo.svelte';
import TodoItem from './components/TodoItem.svelte';

export let data;

const filters = {
  all: (todos) => {
    return [...todos];
  },
  active: (todos) => {
    return todos.filter((x) => !x.completed);
  },
  completed: (todos) => {
    return todos.filter((x) => x.completed);
  },
};

$: ({ currentFilter } = data);

const todoStore = localStorage({ key: 'todos-svelte', initialValue: [] });

let todos = get(todoStore);

let id = todos.length;

$: todoStore.set(todos);

$: filteredTodos = filters[currentFilter](todos);

$: activeTodoCount = filters.active(todos).length;

$: hasFinishedTodos = filters.completed(todos).length > 0;

$: allCompleted = filteredTodos.length > 0 && filteredTodos.every((x) => x.completed);

const onNewTodo = ({ detail: { value: title } }) => {
  todos = [{
    id: id++,
    title,
    completed: false,
  }, ...todos];
};

const onCompleteAll = (event) => {
  todos = todos.map((x) => ({ ...x, completed: event.target.checked }));
};

const handleToggleTodo = ({ detail: { completed } }, todo) => {
  const index = todos.findIndex((x) => x.id === todo.id);
  const newTodos = [...todos];
  newTodos.splice(index, 1, { ...todo, completed });
  todos = newTodos;
};

const handleEditTodo = ({ detail: todo }) => {
  const index = todos.findIndex((x) => x.id === todo.id);
  const newTodos = [...todos];
  newTodos.splice(index, 1, { ...todo });
  todos = newTodos;
};

const removeTodo = (record) => {
  todos = todos.filter((x) => x !== record);
};

const onClearCompleted = () => {
  todos = filters.active(todos);
};

const pluralized = (number) => `item${number !== 1 ? 's' : ''}`;

const focus = (el) => {
  return {
    async update(params) {
      if (params) {
        await tick();
        el.focus();
      }
    },
  };
};
</script>

<svelte:head>
	<title>Svlte·TodoMVC</title>
	<meta name="description" content="Svelte demo todomvc app" />
</svelte:head>

<div>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <AddTodo on:newTodo={onNewTodo} />
    </header>
    {#if todos.length}
      <section class="main">
        <input
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          checked={allCompleted}
          on:change={onCompleteAll}
        >
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          {#each filteredTodos as todo (todo.id)}
            <TodoItem
              todo={todo}
              on:complete={(event) => handleToggleTodo(event, todo)}
              on:remove={({ detail }) => removeTodo(detail)}
              on:edit={handleEditTodo}
            />
          {/each}
        </ul>
      </section>
      <footer class="footer">
        <span class="todo-count">
          <strong>{activeTodoCount}</strong> {pluralized(activeTodoCount)} left
        </span>
        <ul class="filters">
          <li>
            <a
              href="/"
              class:selected={currentFilter === 'all'}
            >All</a>
          </li>
          <li>
            <a
              href="/active"
              class:selected={currentFilter === 'active'}
            >Active</a>
          </li>
          <li>
            <a
              href="/completed"
              class:selected={currentFilter === 'completed'}
            >Completed</a>
          </li>
        </ul>
        {#if hasFinishedTodos}
          <button
            class="clear-completed"
            on:click={onClearCompleted}
          >Clear completed</button>
        {/if}
      </footer>
    {/if}
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		<p>Written by <a href="https://github.com/wheeljs">wheeljs</a></p>
  </footer>
</div>
