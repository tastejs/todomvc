function View(props) {
	'use strict';

	const { id, completed, text, setEditing } = props;

	function onDoubleClick() {
		setEditing(id);
	}

	return (
		<div className="view">
			<Toggle id={id} completed={completed} />
			<label onDoubleClick={onDoubleClick}>{text}</label>
			<Destroy id={id} />
		</div>
	);
}
