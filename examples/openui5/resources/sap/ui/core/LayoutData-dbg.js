/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.LayoutData.
sap.ui.define(['jquery.sap.global', './Element', './library'],
	function(jQuery, Element, library) {
	"use strict";


	
	/**
	 * Constructor for a new LayoutData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A layout data base type.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.LayoutData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LayoutData = Element.extend("sap.ui.core.LayoutData", /** @lends sap.ui.core.LayoutData.prototype */ { metadata : {
	
		"abstract" : true,
		library : "sap.ui.core"
	}});
	
	LayoutData.prototype.invalidate = function() {
		//No call of Element.invalidate to avoid bubbling of invalidate
		var oParent = this.getParent();
	
		if (oParent && oParent.getMetadata().getName() == "sap.ui.core.VariantLayoutData") {
			// layout is part of a VariantLayout - so use parent of this one
			oParent = oParent.getParent();
		}
	
		if (oParent) {
			var oLayout = oParent.getParent();
			if (oLayout) {
				var oEvent = jQuery.Event("LayoutDataChange");
				oEvent.srcControl = oParent;
				oLayout._handleEvent(oEvent);
			}
		}
	};
	
	LayoutData.prototype.setLayoutData = function(oLayoutData) {
	
		// as LayoutData on LayoutData makes no sense just ignore it.
		return this;
	
	};
	

	return LayoutData;

});
