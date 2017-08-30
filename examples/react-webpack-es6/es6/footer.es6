/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
/*global define, app */
/*jshint unused:false */
import React from 'react';
import classNames from '../node_modules/classnames/index.js';
import utils from './todoUtils'

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

class TodoFooter extends React.Component {
	render() {

		let activeTodoWord = utils.pluralize(this.props.count, 'item');
		let clearButton = null;

		if (this.props.completedCount > 0) {
			/* jshint ignore:start */
			clearButton = (
				<button
					className="clear-completed"
					onClick={this.props.onClearCompleted}>
					Clear completed
				</button>
			);
			/* jshint ignore:end */
		}

		let nowShowing = this.props.nowShowing;

		/* jshint ignore:start */
		return <footer className="footer">
					<span className="todo-count">
						<strong>{this.props.count}</strong> {activeTodoWord} left
					</span>
			<ul className="filters">
				<li>
					<a
						href="#/"
						className={classNames({selected: nowShowing === ALL_TODOS})}>
						All
					</a>
				</li>
				{' '}
				<li>
					<a
						href="#/active"
						className={classNames({selected: nowShowing === ACTIVE_TODOS})}>
						Active
					</a>
				</li>
				{' '}
				<li>
					<a
						href="#/completed"
						className={classNames({selected: nowShowing === COMPLETED_TODOS})}>
						Completed
					</a>
				</li>
			</ul>
			{clearButton}
		</footer>
		/* jshint ignore:end */
	}
}

export default TodoFooter;
