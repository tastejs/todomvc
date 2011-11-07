Ext.define('Todo.view.TaskToolbar' , {
    alias : 'widget.taskToolbar',
    extend: 'Ext.Toolbar',
    items: [{
        xtype: 'container',
        html: '1 item left.'
    }, '->', {
        xtype: 'button',
        text: 'Clear completed'
    }]
});
