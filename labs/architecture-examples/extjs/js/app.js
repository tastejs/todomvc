(function () {
	'use strict';

	Ext.Loader.setConfig({
		enabled: true
	});

	Ext.application({
		name: 'Todo',

		appFolder: 'js',

		models: ['Task'],
		controllers: ['Tasks'],

		launch: function () {
			Ext.create('Todo.view.TaskField', {
				renderTo: Ext.select('header').first(),
				contentEl: 'new-todo'
			});

			Ext.create('Todo.view.CheckAllBox', {
				renderTo: 'main'
			});

			Ext.create('Todo.view.TaskList', {
				renderTo: 'main'
			});

			Ext.create('Todo.view.TaskToolbar', {
				renderTo: 'todoapp'
			});
		}
	});
})();
