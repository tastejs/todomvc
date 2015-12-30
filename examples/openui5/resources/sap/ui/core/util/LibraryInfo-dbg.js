/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.util.LibraryInfo
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'jquery.sap.script'],
	function(jQuery, BaseObject/* , jQuerySap */) {
	"use strict";


	/**
	 * Provides library information.
	 * @class Provides library information.
	 *
	 * @extends sap.ui.base.Object
	 * @author SAP SE
	 * @version 1.32.9
	 * @constructor
	 * @private
	 * @alias sap.ui.core.util.LibraryInfo
	 */
	var LibraryInfo = BaseObject.extend("sap.ui.core.util.LibraryInfo", {
		constructor : function() {
			BaseObject.apply(this);
			this._oLibInfos = {};
		},

		destroy : function() {
			BaseObject.prototype.destroy.apply(this, arguments);
			this._oLibInfos = {};
		},

		getInterface : function() {
			return this;
		}
	});


	LibraryInfo.prototype._loadLibraryMetadata = function(sLibraryName, fnCallback) {
		sLibraryName = sLibraryName.replace(/\//g, ".");

		if (this._oLibInfos[sLibraryName]) {
			jQuery.sap.delayedCall(0, window, fnCallback, [this._oLibInfos[sLibraryName]]);
			return;
		}

		var that = this,
		    sUrl,
		    sLibraryType,
		    aParts = /themelib_(.*)/i.exec(sLibraryName);
		if (!aParts) {
			// UI library
			sLibraryType = ".library";
			sUrl = jQuery.sap.getModulePath(sLibraryName, '/');
		} else {
			// theme library
			sLibraryType = ".theme";
			sUrl = jQuery.sap.getModulePath("sap.ui.core", '/themes/' + aParts[1] + "/");
		}

		jQuery.ajax({
			url : sUrl + sLibraryType,
			dataType : "xml",
			error : function(xhr, status, e) {
				jQuery.sap.log.error("failed to load library details from '" + sUrl + sLibraryType + ": " + status + ", " + e);
				that._oLibInfos[sLibraryName] = {name: sLibraryName, data: null, url: sUrl};
				fnCallback(that._oLibInfos[sLibraryName]);
			},
			success : function(oData, sStatus, oXHR) {
				that._oLibInfos[sLibraryName] = {name: sLibraryName, data: oData, url: sUrl};
				fnCallback(that._oLibInfos[sLibraryName]);
			}
		});
	};


	LibraryInfo.prototype._getLibraryInfo = function(sLibraryName, fnCallback) {
		this._loadLibraryMetadata(sLibraryName, function(oData){
			var result = {libs: [], library: oData.name, libraryUrl: oData.url};

			if (oData.data) {
				var $data = jQuery(oData.data);
				result.vendor = $data.find("vendor").text();
				result.copyright = $data.find("copyright").text();
				result.version = $data.find("version").text();
				result.documentation = $data.find("documentation").text();
				result.releasenotes = $data.find("releasenotes").attr("url"); // in the appdata section
				result.componentInfo = LibraryInfo.prototype._getLibraryComponentInfo($data);
			}

			fnCallback(result);
		});
	};


	LibraryInfo.prototype._getThirdPartyInfo = function(sLibraryName, fnCallback) {
		this._loadLibraryMetadata(sLibraryName, function(oData){
			var result = {libs: [], library: oData.name, libraryUrl: oData.url};

			if (oData.data) {
				var $Libs = jQuery(oData.data).find("appData").find("thirdparty").children();
				$Libs.each(function(i, o){
					if (o.nodeName === "lib") {
						var $Lib = jQuery(o);
						var $license = $Lib.children("license");
						result.libs.push({
							displayName: $Lib.attr("displayName"),
							homepage: $Lib.attr("homepage"),
							license: {
								url: $license.attr("url"),
								type: $license.attr("type"),
								file: oData.url + $license.attr("file")
							}
						});
					}
				});
			}

			fnCallback(result);
		});
	};


	LibraryInfo.prototype._getDocuIndex = function(sLibraryName, fnCallback) {
		this._loadLibraryMetadata(sLibraryName, function(oData){
			var lib = oData.name,
				libUrl = oData.url,
				result = {"docu": {}, library: lib, libraryUrl: libUrl};

			if (!oData.data) {
				fnCallback(result);
				return;
			}

			var $Doc = jQuery(oData.data).find("appData").find("documentation");
			var sUrl = $Doc.attr("indexUrl");

			if (!sUrl) {
				fnCallback(result);
				return;
			}

			if ($Doc.attr("resolve") == "lib") {
				sUrl = oData.url + sUrl;
			}

			jQuery.ajax({
				url : sUrl,
				dataType : "json",
				error : function(xhr, status, e) {
					jQuery.sap.log.error("failed to load library docu from '" + sUrl + "': " + status + ", " + e);
					fnCallback(result);
				},
				success : function(oData, sStatus, oXHR) {
					oData.library = lib;
					oData.libraryUrl = libUrl;
					fnCallback(oData);
				}
			});
		});
	};

	LibraryInfo.prototype._getReleaseNotes = function(sLibraryName, sVersion, fnCallback) {
		this._loadLibraryMetadata(sLibraryName, function(oData){

			if (!oData.data) {
				fnCallback({});
				return;
			}

			var oVersion = jQuery.sap.Version(sVersion);

			var iMajor = oVersion.getMajor();
			var iMinor = oVersion.getMinor();
			var iPatch = oVersion.getPatch();

			var $Doc = jQuery(oData.data).find("appData").find("releasenotes");
			var sUrl = $Doc.attr("url");

			if (!sUrl) {
				jQuery.sap.log.warning("failed to load release notes for library " + sLibraryName );
				fnCallback({});
				return;
			}

			// for SNAPSHOT versions we fallback to the next minor version, e.g.:
			// 1.27.1-SNAPSHOT => 1.28.0
			if (oVersion.getSuffix() === "-SNAPSHOT") {
				if (iMinor % 2 != 0) {
					iMinor = (iMinor + 1);
					iPatch = 0;
				}
				sVersion = iMajor + "." + iMinor + "." + iPatch;
			}

			// replace the placeholders for major, minor and patch
			sUrl = sUrl.replace("{major}", iMajor);
			sUrl = sUrl.replace("{minor}", iMinor);
			sUrl = sUrl.replace("{patch}", iPatch);

			// if the URL should be resolved against the library the URL
			// is relative to the library root path
			if ($Doc.attr("resolve") == "lib") {
				sUrl = oData.url + sUrl;
			}

			// load the changelog/releasenotes
			jQuery.ajax({
				url : sUrl,
				dataType : "json",
				error : function(xhr, status, e) {
					if (status === "parsererror") {
						jQuery.sap.log.error("failed to parse release notes for library '" + sLibraryName + ", " + e);
					} else {
						jQuery.sap.log.warning("failed to load release notes for library '" + sLibraryName + ", " + e);
					}
					fnCallback({});
				},
				success : function(oData, sStatus, oXHR) {
					// in case of a version is specified we return only the content
					// of the specific version instead of the full data of the release notes file.
					fnCallback(oData, sVersion);
				}
			});

		});
	};

	/**
	*Collect components from .library file
	*@param {object} oData xml formatted object of .library file
	*@return {array.<Object>} library component info or empty string
	*/

	LibraryInfo.prototype._getLibraryComponentInfo = function(oData) {
		var oAllLibComponents = {};
		var aComponentModules = [];
		var sDefaultComponent = "";

		oData.find("ownership > component").each(function(index, oCurrentComponent) {
			if (oCurrentComponent.childElementCount === 0) {
				sDefaultComponent = oCurrentComponent.textContent;
			} else {
				var vCurrentComponentName = oCurrentComponent.getElementsByTagName("name");
				if (vCurrentComponentName && vCurrentComponentName.length > 0) {
					vCurrentComponentName = vCurrentComponentName[0].textContent;
					var vCurrentModules = oCurrentComponent.getElementsByTagName("module");
					if (vCurrentComponentName && vCurrentModules && vCurrentModules.length > 0) {
						var sConcatenatedModules = "";
						for (var i = 0; i < vCurrentModules.length; i++) {
							var sModule = vCurrentModules[i].textContent.replace(/\//g, ".");
							if (sModule) {
								sConcatenatedModules = sConcatenatedModules + "," + sModule;
							}
						}

						if (sConcatenatedModules) {
							sConcatenatedModules = sConcatenatedModules.replace(/^,/, ''); // remove first comma
							var oTemp = { "component" : vCurrentComponentName, "modules" : sConcatenatedModules };
							aComponentModules.push(oTemp);
						}
					}
				}
			}
		});

		oAllLibComponents["defaultComponent"] = sDefaultComponent;
		if (aComponentModules && aComponentModules.length > 0) {
			oAllLibComponents["specialCases"] = aComponentModules;
		}

		return oAllLibComponents;
	};

	/**
	* Return the control's component for Ownership app (TeamApp) & Explored app (Demokit)
	*
	* @param {array.<Object>} oComponentInfos object for each library with the default component and special cases
	* @param {string} sModuleName control name, e.g. sap.m.Button
	* @return {string} component
	* @private
	*/
	LibraryInfo.prototype._getActualComponent = function(oComponentInfos, sModuleName) {
		if (sModuleName) {
			for (var key in oComponentInfos) {
				if (!oComponentInfos[key]) {
					// If no data wasn't found for the current component.
					// This might be the case if the corresponding library info isn't deployed on the current server.
					jQuery.sap.log.error("No library information deployed for " + key);
				}

				if (sModuleName.indexOf(key) === 0 && oComponentInfos[key]) {
					//check for special modules
					var bSpecialModule = false;
					var oSpecCases = oComponentInfos[key].specialCases;
					var sSpecComponent = "";
					var aSpecModules = [];

					if (oSpecCases) {
						for (var i = 0; i < oSpecCases.length; i++) {
							aSpecModules = oSpecCases[i].modules.split(",");

							for (var j = 0; j < aSpecModules.length; j++) {
								if (sModuleName === aSpecModules[j]) {
									sSpecComponent = oSpecCases[i].component;
									bSpecialModule = true;
									break;
								}
							}
						}
					}

					if (bSpecialModule) {
						return sSpecComponent;
					} else {
						return oComponentInfos[key].defaultComponent;
					}
				}
			}
		}
	};

	/**
	*Return the default library's component for Version Info (Demokit)
	*@param {array.<Object>} oLibraryInfo array with all library information, e.g componentInfo, releasenotes and etc
	*@return {string} component
	*/

	LibraryInfo.prototype._getDefaultComponent = function(oLibraryInfo) {
		return oLibraryInfo && oLibraryInfo.componentInfo && oLibraryInfo.componentInfo.defaultComponent;
	};

	return LibraryInfo;

});
