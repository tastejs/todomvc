/*global Router, $$, $ */
(function (window) {
	'use strict';

	/**
	 * Takes a model and view and acts as the controller between them
	 *
	 * @constructor
	 * @param {object} model The model constructor
	 * @param {object} view The view constructor
	 */
	function Controller(model, view) {
		this.model = model;
		this.view = view;

		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;

		this.$main = $$('#main');
		this.$toggleAll = $$('#toggle-all');
		this.$todoList = $$('#todo-list');
		this.$todoItemCounter = $$('#todo-count');
		this.$clearCompleted = $$('#clear-completed');
		this.$footer = $$('#footer');

		this.router = new Router();
		this.router.init();

		window.addEventListener('load', function () {
			this._updateFilterState();
		}.bind(this));

		// Couldn't figure out how to get flatiron to run some code on all pages. I
		// tried '*', but then it overwrites ALL handlers for all the other pages
		// and only runs this.
		window.addEventListener('hashchange', function () {
			this._updateFilterState();
		}.bind(this));

		// Make sure on page load we start with a hash to trigger the flatiron and
		// onhashchange routes
		if (window.location.href.indexOf('#') === -1) {
			window.location.hash = '#/';
		}
	}

	/**
	 * An event to fire on load. Will get all items and display them in the
	 * todo-list
	 */
	Controller.prototype.showAll = function () {
		this.model.read(function (data) {
			this.$todoList.innerHTML = this.view.show(data);
		}.bind(this));
	};

	/**
	 * Renders all active tasks
	 */
	Controller.prototype.showActive = function () {
		this.model.read({ completed: 0 }, function (data) {
			this.$todoList.innerHTML = this.view.show(data);
		}.bind(this));
	};

	/**
	 * Renders all completed tasks
	 */
	Controller.prototype.showCompleted = function () {
		this.model.read({ completed: 1 }, function (data) {
			this.$todoList.innerHTML = this.view.show(data);
		}.bind(this));
	};

	/**
	 * An event to fire whenever you want to add an item. Simply pass in the event
	 * object and it'll handle the DOM insertion and saving of the new item.
	 *
	 * @param {object} e The event object
	 */
	Controller.prototype.addItem = function (e) {
		var input = $$('#new-todo');
		var title = title || '';

		if (e.keyCode === this.ENTER_KEY) {
			if (e.target.value.trim() === '') {
				return;
			}

			this.model.create(e.target.value, function (data) {
				input.value = '';
				this._filter(true);
			}.bind(this));
		}

	};

	/**
	 * Hides the label text and creates an input to edit the title of the item.
	 * When you hit enter or blur out of the input it saves it and updates the UI
	 * with the new name.
	 *
	 * @param {number} id The id of the item to edit
	 * @param {object} label The label you want to edit the text of
	 */
	Controller.prototype.editItem = function (id, label) {
		var li =  label;

		// This finds the <label>'s parent <li>
		while (li.nodeName !== 'LI') {
			li = li.parentNode;
		}

		var onSaveHandler = function () {
			var value = input.value.trim();
			var discarding = input.dataset.discard;

			if (value.length && !discarding) {
				this.model.update(id, { title: input.value });

				// Instead of re-rendering the whole view just update
				// this piece of it
				label.innerHTML = value;
			} else if (value.length === 0) {
				// No value was entered in the input. We'll remove the todo item.
				this.removeItem(id);
			}

			// Remove the input since we no longer need it
			// Less DOM means faster rendering
			li.removeChild(input);

			// Remove the editing class
			li.className = li.className.replace('editing', '');
		}.bind(this);

		// Append the editing class
		li.className = li.className + ' editing';

		var input = document.createElement('input');
		input.className = 'edit';

		// Get the innerHTML of the label instead of requesting the data from the
		// ORM. If this were a real DB this would save a lot of time and would avoid
		// a spinner gif.
		input.value = label.innerHTML;

		li.appendChild(input);

		input.addEventListener('blur', onSaveHandler);

		input.addEventListener('keypress', function (e) {
			if (e.keyCode === this.ENTER_KEY) {
				// Remove the cursor from the input when you hit enter just like if it
				// were a real form
				input.blur();
			}

			if (e.keyCode === this.ESCAPE_KEY) {
				// Discard the changes
				input.dataset.discard = true;
				input.blur();
			}
		}.bind(this));

		input.focus();
	};

	/**
	 * By giving it an ID it'll find the DOM element matching that ID,
	 * remove it from the DOM and also remove it from storage.
	 *
	 * @param {number} id The ID of the item to remove from the DOM and
	 * storage
	 */
	Controller.prototype.removeItem = function (id) {
		this.model.remove(id, function () {
			this.$todoList.removeChild($$('[data-id="' + id + '"]'));
		}.bind(this));

		this._filter();
	};

	/**
	 * Will remove all completed items from the DOM and storage.
	 */
	Controller.prototype.removeCompletedItems = function () {
		this.model.read({ completed: 1 }, function (data) {
			data.forEach(function (item) {
				this.removeItem(item.id);
			}.bind(this));
		}.bind(this));

		this._filter();
	};

	/**
	 * Give it an ID of a model and a checkbox and it will update the item
	 * in storage based on the checkbox's state.
	 *
	 * @param {number} id The ID of the element to complete or uncomplete
	 * @param {object} checkbox The checkbox to check the state of complete
	 *                          or not
	 * @param {boolean|undefined} silent Prevent re-filtering the todo items
	 */
	Controller.prototype.toggleComplete = function (id, checkbox, silent) {
		var completed = checkbox.checked ? 1 : 0;

		this.model.update(id, { completed: completed }, function () {
			var listItem = $$('[data-id="' + id + '"]');

			if (!listItem) {
				return;
			}

			listItem.className = completed ? 'completed' : '';

			// In case it was toggled from an event and not by clicking the checkbox
			listItem.querySelector('input').checked = completed;
		});

		if (!silent) {
			this._filter();
		}
	};

	/**
	 * Will toggle ALL checkboxe's on/off state and completeness of models.
	 * Just pass in the event object.
	 *
	 * @param {object} e The event object
	 */
	Controller.prototype.toggleAll = function (e) {
		var completed = e.target.checked ? 1 : 0;
		var query = 0;

		if (completed === 0) {
			query = 1;
		}

		this.model.read({ completed: query }, function (data) {
			data.forEach(function (item) {
				this.toggleComplete(item.id, e.target, true);
			}.bind(this));
		}.bind(this));

		this._filter();
	};

	/**
	 * Updates the pieces of the page which change depending on the remaining
	 * number of todos.
	 */
	Controller.prototype._updateCount = function () {
		var todos = this.model.getCount();

		this.$todoItemCounter.innerHTML = this.view.itemCounter(todos.active);

		this.$clearCompleted.innerHTML = this.view.clearCompletedButton(todos.completed);
		this.$clearCompleted.style.display = todos.completed > 0 ? 'block' : 'none';

		this.$toggleAll.checked = todos.completed === todos.total;

		this._toggleFrame(todos);
	};

	/**
	 * The main body and footer elements should not be visible when there are no
	 * todos left.
	 *
	 * @param {object} todos Contains a count of all todos, and their statuses.
	 */
	Controller.prototype._toggleFrame = function (todos) {
		var frameDisplay = this.$main.style.display;
		var frameVisible = frameDisplay === 'block' || frameDisplay === '';

		if (todos.total === 0 && frameVisible) {
			this.$main.style.display = 'none';
			this.$footer.style.display = 'none';
		}

		if (todos.total > 0 && !frameVisible) {
			this.$main.style.display = 'block';
			this.$footer.style.display = 'block';
		}
	};

	/**
	 * Re-filters the todo items, based on the active route.
	 * @param {boolean|undefined} force  forces a re-painting of todo items.
	 */
	Controller.prototype._filter = function (force) {
		var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

		// Update the elements on the page, which change with each completed todo
		this._updateCount();

		// If the last active route isn't "All", or we're switching routes, we
		// re-create the todo item elements, calling:
		//   this.show[All|Active|Completed]();
		if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
			this['show' + activeRoute]();
		}

		this._lastActiveRoute = activeRoute;
	};

	/**
	 * Simply updates the filter nav's selected states
	 */
	Controller.prototype._updateFilterState = function () {
		var currentPage = this._getCurrentPage() || '';

		// Store a reference to the active route, allowing us to re-filter todo
		// items as they are marked complete or incomplete.
		this._activeRoute = currentPage;

		if (currentPage === '') {
			this._activeRoute = 'All';
		}

		this._filter();

		// Remove all other selected states. We loop through all of them in case the
		// UI gets in a funky state with two selected.
		$('#filters .selected').each(function (item) {
			item.className = '';
		});

		$$('#filters [href="#/' + currentPage + '"]').className = 'selected';
	};

	 /**
		* A getter for getting the current page
		*/
	Controller.prototype._getCurrentPage = function () {
		return document.location.hash.split('/')[1];
	};

	// Export to window
	window.app.Controller = Controller;
})(window);
