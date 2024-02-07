import { createState, createEffect, createContext, produce } from 'solid-js';

function id() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function createLocalState(initState) {
  const [state, setState] = createState(initState);
  if (localStorage.todos) {
		setState({ todos: JSON.parse(localStorage.todos) });
	}
  createEffect(() => localStorage.setItem('todos', JSON.stringify(state.todos)));
  return [state, setState];
}

export const TodosContext = createContext([{ todos: [] }, {}]);

export function TodosProvider(props) {
  const [state, setState] = createLocalState({
		todos: []
	});

	const isAllComplete = () => state.todos.every(todo => todo.completed);

	const store = [
		state,
		{
			addTodo(title) {
				setState('todos', todos => [...todos, { id: id(), title: title.trim(), completed: false }]);
			},
			removeTodo(id) {
				setState('todos', todos => todos.filter(todo => todo.id !== id));
			},
			setIsTodoCompleted(id, completed) {
				setState('todos', todos => todos.map(todo => todo.id === id ? {...todo, completed} : todo));
			},
			clearCompleted() {
				setState('todos', todos => todos.filter(todo => !todo.completed));
			},
			toggleCompleted() {
				const completed = !isAllComplete();
				setState('todos', todos => todos.map(todo => ({ ...todo, completed })));
			},
			editTodo(id, title) {
				if(title.trim().length === 0) setState('todos', todos => todos.filter(todo => todo.id !== id));
				else setState('todos', produce(todos => {
					todos.find(todo => todo.id === id).title = title.trim();
				}));
				// TODO: Fix to not use produce while keeping TodoItem's own internal state.
			}
		}
	];

  return (
    <TodosContext.Provider value={store}>
      {props.children}
    </TodosContext.Provider>
  );
};
