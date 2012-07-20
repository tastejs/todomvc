Ext.define('Todo.view.CheckAllBox' , {
	extend: 'Ext.Component',
	alias: 'widget.checkAllBox',
	tpl: '<tpl if="hasContent"><input id="toggle-all" type="checkbox" <tpl if="allComplete">checked</tpl>> <label for="toggle-all">Mark all as complete</label></tpl>',
	updateCheckedState: function (totalTasks, checkedTasks) {
		this.update({
			hasContent: !!totalTasks,
			allComplete: checkedTasks == totalTasks
		});
	},
	listeners: {
		render: function (component) {
			component.getEl().on('click', function (event, el) {
				var checked = !!Ext.get(el).getAttribute('checked');
				this.fireEvent('click', checked);
			}, this, {
				delegate: 'input'
			});
		}
	}
});
