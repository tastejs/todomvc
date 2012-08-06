define({

	// Cujo uses OOCSS principles and thus separates theme (skin)
	// from structure CSS.
	theme: { module: 'css!theme/base.css' },

	// The root node where all the views will be inserted
	root: { $ref: 'dom!todoapp' },

	// Render and insert the create view
	createView: {
		render: {
			template: { module: 'text!create/template.html' },
			replace: { module: 'i18n!create/strings' }
		},
		insert: { first: 'root' }
	},

	// Hook up the form to auto-reset whenever a new todo is added
	createForm: {
		element: { $ref: 'dom.first!form', at: 'createView' },
		connect: { 'todos.onAdd': 'reset' }
	},

	// Render and insert the list of todos, linking it to the
	// data and mapping data fields to the DOM
	listView: {
		render: {
			template: { module: 'text!list/template.html' },
			replace: { module: 'i18n!list/strings' },
			css: { module: 'css!list/structure.css' }
		},
		insert: { after: 'createView' },
		bind: {
			to: { $ref: 'todos' },
			comparator: 'dateCreated',
			bindings: {
				text: 'label, .edit',
				complete: [
					'.toggle',
					{ attr: 'classList', handler: { module: 'list/setCompletedClass' } }
				]
			}
		}
	},

	// Render and insert the "controls" view--this has the todo count,
	// filters, and clear completed button.
	controlsView: {
		render: {
			template: { module: 'text!controls/template.html' },
			replace: { module: 'i18n!controls/strings' },
			css: { module: 'css!controls/structure.css' }
		},
		insert: { after: 'listView' }
	},

	// Render and insert the footer.  This is mainly static text, but
	// is still fully internationalized.
	footerView: {
		render: {
			template: { module: 'text!footer/template.html' },
			replace: { module: 'i18n!footer/strings' }
		},
		insert: { after: 'root' }
	},

	// Create a localStorage adapter that will use the storage
	// key 'todos-cujo' for storing todos.  This is also linked,
	// creating a two-way linkage between the listView and the
	// data storage.
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
		},
		before: {
			add: 'cleanTodo | generateMetadata',
			update: 'cleanTodo'
		}
	},

	// The main controller, which is acting more like a mediator in this
	// application by reacting to events in multiple views.
	// Typically, cujo-based apps will have several (or many) smaller
	// view controllers. Since this is a relatively simple application,
	// a single controller fits well.
	todoController: {
		prototype: { create: 'controller' },
		properties: {
			todos: { $ref: 'todos' },

			createTodo: { compose: 'parseForm | todos.add' },
			removeTodo: { compose: 'todos.remove' },
			updateTodo: { compose: 'todos.update' },

			querySelector: { $ref: 'dom.first!' },

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
				'click:#toggle-all': 'toggleAll',
				'dblclick:label': 'todos.edit',
				'change,focusout:.edit': 'todos.submit' // also need way to submit on [enter]
			},
			controlsView: {
				'click:#clear-completed': 'removeCompleted'
			}
		},
		connect: {
			updateTotalCount: 'setTodosTotalState',
			updateRemainingCount: 'setTodosRemainingState',
			updateCompletedCount: 'setTodosCompletedState',
			'todos.onChange': 'updateCount',
			'todos.onEdit': 'todos.findNode | toggleEditingState.add | beginEditTodo',
			'todos.onSubmit': 'todos.findNode | toggleEditingState.remove | todos.findItem | endEditTodo'
		}
	},

	parseForm: { module: 'cola/dom/formToObject' },
	cleanTodo: { module: 'create/cleanTodo' },
	generateMetadata: { module: 'create/generateMetadata' },

	toggleEditingState: {
		create: {
			module: 'wire/dom/transform/toggleClasses',
			args: {
				classes: 'editing'
			}
		}
	},

	setTodosTotalState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'todos' }
		}
	},

	setTodosRemainingState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'remaining' }
		}
	},

	setTodosCompletedState: {
		create: {
			module: 'wire/dom/transform/cardinality',
			args: { node: { $ref: 'root' }, prefix: 'completed' }
		}
	},

	plugins: [
//		{ module: 'wire/debug', trace: true },
		{ module: 'wire/dom' },
		{ module: 'wire/dom/render' },
		{ module: 'wire/on' },
		{ module: 'wire/aop' },
		{ module: 'wire/connect' },
		{ module: 'cola' }
	]
});
