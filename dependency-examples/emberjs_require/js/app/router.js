define('app/router', [ 'ember' ],
	/**
	 * Todos Router
	 *
	 * Defined routes represent filters according to specs
	 *
	 * @returns Class
	 */
	function() {
		return Ember.Router.extend({
			enableLogging: true,

			root: Ember.Route.extend({

				showAll: Ember.Route.transitionTo( 'index' ),
				showActive: Ember.Route.transitionTo( 'active' ),
				showCompleted: Ember.Route.transitionTo( 'completed' ),

				index: Ember.Route.extend({
					route: '/',
					connectOutlets: function( router ) {
						var controller = router.get( 'applicationController' );
						var context = controller.namespace.entriesController;

						require([ 'app/controllers/todos', 'app/views/items' ],
							function( TodosController, ItemsView ) {
								controller.connectOutlet({
									viewClass: ItemsView,
									controller: TodosController.create(),
									context: context
								});
							}
						);
					}
				}),

				active: Ember.Route.extend({
					route: '/active',
				}),

				completed: Ember.Route.extend({
					route: '/completed',
				}),

				specs: Ember.Route.extend({
					route: '/specs',
					connectOutlets: function() {
						require( [ 'app/specs/helper' ] );
					}
				})
			})
		});
	}
);
