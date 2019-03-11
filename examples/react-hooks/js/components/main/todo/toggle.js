/*global React, TodosDispatch */
function Toggle(props) {
	'use strict';

	const { id, completed } = props;
	const [todos, dispatch] = useTodos();

	const onChange = () => dispatch({ type: 'toggle', id });

	return (
		<input
			className="toggle"
			type="checkbox"
			checked={completed}
			onChange={onChange}
		/>
	);
}
