(function (define) {
define(function (require, exports) {

	// TODO: use has() to select code to use node.classList / DOMSettableTokenList

	var splitClassNameRx = /\s+/;

	var classRx = '(\\s+|^)(classNames)(\\b(?![\\-_])|$)';
	var trimLeadingRx = /^\s+/;
	var splitClassNamesRx = /(\b\s+\b)|(\s+)/g;

	/**
	 * Returns the list of class names on a node as an array.
	 * @param node {HTMLElement}
	 * @returns {Array}
	 */
	function getClassList (node) {
		return node.className.split(splitClassNameRx);
	}

	/**
	 * Adds a list of class names on a node and optionally removes some.
	 * @param node {HTMLElement}
	 * @param list {Array|Object} a list of class names to add.
	 * @param [list.add] {Array} a list of class names to add.
	 * @param [list.remove] {Array} a list of class names to remove.
	 * @returns {Array} the resulting class names on the node
	 *
	 * @description The list param may be supplied with any of the following:
	 *   simple array:
	 *     setClassList(node, ['foo-box', 'bar-box']) (all added)
	 *   simple array w/ remove property:
	 *     list = ['foo-box', 'bar-box'];
	 *     list.remove = ['baz-box'];
	 *     setClassList(node, list);
	 *   object with add and remove array properties:
	 *     list = {
	 *       add: ['foo-box', 'bar-box'],
	 *       remove: ['baz-box']
	 *     };
	 *     setClassList(node, list);
	 */
	function setClassList (node, list) {
		var adds, removes;
		if (list) {
			// figure out what to add and remove
			adds = list.add || list || [];
			removes = list.remove || [];
			node.className = spliceClassNames(node.className, removes, adds);
		}
		return getClassList(node);
	}

	function getClassSet (node) {
		var set, classNames, className;
		set = {};
		classNames = node.className.split(splitClassNameRx);
		while ((className = classNames.pop())) set[className] = true;
		return set;
	}

	/**
	 *
	 * @param node
	 * @param classSet {Object}
	 * @description
	 * Example bindings:
	 * 	stepsCompleted: {
	 *  	node: 'viewNode',
	 *  	prop: 'classList',
	 *  	enumSet: ['one', 'two', 'three']
	 * 	},
	 *  permissions: {
	 * 		node: 'myview',
	 * 		prop: 'classList',
	 * 		enumSet: {
	 * 			modify: 'can-edit-data',
	 * 			create: 'can-add-data',
	 * 			remove: 'can-delete-data'
	 * 		}
	 *  }
	 */
	function setClassSet (node, classSet) {
		var removes, adds, p, newList;

		removes = [];
		adds = [];

		for (p in classSet) {
			if (p) {
				if (classSet[p]) {
					adds.push(p);
				}
				else {
					removes.push(p);
				}
			}
		}

		return node.className = spliceClassNames(node.className, removes, adds);
	}

	// class parsing

	var openRx, closeRx, innerRx, innerSpacesRx, outerSpacesRx;

	openRx = '(?:\\b\\s+|^\\s*)(';
	closeRx = ')(?:\\b(?!-))|(?:\\s*)$';
	innerRx = '|';
	innerSpacesRx = /\b\s+\b/;
	outerSpacesRx = /^\s+|\s+$/;

	/**
	 * Adds and removes class names to a string.
	 * @private
	 * @param className {String} current className
	 * @param removes {Array} class names to remove
	 * @param adds {Array} class names to add
	 * @returns {String} modified className
	 */
	function spliceClassNames (className, removes, adds) {
		var rx, leftovers;
		// create regex to find all removes *and adds* since we're going to
		// remove them all to prevent duplicates.
		removes = trim(removes.concat(adds).join(' '));
		adds = trim(adds.join(' '));
		rx = new RegExp(openRx
			+ removes.replace(innerSpacesRx, innerRx)
			+ closeRx, 'g');
		// remove and add
		return trim(className.replace(rx, function (m) {
			// if nothing matched, we're at the end
			return !m && adds ? ' '  + adds : '';
		}));
	}

	function trim (str) {
		// don't worry about high-unicode spaces. they should never be here.
		return str.replace(outerSpacesRx, '');
	}


	function addClass (className, str) {
		var newClass = removeClass(className, str);
		if(newClass && className) {
			newClass += ' ';
		}

		return newClass + className;
	}

	function removeClass (removes, tokens) {
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

	return {
		addClass: addClass,
		removeClass: removeClass,
		getClassList: getClassList,
		setClassList: setClassList,
		getClassSet: getClassSet,
		setClassSet: setClassSet
	};

});
}(
	typeof define == 'function'
		? define
		: function (factory) { module.exports = factory(require); }
));
