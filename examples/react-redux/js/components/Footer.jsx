import React, { PropTypes } from 'react';
import FilterLink from '../containers/FilterLink';
import { ALL, ACTIVE, COMPLETED } from '../constants';

export default class Footer extends React.Component {

	static propTypes = {
		actions: PropTypes.shape({
			removeCompleted: PropTypes.func.isRequired
		}).isRequired,
		todos: PropTypes.array.isRequired
	}

	constructor(props) {
		super(props);
		this.remove = this.remove.bind(this);
	}

	render () {
		const { todos } = this.props,
			completedCount = todos.filter(t => t.completed).length,
			activeCount = todos.length - completedCount,
			pluralizedItems = `item${activeCount === 1 ? '' : 's'}`,
			clearCompleted = !completedCount ? null : (
				<button className="clear-completed"
								onClick={this.remove}>Clear completed</button>
			);

		return (
			<footer className="footer">
				<span className="todo-count">
					<strong>{activeCount}</strong> {pluralizedItems} left
				</span>
				<ul className="filters">
					<li>
						<FilterLink filter={ALL}>
							All
						</FilterLink>
					</li>
					<li>
						<FilterLink filter={ACTIVE}>
							Active
						</FilterLink>
					</li>
					<li>
						<FilterLink filter={COMPLETED}>
							Completed
						</FilterLink>
					</li>
				</ul>
				{clearCompleted}
			</footer>
		)
	}

	remove () {
		this.props.actions.removeCompleted();
	}

}
