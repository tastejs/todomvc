Ext.Loader.setConfig({enabled:true});

Ext.application({
    name: 'Todo',
    appFolder: 'js',
    controllers: ['Tasks'],
    launch: function() {

        Ext.create('Ext.container.Container', {
            renderTo: 'todo',
            items: [{
                xtype: 'taskField',
                contentEl: 'taskfield'
            }, {
                xtype: 'taskList'
            }, {
                xtype: 'taskToolbar'
            }]
        });

    }
});
