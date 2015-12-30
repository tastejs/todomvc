/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Label.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/Popup', 'sap/ui/core/LabelEnablement'],
	function(jQuery, library, Control, Popup, LabelEnablement) {
	"use strict";


	
	/**
	 * Constructor for a new Label.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * 
	 * Is used for labeling other controls. The API provides formatting options, for example for bold display or alignment. A label can have an icon.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.commons.ToolbarItem,sap.ui.core.Label
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Label
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Label = Control.extend("sap.ui.commons.Label", /** @lends sap.ui.commons.Label.prototype */ { metadata : {
	
		interfaces : [
			"sap.ui.commons.ToolbarItem",
			"sap.ui.core.Label"
		],
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * 
			 * Labels can have bold format.
			 */
			design : {type : "sap.ui.commons.LabelDesign", group : "Appearance", defaultValue : sap.ui.commons.LabelDesign.Standard},
	
			/**
			 * 
			 * Options for the text direction are RTL and LTR. Alternatively, the control can inherit the text direction from its parent container.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},
	
			/**
			 * Specifies whether a line wrapping shall be displayed when the text value is longer than the width
			 */
			wrapping : {type : "boolean", group : "Appearance", defaultValue : false},
	
			/**
			 * 
			 * Control width as common CSS-size (px or % as unit, for example).
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},
	
			/**
			 * 
			 * Text to be displayed.
			 */
			text : {type : "string", group : "Misc", defaultValue : ''},
	
			/**
			 * Icon to be displayed in the control.
			 * This can be an URI to an image or an icon font URI.
			 */
			icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},
	
			/**
			 * 
			 * Available alignment settings are "Begin", "Center", "End", "Left", and "Right".
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},
	
			/**
			 * Allows to enforce the required indicator even when the associated control doesn't have a getRequired method (a required property) or when the flag is not set.
			 * If the associated control has a required property, the values of both required flags are combined with the OR operator, so a Label can't override a required=true value.
			 * @since 1.11.0
			 */
			required : {type : "boolean", group : "Appearance", defaultValue : false},
	
			/**
			 * If set the required indicator is at the begin of the label, if not set at the end.
			 * @since 1.14.0
			 */
			requiredAtBegin : {type : "boolean", group : "Misc", defaultValue : null}
		},
		associations : {
	
			/**
			 * Association to the labeled control.
			 * By default the label set the for attribute to the ID of the labeled control. This can be changed implementing function getIdForLabel on the labelled control.
			 */
			labelFor : {type : "sap.ui.core.Control", multiple : false}
		}
	}});
	
	Label.prototype.onAfterRendering = function () {
	
		var oFor = this._getLabeledControl();
		
		if (oFor) {
			if (this.getTooltip_AsString() == "" || !(this.getTooltip() instanceof sap.ui.core.TooltipBase)) {
				// no own tooltip use RichTooltip of labeled control if available
				if (oFor.getTooltip() instanceof sap.ui.core.TooltipBase) {
					this.oForTooltip = oFor.getTooltip();
					this.addDelegate(this.oForTooltip);
				}
			}

			// attach to change of required flag of labeled control
			oFor.attachEvent("requiredChanged",this._handleRequiredChanged, this);
			this._oFor = oFor;
		}
	
	};
	
	Label.prototype.onBeforeRendering = function () {
	
		if (this.oForTooltip) {
			this.removeDelegate(this.oForTooltip);
			this.oForTooltip = null;
		}
	
		if (this._oPopup) {
			this._oPopup.destroy();
			delete this._oPopup;
		}
	
		if (this._oFor) {
			this._oFor.detachEvent("requiredChanged",this._handleRequiredChanged, this);
			this._oFor = undefined;
		}
	
	};
	
	Label.prototype.exit = function(){
	
		if (this.oForTooltip) {
			this.removeDelegate(this.oForTooltip);
			this.oForTooltip = null;
		}
	
		if (this._oPopup) {
			this._oPopup.destroy();
			delete this._oPopup;
		}
	
		if (this._oFor) {
			this._oFor.detachEvent("requiredChanged",this._handleRequiredChanged, this);
			this._oFor = undefined;
		}
	
	};
	
	/**
	 * Checks whether either the label itself or the associated control is marked as required.
	 */
	Label.prototype.isRequired = function(){
	
		// the value of the local required flag is ORed with the result of a "getRequired" 
		// method of the associated "labelFor" control. If the associated control doesn't 
		// have a getRequired method, this is treated like a return value of "false".
		var oFor = this._getLabeledControl();
		return this.getRequired() || (oFor && oFor.getRequired && oFor.getRequired() === true);
	
	};
	
	/*
	 * if required flag of labeled control changes after Label is rendered,
	 * Label must be rendered again
	 */
	Label.prototype._handleRequiredChanged = function(){
	
		this.invalidate();
	
	};
	
	/**
	 * @deprecated
	 */
	Label.prototype.setReqiuredAtBegin = function(bReqiuredAtBegin){
		return this.setRequiredAtBegin(bReqiuredAtBegin);
	};
	
	/**
	 * @deprecated
	 */
	Label.prototype.getReqiuredAtBegin = function(){
		return this.getRequiredAtBegin();
	};
	
	/**
	 * Returns the labeled control instance, if exists.
	 * @return {sap.ui.core.Control} the labeled control instance, if exists
	 * @private
	 */
	Label.prototype._getLabeledControl = function() {
		var sId = this.getLabelForRendering();
		if (!sId) {
			return null;
		}
		return sap.ui.getCore().byId(sId);
	};
	
	
	/*
	sap.ui.commons.Label.prototype.onmouseover = function(oEvent) {
		var oRef = this.getDomRef();
		if (Math.abs(oRef.clientWidth - oRef.scrollWidth) < 2){
			return;
		}
	
		if (!this._oPopup) {
			 this._oPopup = new sap.ui.core.Popup();
			 this._oPopup.setDurations(0, 0); // no animations
			 this._oPopup.setContent(this._createInfo());
			 this._oPopup.attachOpened(this._handleOpened, this);
		}
	
		var eDock = sap.ui.core.Popup.Dock;
		this._oPopup.open(0, eDock.BeginTop, eDock.BeginTop, this, "0 1", "fit", true);
	};
	
	sap.ui.commons.Label.prototype._createInfo = function(){
		var $Me   = jQuery(this.getDomRef());
		var sText = $Me.html();
		var sHtml = "<span id='" + this.getId()+'-info' + "' class='sapUiLblInfo " + $Me.attr("class") + "'>" + sText + "</span>";
	
		var oDomRef = jQuery(sHtml).appendTo(sap.ui.getCore().getStaticAreaRef());
		var that = this;
		jQuery(oDomRef).mouseout([this.getId()], function(oEvent){
			that._oPopup.close();
		});
		return oDomRef;
	};
	
	sap.ui.commons.Label.prototype._handleOpened = function(){
		var that = this;
		jQuery.sap.byId(this.getId()+'-info').mouseout([this.getId()], function(oEvent){
			that._oPopup.close();
		});
	};*/
	
	//Enrich Label functionality
	LabelEnablement.enrich(Label.prototype);

	return Label;

}, /* bExport= */ true);
