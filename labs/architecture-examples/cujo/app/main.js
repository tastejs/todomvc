define({

	root: { $ref: 'dom!todoapp' },

	createView: {
		render: {
			template: { module: 'text!create/template.html' },
			replace: { module: 'create/strings' }
		},
		insert: { first: 'root' }
	},

	createForm: {
		getElement: { $ref: 'dom.first!form', at: 'createView' },
		connect: { 'todos.onAdd': 'reset' }
	},

	listView: {
		render: {
			template: { module: 'text!list/template.html' },
			replace: { module: 'list/strings' }
		},
		bind: {
			to: { $ref: 'todos' },
			bindings: {
				text: { node: 'label' },
				complete: { node: '.toggle', prop: 'checked', events: 'change' }
			}
		},
		insert: { after: 'createView' }
	},

	controlsView: {
		render: {
			template: { module: 'text!controls/template.html' },
			replace: { module: 'controls/strings' }
		},
		insert: { after: 'listView' }
	},

	todoController: {
		prototype: { create: 'controller' },
		properties: {
			todos: { $ref: 'todos' },

			createTodo: { compose: 'parseForm | cleanInput | generateId | todos.add' },
			removeTodo: { compose: 'todos.remove' },

			masterCheckbox: { $ref: 'dom.first!#toggle-all', at: 'listView' },
			countNode: { $ref: 'dom.first!.count', at: 'controlsView' },
			remainingNode: { $ref: 'dom.first!.remaining', at: 'controlsView' }
		},
		on: {
			createView: {
				'submit:form': 'createTodo'
			},
			listView: {
				'click:.destroy': 'removeTodo',
				'click:#toggle-all': 'toggleAll'
			},
			controlsView: {
				'click:#clear-completed': 'removeCompleted'
			}
		},
		connect: {
			'todos.onChange': 'updateCount'
		}
	},

	parseForm: { module: 'cola/dom/formToObject' },
	cleanInput: { module: 'create/cleanInput' },
	generateId: { module: 'create/generateId' },

	todoStore: {
		create: {
			module: 'cola/LocalStorageAdapter',
			args: 'todos-cujo'
		},
		bind: {
			to: { $ref: 'todos' }
		}
	},

	todos: {
		create: {
			module: 'cola/Hub',
			args: {
				strategyOptions: {
					validator: { module: 'create/validateTodo' }
				}
			}
		}
	},

	plugins: [
		{ module: 'wire/debug', trace: true },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'wire/connect' },
		{ module: 'wire/cola', comparator: 'text', querySelector: { $ref: 'dom.first!' } },
		{ module: 'wire/functional' }
	]
});