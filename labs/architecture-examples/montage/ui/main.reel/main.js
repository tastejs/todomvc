var Montage = require('montage').Montage;
var Component = require('montage/ui/component').Component;
var ArrayController = require('montage/ui/controller/array-controller').ArrayController;
var Todo = require('core/todo').Todo;
var Serializer = require('montage/core/serializer').Serializer;
var Deserializer = require('montage/core/deserializer').Deserializer;
var LOCAL_STORAGE_KEY = 'todos-montage';

exports.Main = Montage.create(Component, {
	newTodoForm: {
		value: null
	},

	newTodoInput: {
		value: null
	},

	todoListController: {
		serializable: false,
		value: null
	},

	didCreate: {
		value: function () {
			this.todoListController = ArrayController.create();
			this.load();
		}
	},

	load: {
		value: function () {
			if (localStorage) {
				var todoSerialization = localStorage.getItem(LOCAL_STORAGE_KEY);

				if (todoSerialization) {
					var deserializer = Deserializer.create();
					var self = this;

					try {
						deserializer.initWithStringAndRequire(todoSerialization, require).deserializeObject(function (todos) {
							self.todoListController.initWithContent(todos);
						}, require);
					} catch (err) {
						console.error('Could not load saved tasks.');
						console.debug('Could not deserialize', todoSerialization);
						console.log(err.stack);
					}
				}
			}
		}
	},

	save: {
		value: function () {
			if (localStorage) {
				var todos = this.todoListController.content;
				var serializer = Serializer.create().initWithRequire(require);

				localStorage.setItem(LOCAL_STORAGE_KEY, serializer.serializeObject(todos));
			}
		}
	},

	prepareForDraw: {
		value: function () {
			this.newTodoForm.identifier = 'newTodoForm';
			this.newTodoForm.addEventListener('submit', this, false);
			this.addEventListener('destroyTodo', this, true);
			window.addEventListener('beforeunload', this, true);
		}
	},

	captureDestroyTodo: {
		value: function (e) {
			this.destroyTodo(e.detail.todo);
		}
	},

	handleNewTodoFormSubmit: {
		value: function (e) {
			e.preventDefault();

			var title = this.newTodoInput.value.trim();

			if (title === '') {
				return;
			}

			this.createTodo(title);
			this.newTodoInput.value = null;
		}
	},

	createTodo: {
		value: function (title) {
			var todo = Todo.create().initWithTitle(title);
			this.todoListController.addObjects(todo);
			return todo;
		}
	},

	destroyTodo: {
		value: function (todo) {
			this.todoListController.removeObjects(todo);
			return todo;
		}
	},

	allCompleted: {
		dependencies: ['todoListController.organizedObjects.completed'],
		get: function () {
			return this.todoListController.organizedObjects.getProperty('completed').all();
		},
		set: function (value) {
			this.todoListController.organizedObjects.forEach(function (member) {
				member.completed = value;
			});
		}
	},

	todosLeft: {
		dependencies: ['todoListController.organizedObjects.completed'],
		get: function () {
			if (this.todoListController.organizedObjects) {
				var todos = this.todoListController.organizedObjects;
				return todos.filter(function (member) {
					return !member.completed;
				});
			}
		}
	},

	completedTodos: {
		dependencies: ['todoListController.organizedObjects.completed'],
		get: function () {
			if (this.todoListController.organizedObjects) {
				var todos = this.todoListController.organizedObjects;
				return todos.filter(function (member) {
					return member.completed;
				});
			}
		}
	},

	handleClearCompletedButtonAction: {
		value: function () {
			var completedTodos = this.todoListController.organizedObjects.filter(function (todo) {
				return todo.completed;
			});

			if (completedTodos.length > 0) {
				this.todoListController.removeObjects.apply(this.todoListController, completedTodos);
			}
		}
	},

	captureBeforeunload: {
		value: function () {
			this.save();
		}
	}
});
