Ext.Loader.setConfig({enabled:true});

Ext.application({
    name: 'Todo',
    appFolder: 'js',
    controllers: ['Tasks'],
    launch: function() {

        Ext.create('Ext.container.Container', {
            renderTo: Ext.select('header').elements[0],
            items: [{
                xtype: 'taskField',
                contentEl: 'new-todo'
            }, {
                xtype: 'taskList'
            }, {
                xtype: 'taskToolbar'
            }]
        });

    }
});
