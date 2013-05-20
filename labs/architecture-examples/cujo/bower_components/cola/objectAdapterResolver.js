/**
 * objectAdapterResolver
 * @author: brian
 */
(function(define) {
define(function(require) {

	var adapterResolver = require('./adapterResolver');

	return Object.create(adapterResolver, {
		adapters: { value: [
			require('./dom/adapter/Node'),
			require('./adapter/Object')
		]}
	});

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
