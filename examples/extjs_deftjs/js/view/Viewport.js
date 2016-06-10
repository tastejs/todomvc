/**
* Viewport shell for the TodoDeftJS application.
*/
Ext.define('TodoDeftJS.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: ['TodoDeftJS.view.TodoView'],

	initComponent: function () {
		Ext.applyIf(this, {
			items: [
				{
					id: 'todoView'
				}, {
					xtype: 'todoDeftJS-view-todoView'
				}
			]
		});

		return this.callParent(arguments);
	}

});