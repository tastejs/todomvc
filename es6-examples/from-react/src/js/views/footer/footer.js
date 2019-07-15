import { noop, ALL_TODOS, ACTIVE_TODS, COMPLETED_TODOS } from '@app-constants';

const defaultProps = {
	completedCount: 0,
	count: 0,
	nowShowing: '',
	onClearCompleted: noop
};

const FooterComponent = props => {
	const { completedCount, count, nowShowing, onClearCompleted } = { ...defaultProps, ...props };

	if (!count && !completedCount) {
		return '';
	}

	const activeTodoWord = 'item';
	const clearButton = !completedCount ? '' : `<button class="clear-completed">Clear completed</button>`;

	return `
		<footer className="footer">
			<span className="todo-count">
				<strong>${ count }</strong> ${ activeTodoWord } left
			</span>
			<ul className="filters">
				<li>
					<a href="#/" class="${ (nowShowing === ALL_TODOS ? 'selected' : '') }">All</a>
				</li>
				<li>
					<a href="#/active" className="${ (nowShowing === ACTIVE_TODOS ? 'selected' : '') }">Active</a>
				</li>
				<li>
					<a href="#/completed" className={ (nowShowing === COMPLETED_TODOS ? 'selected' : '') }>Completed</a>
				</li>
			</ul>
			${ clearButton }
		</footer>
	`;
};

export default FooterComponent;
