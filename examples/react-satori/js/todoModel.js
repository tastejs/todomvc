/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	var Satori = app.Satori;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.todos = [];
		this.onChanges = [];

		Satori.init();
		Satori.subscribe(key, function (message) {
			this.todos.push(message);
			this.onChanges.forEach(function (cb) { cb(); });
		}.bind(this));
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(Utils.debounce(onChange, 50));
	};

	app.TodoModel.prototype.publish = function (todo) {
		Satori.publish(this.key, todo);
	};

	app.TodoModel.prototype.addTodo = function (title) {
		var todo = {
			id: Utils.uuid(),
			title: title,
			completed: false,
			isDestroyed: false
		};

		this.publish(todo);
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		var todo;
		for (var i = 0; i < this.todos.length; i++) {
			todo = Utils.extend({}, todo[i], {completed: checked});
			this.publish(this.todos[i]);
		}
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		var todo = Utils.extend({}, todoToToggle, {completed: !todoToToggle.completed});
		this.publish(todo);
	};

	app.TodoModel.prototype.destroy = function (todoToDestroy) {
		var todo = Utils.extend({}, todoToDestroy, {isDestroyed: true});
		this.publish(todo);
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		var todo = Utils.extend({}, todoToSave, {title: text});
		this.publish(todo);
	};

	app.TodoModel.prototype.clearCompleted = function () {
		var todo;
		for (var i = 0; i < this.todos.length; i++) {
			todo = this.todos[i];
			if (todo.completed) {
				this.destroy(todo);
			}
		}
	};

})();
