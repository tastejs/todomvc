/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(define){ 'use strict';
	define(function(require) {

		var object, undef;

		object = require('./object');

		function WireContext() {}

		WireContext.inherit = function(parent, api) {
			var contextApi, context;

			contextApi = object.inherit(parent);
			object.mixin(contextApi, api);

			WireContext.prototype = contextApi;

			context = new WireContext();
			WireContext.prototype = undef;

			return context;
		};

		return WireContext;

	});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));
