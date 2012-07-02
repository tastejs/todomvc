(function( app ) {
	'use strict';

	function switchFilter( filterName ){
		$('#filters li a')
			.removeClass('selected')
			.filter("[href='#/" + (filterName || "") + "']")
			.addClass('selected');
	}

	var Router = Ember.Router.extend({

		root: Ember.Route.extend({

			showAll: Ember.Route.transitionTo( 'index' ),
			showActive: Ember.Route.transitionTo( 'active' ),
			showCompleted: Ember.Route.transitionTo( 'completed' ),

			index: Ember.Route.extend({
				route: '/',
				connectOutlets: function( router ) {
					switchFilter('');
					var controller = router.get( 'applicationController' );
					var context = app.entriesController;
					context.set( 'filterBy', '' );
					controller.connectOutlet( 'todos', context )
				}
			}),

			active: Ember.Route.extend({
				route: '/active',
				connectOutlets: function( router ) {
					switchFilter('active');
					var controller = router.get( 'applicationController' );
					var context = app.entriesController;
					context.set( 'filterBy', 'active' );
					controller.connectOutlet( 'todos', context )
				}
			}),

			completed: Ember.Route.extend({
				route: '/completed',
				connectOutlets: function( router ) {
					switchFilter('completed');
					var controller = router.get( 'applicationController' );
					var context = app.entriesController;
					context.set( 'filterBy', 'completed' );
					controller.connectOutlet( 'todos', context )
				}
			}),

			specs: Ember.Route.extend({
				route: '/specs',
				connectOutlets: function() {
					// TODO: Write them
				}
			})
		})
	});

	app.Router = Router;

})( window.Todos );
