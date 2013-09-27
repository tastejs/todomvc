var Component = require('montage/ui/component').Component;
var RangeController = require('montage/core/range-controller').RangeController;
var Todo = require('core/todo').Todo;
var Serializer = require('montage/core/serialization').Serializer;
var Deserializer = require('montage/core/serialization').Deserializer;
var LOCAL_STORAGE_KEY = 'todos-montage';

exports.Main = Component.specialize({

	_newTodoForm: {
		value: null
	},

	_newTodoInput: {
		value: null
	},

	todoListController: {
		value: null
	},

	constructor: {
		value: function Main() {
			this.todoListController = new RangeController();
			this.addPathChangeListener('todos.every{completed}', this, 'handleTodosCompletedChanged');

			this.defineBindings({
				'todos': {'<-': 'todoListController.organizedContent'},
				'todosLeft': {'<-': 'todos.filter{!completed}'},
				'todosCompleted': {'<-': 'todos.filter{completed}'}
			});
		}
	},

	templateDidLoad: {
		value: function () {
			this.load();
		}
	},

	load: {
		value: function () {
			if (localStorage) {
				var todoSerialization = localStorage.getItem(LOCAL_STORAGE_KEY);

				if (todoSerialization) {
					var deserializer = new Deserializer(),
						self = this;

					deserializer.init(todoSerialization, require)
					.deserializeObject()
					.then(function (todos) {
						self.todoListController.content = todos;
					}).fail(function (error) {
						console.error('Could not load saved tasks.');
						console.debug('Could not deserialize', todoSerialization);
						console.log(error.stack);
					});
				}
			}
		}
	},

	save: {
		value: function () {
			if (localStorage) {
				var todos = this.todoListController.content,
					serializer = new Serializer().initWithRequire(require);

				localStorage.setItem(LOCAL_STORAGE_KEY, serializer.serializeObject(todos));
			}
		}
	},

	enterDocument: {
		value: function (firstTime) {
			if (firstTime) {
				this._newTodoForm.identifier = 'newTodoForm';
				this._newTodoForm.addEventListener('submit', this, false);

				this.addEventListener('destroyTodo', this, true);

				window.addEventListener('beforeunload', this, true);
			}
		}
	},

	captureDestroyTodo: {
		value: function (evt) {
			this.destroyTodo(evt.detail.todo);
		}
	},

	createTodo: {
		value: function (title) {
			var todo = new Todo().initWithTitle(title);
			this.todoListController.add(todo);
			return todo;
		}
	},

	destroyTodo: {
		value: function (todo) {
			this.todoListController.delete(todo);
			return todo;
		}
	},

	_allCompleted: {
		value: null
	},

	allCompleted: {
		get: function () {
			return this._allCompleted;
		},
		set: function (value) {
			this._allCompleted = value;
			this.todoListController.organizedContent.forEach(function (member) {
				member.completed = value;
			});
		}
	},

	todos: {
		value: null
	},

	todosLeft: {
		value: null
	},

	todosCompleted: {
		value: null
	},

	// Handlers

	handleNewTodoFormSubmit: {
		value: function (evt) {
			evt.preventDefault();

			var title = this._newTodoInput.value.trim();

			if (title === '') {
				return;
			}

			this.createTodo(title);
			this._newTodoInput.value = null;
		}
	},

	handleTodosCompletedChanged: {
		value: function (value) {
			this._allCompleted = value;
			this.dispatchOwnPropertyChange('allCompleted', value);
		}
	},

	handleClearCompletedButtonAction: {
		value: function () {
			var completedTodos = this.todoListController.organizedContent.filter(function (todo) {
				return todo.completed;
			});

			if (completedTodos.length > 0) {
				this.todoListController.deleteEach(completedTodos);
			}
		}
	},

	captureBeforeunload: {
		value: function () {
			this.save();
		}
	}
});
