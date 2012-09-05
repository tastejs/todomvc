Ext.define('Todo.view.TaskToolbar' , {
	hidden: true,
	extend: 'Ext.Container',
	alias : 'widget.taskToolbar',
	autoEl: {tag: 'footer'},
	requires: ['Todo.view.TaskCompleteButton'],
	items: [{
			xtype: 'completeButton'
	}, {
		xtype: 'container'
	}]
});
