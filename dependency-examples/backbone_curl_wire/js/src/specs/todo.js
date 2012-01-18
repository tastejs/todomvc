define(
[],
function() {
	return {

		view: {
			create: {
				module: 'views/todo'
			},
			properties: {
				// Dom elements need to be found in the view after the rendering of the template
				input: '.todo-input',
				checkbox: '.check',

				// Class names
				editing: 'editing',

				// Pass in our template
				template: { $ref: 'template.underscore!templates/todos.html' }
			},
			connect: {
				model: {
					'change': 'render'
				}
			},
			init: {},
			destroy: {
				'undelegateEvents': [], // Clear bound dom events
				'remove': []
			}
		},

		model: {
			create: {
				module: 'models/todo',
				args: [

					// Attributes
					{ $ref: 'todo_attributes' }, // Set the models initial attributes to those passed into the wire spec

					// Options
					{
						// Add the collection to the model so backbone has access to it
						collection: { $ref: 'collection' }
					}

				]
			},
			properties: {
				// attach the view to our model, so
				// the views/app view can access it from a collection change
				view: { $ref: 'view' }
			},
			connect: {
				view: {
					'destroy': 'destroy',
					'changeContent': 'save',
					'changeDone': 'save'
				}
			},
			init: 'save', // Save model after creating it
			destroy: {}
		},

		plugins: [
			//{ module: 'wire/debug', trace: true },
			{ module: 'wire/underscore/template' },
			{ module: 'wire/backbone/events' }
		]
		
	};
} );