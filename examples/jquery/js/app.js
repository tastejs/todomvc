/*global jQuery, Handlebars, Router */
jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	// a utility object, i think
	var util = {
		// a method to generate a random unique id number for todos
		uuid: function () {
			/*jshint bitwise:false */
			// setting variables for i and random
			var i, random;
			// setting uuid to an empty string
			var uuid = '';
			// for loop to run 32 time
			for (i = 0; i < 32; i++) {
				// Math.random generates a random floating number between 0 (inclusive) and 1 (not inclusive)
				// that floating number is multipled by 16
				// not sure what the | 0 means
				random = Math.random() * 16 | 0;
				// after the 8th, 12th, 16th, or 20th iteration
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					// add a dash (-) to the uuid string
					uuid += '-';
				}
				// if on the 12th iteration add a 4 to the uuid string
				// or if it's 16 give a random number
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			// return the uuid
			return uuid;
		},
		// this method accepts two arguments, a count, and a word
		// the count will come from the activeTodoCount and the word is 'item'
		pluralize: function (count, word) {
			// if activeTodoCount is 1 it'll read '1 item'
			 // otherwise it'll read '[the number] words' (plural)
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
			// when a keyup occurs on the .new-todo input the create method is called and bound to the App
			$('.new-todo').on('keyup', this.create.bind(this));
			$('.toggle-all').on('change', this.toggleAll.bind(this));
			$('.footer').on('click', '.clear-completed', this.destroyCompleted.bind(this));
			$('.todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				// an event listener is triggered when the label element inside the todo-list is double clicked
				// it calls the editingMethod method which is bound to App
				.on('dblclick', 'label', this.editingMode.bind(this))
				// an event listener is triggered when the input with class of edit has a keyup event triggered
				// this calls the editKeyUp method which is bound to the App
				.on('keyup', '.edit', this.editKeyup.bind(this))
				// when the .edit input within the todo list loses focus
				// it could lose focus from the editKeyup if the user either clicks Enter, Escape, or clicks outside the input field
				// the update method bound to the App is called
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));
		},
		render: function () {
			// gets the filtered todos - either active, completed, or all depending on selection
			var todos = this.getFilteredTodos();
			// into the .todo-list ul element we are injecting html
			$('.todo-list').html(this.todoTemplate(todos));
			// shows/hides the .main element depending whether a todo(s) exists or not
			// when you start the app it is toggled off because there are no todos
			$('.main').toggle(todos.length > 0);
			// sets the value of the checked element inside the .toggle-all element.
			// if the number of todos in the getActiveTodos method is 0 that means all todos have been completed
			// therefore the checked property will be true and the toggle-all button will be in the toggled setting
			$('.toggle-all').prop('checked', this.getActiveTodos().length === 0);
			// here we call renderFooter to... render the footer
			this.renderFooter();
			// the focus is set to the .new-todo input field
			$('.new-todo').focus();
			// we store the list of todos into local storage
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			// gets the number of todos in the todo list
			var todoCount = this.todos.length;
			// gets the number of active todos
			var activeTodoCount = this.getActiveTodos().length;
			// sets the footer template
			var template = this.footerTemplate({
				// active todo count
				activeTodoCount: activeTodoCount,
				// determines if item(s) is singular or plural based on active todo count.
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				// determines completed todos by subtracting active from total
				completedTodos: todoCount - activeTodoCount,
				// tells which filter to highlight
				filter: this.filter
			});
			// if there are todos, it will show the footer.
			// then it is injecting the template from above into the footer
			$('.footer').toggle(todoCount > 0).html(template);
		},
		toggleAll: function (e) {
			// prop is getting the value of the checked property on the target (#toggle-all)
			// the value is either true or false depending on if you are toggling all on or off
			// this true or false value is saved to isChecked
			var isChecked = $(e.target).prop('checked');

			// for each todo item the completed property is set to the value of isChecked which again is either true or false
			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			// renders the updated list
			this.render();
		},
		getActiveTodos: function () {
			// this selects only the todo items that have a completed property with a value of false and returns them
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			// this selects only the todo items that have a completed property with a value of true and returns them
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
		getFilteredTodos: function () {
			// if the filter is active it runs the getActiveTodos method
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			// if the filter is completed it runs the getCoompletedTodos method
			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			// if neither active or completed filters are selected then it displays all todos
			return this.todos;
		},
		destroyCompleted: function () {
			// this runs the getActiveTodos method
			// returns only todos with a completed property of false
			// this array of active todos is set to the todos array and the the updated todo list is rendered again
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
			// if the value is empty then return and accept more input
			// if Enter is pressed then this statement is not true and we move to the next step in the code below and add an item to the todo list with push
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
			// the double clicked item, which is the label, looks to the nearest li element
			// an .editing class is added to this li element
			// from the element with the editing class added it then finds the input with a class edit
			// this .edit input is assigned to the jQuery variable called input
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			// gets the current value of the input and assigns it to tmpStr
			var tmpStr = $input.val();
			// sets value of input to empty string
			$input.val('');
			// sets the saved value of tmpStr into the input field
			$input.val(tmpStr);
			// the input field now triggers the focus event so the curser will now be in the input field
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
			// the input is assigned to el
			var el = e.target;
			// and is set to a javascript variable
			var $el = $(el);
			// the value of the input is trimmed and saved to val
			var val = $el.val().trim();

			// if the data for abort is true
			if ($el.data('abort')) {
				// then data's value is flipped to false and nothing changes
				$el.data('abort', false);
				// otherwise if there's no value then destroy that todo element
			} else if (!val) {
				this.destroy(e);
				return;
				// otherwise set the updated value of the title to the new, edited value
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
