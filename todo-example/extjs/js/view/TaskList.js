Ext.define('Todo.view.TaskList' , {
    store: 'Tasks',
    itemSelector: 'div.row',
    extend: 'Ext.view.View',
    alias : 'widget.taskList',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div class="row">',
                '<input type="checkbox" {[values.checked ? "checked" : ""]} />',
                '<span class="{[values.checked ? "checked" : ""]}">{label}</span>',
            '</div>',
        '</tpl>',
        {compiled: true}
    )
});
