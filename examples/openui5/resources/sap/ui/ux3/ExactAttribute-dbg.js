/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ExactAttribute.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './library'],
	function(jQuery, Element, library) {
	"use strict";

	/**
	 * Constructor for a new ExactAttribute.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * An element for defining attributes and sub-attributes used within the Exact pattern.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.ExactAttribute
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ExactAttribute = Element.extend("sap.ui.ux3.ExactAttribute", /** @lends sap.ui.ux3.ExactAttribute.prototype */ { metadata : {

		library : "sap.ui.ux3",
		properties : {

			/**
			 * The attribute name
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Specifies whether the attribute shall be selected
			 */
			selected : {type : "boolean", group : "Misc", defaultValue : null},

			/**
			 * Specifies the width of the corresponding list in pixels. The value must be between 70 and 500.
			 * @since 1.7.0
			 */
			width : {type : "int", group : "Misc", defaultValue : 168},

			/**
			 * The order how the sublists of this attribute should be displayed.
			 * @since 1.7.1
			 */
			listOrder : {type : "sap.ui.ux3.ExactOrder", defaultValue : sap.ui.ux3.ExactOrder.Select},

			/**
			 * Specifies whether the attribute shall have sub values for visual purposes.
			 * The indicator which is a little arrow beside an attribute in the list is computed automatically
			 * (getShowSubAttributesIndicator_Computed() of sap.ui.ux3.ExactAttribute).
			 * In the case that a supply function is attached, and the supplyActive attribute has value 'true',
			 * then the Exact pattern needs a hint if sub attributes are available. The showSubAttributesIndicator attribute is
			 * considered then and has to be maintained. If the back-end does not support count-calls, for example,
			 * showSubAttributesIndicator should be set to true.
			 */
			showSubAttributesIndicator : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * An example for additional data are database keys
			 */
			additionalData : {type : "object", group : "Misc", defaultValue : null},

			/**
			 * The supplyAttributes event is only fired if supplyActive has value true which is the default. After firing the event, the attribute is automatically set to false.
			 * The idea is that a supply function is called only once when the data is requested. To enable the event again it is possible to manually set the attribute back to true.
			 */
			supplyActive : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * If you want the supply function to be called on every select, you can set the autoActivateSupply attribute to true. In this case, supplyActive is automatically
			 * set to true on every unselect.
			 */
			autoActivateSupply : {type : "boolean", group : "Misc", defaultValue : false}
		},
		defaultAggregation : "attributes",
		aggregations : {

			/**
			 * Values (sub attributes) of this attribute
			 */
			attributes : {type : "sap.ui.ux3.ExactAttribute", multiple : true, singularName : "attribute"}
		},
		events : {

			/**
			 * A supply function is a handler which is attached to the supplyAttributes event. The event is fired when the corresponding ExactAttribute is selected, it was already selected when a handler is attached or function getAttributes() is called.
			 */
			supplyAttributes : {
				parameters : {

					/**
					 * The ExactAttribute
					 */
					attribute : {type : "sap.ui.ux3.ExactAttribute"}
				}
			}
		}
	}});

	(function() {

	ExactAttribute._MINWIDTH = 70;
	ExactAttribute._MAXWIDTH = 500;

	ExactAttribute.prototype.onInit = function (){
		this._getAttributesCallCount = 0;
	};

	/**
	 * Scrolls the corresponding list of this attribute until the given direct child attribute is visible. If the corresponding list is not yet visible the call is buffered until the list is available.
	 *
	 * @param {sap.ui.ux3.ExactAttribute} oOAttribute
	 *         The direct child attribute
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ExactAttribute.prototype.scrollTo = function(oAttribute) {
		if (!(oAttribute instanceof ExactAttribute)) {
			this._scrollToAttributeId = undefined;
			return;
		}

		var oList = this.getChangeListener();
		if (oList) {
			oList = sap.ui.getCore().byId(oList.id);
			if (oList && oList._lb) {
				var iIdx = this.indexOfAttribute(oAttribute);
				if (iIdx >= 0) {
					oList._lb.scrollToIndex(iIdx, true);
				}
				this._scrollToAttributeId = undefined;
				return;
			}
		}
		this._scrollToAttributeId = oAttribute.getId();
	};

	//*** Overridden API functions ***

	ExactAttribute.prototype.setText = function(sText) {
		this.setProperty("text", sText, true);
		this._handleChange(this, "text");
		return this;
	};


	ExactAttribute.prototype.setWidth = function(iWidth) {
		this._setWidth(iWidth);
		this._handleChange(this, "width");
		return this;
	};


	/**
	 * @param {string|sap.ui.core.TooltipBase} oTooltip
	 * @see sap.ui.core.Element.prototype.setTooltip
	 * @public
	 */
	ExactAttribute.prototype.setTooltip = function(oTooltip) {
		Element.prototype.setTooltip.apply(this, arguments);
		this._handleChange(this, "tooltip", true);
		return this;
	};


	ExactAttribute.prototype.setSelected = function(bSelected) {
		this.setProperty("selected", bSelected, true);

		if (!this.getSelected()) {
			this._clearSelection();
		}

		this._handleChange(this, "selected");
		return this;
	};


	ExactAttribute.prototype.setSupplyActive = function(bSupplyActive) {
		this.setProperty("supplyActive", bSupplyActive, true);
		return this;
	};

	ExactAttribute.prototype.setAutoActivateSupply = function(bAutoActivateSupply) {
		this.setProperty("autoActivateSupply", bAutoActivateSupply, true);
		return this;
	};


	ExactAttribute.prototype.setAdditionalData = function(oAdditionalData) {
		this.setProperty("additionalData", oAdditionalData, true);
		return this;
	};


	ExactAttribute.prototype.setListOrder = function(sListOrder) {
		this.setProperty("listOrder", sListOrder, true);
		this._handleChange(this, "order");
		return this;
	};


	ExactAttribute.prototype.getAttributes = function() {
		this._getAttributesCallCount++;

		if (this._getAttributesCallCount > 1){
			this.setSupplyActive(false);
		}

		if (this.hasListeners("supplyAttributes") && this.getSupplyActive()) {
			this._bSuppressChange = true;
			this._bChangedHappenedDuringSuppress = false;
			this.fireSupplyAttributes({attribute: this});
			this.setSupplyActive(false);
			this._bSuppressChange = undefined;
			if (this._bChangedHappenedDuringSuppress) {
				this._handleChange(this, "attributes");
			}
			this._bChangedHappenedDuringSuppress = undefined;
		}

		this._getAttributesCallCount--;
		return this.getAttributesInternal();
	};

	ExactAttribute.prototype.insertAttribute = function(oAttribute, iIndex) {
		this.insertAggregation("attributes", oAttribute, iIndex, true);
		this._handleChange(this, "attributes");
		this.setSupplyActive(false);
		return this;
	};

	ExactAttribute.prototype.addAttribute = function(oAttribute) {
		this.addAggregation("attributes", oAttribute, true);
		this._handleChange(this, "attributes");
		this.setSupplyActive(false);
		return this;
	};

	ExactAttribute.prototype.removeAttribute = function(vElement) {
		var oAtt = this.removeAggregation("attributes", vElement, true);
		if (oAtt) {
			oAtt.setChangeListener(null);
			this._handleChange(this, "attributes");
		}
		return oAtt;
	};

	ExactAttribute.prototype.removeAllAttributes = function() {
		var aAtts = this.getAttributesInternal();
		for (var idx = 0; idx < aAtts.length; idx++) {
			aAtts[idx].setChangeListener(null);
		}
		var aRes = this.removeAllAggregation("attributes", true);
		if (aAtts.length > 0) {
			this._handleChange(this, "attributes");
		}
		return aRes;
	};

	ExactAttribute.prototype.destroyAttributes = function() {
		var aAtts = this.getAttributesInternal();
		for (var idx = 0; idx < aAtts.length; idx++) {
			aAtts[idx].setChangeListener(null);
		}
		this.destroyAggregation("attributes", true);
		if (aAtts.length > 0) {
			this._handleChange(this, "attributes");
		}
		return this;
	};



	/**
	 * See attribute showSubAttributesIndicator
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ExactAttribute.prototype.getShowSubAttributesIndicator_Computed = function() {
		return this.hasListeners("supplyAttributes") && this.getSupplyActive() ? this.getShowSubAttributesIndicator() : this.getAttributesInternal().length > 0;
	};


	ExactAttribute.prototype.attachSupplyAttributes = function(oData, fnFunction, oListener) {
		this.attachEvent("supplyAttributes", oData, fnFunction, oListener);
		if (this.getSelected()) {
			this.getAttributesInternal(true); //force init of attributes (e.g. call supply function))
		}
		return this;
	};

	//*** Internal (may also used by Exact Control) functions ***

	ExactAttribute.prototype._setProperty_Orig = ExactAttribute.prototype.setProperty;
	/**
	 * @param {string} sPropertyName
	 * @param {object} oValue
	 * @param {boolean} bSuppressRerendering
	 * @see sap.ui.core.Element.prototype.setProperty
	 * @protected
	 */
	ExactAttribute.prototype.setProperty = function(sPropertyName, oValue, bSuppressRerendering) {
		this._setProperty_Orig(sPropertyName, oValue, bSuppressRerendering);

		if (sPropertyName == "selected") {
			if (oValue) {
				this.getAttributesInternal(true); //force init of attributes (e.g. call supply function)
			} else {
				if (this.getAutoActivateSupply()) {
					this.setSupplyActive(true);
				}
			}
		}

		return this;
	};

	ExactAttribute.prototype.setChangeListener = function(oChangeListener) {
		this._oChangeListener = oChangeListener;
	};


	ExactAttribute.prototype.getChangeListener = function(oChangeListener) {
		return this._oChangeListener;
	};


	ExactAttribute.prototype.getAttributesInternal = function(bForceInit) {
		return bForceInit ? this.getAttributes() : this.getAggregation("attributes", []);
	};


	ExactAttribute.prototype._handleChange = function(oSourceAttribute, sType) {
		if (this._bSuppressChange) {
			this._bChangedHappenedDuringSuppress = true;
			return;
		}
		if (this.getChangeListener()) {
			//Change is handled by the change listener
			this.getChangeListener()._notifyOnChange(sType, oSourceAttribute);
		} else if (this.getParent() && this.getParent()._handleChange) {
			//Bubble Change to next change listener
			this.getParent()._handleChange(oSourceAttribute, sType);
		}
	};

	//Sets the selection property of the attribute and all its sub-attributes to false.
	ExactAttribute.prototype._clearSelection = function(){
		this.setProperty("selected", false, true);
		var aVals = this.getAttributesInternal();
		for (var idx = 0; idx < aVals.length; idx++) {
			aVals[idx]._clearSelection();
		}
	};

	//Setter of the width property without invalidate and change notification
	ExactAttribute.prototype._setWidth = function(iWidth) {
		iWidth = Math.round(ExactAttribute._checkWidth(iWidth));
		this.setProperty("width", iWidth, true);
	};

	//Checks whether the given width is within the allowed boundaries
	ExactAttribute._checkWidth = function(iWidth) {
		iWidth = Math.max(iWidth, ExactAttribute._MINWIDTH);
		iWidth = Math.min(iWidth, ExactAttribute._MAXWIDTH);
		return iWidth;
	};

	}());

	return ExactAttribute;

}, /* bExport= */ true);
