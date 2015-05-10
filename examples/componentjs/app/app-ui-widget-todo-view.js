/* global cs, app, $, _ */
(function () {
	'use strict';

	// view component of the 'todo' UI widget
	cs.ns('app.ui.widget.todo').view = cs.clazz({
		mixin: [cs.marker.view],
		protos: {
			render: function () {
				// render outer view mask
				var self = this;
				var ui = $.markup('todo');
				cs(self).plug(ui);

				// two-way bind the 'all items' selection checkbox
				$('.todo__toggle-all', ui).change(function (/* ev */) {
					cs(self).value('event:all-item-select', $('.todo__toggle-all', ui).prop('checked'), true);
				});
				cs(self).observe({
					name: 'state:all-item-selected',
					spool: 'materialized',
					func: function (ev, value) { $('.todo__toggle-all', ui).prop('checked', value); }
				});

				// two-way bind the 'new item' text input field
				$('.todo__new', ui).keyup(function (/* ev */) {
					cs(self).value('data:new-item-text', $('.todo__new', ui).val());
				}).change(function (/* ev */) {
					var value = $('.todo__new', ui).val().trim();
					if (value !== '') {
						cs(self).value('data:new-item-text', value);
						cs(self).value('event:new-item-create', true, true);
					}
				});
				cs(self).observe({
					name: 'data:new-item-text',
					touch: true,
					spool: 'materialized',
					func: function (ev, value) { $('.todo__new', ui).val(value); }
				});

				// two-way bind the list of items
				cs(self).observe({
					name: 'cmd:item-list-updated',
					spool: 'materialized',
					touch: true,
					func: function (/* ev, value */) {
						var items = cs(self).value('data:item-list');
						var filter = cs(self).value('state:status-filter-selected');

						// render item markup for all non-filtered items
						$('.todo__list', ui).html('');
						for (var i = 0; i < items.length; i++) {
							if (filter === 'all' ||
								(filter === 'active' && !items[i].completed) ||
								(filter === 'completed' && items[i].completed)) {
								var item = $.markup('todo/item', items[i]);
								$('.todo__list', ui).append(item);
							}
						}

						// show/hide the footer accordingly
						if (items.length === 0) {
							$('.todo__main', ui).addClass('hidden');
							$('.todo__footer', ui).addClass('hidden');
						} else {
							$('.todo__main', ui).removeClass('hidden');
							$('.todo__footer', ui).removeClass('hidden');
						}

						// one-way bind double-click interaction onto all items to start editing mode
						$('.todo__item--view .todo__label', ui).bind('dblclick', function (ev) {
							var title = $(ev.target).text();
							var parent = $(ev.target).parent().parent();
							parent.addClass('editing');
							$('.edit', parent).val(title).focus();
						});

						// one-way bind key-press and field blur interactions to leave editing mode
						var blur = function (el, takeTitle) {
							var id = String($(el).parent().data('id'));
							$(el).parent().removeClass('editing');
							if (takeTitle) {
								var items = cs(self).value('data:item-list');
								var item = _.find(items, { id: id });
								var title = $(el).val().trim();
								if (title === '') {
									cs(self).value('data:item-list', _.without(items, item));
									cs(self).value('event:item-list-item-removed', item, true);
								} else {
									item.title = title;
									cs(self).value('event:item-list-item-modified', item);
								}
								cs(self).value('cmd:item-list-updated', true, true);
							}
						};
						$('.todo__item--edit', ui).keyup(function (ev) {
							if (ev.which === app.ui.constants.KEY_ENTER) {
								blur(ev.target, true);
							} else if (ev.which === app.ui.constants.KEY_ESCAPE) {
								blur(ev.target, false);
							}
						}).blur(function (ev) {
							if ($(ev.target).parent().hasClass('editing')) {
								blur(ev.target, true);
							}
						});

						// one-way bind click interaction to toggle item completion
						$('.todo__toggle', ui).click(function (ev) {
							var id = String($(ev.target).parent().parent().data('id'));
							var items = cs(self).value('data:item-list');
							var item = _.find(items, { id: id });
							item.completed = !item.completed;
							cs(self).value('event:item-list-item-modified', item, true);
							cs(self).value('cmd:item-list-updated', true, true);
						});

						// one-way bind click interaction to remove item
						$('.todo__destroy', ui).click(function (ev) {
							var id = String($(ev.target).parent().parent().data('id'));
							var items = cs(self).value('data:item-list');
							var item = _.find(items, { id: id });
							cs(self).value('data:item-list', _.without(items, item));
							cs(self).value('event:item-list-item-removed', item, true);
							cs(self).value('cmd:item-list-updated', true, true);
						});
					}
				});

				// one-way bind status remaining items label
				cs(self).observe({
					name: 'data:status-items-remaining',
					spool: 'materialized',
					touch: true,
					func: function (ev, value) {
						$('*[data-bind=\'data:status-items-remaining\']', ui).text(value);
						$('*[data-bind=\'data:status-items-remaining-unit\']', ui)
							.text(parseInt(value) === 1 ? 'item' : 'items');
					}
				});

				// two-way bind status filter buttons
				cs(self).observe({
					name: 'state:status-filter-selected',
					spool: 'materialized',
					touch: true,
					func: function (ev, value) {
						var a = $('*[data-bind=\'state:status-filter-selected\'] > li > a', ui);
						a.removeClass('selected');
						a.filter('*[data-tag=\'' + value + '\']').addClass('selected');
					}
				});
				$('*[data-bind=\'state:status-filter-selected\'] > li > a', ui).click(function (ev) {
					cs(self).value('event:status-filter-select', $(ev.target).data('tag'), true);
					cs(self).value('cmd:item-list-updated', true, true);
					return false;
				});

				// two-way bind status clear item button
				cs(self).observe({
					name: 'data:status-items-completed',
					spool: 'materialized',
					touch: true,
					func: function (ev, value) {
						if (value > 0) {
							$('.todo__completed', ui).css('display', 'block');
							$('*[data-bind=\'data:status-items-completed\']', ui).text(value);
						} else {
							$('.todo__completed', ui).css('display', 'none');
						}
					}
				});
				$('.todo__completed', ui).click(function (/* ev */) {
					var items = cs(self).value('data:item-list');
					_.forEach(items, function (item) {
						if (item.completed) {
							cs(self).value('event:item-list-item-removed', item, true);
						}
					});
					cs(self).value('data:item-list', _.filter(items, function (item) {
						return !item.completed;
					}));
					cs(self).value('cmd:item-list-updated', true, true);
				});
			}
		}
	});
}());
