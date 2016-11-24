import React from "react";
import Footer from "./footer";
import TodoItem from "./todoItem";
import {ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY} from "./constants";
import TodoModel from "./todoModel";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: null,
			newTodo: '',
			model: new TodoModel('react-todos')
		}
	}

	handleChange(event) {
		this.setState({newTodo: event.target.value});
	}

	handleNewTodoKeyDown(event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}
		event.preventDefault();

		let val = this.state.newTodo.trim();

		if (val) {
			this.state.model.addTodo(val);
			this.setState({newTodo: ''});
		}
	}

	toggleAll(event) {
		let checked = event.target.checked;
		this.state.model.toggleAll(checked);
		this.forceUpdate();
	}

	toggle(todoToToggle) {
		this.state.model.toggle(todoToToggle);
		this.forceUpdate();
	}

	destroy(todo) {
		this.state.model.destroy(todo);
		this.forceUpdate();
	}

	edit(todo) {
		this.setState({editing: todo.id});
	}

	save(todoToSave, text) {
		this.state.model.save(todoToSave, text);
		this.setState({editing: null});
	}

	cancel() {
		this.setState({editing: null});
	}

	clearCompleted() {
		this.state.model.clearCompleted();
		this.forceUpdate();
	}

	render() {
		let footer, main;
		let todos = this.state.model.todos;

		let shownTodos = todos.filter(todo => {
			switch (this.props.params.showing) {
				case ACTIVE_TODOS:
					return !todo.completed;
				case COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
			}
		});

		let todoItems = shownTodos.map(todo => (
			<TodoItem
				key={todo.id}
				todo={todo}
				onToggle={() => this.toggle(todo)}
				onDestroy={() => this.destroy(todo)}
				onEdit={() => this.edit(todo)}
				editing={this.state.editing === todo.id}
				onSave={title => this.save(todo, title)}
				onCancel={() => this.cancel()}
			/>
		));

		let activeTodoCount = todos.reduce((accum, todo) => {
			return todo.completed ? accum : accum + 1;
		}, 0);

		let completedCount = todos.length - activeTodoCount;

		if (activeTodoCount || completedCount) {
			footer =
				<Footer
					count={activeTodoCount}
					completedCount={completedCount}
					onClearCompleted={() => this.clearCompleted()}
				/>;
		}

		if (todos.length) {
			main = (
				<section className="main">
					<input
						className="toggle-all"
						type="checkbox"
						onChange={e => this.toggleAll(e)}
						checked={activeTodoCount === 0}
					/>
					<ul className="todo-list">
						{todoItems}
					</ul>
				</section>
			);
		}

		return (
			<section className="todoapp">
				<header className="header">
					<h1>todos</h1>
					<input
						className="new-todo"
						placeholder="What needs to be done?"
						value={this.state.newTodo}
						onKeyDown={e => this.handleNewTodoKeyDown(e)}
						onChange={e => this.handleChange(e)}
						autoFocus={true}
					/>
				</header>
				{main}
				{footer}
			</section>
		);
	}
}

export default App;
