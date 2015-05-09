/*global TodoMVC */
'use strict';

TodoMVC.module('TodoList.Views', function (Views, App, Backbone, Marionette) {
	// Todo List Item View
	// -------------------
	//
	// Display an individual todo item, and respond to changes
	// that are made to the item, including marking completed.
	Views.ItemView = Marionette.ItemView.extend({
		tagName: 'li',
		template: '#template-todoItemView',
		className: function () {
			return this.model.get('completed') ? 'completed' : 'active';
		},

		ui: {
			edit: '.edit',
			destroy: '.destroy',
			label: 'label',
			toggle: '.toggle'
		},

		events: {
			'click @ui.destroy': 'deleteModel',
			'dblclick @ui.label': 'onEditClick',
			'keydown @ui.edit': 'onEditKeypress',
			'focusout @ui.edit': 'onEditFocusout',
			'click @ui.toggle': 'toggle'
		},

		modelEvents: {
			change: 'render'
		},

		deleteModel: function () {
			this.model.destroy();
		},

		toggle: function () {
			this.model.toggle().save();
		},

		onEditClick: function () {
			this.$el.addClass('editing');
			this.ui.edit.focus();
			this.ui.edit.val(this.ui.edit.val());
		},

		onEditFocusout: function () {
			var todoText = this.ui.edit.val().trim();
			if (todoText) {
				this.model.set('title', todoText).save();
				this.$el.removeClass('editing');
			} else {
				this.destroy();
			}
		},

		onEditKeypress: function (e) {
			var ENTER_KEY = 13;
			var ESC_KEY = 27;

			if (e.which === ENTER_KEY) {
				this.onEditFocusout();
				return;
			}

			if (e.which === ESC_KEY) {
				this.ui.edit.val(this.model.get('title'));
				this.$el.removeClass('editing');
			}
		}
	});

	// Item List View
	// --------------
	//
	// Controls the rendering of the list of items, including the
	// filtering of activs vs completed items for display.
	Views.ListView = Backbone.Marionette.CompositeView.extend({
		template: '#template-todoListCompositeView',
		childView: Views.ItemView,
		childViewContainer: '#todo-list',

		ui: {
			toggle: '#toggle-all'
		},

		events: {
			'click @ui.toggle': 'onToggleAllClick'
		},

		collectionEvents: {
			'change:completed': 'render',
			all: 'setCheckAllState'
		},

		initialize: function () {
			this.listenTo(App.request('filterState'), 'change:filter', this.render, this);
		},

		filter: function (child) {
			var filteredOn = App.request('filterState').get('filter');
			return child.matchesFilter(filteredOn);
		},

		setCheckAllState: function () {
			function reduceCompleted(left, right) {
				return left && right.get('completed');
			}

			var allCompleted = this.collection.reduce(reduceCompleted, true);
			this.ui.toggle.prop('checked', allCompleted);
			this.$el.parent().toggle(!!this.collection.length);
		},

		onToggleAllClick: function (e) {
			var isChecked = e.currentTarget.checked;

			this.collection.each(function (todo) {
				todo.save({ completed: isChecked });
			});
		}
	});
});
