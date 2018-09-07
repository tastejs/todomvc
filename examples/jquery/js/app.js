/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			// creating a variable called todos and storing it on the App object
			this.todos = util.store('todos-jquery');
			this.todoTemplate = Handlebars.compile($('#todo-template').html());
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
			this.bindEvents();

			new Router({
				'/:filter': function (filter) {
					this.filter = filter;
					this.render();
				}.bind(this)
			}).init('/all');
		},
		bindEvents: function () {
			$('.new-todo').on('keyup', this.create.bind(this));
			$('.toggle-all').on('change', this.toggleAll.bind(this));
			$('.footer').on('click', '.clear-completed', this.destroyCompleted.bind(this));
			$('.todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('dblclick', 'label', this.editingMode.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));
		},
		render: function () {
			var todos = this.getFilteredTodos();
			$('.todo-list').html(this.todoTemplate(todos));
			$('.main').toggle(todos.length > 0);
			$('.toggle-all').prop('checked', this.getActiveTodos().length === 0);
			this.renderFooter();
			$('.new-todo').focus();
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
			var template = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
				filter: this.filter
			});

			$('.footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');

			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		getIndexFromEl: function (el) {
			// el is the element that was clicked, in this case the delete button
			// this is taking that button,
			// looks for the closest parent li element,
			// and then it grabs and return the data labeled as id
			// this data labeled as id is set to the variable id
			var id = $(el).closest('li').data('id');
			// this is grabbing the todos array on the object and setting it to the value todos
			var todos = this.todos;
			// setting i to the length of the todos array
			var i = todos.length;

			// this is a loop that will run as long as the decrementer of i is true
			while (i--) {
				// we return the value of i (the positionj/index) if the data id on the todo item is equal to the id we'd saved above
				if (todos[i].id === id) {
					// returning that position number of the matching todo
					return i;
				}
			}
		},
		create: function (e) {
			// target tells us which element initiated the event
			// in this case it is a form input element with class of new-todo
			// this new-todo is assigned to the jQuery variable $input
			var $input = $(e.target);
			// val take the value of what's saved in $input
			// trim removes any whitespace from beginning and end of input
			// this trimmed input value is saved to variable val
			var val = $input.val().trim();
			// which tell us which key was pressed
			// enter key is saved as a global variable equivalent to the value 27 which is the character code of its keypress
			// if the enter key was not pressed then return and accept more input
			// if the current key is still not being pressed then accept more input
			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			// add an item to the todo list array
			this.todos.push({
				// this is where the long random id number comes from
				id: util.uuid(),
				// this is the input text that was saved in the section above
				title: val,
				// by default a todo is saved as incomplete
				completed: false
			});

			// this empty's the value of the input string after the todo has been saved to the list
			$input.val('');

			// this renders the new, updated todo list
			this.render();
		},
		toggle: function (e) {
			// a toggle occurs on the App object
			// an event is passed
			// we're passing the event target to the getIndexFromEl function
			// the event target in this case is the toggle button which was selected
			// the getIndexFromEl method will return the position of the todo item that was selected
			// this position is set to the variable i
			var i = this.getIndexFromEl(e.target);
			// the completed value on this todo item is flipped to its opposite.
			// If it was marked complete it is not incomplete and vice versa
			this.todos[i].completed = !this.todos[i].completed;
			// this renders the current, updated todo list
			this.render();
		},
		editingMode: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			// puts caret at end of input
			var tmpStr = $input.val();
			$input.val('');
			$input.val(tmpStr);
			$input.focus();
		},
		editKeyup: function (e) {
			// if enter is pressed the target is blurred
			if (e.which === ENTER_KEY) {
				// in this case the target is the input field and after enter key is pressed the input field loses focus
				e.target.blur();
			}
			//  if the escape key is pressed
			if (e.which === ESCAPE_KEY) {
				// the target, the input field, has its data field of abort udated to true, and then the input field loses focus
				$(e.target).data('abort', true).blur();
			}
		},
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if ($el.data('abort')) {
				$el.data('abort', false);
			} else if (!val) {
				this.destroy(e);
				return;
			} else {
				this.todos[this.getIndexFromEl(el)].title = val;
			}

			this.render();
		},
		destroy: function (e) {
			// gets the todos array
			// splice is passed the position/index of the item to be delete, and the number of items to be deleted
			// the 1st argument passed to splice is taken from getIndexFromEl
			// getIndexFromEl is passed the target of the click event
			// after running the getIndexFromEl we now have a position/index number to pass to the first argument of splice
			// this tells us which todo to delete based on its position
			this.todos.splice(this.getIndexFromEl(e.target), 1);
			// this renders/displays the updated todo list to the screen
			this.render();
		}
	};

	// calling the intialize method on the App object to initialize the entire application
	App.init();
});
