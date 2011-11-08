Ext.onReady(function() {

    Ext.Loader.setConfig({enabled:true});

    Ext.application({
        name: 'Todo',
        appFolder: 'js',
        controllers: ['Tasks'],
        launch: function() {
            Ext.create('Ext.container.Container', {
                renderTo: 'todo',
                items: [{
                    xtype: 'container',
                    html: '<h1>Todos</h1>'
                }, {
                    xtype: 'taskField'
                }, {
                    xtype: 'taskList'
                }, {
                    xtype: 'taskToolbar'
                }]
            });
        }
    });

});
