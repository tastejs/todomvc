Ext.define('Todo.controller.History',{
    extend:'Ext.app.Controller',
    requires:['Ext.util.History'],
    refs: [
        {ref:'buttonCompleted', selector:'todo_bottombar #completed'},
        {ref:'filters', selector:'todo_bottombar #filters'}
    ],

    onLaunch:function() {
        var me = this;
        Ext.util.History.init(function(history) {
            me.onHistoryChange(history.getToken());
        });
        Ext.util.History.on('change', this.onHistoryChange, this);
    },
    currentCls:'selected',
    onHistoryChange:function(token) {
        var filter = null,
            store = this.getStore('Tasks'),
            els = this.getFilters().getEl().select('a'),
            cls = this.currentCls,
            button = this.getButtonCompleted();
        token = (token && token.length) ? token : '/';
        switch(token) {
            case '/active': filter = false; break;
            case '/completed': filter = true; break;
        }

        //Silent, if we are going to apply another filter.
        store.clearFilter(filter !== null);
        if (filter !== null) {
            store.filter('completed', filter);
        }
        //Disable because: a) user doesn't see what he deletes and b) problem with sync :).
        if (filter === false) {
            button.disable().setTooltip('First, take a look on those todos you are going to delete.');
        } else {
            button.enable().setTooltip('');
        }

        //Toggle classes on links.
        els.each(function(el) {
            if (el.dom.hash != '#' + token) {
                el.removeCls(cls);
            } else {
                el.addCls(cls);
            }
        });
    }
});