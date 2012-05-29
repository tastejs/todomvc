define({

	root: { $ref: 'dom!todoapp' },

	createView: {
		render: {
			template: { module: 'text!create/template.html' },
			replace: { module: 'create/strings' }
		},
		insert: { first: 'root' }
	},

	listView: {
		render: {
			template: { module: 'text!list/template.html' },
			replace: { module: 'list/strings' }
		},
		bind: {
			to: { $ref: 'todoHub' },
			bindings: {
				text: { node: 'label' },
				complete: { node: '.toggle', prop: 'checked', events: 'change' }
			}
		},
		insert: { after: 'createView' }
	},

	todoController: {
		prototype: { create: 'controller' },
		properties: {
			parseForm: { module: 'cola/dom/formToObject' },
			getCheckboxes: { $ref: 'getCheckboxes' },

			masterCheckbox: { $ref: 'dom.first!#toggle-all', at: 'listView' },
			countNodes: { $ref: 'dom.all!.count', at: 'controlsView' },

			// TODO: This is ugly and flat out wrong, but works for demo purposes
			// This will iterate over all the todos in the adapter, not just
			// the ones that happen to be shown.
			// And we shouldn't have to know about the adapter at all.
			_forEachTodo: { compose: 'todos.forEach' }
		},
		on: {
			createView: {
				'submit:form': 'handleSubmit'
			},
			listView: {
				'click:.destroy': 'remove',
				'click:.toggle': 'update',
				'click:#toggle-all': 'toggleAll'
			},
			controlsView: {
				'click:#clear-completed': 'removeCompleted'
			}
		},
		connect: {
			add: 'generateId | todoHub.add',
			update: 'todoHub.update',
			remove: 'todoHub.remove',
			'todoHub.onUpdate': 'updateCount',
			'todoHub.onRemove': 'updateCount'
		},
		ready: 'updateCount'
	},

	qsa: { $ref: 'dom.all!' },
	getCheckboxes: { $ref: 'bind!qsa', args: ['.toggle', { $ref: 'listView' }] },
	generateId: { module: 'create/generateId' },

	todos: {
		create: {
			module: 'cola/LocalStorageAdapter',
			args: 'todos'
		},
		bind: {
			to: { $ref: 'todoHub' }
		}
	},

	todoHub: { create: 'cola/Hub' },

	controlsView: {
		render: {
			template: { module: 'text!controls/template.html' },
			replace: { module: 'controls/strings' }
		},
		insert: { after: 'listView' }
	},

	plugins: [
//		{ module: 'wire/debug' },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'wire/connect' },
		{ module: 'wire/cola', comparator: 'text', querySelector: { $ref: 'dom.first!' } },
		{ module: 'wire/functional' }
	]
});