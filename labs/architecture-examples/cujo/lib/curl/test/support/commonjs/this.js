define(function (require, exports, module) {
"use strict";
	var messages = require('./folder/non-cjs'),
		mod = require('./module');
	this.testMessage = messages.itWorks;
	this._module = module;
});
