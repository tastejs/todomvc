/**
* To-Do data view.
*/
Ext.define('TodoDeftJS.view.TodoView', {
	extend: 'Ext.view.View',
	alias: 'widget.todoDeftJS-view-todoView',
	controller: 'TodoDeftJS.controller.TodoController',
	inject: ['templateLoader', 'todoStore'],

	config: {
		templateLoader: null,
		todoStore: null
	},

	initComponent: function () {
		Ext.apply(this, {
			itemSelector: 'li.todo',
			store: this.getTodoStore(),
			tpl: '',
			loader: {
				url: 'templates/todolist.tpl',
				autoLoad: true,
				renderer: this.getTemplateLoader().templateRenderer
			},
			templateConfig: {
				controller: this.getController()
			}
		});

		return this.callParent(arguments);
	}

});