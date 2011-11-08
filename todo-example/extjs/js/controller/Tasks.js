Ext.define('Todo.controller.Tasks', {

    models: ['Task'],

    stores: ['Tasks'],

    extend: 'Ext.app.Controller',

    views: ['TaskField', 'TaskList', 'TaskToolbar'],

    refs: [
        {ref: 'taskList', selector: 'taskList'},
        {ref: 'taskToolbar', selector: 'taskToolbar'}
    ],

    init: function() {
        this.control({
            'taskField': {
                keyup: this.onTaskFieldKeyup
            },
            'taskList': {
                itemclick: this.onListItemClick
            },
            'taskToolbar > button': {
                click: this.onClearButtonClick
            }
        });

        this.getTasksStore().on({
            scope: this,
            update: this.onStoreDataChanged,
            datachanged: this.onStoreDataChanged
        });
    },

    onTaskFieldKeyup: function(field, event) {
        var value = field.getValue();
        if (event.button === 12 && value !== '') {
            var store = this.getTasksStore();
            store.add({label: value, checked: false});
            field.reset();
            store.sync();
        }
    },

    onListItemClick: function(list, record, el) {
        record.set('checked', !record.get('checked'));
        record.store.sync();
        record.commit();
    },

    onClearButtonClick: function() {
        var records = [],
            store = this.getTasksStore();

        store.each(function(record) {
            if (record.get('checked')) {
                records.push(record);
            }
        });
        store.remove(records);
        store.sync();
    },

    onStoreDataChanged: function() {
        var info = '',
            store = this.getTasksStore(),
            toolbar = this.getTaskToolbar(),
            container = toolbar.items.last(),
            records = store.queryBy(function(record) {
                return !record.get('checked');
            }),
            count = records.getCount();

        if (count) {
            info = count + ' item' + (count > 1 ? 's' : '') + ' left.';
        }

        container.update(info);
        toolbar.setVisible(store.getCount());
    }

});
