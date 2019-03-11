function Todo(props) {
	'use strict';

	const { id, text, completed, isEditing, setEditing } = props;
	const editingClass = isEditing ? 'editing' : '';
	const completedClass = completed ? 'completed' : '';

	return (
		<li className={`${editingClass} ${completedClass}`}>
			<View id={id} completed={completed} text={text} setEditing={setEditing} />
			<Edit isEditing={isEditing} id={id} text={text} setEditing={setEditing} />
		</li>
	);
}
