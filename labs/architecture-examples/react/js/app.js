/**
 * @jsx React.DOM
 */
(function (window, React) {
	'use strict';

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				todos: Utils.store('react-todos'),
				editing: null
			};
		},

		handleSubmit: React.autoBind(function () {
			var val = this.refs.newField.getDOMNode().value.trim();
			var todos;
			var newTodo;

			if (val) {
				todos = this.state.todos;
				newTodo = {
					id: Utils.uuid(),
					title: val,
					completed: false
				};
				this.setState({ todos: todos.concat([newTodo]) });
				this.refs.newField.getDOMNode().value = '';
			}

			return false;
		}),

		toggleAll: function (event) {
			var checked = event.nativeEvent.target.checked;

			this.state.todos.map(function (todo) {
				todo.completed = checked;
			});

			this.setState({ todos: this.state.todos });
		},

		toggle: function (todo) {
			todo.completed = !todo.completed;
			this.setState({ todos: this.state.todos });
		},

		destroy: function (todo) {
			var newTodos = this.state.todos.filter(function (candidate) {
				return candidate.id !== todo.id;
			});

			this.setState({ todos: newTodos });
		},

		edit: function (todo) {
			this.setState({ editing: todo.id });
		},

		save: function (todo, text) {
			todo.title = text;
			this.setState({todos: this.state.todos, editing: null});
		},

		cancel: React.autoBind(function () {
			this.setState({editing: null});
		}),

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
			var todoItems = {};
			var activeTodoCount;
			var completedCount;

			this.state.todos.map(function (todo) {
				todoItems[todo.id] = (
					<TodoItem
						todo={ todo }
						onToggle={ this.toggle.bind(this, todo) }
						onDestroy={ this.destroy.bind(this, todo) }
						onEdit={ this.edit.bind(this, todo) }
						editing={ this.state.editing === todo.id }
						onSave={ this.save.bind(this, todo) }
						onCancel={ this.cancel }
					/>
				);
			}.bind(this));

			activeTodoCount = this.state.todos.filter(function (todo) {
				return !todo.completed;
			}).length;

			completedCount = this.state.todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={ activeTodoCount }
						completedCount={ completedCount }
						onClearCompleted={ this.clearCompleted.bind(this) }
					/>;
			}

			if (this.state.todos.length) {
				main = (
					<section class="main">
						<input class="toggle-all" type="checkbox" onChange={ this.toggleAll.bind(this) } checked={activeTodoCount === 0} />
						<label class="toggle-all-label">Mark all as complete</label>
						<ul class="todo-list">
							{ todoItems }
						</ul>
					</section>
				);
			}

			return (
				<div>
					<section class="todoapp">
						<header class="header">
							<h1>todos</h1>
							<form onSubmit={ this.handleSubmit }>
								<input
									ref="newField"
									class="new-todo"
									placeholder="What needs to be done?"
									autofocus="autofocus"
								/>
								<input type="submit" class="submitButton" />
							</form>
						</header>
						{main}
						{footer}
					</section>
					<footer class="info">
						<p>Double-click to edit a todo</p>
						<p>Created by{' '}<a href="http://github.com/petehunt/">petehunt</a></p>
						<p>Part of{' '}<a href="http://todomvc.com">TodoMVC</a></p>
					</footer>
				</div>
			);
		}
	});

	React.renderComponent(<TodoApp />, document.getElementById('todoapp'));
})(window, React);
