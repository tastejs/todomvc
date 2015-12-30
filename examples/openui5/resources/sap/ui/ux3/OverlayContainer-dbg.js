/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.OverlayContainer.
sap.ui.define(['jquery.sap.global', './Overlay', './library'],
	function(jQuery, Overlay, library) {
	"use strict";


	
	/**
	 * Constructor for a new OverlayContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Is to be embedded into the Overlay control as content container
	 * @extends sap.ui.ux3.Overlay
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.OverlayContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var OverlayContainer = Overlay.extend("sap.ui.ux3.OverlayContainer", /** @lends sap.ui.ux3.OverlayContainer.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		defaultAggregation : "content",
		aggregations : {
	
			/**
			 * Aggregation for content
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
		}
	}});
	
	/**
	 * Focus Last Element
	 *
	 * @private
	 */
	OverlayContainer.prototype._setFocusLast = function() {
		var oFocus = this.$("content").lastFocusableDomRef();
		if (!oFocus && this.getCloseButtonVisible()) {
			oFocus = this.getDomRef("close");
		} else if (!oFocus && this.getOpenButtonVisible()) {
			oFocus = this.getDomRef("openNew");
		}
		jQuery.sap.focus(oFocus);
	};
	
	/**
	 * Focus First Element
	 *
	 * @private
	 */
	OverlayContainer.prototype._setFocusFirst = function() {
		if (this.getOpenButtonVisible()) {
			jQuery.sap.focus(this.getDomRef("openNew"));
		} else if (this.getCloseButtonVisible()) {
			jQuery.sap.focus(this.getDomRef("close"));
		} else {
			jQuery.sap.focus(this.$("content").firstFocusableDomRef());
		}
	};

	return OverlayContainer;

}, /* bExport= */ true);
