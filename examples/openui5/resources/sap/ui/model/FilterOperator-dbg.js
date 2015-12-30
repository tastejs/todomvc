/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration sap.ui.model.FilterOperator
sap.ui.define(function() {
	"use strict";


	/**
	* Operators for the Filter.
	*
	* @namespace
	* @public
	* @alias sap.ui.model.FilterOperator
	*/
	var FilterOperator = {
			/**
			 * FilterOperator equals
			 * @public
			 */
			EQ: "EQ",
	
			/**
			 * FilterOperator not equals
			 * @public
			 */
			NE: "NE",
	
			/**
			 * FilterOperator less than
			 * @public
			 */
			LT: "LT",
	
			/**
			 * FilterOperator less or equals
			 * @public
			 */
			LE: "LE",
	
			/**
			 * FilterOperator greater than
			 * @public
			 */
			GT: "GT",
	
			/**
			 * FilterOperator greater or equals
			 * @public
			 */
			GE: "GE",
	
			/**
			 * FilterOperator between.
			 * When used on strings, the BT operator might not behave intuitively. For example, 
			 * when filtering a list of Names with BT "A", "B", all Names starting with "A" will be 
			 * included as well as the name "B" itself, but no other name starting with "B".
			 * @public
			 */
			BT: "BT",
	
			/**
			 * FilterOperator contains
			 * @public
			 */
			Contains: "Contains",
	
			/**
			 * FilterOperator starts with
			 * @public
			 */
			StartsWith: "StartsWith",
	
			/**
			 * FilterOperator ends with
			 * @public
			 */
			EndsWith: "EndsWith"
	};

	return FilterOperator;

}, /* bExport= */ true);
