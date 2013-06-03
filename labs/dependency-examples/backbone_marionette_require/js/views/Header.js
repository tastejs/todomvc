/*global define */

define([
	'marionette',
	'templates'
], function (Marionette, templates) {
	'use strict';

	return Marionette.ItemView.extend({
		template: templates.header,

		ui: {
			input: '#new-todo'
		},

		events: {
			'keypress #new-todo': 'onInputKeypress'
		},

		onInputKeypress: function (event) {
			var ENTER_KEY = 13;
			var todoText = this.ui.input.val().trim();

			if (event.which === ENTER_KEY && todoText) {
				this.collection.create({
					title: todoText
				});

				this.ui.input.val('');
			}
		}
	});
});
