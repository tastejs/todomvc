/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.layout.PositionContainer.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new layout/PositionContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Is used to specify the position of a control in the AbsoluteLayout
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.layout.PositionContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var PositionContainer = Element.extend("sap.ui.commons.layout.PositionContainer", /** @lends sap.ui.commons.layout.PositionContainer.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * Defines the distance to the top of the layout (as specified in HTML)
			 */
			top : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Defines the distance to the bottom of the layout (as specified in HTML)
			 */
			bottom : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Defines the distance to the left of the layout (as specified in HTML)
			 */
			left : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Defines the distance to the right of the layout (as specified in HTML)
			 */
			right : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Indicates whether this container shall be centered horizontally within the AbsoluteLayout area.
			 * The values of the attributes left and right are ignored when this feature is activated.
			 */
			centerHorizontally : {type : "boolean", group : "Dimension", defaultValue : false},
	
			/**
			 * Indicates whether this container should be centered vertically within the AbsoluteLayout area.
			 * The values of the attributes top and bottom are ignored when this feature is activated.
			 */
			centerVertically : {type : "boolean", group : "Dimension", defaultValue : false}
		},
		defaultAggregation : "control",
		aggregations : {
	
			/**
			 * Child control of the position container
			 */
			control : {type : "sap.ui.core.Control", multiple : false}
		}
	}});
	
	
	
	
	(function() {
	
	//**** Overridden API Functions ****
	
	PositionContainer.prototype.setControl = function(oControl) {
		cleanup(this);
	
		if (this.getDomRef()) {
			this.setAggregation("control", oControl, true);
			notifyLayoutOnChange(this, oControl ? "CTRL_CHANGE" : "CTRL_REMOVE");
		} else {
			if (this.getParent() && this.getParent().getDomRef()) {
				this.setAggregation("control", oControl, true);
				if (oControl) {
					notifyLayoutOnChange(this, "CTRL_ADD");
				}
			} else {
				this.setAggregation("control", oControl);
			}
		}
		
		if (oControl) {
			oControl.attachEvent("_change", onPropertyChanges, this);
		}
	
		return this;
	};
	
	
	PositionContainer.prototype.destroyControl = function() {
		cleanup(this);
	
		var bSuppressRerendering = !!this.getDomRef();
		this.destroyAggregation("control", bSuppressRerendering);
		if (bSuppressRerendering) {
			notifyLayoutOnChange(this, "CTRL_REMOVE");
		}
	
		return this;
	};
	
	
	PositionContainer.prototype.setTop = function(sTop) {
		setProp(this, "top", sTop, true);
		return this;
	};
	
	
	PositionContainer.prototype.setBottom = function(sBottom) {
		setProp(this, "bottom", sBottom, true);
		return this;
	};
	
	
	PositionContainer.prototype.setLeft = function(sLeft) {
		setProp(this, "left", sLeft, true);
		return this;
	};
	
	
	PositionContainer.prototype.setRight = function(sRight) {
		setProp(this, "right", sRight, true);
		return this;
	};
	
	
	PositionContainer.prototype.setCenterHorizontally = function(bCenterHorizontally) {
		setProp(this, "centerHorizontally", bCenterHorizontally, true);
		return this;
	};
	
	
	PositionContainer.prototype.setCenterVertically = function(bCenterVertically) {
		setProp(this, "centerVertically", bCenterVertically, true);
		return this;
	};
	
	

	/**
	 * Updates the position properties of the container according to the given position in JSON style.
	 *
	 * @param {object} oPos
	 *         JSON-like object which defines the position of the child control in the absolute layout. The object is expected
	 *         to have one or more out of the attributes top, bottom, left, right (each with a value of type sap.ui.core.CSSSize). If no object
	 *         is given, nothing is updated.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	PositionContainer.prototype.updatePosition = function(oPos) {
		if (!oPos) {
			oPos = {};
		}
	
		setProp(this, "centerHorizontally", oPos.centerHorizontally ? oPos.centerHorizontally : null);
		setProp(this, "centerVertically", oPos.centerVertically ? oPos.centerVertically : null);
		setProp(this, "left", oPos.left ? oPos.left : null);
		setProp(this, "right", oPos.right ? oPos.right : null);
		setProp(this, "top", oPos.top ? oPos.top : null);
		var bNotify = setProp(this, "bottom", oPos.bottom ? oPos.bottom : null);
		if (bNotify) {
			notifyLayoutOnChange(this, "CTRL_POS");
		}
	
	};
	
	
	//**** Other Functions ****
	
	/**
	 * Checks the position information for the child control against the width/height property and
	 * returns the compute position.
	 *
	 * @private
	 */
	PositionContainer.prototype.getComputedPosition = function() {
		var sTop = this.getTop();
		var sBottom = this.getBottom();
		var sLeft = this.getLeft();
		var sRight = this.getRight();
		var sWidth = null;
		var sHeight = null;
	
		var oControl = this.getControl();
	
		if (oControl) {
			if (this.getCenterHorizontally()) {
				sLeft = "50%";
				sRight = null;
			} else {
				if (!checkProperty(this, oControl, "width", "left", sLeft, "right", sRight)) {
					sRight = undefined;
				}
				if (!sLeft && !sRight) {
					sLeft = "0px";
				}
			}
	
			if (this.getCenterVertically()) {
				sTop = "50%";
				sBottom = null;
			} else {
				if (!checkProperty(this, oControl, "height", "top", sTop, "bottom", sBottom)) {
					sBottom = undefined;
				}
				if (!sTop && !sBottom) {
					sTop = "0px";
				}
			}
	
			sWidth = getContainerDimension(oControl, "width");
			sHeight = getContainerDimension(oControl, "height");
		}
	
		return {top: sTop, bottom: sBottom, left: sLeft, right: sRight, width: sWidth, height: sHeight};
	};
	
	
	/**
	 * Factory for <code>sap.ui.commons.layout.PositionContainer</code> using a given
	 * child control and a position in JSON style.
	 *
	 * @private
	 */
	PositionContainer.createPosition = function(oControl, oPos) {
		var oPosition = new PositionContainer();
		oPosition.setControl(oControl);
		if (oPos) {
			if (oPos.left) {
				oPosition.setLeft(oPos.left);
			}
			if (oPos.right) {
				oPosition.setRight(oPos.right);
			}
			if (oPos.top) {
				oPosition.setTop(oPos.top);
			}
			if (oPos.bottom) {
				oPosition.setBottom(oPos.bottom);
			}
			if (oPos.centerHorizontally) {
				oPosition.setCenterHorizontally(oPos.centerHorizontally);
			}
			if (oPos.centerVertically) {
				oPosition.setCenterVertically(oPos.centerVertically);
			}
		}
		return oPosition;
	};
	
	
	/**
	 * Cleans up and optionally reinitalizes the event handler registrations of the element.
	 *
	 * @private
	 */
	PositionContainer.prototype.reinitializeEventHandlers = function(bCleanupOnly) {
		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}
		if (!bCleanupOnly && this.getDomRef() && (this.getCenterHorizontally() || this.getCenterVertically())) {
			var that = this;
			var onResize = function(){
				var jRef = jQuery(that.getDomRef());
				if (that.getCenterHorizontally()) {
					jRef.css("margin-left", "-" + jRef.children().outerWidth() / 2 + "px");
				}
				if (that.getCenterVertically()) {
					jRef.css("margin-top", "-" + jRef.children().outerHeight() / 2 + "px");
				}
			};
			this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(), onResize);
			onResize();
		}
	};
	
	
	/**
	 * Called when the element is destroyed.
	 *
	 * @private
	 */
	PositionContainer.prototype.exit = function(oPos) {
		this.reinitializeEventHandlers(true);
	};
	
	
	/**
	 * Called when the element is instanciated.
	 *
	 * @private
	 */
	PositionContainer.prototype.init = function() {
		this._disableWidthCheck = true;
		this._disableHeightCheck = false;
	};
	
	
	//**** Private Helper Functions ****
	
	/**
	 * Sets the value of the given property and notifies the layout
	 * if necessary and desired.
	 *
	 * @private
	 */
	var setProp = function(oThis, sProp, oValue, bNotifyLayout) {
		var bSuppressRerendering = !!oThis.getDomRef();
		oThis.setProperty(sProp, oValue, bSuppressRerendering);
		if (bSuppressRerendering && bNotifyLayout) {
			notifyLayoutOnChange(oThis, "CTRL_POS");
		}
		return bSuppressRerendering;
	};
	
	
	/**
	 * Notifies the layout of this container about the change of the given type.
	 *
	 * @private
	 */
	var notifyLayoutOnChange = function(oThis, sChangeType) {
		var oLayout = oThis.getParent();
		if (oLayout) {
			oLayout.contentChanged(oThis, sChangeType);
		}
	};
	
	
	/**
	 * @see sap.ui.commons.layout.AbsoluteLayout#cleanUpControl
	 *
	 * @private
	 */
	var cleanup = function(oThis) {
		var oControl = oThis.getControl();
		if (oControl) {
			sap.ui.commons.layout.AbsoluteLayout.cleanUpControl(oControl);
			oControl.detachEvent("_change", onPropertyChanges, oThis);
		}
	};
	
	
	/**
	 * Checks whether the position settings fits to the set height/width attribute of a control.
	 *
	 * @private
	 */
	var checkProperty = function(oPositionContainer, oControl, sProp, sPos1, sVal1, sPos2, sVal2) {
		if (sVal1 && sVal2) {
			var oLayout = oPositionContainer.getParent();
			var oProp = getPropertyInfo(oControl, sProp);
			if (oProp) {
				var val = oControl[oProp._sGetter]();
				if (!(!val || val == "" || val == "auto" || val == "inherit")) {
					jQuery.sap.log.warning("Position " + sPos2 + "=" + sVal2 + " ignored, because child control " + oControl.getId() + " has fixed " + sProp + " (" + val + ").",
							"", "AbsoluteLayout '" + (oLayout ? oLayout.getId() : "_undefined") + "'");
					return false;
				}
			} else {
				if ((sProp === "width" && !oPositionContainer._disableWidthCheck) || (sProp === "height" && !oPositionContainer._disableHeightCheck)) {
					jQuery.sap.log.warning("Position " + sPos2 + "=" + sVal2 + " ignored, because child control " + oControl.getId() + " not resizable.",
							"", "AbsoluteLayout '" + (oLayout ? oLayout.getId() : "_undefined") + "'");
					return false;
				}
			}
		}
		return true;
	};
	
	
	/**
	 * Checks whether the given control has a property with the given name and type 'sap.ui.core.CSSSize' and
	 * returns the corresponding metadata object.
	 *
	 * @private
	 */
	var getPropertyInfo = function(oControl, sPropertyName) {
		var oPropertyInfo = oControl.getMetadata().getProperty(sPropertyName);
		if (oPropertyInfo && oPropertyInfo.type === 'sap.ui.core.CSSSize') {
			return oPropertyInfo;
		}
		return null;
	};
	
	
	/**
	 * Returns the value width or height property (depending of <code>sDim</code>) of the given
	 * control if the width or height is specified in %.
	 *
	 * @private
	 */
	var getContainerDimension = function(oControl, sDim){
		var oProp = getPropertyInfo(oControl, sDim);
		if (oProp) {
			var val = oControl[oProp._sGetter]();
			if (val && jQuery.sap.endsWith(val, "%")) {
				return val;
			}
		}
		return null;
	};
	
	
	/**
	 * Handler on child control to check for property changes on width or height attribute.
	 *
	 * @private
	 */
	var onPropertyChanges = function(oEvent){
		var sProp = oEvent.getParameter("name");
		var parent = this.getParent();
		
		if ((sProp === "width" || sProp === "height") && parent && parent.getDomRef()) {
			notifyLayoutOnChange(this, "CTRL_POS");
		}
	};
	
	}());

	return PositionContainer;

}, /* bExport= */ true);
