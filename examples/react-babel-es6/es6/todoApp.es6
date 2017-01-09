/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
import React from 'react';
import ReactDOM from 'react-dom';
import TodoFooter from './footer.es6';
import TodoItem from './todoItem.es6';
import Director from '../node_modules/director/build/director.js';

const Router = Director.Router;

const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';
const ENTER_KEY = 13;

class TodoApp extends React.Component {

	constructor() {
		super();
		this.state = {
			nowShowing: ALL_TODOS,
			editing: null,
			newTodo: ''
		};
		this.cancel = this.cancel.bind(this);
		this.clearCompleted = this.clearCompleted.bind(this);
		this.toggleAll = this.toggleAll.bind(this);
		this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		const setState = this.setState;
		const router = Router({
			'/': setState.bind(this, {nowShowing: ALL_TODOS}),
			'/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
			'/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
		});
		router.init('/');
	}

	handleChange = (event) => {
		this.setState({newTodo: event.target.value});
	}

	handleNewTodoKeyDown = (event) => {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		let val = this.state.newTodo.trim();

		if (val) {
			this.props.model.addTodo(val);
			this.setState({newTodo: ''});
		}
	}

	toggleAll = (event) => {
		let checked = event.target.checked;
		this.props.model.toggleAll(checked);
	}

	toggle = (todoToToggle) => {
		this.props.model.toggle(todoToToggle);
	}

	destroy = (todo) => {
		this.props.model.destroy(todo);
	}

	edit = (todo) => {
		this.setState({editing: todo.id});
	}

	save = (todoToSave, text) => {
		this.props.model.save(todoToSave, text);
		this.setState({editing: null});
	}

	cancel = () => {
		this.setState({editing: null});
	}

	clearCompleted = () => {
		this.props.model.clearCompleted();
	}

	render() {
		let footer;
		let main;
		let todos = this.props.model.todos;

		let shownTodos = todos.filter(function (todo) {
			switch (this.state.nowShowing) {
				case ACTIVE_TODOS:
					return !todo.completed;
				case COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
			}
		}, this);

		let todoItems = shownTodos.map(function (todo) {
			return (
				<TodoItem
					key={todo.id}
					todo={todo}
					onToggle={this.toggle.bind(this, todo)}
					onDestroy={this.destroy.bind(this, todo)}
					onEdit={this.edit.bind(this, todo)}
					editing={this.state.editing === todo.id}
					onSave={this.save.bind(this, todo)}
					onCancel={this.cancel}
				/>
			);
		}, this);

		let activeTodoCount = todos.reduce(function (accum, todo) {
			return todo.completed ? accum : accum + 1;
		}, 0);

		let completedCount = todos.length - activeTodoCount;

		if (activeTodoCount || completedCount) {
			footer =
				<TodoFooter
					count={activeTodoCount}
					completedCount={completedCount}
					nowShowing={this.state.nowShowing}
					onClearCompleted={this.clearCompleted}
				/>;
		}

		if (todos.length) {
			main = (
				<section className="main">
					<input
						className="toggle-all"
						type="checkbox"
						onChange={this.toggleAll}
						checked={activeTodoCount === 0}
					/>
					<ul className="todo-list">
						{todoItems}
					</ul>
				</section>
			);
		}

		return <div>
					<header className="header">
						<h1>todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
	}

};

export default TodoApp;
