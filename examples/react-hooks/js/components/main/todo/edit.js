/* global React, TodosDispatch, ENTER_CODE, ESC_CODE */
function Edit(props) {
	'use strict';

	const { isEditing, id, text, setEditing } = props;
	const [todos, dispatch] = useTodos();
	const inputEl = React.useRef(null);
	const [editText, setEditText] = React.useState(text);

	function onChange({ target: { value } }) {
		setEditText(value);
	}

	function onSubmit({ target: { value: text } }) {
		if (text.trim() !== '') {
			dispatch({ type: 'edit', id, text });
		} else {
			dispatch({ type: 'destroy', id });
		}
	}

	function onKeyDown(event) {
		const { keyCode } = event;

		if (keyCode === ENTER_CODE) {
			onSubmit(event);
		}

		if (keyCode === ESC_CODE) {
			setEditText(text);
		}

		if ([ENTER_CODE, ESC_CODE].includes(keyCode)) {
			setEditing(null);
		}
	}

	React.useEffect(() => {
		if (isEditing) {
			inputEl.current.focus();
		}
	});

	return (
		<input
			className="edit"
			ref={inputEl}
			value={editText}
			onChange={onChange}
			onBlur={onSubmit}
			onKeyDown={onKeyDown}
		/>
	);
}
