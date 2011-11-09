Ext.define('Todo.view.TaskToolbar' , {
    hidden: true,
    extend: 'Ext.Toolbar',
    alias : 'widget.taskToolbar',
    items: [{
        xtype: 'button',
        hidden: true
    }, {
        xtype: 'container'
    }]
});
