/* global define */
define([
	'bff/view',
	'bff/extend',
	'doT',
	'text!./template.dot',
	'./model',
	'app/router'
], function (View, extend, doT, templateStr, RowViewState, router) {

	'use strict';

	var template = doT.template(templateStr);
	var ENTER = 13;
	var ESCAPE = 27;

	return View.makeSubclass({

		constructor: function (item) {
			this.item = item;
			this.viewState = new RowViewState({ visible: this.isVisible() });
			this.render();
			// DOM change listeners
			this.listenTo('input.toggle', 'change', this.setCompletedState);
			this.listenTo('input.edit', 'keydown', this.onKeyDown);
			this.listenTo('input.edit', 'blur', this.leaveEditMode.bind(this, true));
			this.listenTo('button.destroy', 'click', this.removeItem);
			this.listenTo('label', 'dblclick', this.enterEditMode);
			// Data change listeners
			this.listenTo([item, this.viewState], 'change', this.requestRender);
			this.listenTo([item, router], 'change', this.onChange);
			this.listenTo(item, 'removed', this.destroy);
		},

		render: function () {
			View.prototype.render.call(this, { ignoreSubtreeOf: 'input.edit' });
			if (this.viewState.editing) { this.$('input.edit').focus(); }
		},

		getHtml: function () {
			return template(extend(this.item.toJSON(), this.viewState.toJSON()));
		},

		isVisible: function () {
			return !router.route || this.item[router.route];
		},

		onChange: function () {
			this.viewState.visible = this.isVisible();
			if (!this.item.title) { this.removeItem(); }
		},

		setCompletedState: function (ev) {
			this.item.completed = ev.target.checked;
		},

		enterEditMode: function () {
			this.$('input.edit').value = this.item.title;
			this.viewState.editing = true;
		},

		leaveEditMode: function (save) {
			if (save) { this.item.title = this.$('input.edit').value; }
			this.viewState.editing = false;
		},

		onKeyDown: function (ev) {
			switch (ev.which) {
			case ENTER: this.leaveEditMode(true); break;
			case ESCAPE: this.leaveEditMode(false); break;
			}
		},

		removeItem: function () {
			this.item.emit('requestRemove', this.item);
		}

	});

});
