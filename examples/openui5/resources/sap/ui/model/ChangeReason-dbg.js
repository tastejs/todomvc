/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration for changes in model
sap.ui.define(function() {
	"use strict";


	/**
	* @class
	* Change Reason for ListBinding/TreeBinding.
	*
	* @static
	* @public
	* @alias sap.ui.model.ChangeReason
	*/
	var ChangeReason = {
	
			/**
			 * The list was sorted
			 * @public
			 */
			Sort: "sort",
	
			/**
			 * The List was filtered
			 * @public
			 */
			Filter: "filter",
	
			/**
			 * The list has changed
			 * @public
			 */
			Change: "change",
	
			/**
			 * The list context has changed
			 * @public
			 */
			Context: "context",
			/**
			 * The list was refreshed
			 * @public
			 */
			Refresh: "refresh",
			/**
			 * The tree node was expanded
			 * @public
			 */
			Expand: "expand",
			/**
			 * The tree node was collapsed
			 * @public
			 */
			Collapse: "collapse"
	};

	return ChangeReason;

}, /* bExport= */ true);
