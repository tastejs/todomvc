function Count(props) {
	'use strict';

	const [todos, dispatch] = useTodos();
	const activeCount = todos.filter(({ completed }) => completed === false)
		.length;
	const itemsLeft = ` item${activeCount !== 1 ? 's' : ''} left`;

	return (
		<span className="todo-count">
			<strong>{activeCount}</strong>
			{itemsLeft}
		</span>
	);
}
