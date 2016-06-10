/** @license MIT License (c) copyright 2010-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Brian Cavalier
 * @author: John Hann
 */

(function(define) { 'use strict';
define(function() {

	var basePriority, defaultPriority;

	basePriority = -99;
	defaultPriority = 0;

	return {
		basePriority: basePriority,
		sortReverse: prioritizeReverse
	};

	function prioritizeReverse(list) {
		return list.sort(byReversePriority);
	}

	function byReversePriority(a, b) {
		var aPriority, bPriority;

		aPriority = a.priority || defaultPriority;
		bPriority = b.priority || defaultPriority;

		return aPriority < bPriority ? -1
			: aPriority > bPriority ? 1 : 0;
	}


});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
