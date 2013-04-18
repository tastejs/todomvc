(function () {
	'use strict';

	Ext.define('Todo.view.TaskList' , {
		extend: 'Ext.view.View',

		alias: 'widget.taskList',

		store: 'Tasks',

		loadMask: false,

		autoEl: 'ul',

		itemSelector: 'li',

		id: 'todo-list',

		tpl: new Ext.XTemplate(
			'<tpl for=".">',
			'<li class="<tpl if="checked">completed</tpl> <tpl if="editing">editing</tpl>">',
			'<div class="view">',
			'<input class="toggle" type="checkbox" <tpl if="checked">checked</tpl>>',
			'<label>{label}</label>',
			'<button class="destroy"></button>',
			'</div>',
			'<input class="edit" value="{label}">',
			'</li>',
			'</tpl>'
		),

		listeners: {
			render: function () {
				this.el.on('click', function (clickEvent, el) {
					var extEl = Ext.get(el);
					var parent = extEl.parent('li');

					this.fireEvent('todoChecked', this.getRecord(parent));
				}, this, {
					delegate: '.toggle'
				});

				this.el.on('keyup', function (keyEvent, el) {
					var extEl = Ext.get(el);
					var parent = extEl.parent('li');

					this.fireEvent('onTaskEditKeyup', keyEvent, this.getRecord(parent), extEl);
				}, this, {
					delegate: '.edit'
				});

				this.el.on('click', function (clickEvent, el) {
					var extEl = Ext.get(el);
					var record = this.getRecord(extEl.parent('li'));

					this.fireEvent('todoRemoveSelected', record);
				}, this, {
					delegate: 'button'
				});
			},

			afterRender: function () {
				this.el.dom.removeAttribute('tabindex');

				this.el.on('dblclick', function (event, el) {
					var extEl = this.getEl();
					var input = extEl.child('.x-item-selected').child('input');
					var value = input.getValue().trim();

					var record = this.getRecord(Ext.get(el).parent('li'));

					input.dom.value = '';
					input.dom.focus();
					input.dom.value = value;

					input.on('blur', function () {
						this.fireEvent('onTaskEditBlur', input, record);
					}, this);
				}, this, {
					delegate: 'label'
				});
			}
		}
	});
})();
