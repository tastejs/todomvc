Ext.Loader.setConfig({enabled:true});

Ext.application({
    name:'Todo',
    appFolder:'app',
    autoCreateViewport:true,
    controllers:['TopBar', 'List', 'BottomBar', 'History'],
    launch:function() {

    }
});
