###*
* Viewport shell for the TodoDeftJS application.
###
Ext.define( "TodoDeftJS.view.Viewport",
	extend: "Ext.container.Viewport"
	requires: [ "TodoDeftJS.view.TodoView" ]


	initComponent: ->

		Ext.applyIf( @,
			items: [
				id: "todoView"
				xtype: "todoDeftJS-view-todoView"
			]
		)

		@callParent( arguments )

)