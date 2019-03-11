function ClearCompleted(props) {
	'use strict';

	const [todos, dispatch] = useTodos();
	const showClearCompletedClass =
		todos.filter(({ completed }) => completed).length !== 0 ? '' : 'hidden';

	function onClick() {
		dispatch({ type: 'clear-completed' });
	}

	return (
		<button
			className={`clear-completed ${showClearCompletedClass}`}
			onClick={onClick}
		>
			Clear completed
		</button>
	);
}
