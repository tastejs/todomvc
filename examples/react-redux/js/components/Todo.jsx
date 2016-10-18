import React, { PropTypes } from 'react';

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

	static ENTER_KEY = 13

	static ESCAPE_KEY = 27

	constructor() {
		super();
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
		const label = this.state.editing ?
			null :
			<label onDoubleClick={this.edit}>{this.props.text}</label>;

		const editInput = !this.state.editing ?
			null :
			<input className="edit"
				type="text"
				 value={this.state.newText}
				 ref={input => {
					 if (input != null) {
						 input.focus()
					 }
				 }}
				 onKeyDown={this.handleEditKeyDown}
				 onBlur={this.submit}
				 onChange={this.handleEditChange}></input>;

		let classNames = [];
		if (this.props.completed) {
			classNames.push('completed');
		}
		if (this.state.editing) {
			classNames.push('editing');
		}
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
						onClick={this.remove}
					></button>
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
		if (event.keyCode === Todo.ESCAPE_KEY) {
			this.setState({
				editing: false
			});
		} else if (event.keyCode === Todo.ENTER_KEY) {
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
