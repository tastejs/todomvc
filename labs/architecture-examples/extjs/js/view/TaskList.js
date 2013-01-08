Ext.define('Ext.ux.DataView.LabelEditor', {
    extend: 'Ext.Editor',
    alias: 'widget.todoeditor',

    dataIndex: 'label',
    renderTo: 'todoapp', 

    autoSize: {
		width: 'boundEl',
        height: 'boundEl'
    },

	field: {
		xtype : 'textfield',
		selectOnFocus: true
	}
});

Ext.define('Todo.view.TaskList' , {
	extend: 'Ext.view.View',
	alias: 'widget.taskList',

	store: 'Tasks',
	loadMask: false,
	itemSelector: 'li',

	itemTpl: [ 
		'<li class="<tpl if="completed">completed</tpl>">',
		'<div class="view">',
			'<input type="checkbox" class="toggle" <tpl if="completed">completed</tpl> /> ',
			'<label>{label}</label>',
			'<a class="destroy"></a>',
		'</div>',
		'</li>'
	]
});