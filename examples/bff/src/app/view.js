/* global define */
define([
	'bff/view',
	'bff/extend',
	'doT',
	'text!./template.dot',
	'models/item',
	'models/items',
	'./row/view',
	'./router'
], function (View, extend, doT, templateStr, Item, items, RowView, router) {

	'use strict';

	var template = doT.template(templateStr);
	var LOCAL_STORAGE_NS = 'todos-bff';
	var ENTER = 13;

	return View.makeSubclass({

		constructor: function () {
			// Render this view; will set this.el to what is returned (and parsed) from getHtml()
			this.render();
			// DOM change listeners
			this.listenTo('.new-todo', 'keydown', this.addItem);
			this.listenTo('.clear-completed', 'click', this.removeAllItems);
			this.listenTo('input.toggle-all', 'change', this.toggleAllItems);
			// Data change listeners
			this.listenTo(items, ['change:length', 'item:change'], this.saveItems);
			this.listenTo(items, 'item:added', this.addItemView);
			this.listenTo(items, 'item:requestRemove', items.remove, items);
			this.listenTo([router, items], 'change', this.requestRender);
			// Load saved items
			this.loadItems();
		},

		getHtml: function () {
			return template(extend(items.propertiesToJSON(), router.toJSON()));
		},

		addItem: function (ev) {
			if (ev.which !== ENTER) { return; }
			var itemText = ev.target.value.trim();
			if (itemText) { items.push(new Item({ title: itemText })); }
		},

		removeAllItems: function () {
			items.filterMut(function (item) { return !item.completed; });
		},

		toggleAllItems: function (ev) {
			var completed = ev.target.checked;
			items.forEach(function (item) { item.completed = completed; });
		},

		addItemView: function (itemModel) {
			this.$('.todo-list').appendChild(new RowView(itemModel).el);
		},

		saveItems: function () {
			localStorage[LOCAL_STORAGE_NS] = JSON.stringify(items);
		},

		loadItems: function () {
			var itemDataToModel = function (itemData) { return new Item(itemData); };
			items.pushAll(JSON.parse(localStorage[LOCAL_STORAGE_NS] || '[]').map(itemDataToModel));
		}

	});

});
