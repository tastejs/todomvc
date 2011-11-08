Ext.define('Todo.view.TaskToolbar' , {
    hidden: true,
    extend: 'Ext.Toolbar',
    alias : 'widget.taskToolbar',
    items: [{
        xtype: 'button',
        text: 'Clear completed'
    }, {
        xtype: 'container',
        html: '1 item left.'
    }]
});
