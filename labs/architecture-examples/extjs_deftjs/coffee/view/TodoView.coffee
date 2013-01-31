###*
* To-Do data view.
###
Ext.define( "TodoDeftJS.view.TodoView",
	extend: "Ext.view.View"
	alias: "widget.todoDeftJS-view-todoView"
	controller: "TodoDeftJS.controller.TodoController"
	inject: [ "templateLoader", "todoStore" ]


	config:
		templateLoader: null
		todoStore: null


	initComponent: ->

		Ext.apply( @,

			itemSelector: "li.todo"
			store: @getTodoStore()
			tpl: ""

			loader:
				url: "templates/todolist.tpl"
				autoLoad: true
				renderer: @getTemplateLoader().templateRenderer

			templateConfig:
				controller: @getController()

		)

		@callParent( arguments )

)