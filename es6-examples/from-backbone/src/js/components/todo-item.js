/**
 * @author Jonmathon Hibbard
 * @license MIT
 */
const defaultProps = {
	isChecked: false,
	title: ''
};

const TodoItem = props => {
	const { isChecked, title } = { ...defaultProps, ...props };
	const checked = isChecked ? 'checked': ''

	return `
		<div class="view">
			<input class="toggle" type="checkbox" ${ checked }>
			<label>${ title }</label>
			<button class="destroy"></button>
		</div>
		<input class="edit" value="${ title }" />
	`;
};
