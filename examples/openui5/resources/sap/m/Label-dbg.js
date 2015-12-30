/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Label
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/LabelEnablement'],
	function(jQuery, library, Control, LabelEnablement) {
	"use strict";

	/**
	 * Constructor for a new Label.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The Label control is used in a UI5 mobile application to provide label text for other controls. Design such as bold, and text alignment can be specified.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.Label,sap.ui.core.IShrinkable
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.Label
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Label = Control.extend("sap.m.Label", /** @lends sap.m.Label.prototype */ { metadata : {

		interfaces : [
			"sap.ui.core.Label",
			"sap.ui.core.IShrinkable"
		],
		library : "sap.m",
		properties : {

			/**
			 * Sets the design of a Label to either Standard or Bold.
			 */
			design : {type : "sap.m.LabelDesign", group : "Appearance", defaultValue : sap.m.LabelDesign.Standard},

			/**
			 * Determines the Label text to be displayed.
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Available alignment settings are "Begin", "Center", "End", "Left", and "Right".
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},

			/**
			 * Options for the text direction are RTL and LTR. Alternatively, the control can inherit the text direction from its parent container.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Determines the width of the label.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},

			/**
			 * Indicates that user input is required in the input this label labels.
			 */
			required : {type : "boolean", group : "Misc", defaultValue : false}
		},
		associations : {

			/**
			 * Association to the labeled control.
			 * By default the label set the for attribute to the ID of the labeled control. This can be changed by implementing the function getIdForLabel on the labelled control.
			 */
			labelFor : {type : "sap.ui.core.Control", multiple : false}
		}
	}});

	Label.prototype.setText = function(sText) {
		var sValue = this.getText();
		if (sValue !== sText) {
			this.setProperty("text", sText, true);
			this.$().html(jQuery.sap.encodeHTML(this.getProperty("text")));
			if (sText) {
				this.$().removeClass("sapMLabelNoText");
			}else {
				this.$().addClass("sapMLabelNoText");
			}
		}
		return this;
	};

	Label.prototype.setTooltip = function(oTooltip) {
		var oValue = this.getTooltip();
		if (oValue !== oTooltip) {
			this.setAggregation("tooltip", oTooltip, true);
			this.$().attr("title", this.getTooltip());
		}
		return this;
	};
	
	// enrich Label functionality
	LabelEnablement.enrich(Label.prototype);

	return Label;

}, /* bExport= */ true);
