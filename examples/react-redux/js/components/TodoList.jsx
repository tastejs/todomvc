import React, { PropTypes } from 'react';
import Todo from '../containers/Todo';

export default class TodoList extends React.Component {

	static propTypes = {
		actions: PropTypes.shape({
			toggleAll: PropTypes.func.isRequired
		}).isRequired,
		todos: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			completed: PropTypes.bool.isRequired
		}).isRequired).isRequired
	}

	constructor(props) {
		super(props);
		this.toggleAll = this.toggleAll.bind(this);
	}

	render() {
		const todos = this.props.todos.map(todo => (
			<Todo
				key={todo.id}
				{...todo}
			/>
		));

		const allCompleted = !this.props.todos.find(todo => !todo.completed);

		return (
			<section className="main">
				<input type="checkbox"
					className="toggle-all"
					checked={allCompleted}
					onChange={this.toggleAll}/>
				<ul className="todo-list">
					{todos}
				</ul>
			</section>
		)
	}

	toggleAll () {
		this.props.actions.toggleAll();
	}
}
