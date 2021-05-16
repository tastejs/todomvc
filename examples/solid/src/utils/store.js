import { createState, createEffect, produce } from 'solid-js';

function id() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function createLocalState(initState) {
  const [state, setState] = createState(initState);
  if (localStorage.todos) setState(JSON.parse(localStorage.todos));
  createEffect(() => localStorage.setItem('todos', JSON.stringify(state)));
  return [state, setState];
}

export const [state, setState] = createLocalState({
	todos: []
})

export function addTodo(title) {
	setState('todos', todos => [...todos, { id: id(), title, completed: false }]);
}

export function removeTodo(id) {
	setState('todos', todos => todos.filter(todo => todo.id !== id));
}

export function setIsTodoCompleted(id, completed) {
	setState('todos', todos => todos.map(todo => todo.id === id ? {...todo, completed} : todo));
}

export function clearCompleted() {
	setState('todos', todos => todos.filter(todo => !todo.completed))
}

export function editTodo(id, title) {
	setState('todos', produce(todos => {
		todos.find(todo => todo.id === id).title = title;
	}));
}
