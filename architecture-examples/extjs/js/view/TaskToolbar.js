Ext.define('Todo.view.TaskToolbar' , {
	hidden: true,
	extend: 'Ext.Toolbar',
	alias : 'widget.taskToolbar',
	autoEl: {tag: 'footer'},
	requires: ['Todo.view.TaskCompleteButton'],
	items: [{
			xtype: 'completeButton'
	}, {
		xtype: 'container'
	}]
});
