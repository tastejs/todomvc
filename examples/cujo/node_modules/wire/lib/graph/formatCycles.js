/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * formatCycles
 * @author: brian@hovercraftstudios.com
 */
(function(define) {
define(function() {
	/**
	 * If there are cycles, format them for output
	 * @param {Array} cycles array of reference resolution cycles
	 * @return {String} formatted string
	 */
	return function formatCycles(cycles) {
		return cycles.map(function (sc) {
			return '[' + sc.map(function (v) {
					return v.name;
				}
			).join(', ') + ']';
		}).join(', ');
	}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));
