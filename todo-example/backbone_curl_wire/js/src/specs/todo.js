define(
[],
function() {
	return {

		view: {
			create: {
				module: 'views/todo'
			},
			properties: {
				template: { $ref: 'template.underscore!templates/todos.html' }
			},
			connect: {
				model: {
					'change': 'render'
				}
			},
			destroy: {
				'undelegateEvents': {},
				'remove': {}
			}
		},

		model: {
			create: {
				module: 'models/todo',
				args: [
					{ $ref: 'todo_attributes' },
					{
						collection: { $ref: 'collection' }
					}
				]
			},
			properties: {
				// attach the view to our model, so
				// the app view can access it from a collection change
				view: { $ref: 'view' }
			},
			connect: {
				view: {
					'destroy': 'destroy',
					'changeContent': 'set',
					'done': 'done'
				}
			},
			init: 'save', // Save model after creating it
			destroy: []
		},

		plugins: [
			//{ module: 'wire/debug', trace: true },
			{ module: 'wire/underscore/template' },
			{ module: 'wire/backbone/events' }
		]
		
	};
} );