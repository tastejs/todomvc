/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.FlexItemData.
sap.ui.define(['jquery.sap.global', './FlexBoxStylingHelper', './library', 'sap/ui/core/LayoutData'],
	function(jQuery, FlexBoxStylingHelper, library, LayoutData) {
	"use strict";


	
	/**
	 * Constructor for a new FlexItemData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Holds layout data for a FlexBox
	 * @extends sap.ui.core.LayoutData
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.FlexItemData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FlexItemData = LayoutData.extend("sap.m.FlexItemData", /** @lends sap.m.FlexItemData.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Determines cross-axis alignment of individual element (not currently supported in Internet Explorer)
			 */
			alignSelf : {type : "sap.m.FlexAlignSelf", group : "Misc", defaultValue : sap.m.FlexAlignSelf.Auto},
	
			/**
			 * Determines the display order of flex items independent of their source code order.
			 */
			order : {type : "int", group : "Misc", defaultValue : 0},
	
			/**
			 * Determines the flexibility of the flex item when allocatable space is remaining.
			 */
			growFactor : {type : "float", group : "Misc", defaultValue : 0},
	
			/**
			 * The shrink factor determines how much the flex item will shrink relative to the rest of the flex items in the flex container when negative free space is distributed.
			 * 
			 * @see http://www.w3.org/TR/css3-flexbox/#flex-shrink-factor
			 * 
			 * <b>Note:</b> This property is not supported in Internet Explorer 9, Android Native Browser/Webview <4.4, and Safari <7.
			 * @since 1.24
			 */
			shrinkFactor : {type : "float", group : "Misc", defaultValue : 1},
	
			/**
			 * The base size is the initial main size of the item for the flex algorithm. If set to "auto", this will be the computed size of the item.
			 * 
			 * @see http://www.w3.org/TR/css3-flexbox/#flex-basis
			 * 
			 * @since 1.32
			 */
			baseSize : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : "auto"},
	
			/**
			 * The style class will be applied to the flex item and can be used for CSS selectors
			 * @deprecated Since version 1.11.2. 
			 * Generic addStyleClass method is available on the control
			 */
			styleClass : {type : "string", group : "Misc", defaultValue : '', deprecated: true}
		}
	}});
	
	
	FlexItemData.prototype.setAlignSelf = function(sValue) {
		this.setProperty("alignSelf", sValue);
		FlexBoxStylingHelper.setStyle(null, this, "align-self", sValue);
		return this;
	};
	
	FlexItemData.prototype.setOrder = function(sValue) {
		this.setProperty("order", sValue);
		FlexBoxStylingHelper.setStyle(null, this, "order", sValue);
		return this;
	};
	
	FlexItemData.prototype.setGrowFactor = function(sValue) {
		this.setProperty("growFactor", sValue);
		FlexBoxStylingHelper.setStyle(null, this, "flex-grow", sValue);
		return this;
	};
	
	FlexItemData.prototype.setShrinkFactor = function(sValue) {
		this.setProperty("shrinkFactor", sValue, true);
		FlexBoxStylingHelper.setStyle(null, this, "flex-shrink", sValue);
		return this;
	};
	
	FlexItemData.prototype.setBaseSize = function(sValue) {
		this.setProperty("baseSize", sValue, true);
		sap.m.FlexBoxStylingHelper.setStyle(null, this, "flex-basis", sValue);
		return this;
	};
	

	return FlexItemData;

}, /* bExport= */ true);
