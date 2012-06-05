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

        //No need in listen to add, remove, etc, because we have immediate sync.
        this.getTasksStore().on('datachanged', this.doRecount, this);
    },

    doRecount:function(store) {
        var total = 0, completed = 0;
        store.queryBy(function(record) {
            total++;
            completed += record.get('completed');
        });
        this.onCountUpdate(total, completed);
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
    onCountUpdate:function(total, completed) {
        var completedButton = this.getButtonCompleted();
        this.getBottomBar().setVisible(!!total);
        this.getTextUncompleted().update({count:total - completed});
        completedButton
            .setVisible(!!completed)
            .setText(completedButton.textTpl.apply({count:completed}));
        this.application.fireEvent('countschange', total, completed);
    }
});
