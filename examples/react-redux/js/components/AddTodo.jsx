import React, { PropTypes } from 'react';
import { ENTER_KEY } from '../constants';

export default class AddTodo extends React.Component {

	static propTypes = {
		actions: PropTypes.shape({
			addTodo: PropTypes.func.isRequired
		}).isRequired
	}

	constructor(props) {
		super(props);
		this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount() {
		this.setState({
			newTodo: ''
		});
	}

	handleNewTodoKeyDown (event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		const val = this.state.newTodo.trim();

		if (val) {
			this.props.actions.addTodo(val);
			this.setState({
				newTodo: ''
			});
		}
	}

	handleChange (event) {
		this.setState({newTodo: event.target.value});
	}

	render() {
		return (
			<input
				className="new-todo"
				placeholder="What needs to be done?"
				value={this.state.newTodo}
				onKeyDown={this.handleNewTodoKeyDown}
				onChange={this.handleChange}
				autoFocus={true}
			/>
		)
	}
}
