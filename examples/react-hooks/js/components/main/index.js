function Main(props) {
	'use strict';

	const [todos] = useTodos();
	const noTodosClass = todos.length === 0 ? 'hidden' : '';

	return (
		<section className={`main ${noTodosClass}`}>
			<ToggleAll />
			<TodoList />
		</section>
	);
}
