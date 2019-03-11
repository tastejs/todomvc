function Footer(props) {
	'use strict';

	const [todos] = useTodos();
	const noTodosClass = todos.length === 0 ? 'hidden' : '';

	return (
		<footer className={`footer ${noTodosClass}`}>
			<Count />
			<Filters />
			<ClearCompleted />
		</footer>
	);
}
