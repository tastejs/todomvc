import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItem extends Component {
	constructor(props) {
		super(props);
		this.state = { editText: this.props.todo.title };
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}
	handleSubmit(event) {
		const val = this.state.editText.trim();
		if (val) {
			this.props.onSave(val);
			this.setState({ editText: val });
		} else {
			this.props.onDestroy();
		}
	}

	handleEdit() {
		this.props.onEdit();
		this.setState({ editText: this.props.todo.title });
	}

	handleKeyDown(event) {
		if (event.which === ESCAPE_KEY) {
			this.setState({ editText: this.props.todo.title });
			this.props.onCancel(event);
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	}

	handleChange(event) {
		if (this.props.editing) {
			this.setState({ editText: event.target.value });
		}
	}

	/**
	 * This is a completely optional performance enhancement that you can
	 * implement on any React component. If you were to delete this method
	 * the app would still work correctly (and still be very performant!), we
	 * just use it as an example of how little code it takes to get an order
	 * of magnitude performance improvement.
	 */
	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.todo !== this.props.todo ||
			nextProps.editing !== this.props.editing ||
			nextState.editText !== this.state.editText
		);
	}

	/**
	 * Safely manipulate the DOM after updating the state when invoking
	 * `this.props.onEdit()` in the `handleEdit` method above.
	 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
	 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
	 */
	componentDidUpdate(prevProps) {
		if (!prevProps.editing && this.props.editing) {
			const node = ReactDOM.findDOMNode(this.refs.editField);
			node.focus();
			node.setSelectionRange(node.value.length, node.value.length);
		}
	}

	render() {
		return (
			<li
				className={classNames({
					completed: this.props.todo.completed,
					editing: this.props.editing
				})}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={this.props.todo.completed}
						onChange={(event)=> this.props.onToggle(event)}
					/>
					<label onDoubleClick={() => this.handleEdit()}>
						{this.props.todo.title}
					</label>
					<button className="destroy" onClick={this.props.onDestroy} />
				</div>
				<input
					ref="editField"
					className="edit"
					value={this.state.editText}
					onBlur={() => this.handleSubmit()}
					onChange={(event) => this.handleChange(event)}
					onKeyDown={(event) => this.handleKeyDown(event)}
				/>
			</li>
		);
	}
}
export default TodoItem;
