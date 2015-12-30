/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Callout.
sap.ui.define(['jquery.sap.global', './CalloutBase', './library'],
	function(jQuery, CalloutBase, library) {
	"use strict";



	/**
	 * Constructor for a new Callout.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Callout is a small popup with some useful information and links that is shown when a mouse is hovered over a specific view element.
	 * @extends sap.ui.commons.CalloutBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Callout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Callout = CalloutBase.extend("sap.ui.commons.Callout", /** @lends sap.ui.commons.Callout.prototype */ { metadata : {

		library : "sap.ui.commons",
		aggregations : {

			/**
			 * Determines the content of the Callout
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
		}
	}});

	///**
	// * This file defines behavior for the Callout control
	// */

	return Callout;

}, /* bExport= */ true);
