/**
 * Model
 * @author: brian
 */
(function(define) {
define(function(require) {

	var Base, resolver, defaultModelStrategy;

	Base = require('./hub/Base');
	resolver = require('./objectAdapterResolver');
	defaultModelStrategy = require('./network/strategy/defaultModel');

	function Model(options) {
		Base.call(this, options);

		if(!options) {
			options = {};
		}

		this.strategy = options.strategy;
		if (!this.strategy) this.strategy = defaultModelStrategy(options.strategyOptions);
	}

	Model.prototype = Object.create(Base.prototype, {

		resolver: { value: resolver }

	});

	return Model;

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
