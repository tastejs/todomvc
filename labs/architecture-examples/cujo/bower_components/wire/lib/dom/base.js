/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dom/base
 * provides basic dom creation capabilities for plugins.
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (define) {
define(function (require) {

	var WireProxy, priority, classRx, trimLeadingRx, splitClassNamesRx, nodeProxyInvoke;

	WireProxy = require('../WireProxy');
	priority = require('../plugin/priority');

	classRx = '(\\s+|^)(classNames)(\\b(?![\\-_])|$)';
	trimLeadingRx = /^\s+/;
	splitClassNamesRx = /(\b\s+\b)|(\s+)/g;

	/**
	 * Adds one or more css classes to a dom element.
	 * @param el {HTMLElement}
	 * @param className {String} a single css class or several, space-delimited
	 *   css classes.
	 */
	function addClass (el, className) {
		var newClass;

		newClass = _stripClass(el.className, className);

		el.className = newClass + (newClass && className ? ' ' : '') + className;
	}

	/**
	 * Removes one or more css classes from a dom element.
	 * @param el {HTMLElement}
	 * @param className {String} a single css class or several, space-delimited
	 *   css classes.
	 */
	function removeClass (el, className) {
		el.className = _stripClass(el.className, className);
	}

	/**
	 * Adds or removes one or more css classes from a dom element.
	 * @param el {HTMLElement}
	 * @param className {String} a single css class or several, space-delimited
	 *   css classes.
	 */
	function toggleClass (el, className) {
		var unalteredClass;

		// save copy of what _stripClass would return if className
		// was not found
		unalteredClass = el.className.replace(trimLeadingRx, '');

		// remove className
		el.className = _stripClass(el.className, className);

		// add className if it wasn't removed
		if (unalteredClass == el.className) {
			el.className = unalteredClass + (unalteredClass && className ? ' ' : '') + className;
		}
	}

	/**
	 * Super fast, one-pass, non-looping routine to remove one or more
	 * space-delimited tokens from another space-delimited set of tokens.
	 * @private
	 * @param tokens
	 * @param removes
	 */
	function _stripClass (tokens, removes) {
		var rx;

		if (!removes) {
			return tokens;
		}

		// convert space-delimited tokens with bar-delimited (regexp `or`)
		removes = removes.replace(splitClassNamesRx, function (m, inner, edge) {
			// only replace inner spaces with |
			return edge ? '' : '|';
		});

		// create one-pass regexp
		rx = new RegExp(classRx.replace('classNames', removes), 'g');

		// remove all tokens in one pass (wish we could trim leading
		// spaces in the same pass! at least the trim is not a full
		// scan of the string)
		return tokens.replace(rx, '').replace(trimLeadingRx, '');
	}

	if (document && document.appendChild.apply) {
		// normal browsers
		nodeProxyInvoke = function jsInvoke (node, method, args) {
			if(typeof method == 'string') {
				method = node[method];
			}
			return method.apply(node, args);
		};
	}
	else {
		// IE 6-8 ("native" methods don't have .apply()) so we have
		// to use eval())
		nodeProxyInvoke = function evalInvoke (node, method, args) {
			var argsList;

			if(typeof method == 'function') {
				return method.apply(node, args);
			}

			// iirc, no node methods have more than 4 parameters
			// (addEventListener), so 5 should be safe. Note: IE needs
			// the exact number of arguments or it will throw!
			argsList = ['a', 'b', 'c', 'd', 'e'].slice(0, args.length).join(',');

			// function to execute eval (no need for global eval here
			// since the code snippet doesn't reference out-of-scope vars).
			function invoke (a, b, c, d, e) {
				/*jshint evil:true*/
				return eval('node.' + method + '(' + argsList + ');');
			}

			// execute and return result
			return invoke.apply(this, args);
		};
	}

	function byId(id) {
		return document.getElementById(id);
	}

	function queryAll(selector, root) {
		return (root||document).querySelectorAll(selector);
	}

	function query(selector, root) {
		return (root||document).querySelector(selector);
	}

	/**
	 * Places a node into the DOM at the location specified around
	 * a reference node.
	 * Note: replace is problematic if the dev expects to use the node
	 * as a wire component.  The component reference will still point
	 * at the node that was replaced.
	 * @param node {HTMLElement}
	 * @param refNode {HTMLElement}
	 * @param location {String} or {Number} "before", "after", "first", "last",
	 *   or the position within the children of refNode
	 */
	function placeAt(node, refNode, location) {
		var parent, i;

		if ('length' in refNode) {
			for (i = 0; i < refNode.length; i++) {
				placeAt(i === 0 ? node : node.cloneNode(true), refNode[i], location);
			}
			return node;
		}

		parent = refNode.parentNode;

		// `if else` is more compressible than switch
		if (!isNaN(location)) {
			if (location < 0) {
				location = 0;
			}
			_insertBefore(refNode, node, refNode.childNodes[location]);
		}
		else if(location == 'at') {
			refNode.innerHTML = '';
			_appendChild(refNode, node);
		}
		else if(location == 'last') {
			_appendChild(refNode, node);
		}
		else if(location == 'first') {
			_insertBefore(refNode, node, refNode.firstChild);
		}
		else if(location == 'before') {
			// TODO: throw if parent missing?
			_insertBefore(parent, node, refNode);
		}
		else if(location == 'after') {
			// TODO: throw if parent missing?
			if (refNode == parent.lastChild) {
				_appendChild(parent, node);
			}
			else {
				_insertBefore(parent, node, refNode.nextSibling);
			}
		}
		else {
			throw new Error('Unknown dom insertion command: ' + location);
		}

		return node;
	}

	// these are for better compressibility since compressors won't
	// compress native DOM methods.
	function _insertBefore(parent, node, refNode) {
		parent.insertBefore(node, refNode);
	}

	function _appendChild(parent, node) {
		parent.appendChild(node);
	}

	function isNode(it) {
		return typeof Node === "object"
			? it instanceof Node
			: it && typeof it === "object" && typeof it.nodeType === "number" && typeof it.nodeName==="string";
	}

	function NodeProxy() {}

	NodeProxy.prototype = {
		get: function (name) {
			var node = this.target;

			if (name in node) {
				return node[name];
			}
			else {
				return node.getAttribute(name);
			}
		},

		set: function (name, value) {
			var node = this.target;

			if (name in node) {
				return node[name] = value;
			}
			else {
				return node.setAttribute(name, value);
			}
		},

		invoke: function (method, args) {
			return nodeProxyInvoke(this.target, method, args);
		},

		destroy: function () {
			var node = this.target;

			// if we added a destroy method on the node, call it.
			// TODO: find a better way to release events instead of using this mechanism
			if (node.destroy) {
				node.destroy();
			}
			// removal from document will destroy node as soon as all
			// references to it go out of scope.
			var parent = node.parentNode;
			if (parent) {
				parent.removeChild(node);
			}
		},

		clone: function (options) {
			if (!options) {
				options = {};
			}
			// default is to clone deep (when would anybody not want deep?)
			return this.target.cloneNode(!('deep' in options) || options.deep);
		}
	};

	proxyNode.priority = priority.basePriority;
	function proxyNode (proxy) {

		if (!isNode(proxy.target)) {
			return proxy;
		}

		return WireProxy.extend(proxy, NodeProxy.prototype);
	}

	return {

		byId: byId,
		querySelector: query,
		querySelectorAll: queryAll,
		placeAt: placeAt,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		proxyNode: proxyNode

	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
