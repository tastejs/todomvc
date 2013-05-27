/*global define:false */
define([
	'troopjs-browser/component/widget',
	'troopjs-data/store/component',
	'troopjs-browser/store/adapter/local',
	'jquery',
	'template!./item.html',
	'poly/array'
], function ListModule(Widget, Store, Adapter, $, template) {
	/*jshint newcap:false*/
	'use strict';

	var ARRAY_SLICE = Array.prototype.slice;
	var ENTER_KEY = 13;
	var ESC_KEY = 27;
	var FILTER_ACTIVE = 'filter-active';
	var FILTER_COMPLETED = 'filter-completed';
	var KEY = 'todos-troopjs';
	var STORE = 'store';

	function filter(item) {
		return item !== null;
	}

	return Widget.extend(function ListWidget() {
		this[STORE] = Store(Adapter());
	}, {
		'sig/start': function () {
			var me = this;
			var store = me[STORE];

			return store.ready(function () {
				return store.get(KEY, function (getItems) {
					return store.set(KEY, getItems && getItems.filter(filter) || [], function (setItems) {
						setItems.forEach(function (item, i) {
							me.append(template, {
								i: i,
								item: item
							});
						});

						me.publish('todos/change', setItems);
					});
				});
			});
		},

		'hub/todos/add': function onAdd(title) {
			var me = this;
			var store = me[STORE];

			return store.ready(function () {
				return store.get(KEY, function (getItems) {
					var i = getItems.length;

					var item = getItems[i] = {
						completed: false,
						title: title
					};

					me.append(template, {
						i: i,
						item: item
					});

					return store.set(KEY, getItems, function (setItems) {
						me.publish('todos/change', setItems);
					});
				});
			})
			.yield(ARRAY_SLICE.call(arguments));
		},

		'hub/todos/mark': function onMark(value) {
			this.$element.find(':checkbox').prop('checked', value).change();
		},

		'hub/todos/clear': function onClear() {
			this.$element.find('.completed .destroy').click();
		},

		'hub:memory/todos/filter': function onFilter(filter) {
			var $element = this.$element;

			switch (filter) {
			case '/completed':
				$element
					.removeClass(FILTER_ACTIVE)
					.addClass(FILTER_COMPLETED);
				break;

			case '/active':
				$element
					.removeClass(FILTER_COMPLETED)
					.addClass(FILTER_ACTIVE);
				break;

			default:
				$element.removeClass([FILTER_ACTIVE, FILTER_COMPLETED].join(' '));
			}
		},

		'dom:.toggle/change': function onToggleChange($event) {
			var me = this;
			var store = me[STORE];
			var $target = $($event.currentTarget);
			var completed = $target.prop('checked');
			var $li = $target.closest('li');
			var index = $li.data('index');

			$li
				.toggleClass('completed', completed)
				.toggleClass('active', !completed);

			store.ready(function () {
				return store.get(KEY, function (getItems) {
					getItems[index].completed = completed;

					return store.set(KEY, getItems, function (setItems) {
						me.publish('todos/change', setItems);
					});
				});
			});
		},

		'dom:.destroy/click': function onDestroyClick($event) {
			var me = this;
			var store = me[STORE];
			var $li = $($event.currentTarget).closest('li');
			var index = $li.data('index');

			$li.remove();

			store.ready(function () {
				return store.get(KEY, function (getItems) {
					getItems[index] = null;

					return store.set(KEY, getItems, function (setItems) {
						me.publish('todos/change', setItems);
					});
				});
			});
		},

		'dom:.view label/dblclick': function onViewDblClick($event) {
			var me = this;
			var store = me[STORE];
			var $li = $($event.currentTarget).closest('li');
			var index = $li.data('index');
			var $input = $li.find('input');

			$li.addClass('editing');
			$input.prop('disabled', true);

			store.ready(function () {
				return store.get(KEY, function (items) {
					$input
						.val(items[index].title)
						.prop('disabled', false)
						.focus();
				});
			}, function () {
				$input.prop('disabled', false);
				$li.removeClass('editing');
			});
		},

		'dom:.edit/keyup': function onEditKeyUp($event) {
			var $li = $($event.currentTarget).closest('li');

			switch ($event.keyCode) {
			case ENTER_KEY:
				$li
					.find('input')
					.focusout();
				break;

			case ESC_KEY:
				$li
					.find('input')
					.val($li.find('label').text())
					.focusout();
				break;
			}
		},

		'dom:.edit/focusout': function onEditFocusOut($event) {
			var me = this;
			var store = me[STORE];
			var $target = $($event.currentTarget);
			var title = $target.val().trim();

			if (title === '') {
				$target
					.closest('li.editing')
					.removeClass('editing')
					.find('.destroy')
					.click();
			} else {
				$target.prop('disabled', true);

				store.ready(function () {
					return store.get(KEY, function (getItems) {
						var $li = $target.closest('li');
						var index = $li.data('index');

						getItems[index].title = title;

						return store.set(KEY, getItems, function (setItems) {
							$li
								.removeClass('editing')
								.find('label')
								.text(title);

							me.publish('todos/change', setItems);
						});
					})
					.ensure(function () {
						$target.prop('disabled', false);
					});
				});
			}
		}
	});
});
