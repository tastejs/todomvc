/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dojo/pubsub plugin
 * wire plugin that sets up subscriptions and topics to be published after
 * functions are invoked, and disconnect them when an object is destroyed.
 * This implementation uses dojo.publish, dojo.subscribe and dojo.unsubscribe
 * to do the work of connecting and disconnecting event handlers.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

define(['dojo', 'meld', 'dojo/_base/connect'], function(pubsub, meld) {

	return {
		wire$plugin: function pubsubPlugin(/*, options */) {

			var destroyHandlers = [];

			/**
			 * Add after advice to publish the result of target[method]
			 * @param target {Object} target object
			 * @param method {String} method name to which to apply advice
			 * @param topic {String} dojo.publish topic on which to publish the result
			 */
			function addPublishAdvice(target, method, topic) {
				return meld.after(target, method, function(result) {
					pubsub.publish(topic, [result]);
				});
			}

			/**
			 * Proxies methods on target so that they publish topics after
			 * being invoked.  The payload of a topic will be the return
			 * value of the method that triggered it.
			 * @param target {Object} object whose methods should be proxied
			 * @param publish {Object} hash of method names to topics each should publish
			 */
			function proxyPublish(target, publish) {
				var remove;
				for(var method in publish) {
					if(typeof target[method] == 'function') {
						// Add after advice and save remove function to remove
						// advice when this context is destroyed
						remove = addPublishAdvice(target, method, publish[method]);
						destroyHandlers.push(remove);
					}
				}
			}

			function subscribeTarget(target, subscriptions) {
				var subscribeHandles = [];
				for(var topic in subscriptions) {
					var method = subscriptions[topic];
					if(typeof target[method] == 'function') {
						subscribeHandles.push(pubsub.subscribe(topic, target, method));
					}
				}

				if(subscribeHandles.length > 0) {
					destroyHandlers.push(function() {
						unsubscribeTarget(subscribeHandles);
					});
				}
			}

			function unsubscribeTarget(handles) {
				for (var i = handles.length - 1; i >= 0; --i){
					pubsub.unsubscribe(handles[i]);
				}
			}

			return {
				context: {
					destroy: function(resolver) {
						// When the context is destroyed, remove all publish and
						// subscribe hooks created in this context
						for (var i = destroyHandlers.length - 1; i >= 0; --i){
							destroyHandlers[i]();
						}
						resolver.resolve();
					}
				},
				facets: {
					publish: {
						connect: function(promise, facet, wire) {
							proxyPublish(facet.target, facet.options);
							promise.resolve();
						}
					},
					subscribe: {
						connect: function(promise, facet, wire) {
							subscribeTarget(facet.target, facet.options);
							promise.resolve();
						}
					}
				}
			}
		}
	};
});