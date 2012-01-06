define(
[],
function() {
	return {

		view: {
			create: {
				module: 'views/todo'
			}
		},

		model: {
			create: {
				module: 'models/todo',
				args: [
					{ $ref: 'todo_attributes' },
					{}
				]
			},
			properties: {
				// attach the view to our model, so
				// the app view can access it from a collection change
				view: { $ref: 'view' }
			},
			init: 'save' // Save model after creating it
		},

		plugins: [
			{ module: 'wire/debug', trace: true },
			{ module: 'wire/backbone/events' }
		]
		
	};
} );