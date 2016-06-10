'use strict';

var View = require('ampersand-view');
var todoTemplate = require('../templates/todo.jade');
var ENTER_KEY = 13;
var ESC_KEY = 27;


module.exports = View.extend({
	// note that Ampersand is extrememly flexible with templating.
	// This template property can be:
	//   1. A plain HTML string
	//   2. A function that returns an HTML string
	//   3. A function that returns a DOM element
	//
	// Here we're using a jade template. A browserify transform
	// called 'jadeify' lets us require a ".jade" file as if
	// it were a module and it will compile it to a function
	// for us. This function returns HTML as per #2 above.
	template: todoTemplate,
	// Events work like backbone they're all delegated to
	// root element.
	events: {
		'change [data-hook=checkbox]': 'handleCheckboxChange',
		'click [data-hook=action-delete]': 'handleDeleteClick',
		'dblclick [data-hook=title]': 'handleDoubleClick',
		'keyup [data-hook=input]': 'handleKeypress',
		'blur [data-hook=input]': 'handleBlur'
	},
	// Declarative data bindings
	bindings: {
		'model.title': [
			{
				type: 'text',
				hook: 'title'
			},
			{
				type: 'value',
				hook: 'input'
			}
		],
		'model.editing': [
			{
				type: 'toggle',
				yes: '[data-hook=input]',
				no: '[data-hook=view]'
			},
			{
				type: 'booleanClass'
			}
		],
		'model.completed': [
			{
				type: 'booleanAttribute',
				name: 'checked',
				hook: 'checkbox'
			},
			{
				type: 'booleanClass'
			}
		]
	},
	render: function () {
		// Render this with template provided.
		// Note that unlike backbone this includes the root element.
		this.renderWithTemplate();
		// cache reference to `input` for speed/convenience
		this.input = this.queryByHook('input');
	},
	handleCheckboxChange: function (e) {
		this.model.completed = e.target.checked;
	},
	handleDeleteClick: function () {
		this.model.destroy();
	},
	// Just put us in edit mode and focus
	handleDoubleClick: function () {
		this.model.editing = true;
		this.input.focus();
	},
	handleKeypress: function (e) {
		if (e.which === ENTER_KEY) {
			this.input.blur();
		} else if (e.which === ESC_KEY) {
			this.input.value = this.model.title;
			this.input.blur();
		}
	},
	// Since we always blur even in the other
	// scenarios we use this as a 'save' point.
	handleBlur: function () {
		var val = this.input.value.trim();
		if (val) {
			this.model.set({
				title: val,
				editing: false
			});
		} else {
			this.model.destroy();
		}
	}
});
