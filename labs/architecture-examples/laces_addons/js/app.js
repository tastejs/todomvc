/*global jQuery, Handlebars, LacesModel */
jQuery(function($) {
	'use strict';

	var Utils = {
		// https://gist.github.com/1308368
		uuid: function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b},
		pluralize: function( count, word ) {
			return count === 1 ? word : word + 's';
		},
	};


	Handlebars.registerHelper('iter', function(context, options) {
		var fn = options.fn, inverse = options.inverse;
		var ret = '', data;
		if (context && context.length > 0) {
			for (var i = 0, length = context.length; i < length; i++) {
				data = context[i] || {};
				data.index = i;
				ret = ret + fn(data);
			}
		} else {
			ret = inverse(this);
		}
		return ret;
	});


	function TodosModel() {
		this.set('todos', new LacesLocalArray('todos-lacesjs'));
		this.set('todoCount', function() { return this.todos.length; });
		this.set('hasTodos', function() { return this.todoCount > 0; });
		this.set('numActiveTodos', function() {
			var count = 0;
			$.each(this.todos, function(i, value) {
				if (!value.completed) {
					count++;
				}
			});
			return count;
		});
		this.set('activeTodoWord', function() {
			return Utils.pluralize(this.numActiveTodos, 'item');
		});
		this.set('numCompletedTodos', function() {
			return this.todoCount - this.numActiveTodos;
		});
	}

	TodosModel.prototype = new LacesModel();
	TodosModel.prototype.constructor = TodosModel;


	var App = {
		init: function() {
			this.ENTER_KEY = 13;
			this.model = new TodosModel();
			this.createTies();
			this.bindEvents();
		},
		createTies: function() {
			var todoApp = document.getElementById('todoapp');

			var mainTie = new LacesTie(this.model, Handlebars.compile($('#main-template').html()));
			todoApp.appendChild(mainTie.render());

			var todoTie = new LacesTie(this.model, Handlebars.compile($('#todo-template').html()));
			this.model.bind('change:todos', function(event) {
				var todoList = document.getElementById('todo-list');
				todoList.innerHTML = '';
				todoList.appendChild(todoTie.render());
			}, { initialFire: true });

			var footerTie = new LacesTie(this.model, Handlebars.compile($('#footer-template').html()));
			todoApp.appendChild(footerTie.render());
		},
		bindEvents: function() {
			$('#new-todo').on('keyup', this.create);
			$('#toggle-all').on('change', this.toggleAll);
			$('#todoapp').on('click', '#clear-completed', this.destroyCompleted);
			$('#todo-list').on('change', '.toggle', this.toggle);
			$('#todo-list').on('click', '.destroy', this.destroy);
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
		destroy: function() {
			App.getTodo(this, function(i) {
				this.model.todos.splice(i, 1);
			});
		}
	};

	App.init();

});
