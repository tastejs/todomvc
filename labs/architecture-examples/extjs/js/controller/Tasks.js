Ext.define('Todo.controller.Tasks', {

	models: ['Task'],

	stores: ['Tasks'],

	extend: 'Ext.app.Controller',

	views: ['TaskField', 'TaskList', 'TaskToolbar'],

	refs: [
		{ref: 'taskList', selector: 'taskList'},
		{ref: 'taskToolbar', selector: 'taskToolbar'},
		{ref: 'checkAllBox', selector: 'checkAllBox'}
	],

	init: function() {
		this.control({
			'taskField': {
				keyup: this.onTaskFieldKeyup
			},
			'taskList': {
				todoChecked: this.onTodoChecked,
				itemdblclick: this.onTodoDblClicked,
				onTaskEditKeyup: this.onTaskEditKeyup,
				todoRemoveSelected: this.onTodoRemoveSelected
			},
			'completeButton': {
				click: this.onClearButtonClick
			},
			'checkAllBox': {
				click: this.onCheckAllClick
			}
		});

		this.getTasksStore().on({
			scope: this,
			update: this.onStoreDataChanged,
			datachanged: this.onStoreDataChanged
		});
	},

	onTaskFieldKeyup: function(field, event) {
		var ENTER_KEY_CODE = 13;
		var value = field.getValue().trim();
		if (event.keyCode === ENTER_KEY_CODE && value !== '') {
			var store = this.getTasksStore();
			store.add({label: value, checked: false});
			field.reset();
			store.sync();
		}
	},

	onTodoChecked: function(record) {
		record.set('checked', !record.get('checked'));
		record.store.sync();
		record.commit();
	},

	onTodoDblClicked: function (list, record, el) {
		record.set('editing', true);
		record.store.sync();
		record.commit();
	},

	onTodoRemoveSelected: function (record) {
		var store = this.getTasksStore();
		store.remove(record);
		store.sync();
	},

	onTaskEditKeyup: function (event, record, extEl) {
		var ENTER_KEY_CODE = 13;
		if (event.keyCode === ENTER_KEY_CODE) {
			this.finalizeTaskEdit(extEl, record);
		}
	},

	finalizeTaskEdit: function (extEl, record) {
		var value = extEl.getValue().trim();

		if (!value) {
			var store = this.getTasksStore();
			store.remove(record);
			store.sync();
		} else {
			record.set('label', value);
			record.set('editing', false);
			record.store.sync();
			record.commit();
		}
	},

	onClearButtonClick: function() {
		var records = [],
		store = this.getTasksStore();

		store.each(function(record) {
			if (record.get('checked')) {
				records.push(record);
			}
		});
		store.remove(records);
		store.sync();
	},

	onCheckAllClick: function(checked) {
		var store = this.getTasksStore();
		store.each(function(record) {
			record.set('checked', checked);
		});
		store.sync();
	},

	onStoreDataChanged: function() {
		var info = '', text = '',
		store = this.getTasksStore(),
		totalCount = store.getCount(),
		toolbar = this.getTaskToolbar(),
		button = toolbar.items.first(),
		container = toolbar.items.last(),
		records = store.queryBy(function(record) {
			return !record.get('checked');
		}),
		count = records.getCount(),
		checkedCount = totalCount - count;

		if (count) {
			info = '<strong>' + count + '</strong> item' + (count > 1 ? 's' : '') + ' left';
		}

		if (checkedCount) {
			text = 'Clear '+ checkedCount +' completed item' + (checkedCount > 1 ? 's' : '');
		}

		this.getCheckAllBox().updateCheckedState(totalCount, checkedCount);
		container.update(info);
		button.setText(text);
		button.setVisible(checkedCount);
		toolbar.setVisible(totalCount);
	}

});
