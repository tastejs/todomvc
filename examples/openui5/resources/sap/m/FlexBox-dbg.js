/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.FlexBox.
sap.ui.define(['jquery.sap.global', './FlexBoxStylingHelper', './library', 'sap/ui/core/Control'],
	function(jQuery, FlexBoxStylingHelper, library, Control) {
	"use strict";



	/**
	 * Constructor for a new FlexBox.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The FlexBox control builds the container for a flexible box layout.
	 * 
	 * Browser support:
	 * This control is not supported in Internet Explorer 9!
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.FlexBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FlexBox = Control.extend("sap.m.FlexBox", /** @lends sap.m.FlexBox.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * The height of the FlexBox. Note that when a percentage is given, for the height to work as expected, the height of the surrounding container must be defined.
			 * @since 1.9.1
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},

			/**
			 * The width of the FlexBox. Note that when a percentage is given, for the width to work as expected, the width of the surrounding container must be defined.
			 * @since 1.9.1
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},

			/**
			 * Determines whether the flexbox is in block or inline mode
			 */
			displayInline : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Determines the direction of the layout of child elements
			 */
			direction : {type : "sap.m.FlexDirection", group : "Appearance", defaultValue : sap.m.FlexDirection.Row},

			/**
			 * Determines whether the flexbox will be sized to completely fill its container. If the FlexBox is inserted into a Page, the property 'enableScrolling' of the Page needs to be set to 'false' for the FlexBox to fit the entire viewport.
			 */
			fitContainer : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Determines whether the layout is rendered as a series of divs or as an unordered list (ul)
			 */
			renderType : {type : "sap.m.FlexRendertype", group : "Misc", defaultValue : sap.m.FlexRendertype.Div},

			/**
			 * Determines the layout behavior along the main axis. "SpaceAround" is currently not supported in most non-Webkit browsers.
			 */
			justifyContent : {type : "sap.m.FlexJustifyContent", group : "Appearance", defaultValue : sap.m.FlexJustifyContent.Start},

			/**
			 * Determines the layout behavior of items along the cross-axis. "Baseline" is not supported in Internet Explorer <10.
			 */
			alignItems : {type : "sap.m.FlexAlignItems", group : "Appearance", defaultValue : sap.m.FlexAlignItems.Stretch}
		},
		defaultAggregation : "items",
		aggregations : {
	
			/**
			 * Flex items within the FlexBox layout
			 */
			items : {type : "sap.ui.core.Control", multiple : true, singularName : "item"}
		}
	}});
	
	
	FlexBox.prototype.init = function() {
		// Make sure that HBox and VBox have a valid direction
		if (this instanceof sap.m.HBox && (this.getDirection() !== "Row" || this.getDirection() !== "RowReverse")) {
			this.setDirection('Row');
		}
		if (this instanceof sap.m.VBox && (this.getDirection() !== "Column" || this.getDirection() !== "ColumnReverse")) {
			this.setDirection('Column');
		}
	};

	FlexBox.prototype.addItem = function(oItem) {
		this.addAggregation("items", oItem);

		if (oItem) {
			oItem.attachEvent("_change", this.onItemChange, this);
		}

		return this;
	};

	FlexBox.prototype.insertItem = function(oItem, iIndex) {
		this.insertAggregation("items", oItem, iIndex);

		if (oItem) {
			oItem.attachEvent("_change", this.onItemChange, this);
		}

		return this;
	};
	
	FlexBox.prototype.removeItem = function(vItem) {
		var oItem = this.removeAggregation("items", vItem);

		if (oItem) {
			oItem.detachEvent("_change", this.onItemChange, this);
		}

		return oItem;
	};

	FlexBox.prototype.removeAllItems = function() {
		var aItems = this.getItems();

		for (var i = 0; i < aItems.length; i++) {
			aItems[i].detachEvent("_change", this.onItemChange, this);
		}

		return this.removeAllAggregation("items");
	};

	FlexBox.prototype.onItemChange = function(oControlEvent) {
		// Early return condition
		if (oControlEvent.getParameter("name") !== "visible") {
			return;
		}

		// Render or remove flex item if visibility changes
		var sId = oControlEvent.getParameter("id"),
			sNewValue = oControlEvent.getParameter("newValue"),
			oLayoutData = sap.ui.getCore().byId(sId).getLayoutData();

		if (!(oLayoutData instanceof sap.m.FlexItemData)) {
			return;
		}

		if (sNewValue) {
			oLayoutData.$().removeClass("sapUiHiddenPlaceholder").removeAttr("aria-hidden");
		} else {
			oLayoutData.$().addClass("sapUiHiddenPlaceholder").attr("aria-hidden", "true");
		}
	};

	FlexBox.prototype.setDisplayInline = function(bInline) {
		var sDisplay = "";

		this.setProperty("displayInline", bInline, false);
		if (bInline) {
			sDisplay = "inline-flex";
		} else {
			sDisplay = "flex";
		}
		FlexBoxStylingHelper.setStyle(null, this, "display", sDisplay);
		return this;
	};

	FlexBox.prototype.setDirection = function(sValue) {
		this.setProperty("direction", sValue, false);
		FlexBoxStylingHelper.setStyle(null, this, "flex-direction", sValue);
		return this;
	};
	
	FlexBox.prototype.setFitContainer = function(sValue) {
		if (sValue && !(this.getParent() instanceof FlexBox)) {
			jQuery.sap.log.info("FlexBox fitContainer set to true. Remember, if the FlexBox is inserted into a Page, the property 'enableScrolling' of the Page needs to be set to 'false' for the FlexBox to fit the entire viewport.");
			var $flexContainer = this.$();
			$flexContainer.css("width", "auto");
			$flexContainer.css("height", "100%");
		}
		
		this.setProperty("fitContainer", sValue, false);
	
		return this;
	};
	
	//TODO Enable wrapping when any browser supports it
	/*sap.m.FlexBox.prototype.setJustifyContent = function(sValue) {
		this.setProperty("wrap", sValue, true);
		sap.m.FlexBoxStylingHelper.setStyle(null, this, "flex-wrap", sValue);
		return this;
	}*/
	
	FlexBox.prototype.setJustifyContent = function(sValue) {
		this.setProperty("justifyContent", sValue, false);
		FlexBoxStylingHelper.setStyle(null, this, "justify-content", sValue);
		return this;
	};
	
	FlexBox.prototype.setAlignItems = function(sValue) {
		this.setProperty("alignItems", sValue, false);
		FlexBoxStylingHelper.setStyle(null, this, "align-items", sValue);
		return this;
	};
	
	FlexBox.prototype.setAlignContent = function(sValue) {
		this.setProperty("alignContent", sValue, false);
		FlexBoxStylingHelper.setStyle(null, this, "align-content", sValue);
		return this;
	};
	
	FlexBox.prototype.onAfterRendering = function() {
		if (jQuery.support.useFlexBoxPolyfill) {
			// Check for parent FlexBoxes. Size calculations need to be made from top to bottom
			// while the renderer goes from bottom to top.
			var that = this;
			var currentElement = that;
			var parent = null;
			jQuery.sap.log.info("Check #" + currentElement.getId() + " for nested FlexBoxes");
	
			for (parent = currentElement.getParent();
				parent !== null && parent !== undefined &&
				(parent instanceof FlexBox
				|| (parent.getLayoutData && parent.getLayoutData() instanceof sap.m.FlexItemData));
				) {
				currentElement = parent;
				parent = currentElement.getParent();
			}
	
			this._sanitizeChildren(this);
			this._renderFlexBoxPolyFill();
		}
	};
	
	/*
	 * @private
	 */
	FlexBox.prototype._sanitizeChildren = function(oControl) {
		// Check the flex items
		var aChildren = oControl.getItems();
		for (var i = 0; i < aChildren.length; i++) {
			if (aChildren[i].getVisible === undefined || aChildren[i].getVisible()) {
				var $child = "";
				if (aChildren[i] instanceof FlexBox) {
					$child = aChildren[i].$();
				} else {
					$child = aChildren[i].$().parent();	// Get wrapper <div>
				}
				$child.width("auto");
				//$child.height("100%");
				if (aChildren[i] instanceof FlexBox) {
					this._sanitizeChildren(aChildren[i]);
				}
			}
		}
	};
	
	/*
	 * @private
	 */
	FlexBox.prototype._renderFlexBoxPolyFill = function() {
		var flexMatrix = [];
		var ordinalMatrix = [];
	
		// Prepare flex and ordinal matrix
		var aChildren = this.getItems();
		for (var i = 0; i < aChildren.length; i++) {
			// If no visible property or if visible
			if (aChildren[i].getVisible === undefined || aChildren[i].getVisible()) {
				// Get layout properties
				var oLayoutData = aChildren[i].getLayoutData();
	
				if (oLayoutData !== "undefined" && oLayoutData !== null && oLayoutData instanceof sap.m.FlexItemData) {
					if (oLayoutData.getGrowFactor() !== 1) {
						flexMatrix.push(oLayoutData.getGrowFactor());
					} else {
						flexMatrix.push(1);		// default value
					}
					if (oLayoutData.getOrder() != 0) {
						ordinalMatrix.push(oLayoutData.getOrder());
					} else {
						ordinalMatrix.push(0);	// default value
					}
				}
			}
		}
	
		if (flexMatrix.length === 0) {
			flexMatrix = null;
		}
		if (ordinalMatrix.length === 0) {
			ordinalMatrix = null;
		}
	
		if (this.getFitContainer()) {
			// Call setter for fitContainer to apply the appropriate styles which are normally applied by the FlexBoxStylingHelper
			this.setFitContainer(true);
		}
	
		var oSettings = {
		    direction : this.getDirection(),
		    alignItems : this.getAlignItems(),
		    justifyContent : this.getJustifyContent(),
		    flexMatrix : flexMatrix,
		    ordinalMatrix : ordinalMatrix
		};
	
		FlexBoxStylingHelper.applyFlexBoxPolyfill(this.getId(), oSettings);
	};

	return FlexBox;

}, /* bExport= */ true);