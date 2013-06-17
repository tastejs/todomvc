/**
 * @jsx React.DOM
 */

(function (window) {
	'use strict';

	var ESCAPE_KEY = 27;

	window.TodoItem = React.createClass({
		handleSubmit: React.autoBind(function () {
			var val = this.state.editText.trim();
			if (val) {
				this.props.onSave(val);
				this.setState({ editText: val });
			} else {
				this.props.onDestroy();
			}
			return false;
		}),

		handleEdit: React.autoBind(function () {
			this.props.onEdit();
			var node = this.refs.editField.getDOMNode();
			node.focus();
			node.setSelectionRange(node.value.length, node.value.length);
		}),

		handleKey: React.autoBind(function (event) {
			if (event.nativeEvent.keyCode === ESCAPE_KEY) {
				this.setState({ editText: this.props.todo.title });
				this.props.onCancel();
			} else {
				this.setState({ editText: event.target.value });
			}
		}),

		getInitialState: function () {
			return { editText: this.props.todo.title };
		},

		componentWillReceiveProps: function (nextProps) {
			if (nextProps.todo.title !== this.props.todo.title) {
				this.setState(this.getInitialState());
			}
		},

		render: function () {
			return (
				<li class={cx({
					completed: this.props.todo.completed,
					editing: this.props.editing
				})}>
					<div class="view">
						<input
							class="toggle"
							type="checkbox"
							checked={ this.props.todo.completed ? 'checked' : null }
							onChange={ this.props.onToggle }
						/>
						<label onDoubleClick={ this.handleEdit }>{ this.props.todo.title }</label>
						<button class='destroy' onClick={ this.props.onDestroy } />
					</div>
					<form onSubmit={this.handleSubmit}>
						<input
							ref="editField"
							class="edit"
							value={ this.state.editText }
							onBlur={ this.handleSubmit }
							onKeyUp={ this.handleKey }
						/>
						<input type="submit" class="submitButton" />
					</form>
				</li>
			);
		}
	});
})(window);
