/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";
	
	/**
	 * Abstract base class <code>MenuItemBase</code> for menu item elements. Please use concrete subclasses.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Abstract base class for menu item which provides common properties and events for all concrete item implementations.
	 * @abstract
	 * @extends sap.ui.unified.MenuItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.0.0
	 * 
	 * @deprecated Since version 1.21.0. 
	 * Please use the element <code>sap.ui.unified.MenuItemBase</code> of the library <code>sap.ui.unified</code> instead.
	 *
	 * @constructor
	 * @public
	 * @name sap.ui.commons.MenuItemBase
	 */
	
	try {
		sap.ui.getCore().loadLibrary("sap.ui.unified");
	} catch (e) {
		jQuery.sap.log.error("The controls/elements 'sap.ui.commons.Menu*' needs library 'sap.ui.unified'.");
		throw (e);
	}

	//Using sap.ui.require avoids global access but does not load the module, therefore jQuery.sap.require is necessary too
	jQuery.sap.require("sap.ui.unified.MenuItemBase");
	return sap.ui.require("sap/ui/unified/MenuItemBase");

}, /* bExport= */ true);
