/*global TodoMVC */
'use strict';

TodoMVC.module('Layout', function (Layout, App, Backbone) {
	// Layout Header View
	// ------------------
	Layout.Header = Backbone.Marionette.ItemView.extend({
		template: '#template-header',

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			input: '#new-todo'
		},

		events: {
			'keypress #new-todo': 'onInputKeypress'
		},

		onInputKeypress: function (e) {
			var ENTER_KEY = 13,
			todoText = this.ui.input.val().trim();

			if (e.which === ENTER_KEY && todoText) {
				this.collection.create({
					title: todoText
				});
				this.ui.input.val('');
			}
		}
	});

	// Layout Footer View
	// ------------------
	Layout.Footer = Backbone.Marionette.Layout.extend({
		template: '#template-footer',

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			count: '#todo-count strong',
			itemsString: '#todo-count span',
			filters: '#filters a',
			clearCompleted: '#clear-completed'
		},

		events: {
			'click #clear-completed': 'onClearClick'
		},

		initialize: function () {
			this.listenTo(App.vent, 'todoList:filter', this.updateFilterSelection, this);
			this.listenTo(this.collection, 'all', this.updateCount, this);
		},

		onRender: function () {
			this.updateCount();
		},

		updateCount: function () {
			var count = this.collection.getActive().length;
			var length = this.collection.length;
			var completed = length - count;

			this.ui.count.html(count);
			this.ui.itemsString.html(' ' + (count === 1 ? 'item' : 'items') + ' left');
			this.$el.parent().toggle(length > 0);

			if (completed > 0) {
				this.ui.clearCompleted.show();
				this.ui.clearCompleted.html('Clear completed (' + completed + ')');
			} else {
				this.ui.clearCompleted.hide();
			}

		},

		updateFilterSelection: function (filter) {
			this.ui.filters
				.removeClass('selected')
				.filter('[href="#' + filter + '"]')
				.addClass('selected');
		},

		onClearClick: function () {
			var completed = this.collection.getCompleted();
			completed.forEach(function (todo) {
				todo.destroy();
			});
		}
	});
});
