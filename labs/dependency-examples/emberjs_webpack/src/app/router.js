/**
 * Todos Router
 *
 * Defined routes represent filters according to specs
 */
module.exports = Ember.Router.extend({

	root: Ember.Route.extend({

		showAll: Ember.Route.transitionTo( 'index' ),
		showActive: Ember.Route.transitionTo( 'active' ),
		showCompleted: Ember.Route.transitionTo( 'completed' ),

		index: Ember.Route.extend({
			route: '/',
			connectOutlets: function( router ) {
				var controller = router.get( 'applicationController' );
				var context = controller.namespace.entriesController;
				context.set( 'filterBy', '' );

				// This require was left here exclusively for design purposes
				// Loads decoupled controller/view based on current route
				controller.connectOutlet({
					viewClass: require('./views/items'),
					controller: require('./controllers/todos').create(),
					context: context
				});

			}
		}),

		active: Ember.Route.extend({
			route: '/active',
			connectOutlets: function( router ) {
				var controller = router.get( 'applicationController' );
				var context = controller.namespace.entriesController;
				context.set( 'filterBy', 'active' );

				// This require was left here exclusively for design purposes
				// Loads decoupled controller/view based on current route
				controller.connectOutlet({
					viewClass: require('./views/items'),
					controller: require('./controllers/todos').create(),
					context: context
				});

			}
		}),

		completed: Ember.Route.extend({
			route: '/completed',
			connectOutlets: function( router ) {
				var controller = router.get( 'applicationController' );
				var context = controller.namespace.entriesController;
				context.set( 'filterBy', 'completed' );

				// This require was left here exclusively for design purposes
				// Loads decoupled controller/view based on current route
				controller.connectOutlet({
					viewClass: require('./views/items'),
					controller: require('./controllers/todos').create(),
					context: context
				});

			}
		}),

		specs: Ember.Route.extend({
			route: '/specs',
			connectOutlets: function() {
				// This uses the bundle plugin to create a extra bundle and
				// loads test stuff async, because it's not needed on startup.
				require('bundle!./specs/helper')(function(){});
			}
		})
	})
});
