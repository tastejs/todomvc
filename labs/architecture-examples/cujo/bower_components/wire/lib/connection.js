/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Helper module that parses incoming and outgoing method-call-based
 * connection specs. This module is used by wire plugins to parse connections.
 *
 * Incoming connection forms:
 *
 * 'srcComponent.triggerMethod': 'method'
 * 'srcComponent.triggerMethod': 'transforms | method'
 * srcComponent: {
 *   triggerMethod1: 'method',
 *   triggerMethod2: 'transforms | method',
 *   ...
 * }
 *
 * Outgoing connection forms:
 *
 * eventName: 'destComponent.method'
 * eventName: 'transforms | destComponent.method'
 * eventName: {
 *   destComponent1: 'method',
 *   destComponent2: 'transforms | method',
 *   ...
 * }
 *
 */

(function(define){ 'use strict';
define(function(require) {

	var when, array, functional;

	when = require('when');
	array = require('./array');
	functional = require('./functional');

	return {
		parse: parse,
		parseIncoming: parseIncoming,
		parseOutgoing: parseOutgoing
	};

	/**
	 * Determines if the connections are incoming or outgoing, and invokes parseIncoming
	 * or parseOutgoing accordingly.
	 * @param proxy
	 * @param connect
	 * @param options
	 * @param wire {Function} wire function to use to wire, resolve references, and get proxies
	 * @param createConnection {Function} callback that will do the work of creating
	 *  the actual connection from the parsed information
	 * @return {Promise} promise that resolves when connections have been created, or
	 *  rejects if an error occurs.
	 */
	function parse(proxy, connect, options, wire, createConnection) {
		var source, eventName;

		// First, determine the direction of the connection(s)
		// If ref is a method on target, connect it to another object's method, i.e. calling a method on target
		// causes a method on the other object to be called.
		// If ref is a reference to another object, connect that object's method to a method on target, i.e.
		// calling a method on the other object causes a method on target to be called.

		source = connect.split('.');
		eventName = source[1];
		source = source[0];

		return when(wire.resolveRef(source),
			function(source) {
				return parseIncoming(source, eventName, proxy, connect, options, wire, createConnection);
			},
			function() {
				return parseOutgoing(proxy, connect, options, wire, createConnection);
			}
		);
	}

	/**
	 * Parse incoming connections and call createConnection to do the work of
	 * creating the connection.
	 *
	 * @param source
	 * @param eventName
	 * @param targetProxy
	 * @param connect
	 * @param options
	 * @param wire {Function} wire function to use to wire, resolve references, and get proxies
	 * @param createConnection {Function} callback that will do the work of creating
	 *  the actual connection from the parsed information
	 * @return {Promise} promise that resolves when connections have been created, or
	 *  rejects if an error occurs.
	 */
	function parseIncoming(source, eventName, targetProxy, connect, options, wire, createConnection) {
		var promise, methodName;

		if(eventName) {
			// 'component.eventName': 'methodName'
			// 'component.eventName': 'transform | methodName'

			methodName = options;

			promise = when(functional.compose.parse(targetProxy, methodName, wire),
				function(func) {
					return createConnection(source, eventName, proxyInvoker(targetProxy, func));
				}
			);

		} else {
			// componentName: {
			//   eventName: 'methodName'
			//   eventName: 'transform | methodName'
			// }

			source = methodName;
			promise = when(wire.resolveRef(connect), function(source) {
				var name, promises;

				function createConnectionFactory(source, name, targetProxy) {
					return function(func) {
						return createConnection(source, name, proxyInvoker(targetProxy, func));
					};
				}

				promises = [];
				for(name in options) {
					promises.push(when(functional.compose.parse(targetProxy, options[name], wire),
						createConnectionFactory(source, name, targetProxy)
					));
				}

				return when.all(promises);
			});
		}

		return promise;

	}

	/**
	 * Parse outgoing connections and call createConnection to do the actual work of
	 * creating the connection.  Supported forms:
	 *
	 * @param proxy
	 * @param connect
	 * @param options
	 * @param wire {Function} wire function to use to wire, resolve references, and get proxies
	 * @param createConnection {Function} callback that will do the work of creating
	 *  the actual connection from the parsed information
	 * @return {Promise} promise that resolves when connections have been created, or
	 *  rejects if an error occurs.
	 */
	function parseOutgoing(proxy, connect, options, wire, createConnection) {
		return createOutgoing(proxy.target, connect, proxy, connect, options, wire, createConnection);
	}

	function createOutgoing(source, eventName, targetProxy, connect, options, wire, createConnection) {
		var promise, promises, resolveAndConnectOneOutgoing, name;

		function connectOneOutgoing(targetProxy, targetMethodSpec) {
			return when(functional.compose.parse(targetProxy, targetMethodSpec, wire),
				function(func) {
					return createConnection(source, eventName, proxyInvoker(targetProxy, func));
				});

		}

		if(typeof options == 'string') {
			// eventName: 'transform | componentName.methodName'
			promise = connectOneOutgoing(targetProxy, options);

		} else {
			// eventName: {
			//   componentName: 'methodName'
			//   componentName: 'transform | methodName'
			// }
			promises = [];

			resolveAndConnectOneOutgoing = function(targetRef, targetMethodSpec) {
				return when(wire.getProxy(targetRef), function(targetProxy) {
					return connectOneOutgoing(targetProxy, targetMethodSpec);
				});
			};

			for(name in options) {
				promises.push(resolveAndConnectOneOutgoing(name, options[name]));
			}

			promise = when.all(promises);
		}

		return promise;
	}

	function proxyInvoker(proxy, method) {
		return function() {
			return proxy.invoke(method, arguments);
		};
	}

});
})(typeof define == 'function'
	// AMD
	? define
	// CommonJS
	: function(factory) { module.exports = factory(require); }
);