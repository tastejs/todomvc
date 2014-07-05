/*global define */
define([
	'marionette',
	'templates'
], function (Marionette, templates) {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	return Marionette.CompositeView.extend({
		tagName: 'li',

		template: templates.todoItemView,

		value: '',

		ui: {
			edit: '.edit'
		},

		events: {
			'click .toggle': 'toggle',
			'click .destroy': 'destroy',
			'dblclick label': 'onEditDblclick',
			'keydown .edit': 'onEditKeyDown',
			'blur .edit': 'onEditBlur'
		},

		initialize: function () {
			this.value = this.model.get('title');

			this.listenTo(this.model, 'change', this.render, this);
		},

		onRender: function () {
			this.$el
				.removeClass('active completed')
				.addClass(this.model.get('completed') ? 'completed' : 'active');
		},

		destroy: function () {
			this.model.destroy();
		},

		toggle: function () {
			this.model.toggle().save();
		},

		toggleEditingMode: function () {
			this.$el.toggleClass('editing');
		},

		onEditDblclick: function () {
			this.toggleEditingMode();

			this.ui.edit.focus().val(this.value);
		},

		onEditKeyDown: function (event) {
			if (event.which === ENTER_KEY) {
				this.ui.edit.trigger('blur');
			}

			if (event.which === ESCAPE_KEY) {
				this.ui.edit.val(this.model.get('title'));
				this.ui.edit.trigger('blur');
			}
		},

		onEditBlur: function (event) {
			this.value = event.target.value.trim();

			if (this.value) {
				this.model.set('title', this.value).save();
			} else {
				this.destroy();
			}

			this.toggleEditingMode();
		}
	});
});
