/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	app.HIGH_PRIORITY_TODOS = 'highPriority';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: '',
				newTodoPriority: 1,
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS}),
				'/highPriority': setState.bind(this, {nowShowing: app.HIGH_PRIORITY_TODOS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();
			var priority = this.state.newTodoPriority;

			if (val) {
				this.props.model.addTodo(val, priority);
				this.setState({newTodo: '', newTodoPriority: '1'});
			}
		},

		handleSelect: function (event) {
			var priority = event.target.value
			this.setState({newTodoPriority: priority})
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

		edit: function (todo) {
			this.setState({editing: todo.id});
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
			var footer;
			var main;
			var todos = this.props.model.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				case app.HIGH_PRIORITY_TODOS:
					return todo.priority == 1 || todo.priority == 2
				default:
					return true;
				}
			}, this);

			function compareDecreasingPriority(a, b) {
				if (a.priority < b.priority) {
					return -1
				}
				if (a.priority > b.priority) {
					return 1
				}
				return 0
			}

			var sortedTodos = todos.slice(0).sort(compareDecreasingPriority)

			var todoItems = sortedTodos.map(function (todo) {
				return (
					<div>
						<div style={{ fontSize: '10px'}}>Priority: {todo.priority}</div>
						<TodoItem
							key={todo.id}
							todo={todo}
							onToggle={this.toggle.bind(this, todo)}
							onDestroy={this.destroy.bind(this, todo)}
							onEdit={this.edit.bind(this, todo)}
							editing={this.state.editing === todo.id}
							onSave={this.save.bind(this, todo)}
							onCancel={this.cancel}
							priority={todo.priority}
						/>
					</div>
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
							id="toggle-all"
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<label
							htmlFor="toggle-all"
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
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<input
								className="new-todo"
								placeholder="What needs to be done?"
								value={this.state.newTodo}
								onKeyDown={this.handleNewTodoKeyDown}
								onChange={this.handleChange}
								autoFocus={true}
							/>
							<select class="new-todo-priority" onChange={this.handleSelect}>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
							</select>
						</div>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	var model = new app.TodoModel('react-todos');

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
