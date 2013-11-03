/*jshint newcap:false */
/*global mask, Compo */

/**
 *	Extend INPUT tag to edit a todo's title
 *		- format string
 *		- complete edit on ENTER
 *		- complete edit on BLUR
 *
 *	Used as
 *		- a main application's input
 *		- single todo item editor
 *
 *	Public Events
 *		- cancel: input interrupted
 *		- enter : input formatted and completed
 *
 */

(function () {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	mask.registerHandler('todo:input', Compo({
		tagName: 'input',
		attr: {
			type: 'text',
			value: '~[title]',

			// Clear input after edit, `true` for main input, `false` for todo's edit.
			preserve: false
		},
		events: {
			'keydown': function (event) {
				switch (event.which) {
				case ENTER_KEY:
					this.save();

					// prevent IE from button click - `Clear Completed`
					event.preventDefault();
					break;
				case ESCAPE_KEY:
					this.cancel();
					break;
				}
			},
			'blur': 'save'
		},
		focus: function focus() {
			this.$.focus();
		},

		cancel: function cancel() {
			this.$.trigger('cancel');
			this.afterEdit();
		},

		save: function save() {
			var value = this.$.val().trim();

			this.$.trigger('enter', value);
			this.afterEdit();
		},

		afterEdit: function () {

			this.$.val(this.attr.preserve ? this.model.title : '');
		}

	}));

}());
