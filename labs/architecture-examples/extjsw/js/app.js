Ext.Loader.setConfig({enabled:true});

Ext.application({
    name:'Todo',
    appFolder:'js',
    autoCreateViewport:true,
    controllers:['TopBar', 'List', 'BottomBar', 'History'],
    launch:function() {

    }
});
