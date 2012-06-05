Ext.define('Todo.view.List', {
    extend:'Ext.grid.Panel',
    requires:[
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text'
    ],
    alias:'widget.todo_list',
    cls:'todo-app-list',
    store:'Tasks',
    hideHeaders:true,
    plugins:{
        ptype:'cellediting',
        clicksToEdit:2
    },
    columns:[
        {
            text:'Completed',
            dataIndex:'completed',
            tdCls:'checkcolumn',
            //align:'center',
            renderer:function(value, meta) {
                if (value) {
                    meta.tdCls = 'checked'
                }
                //return '<div class="checkbox"></div>';
            },
            width:40
        },
        {
            text:'Title',
            dataIndex:'title',
            tdCls:'todo-text',
            renderer:function(value, meta, todo) {
                if (todo.get('completed')) {
                    meta.tdCls = 'completed';
                }
                return value;
            },
            flex:1,
            field:{
                cls:'todo-text-input',
                allowBlank:false,
                selectOnFocus:true
            }
        },
        {
            text:'Delete',
            width:40,
            align:'center',
            tdCls:'delete-icon'
        }
    ]
});
