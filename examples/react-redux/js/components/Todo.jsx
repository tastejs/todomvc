import React, { PropTypes } from 'react';
import { ENTER_KEY, ESCAPE_KEY } from '../constants';

export default class Todo extends React.Component {

	static propTypes = {
		actions: PropTypes.shape({
			toggleTodo: PropTypes.func.isRequired,
			editTodo: PropTypes.func.isRequired,
			removeTodo: PropTypes.func.isRequired
		}).isRequired,
		id: PropTypes.string.isRequired,
		completed: PropTypes.bool.isRequired,
		text: PropTypes.string.isRequired
	}

	constructor(props) {
		super(props);
		this.edit = this.edit.bind(this);
		this.toggle = this.toggle.bind(this);
		this.handleEditKeyDown = this.handleEditKeyDown.bind(this);
		this.handleEditChange = this.handleEditChange.bind(this);
		this.submit = this.submit.bind(this);
		this.remove = this.remove.bind(this);
	}

	componentWillMount() {
		this.setState({
			name: this.props.text,
			editing: false
		});
	}

	render() {
		let label,
			editInput;
		if (this.state.editing) {
			label = null;

			const inputFocus = input => input && input.focus();
			editInput = (
				<input className="edit"
							 type="text"
							 value={this.state.newText}
							 ref={inputFocus}
							 onKeyDown={this.handleEditKeyDown}
							 onBlur={this.submit}
							 onChange={this.handleEditChange}/>
			);
		} else {
			label = <label onDoubleClick={this.edit}>{this.props.text}</label>;
			editInput = null
		}

		let classNames = [];
		this.props.completed && classNames.push('completed');
		this.state.editing && classNames.push('editing');
		classNames = classNames.join(' ');

		return (
			<li className={classNames}>
				<div className="view">
					<input type="checkbox"
						onChange={this.toggle}
						checked={this.props.completed}
						className="toggle"/>
					{label}
					<button className="destroy"
									onClick={this.remove}/>
				</div>
				{editInput}
			</li>
		)
	}

	toggle () {
		this.props.actions.toggleTodo(this.props.id);
	}

	edit () {
		this.setState({
			newText: this.props.text,
			editing: true
		});
	}

	handleEditKeyDown (event) {
		if (event.keyCode === ESCAPE_KEY) {
			this.setState({
				editing: false
			});
		} else if (event.keyCode === ENTER_KEY) {
			event.preventDefault();
			this.submit();
		}
	}

	submit () {
		const text = this.state.newText.trim(),
			{ id } = this.props;
		if (text) {
			this.props.actions.editTodo({
				id,
				text
			});
		} else {
			this.props.actions.removeTodo(id);
		}
		this.setState({
			newText: '',
			editing: false
		});
	}

	handleEditChange (event) {
		this.setState({
			newText: event.target.value
		});
	}

	remove () {
		this.props.actions.removeTodo(this.props.id);
	}

}
