/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Clientside Filter processor
	 * @namespace sap.ui.model.FilterProcessor
	 */
	var FilterProcessor = {};

	/**
	 * Filters the list
	 * Filters are first grouped according to their binding path.
	 * All filters belonging to a group are ORed and after that the
	 * results of all groups are ANDed.
	 * Usually this means, all filters applied to a single table column
	 * are ORed, while filters on different table columns are ANDed.
	 * Multiple MultiFilters are ORed.
	 *
	 * @param {array} aData the data array to be filtered
	 * @param {array} aFilters the filter array
	 * @param {function} fnGetValue the method to get the actual value to filter on
	 *
	 * @public
	 */
	FilterProcessor.apply = function(aData, aFilters, fnGetValue){
		if (!aFilters || aFilters.length == 0) {
			return aData;
		}
		var that = this,
			oFilterGroups = {},
			aFilterGroup,
			aFiltered = [],
			bGroupFiltered = false,
			bFiltered = true;

		jQuery.each(aFilters, function(j, oFilter) {
			if (oFilter.sPath !== undefined) {
				aFilterGroup = oFilterGroups[oFilter.sPath];
				if (!aFilterGroup) {
					aFilterGroup = oFilterGroups[oFilter.sPath] = [];
				}
			} else {
				aFilterGroup = oFilterGroups["__multiFilter"];
				if (!aFilterGroup) {
					aFilterGroup = oFilterGroups["__multiFilter"] = [];
				}
			}
			aFilterGroup.push(oFilter);
		});
		jQuery.each(aData, function(i, vRef) {
			bFiltered = true;
			jQuery.each(oFilterGroups, function(sPath, aFilterGroup) {
				if (sPath !== "__multiFilter") {
					var oValue = fnGetValue(vRef, sPath);
					oValue = that.normalizeFilterValue(oValue);
					bGroupFiltered = false;
					jQuery.each(aFilterGroup, function(j, oFilter) {
						var fnTest = that.getFilterFunction(oFilter);
						if (oValue !== undefined && fnTest(oValue)) {
							bGroupFiltered = true;
							return false;
						}
					});
				} else {
					bGroupFiltered = false;
					jQuery.each(aFilterGroup, function(j, oFilter) {
						bGroupFiltered = that._resolveMultiFilter(oFilter, vRef, fnGetValue);
						if (bGroupFiltered) {
							return false;
						}
					});
				}
				if (!bGroupFiltered) {
					bFiltered = false;
					return false;
				}
			});
			if (bFiltered) {
				aFiltered.push(vRef);
			}
		});
		return aFiltered;
	};

	/**
	 * Normalize filter value
	 *
	 * @private
	 */
	FilterProcessor.normalizeFilterValue = function(oValue){
		if (typeof oValue == "string") {
			// use canonical composition as recommended by W3C
			// http://www.w3.org/TR/2012/WD-charmod-norm-20120501/#sec-ChoiceNFC
			if (String.prototype.normalize) {
				oValue = oValue.normalize("NFC");
			}
			return oValue.toUpperCase();
		}
		if (oValue instanceof Date) {
			return oValue.getTime();
		}
		return oValue;
	};

	/**
	 * Resolve the client list binding and check if an index matches
	 *
	 * @private
	 */
	FilterProcessor._resolveMultiFilter = function(oMultiFilter, vRef, fnGetValue){
		var that = this,
			bMatched = false,
			aFilters = oMultiFilter.aFilters;

		if (aFilters) {
			jQuery.each(aFilters, function(i, oFilter) {
				var bLocalMatch = false;
				if (oFilter._bMultiFilter) {
					bLocalMatch = that._resolveMultiFilter(oFilter, vRef, fnGetValue);
				} else if (oFilter.sPath !== undefined) {
					var oValue = fnGetValue(vRef, oFilter.sPath);
					oValue = that.normalizeFilterValue(oValue);
					var fnTest = that.getFilterFunction(oFilter);
					if (oValue !== undefined && fnTest(oValue)) {
						bLocalMatch = true;
					}
				}
				if (bLocalMatch && oMultiFilter.bAnd) {
					bMatched = true;
				} else if (!bLocalMatch && oMultiFilter.bAnd) {
					bMatched = false;
					return false;
				} else if (bLocalMatch) {
					bMatched = true;
					return false;
				}
			});
		}

		return bMatched;
	};

	/**
	 * Provides a JS filter function for the given filter
	 */
	FilterProcessor.getFilterFunction = function(oFilter){
		if (oFilter.fnTest) {
			return oFilter.fnTest;
		}
		var oValue1 = this.normalizeFilterValue(oFilter.oValue1),
			oValue2 = this.normalizeFilterValue(oFilter.oValue2);

		switch (oFilter.sOperator) {
			case "EQ":
				oFilter.fnTest = function(value) { return value == oValue1; }; break;
			case "NE":
				oFilter.fnTest = function(value) { return value != oValue1; }; break;
			case "LT":
				oFilter.fnTest = function(value) { return value < oValue1; }; break;
			case "LE":
				oFilter.fnTest = function(value) { return value <= oValue1; }; break;
			case "GT":
				oFilter.fnTest = function(value) { return value > oValue1; }; break;
			case "GE":
				oFilter.fnTest = function(value) { return value >= oValue1; }; break;
			case "BT":
				oFilter.fnTest = function(value) { return (value >= oValue1) && (value <= oValue2); }; break;
			case "Contains":
				oFilter.fnTest = function(value) {
					if (value == null) {
						return false;
					}
					if (typeof value != "string") {
						throw new Error("Only \"String\" values are supported for the FilterOperator: \"Contains\".");
					}
					return value.indexOf(oValue1) != -1;
				};
				break;
			case "StartsWith":
				oFilter.fnTest = function(value) {
					if (value == null) {
						return false;
					}
					if (typeof value != "string") {
						throw new Error("Only \"String\" values are supported for the FilterOperator: \"StartsWith\".");
					}
					return value.indexOf(oValue1) == 0;
				};
				break;
			case "EndsWith":
				oFilter.fnTest = function(value) {
					if (value == null) {
						return false;
					}
					if (typeof value != "string") {
						throw new Error("Only \"String\" values are supported for the FilterOperator: \"EndsWith\".");
					}
					var iPos = value.lastIndexOf(oValue1);
					if (iPos == -1) {
						return false;
					}
					return iPos == value.length - new String(oFilter.oValue1).length;
				};
				break;
			default:
				oFilter.fnTest = function(value) { return true; };
		}
		return oFilter.fnTest;
	};

	return FilterProcessor;

});
