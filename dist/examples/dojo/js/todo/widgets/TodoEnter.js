define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dijit/_WidgetBase'
], function (declare, lang, _WidgetBase) {
	// To use Dojo's super call method, inherited()
	/*jshint strict:false*/

	var ENTER_KEY = 13;

	/**
	 * Widget that emits `change` event when the element it is applied to gets an keydown event of enter key.
	 * Primary for IE which does not fire `change` event on `<input>` upon parent form's submission.
	 * @class TodoEnter
	 */
	return declare(_WidgetBase, {
		postCreate: function () {
			this.inherited(arguments);
			this.on('keydown', lang.hitch(this, function (event) {
				if (event.keyCode === ENTER_KEY) {
					this.emit('change');
				}
			}));
		}
	});
});
