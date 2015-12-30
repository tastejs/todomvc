/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ObjectAttribute.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";



	/**
	 * Constructor for a new ObjectAttribute.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The ObjectAttribute control displays a text field that can be normal or active. The ObjectAttribute fires a press event when the user selects active text.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.ObjectAttribute
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ObjectAttribute = Control.extend("sap.m.ObjectAttribute", /** @lends sap.m.ObjectAttribute.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the ObjectAttribute title.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the ObjectAttribute text.
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Indicates if the ObjectAttribute text is selectable for the user.
			 */
			active : {type : "boolean", group : "Misc", defaultValue : null},

			/**
			 * Determines the direction of the text, not including the title.
			 * Available options for the text direction are LTR (left-to-right) and RTL (right-to-left). By default the control inherits the text direction from its parent control.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit}
		},
		aggregations : {

			/**
			 * When the aggregation is set, it replaces the text, active and textDirection properties. This also ignores the press event. The provided control is displayed as an active link.
			 */
			customContent : {type : "sap.ui.core.Control", multiple : false},

			/**
			 * Text control to display title and text property.
			 */
			_textControl : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
		},
		events : {

			/**
			 * Fires when the user clicks on active text.
			 */
			press : {
				parameters : {

					/**
					 * DOM reference of the ObjectAttribute's text to be used for positioning.
					 */
					domRef : {type : "string"}
				}
			}
		}
	}});

	ObjectAttribute.MAX_LINES = {
		SINGLE_LINE: 1,
		MULTI_LINE: 2
	};

	/**
	 *  Initializes member variables.
	 *
	 * @private
	 */
	ObjectAttribute.prototype.init = function() {
		this.setAggregation('_textControl', new sap.m.Text());
	};

	/**
	 * Delivers text control with updated title, text and maxLines properties.
	 *
	 * @private
	 */
	ObjectAttribute.prototype._getUpdatedTextControl = function() {
		var oAttrAggregation = this.getAggregation('customContent') || this.getAggregation('_textControl'),
			sTitle = this.getTitle(),
			sText = this.getAggregation('customContent') ? this.getAggregation('customContent').getText() : this.getText(),
			sTextDir = this.getTextDirection(),
			oParent = this.getParent(),
			bPageRTL = sap.ui.getCore().getConfiguration().getRTL(),
			iMaxLines = ObjectAttribute.MAX_LINES.MULTI_LINE,
			bWrap = true,
			oppositeDirectionMarker = '';

		if (sTextDir === sap.ui.core.TextDirection.LTR && bPageRTL) {
			oppositeDirectionMarker = '\u200e';
		}
		if (sTextDir === sap.ui.core.TextDirection.RTL && !bPageRTL) {
			oppositeDirectionMarker = '\u200f';
		}
		sText = oppositeDirectionMarker + sText + oppositeDirectionMarker;
		if (sTitle) {
			sText = sTitle + ": " + sText;
		}
		oAttrAggregation.setProperty('text', sText, true);

		//if attribute is used inside responsive ObjectHeader or in ObjectListItem - only 1 line
		if (oParent instanceof sap.m.ObjectListItem) {
			bWrap = false;
			iMaxLines = ObjectAttribute.MAX_LINES.SINGLE_LINE;
		}

		this._setControlWrapping(oAttrAggregation, bWrap, iMaxLines);

		return oAttrAggregation;
	};

	/**
	 * Sets the appropriate property to the customContent aggregation.
	 *
	 * @private
	 */
	ObjectAttribute.prototype._setControlWrapping = function(oAttrAggregation, bWrap, iMaxLines) {
		if (oAttrAggregation instanceof sap.m.Link) {
			oAttrAggregation.setProperty('wrapping', bWrap, true);
		}
		if (oAttrAggregation instanceof sap.m.Text) {
			oAttrAggregation.setProperty('maxLines', iMaxLines, true);
		}
	};

	/**
	 * @private
	 */
	ObjectAttribute.prototype.ontap = function(oEvent) {
		//event should only be fired if the click is on the text
		if (this._isSimulatedLink() && (oEvent.target.id != this.getId())) {
			this.firePress({
				domRef : this.getDomRef()
			});
		}
	};

	/**
	 * @private
	 */
	sap.m.ObjectAttribute.prototype.onsapenter = function(oEvent) {
		if (this._isSimulatedLink()) {
			this.firePress({
				domRef : this.getDomRef()
			});
		}
	};

	/**
	 * @private
	 */
	sap.m.ObjectAttribute.prototype.onsapspace = function(oEvent) {
		this.onsapenter(oEvent);
	};

	/**
	 * Checks if ObjectAttribute is empty.
	 *
	 * @private
	 * @returns {boolean} true if ObjectAttribute's text is empty or only consists of whitespaces
	 */
	ObjectAttribute.prototype._isEmpty = function() {
		if (this.getAggregation('customContent') && !(this.getAggregation('customContent') instanceof sap.m.Link || this.getAggregation('customContent') instanceof sap.m.Text)) {
			jQuery.sap.log.warning("Only sap.m.Link or sap.m.Text are allowed in \"sap.m.ObjectAttribute.customContent\" aggregation");
			return true;
		}

		return !(this.getText().trim() || this.getTitle().trim());
	};

	/**
	 * Called when the control is touched.
	 *
	 * @private
	 */
	ObjectAttribute.prototype.ontouchstart = function(oEvent) {
		if (this._isSimulatedLink()) {
			// for control who need to know if they should handle events from the ObjectAttribute control
			oEvent.originalEvent._sapui_handledByControl = true;
		}
	};

	/**
	 * Defines to which DOM reference the Popup should be docked.
	 *
	 * @protected
	 * @return {DomNode} The DOM reference that Popup should dock to
	 */
	ObjectAttribute.prototype.getPopupAnchorDomRef = function() {
		return this.getDomRef("text");
	};

	ObjectAttribute.prototype._isSimulatedLink = function () {
		return this.getActive() && !this.getAggregation('customContent');
	};

	return ObjectAttribute;

}, /* bExport= */ true);
