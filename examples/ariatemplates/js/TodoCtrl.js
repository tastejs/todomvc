/* global aria:true, Aria:true */
'use strict';

Aria.classDefinition({
	$classpath: 'js.TodoCtrl',
	$extends: 'aria.templates.ModuleCtrl',
	$implements: ['js.ITodoCtrl'],
	$dependencies: ['aria.storage.LocalStorage'],

	$statics: {
		STORAGE_NAME: 'todos-ariatemplates'
	},

	$constructor: function (storagename) {
		var tasklist;
		this.$ModuleCtrl.constructor.call(this);
		this._storage = new aria.storage.LocalStorage();
		this.__storagename = storagename || this.STORAGE_NAME;
		tasklist = this._storage.getItem(this.__storagename);
		this.setData({
			todolist: (tasklist ? tasklist : [])
		});
	},

	$prototype: {
		$publicInterfaceName: 'js.ITodoCtrl',

		saveTasks: function () {
			this._storage.setItem(this.__storagename, this._data.todolist);
		},

		addTask: function (description) {
			this.json.add(this._data.todolist, {title: description, completed: false});
		},

		deleteTask: function (idx) {
			this.json.removeAt(this._data.todolist, idx);
		}
	}
});
