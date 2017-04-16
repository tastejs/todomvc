/*global Lava, Firestorm */
(function (Lava, Firestorm) {
'use strict';

Lava.define(
'Lava.widget.input.AutofocusText',
/**
 * Helper widget, that focuses input element when it's in DOM.
 */
{
	Extends: 'Lava.widget.input.Text',

	broadcastInDOM: function() {

		this.Text$broadcastInDOM();

		var element = this._input_container.getDOMElement();
		element.focus();
		// move cursor to the end of text
		Firestorm.Element.setProperty(element, 'value', this._properties.value);

	}
});

})(Lava, Firestorm);