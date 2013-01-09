/*global jQuery, Handlebars, LacesModel */
jQuery(function($) {
	'use strict';

	var Utils = {
		// https://gist.github.com/1308368
		uuid: function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b},
		pluralize: function( count, word ) {
			return count === 1 ? word : word + 's';
		},
		store: function( namespace, data ) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return store && JSON.parse(store) || [];
			}
		}
	};

	function TodosModel() {
		this.set('todos', Utils.store('todos-lacesjs'));
		this.set('todoCount', function() { return this.todos.length; });
		this.set('hasTodos', function() { return this.todoCount > 0; });
		this.set('activeTodoCount', function() {
			var count = 0;
			$.each(this.todos, function(i, value) {
				if (!value.completed) {
					count++;
				}
			});
			return count;
		});
		this.set('activeTodoWord', function() {
			return Utils.pluralize(this.activeTodoCount, 'item');
		});
		this.set('completedTodos', function() {
			return this.todoCount - this.activeTodoCount;
		});

		this.todos.bind('change', function() { Utils.store('todos-lacesjs', this); });
	}

	TodosModel.prototype = new LacesModel();
	TodosModel.prototype.constructor = TodosModel;

	var App = {
		init: function() {
			this.ENTER_KEY = 13;
			this.model = new TodosModel();
			this.cacheElements();
			this.bindEvents();
		},
		cacheElements: function() {
			this.todoTemplate = Handlebars.compile( $('#todo-template').html() );
			this.footerTemplate = Handlebars.compile( $('#footer-template').html() );
			this.$todoApp = $('#todoapp');
			this.$newTodo = $('#new-todo');
			this.$toggleAll = $('#toggle-all');
			this.$main = $('#main');
			this.$todoList = $('#todo-list');
			this.$footer = this.$todoApp.find('#footer');
			this.$count = $('#todo-count');
			this.$clearBtn = $('#clear-completed');
		},
		bindEvents: function() {
			var list = this.$todoList;
			this.$newTodo.on('keyup', this.create);
			this.$toggleAll.on('change', this.toggleAll);
			this.$footer.on('click', '#clear-completed', this.destroyCompleted);
			list.on('change', '.toggle', this.toggle);
			list.on('dblclick', 'label', this.edit);
			list.on('keypress', '.edit', this.blurOnEnter);
			list.on('blur', '.edit', this.update);
			list.on('click', '.destroy', this.destroy);

			var self = this;
			this.model.bind('change:activeTodoCount', function(event) {
				self.$toggleAll.prop('checked', !event.value);
			}, { initialFire: true });
			this.model.bind('change:hasTodos', function(event) {
				var hasTodos = event.value;
				self.$main.toggle(hasTodos);
				self.$footer.toggle(hasTodos);
			}, { initialFire: true });
			this.model.bind('change:todos', function(event) {
				self.$todoList.html(self.todoTemplate(this.todos));
				self.$footer.html(self.footerTemplate(this));
			}, { initialFire: true });
		},
		toggleAll: function() {
			var isChecked = $(this).prop('checked');
			$.each(App.model.todos, function(i, value) {
				value.completed = isChecked;
			});
		},
		destroyCompleted: function() {
			var todos = App.model.todos,
				l = todos.length;
			while (l--) {
				if (todos[l].completed) {
					todos.splice(l, 1);
				}
			}
		},
		// Accepts an element from inside the ".item" div and
		// returns the corresponding todo in the todos array
		getTodo: function(element, callback) {
			var id = $(element).closest('li').data('id');
			$.each(this.model.todos, function(i, val) {
				if (val.id === id) {
					callback.apply(App, arguments);
					return false;
				}
			});
		},
		create: function(event) {
			var $input = $(this),
				value = $.trim($input.val());
			if (event.which !== App.ENTER_KEY || !value) {
				return;
			}
			App.model.todos.push({
				id: Utils.uuid(),
				title: value,
				completed: false
			});
			$input.val('');
		},
		toggle: function() {
			App.getTodo(this, function(i, todo) {
				todo.completed = !todo.completed;
			});
		},
		edit: function() {
			$(this).closest('li').addClass('editing').find('.edit').focus();
		},
		blurOnEnter: function(event) {
			if (event.keyCode === App.ENTER_KEY) {
				event.target.blur();
			}
		},
		update: function() {
			var value = $.trim($(this).removeClass('editing').val());
			App.getTodo(this, function(i) {
				if (value) {
					this.model.todos[i].title = val;
				} else {
					this.model.todos.splice(i, 1);
				}
			});
		},
		destroy: function() {
			App.getTodo(this, function(i) {
				this.model.todos.splice(i, 1);
			});
		}
	};

	App.init();

});
