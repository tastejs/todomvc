Ext.define('Todo.controller.List', {
    extend:'Ext.app.Controller',

    init:function() {
        this.control({
            "todo_list":{
                edit:this.onEdit,
                cellclick:this.onTodoClick
            }
        });
    },

    onTodoClick:function(view, cellEl, cellNum, record, rowEl, rowNum, event) {
        if (event.getTarget('.delete-icon')) {
            this.getStore('Tasks').remove(record);
        }
        if (event.getTarget('.checkcolumn')) {
            record.set('completed', ! record.get('completed'));
        }
    },
    //In-place label edit.
    onEdit:function(editor, data) {
        var value = Ext.String.trim(data.value);
        if (Ext.isEmpty(value)) {
            this.getStore('Tasks').remove(data.record);
        } else {
            data.record.set('title', value);
        }
    }
});
