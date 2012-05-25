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
			querySelector: { $ref: 'dom.first!' },
			bindings: {
				text: { node: 'label' },
				complete: { node: '.toggle', prop: 'checked' }
			}
		},
		insert: { after: 'createView' }
	},

	todoController: {
		prototype: { module: 'controller' },
		properties: {
			parseForm: { module: 'cola/dom/formToObject' },
			createTodo: { compose: 'generateId | todoHub.add' }
		},
		on: {
			createView: { 'submit:form': 'handleSubmit' }
		}
	},

	generateId: { module: 'create/generateId' },

//	todoData: {
//		literal: [
//			{ id: 1, text: 'Test 1', complete: true },
//			{ id: 2, text: 'Test 2', complete: false }
//		],
//		bind: {
//			to: { $ref: 'todoHub' }
//		}
//	},
//
	todoData: {
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
		{ module: 'wire/debug' },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/cola', comparator: 'text' },
		{ module: 'wire/functional' }
	]
});