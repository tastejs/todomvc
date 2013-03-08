/*
 * ToDoMVC - ExtJS 4.1.1a
 * 
 * Date Created: November 10, 2012
 * Last Updated: March 8, 2013
 *
 */

Ext.Loader.setConfig({
	enabled: true
});

Ext.application({
	name: 'Todo',
	appFolder: 'js',

	stores: [ 'Tasks' ],
	controllers: [ 'Tasks'],

	launch: function() {

		Ext.create('Todo.view.Main');

		this.getTasksStore().load();

		Ext.History.init(function(history) {
			this.setRoute(history.getToken());
		}, this);

		Ext.History.on('change', this.setRoute, this);
		Ext.ComponentQuery.query("[name=newtask]")[0].focus();
	},

	setRoute: function(token) {
		var store = this.getTasksStore(),
			token = token || '/',
			btns =  Ext.ComponentQuery.query('button[action=changeView]');

		Ext.each(btns, function(x) {
			x.getEl().down('span').applyStyles({ 'text-align': 'center', 'font-weight': (x.href == '#' + token) ? 'bold' : 'normal'});
		});

		store.clearFilter();

		if (token != '/') 
			store.filter('completed', token == '/completed');
	}
});