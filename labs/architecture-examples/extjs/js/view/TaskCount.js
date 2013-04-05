(function () {
	'use strict';

	Ext.define('Todo.view.TaskCount' , {
		extend: 'Ext.Component',

		alias: 'widget.taskCount',

		autoEl: 'span',

		id: 'todo-count',

		tpl: '<strong>{count}</strong> item{plural} left',

		updateCount: function (count) {
			this.update({
				count: count,
				plural: count === 1 ? '' : 's'
			});
		}
	});
})();
