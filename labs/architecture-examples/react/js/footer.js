/**
 * @jsx React.DOM
 */
(function (window) {
	'use strict';

	window.TodoFooter = React.createClass({
		render: function () {
			var activeTodoWord = Utils.pluralize(this.props.count, 'item');
			var clearButton = null;

			if (this.props.completedCount > 0) {
				clearButton = (
					<button
						class="clear-completed"
						onClick={ this.props.onClearCompleted }>
						Clear completed ({ this.props.completedCount })
					</button>
				);
			}

			return (
				<footer class="footer">
					<span class="todo-count">
						<strong>{this.props.count}</strong>{' '}{ activeTodoWord }{' '}left
					</span>
					{clearButton}
				</footer>
			);
		}
	});
})(window);
