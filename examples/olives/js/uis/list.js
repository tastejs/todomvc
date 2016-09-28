'use strict';
var OObject = require('olives').OObject;
var EventPlugin = require('olives')['Event.plugin'];
var BindPlugin = require('olives')['Bind.plugin'];
var tools = require('../lib/tools');
var router = require('../lib/router');
var RouterPlugin = require('../lib/routerPlugin');

module.exports = function listInit(view, model, stats) {
	// The OObject (the controller) initializes with a default model which is a simple store
	// But it can be initialized with any other store, like the LocalStore
	var list = new OObject(model);
	var modelPlugin = new BindPlugin(model, {
		toggleClass: tools.toggleClass
	});
	var ENTER_KEY = 13;
	var ESC_KEY = 27;

	// The plugins
	list.seam.addAll({
		event: new EventPlugin(list),
		model: modelPlugin,
		router: new RouterPlugin(router),
		stats: new BindPlugin(stats, {
			toggleClass: tools.toggleClass,
			toggleCheck: function (value) {
				this.checked = model.count() === value ? 'on' : '';
			}
		})
	});

	// Remove the completed task
	list.remove = function remove(event, node) {
		model.del(node.getAttribute('data-model_id'));
	};

	// Un/check all tasks
	list.toggleAll = function toggleAll(event, node) {
		var checked = !!node.checked;

		model.loop(function (value, idx) {
			this.update(idx, 'completed', checked);
		}, model);
	};

	// Enter edit mode
	list.startEdit = function startEdit(event, node) {
		var taskId = modelPlugin.getItemIndex(node);

		toggleEditing(taskId, true);
		getElementByModelId('input.edit', taskId).focus();
	};

	// Leave edit mode
	list.stopEdit = function stopEdit(event, node) {
		var taskId = modelPlugin.getItemIndex(node);
		var value;

		if (event.keyCode === ENTER_KEY || event.type === 'blur') {
			value = node.value.trim();

			if (value) {
				model.update(taskId, 'title', value);
			} else {
				model.del(taskId);
			}

			// When task #n is removed, #n+1 becomes #n, the dom node is updated to the new value,
			// so editing mode should exit anyway
			if (model.has(taskId)) {
				toggleEditing(taskId, false);
			}
		} else if (event.keyCode === ESC_KEY) {
			toggleEditing(taskId, false);
			// Also reset the input field to the previous value so that the blur event doesn't pick up the discarded one
			node.value = model.get(taskId).title;
		}
	};

	// Alive applies the plugins to the HTML view
	list.alive(view);

	function toggleEditing(taskId, bool) {
		var li = getElementByModelId('li', taskId);
		tools.toggleClass.call(li, bool, 'editing');
	}

	function getElementByModelId(selector, taskId) {
		return view.querySelector(selector + '[data-model_id="' + taskId + '"]');
	}
};
