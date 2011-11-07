Ext.onReady(function() {

    var store = Ext.create('Ext.data.Store', {
        fields: ['label', 'checked'],
        data: [
            {label: 'task one', checked: false},
            {label: 'task two', checked: true}
        ]
    });

    var tpl = Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div class="row">',
                '<input type="checkbox" {[values.checked ? "checked" : ""]} />',
                '<span class="{[values.checked ? "checked" : ""]}">{label}</span>',
            '</div>',
        '</tpl>',
        {compiled: true}
    );

    Ext.define('Todo.view.InfoContainer' , {
        renderTo: 'info',
        alias : 'widget.infoContainer',
        extend: 'Ext.container.Container',
        initComponent: function() {
            console.log("initComponent", this, arguments);
            this.callParent(arguments);
        }
    });

    Ext.define('Todo.view.ClearButton' , {
        renderTo: 'clearbutton',
        text: 'Clear completed',
        alias : 'widget.clearButton',
        extend: 'Ext.Button',
        initComponent: function() {
            console.log("initComponent", this, arguments);
            this.callParent(arguments);
        }
    });

    Ext.define('Todo.view.TextField' , {
        width: 466,
        renderTo: 'textfield',
        enableKeyEvents: true,
        alias : 'widget.textField',
        extend: 'Ext.form.TextField',
        emptyText: 'What needs to be done?',
        initComponent: function() {
            console.log("initComponent", this, arguments);
            this.callParent(arguments);
        }
    });

    Ext.define('Todo.view.List' , {
        tpl: tpl,
        store: store,
        renderTo: 'list',
        itemSelector: 'div.row',
        extend: 'Ext.view.View',
        alias : 'widget.taskList',
        // emptyText: 'No images available',
        initComponent: function() {
            console.log("initComponent", this, arguments);
            this.callParent(arguments);
        }
    });

    Ext.define('Todo.controller.Tasks', {
        extend: 'Ext.app.Controller',
        views: ['TextField', 'List', 'ClearButton', 'InfoContainer'],
        init: function() {
            console.log('controller init');
            this.control({
                'textField': {
                    keyup: this.onTextFieldKeyup
                },
                'taskList': {
                    itemclick: this.onItemClick
                },
                'clearButton': {
                    click: this.onClearButtonClick
                }
            });
        },
        onTextFieldKeyup: function(field, event) {
            var value = field.getValue();
            if (event.button === 12 && value !== '') {
                console.log("onTextFieldKeyup", this, arguments);
                this.addTask(value);
                this.updateInfo();
                field.reset();
            }
        },
        onItemClick: function(list, record, el, index, event) {
            console.log("onItemClick", this, arguments);
            this.toggleTask(record, el);
            this.updateInfo();
        },
        onClearButtonClick: function() {
            console.log("onClearButtonClick", this, arguments);
            this.deleteCompletedTasks();
            this.updateInfo();
        },
        deleteCompletedTasks: function() {
            var records = [];
            store.each(function(record) {
                if (record.get('checked')) {
                    records.push(record);
                }
            });
            store.remove(records);
        },
        addTask: function(label) {
            console.log("addTask", this, arguments);
            store.add({label: label, checked: false});
        },
        toggleTask: function(record, el) {
            if (record.get('checked')) {
                record.set('checked', false);
                Ext.fly(el).down('span').removeCls('checked');
            } else {
                record.set('checked', true);
                Ext.fly(el).down('span').addCls('checked');
            }
        },
        updateInfo: function() {
            if (!this.infoContainer) {
                this.infoContainer = Ext.widget('infoContainer');
            }
            var records = store.queryBy(function(record) {
                    return !record.get('checked');
                }),
                count = records.getCount();

            if (count) {
                this.infoContainer.update(count + ' item' + (count > 1 ? 's' : '') + ' left.')
            } else {
                this.infoContainer.update('');
            }
        }
    });

    Ext.application({
        name: 'Todo',
        controllers: ['Tasks'],
        launch: function() {
            console.log("launch", this, arguments);
            var list = Ext.widget('taskList');
            var textfield = Ext.widget('textField');
            var clearButton = Ext.widget('clearButton');
            this.controllers.first().updateInfo();
        }
    });

});
