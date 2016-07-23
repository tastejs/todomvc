Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'TodoDeftJS': 'js'
	}
});

Ext.syncRequire(['Ext.Component', 'Ext.ComponentManager', 'Ext.ComponentQuery']);