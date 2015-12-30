/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ToggleButton.
sap.ui.define(['jquery.sap.global', './Button', './library', 'sap/ui/core/EnabledPropagator'],
	function(jQuery, Button, library, EnabledPropagator) {
	"use strict";


	
	/**
	 * Constructor for a new ToggleButton.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The ToggleButton Control is a Button that can be toggled between pressed and normal state
	 * @extends sap.m.Button
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.ToggleButton
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ToggleButton = Button.extend("sap.m.ToggleButton", /** @lends sap.m.ToggleButton.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * The property is “true” when the control is toggled. The default state of this property is "false".
			 */
			pressed : {type : "boolean", group : "Data", defaultValue : false}
		}
	}});
	
	EnabledPropagator.call(ToggleButton.prototype);
	
	/**
	 * Function is called when ToggleButton is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ToggleButton.prototype.ontap = function(oEvent) {
	// mark the event for components that needs to know if the event was handled by the ToggleButton
		oEvent.setMarked();
		if (this.getEnabled()) {
			this.setPressed(!this.getPressed());
			this.firePress({ pressed: this.getPressed() });
		}
	};
	
	ToggleButton.prototype.setPressed = function(bPressed) {
		if (bPressed != this.getPressed()) {
			this.setProperty("pressed", bPressed, true);
			this.$().attr("aria-pressed", bPressed);
			this.$("inner").toggleClass("sapMToggleBtnPressed",bPressed && !this._isUnstyled());
		}
		return this;
	};
	
	/**
	 * Handle the key down event for SPACE and ENTER.
	 * @param {jQuery.Event} oEvent - the keyboard event.
	 * @private
	 */
	ToggleButton.prototype.onkeydown = function(oEvent) {
	
		if (oEvent.which === jQuery.sap.KeyCodes.SPACE || oEvent.which === jQuery.sap.KeyCodes.ENTER) {
			this.ontap(oEvent);
		}
	};
	

	return ToggleButton;

}, /* bExport= */ true);
