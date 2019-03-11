/* global React, ENTER_CODE */
function NewTodo() {
	'use strict';

	const [todos, dispatch] = useTodos();
	const [text, setText] = React.useState('');

	function onChange({ target: { value } }) {
		setText(value);
	}

	function onKeyDown(event) {
		const { keyCode } = event;
		if (keyCode !== ENTER_CODE) {
			return;
		}

		event.preventDefault();
		const newText = text.trim();

		if (newText !== '') {
			dispatch({ type: 'add', text: newText });
			setText('');
		}
	}

	return (
		<input
			className="new-todo"
			placeholder="What needs to be done?"
			value={text}
			onChange={onChange}
			onKeyDown={onKeyDown}
			autoFocus
		/>
	);
}
