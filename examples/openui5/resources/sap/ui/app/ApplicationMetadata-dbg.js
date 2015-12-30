/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.app.ApplicationMetadata
sap.ui.define(['jquery.sap.global', 'sap/ui/core/ComponentMetadata'],
	function(jQuery, ComponentMetadata) {
	"use strict";


	/**
	 * Creates a new metadata object for a Application subclass.
	 *
	 * @param {string} sClassName fully qualified name of the class that is described by this metadata object
	 * @param {object} oStaticInfo static info to construct the metadata from
	 *
	 * @experimental Since 1.13.2. The Application class is still under construction, so some implementation details can be changed in future.
	 * @deprecated Since 1.15.1. The Component class is enhanced to take care about the Application code.
	 * @class
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.13.2
	 * @name sap.ui.app.ApplicationMetadata
	 */
	var ApplicationMetadata = function(sClassName, oClassInfo) {
		// call super constructor
		ComponentMetadata.apply(this, arguments);
	};
	
	//chain the prototypes
	ApplicationMetadata.prototype = jQuery.sap.newObject(ComponentMetadata.prototype);
	
	ApplicationMetadata.preprocessClassInfo = function(oClassInfo) {
		// if the component is a string we convert this into a "_src" metadata entry
		// the specific metadata object can decide to support this or gracefully ignore it
		// basically the ComponentMetadata makes use of this feature
		if (oClassInfo && typeof oClassInfo.metadata === "string") {
			oClassInfo.metadata = {
				_src: oClassInfo.metadata
			};
		}
		return oClassInfo;
	};
	
	ApplicationMetadata.prototype.applySettings = function(oClassInfo) {
	
		var oStaticInfo = oClassInfo.metadata;
	
		ComponentMetadata.prototype.applySettings.call(this, oClassInfo);
	
		// if the application specifies the metadata property: loadFromFile then
		// the application metadata will be loaded from the specified file 
		// which needs to be located next to the application script file.
		if (oStaticInfo._src) {
			jQuery.sap.log.warning("The metadata of the application " + this.getName() + " is loaded from file " + oStaticInfo._src + ". This is a design time feature and not for productive usage!");
			var sPackage = this.getName().replace(/\.\w+?$/, "");
			var sUrl = jQuery.sap.getModulePath(sPackage, "/" + oStaticInfo._src);
			var oResponse = jQuery.sap.syncGetJSON(sUrl);
			if (oResponse.success) {
				jQuery.extend(oStaticInfo, oResponse.data);
			} else {
				jQuery.sap.log.error("Failed to load application metadata from \"" + oStaticInfo._src + "\"! Reason: " + oResponse.error);
			}
		}
		
		this._mRootComponent = oStaticInfo.rootComponent || null;
		
	};
	
	/**
	 * Returns the root component of the application 
	 * @return {string} root component
	 * @public
	 * @name sap.ui.app.ApplicationMetadata#getRootComponent
	 * @function
	 */
	ApplicationMetadata.prototype.getRootComponent = function() {
		return this._mRootComponent;
	};
	

	return ApplicationMetadata;

}, /* bExport= */ true);
