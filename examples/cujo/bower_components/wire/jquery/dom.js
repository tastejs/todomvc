/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/jquery/dom plugin
 * jQuery-based dom! resolver
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

define(['../lib/plugin-base/dom', 'jquery'], function(createDomPlugin, jquery) {

	return createDomPlugin({
		query: function (selector, root) {
			return jquery(selector, root).toArray();
		},
		first: function (selector, root) {
			return jquery(selector, root)[0];
		},
		addClass: function(node, cls) {
			jquery(node).addClass(cls);
		},
		removeClass: function(node, cls) {
			jquery(node).removeClass(cls);
		},
		placeAt: function (node, refNode, location) {
			var $refNode, $children;
			$refNode = jquery(refNode);
			// `if else` is more compressible than switch
			if (!isNaN(location)) {
				$children = $(refNode).children();
				if (location <= 0) {
					$refNode.prepend(node);
				}
				else if (location >= $children.length) {
					$refNode.append(node);
				}
				else {
					$children.eq(location).before(node);
				}
			}
			else if (location == 'at') {
				$refNode.empty().append(node);
			}
			else if (location == 'last') {
				$refNode.append(node);
			}
			else if (location == 'first') {
				$refNode.prepend(node);
			}
			else if (location == 'before') {
				$refNode.before(node);
			}
			else if (location == 'after') {
				$refNode.after(node);
			}
			else {
				throw new Error('Unknown dom insertion command: ' + location);
			}
			return node;
		}
	});

});
