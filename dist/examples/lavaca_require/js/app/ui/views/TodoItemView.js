/*global define */

define(function (require) {
	'use strict';

	// constants
	var ENTER_KEY = 13;
	var ESC_KEY = 27;

	var View = require('lavaca/mvc/View');
	require('rdust!templates/todo-item');

	/**
	 * Todos view type
	 * @class app.ui.views.TodosView
	 * @super Lavaca.mvc.View
	 */
	var TodosView = View.extend(function TodosView() {
		// Call the super class' constructor
		View.apply(this, arguments);

		this.mapEvent({
			'input.toggle': {
				change: toggleComplete.bind(this)
			},
			'self': {
				dblclick: startEditing.bind(this)
			},
			'input.edit': {
				keydown: editTodo.bind(this),
				blur: endEditing.bind(this)
			},
			'button.destroy': {
				click: remove.bind(this)
			},
			model: {
				'change': this.onModelChange.bind(this)
			}
		});

		this.render();
	}, {
		/**
		 * The name for the template used in the view
		 * @property template
		 * @type String
		 */
		template: 'templates/todo-item',

		/**
		 * A class name added to the view container
		 * @property className
		 * @type String
		 */
		className: 'todo-item',

		/**
		 * Executes when the template renders successfully
		 * @method onRenderSuccess
		 */
		onRenderSuccess: function () {
			View.prototype.onRenderSuccess.apply(this, arguments);
			this.checkIfCompleted();
		},

		/**
		 * Redraws template with model
		 * @method redraw
		 */
		redraw: function () {
			View.prototype.redraw.apply(this, arguments)
				.then(this.checkIfCompleted.bind(this));
		},

		/**
		 * Adds/Removes a completed class to view element, this wouldnt be needed if
		 * we restructured some DOM or CSS
		 * @method checkIfCompleted
		 */
		checkIfCompleted: function () {
			this.$input = this.el.find('.edit'); // cache input element
			if (this.model.get('completed')) {
				this.el.addClass('completed');
			} else {
				this.el.removeClass('completed');
			}
		},

		/**
		 * Redraws template when model changes
		 * @method onModelChange
		 */
		onModelChange: function () {
			if (this.model) {
				this.redraw();
			}
		}
	});

	// Set the completion state of a single model
	function toggleComplete(e) {
		this.model.set('completed', e.currentTarget.checked);
	}

	// Start editing a Todo
	function startEditing() {
		this.el.addClass('editing');

		this.$input.focus();

		// resetting value fixes text selection on focus
		this.$input.val(this.model.get('title'));
	}

	// Commit the edit when the ENTER key is pressed
	function editTodo(e) {
		if (e.which === ENTER_KEY) {
			endEditing.call(this);
		} else if (e.which === ESC_KEY) {
			this.$input.val(this.model.get('title'));
			endEditing.call(this);
		}
	}

	function endEditing() {
		var trimmedValue = this.$input.val().trim();

		this.el.removeClass('editing');

		if (trimmedValue) {
			this.model.set('title', trimmedValue);
		} else {
			remove.call(this);
		}
	}

	// Remove the Todo when the 'x' is clicked
	function remove() {
		this.trigger('removeView', {model: this.model});
	}

	return TodosView;
});
