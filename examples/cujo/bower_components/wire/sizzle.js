/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/sizzle plugin
 * Adds querySelectorAll functionality to wire using John Resig's Sizzle library.
 * Sizzle must be wrapped in an AMD define().  Kris Zyp has a version of this at
 * http://github.com/kriszyp/sizzle
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author John Hann (@unscriptable)
 */

define(['./lib/plugin-base/dom', 'sizzle'], function(createDomPlugin, sizzle) {

	/**
	 * The usual addClass function
	 *
	 * @param node
	 * @param cls {String} space separated list of classes
	 */
	function addClass(node, cls) {
		var className = node.className ? ' ' + node.className + ' ' : '';

		cls = cls.split(/\s+/);

		for (var i = 0, len = cls.length; i < len; i++) {
			var c = ' ' + cls[i];
			if(className.indexOf(c + ' ') < 0) {
				className += c;
			}
		}

		node.className = className.slice(1, className.length);
	}

	/**
	 * The usual removeClass function
	 *
	 * @param node
	 * @param cls {String} space separated list of classes
	 */
	function removeClass(node, cls) {
		var className = ' ' + node.className + ' ';

		cls = cls.split(/\s+/);

		for (var i = 0, len = cls.length; i < len; i++) {
			var c = ' ' + cls[i] + ' ';
			className = className.replace(c, ' ');
		}

		node.className = className.replace(/(^\s+|\s+$)/g, '');
	}

	return createDomPlugin({
		query: sizzle,
		first: function (selector, root) {
			return sizzle(selector, root)[0];
		},
		addClass: addClass,
		removeClass: removeClass
	});

});
