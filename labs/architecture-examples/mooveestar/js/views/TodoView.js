/*global MooVeeStar */
/*jshint browser:true, mootools:true */
(function (window) {

	'use strict';

	window.views = window.views || {};

	window.views.TodoView = new Class({

		Extends: MooVeeStar.View,

		template: 'todo',

		options: {
			autoattach: false
		},

		events: {
			'click:relay([data-action])': 'onActionClick',
			'dblclick': 'onDblClick',
			'elements.input:keydown': 'onInputKeydown',
			'elements.input:blur': 'onInputBlur',
			'model:change': 'render'
		},

		initialize: function () {
			this.parent.apply(this, arguments);
			this.elements.input = this.element.getElement('input.edit');
			this.attach();
		},

		render: function () {
			this.element.toggleClass('completed', this.model.get('completed'));
			this.parent();
		},

		// Stop editing the title, saving if we want. If we're saving and the input
		// it empty, then destroy the model.
		// 
		// We don't need to worry about destroying the view here, because destroying
		// a model in a collection will automatically remove that model from any collection,
		// and our AppView happens to be removing the views whenever it hears a change to
		// our collection.
		endEdit: function (save) {
			if (this.element.hasClass('editing')) {
				this.element.removeClass('editing');
				this.elements.input.blur();
				if (save) {
					var title = this.elements.input.get('value').trim();
					if (title) {
						this.model.set('title', title);
					} else {
						this.model.destroy();
					}
				} else {
					this.render();
				}
			}
		},

		// When we click a `[data-action]` element in our view,
		// check to see if what action we want to take
		onActionClick: function (e, target) {
			var action = target.get('data-action');
			if (action === 'delete') {
				// See the above note for endEdit for why we don't need to destroy the view here.
				this.model.destroy(); 
			} else if (action === 'toggle-completed') {
				this.model.set('completed', !this.model.get('completed'));
			}
		},

		// When we dblclick our view, go into editing mode if we're not already
		onDblClick: function (e) {
			if (!this.element.hasClass('editing')) {
				this.element.addClass('editing');
				this.elements.input.focus();
			}
		},

		// Save when we blur our editing input
		onInputBlur: function (e) {
			this.endEdit(true);
		},

		// When we hit enter or esc, end editing, saving when it's enter
		onInputKeydown: function (e) {
			if (e.key === 'enter' || e.key === 'esc') {
				this.endEdit(e.key === 'enter');
			}
		}

	});


})(window);
