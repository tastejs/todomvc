/**
* Models a To-Do.
*/
Ext.define('TodoDeftJS.model.Todo', {
	extend: 'Ext.data.Model',

	fields: [
		{
			name: 'id'
		}, {
			name: 'title',
			type: 'string'
		}, {
			name: 'completed',
			type: 'boolean'
		}, {
			name: 'editing',
			type: 'boolean',
			defaultValue: false,
			persist: false
		}
	],

	constructor: function () {
		this.callParent(arguments);
		return this;
	}

});