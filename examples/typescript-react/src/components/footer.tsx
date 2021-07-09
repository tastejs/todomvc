import * as classNames from 'classnames';
import * as React from 'react';
import { Utils } from '../utils';
import { ITodoFooterProps, TodoType } from '../model';

class TodoFooter extends React.Component<ITodoFooterProps, {}> {
	public render() {
		const activeTodoWord = Utils.pluralize(this.props.count, 'item');
		let clearButton = null;

		if (this.props.completedCount > 0) {
			clearButton = (
				<button className='clear-completed' onClick={this.props.onClearCompleted}>
					Clear completed
				</button>
			);
		}

		const nowShowing = this.props.nowShowing;
		return (
			<footer className='footer'>
				<span className='todo-count'>
					<strong>{this.props.count}</strong> {activeTodoWord} left
				</span>
				<ul className='filters'>
					<li>
						<a
							href='#/'
							className={classNames({ selected: nowShowing === TodoType.ALL_TODOS })}
						>
							All
						</a>
					</li>{' '}
					<li>
						<a
							href='#/active'
							className={classNames({ selected: nowShowing === TodoType.ACTIVE_TODOS })}
						>
							Active
						</a>
					</li>{' '}
					<li>
						<a
							href='#/completed'
							className={classNames({
								selected: nowShowing === TodoType.COMPLETED_TODOS
							})}
						>
							Completed
						</a>
					</li>
				</ul>
				{clearButton}
			</footer>
		);
	}
}

export { TodoFooter };
