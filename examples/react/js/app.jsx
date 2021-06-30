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
	var TodoFooter = app.TodoFooter; // access to footer component
	var TodoItem = app.TodoItem; // access to item component

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				selectedTag: '',
				editing: null,
				newTodo: '',
				newTag: ''
			};
		},

		/*
		Some sort of router. When hit with different endpoints seems
		to update state variable "nowShowing" based on the endpoint
		*/
		componentDidMount: function () {
			var setState = this.setState;
			//var pathName = window.location.href.split('/');
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});
			router.init('/');
			console.log(this.state.nowShowing);
		},

		handleTagClick: function (event) {
			console.log('click event:', event.target.text)
			this.setState({selectedTag: event.target.text});
		},

		// updates state variable "newTodo" with what you type in
		handleChange: function (event) {
			console.log('Todo being typed in!')
			this.setState({newTodo: event.target.value});
		},

		// updates state variable "newTodo" with what you type in
		handleTagChange: function (event) {
			console.log('TAG is being typed in!')
			this.setState({newTag: event.target.value});
		},

		// when the user hits the "ENTER" key and if there is a value for
		// the state variable "newTodo"
		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();
			var tag = this.state.newTag.trim();
			//console.log(`this.state: ${this.state.newTodo}`)
			console.log(`tag: ${tag}`)

			if (val) {
				this.props.model.addTodo(val, tag); // saves todo item to local storage
				this.setState({newTodo: ''}); // makes newTodo state variable empty again
				this.setState({newTag: ''}); // makes newTag state variable empty again
			}
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

		/*
		Tracks which todo we're editing by its unique id which was
		created using the util.js file and added to the todo object
		in the todos array in local storage
		*/
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

		clearTags: function () {
			this.setState({selectedTag: ''});
		},

		render: function () {
			var footer;
			var main;
			var todos = this.props.model.todos; // array of todo objects stored in local storage.
			var selectedTag = this.state.selectedTag;

			/*
			If the state says we're looking at active todos then it'll filter
			through the todo array and return a new array with only the todos
			that have their completed property as "false"
			*/
			var activeOrCompletedFilter = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);

			var tagFilter = activeOrCompletedFilter.filter(function (todo) {
				if (this.state.selectedTag !== '') {
					return todo.tag === this.state.selectedTag
				} else {
					return true;
				}
			}, this);

			// mapping the each of the todos we want to render into a todoItem component
			var todoItems = tagFilter.map(function (todo) {
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

			// how many total "Active" or not copmleted todos are there?
			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			// how many "completed" todos there are
			var completedCount = todos.length - activeTodoCount;

			//
			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
						todos={todos}
						handleTagClick={this.handleTagClick}
						onClearTags={this.clearTags}
						selectedTag={this.state.selectedTag}
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
						<h1>Sunit's Todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
						<input
							className="new-tag"
							placeholder="Enter a tag"
							value={this.state.newTag}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleTagChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	// model is an instance of class ToDoModel from todomodel.js
	// this variable is used liberally in this file
	var model = new app.TodoModel('react-todos');

	/*
	Renders TodoApp component to DOM within element with classname "todoapp"
	*/
	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
