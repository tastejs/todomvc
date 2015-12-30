/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.InvisibleText.
sap.ui.define(['jquery.sap.global', './Control', './library', 'jquery.sap.encoder'],
	function(jQuery, Control, library/*, jQuerySap1 */) {
	"use strict";


	/**
	 * Constructor for a new InvisibleText.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * An InvisibleText is used to bring hidden texts to the UI for screen reader support. The hidden text can e.g. be referenced
	 * in the ariaLabelledBy or ariaDescribedBy associations of other controls.
	 * 
	 * The inherited properties busy, busyIndicatorDelay and visible and the aggregation tooltip is not supported by this control.
	 * 
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.27.0
	 * @alias sap.ui.core.InvisibleText
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var InvisibleText = Control.extend("sap.ui.core.InvisibleText", /** @lends sap.ui.core.InvisibleText.prototype */ {
		metadata : {
			library : "sap.ui.core",
			publicMethods: ["toStatic"],
			properties : {
				
				/**
				 * The text of the InvisibleText.
				 */
				text : {type : "string", defaultValue : ""}
			}
		},
	
		renderer : function(oRm, oControl) {
			// The text is hidden through "display: none" in the shared CSS class 
			// "sapUiInvisibleText", as an alternative in case screen readers have trouble with
			// "display: none", the following class definition could be used:
			//	.sapUiInvisibleText {
			//		display: inline-block !important;
			//		visibility: hidden !important;
			//		width: 0 !important;
			//		height: 0 !important;
			//		overflow: hidden !important;
			//		position: absolute !important;
			//	}

			oRm.write("<span");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiInvisibleText");
			oRm.writeClasses();
			oRm.writeAttribute("aria-hidden", "true");
			oRm.write(">");
			oRm.writeEscaped(oControl.getText() || "");
			oRm.write("</span>");
		}
	});
	
	/**
	 * @return {sap.ui.core.InvisibleControl} Returns <code>this</code> to allow method chaining
	 * @public
	 * @deprecated Local BusyIndicator is not supported by control.
	 */
	InvisibleText.prototype.setBusy = function() {
		jQuery.sap.log.warning("Property busy is not supported by control sap.ui.core.InvisibleText.");
		return this;
	};
	
	/**
	 * @return {sap.ui.core.InvisibleControl} Returns <code>this</code> to allow method chaining
	 * @public
	 * @deprecated Local BusyIndicator is not supported by control.
	 */
	InvisibleText.prototype.setBusyIndicatorDelay = function() {
		jQuery.sap.log.warning("Property busyIndicatorDelay is not supported by control sap.ui.core.InvisibleText.");
		return this;
	};
	
	/**
	 * @return {sap.ui.core.InvisibleControl} Returns <code>this</code> to allow method chaining
	 * @public
	 * @deprecated Property visible is not supported by control.
	 */
	InvisibleText.prototype.setVisible = function() {
		jQuery.sap.log.warning("Property visible is not supported by control sap.ui.core.InvisibleText.");
		return this;
	};
	
	/**
	 * @return {sap.ui.core.InvisibleControl} Returns <code>this</code> to allow method chaining
	 * @public
	 * @deprecated Tooltip is not supported by control.
	 */
	InvisibleText.prototype.setTooltip = function() {
		jQuery.sap.log.warning("Aggregation tooltip is not supported by control sap.ui.core.InvisibleText.");
		return this;
	};

	InvisibleText.prototype.setText = function(sText) {
		this.setProperty("text", sText, true);
		this.$().html(jQuery.sap.encodeHTML(this.getText() || ""));
		return this;
	};

	/**
	 * Adds <code>this</code> control into the static, hidden area UI area container.
	 * 
	 * @return {sap.ui.core.InvisibleControl} Returns <code>this</code> to allow method chaining
	 * @public
	 * @see sap.ui.core.Control#placeAt
	 */
	InvisibleText.prototype.toStatic = function() {
		var oCore = sap.ui.getCore();
		
		try {
			var oStatic = oCore.getStaticAreaRef();
			var oRM = oCore.createRenderManager();
			oRM.render(this, oStatic);
			oRM.destroy();
		} catch (e) {
			this.placeAt("sap-ui-static");
		}
		
		return this;
	};

	return InvisibleText;

});
