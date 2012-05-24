define({

	root: { $ref: 'dom!todoapp' },

	createView: {
		render: {
			module: 'text!create/template.html'
		},
		insert: { first: 'root' }
	},

	listView: {
		render: {
			module: 'text!list/template.html'
		},
		bind: {
			to: { $ref: 'todoHub' },
			identifier: 'id',
			comparator: 'id',
			querySelector: { $ref: 'dom.first!' },
			bindings: {
				id: { prop: 'data-todo-id' },
				text: { node: 'label' },
				complete: { node: '.toggle', prop: 'checked', event: 'change' }
			}
		},
		insert: { after: 'createView' }
	},

	todoController: {
		prototype: { module: 'controller' },
		properties: {
			parseForm: { module: 'cola/dom/formToObject' },
			createTodo: { compose: 'todoHub.add' }
		},
		on: {
			createView: { 'submit:form': 'handleSubmit' }
		}
	},

	todoData: {
		literal: [
			{ id: 1, text: 'Test 1', complete: true },
			{ id: 2, text: 'Test 2', complete: false }
		],
		bind: {
			to: { $ref: 'todoHub' },
			identifier: 'id'
		}
	},

	todoHub: { create: 'cola/Hub' },

	controlsView: {
		render: {
			module: 'text!controls/template.html'
		},
		insert: { last: 'listView' }
	},

	plugins: [
		{ module: 'wire/debug' },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/cola' },
		{ module: 'wire/functional' }
	]
});