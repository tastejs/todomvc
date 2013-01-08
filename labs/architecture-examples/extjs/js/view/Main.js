Ext.define('Todo.view.Main', {
	extend: 'Ext.container.Viewport',
	alias: 'widget.mainview',

	layout: {
		type: 'vbox',
		align: 'center'
	},

	autoScroll: true,

	defaults: {
		xtype: 'container',
		baseCls: null,
		width: 550
	},

	config: {
		items: [{
			cls: 'header',
			height: 130,
			style: 'padding-top: 37px',
			html: 'todos'
		},{
			cls: 'todoapp',
			id: 'todoapp',
			items: [{
				baseCls: null,
				xtype: 'container',
				cls: 'new-todo', 
				layout: 'hbox', 
				height: 80,
				items: [{
					xtype: 'container',
					baseCls: null,
					width: 40, 
					items: [{
						xtype: 'button',
						ui: 'plain',
						cls: 'toggle-all-button',
						text: '»',
						enableToggle: true,
						action: 'toggleAll'
					}]
				}, {
					flex:1,
					cls: 'edit',
					xtype: "textfield",
					height: 64, 
					name: 'newtask',
					enableKeyEvents: true,
					emptyText: "What needs to be done?"
				}]
			}, {
				cls: 'todo-list',
				xtype: 'taskList'
			}]
		}, {
			xtype: 'container',
			height: 45,
			baseCls: null,
			items: [{
				cls: 'footer',
				baseCls: null,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [{
					flex: 1,
					baseCls: null,
					style: 'text-align: left;',
					name: 'itemsLeft',
					data: { counts: 0 },
					tpl: [
						'<tpl><span id="todo-count"><b>{counts}</b> item',
							'<tpl if="counts &gt; 1">s</tpl>',
							'<tpl if="counts == 0">s</tpl>',
						' left</span>',
						'</tpl>'
					]
				}, {
					flex: 1,
					xtype: 'container',
					baseCls: 'filters',
					defaults: {
						style: 'margin-left: 5px; margin-right: 5px;',
						xtype: 'button',
						ui: 'plain',
						hrefTarget: '_self'
					},
					items: [{
						text: 'All',
						action: 'changeView',
						href: '#/'
					}, {
						text: 'Active',
						action: 'changeView',
						href: '#/active'
					}, {
						text: 'Completed',
						action: 'changeView',
						href: '#/completed'
					}]
				}, {
					flex: 1,
//					baseCls: null,
					xtype: 'container',
					items: [{
						xtype: 'button',
						hidden: true,
						action: 'clearCompleted',
						cls: 'clear-completed',
						text: 'Clear completed'
					}]
				}]
			}]
		}, {
			xtype: 'container',
			cls: 'info',
			html: [
				'<p>Double-click to edit a todo</p>',
				'<p>Inspired by the official <a href="https://github.com/maccman/spine.todos">Spine.Todos</a></p>',
				'<p>Revised by Kevin Cassidy</p>'
			].join("")
		}]
	}
});