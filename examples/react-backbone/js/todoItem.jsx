/**
 * @jsx React.DOM
 */
/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.TodoItem = React.createClass({
		getInitialState: function () {
			return {editText: this.props.todo.get('title')};
		},

		handleSubmit: function () {
			var val = this.state.editText.trim();
			if (val) {
				this.props.onSave(val);
				this.setState({editText: val});
			} else {
				this.props.onDestroy();
			}
			return false;
		},

		handleEdit: function () {
			// react optimizes renders by batching them. This means you can't call
			// parent's `onEdit` (which in this case triggeres a re-render), and
			// immediately manipulate the DOM as if the rendering's over. Put it as a
			// callback. Refer to app.jsx' `edit` method
			this.props.onEdit(function () {
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}.bind(this));
			this.setState({editText: this.props.todo.get('title')});
		},

		handleKeyDown: function (event) {
			if (event.which === ESCAPE_KEY) {
				this.setState({editText: this.props.todo.get('title')});
				this.props.onCancel();
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit();
			}
		},

		handleChange: function (event) {
			this.setState({editText: event.target.value});
		},

		render: function () {
			return (
				<li className={classNames({
					completed: this.props.todo.get('completed'),
					editing: this.props.editing
				})}>
					<div className="view">
						<input
							className="toggle"
							type="checkbox"
							checked={this.props.todo.get('completed')}
							onChange={this.props.onToggle}
						/>
						<label onDoubleClick={this.handleEdit}>
							{this.props.todo.get('title')}
						</label>
						<button className="destroy" onClick={this.props.onDestroy} />
					</div>
					<input
						ref="editField"
						className="edit"
						value={this.state.editText}
						onBlur={this.handleSubmit}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyDown}
					/>
				</li>
			);
		}
	});
})();
