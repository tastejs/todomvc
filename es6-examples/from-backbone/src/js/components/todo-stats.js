/**
 * @author Jonmathon Hibbard
 * @license MIT
 */
const clearButton = '<button class="clear-completed">Clear completed</button>';
const defaultProps = {
	remaining: 0,
	completed: false
};

const TodoStats = props => {
	const { remaining, completed } = { ...defaultProps, ...props };
	const remainingItemLabel = remaining === 1 ? 'item' : 'items';
	const showButton = completed ? clearButton : '';

	return `
		<span class="todo-count">
			<strong>${ remaining }</strong> ${ remainingItemLabel } left
		</span>
		<ul class="filters">
			<li>
				<a class="selected" href="#/">All</a>
			</li>
			<li>
				<a href="#/active">Active</a>
			</li>
			<li>
				<a href="#/completed">Completed</a>
			</li>
		</ul>
		${ showButton }
	`;
};

export default TodoStats;
