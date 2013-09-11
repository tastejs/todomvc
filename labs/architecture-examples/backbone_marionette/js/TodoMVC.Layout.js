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
	Layout.Footer = Backbone.Marionette.ItemView.extend({
		template: '#template-footer',

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			filters: '#filters a'
		},

		events: {
			'click #clear-completed': 'onClearClick'
		},

		collectionEvents: {
			'all': 'render'
		},

		templateHelpers: {
			activeCountLabel: function () {
				return (this.activeCount === 1 ? 'item' : 'items') + ' left';
			}
		},

		initialize: function () {
			this.listenTo(App.vent, 'todoList:filter', this.updateFilterSelection, this);
		},

		serializeData: function () {
			var active = this.collection.getActive().length;
			var total = this.collection.length;

			return {
				activeCount: active,
				totalCount: total,
				completedCount: total - active
			};
		},

		onRender: function () {
			this.$el.parent().toggle(this.collection.length > 0);
			this.updateFilterSelection();
		},

		updateFilterSelection: function () {
			this.ui.filters
				.removeClass('selected')
				.filter('[href="' + (location.hash || '#') + '"]')
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
