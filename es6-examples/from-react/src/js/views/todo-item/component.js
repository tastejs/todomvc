import { noop } from '@app-constants';

const defaultProps = {
	completed: false,
	editing: false,
	editText: '',
	title: ''
};

const TodoItemComponent = props => {
	const { completed, editing, editText, title } = { ...defaultProps, ...props };
	const completedClass = completed ? 'completed' : '';
	const editingClass = editing ? 'editing' : '';

	return `
		<li class="${ completedClass } ${ editingClass }">
			<div className="view">
				<input class="toggle" type="checkbox" checked=${ completed } />
				<label>
					${ title }
				</label>
				<button class="destroy" />
			</div>
			<input class="edit" value="${ editText }" />
		</li>
	`;
};

export default TodoItemComponent;
