/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	var ENTER_KEY = 13;

	var TodoItem = app.TodoItem;

	app.ToggleAllCheckbox = React.createClass({
		toggleAll: function (event) {
			var checked = event.target.checked;

			this.props.todos.forEach(function (todo) {
				todo.set('completed', checked);
				todo.save();
			});
		},

		render: function () {
			return <input
						id="toggle-all"
						type="checkbox"
						onChange={this.toggleAll}
						checked={this.props.activeTodoCount === 0}
					/>;
		}

	});

	app.ClearButton = React.createClass({
		handleClearCompleted: function () {
			this.props.todos.completed().forEach(function (todo) {
				todo.destroy();
			});
		},

		render: function () {
			if (this.props.completedCount > 0)
				return (
					<button
						id="clear-completed"
						onClick={this.handleClearCompleted}>
						Clear completed ({this.props.completedCount})
					</button>
				);
			else
				return null;
		}
	});

	app.NewTodoInput = React.createClass({
		handleNewTodoKeyDown: function (event) {
			var val;

			if (event.which !== ENTER_KEY) {
				return;
			}

			// when the enter key is pressed, create a new todo
			val = this.refs.newField.getDOMNode().value.trim();

			if (val) {
				this.props.todos.create({
					title: val,
					completed: false,
					order: this.props.todos.nextOrder()
				});
				// clear the value in the text node
				this.refs.newField.getDOMNode().value = '';
			}

			return false;
		},

		render: function () {
			return (
				<input
					ref="newField"
					id="new-todo"
					placeholder="What needs to be done?"
					onKeyDown={this.handleNewTodoKeyDown}
					autoFocus={true}
				/>
			);
		}
	});


	app.TodosLeftCount = React.createClass({
		render: function () {
			var activeTodoWord = this.props.count === 1 ? 'item' : 'items';

			return (
				<span id="todo-count">
					<strong>{this.props.count}</strong> {activeTodoWord} left
				</span>
			);
		}
	});

	app.Filters = React.createClass({
		render: function () {
			var cx = React.addons.classSet;
			var nowShowing = this.props.nowShowing;

			return (
				<ul id="filters">
					<li>
						<a
							href="#/"
							className={cx({selected: nowShowing === app.ALL_TODOS})}>
								All
						</a>
					</li>
					{' '}
					<li>
						<a
							href="#/active"
							className={cx({selected: nowShowing === app.ACTIVE_TODOS})}>
								Active
						</a>
					</li>
					{' '}
					<li>
						<a
							href="#/completed"
							className={cx({selected: nowShowing === app.COMPLETED_TODOS})}>
								Completed
						</a>
					</li>
				</ul>
			);
		}
	});


	app.TodoList = React.createClass({
		getInitialState: function () {
			return {
				editing: null
			};
		},

		onEdit: function (todo) {
			// we need to keep track of what we are editing in the list itself
			// so that we can switch the existing editing list item to not be editing
			this.setState({editing: todo.get('id')});
		},

		onEditComplete: function () {
			this.setState({editing:null});
		},

		render: function () {
			var todoItems = this.props.shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.get('id')}
						todo={todo}
						editing={todo.get('id') === this.state.editing}
						onEdit={this.onEdit}
						onEditComplete={this.onEditComplete}
					/>
				);
			}, this);

			return (
				<ul id="todo-list">
					{todoItems}
				</ul>
			);
		}
	});
})();
