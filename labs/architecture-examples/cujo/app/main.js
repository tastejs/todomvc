define({

	root: { $ref: 'dom!todoapp' },

	createView: {
		render: {
			template: { module: 'text!create/template.html' },
			replace: { module: 'i18n!create/strings' }
		},
		insert: { first: 'root' }
	},

	createForm: {
		element: { $ref: 'dom.first!form', at: 'createView' },
		connect: { 'todos.onAdd': 'reset' }
	},

	listView: {
		render: {
			template: { module: 'text!list/template.html' },
			replace: { module: 'i18n!list/strings' },
			css: { module: 'css!list/structure.css' }
		},
		bind: {
			to: { $ref: 'todos' },
			bindings: {
				text: 'label, .edit',
				complete: [{ selector: '.toggle', attr: 'checked' }]
			}
		},
		insert: { after: 'createView' }
	},

	controlsView: {
		render: {
			template: { module: 'text!controls/template.html' },
			replace: { module: 'i18n!controls/strings' },
			css: { module: 'css!controls/structure.css' }
		},
		insert: { after: 'listView' }
	},

	footerView: {
		render: {
			template: { module: 'text!footer/template.html' },
			replace: { module: 'i18n!footer/strings' }
		},
		insert: { after: 'root' }
	},

	todoController: {
		prototype: { create: 'controller' },
		properties: {
			todos: { $ref: 'todos' },

			createTodo: { compose: 'parseForm | cleanInput | generateId | todos.add' },
			removeTodo: { compose: 'todos.get | todos.remove' },
			updateTodo: { compose: 'todos.get | todos.update' },

			masterCheckbox: { $ref: 'dom.first!#toggle-all', at: 'listView' },
			countNode: { $ref: 'dom.first!.count', at: 'controlsView' },
			remainingNodes: { $ref: 'dom.all!#todo-count strong', at: 'controlsView' }
		},
		on: {
			createView: {
				'submit:form': 'createTodo'
			},
			listView: {
				'click:.destroy': 'removeTodo',
				'change:.toggle': 'updateTodo',
				'click:#toggle-all': 'toggleAll'
			},
			controlsView: {
				'click:#clear-completed': 'removeCompleted'
			}
		},
		connect: {
			updateTotalCount: 'setTodosTotalState',
			updateRemainingCount: 'setTodosRemainingState',
			updateCompletedCount: 'setTodosCompletedState',
			'todos.onChange': 'updateCount'
		}
	},

	parseForm: { module: 'cola/dom/formToObject' },
	cleanInput: { module: 'create/cleanInput' },
	generateId: { module: 'create/generateId' },

	todoStore: {
		create: {
			module: 'cola/adapter/LocalStorage',
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

	setTodosTotalState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: [{ $ref: 'root' }, 'todos']
		}
	},

	setTodosRemainingState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: [{ $ref: 'root' }, 'remaining']
		}
	},

	setTodosCompletedState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: [{ $ref: 'root' }, 'completed']
		}
	},

	setTodoCompletedState: {
		create: {
			module: 'cola/transform/createEnum',
			// need to use literal factory until wire 0.9
			args: { literal: { 'true': 'completed', 'false': 'foo' } }
		}
	},

//	setTodosCompletedState: {
//		setClasses: { 0: 'completed-zero' }
//	},

	plugins: [
		{ module: 'wire/debug' },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/connect' },
		{ module: 'cola', comparator: 'text' },
		{ module: 'wire/aop' }
	]
});