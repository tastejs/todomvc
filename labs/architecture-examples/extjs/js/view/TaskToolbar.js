(function () {
	'use strict';

	Ext.define('Todo.view.TaskToolbar', {
		extend: 'Ext.Container',

		alias: 'widget.taskToolbar',

		autoEl: { tag: 'footer' },

		requires: ['Todo.view.TaskCount', 'Todo.view.ClearTasksButton'],

		items: [{
			xtype: 'taskCount'
		}, {
			xtype: 'clearTasksButton'
		}, {
			xtype: 'container'
		}],

		id: 'footer',

		hidden: true
	});
})();
