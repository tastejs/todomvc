Ext.define('Todo.controller.BottomBar', {
    extend:'Ext.app.Controller',
    /*models:['Task'],*/
    stores:['Tasks'],
    refs:[
        {ref:'bottomBar', selector:'todo_bottombar'},
        {ref:'textUncompleted', selector:'todo_bottombar #uncompleted'},
        {ref:'buttonCompleted', selector:'todo_bottombar #completed'}
    ],

    init:function() {
        this.control({
            "todo_bottombar #completed":{
                click:this.onClearButtonClick
            }
        });

        this.getTasksStore().on({
            scope:this,
            remove:this.onDeleteTodo,
            add:this.onAddTodo,
            update:this.onUpdate,
            datachange:this.doRecount,
            load:this.doRecount
        });
    },

    completedTodos:0,
    existingTodos:0,
    onUpdate:function(store, record, cause, modified) {
        if (modified && Ext.Array.contains(modified, 'completed')) {
            this.completedTodos += 2 * record.get('completed') - 1;
            this.onCountUpdate();
        }
    },
    onAddTodo:function(store, records) {
        Ext.each(records, function(record) {
            this.completedTodos += record.get('completed');
            this.existingTodos++;
        }, this);
        this.onCountUpdate();
    },
    onDeleteTodo:function(store, record) {
        this.completedTodos -= record.get('completed');
        this.existingTodos--;
        this.onCountUpdate();
    },
    doRecount:function(store) {
        var total = 0, completed = 0;
        store.queryBy(function(record) {
            total++;
            completed += record.get('completed');
        });
        this.completedTodos = completed;
        this.existingTodos = total;
        this.onCountUpdate();
    },

    onClearButtonClick:function() {
        var records = [],
            store = this.getTasksStore();

        records = store.queryBy(
            function(record) {
                return record.get('completed');
            }).getRange();
        store.remove(records);
    },
    onCountUpdate:function() {
        this.getBottomBar().setVisible(!!this.existingTodos);
        this.getTextUncompleted().update({count:this.existingTodos - this.completedTodos});
        this.getButtonCompleted()
            .setVisible(!!this.completedTodos)
            .update({count:this.completedTodos});
        this.application.fireEvent('countschange', this.existingTodos, this.completedTodos);
    }
});
