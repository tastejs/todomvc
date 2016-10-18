import React, { PropTypes } from 'react';
import FilterLink from '../containers/FilterLink';

export default class Footer extends React.Component {

	static propTypes = {
		actions: PropTypes.shape({
			removeCompleted: PropTypes.func.isRequired
		}).isRequired,
		todos: PropTypes.array.isRequired
	}

	constructor() {
		super();
		this.remove = this.remove.bind(this);
	}

	render () {
		const { todos } = this.props,
			completedCount = todos.filter(t => t.completed).length,
			activeCount = todos.length - completedCount,
			pluralizedItems = `item${activeCount === 1 ? '' : 's'}`;

		return (
			<footer className="footer">
				<span className="todo-count">
					<strong>{activeCount}</strong> {pluralizedItems} left
				</span>
				<ul className="filters">
					<li>
						<FilterLink filter="ALL">
							All
						</FilterLink>
					</li>
					<li>
						<FilterLink filter="ACTIVE">
							Active
						</FilterLink>
					</li>
					<li>
						<FilterLink filter="COMPLETED">
							Completed
						</FilterLink>
					</li>
				</ul>
				{
					!completedCount ?
						null :
						<button className="clear-completed"
							onClick={this.remove}>Clear completed</button>
				}
			</footer>
		)
	}

	remove () {
		this.props.actions.removeCompleted();
	}

}
