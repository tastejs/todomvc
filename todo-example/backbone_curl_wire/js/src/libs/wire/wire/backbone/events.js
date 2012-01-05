/**
 * @license Copyright (c) 2010-2011 Brian Cavalier
 * LICENSE: see the LICENSE.txt file. If file is missing, this file is subject
 * to the MIT License at: http://www.opensource.org/licenses/mit-license.php.
 */

/*
	File: events.js
	wire plugin that can connect event handlers after an object is initialized,
	and disconnect them when an object is destroyed.
*/
define( [], function() {

	return {
		wire$plugin: function eventsPlugin(ready, destroyed, options) {
			
			var event_handlers = [];

			function connect(target, ref, options, wire) {
				//console.log( 'hello', arguments );
				// If ref is a method on target, connect it to another object's method, i.e. calling a method on target
				// causes a method on the other object to be called.
				// If ref is a reference to another object, connect that object's method to a method on target, i.e.
				// calling a method on the other object causes a method on target to be called.
				if ( typeof target[ ref ] == 'function' ) {
					var eventName = ref;
					for( ref in options ) {
						wire.resolveRef( ref ).then( function( resolved ) {
							bindEvent( target, eventName, resolved[ options[ eventName ] ], resolved );
						} );
					}
				} else {
					wire.resolveRef( ref ).then( function( resolved ) {
						for ( var eventName in options ) {
							bindEvent( resolved, eventName, target[ options[ eventName ] ], target );
						}
					});
				}

			}

			function bindEvent( backbone_obj, eventName, callback, context ) {
				backbone_obj.bind( eventName, callback, context );

				event_handlers.push( function unbind() {
					backbone_obj.unbind( eventName, callback );
				} );
			}
			
			/*
				Function: connectFacet
				Setup connections for each specified in the connects param.  Each key
				in connects is a reference, and the corresponding value is an object
				whose keys are event names, and whose values are methods of object to
				invoke.  For example:
				connect: {
					"refToOtherThing": {
						"eventOrMethodOfOtherThing": "myOwnMethod"
					},

					"dom!myButton": {
						"onclick": "_handleButtonClick"
					},

					"dijit!myWidget": {
						"onChange": "_handleValueChange"
					}

					"myOwnEventOrMethod": {
						"refToOtherThing": "methodOfOtherThing"
					}
				}

				Parameters:
					factory - wiring factory
					object - object being wired, will be the target of connected events
					connects - specification of events to connect, see examples above.
			*/
			function connectFacet( wire, target, connects ) {
				for ( var ref in connects ) {
					connect( target, ref, connects[ ref ], wire );
				}
			}
			
			destroyed.then( function onContextDestroy() {
				for ( var i = event_handlers.length - 1; i >= 0; i-- ){
					if ( event_handlers[ i ] ) event_handlers[ i ]();
				}
			} );

			return {
				facets: {
					connect: {
						ready: function(promise, facet, wire) {
							connectFacet(wire, facet.target, facet.options);
							promise.resolve();
						}
					}
				}
			};
		}
	};
});