/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global Utils, ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS,
	TodoItem, TodoFooter, React, Router*/

(function (window, React) {
	'use strict';

	window.ALL_TODOS = 'all';
	window.ACTIVE_TODOS = 'active';
	window.COMPLETED_TODOS = 'completed';

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			var todos = Utils.store('react-todos');
			return {
				todos: todos,
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
			var newTodo;

			if (val) {
				newTodo = {
					id: Utils.uuid(),
					title: val,
					completed: false
				};
				this.setState({todos: this.state.todos.concat([newTodo])});
				this.refs.newField.getDOMNode().value = '';
			}

			return false;
		},

		toggleAll: function (event) {
			var checked = event.target.checked;

			// Note: it's usually better to use immutable data structures since they're easier to
			// reason about and React works very well with them. That's why we use map() and filter()
			// everywhere instead of mutating the array or todo items themselves.
			var newTodos = this.state.todos.map(function (todo) {
				return Utils.extend({}, todo, {completed: checked});
			});

			this.setState({todos: newTodos});
		},

		toggle: function (todoToToggle) {
			var newTodos = this.state.todos.map(function (todo) {
				return todo !== todoToToggle ? todo : Utils.extend({}, todo, {completed: !todo.completed});
			});

			this.setState({todos: newTodos});
		},

		destroy: function (todo) {
			var newTodos = this.state.todos.filter(function (candidate) {
				return candidate.id !== todo.id;
			});

			this.setState({todos: newTodos});
		},

		edit: function (todo, callback) {
			// refer to todoItem.js `handleEdit` for the reasoning behind the
			// callback
			this.setState({editing: todo.id}, function () {
				callback();
			});
		},

		save: function (todoToSave, text) {
			var newTodos = this.state.todos.map(function (todo) {
				return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
			});

			this.setState({todos: newTodos, editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			var newTodos = this.state.todos.filter(function (todo) {
				return !todo.completed;
			});

			this.setState({todos: newTodos});
		},

		componentDidUpdate: function () {
			Utils.store('react-todos', this.state.todos);
		},

		render: function () {
			var footer = null;
			var main = null;

			var shownTodos = this.state.todos.filter(function (todo) {
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

			var activeTodoCount = this.state.todos.reduce(function(accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = this.state.todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (this.state.todos.length) {
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

	React.renderComponent(<TodoApp />, document.getElementById('todoapp'));
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
