/*jshint quotmark:false */
/*jshint newcap:false */
/*global React, Router*/

var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;
	var TodoActions = app.todoActions;
	var TodoStore = app.todoStore;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return TodoStore.getState();
		},

		componentDidMount: function () {
			TodoStore.listen(this.onStoreChange);

			var router = Router({
				'/': function () {
					TodoActions.show(app.ALL_TODOS);
				},
				'/active': function () {
					TodoActions.show(app.ACTIVE_TODOS);
				},
				'/completed': function () {
					TodoActions.show(app.COMPLETED_TODOS);
				}
			});

			router.init('/');
		},

		componentDidUnmount: function () {
			TodoStore.unlisten(this.onStoreChange);
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		onStoreChange: function (state) {
			this.setState(state);
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.setState({newTodo: ''});

				TodoActions.addTodo(val);
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			TodoActions.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			TodoActions.toggle(todoToToggle);
		},

		destroy: function (todo) {
			TodoActions.destroy(todo);
		},

		edit: function (todo) {
			TodoActions.edit(todo.id);
		},

		save: function (todoToSave, text) {
			TodoActions.save({
				todoToSave: todoToSave,
				text: text
			});

			TodoActions.edit(null);
		},

		cancel: function () {
			TodoActions.edit(null);
		},

		clearCompleted: function () {
			TodoActions.clearCompleted();
		},

		render: function () {
			var footer = null;
			var main = null;
			var todos = this.state.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
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

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

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

			return (
				<div>
					<header className="header">
						<h1>todos</h1>
						<input
							ref="newField"
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
			);
		}
	});

	React.render(
		<TodoApp/>,
		document.getElementsByClassName('todoapp')[0]
	);
})();
