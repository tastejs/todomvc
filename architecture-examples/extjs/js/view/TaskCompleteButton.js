Ext.define('Todo.view.TaskCompleteButton' , {
    extend: 'Ext.Button',
    alias: 'widget.completeButton',
    tpl: new Ext.XTemplate('<a id="clear-completed">{text}</a>', {compiled: true}),
    setText: function (text) {
        this.update({text:text});
    }
});
