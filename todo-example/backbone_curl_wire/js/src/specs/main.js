define(
	{

		app: {
			create: {
				module: 'views/app',
				args: [
					{
						el: { $ref: 'dom.query!#todoapp' } // Bind to the existing skeleton of the App already present in the HTML.
						//template: { $ref: 'text!templates/stats.html' }
					}
				]
			},
			// Inject references to the view and a prefs store
			properties: {
				input: { $ref: 'dom.query!#new-todo' },
				allCheckbox: { $ref: 'dom.query!.mark-all-done' }
			},
			// Connect to events
			connect: {
				collection: {
					'add':   'addOne',
					'reset': 'addAll',
					'all':   'render'
				}
			}
		},

		collection: {
			create: {
				module: 'collections/todos',
				args: []
			},
			properties: {
				// Whoah! Use the wire factory with the defer option to inject
				// a function that will launch the User Prefs area using
				// another wire spec!
				_createTodo: { wire: { spec: 'specs/todo', defer: true } }
			},
			connect: {
				app: {
					'inputEntry': 'create'
				}
			}
		},

		plugins: [
			//{ module: 'wire/debug', trace: true },
			{ module: 'wire/jquery/dom' },
			{ module: 'wire/backbone/events' }
		]
		
	}

);