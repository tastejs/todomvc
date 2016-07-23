/* global Aria:true */
'use strict';

Aria.interfaceDefinition({
	$classpath: 'js.ITodoCtrl',
	$extends: 'aria.templates.IModuleCtrl',

	$interface: {
		saveTasks: function () {},
		addTask: function (description) {},
		deleteTask: function (idx) {}
	}
});
