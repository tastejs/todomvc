/*jshint quotmark:false */
/*jshint newcap:false */


var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	var LOCALSTORAGE_NAMESPACE = 'react-alt-todo';

	var TodoStore = function () {
		this.state = {
			todos: Utils.store(LOCALSTORAGE_NAMESPACE + '.todos'),
			nowShowing: Utils.store(LOCALSTORAGE_NAMESPACE + '.nowShowing') || app.ALL_TODOS,
			editing: Utils.store(LOCALSTORAGE_NAMESPACE + '.editing') || null
		};

		this.bindListeners({
			addTodo: app.todoActions.addTodo,
			toggleAll: app.todoActions.toggleAll,
			toggle: app.todoActions.toggle,
			destroy: app.todoActions.destroy,
			save: app.todoActions.save,
			clearCompleted: app.todoActions.clearCompleted,
			edit: app.todoActions.edit,
			show: app.todoActions.show
		});
	};

	TodoStore.prototype.addTodo = function (todo) {
		this.setState({
			todos: this.state.todos.concat(todo)
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	TodoStore.prototype.toggleAll = function (checked) {
		var updatedTodos = this.state.todos.map(function (todo) {
			return Utils.extend({}, todo, {completed: checked});
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	TodoStore.prototype.toggle = function (todoToToggle) {
		var updatedTodos = this.state.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed});
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	TodoStore.prototype.destroy = function (todoToDestroy) {
		var updatedTodos = this.state.todos.filter(function (todo) {
			return todo !== todoToDestroy;
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	TodoStore.prototype.save = function (command) {
		var updatedTodos = this.state.todos.map(function (todo) {
			return todo !== command.todoToSave ?
				todo :
				Utils.extend({}, command.todoToSave, {title: command.text});
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	TodoStore.prototype.clearCompleted = function () {
		var updatedTodos = this.state.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.setState({
			todos: updatedTodos
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.todos', this.state.todos);
	};

	TodoStore.prototype.edit = function (id) {
		this.setState({
			editing: id
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.editing', this.editing);
	};

	TodoStore.prototype.show = function (nowShowing) {
		this.setState({
			nowShowing: nowShowing
		});

		Utils.store(LOCALSTORAGE_NAMESPACE + '.nowShowing', this.nowShowing);
	};

	TodoStore.displayName = 'TodoStore';

	app.todoStore = app.alt.createStore(TodoStore);
})();
