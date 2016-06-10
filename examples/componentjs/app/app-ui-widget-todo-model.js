/* global cs, _ */
(function () {
	'use strict';

	// model component of the 'todo' UI widget
	cs.ns('app.ui.widget.todo').model = cs.clazz({
		mixin: [cs.marker.model],
		protos: {
			create: function () {
				// define presentation model
				cs(this).model({
					'data:item-list': { value: [], valid: '[{ id: string, title: string, completed: boolean, editing: boolean }*]' },
					'cmd:item-list-updated': { value: false, valid: 'boolean', autoreset: true },
					'state:all-item-selected': { value: false, valid: 'boolean' },
					'event:all-item-select': { value: false, valid: 'boolean', autoreset: true },
					'data:new-item-text': { value: '', valid: 'string', store: true },
					'event:new-item-create': { value: false, valid: 'boolean', autoreset: true },
					'event:item-list-item-modified': { value: null, valid: 'object', autoreset: true },
					'event:item-list-item-removed': { value: null, valid: 'object', autoreset: true },
					'data:status-items-remaining': { value: 0, valid: 'number' },
					'data:status-items-remaining-unit': { value: '', valid: 'string' },
					'state:status-filter-selected': { value: 'all', valid: 'string', store: true },
					'event:status-filter-select': { value: '', valid: 'string', autoreset: true },
					'data:status-items-completed': { value: 0, valid: 'number' },
					'event:status-clear-select': { value: false, valid: 'boolean', autoreset: true }
				});
			},
			prepare: function () {
				var self = this;

				// presentation logic: determine singular/plural of remaining items unit
				cs(self).observe({
					name: 'data:status-items-remaining',
					touch: true,
					func: function (ev, value) {
						cs(self).value('data:status-items-remaining-unit',
							value !== 1 ? 'items' : 'item');
					}
				});

				// presentation logic: determine number of completed and remaining items
				cs(self).observe({
					name: 'cmd:item-list-updated',
					touch: true,
					func: function (/* ev, value */) {
						var items = cs(self).value('data:item-list');
						var completed = _.filter(items, 'completed').length;
						var remaining = items.length - completed;
						cs(self).value('data:status-items-completed', completed);
						cs(self).value('data:status-items-remaining', remaining);
						if (remaining === 0 && completed > 0) {
							cs(self).value('state:all-item-selected', true);
						} else if (remaining > 0) {
							cs(self).value('state:all-item-selected', false);
						}
					}
				});

				// presentation logic: implement 'all item selected'
				cs(self).observe({
					name: 'event:all-item-select',
					func: function (ev, value) {
						var items = cs(self).value('data:item-list');
						var modified = false;
						_.forEach(items, function (item) {
							if (item.completed !== value) {
								item.completed = value;
								cs(self).value('event:item-list-item-modified', item, true);
								modified = true;
							}
						});
						if (modified) {
							cs(self).value('cmd:item-list-updated', true, true);
						}
					}
				});
			}
		}
	});
}());
