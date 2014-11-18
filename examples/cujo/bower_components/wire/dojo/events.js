/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dojo/events plugin
 * wire plugin that can connect event handlers after an object is
 * initialized, and disconnect them when an object is destroyed.
 * This implementation uses dojo.connect and dojo.disconnect to do
 * the work of connecting and disconnecting event handlers.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

define(['when', '../lib/connection', 'dojo', 'dojo/_base/event'],
function(when, connection, events) {

	return {
		wire$plugin: function eventsPlugin(/*, options*/) {

			var connectHandles = [];

			function handleConnection(source, eventName, handler) {
				connectHandles.push(events.connect(source, eventName, handler));
			}

			function connect(source, connect, options, wire) {
				return connection.parse(source, connect, options, wire, handleConnection);
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
			function connectFacet(wire, facet) {
                var promises, connects;

				promises = [];
				connects = facet.options;

				for(var ref in connects) {
					promises.push(connect(facet, ref, connects[ref], wire));
				}

                return when.all(promises);
			}

			return {
				context: {
					destroy: function(resolver) {
						for (var i = connectHandles.length - 1; i >= 0; i--){
							events.disconnect(connectHandles[i]);
						}
						resolver.resolve();
					}
				},
				facets: {
					connect: {
						connect: function(resolver, facet, wire) {
                            resolver.resolve(connectFacet(wire, facet));
						}
					}
				}
			};
		}
	};
});