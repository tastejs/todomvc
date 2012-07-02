Ext.define('Todo.view.TaskField' , {

	enableKeyEvents: true,

	alias : 'widget.taskField',

	extend: 'Ext.Component',

	emptyText: 'What needs to be done?',

	afterRender: function() {
		this.callParent(arguments);
		this.field = this.el.first();
		this.field.on('keyup', this.onKeyup, this);
	},

	onKeyup: function(event) {
		this.fireEvent('keyup', this, event);
	},

	getValue: function() {
		return this.field.dom.value;
	},

	setValue: function(value) {
		this.field.dom.value = value;
	},

	reset: function() {
		this.setValue('');
	}

});
