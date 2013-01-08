Ext.define('Todo.controller.Tasks', {
	extend: 'Ext.app.Controller',

	models: [ 'Task' ],
	stores: [ 'Tasks' ],
	views: 	[ 'TaskList' ],

	refs: [
		{ ref: 'toggleAll', 	selector: 'button[action=toggleAll]'},
		{ ref: 'clearButton', 	selector: 'button[action=clearCompleted]'},
		{ ref: 'toolBar',	  	selector: 'container[cls=footer]' },
		{ ref: 'itemsLeft',   	selector: 'container[name=itemsLeft]' },
		{ ref: 'todoeditor', 	selector: 'todoeditor', xtype: 'todoeditor', autoCreate: true }
	],

	init: function() {

		this.control({
			'todoeditor' : {
				'canceledit'	: this.onCancelEdit,
				'complete'		: this.onCompleteEdit
			},
			'taskList' : {
				'itemclick' 	: this.onItemClick,
				'itemdblclick' 	: this.onItemDblClicked
			},
			'textfield[name=newtask]' : {
				'keyup'			: this.onTaskFieldKeyup
			},
			'button[action=clearCompleted]': {
				'click'			: this.onClearButtonClick
			},
			'button[action=toggleAll]': {
				'toggle'		: this.onCheckAllClick
			}
		});

		this.store = this.getTasksStore();

		this.store.on({
			load		: this.onStoreDataChanged,
			update		: this.onStoreDataChanged,
			datachanged : this.onStoreDataChanged,
			scope 		: this
		});
	},

	onTaskFieldKeyup: function( field, event ) {
		var ENTER_KEY_CODE = 13,
			value = field.getValue().trim();

		if (event.keyCode === ENTER_KEY_CODE && value !== '') {
			this.store.add({label: value, completed: false});
			this.store.sync();
			this.store.filter();
			field.reset();
		}
	},

	onItemClick: function(dv, record, item, index, event, eOpts) {
		var eventTarget = Ext.getDom(event).target.nodeName;

		if (eventTarget == 'A') 
			this.store.remove(record);
		else if (eventTarget == 'INPUT')
			record.set('completed', !record.get('completed'))
		else 
			return;

		this.store.sync();
		this.store.filter();
	},

	onItemDblClicked: function (dv, record, item, index, event, eOpts) {
		var eventTarget = Ext.getDom(event).target.nodeName;

		if (eventTarget == 'LABEL') {
			var editor 	= this.getTodoeditor(),
				label 	= Ext.get(item).down('label');

			this.toggleEl = Ext.get(item).down('div');
			this.toggleEl.setStyle('visibility', 'hidden');

			editor.activeRecord = record;
			editor.startEdit(label, record.data['label']);
		}
	},

	onCancelEdit: function( editor, value) {
		console.log("cancel edit");
		this.toggleEl.setStyle('visibility', 'visible');
	},

	onCompleteEdit: function( editor, value ) {
		var value = value.trim();

		this.toggleEl.setStyle('visibility', 'visible');

console.log("VALUE IS [" + value + "]");

    	if ( !value ) 
    		this.store.remove(editor.activeRecord)
    	else 
    		editor.activeRecord.set('label', value);

        this.store.sync();
	},

	onClearButtonClick: function() {
		var records = [];

		this.store.each(function(record) {
			if (record.get('completed')) {
				records.push(record);
			}
		});
		this.store.remove(records);
		this.store.sync();
	},

	onCheckAllClick: function(cb, newValue, oldValue, opts) {

		this.store.suspendEvents();
		this.store.each(function(record) {
			record.set('completed', newValue);
		});
		this.store.resumeEvents();
		this.store.sync();
		this.store.filter();
	},

	onStoreDataChanged: function(store) {
		var filteredCount 	= this.store.getCount(),

			totalCount 		= this.store.queryBy(function(record) {
				return true;
			}).getCount(),

			completedCount 	= this.store.queryBy(function(record) {
				return record.get('completed');
			}).getCount(),

			text 			= completedCount ? 'Clear completed (' + completedCount + ')' : '',
			token 			= Ext.History.getToken();

		this.getToggleAll().setVisible(totalCount).toggle((token == '/completed' && filteredCount > 0) || completedCount == totalCount, true);
		this.getClearButton().setText(text).setVisible(completedCount);
		this.getItemsLeft().update({ counts: totalCount - completedCount });
		this.getToolBar().setVisible(totalCount);	
	}
});