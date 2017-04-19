zuix.controller(function (cp) {
	'use strict';

	var SHOW_ALL = 0;
	var SHOW_ACTIVE = 1;
	var SHOW_COMPLETED = 2;

	var todoItems = [];
	var toggleMode = false;
	var showFilter = SHOW_ALL;

	var filterButtons;
	var footer;
	var toggleAll;

	cp.create = function () {
		filterButtons = cp.view('ul[class="filters"]').find('li');
		footer = cp.field('footer');
		// define event handlers
		toggleAll = cp.field('toggle-all').on('click', function (e) {
			toggleItems();
		});
		cp.field('item-add').on('keydown', function (e) {
			if (e.which == 13) {
				if (this.value() != '') {
					addItem(this.value());
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
		// refresh component UI
		updateStatus();
		setFilter(SHOW_ALL);
	};

	// private methods

	function toggleItems() {
		zuix.$.each(todoItems, function (k, v) {
			if (this.view().style.display != 'none') {
				this.checked(toggleMode);
			}
		});
		updateStatus();
	}

	function addItem(description) {
		// append new item to the list
		var li = document.createElement('li');
		// method 'field' takes advantage of caching, so no need for storing element reference
		cp.field('todo-list').append(li);
		// load component "list_item" into the newly added list item
		zuix.load('components/todos/list_item', {
			container: li,
			// disable local css for this component, since todo_mcv already provide its own global css
			css: false,
			text: description,
			on: {
				"checked": function (e, isChecked) {
					updateStatus();
				},
				"removed": function () {
					removeItem(ctx)
				}
			},
			ready: function () {
				// component is ready, store a reference to it
				todoItems.push(this);
				updateStatus();
			}
		});
	}

	function removeItem(ctx) {
		zuix.unload(ctx);
		todoItems.splice(todoItems.indexOf(ctx), 1);
		updateStatus();
	}

	function clearCompleted() {
		for (var i = todoItems.length - 1; i >= 0; i--) {
			if (todoItems[i].checked()) {
				zuix.unload(todoItems[i]);
				todoItems.splice(i, 1);
			}
		}
		updateStatus();
	}

	function updateStatus() {
		var shownItems = 0;
		var toggledItems = 0;
		var itemsLeft = 0;
		zuix.$.each(todoItems, function (k, v) {
			var itemView = zuix.$(v.view());
			itemView.show();
			if (!v.checked()) {
				itemsLeft++;
				if (showFilter == SHOW_COMPLETED) {
					itemView.hide();
				}
			} else if (showFilter == SHOW_ACTIVE) {
				itemView.hide();
			}
			if (itemView.display() != 'none') {
				shownItems++;
				toggledItems += (v.checked() ? 1 : 0);
			}
		});
		// update to-do count
		cp.field('count')
			.html(itemsLeft + ' item' + (itemsLeft != 1 ? 's' : '') + ' left');
		// show/hide 'clear completed' button
		if (itemsLeft != todoItems.length) {
			cp.field('clear').show();
		} else {
			cp.field('clear').hide();
		}
		// show/hide footer and toggle button
		if (todoItems.length == 0) {
			footer.hide();
		} else {
			footer.show();
		}
		if (shownItems == 0) {
			toggleAll.hide();
		} else {
			toggleAll.show();
			toggleMode = (shownItems != toggledItems);
		}
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

});

