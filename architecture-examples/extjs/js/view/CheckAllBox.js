Ext.define('Todo.view.CheckAllBox' , {
    extend: 'Ext.Component',
    alias: 'widget.checkAllBox',
    html: '<input id="toggle-all" type="checkbox"> <label for="toggle-all">Mark all as complete</label>',
    listeners: {
        render: function (component) {
            component.getEl().on('click', function (event, el) {
                var checked = !!Ext.get(el).getAttribute('checked');
                this.fireEvent('click', checked);
            }, this, {
                delegate: 'input'
            });
        }
    }
});
