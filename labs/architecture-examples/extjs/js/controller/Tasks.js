(function () {
	'use strict';

	Ext.define('Todo.controller.Tasks', {
		models: ['Task'],

		stores: ['Tasks'],

		extend: 'Ext.app.Controller',

		views: ['TaskField', 'TaskList', 'TaskToolbar'],

		refs: [
			{ ref: 'taskList', selector: 'taskList' },
			{ ref: 'taskToolbar', selector: 'taskToolbar' },
			{ ref: 'checkAllBox', selector: 'checkAllBox' },
			{ ref: 'taskCount', selector: 'taskCount' },
			{ ref: 'clearTasksButton', selector: 'clearTasksButton' },
		],

		init: function () {
			this.control({
				'taskField': {
					keyup: this.onTaskFieldKeyup
				},
				'taskList': {
					todoChecked: this.onTodoChecked,
					itemdblclick: this.onTodoDblClicked,
					onTaskEditBlur: this.onTaskEditBlur,
					onTaskEditKeyup: this.onTaskEditKeyup,
					todoRemoveSelected: this.onTodoRemoveSelected
				},
				'clearTasksButton': {
					allCleared: this.onClearButtonClick
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

		onTaskFieldKeyup: function (field, event) {
			var ENTER_KEY_CODE = 13;
			var value = field.getValue().trim();

			if (event.keyCode === ENTER_KEY_CODE && value !== '') {
				var store = this.getTasksStore();

				store.add({ label: value, checked: false });
				field.reset();
				store.sync();
			}
		},

		onTodoChecked: function (record) {
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
			var ESCAPE_KEY_CODE = 27;

			if (event.keyCode === ENTER_KEY_CODE) {
				this.finalizeTaskEdit(extEl, record);
			}

			if (event.keyCode === ESCAPE_KEY_CODE) {
				this.cancelTaskEdit(extEl, record);
			}
		},

		onTaskEditBlur: function (extEl, record) {
			if (!this.finalizing) {
				this.finalizeTaskEdit(extEl, record);
			}
		},

		syncingTaskEdits: false,

		cancelTaskEdit: function (extEl, record) {
			if (this.syncingTaskEdits) {
				return;
			}

			this.syncingTaskEdits = true;

			record.set('editing', false);

			this.syncingTaskEdits = false;
		},

		finalizeTaskEdit: function (extEl, record) {
			if (this.syncingTaskEdits) {
				return;
			}

			this.syncingTaskEdits = true;

			var value = extEl.getValue().trim();

			if (!value) {
				var store = this.getTasksStore();

				store.remove(record);
				store.sync();
			} else {
				record.set('editing', false);
				record.set('label', value);
				record.store.sync();
				record.commit();
			}

			this.syncingTaskEdits = false;
		},

		onClearButtonClick: function () {
			var records = [];
			var store = this.getTasksStore();

			store.each(function (record) {
				if (record.get('checked')) {
					records.push(record);
				}
			});
			store.remove(records);
			store.sync();
		},

		onCheckAllClick: function (checked) {
			var store = this.getTasksStore();

			store.each(function (record) {
				record.set('checked', checked);
			});

			store.sync();
		},

		onStoreDataChanged: function () {
			var store = this.getTasksStore();
			var count = {};

			count.total = store.getCount();

			count.active = store.queryBy(function (record) {
				return !record.get('checked');
			}).getCount();

			count.completed = count.total - count.active;

			Ext.get('main').setVisible(count.total > 0);

			this.getCheckAllBox()
				.updateCheckedState(count.total, count.completed);

			this.getTaskToolbar()
				.setVisible(count.total > 0);

			this.getTaskCount()
				.updateCount(count.active);

			this.getClearTasksButton()
				.setVisible(count.total > 0)
				.updateCount(count.completed);
		}
	});
})();
