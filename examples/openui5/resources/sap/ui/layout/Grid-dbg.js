/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.Grid.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './library'],
	function(jQuery, Control, library) {
	"use strict";


	
	/**
	 * Constructor for a new Grid.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The Grid control is a layout which positions its child controls in a 12 column flow layout. Its children can be specified to take on a variable amount of columns depending on available screen size. With this control it is possible to achieve flexible layouts and line-breaks for extra large-, large-, medium- and small-sized screens, such as large desktop, desktop, tablet, and mobile. The Grid control's width can be percentage- or pixel-based and the spacing between its columns can be set to various pre-defined values.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.15.0
	 * @alias sap.ui.layout.Grid
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Grid = Control.extend("sap.ui.layout.Grid", /** @lends sap.ui.layout.Grid.prototype */ { metadata : {
	
		library : "sap.ui.layout",
		properties : {
	
			/**
			 * Optional. Width of the Grid. If not specified, then 100%.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},
	
			/**
			 * Optional. Vertical spacing between the rows in the Grid. In rem, allowed values are 0, 0.5, 1 and 2.
			 */
			vSpacing : {type : "float", group : "Dimension", defaultValue : 1},
	
			/**
			 * Optional. Horizontal spacing between the content in the Grid. In rem, allowed values are 0, 0.5 , 1 or 2.
			 */
			hSpacing : {type : "float", group : "Dimension", defaultValue : 1},
	
			/**
			 * Optional. Position of the Grid in the window or surrounding container. Possible values are "Center", "Left" and "Right".
			 */
			position : {type : "sap.ui.layout.GridPosition", group : "Dimension", defaultValue : "Left"},
	
			/**
			 * Optional. A string type that represents Grid's default span values for large, medium and small screens for the whole Grid. Allowed values are separated by space Letters L, M or S followed by number of columns from 1 to 12 that the container has to take, for example: "L2 M4 S6", "M12", "s10" or "l4 m4". Note that the parameters has to be provided in the order large medium small.
			 */
			defaultSpan : {type : "sap.ui.layout.GridSpan", group : "Behavior", defaultValue : "XL3 L3 M6 S12"},
	
			/**
			 * Optional. Defines default for the whole Grid numbers of empty columns before the current span begins. It can be defined for large, medium and small screens. Allowed values are separated by space Letters L, M or S followed by number of columns from 0 to 11 that the container has to take, for example: "L2 M4 S6", "M11", "s10" or "l4 m4". Note that the parameters has to be provided in the order large medium small.
			 */
			defaultIndent : {type : "sap.ui.layout.GridIndent", group : "Behavior", defaultValue : "XL0 L0 M0 S0"},
	
			/**
			 * If true then not the media Query ( device screen size), but the size of the container surrounding the grid defines the current range (large, medium or small).
			 */
			containerQuery : {type : "boolean", group : "Behavior", defaultValue : false}
		},
		defaultAggregation : "content",
		aggregations : {
	
			/**
			 * Controls that are placed into Grid layout.
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
		}
	}});
	
	/**
	 * This file defines behavior for the control
	 */
	(function() {
		
		Grid.prototype.init = function() {
			this._iBreakPointTablet = sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0];
			this._iBreakPointDesktop = sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1];
			this._iBreakPointLargeDesktop = sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2];
			
			// Backward compatibility - if no any settings for XL - the settings for L are used
			this._indentXLChanged = false;
			this._spanXLChanged = false;
		};
		
		/**
		 * Used for after-rendering initialization.
		 *
		 * @private
		 */
		Grid.prototype.onAfterRendering = function() {
			if (this.getContainerQuery()) {
				this._sContainerResizeListener = sap.ui.core.ResizeHandler.register(this, jQuery.proxy(this._onParentResize, this));
				this._onParentResize();
			} else {
				sap.ui.Device.media.attachHandler(this._handleMediaChange, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED);
			}
		};
		
		Grid.prototype.onBeforeRendering = function() {
			// Cleanup resize event registration before re-rendering
			this._cleanup();
		};
		
		Grid.prototype.exit = function() {
			// Cleanup resize event registration on exit
			this._cleanup();
		};
		
		/**
		 * Clean up the control.
		 * 
		 * @private
		 */
		Grid.prototype._cleanup = function() {
			// Cleanup resize event registration
			if (this._sContainerResizeListener) {
				sap.ui.core.ResizeHandler.deregister(this._sContainerResizeListener);
				this._sContainerResizeListener = null;
			}
			
			// Device Media Change handler
			sap.ui.Device.media.detachHandler(this._handleMediaChange, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED);
		};
		
		Grid.prototype._handleMediaChange  = function(oParams) {
			this._toggleClass(oParams.name);
		};
		
		Grid.prototype._setBreakPointTablet = function( breakPoint) {
			this._iBreakPointTablet = breakPoint;
		};
		
		Grid.prototype._setBreakPointDesktop = function( breakPoint) {
			this._iBreakPointDesktop = breakPoint;
		};
		
		Grid.prototype._setBreakPointLargeDesktop = function( breakPoint) {
			this._iBreakPointLargeDesktop = breakPoint;
		};
		
		Grid.prototype.setDefaultIndent = function( sDefaultIndent) {
			if (/XL/gi.test(sDefaultIndent)) {
				this._setIndentXLChanged(true);
			}
			this.setProperty("defaultIndent", sDefaultIndent);
		};
		
		Grid.prototype._setIndentXLChanged = function( bChanged) {
			this._indentXLChanged = bChanged;
		};
		
		Grid.prototype._getIndentXLChanged = function() {
			return this._indentXLChanged;
		};
		
	
		Grid.prototype.setDefaultSpan = function( sDefaultSpan) {
			if (/XL/gi.test(sDefaultSpan)) {
				this._setSpanXLChanged(true);
			}
			this.setProperty("defaultSpan", sDefaultSpan);
		};
		
		Grid.prototype._setSpanXLChanged = function( bChanged) {
			this._spanXLChanged = bChanged;
		};
		
		Grid.prototype._getSpanXLChanged = function() {
			return this._spanXLChanged;
		};
		
		Grid.prototype._onParentResize = function() {
			var oDomRef = this.getDomRef();
			// Prove if Dom reference exist, and if not - clean up the references.
			if (!oDomRef) {
				this._cleanup();
				return;
			}
	
			if (!jQuery(oDomRef).is(":visible")) {
				return;
			}
	
			var iCntWidth = oDomRef.clientWidth;
			if (iCntWidth <= this._iBreakPointTablet) {
				this._toggleClass("Phone");
			} else if ((iCntWidth > this._iBreakPointTablet) && (iCntWidth <= this._iBreakPointDesktop)) {
				this._toggleClass("Tablet");
			} else if ((iCntWidth > this._iBreakPointDesktop) && (iCntWidth <= this._iBreakPointLargeDesktop)) {
				this._toggleClass("Desktop");
			} else {
				this._toggleClass("LargeDesktop");
			}
		};
		
		
		Grid.prototype._toggleClass = function(sMedia) {
			var $DomRef = this.$();
			if (!$DomRef) {
				return;
			}
			
			if ($DomRef.hasClass("sapUiRespGridMedia-Std-" + sMedia)) {
				return;
			}
			
			$DomRef.toggleClass("sapUiRespGridMedia-Std-" + sMedia, true);
			if (sMedia === "Phone") {
				$DomRef.toggleClass("sapUiRespGridMedia-Std-Desktop", false).toggleClass("sapUiRespGridMedia-Std-Tablet", false).toggleClass("sapUiRespGridMedia-Std-LargeDesktop", false);
			} else if (sMedia === "Tablet") {
				$DomRef.toggleClass("sapUiRespGridMedia-Std-Desktop", false).toggleClass("sapUiRespGridMedia-Std-Phone", false).toggleClass("sapUiRespGridMedia-Std-LargeDesktop", false);
			} else if (sMedia === "LargeDesktop") {
				$DomRef.toggleClass("sapUiRespGridMedia-Std-Desktop", false).toggleClass("sapUiRespGridMedia-Std-Phone", false).toggleClass("sapUiRespGridMedia-Std-Tablet", false);
			} else {
				$DomRef.toggleClass("sapUiRespGridMedia-Std-Phone", false).toggleClass("sapUiRespGridMedia-Std-Tablet", false).toggleClass("sapUiRespGridMedia-Std-LargeDesktop", false);
			}
			
			this.fireEvent("mediaChanged", {media: sMedia});
		};
		
		
		/*
	     * Get span information for the Control
	     * @param {sap.ui.core.Control} Control instance
	     * @return {Object} Grid layout data
	     * @private
	     */
		Grid.prototype._getLayoutDataForControl = function(oControl) {
			var oLayoutData = oControl.getLayoutData();
	
			if (!oLayoutData) {
				return undefined;
			} else if (oLayoutData instanceof sap.ui.layout.GridData) {
				return oLayoutData;
			} else if (oLayoutData.getMetadata().getName() == "sap.ui.core.VariantLayoutData") {
				// multiple LayoutData available - search here
				var aLayoutData = oLayoutData.getMultipleLayoutData();
				for ( var i = 0; i < aLayoutData.length; i++) {
					var oLayoutData2 = aLayoutData[i];
					if (oLayoutData2 instanceof sap.ui.layout.GridData) {
						return oLayoutData2;
					}
				}
			}
		};
		
		/*
		 * If LayoutData is changed on one inner control, the whole grid needs to re-render
		 * because it may influence other rows and columns
		 */
		Grid.prototype.onLayoutDataChange = function(oEvent){
			if (this.getDomRef()) {
				// only if already rendered
				this.invalidate();
			}
		};

		/**
		 * Gets the role used for accessibility
		 * Set by the Form control if Grid represents a FormContainer
		 * @return {string} sRole accessibility role
		 * @since 1.28.0
		 * @private
		 */
		Grid.prototype._getAccessibleRole = function() {

			return null;

		};

	}());
	

	return Grid;

}, /* bExport= */ true);
