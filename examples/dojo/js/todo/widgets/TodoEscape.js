define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dijit/_WidgetBase'
], function (declare, lang, _WidgetBase) {
	// To use Dojo's super call method, inherited()
	/*jshint strict:false*/

	var ESCAPE_KEY = 27;

	/**
	 * Widget that emits `escape` custom event when the element it is applied to gets an keydown event of escape key.
	 * @class TodoEscape
	 */
	return declare(_WidgetBase, {
		postCreate: function () {
			this.inherited(arguments);
			this.on('keydown', lang.hitch(this, function (event) {
				if (event.keyCode === ESCAPE_KEY) {
					this.emit('escape');
				}
			}));
		}
	});
});
