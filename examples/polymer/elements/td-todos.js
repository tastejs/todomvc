(function () {
	'use strict';

	var ENTER_KEY = 13;
	var ESC_KEY = 27;
	Polymer({
		is: 'td-todos',
		properties: {
			modelId: String,
			areAllCompleted: {
				type: Boolean,
				computed: 'allCompleted(items.*)'
			},
			items: {
				type: Array
			},
			model: {
				type: Object
			},
			route: {
				type: String,
				observer: 'refreshFiltered'
			}
		},
		onTap: function () {
			this.setActiveFilterChildClass();
		},
		setActiveFilterChildClass: function () {
			// iron-selector should maybe allow selecting of arbitrary subnodes?
			var filters = this.querySelector('#filters');
			var prev = filters.querySelector('a.selected');

			prev && prev.classList.remove('selected');
			this.async(function () {
				filters.selectedItem.querySelector('a').classList.add('selected');
			});
		},
		getSelectedRoute: function (route) {
			return route || 'all';
		},
		anyCompleted: function (items) {
			return this.model.getCompletedCount(items) > 0;
		},
		getActiveCount: function (items) {
			return this.model.getActiveCount(items);
		},
		refreshFiltered: function () {
			// WAT: So it would be nice if repeat would be able to "observe" and external instance prop
			// since it does not we have to "hack" this.
			var elm = this.querySelector('#todo-list-repeater');
			elm && elm._applyFullRefresh();
		},
		matchesFilter: function (item) {
			return this.model.matchesFilter(item, this.route);
		},
		attached: function () {
			document.querySelector('#router').addEventListener('director-route', this.routeChanged.bind(this));

			// get a reference to the "model" which is our datastore interface
			this.set('model', document.querySelector('#model'));

			// this seems like smell... however I am not sure of a better way
			this.addEventListener('dom-change', function () {
				if (this.querySelector('#filters') !== null) {
					this.setActiveFilterChildClass();
					this.removeEventListener('dom-change');
				}
			});
		},
		allCompleted: function (items) {
			return this.model.areAllCompleted(this.items);
		},
		getItemWord: function (items) {
			return items.length === 1 ? 'item' : 'items';
		},
		hasTodos: function (todoCount) {
			return todoCount > 0;
		},
		routeChanged: function (e) {
			this.model.filter = e.detail;
		},
		addTodoAction: function () {
			this.model.newItem(this.$['new-todo'].value);
			// when polyfilling Object.observe, make sure we update immediately
			this.$['new-todo'].value = '';
		},
		cancelAddTodoAction: function () {
			this.$['new-todo'].value = '';
		},
		destroyItemAction: function (e, detail) {
			this.model.destroyItem(detail);
		},
		toggleAllCompletedAction: function (e) {
			this.model.setItemsCompleted(e.target.checked);
		},
		clearCompletedAction: function () {
			this.model.clearCompletedItems();
		}
	});
})();

