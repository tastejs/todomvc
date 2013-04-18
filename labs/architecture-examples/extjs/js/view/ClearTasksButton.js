(function () {
	'use strict';

	Ext.define('Todo.view.ClearTasksButton' , {
		extend: 'Ext.Component',

		alias: 'widget.clearTasksButton',

		autoEl: 'button',

		id: 'clear-completed',

		tpl: 'Clear completed ({count})',

		updateCount: function (count) {
			this.update({
				count: count
			});
		},

		listeners: {
			render: function (component) {
				component.getEl().on('click', function (event, el) {
					this.fireEvent('allCleared');
				}, this);
			}
		}
	});
})();
