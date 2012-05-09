Ext.define('Todo.controller.TopBar', {
    extend:'Ext.app.Controller',

    refs:[
        {ref:'checkAll', selector:'todo_topbar checkbox'}
    ],

    init:function() {
        this.control({
            "todo_topbar textfield":{
                specialkey:this.onEnter
            },
            "todo_topbar checkbox":{
                change:this.onCheckAllChange
            }
        });
        this.application.on('countschange', this.remarkCheckbox, this);
    },

    //Add new.
    onEnter:function(field, event) {
        if (event.getKey() == event.ENTER) {
            var value = Ext.String.trim(field.getValue());
            if (!Ext.isEmpty(value)) {
                field.blur();
                field.setValue('');
                this.getStore('Tasks').add({title:value});
            }
        }
    },
    //User initiated.
    onCheckAllChange:function(checkbox, checked) {
        if (!this.dontCheckAll) {
            var store = this.getStore('Tasks');
            store.queryBy(function(record) {
                record.set('completed', checked);
            });
            //Refresh filtered set, because records have changed.
            store.filter();
        }
    },
    remarkCheckbox:function(total, completed) {
        this.dontCheckAll = true;
        this.getCheckAll().setValue((total == completed) && (total > 0));
        this.dontCheckAll = false;
    }
});
