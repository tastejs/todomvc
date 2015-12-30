/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 /*global Promise */

// Provides object sap.ui.dt.Preloader.
sap.ui.define([
	"sap/ui/core/Element"
],
function(Element) {
	"use strict";

	/**
	 * Class for Preloader.
	 * 
	 * @class
	 * Preloader for design time metadata.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @private
	 * @static
	 * @since 1.30
	 * @alias sap.ui.dt.Preloader
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */

	var Preloader = {
		aLoadedClasses : []
	};

	/**
	 * Loads the design time metadata for a given list of elements.
	 *
	 * @param {string[]|sap.ui.core.Element[]} aElements list of elements for which the design time metadata should be loaded. The list entry can be the class name or the control instance.
	 * @return {Promise} resolved when the design time is loaded for each element
	 * @public
	 */
	Preloader.load = function(aElements) {
		var that = this;
		var aQueue = [];
		aElements.forEach(function(vElement) {
			var oElement = vElement;
			if (typeof oElement === "string") {
				oElement = jQuery.sap.getObject(oElement);
			}
			if (oElement && oElement.getMetadata) {
				var oMetadata = oElement.getMetadata();
				var sClassName = oMetadata.getName ? oMetadata.getName() : null;
				var bIsLoaded = sClassName && that.aLoadedClasses.indexOf(sClassName) !== -1;
				if (!bIsLoaded && oMetadata.loadDesignTime) {
					that.aLoadedClasses.push(sClassName);
					aQueue.push(oMetadata.loadDesignTime());
				}
			}
		});
		return Promise.all(aQueue);
	};

	/**
	 * Loads the design time metadata for each element in the given list of libraries.
	 *
	 * @param {string[]} aLibraryNames list of libraries for which the design time metadata should be loaded
	 * @return {Promise} resolved when the design time is loaded for each given library
	 * @public
	 */
	Preloader.loadLibraries = function(aLibraryNames) {
		var aControlsToLoad = [];
		aLibraryNames.forEach(function(sLibraryName) {
			var mLib = jQuery.sap.getObject(sLibraryName);
			for (var sClassName in mLib) {
				if (mLib.hasOwnProperty(sClassName)) {
					aControlsToLoad.push(sLibraryName + "." + sClassName);
				}
			}	
		});
		return this.load(aControlsToLoad);
	};

	/**
	 * Loads the design time metadata for each element of all loaded libraries.
	 *
	 * @return {Promise} resolved when the design time is loaded for each library
	 * @public
	 */
	Preloader.loadAllLibraries = function() {
		var aLibrariesToLoad = [];
		var mLibs = sap.ui.getCore().getLoadedLibraries();
		for (var sLib in mLibs) {
			if (mLibs.hasOwnProperty(sLib)) {
				aLibrariesToLoad.push(sLib);
			}
		}
		return this.loadLibraries(aLibrariesToLoad);
	};

	return Preloader;
}, /* bExport= */ true);
