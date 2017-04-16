/*global Lava, Firestorm, Router */
(function (Lava, Firestorm, Router) {
'use strict';

Lava.define(
'Lava.widget.TodoApp',
{
	Extends: 'Lava.widget.Standard',
	name: 'todo_app',

	_properties: {
		/** @type {Lava.system.Enumerable} */
		todo_list: null,
		/** @type {Lava.system.DataView}*/
		filtered_list: null,
		edited_item: null,
		edited_item_text: '',
		completed_count: 0,
		remaining_count: 0,
		filter_name: 'all',
		filter_names: ['all','active','completed']
	},

	_event_handlers: {
		delete_item_click: '_deleteItemClick',
		item_double_click: '_itemDoubleClick',
		clear_completed_click: '_clearCompletedClick'
	},

	_role_handlers: {
		toggle_all_checkbox: '_handleToggleAllCheckbox'
	},

	_toggle_all_checkbox: null,

	STORAGE_ITEM_NAME: 'todos-liquidlava',

	init: function(config, widget, parent_view, template, properties) {

		var self = this;

		this._properties.todo_list = new Lava.system.Enumerable();
		this._loadItemsFromStorage();
		this._properties.filtered_list = new Lava.system.DataView(this._properties.todo_list);
		this.Standard$init(config, widget, parent_view, template, properties);

		Lava.focus_manager.on('focus_target_changed', this._onFocusTargetChanged, this);
		Lava.Core.addGlobalHandler('keydown', this._onKeyDown, this);

		new Router({
			'/:filter': function (filter_name) {
				if (self.get('filter_names').indexOf(filter_name) == -1) {
					filter_name = 'all';
				}
				self.set('filter_name', filter_name);
				self._refreshData();
				Lava.refreshViews();
			}
		}).init('/all');

	},

	_loadItemsFromStorage: function() {

		var data = localStorage.getItem(this.STORAGE_ITEM_NAME);
		var items = (data && JSON.parse(data)) || [];
		var self = this;

		items.forEach(function (item) {
			self._addItem(item);
		});

	},

	_onFocusTargetChanged: function(focus_manager, focus_target) {

		if (!focus_target || focus_target == Lava.view_manager.getViewById('new_todo')) {
			this._finishEdit();
		}

	},

	_clearCompletedClick: function() {

		this._properties.todo_list.filter(function (value) {
			return !value.get('is_completed');
		});
		this._refreshData();

	},

	_refreshData: function() {

		var values = this._properties.todo_list.getValues();
		var completed_count = 0;
		var export_items = [];
		var completed_state;

		values.forEach(function (value) {
			if (value.get('is_completed')) {
				completed_count++;
			}
			export_items.push(value.getProperties());
		});

		this.set('completed_count', completed_count);
		this.set('remaining_count', values.length - completed_count);
		if (this._toggle_all_checkbox) {
			this._toggle_all_checkbox.set('is_checked', this._properties.remaining_count === 0);
		}

		this._properties.filtered_list.refresh();
		if (this._properties.filter_name != 'all') {
			completed_state = (this._properties.filter_name == 'completed');
			this._properties.filtered_list.filter(function (value) {
				return value.get('is_completed') == completed_state;
			});
		}

		localStorage.setItem(this.STORAGE_ITEM_NAME, JSON.stringify(export_items));

	},

	_deleteItemClick: function(dom_event_name, dom_event, view, template_arguments) {

		this._properties.todo_list.removeValue(template_arguments[0]);
		this._refreshData();

	},

	_itemDoubleClick: function(dom_event_name, dom_event, view, template_arguments) {

		var edited_item = template_arguments[0];
		this.set('edited_item_text', edited_item.get('title'));
		this.set('edited_item', edited_item);

	},

	_onTaskCompletedChanged: function() {

		this._refreshData();

	},

	_addItem: function(item_object) {

		var item = new Lava.mixin.Properties(item_object);
		item.onPropertyChanged('is_completed', this._onTaskCompletedChanged, this);
		this._properties.todo_list.push(item);

	},

	_onKeyDown: function(dom_event_name, dom_event) {

		var new_todo_input;
		var focus_target_widget;

		if (dom_event.code == Firestorm.KEY_CODES.ENTER) {

			new_todo_input = Lava.view_manager.getViewById('new_todo');
			focus_target_widget = Lava.focus_manager.getFocusedTarget();

			if (new_todo_input == focus_target_widget && new_todo_input.get('value').trim()) {

				this._addItem({
					title: new_todo_input.get('value').trim(),
					is_completed: false
				});
				this._refreshData();
				new_todo_input.set('value', '');

			} else {

				this._finishEdit();

			}

		} else if (dom_event.code == Firestorm.KEY_CODES.ESCAPE) {

			this.set('edited_item', null);

		}

	},

	_handleToggleAllCheckbox: function(view) {

		this._toggle_all_checkbox = view;
		view.set('is_checked', this._properties.remaining_count === 0);
		view.on('checked_changed', this._onToggleAllChanged, this);

	},

	_onToggleAllChanged: function() {

		var new_state = this._toggle_all_checkbox.get('is_checked');

		this._properties.todo_list.getValues().forEach(function (value) {
			value.set('is_completed', new_state);
		});

		this._refreshData();

	},

	_finishEdit: function() {

		var edited_item = this._properties.edited_item;
		var edited_item_text = this._properties.edited_item_text.trim();

		if (edited_item) {

			if (edited_item_text) {

				edited_item.set('title', edited_item_text);

			} else {

				this._properties.todo_list.removeValue(edited_item);

			}

			this.set('edited_item', null);
			this._refreshData();

		}

	}

});

})(Lava, Firestorm, Router);