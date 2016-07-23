define([
	'dojo/_base/declare',
	'dojo/router/RouterBase'
], function (declare, RouterBase) {
	// To use Dojo's super call method, inherited()
	/*jshint strict:false*/

	return new (declare(RouterBase, {
		_handlePathChange: function () {
			this.inherited(arguments);
			return false; // Prevent actual hash change
		}
	}))({});
});
