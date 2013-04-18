(function () {
	'use strict';

	Ext.define('Todo.view.CheckAllBox', {
		extend: 'Ext.Component',

		alias: 'widget.checkAllBox',

		tpl:
			'<input id="toggle-all" type="checkbox" <tpl if="allComplete">checked</tpl>>'
		+ '<label for="toggle-all">Mark all as complete</label>',

		updateCheckedState: function (allTasks, completedTasks) {
			this.update({
				allComplete: completedTasks == allTasks
			});
		},

		listeners: {
			render: function (component) {
				component.getEl().on('click', function (event, el) {
					var checked = !!Ext.get(el).getAttribute('checked');

					this.fireEvent('click', checked);
				}, this, {
					delegate: 'input'
				});
			}
		}
	});
})();
