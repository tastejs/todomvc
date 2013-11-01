/*global define */

define(function (require) {
	'use strict';

	// constants
	var ENTER_KEY = 13;

	var PageView = require('lavaca/mvc/PageView');
	var TodosCollectionView = require('app/ui/views/TodosCollectionView');
	require('rdust!templates/todos');

	/**
	 * Todos view type
	 * @class app.ui.views.TodosView
	 * @super Lavaca.mvc.PageView
	 */
	var TodosView = PageView.extend(function TodosView() {
		// Call the super class' constructor
		PageView.apply(this, arguments);

		// Map collection view to #todo-list
		this.mapChildView('#todo-list', TodosCollectionView, this.model);

		// Map DOM and model events to event handler functions declared below
		this.mapEvent({
			'#new-todo': {
				keypress: addTodo.bind(this)
			},
			'input#toggle-all': {
				change: toggleAll.bind(this)
			},
			'button#clear-completed': {
				click: removeCompleted.bind(this)
			},
			model: {
				'addItem': modelChange.bind(this),
				'moveItem': modelChange.bind(this),
				'removeItem': modelChange.bind(this),
				'changeItem': modelChange.bind(this)
			}
		});

		this.countIsZero = !this.model.count();
	}, {
		/**
		 * @field {String} template
		 * @default 'example'
		 * The name of the template used by the view
		 */
		template: 'templates/todos',

		/**
		 * @field {String} className
		 * @default 'example'
		 * A class name added to the view container
		 */
		className: 'todos'
	});

	/* ---- Event Handlers ---- */

	// Whenever the model changes, set a timeout that will re-render the view's
	// template and update the DOM. Clear the timeout with every call to make sure
	// that the redraw only happens once even if multiple changes are made in the
	// same run loop
	function modelChange() {
		clearTimeout(this.redrawTimeout);

		this.redrawTimeout = setTimeout(function () {
			var count = this.model.count();

			if (count === 0) {
				this.countIsZero = true;
				this.redraw();
			} else if (this.countIsZero && count) {
				this.countIsZero = false;
				this.redraw();
			} else {
				this.redraw('#footer, #toggle-all');
			}
		}.bind(this));
	}

	// Create a new Todo when the ENTER
	// key is pressed
	function addTodo(e) {
		var input = e.currentTarget;
		var val;

		if (e.which === ENTER_KEY) {
			val = input.value.trim();

			if (val) {
				this.model.add({
					id: Date.now(),
					title: val,
					completed: false
				});

				input.value = '';
			}

			e.preventDefault();
		}
	}

	// Set the completion state of all models
	function toggleAll(e) {
		this.model.each(function (index, model) {
			model.set('completed', e.currentTarget.checked);
		});
	}

	// Remove all completed Todos
	function removeCompleted() {
		this.model.removeCompleted();
	}

	return TodosView;
});
