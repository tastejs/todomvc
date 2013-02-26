'use strict';

var ENTER_KEY = 13; //the keycode for ENTER is a constant

//Main view
var TodoView = Spineless.View.extend({
	//constructor function
	init: function (opts) {
		TodoView.super(this, 'init', arguments);

		//serialize the model to localStorage whenever
		//a task is added or a value changes
		this.on('child:* change', function () {
			opts.storage['todos-spineless'] = this.serialize();
		});
	},

	//use the template that already exists in the 
	//HTML under the id #todoapp.
	template: 'todoapp',

	events: {
		//listen to keyup to detect ENTER
		'keyup new-todo': 'addTask',
		//handle the toggle all checkbox
		'click toggle-all': 'toggleAll',
		//handle the clear completed button
		'click clear-completed': 'clearCompleted'
	},

	//handle all the routes in the URL hash
	routes: {
		'/': 'handleRoute',
		'/completed': 'handleRoute',
		'/active': 'handleRoute'
	},

	//add a new task as a subview
	addTask: function (e) {
		//on ENTER key save the task
		if (e.which !== ENTER_KEY) {
			return;
		}

		//empty tasks will not be added, exit early
		if (this['new-todo'].value.trim() === '') {
			return;
		}

		//create a new ItemView and add it as a subview
		this.addChild(new ItemView({
			text: this['new-todo'].value,
			//superview refers to the parentNode to use
			//in the DOM. Use the ul#todo-list
			superview: this['todo-list']
		}));

		//clear textbox value
		this['new-todo'].value = '';
	},

	//route handler. forwards route value to filter
	handleRoute: function (route) {
		//default to 'all'
		var link = route.substr(1) || 'all';
		this.filter(link);
	},

	//set the filter on this model
	filter: function (type) {
		this.model.filter = type;

		//reset the selected class, select the active filter
		this.all.className = this.active.className = this.completed.className = '';
		this[type].className = 'selected';
	},

	//handle the toggle all button
	toggleAll: function () {
		//uncomplete flag
		var markAsUncomplete = true;

		//look through children for any active tasks
		//then exit the loop
		for (var i = 0; i < this.children.length; ++i) {
			if (!this.children[i].model.done) {
				markAsUncomplete = false;
				break;
			}
		}

		//set the completed status of the task
		//will mark everything as uncomplete if
		//every task is complete, otherwise every task
		//will be marked as complete
		for (i = 0; i < this.children.length; ++i) {
			this.children[i].set('done', !markAsUncomplete);
		}
	},

	//clear every task marked as complete
	clearCompleted: function () {
		for (var i = 0; i < this.children.length; ++i) {
			if (this.children[i].model.done) {
				//remove the child from heirarchy
				this.removeChild(this.children[i]);
			}
		}
	},

	//take a string of JSON and turn it into
	//tasks.
	unserialize: function (blob) {
		var data = JSON.parse(blob);

		//empty data, exit early
		if (!data.children) { return; }

		for (var i = 0; i < data.children.length; ++i) {
			//create and add an ItemView for each
			//task in the blob
			this.addChild(new ItemView({
				text: data.children[i].text,
				done: data.children[i].done,
				superview: this['todo-list']
			}));
		}
	},

	//special function, render will be called when a bound object has
	//changed value or if the view heirarchy has
	//a view added/removed
	render: function () {
		TodoView.super(this, 'render');

		var left = 0;
		var completed = 0;

		//loop through children and count how many
		//completed and how many left.
		for (var i = 0; i < this.children.length; ++i) {
			if (!this.children[i].model.done) {
				left++;
			} else {
				completed++;
			}
		}

		//add the counts to the footer info
		this['todo-count'].innerHTML = '<strong>' + left + '</strong> item' + (left !== 1 ? 's' : '') + ' left';
		this['clear-completed'].innerText = 'Clear Completed (' + completed + ')';

		//hide the clear button if nothing to clear
		if (completed === 0) { this['clear-completed'].style.display = 'none'; }
		else { this['clear-completed'].style.display = 'block'; }

		//hide the footer and main if no tasks
		this.footer.style.display = this.main.style.display = (this.children.length ? "block" : "none");

		//everything is completed, check the toggle-all box
		this['toggle-all'].checked = (completed === this.children.length);
	}
});

//View for individual task items
var ItemView = Spineless.View.extend({
	//this object will form the model object
	defaults: {
		'text': '', 
		'done': false
	},

	//define the HTML template in JSON.
	template: [
		{tag: 'li', id: 'li', children: [
			{className: 'view', children: [
				{id: 'done', tag: 'input', type: 'checkbox', className: 'toggle'},
				{id: 'label', tag: 'label'},
				{id: 'remove', tag: 'button', className: 'destroy'}
			]},

			{tag: 'input', className: 'edit', id: 'text', 'autofocus': true}
		]}
	],

	events: {
		//remove button should simply remove this view
		//from the heirarchy. (removeFromParent is internal to Views)
		'click remove': 'removeFromParent',
		//show the edit textbox
		'dblclick label': 'edit',
		//hide the edit textbox
		'blur text': 'close',
		//if ENTER has been called, hide textbox
		'keyup text': 'close'
	},

	edit: function () {
		//make sure edit box has the current task value
		this.text.value = this.model.text;
		//add the class `editing` to the <li>
		this.li.className += ' editing';
	},

	close: function (e) {
		//check for ENTER key. Only exit if this handler
		//was invoked by `onkeyup`.
		if (e.which && e.which !== ENTER_KEY) {
			return;
		}

		//set the class name back to the original value
		this.li.className = this.model.done ? 'completed' : '';

		//remove this task view if it was empty
		if (this.text.value.trim() === '') {
			this.removeFromParent();
		}
	},

	render: function () {
		//set the label and checkbox to the value in the model.
		this.label.innerText = this.model.text;
		this.done.checked = this.model.done;

		//show or hide the view based on the parent filter
		var style = this.container.style;
		if (this.parent.model.filter === 'completed') {
			style.display = !this.model.done ? 'none' : 'block';
		} else if (this.parent.model.filter === 'active') {
			style.display = this.model.done ? 'none' : 'block';
		} else {
			style.display = 'block';
		}

		//add or remove the completed class depending on
		//whether the task is complete or not. Need to use
		//classList to ensure other classes are not wiped.
		if (this.model.done && !this.li.classList.contains('completed')) {
			this.li.classList.add('completed');
		} else if (!this.model.done) {
			this.li.classList.remove('completed');
		}
	}
});

//create the main TodoView instance
//pass localStorage object, else use
//an empty object.
var todo = new TodoView({
	storage: localStorage || {}
});

//if the data already exists, unserialize it
if (localStorage['todos-spineless']) {
	todo.unserialize(localStorage['todos-spineless']);
}