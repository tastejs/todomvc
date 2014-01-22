/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global Utils, TodoModel, ALL_TODOS, ACTIVE_TODOS,
	COMPLETED_TODOS, TodoItem, TodoFooter, React, Router*/

(function (window, React) {
	'use strict';

	window.ALL_TODOS = 'all';
	window.ACTIVE_TODOS = 'active';
	window.COMPLETED_TODOS = 'completed';

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: ALL_TODOS,
				editing: null
			};
		},

		componentDidMount: function () {
			var router = Router({
				'/': this.setState.bind(this, {nowShowing: ALL_TODOS}),
				'/active': this.setState.bind(this, {nowShowing: ACTIVE_TODOS}),
				'/completed': this.setState.bind(this, {nowShowing: COMPLETED_TODOS})
			});
			router.init();

			this.refs.newField.getDOMNode().focus();
		},

		handleNewTodoKeyDown: function (event) {
			if (event.which !== ENTER_KEY) {
				return;
			}

			var val = this.refs.newField.getDOMNode().value.trim();

			if (val) {
				this.props.model.addTodo(val);
				this.refs.newField.getDOMNode().value = '';
			}

			return false;
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			this.props.model.toggle(todoToToggle);
		},

		destroy: function (todo) {
			this.props.model.destroy(todo);
		},

		edit: function (todo, callback) {
			// refer to todoItem.js `handleEdit` for the reasoning behind the
			// callback
			this.setState({editing: todo.id}, function () {
				callback();
			});
		},

		save: function (todoToSave, text) {
			this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		render: function () {
			var footer = null;
			var main = null;

			var shownTodos = this.props.model.todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case ACTIVE_TODOS:
					return !todo.completed;
				case COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo) {
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

			var activeTodoCount = this.props.model.todos.reduce(function(accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = this.props.model.todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (this.props.model.todos.length) {
				main = (
					<section id="main">
						<input
							id="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<ul id="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header id="header">
						<h1>todos</h1>
						<input
							ref="newField"
							id="new-todo"
							placeholder="What needs to be done?"
							onKeyDown={this.handleNewTodoKeyDown}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	var model = new TodoModel('react-todos');

	function render() {
		React.renderComponent(
			<TodoApp model={model}/>,
			document.getElementById('todoapp')
		);
	}

	model.subscribe(render);
	render();

	React.renderComponent(
		<div>
			<p>Double-click to edit a todo</p>
			<p>Created by{' '}
				<a href="http://github.com/petehunt/">petehunt</a>
			</p>
			<p>Part of{' '}<a href="http://todomvc.com">TodoMVC</a></p>
		</div>,
		document.getElementById('info'));
})(window, React);
