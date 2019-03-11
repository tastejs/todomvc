/* jshint esnext:false */
/* jshint esversion:9 */
/* global React */
function todosReducer(todos, action) {
	'use strict';

	const { type, text, id, checked } = action;

	switch (type) {
		case 'add':
			return [
				...todos,
				{
					text: text,
					completed: false,
					id: uuid.v4()
				}
			];
		case 'toggle':
			return todos.map(
				todo =>
					todo.id === id ? { ...todo, completed: !todo.completed } : todo
			);
		case 'toggle-all':
			return todos.map(todo => ({ ...todo, completed: checked }));
		case 'destroy':
			return todos.filter(todo => todo.id !== id);
		case 'edit':
			return todos.map(
				todo => (todo.id === id ? { ...todo, text: text } : todo)
			);
		case 'clear-completed':
			return todos.filter(({ completed }) => !completed);
	}
}

const TodosContext = React.createContext(null);

function useTodos() {
	const contextValue = React.useContext(TodosContext);
	return contextValue;
}

function TodosProvider(props) {
	'use strict';

	const { children } = props;
	const contextValue = React.useReducer(
		todosReducer,
		JSON.parse(localStorage.getItem('todos-react')) || []
	);
	const [todos] = contextValue;

	React.useEffect(
		() => {
			localStorage.setItem('todos-react', JSON.stringify(todos));
		},
		[todos]
	);

	return (
		<TodosContext.Provider value={contextValue}>
			{children}
		</TodosContext.Provider>
	);
}
