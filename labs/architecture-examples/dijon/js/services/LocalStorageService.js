/*global dijondemo */
/**
 * @author Camille Reynders
 * Date: 03/02/12
 * Time: 13:27
 */
(function( ns ) {
	'use strict';

	ns.services.LocalStorageService = function() {
		return {
			system: undefined, //inject
			store: function( data ) {
				return localStorage.setItem( 'todos-dijon', JSON.stringify( data ) );
			},
			retrieve: function() {
				var data = localStorage.getItem( 'todos-dijon' ),
					output = ( data && JSON.parse( data ) ) || [];
				this.system.notify( 'StorageService:retrieveCompleted', output );
			}
		};
	};

}( dijondemo ));
