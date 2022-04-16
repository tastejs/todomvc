/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	app.TodoFooter = React.createClass({
		render: function () {
			var activeTodoWord = app.Utils.pluralize(this.props.count, 'item');
			var clearButton = null;
			const totalTask = this.props.count + this.props.completedCount;

			if (this.props.completedCount > 0) {
				clearButton = (
					<button
						className="clear-completed"
						onClick={this.props.onClearCompleted}>
						Clear completed
					</button>
				);
			}

			var nowShowing = this.props.nowShowing;

			const sortByAsc = this.props.sortByAsc;

			const sortText = sortByAsc ? 'Sorted by Asc' : 'Sorted by Desc'

			return (
				<footer className="footer">
					<span className="todo-count">
						<strong>{this.props.count}</strong> / <strong>{totalTask}</strong> {activeTodoWord} left
					</span>
					<ul className="filters">
						<li>
							<a
								href="#/"
								className={classNames({selected: nowShowing === app.ALL_TODOS})}>
									All
							</a>
						</li>
						{' '}
						<li>
							<a
								href="#/active"
								className={classNames({selected: nowShowing === app.ACTIVE_TODOS})}>
									Active
							</a>
						</li>
						{' '}
						<li>
							<a
								href="#/completed"
								className={classNames({selected: nowShowing === app.COMPLETED_TODOS})}>
									Completed
							</a>
						</li>
						<li>
							<a onClick={this.props.onSort}>
									{sortText}
							</a>
						</li>
					</ul>
					{clearButton}
				</footer>
			);
		}
	});
})();
