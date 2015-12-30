/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.SeparatorItem.
sap.ui.define(['./Item', './library'],
	function(Item, library) {
	"use strict";


	
	/**
	 * Constructor for a new SeparatorItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * An item that provides a visual separation. It borrows all its methods from the classes sap.ui.core.Item, sap.ui.core.Element,
	 * sap.ui.base.EventProvider, and sap.ui.base.Object.
	 * @extends sap.ui.core.Item
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.SeparatorItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SeparatorItem = Item.extend("sap.ui.core.SeparatorItem", /** @lends sap.ui.core.SeparatorItem.prototype */ { metadata : {
	
		library : "sap.ui.core"
	}});
	
	return SeparatorItem;

});
