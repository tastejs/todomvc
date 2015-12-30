/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.FacetFilterItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library'],
	function(jQuery, ListItemBase, library) {
	"use strict";


	
	/**
	 * Constructor for a new FacetFilterItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents a value for the FacetFilterList control.
	 * @extends sap.m.ListItemBase
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.FacetFilterItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FacetFilterItem = ListItemBase.extend("sap.m.FacetFilterItem", /** @lends sap.m.FacetFilterItem.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Can be used as input for subsequent actions.
			 */
			key : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * The text to be displayed for the item.
			 */
			text : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Number of objects that match this item in the target data set.
			 * @deprecated Since version 7.20.0. 
			 * Use setCounter instead.
			 */
			count : {type : "int", group : "Misc", defaultValue : null, deprecated: true}
		}
	}});
	
	
	FacetFilterItem.prototype.setCount = function(iCount) {
		
		 // App dev can still call setCounter on ListItemBase, so we have redundancy here.
		this.setProperty("count", iCount);
		this.setProperty("counter", iCount);
	};
	
	FacetFilterItem.prototype.setCounter = function(iCount) {
		
		this.setProperty("count", iCount);
		this.setProperty("counter", iCount);
	};
	
	/**
	 * @private
	 */
	FacetFilterItem.prototype.init = function() {
		
	  ListItemBase.prototype.init.apply(this);
	  
	  // This class must be added to the ListItemBase container element, not the FacetFilterItem container
	  this.addStyleClass("sapMFFLI");
	};
	
	

	return FacetFilterItem;

}, /* bExport= */ true);
