(function () {
	'use strict';

	Ext.define('Todo.view.TaskField', {
		extend: 'Ext.Component',

		alias: 'widget.taskField',

		emptyText: 'What needs to be done?',

		enableKeyEvents: true,

		afterRender: function () {
			this.field = this.el.parent().child('input');
			this.field.on('keyup', this.onKeyup, this);
		},

		onKeyup: function (event) {
			this.fireEvent('keyup', this, event);
		},

		getValue: function () {
			return this.field.dom.value;
		},

		setValue: function (value) {
			this.field.dom.value = value;
		},

		reset: function () {
			this.setValue('');
		}
	});
})();
