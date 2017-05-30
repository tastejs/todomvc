zuix.controller(function (cp) {
	'use strict';

	var SHOW_ALL = 0;
	var SHOW_ACTIVE = 1;
	var SHOW_COMPLETED = 2;
	var STORE_NS = 'todo-mvc-data';

	var itemsData = [];
	var lastItemId = 0;
	var toggleMode = false;
	var showFilter = SHOW_ALL;

	var filterButtons;
	var footer;
	var header;

	cp.create = function () {
		filterButtons = cp.view('ul[class="filters"]').find('li');
		footer = cp.field('footer');
		header = cp.view('[class=main]');
		// define event handlers
		cp.field('toggle').on('click', function (e) {
			toggleItems();
		});
		cp.field('item-add').on('keydown', function (e) {
			if (e.which == 13) {
				if (this.value() != '') {
					var item = {text: this.value(), checked: false, id: ++lastItemId};
					itemsData.push(item);
					createComponent(item);
				}
				this.value('');
			}
		});
		cp.field('clear').on('click', function () {
			clearCompleted();
		});
		// expose 'setFilter' method
		cp.expose('filter', function (filter) {
			switch (filter.toLowerCase()) {
				case 'active':
					setFilter(SHOW_ACTIVE);
					break;
				case 'completed':
					setFilter(SHOW_COMPLETED);
					break;
				default:
					setFilter(SHOW_ALL);
			}
		});

		itemsData = store(STORE_NS);
		if (itemsData.length > 0) {
			lastItemId = itemsData[itemsData.length - 1].id;
			zuix.$.each(itemsData, function (k, v) {
				createComponent(v);
			});
		}

		// set initial filter
		setFilter(SHOW_ALL);
	};

	// private methods

	function toggleItems() {
		zuix.$.each(itemsData, function (k, v) {
			var ctx = getComponent(v);
			var itemView = zuix.$(ctx.view());
			if (itemView.display() != 'none') {
				ctx.checked(toggleMode);
			}
		});
		updateStatus();
	}

	function createComponent(item) {
		// append new item to the list
		var li = document.createElement('li');
		// method 'field' takes advantage of caching, so no need for storing element reference
		cp.field('todo-list').append(li);
		// load component "list_item" into the newly added list item
		var ctx = zuix.load('components/todos/list_item', {
			contextId: 'ctx-' + item.id,
			container: li,
			// disable local css for this component, since todo_mcv already provide its own global css
			css: false,
			data: item,
			on: {
				checked: function () {
					updateStatus();
				},
				removed: function () {
					removeItem(item);
					updateStatus();
				}
			},
			ready: function () {
				// component is ready, refresh status
				setTimeout(updateStatus, 50);
			}
		});
	}

	function getComponent(item) {
		return zuix.context('ctx-' + item.id);
	}

	function removeItem(item) {
		itemsData.splice(itemsData.indexOf(item), 1);
		// unload the associated component as well
		zuix.unload(getComponent(item));
	}

	function clearCompleted() {
		for (var i = itemsData.length - 1; i >= 0; i--) {
			if (itemsData[i].checked) {
				removeItem(itemsData[i])
			}
		}
		updateStatus();
	}

	function updateStatus() {
		var shownItems = 0;
		var toggledItems = 0;
		var itemsLeft = 0;
		zuix.$.each(itemsData, function (k, v) {
			var ctx = getComponent(v);
			if (ctx.view() == null) {
				return false;
			}
			var itemView = zuix.$(ctx.view());
			itemView.show();
			if (!v.checked) {
				itemsLeft++;
				if (showFilter == SHOW_COMPLETED) {
					itemView.hide();
				}
			} else if (showFilter == SHOW_ACTIVE) {
				itemView.hide();
			}
			if (itemView.display() != 'none') {
				shownItems++;
				toggledItems += (v.checked ? 1 : 0);
			}
		});
		// update to-do count
		cp.field('count')
			.html(itemsLeft + ' item' + (itemsLeft != 1 ? 's' : '') + ' left');
		// show/hide 'clear completed' button
		if (itemsLeft != itemsData.length) {
			cp.field('clear').show();
		} else {
			cp.field('clear').hide();
		}
		// show/hide footer and toggle button
		if (itemsData.length == 0) {
			footer.hide();
		} else {
			footer.show();
		}
		if (shownItems == 0) {
			header.hide();
		} else {
			header.show();
			toggleMode = (shownItems != toggledItems);
			cp.field('toggle').checked(!toggleMode);
		}
		store(STORE_NS, itemsData);
	}

	function setFilter(filterIndex) {
		filterButtons.each(function (k, v) {
			if (k == filterIndex) {
				this.find('a').addClass('selected');
			} else {
				this.find('a').removeClass('selected');
			}
		});
		showFilter = filterIndex;
		updateStatus();
	}

	function store(namespace, data) {
		if (arguments.length > 1) {
			return localStorage.setItem(namespace, JSON.stringify(data));
		} else {
			var store = localStorage.getItem(namespace);
			return (store && JSON.parse(store)) || [];
		}
	}

});

