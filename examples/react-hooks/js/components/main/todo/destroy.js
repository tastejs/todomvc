/* global React, TodosDispatch */
function Destroy(props) {
	'use strict';

	const { id } = props;
	const [todos, dispatch] = useTodos();

	function onClick() {
		dispatch({ type: 'destroy', id });
	}

	return <button className="destroy" onClick={onClick} />;
}
