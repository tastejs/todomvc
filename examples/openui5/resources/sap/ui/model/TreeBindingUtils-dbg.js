/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * sap.ui.model.TreeBindingUtils Utility Class
 *
 * @namespace
 * @name sap.ui.model
 * @public
 */

// Provides class sap.ui.model.odata.ODataUtils
sap.ui.define(function() {
	"use strict";

	// Static class

	/**
	 * @alias sap.ui.model.TreeBindingUtils
	 * @namespace
	 * @public
	 */
	var TreeBindingUtils = function() {};
	
	/**
	 * Merges together oNewSection into a set of other sections (aSections)
	 * The array/objects are not modified, the function returns a new section array.
	 * @param {object[]} aSections the sections into which oNewSection will be merged
	 * @param {objec} oNewSection the section which should be merged into aNewSections
	 * @return {object[]} a new array containing all sections from aSections merged with oNewSection
	 */
	TreeBindingUtils.mergeSections = function (aSections, oNewSection) {
		// Iterate over all known/loaded sections of the node
		var aNewSections = [];
		for (var i = 0; i < aSections.length; i++) {
			
			var oCurrentSection = aSections[i];
			var iCurrentSectionEndIndex = oCurrentSection.startIndex + oCurrentSection.length;
			var iNewSectionEndIndex = oNewSection.startIndex + oNewSection.length;
			
			if (oNewSection.startIndex <= iCurrentSectionEndIndex && iNewSectionEndIndex >= iCurrentSectionEndIndex 
					&& oNewSection.startIndex >= oCurrentSection.startIndex) {
				//new section expands to the left
				oNewSection.startIndex = oCurrentSection.startIndex; 
				oNewSection.length = iNewSectionEndIndex - oCurrentSection.startIndex;
			} else if (oNewSection.startIndex <= oCurrentSection.startIndex && iNewSectionEndIndex >= oCurrentSection.startIndex
					&& iNewSectionEndIndex <= iCurrentSectionEndIndex) {
				//new section expands to the right 
				oNewSection.length = iCurrentSectionEndIndex - oNewSection.startIndex;
			} else if (oNewSection.startIndex >= oCurrentSection.startIndex && iNewSectionEndIndex <= iCurrentSectionEndIndex) {
				//new section is contained in old one
				oNewSection.startIndex = oCurrentSection.startIndex;
				oNewSection.length = oCurrentSection.length;
			} else if (iNewSectionEndIndex < oCurrentSection.startIndex || oNewSection.startIndex > iCurrentSectionEndIndex) {
				//old and new sections do not overlap, either the new section is completely left or right from the old one
				aNewSections.push(oCurrentSection);
			}
		}
		
		aNewSections.push(oNewSection);
		
		return aNewSections;
	};
	
	return TreeBindingUtils;
});