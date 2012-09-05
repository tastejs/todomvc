Ext.define('Todo.view.TaskList' , {
	store: 'Tasks',
	loadMask: false,
	itemSelector: 'li',
	extend: 'Ext.view.View',
	alias : 'widget.taskList',
	autoEl: 'ul',
	id: 'todo-list',
	tpl: Ext.create('Ext.XTemplate',
		'<tpl for=".">',
		'<li class="<tpl if="checked">done</tpl> <tpl if="editing">editing</tpl>">',
		'<div class="view">',
		'<input type="checkbox" <tpl if="checked">checked</tpl> /> ',
		'<label>{label}</label>',
		'<a class="destroy"></a>',
		'</div>',
		'<input class="edit" type="text" value="{label}">',
		'</li>',
		'</tpl>',
		{compiled: true}
	),
	listeners: {
		render: function () {
			this.el.on('click', function (clickEvent, el) {
				var extEl = Ext.get(el)
				  , parent;
				if(extEl.getAttribute('type') === 'checkbox') {
					parent = extEl.parent('li');
					this.fireEvent('todoChecked', this.getRecord(parent));
				}
			}, this, {
				// TODO I can't get this to delegate using something like div.view input or input[type="checkbox"]
				// So this will have a bug with teh input.edit field... I need to figure that out so I don't have to
				// do the if logic above.
				delegate: 'input'
			});

			this.el.on('keyup', function (keyEvent, el) {
				var extEl = Ext.get(el)
				  , parent;
				if(extEl.getAttribute('type') === 'text') {
					parent = extEl.parent('li');
					this.fireEvent('onTaskEditKeyup', keyEvent, this.getRecord(parent), extEl);
				}
			}, this, {
				delegate: 'input'
			});

			this.el.on('click', function (clickEvent, el) {
				var extEl = Ext.get(el)
				  , record = this.getRecord(extEl.parent('li'))
				  , self = this;

				  // Todo this is clearly not the best way to do this, but without this we get an error when
				  // the item that was clicked is removed.
				  setTimeout(function () { self.fireEvent('todoRemoveSelected', record); }, 1);
			}, this, {
				delegate: 'a'
			});
		}
	}
});
