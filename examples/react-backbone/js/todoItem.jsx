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
			return {
				editText: this.props.todo.get('title'),
			};
		},

		handleSubmit: function () {
			var trimmedTitle = this.state.editText.trim();
			var todo = this.props.todo;

			if (trimmedTitle) {
				todo.set({'title':trimmedTitle});
				todo.save();
				this.setState({editText: trimmedTitle});
			} else {
				todo.destroy();
			}
			this.props.onEditComplete();

			return false;
		},

		handleEdit: function () {
			// react optimizes renders by batching them. This means you can't call
			// parent's `onEdit` (which in this case triggeres a re-render), and
			// immediately manipulate the DOM as if the rendering's over. Put it as a
			// callback. Refer to app.jsx' `edit` method
			this.props.onEdit(this.props.todo);
		},

		handleDestroy: function () {
			this.props.todo.destroy();
		},

		handleChange: function (event) {
			this.setState({editText: event.target.value});
		},

		handleCancel: function () {
			this.setState({
				editText: this.props.todo.get('title')
			});
			this.props.onEditComplete();
		},

		handleKeyDown: function (event) {
			if (event.which === ESCAPE_KEY) {
				this.handleCancel();
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit();
			} else return;
		},

		handleToggle: function(event) {
			var checked = event.target.checked;

			this.props.todo.set('completed', checked);
			this.props.todo.save();
		},

		// This is called after the properties are updated.
		// If now we are switched to the edit mode, then focus
		// on the field
		componentDidUpdate: function() {
			if(this.props.editing) {
				var node = this.refs.editField.getDOMNode();

				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}
		},

		render: function () {
			return (
				<li className={React.addons.classSet({
					completed: this.props.todo.get('completed'),
					editing: this.props.editing
				})}>
					<div className="view">
						<input
							className="toggle"
							type="checkbox"
							checked={this.props.todo.get('completed')}
							onChange={this.handleToggle}
						/>
						<label onDoubleClick={this.handleEdit}>
							{this.props.todo.get('title')}
						</label>
						<button className="destroy" onClick={this.handleDestroy} />
					</div>
					<input
						type="text"
						ref="editField"
						className="edit"
						value={this.state.editText}
						onBlur={this.handleSubmit}
						onKeyDown={this.handleKeyDown}
						onChange={this.handleChange}
					/>
				</li>
			);
		}
	});
})();
