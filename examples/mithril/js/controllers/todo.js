'use strict';
/*global m */

var app = app || {};
app.Controller = function () {

	// Todo collection
	this.list = app.storage.get();

	// Update with props
	this.list = this.list.map(function (item) {
		return new app.Todo(item);
	});

	// Temp title placeholder
	this.title = '';

	// Todo list filter
	this.filter = function () {
		return m.route.param('filter') || '';
	};

	this.add = function () {
		var title = this.title.trim();
		if (title) {
			this.list.push(new app.Todo({title: title}));
			app.storage.put(this.list);
		}
		this.title = '';
	};

	this.isVisible = function (todo) {
		switch (this.filter()) {
			case 'active':
				return !todo.completed;
			case 'completed':
				return todo.completed;
			default:
				return true;
		}
	};

	this.complete = function (todo) {
		if (todo.completed) {
			todo.completed = false;
		} else {
			todo.completed = true;
		}
		app.storage.put(this.list);
	};

	this.edit = function (todo) {
		todo.previousTitle = todo.title;
		todo.editing = true;
	};

	this.doneEditing = function (todo, index) {
		if (!todo.editing) {
			return;
		}

		todo.editing = false;
		todo.title = todo.title.trim();
		if (!todo.title) {
			this.list.splice(index, 1);
		}
		app.storage.put(this.list);
	};

	this.cancelEditing = function (todo) {
		todo.title = todo.previousTitle;
		todo.editing = false;
	};

	this.clearTitle = function () {
		this.title = '';
	};

	this.remove = function (key) {
		this.list.splice(key, 1);
		app.storage.put(this.list);
	};

	this.clearCompleted = function () {
		for (var i = this.list.length - 1; i >= 0; i--) {
			if (this.list[i].completed) {
				this.list.splice(i, 1);
			}
		}
		app.storage.put(this.list);
	};

	this.amountCompleted = function () {
		return this.list.filter(function (todo) { return todo.completed; }).length;
	};

	this.allCompleted = function () {
		return this.list.every(function (todo) { return todo.completed; });
	};

	this.toggleAll = function () {
		var allCompleted = this.allCompleted();
		for (var i = 0; i < this.list.length; i++) {
			this.list[i].completed = !allCompleted;
		}
		app.storage.put(this.list);
	};
};
