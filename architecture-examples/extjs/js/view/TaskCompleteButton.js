Ext.define('Todo.view.TaskCompleteButton' , {
    extend: 'Ext.Component',
    alias: 'widget.completeButton',
    tpl: new Ext.XTemplate('<a id="clear-completed">{text}</a>', {compiled: true}),
    setText: function (text) {
        this.update({text:text});
    },
    listeners: {
        render: function (component) {
            var self = this;
            component.getEl().on('click', function () { self.fireEvent('click', self); });
        }
    }
});
