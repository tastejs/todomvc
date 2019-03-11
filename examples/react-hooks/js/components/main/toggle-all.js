function ToggleAll(props) {
	'use strict';

	const [todos, dispatch] = useTodos();
	const isToggled = todos.every(({ completed }) => completed);

	return (
		<React.Fragment>
			<input
				id="toggle-all"
				className="toggle-all"
				type="checkbox"
				checked={isToggled}
				onChange={onChange}
			/>
			<label htmlFor="toggle-all">Mark all as complete</label>
		</React.Fragment>
	);

	function onChange({ target: { checked } }) {
		dispatch({ type: 'toggle-all', checked });
	}
}
