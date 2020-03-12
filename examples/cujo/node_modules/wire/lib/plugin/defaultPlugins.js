/**
 * defaultPlugins
 * @author: brian
 */
(function(define) {
define(function(require) {

	return [
		require('./wirePlugin'),
		require('./basePlugin')
	];

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
