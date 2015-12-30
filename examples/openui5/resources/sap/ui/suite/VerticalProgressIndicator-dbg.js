/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.suite.VerticalProgressIndicator.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', './library'],
	function(jQuery, Control, EnabledPropagator, library) {
	"use strict";


	
	/**
	 * Constructor for a new VerticalProgressIndicator.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control shows a vertical progress bar in dependency of the given percentage. Only values between 0 and 100 are valid.
	 * @extends sap.ui.core.Control
	 *
	 * @author Svetozar Buzdumovic
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.2. 
	 * The API may change. User with care.
	 * @alias sap.ui.suite.VerticalProgressIndicator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var VerticalProgressIndicator = Control.extend("sap.ui.suite.VerticalProgressIndicator", /** @lends sap.ui.suite.VerticalProgressIndicator.prototype */ { metadata : {
	
		library : "sap.ui.suite",
		properties : {
	
			/**
			 * The numerical value between 0 and 100 which determines the height of the vertical bar. Values higher than 100 will be displayed as 100%, values lower than zero will be displayed as 0%.
			 */
			percentage : {type : "int", group : "Misc", defaultValue : null}
		},
		associations : {
	
			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}, 
	
			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}
		},
		events : {
	
			/**
			 * Event is fired when the user clicks the control.
			 */
			press : {}
		}
	}});
	
	
	
	
	EnabledPropagator.call(VerticalProgressIndicator.prototype);
	
	/**
	 * Property setter for the Percentage, which determines the height of the vertical bar.
	 * Values higher than 100 will be displayed as 100%, values lower than zero will be displayed as 0%. 
	 * A new rendering is not necessary, only the bar will be moved
	 *
	 * @param {int} iPercentage
	 * @return {sap.ui.suite.VerticalProgressIndicator} <code>this</code> to allow method chaining
	 * @public
	 */
	VerticalProgressIndicator.prototype.setPercentage = function(iPercentage) {
	
	  // exit if nothing changed
	  var VerticalPercent = this.getPercentage();
	  if (VerticalPercent == iPercentage) {
			return this;
	  }
	
	  // get the ProgressBar
	  this.oBar  = jQuery.sap.domById(this.getId() + '-bar');
	
	  // get the new Value and calculate Pixels
	  VerticalPercent = iPercentage;
	  if (VerticalPercent < 0 || VerticalPercent == Number.NaN) {
			VerticalPercent = 0;
	  }
	  if (VerticalPercent > 100) {
			VerticalPercent = 100;
	  }
	  var PixelDown = Math.round(VerticalPercent * 58 / 100);
	  var PixelUp   = 58 - PixelDown;
	
	  //set the new values
	  this.setProperty('percentage', iPercentage, true); // No re-rendering!
	  jQuery(this.oBar).css("top",PixelUp);
	  jQuery(this.oBar).css("height",PixelDown);
	
	  //set the ARIA property
	  if (!this.oThis) {
		this.oThis = jQuery.sap.byId(this.getId());
		}
	  this.oThis.attr('aria-valuenow', iPercentage + '%');
	  return this;
	
	};
	
	
	/**
	 * Function is called when control is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	VerticalProgressIndicator.prototype.onclick = function(oEvent) {
		this.firePress({/* no parameters */});
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};
	
	
	// Implementation of API method focus(). Documentation available in generated code.

	/**
	 * Puts the focus to the control.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	VerticalProgressIndicator.prototype.focus = function() {
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.focus();
		}
	};

	return VerticalProgressIndicator;

}, /* bExport= */ true);
