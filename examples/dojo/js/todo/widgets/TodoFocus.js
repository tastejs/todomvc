define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_FocusMixin' // For blur event support in data-dojo-attach-event
], function (declare, _WidgetBase, _FocusMixin) {
	'use strict';

	/**
	 * Widget that places focus on the element it is applied to when `shouldGetFocus` property becomes `true`.
	 * @class TodoFocus
	 */
	return declare([_WidgetBase, _FocusMixin], {
		_setShouldGetFocusAttr: function (value) {
			if (value) {
				(this.focusNode && this.focusNode.nodeType === Node.ELEMENT_NODE ? this.focusNode : this.domNode).focus();
			}
		}
	});
});
