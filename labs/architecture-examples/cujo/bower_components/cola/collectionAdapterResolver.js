/**
 * collectionAdapterResolver
 * @author: brian
 */
(function(define) {
define(function(require) {

	var adapterResolver = require('./adapterResolver');

	return Object.create(adapterResolver, {
		adapters: { value: [
			require('./adapter/Array'),
			require('./dom/adapter/NodeList'),
			require('./adapter/Query')
		]}
	});

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
