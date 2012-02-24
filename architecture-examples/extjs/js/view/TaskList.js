Ext.define('Todo.view.TaskList' , {
    store: 'Tasks',
    loadMask: false,
    itemSelector: 'li',
    extend: 'Ext.view.View',
    alias : 'widget.taskList',
    autoEl: '<ul id="todo-list" />',
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<li class="<tpl if="checked">done</tpl> <tpl if="editing">editing</tpl>">',
                '<div class="view">',
                    '<input type="checkbox" <tpl if="checked">checked</tpl> /> ',
                    '<label>{label}</label>',
                    '<a class="destroy"></a>',
                '</div>',
                '<input class="edit" type="text" value="{label}">',
            '</li>',
        '</tpl>',
        {compiled: true}
    ),
    listeners: {
        render: function () {
            this.el.on('click', function (clickEvent, el) {
                var record = this.getRecord(Ext.get(el).parent('li'));
                this.fireEvent('todoChecked', record);
            }, this, {
                // TODO I can't get this to delegate using something like div.view input or input[type="checkbox"]
                // So this will have a bug with teh input.edit field... I need to figure that out 
                delegate: 'input'
            });
        }
    }
});
