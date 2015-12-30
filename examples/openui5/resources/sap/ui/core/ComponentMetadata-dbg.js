/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.ComponentMetadata
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObjectMetadata', 'sap/ui/thirdparty/URI', 'jquery.sap.resources'],
	function(jQuery, ManagedObjectMetadata, URI /*, jQuery2 */) {
	"use strict";

	/**
	 * Util function to process strings in an object/array recursively
	 *
	 * @param {object/Array} oObject object/array to process
	 * @param {function} fnCallback function(oObject, sKey, sValue) to call for all strings. Use "oObject[sKey] = X" to change the value.
	 */
	function processObject(oObject, fnCallback) {
		for (var sKey in oObject) {
			if (!oObject.hasOwnProperty(sKey)) {
				continue;
			}
			var vValue = oObject[sKey];
			switch (typeof vValue) {
				case "object":
					// ignore null objects
					if (vValue) {
						processObject(vValue, fnCallback);
					}
					break;
				case "string":
						fnCallback(oObject, sKey, vValue);
						break;
				default:
					// do nothing in case of other types
			}
		}
	}
	
	function getVersionWithoutSuffix(sVersion) {
		var oVersion = jQuery.sap.Version(sVersion);
		return oVersion.getSuffix() ? jQuery.sap.Version(oVersion.getMajor() + "." + oVersion.getMinor() + "." + oVersion.getPatch()) : oVersion;
	}

	// Manifest Template RegExp: {{foo}}
	var rManifestTemplate = /\{\{([^\}\}]+)\}\}/g;

	/**
	 * Creates a new metadata object for a Component subclass.
	 *
	 * @param {string} sClassName fully qualified name of the class that is described by this metadata object
	 * @param {object} oStaticInfo static info to construct the metadata from
	 *
	 * @public
	 * @class
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.9.2
	 * @alias sap.ui.core.ComponentMetadata
	 */
	var ComponentMetadata = function(sClassName, oClassInfo) {

		// call super constructor
		ManagedObjectMetadata.apply(this, arguments);

	};

	//chain the prototypes
	ComponentMetadata.prototype = jQuery.sap.newObject(ManagedObjectMetadata.prototype);

	ComponentMetadata.preprocessClassInfo = function(oClassInfo) {
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

	ComponentMetadata.prototype.applySettings = function(oClassInfo) {

		var oStaticInfo = oClassInfo.metadata;

		// if the component metadata loadFromFile feature is active then
		// the component metadata will be loaded from the specified file
		// which needs to be located next to the Component.js file.
		var sName = this.getName(),
		    sPackage = sName.replace(/\.\w+?$/, "");
		if (oStaticInfo._src) {
			if (oStaticInfo._src == "component.json") {
				jQuery.sap.log.warning("Usage of declaration \"metadata: 'component.json'\" is deprecated (component " + sName + "). Use \"metadata: 'json'\" instead.");
			} else if (oStaticInfo._src != "json") {
				throw new Error("Invalid metadata declaration for component " + sName + ": \"" + oStaticInfo._src + "\"! Use \"metadata: 'json'\" to load metadata from component.json.");
			}

			var sResource = sPackage.replace(/\./g, "/") + "/component.json";
			jQuery.sap.log.info("The metadata of the component " + sName + " is loaded from file " + sResource + ".");
			try {
				var oResponse = jQuery.sap.loadResource(sResource, {
					dataType: "json"
				});
				jQuery.extend(oStaticInfo, oResponse);
			} catch (err) {
				jQuery.sap.log.error("Failed to load component metadata from \"" + sResource + "\" (component " + sName + ")! Reason: " + err);
			}
		}

		ManagedObjectMetadata.prototype.applySettings.call(this, oClassInfo);

		// keep the information about the component name (for customizing)
		this._sComponentName = sPackage;

		// static initialization flag & instance count
		this._bInitialized = false;
		this._iInstanceCount = 0;

		// extract the manifest
		var oManifest = oStaticInfo["manifest"];

		// if a manifest is available we switch to load the manifest for the
		// metadata instead of using the component metadata section
		if (oManifest) {

			// set the version of the metadata
			oStaticInfo.__metadataVersion = 2;

			// load the manifest if defined as string
			if (typeof oManifest === "string" && oManifest === "json") {

				var sResource = sPackage.replace(/\./g, "/") + "/manifest.json";
				jQuery.sap.log.info("The manifest of the component " + sName + " is loaded from file " + sResource + ".");
				try {
					// the synchronous loading would be only relevant during the
					// development time - for productive usage the Component should
					// provide a preload packaging which includes the manifest
					// next to the Component code - so the sync request penalty
					// should be ignorable for now (async implementation will
					// change the complete behavior of the constructor function)
					var oResponse = jQuery.sap.loadResource(sResource, {
						dataType: "json"
					});
					oManifest = oResponse;
				} catch (err) {
					jQuery.sap.log.error("Failed to load component manifest from \"" + sResource + "\" (component " + sName + ")! Reason: " + err);
					// in case of error the manifest is an empty object
					// to behave similar like for missing component.json
					oManifest = {};
				}

			}

		} else {

			// set the version of the metadata
			// no manifest => metadata version 1
			oStaticInfo.__metadataVersion = 1;
			oManifest = {};

		}

		// ensure the general property name, the namespace sap.app with the id,
		// the namespace sap.ui5 and eventually the extends property
		oManifest["name"] = oManifest["name"] || sName;
		oManifest["sap.app"] = oManifest["sap.app"] || {
			"id": sPackage // use the "package" namespace instead of the classname (without ".Component")
		};
		oManifest["sap.ui5"] = oManifest["sap.ui5"] || {};
		// the extends property will be added when the component is not a base class
		var bIsComponentBaseClass = /^sap\.ui\.core\.(UI)?Component$/.test(sName);
		if (!bIsComponentBaseClass) {
			oManifest["sap.ui5"]["extends"] = oManifest["sap.ui5"]["extends"] || {};
		}

		// convert the old legacy metadata and merge with the new manifest
		this._convertLegacyMetadata(oStaticInfo, oManifest);

		// apply the raw manifest to the static info and store the static info for
		// later access to specific custom entries of the manifest itself
		oStaticInfo["manifest"] = oManifest;

		// processed manifest will be set when the manifest
		// gets requested for the first time
		// see #getManifest / #getManifestEntry
		oStaticInfo["processed-manifest"] = null;

		this._oStaticInfo = oStaticInfo;

	};

	/**
	 * Static initialization of components. This function will be called by the
	 * component and the metadata decides whether to execute the static init code
	 * or not. It will be called the first time a component is initialized.
	 * @private
	 */
	ComponentMetadata.prototype.init = function() {
		if (!this._bInitialized) {

			// first we load the dependencies of the parent
			var oParent = this.getParent();
			if (oParent instanceof ComponentMetadata) {
				oParent.init();
			}

			// version check => only if minVersion is available a warning 
			// will be logged and the debug mode is turned on 
			// TODO: enhance version check also for libraries and components
			var oManifestUI5 = this.getManifestEntry("sap.ui5");
			var sMinUI5Version = oManifestUI5["dependencies"] && oManifestUI5["dependencies"]["minUI5Version"];
			if (sMinUI5Version && 
				jQuery.sap.log.isLoggable(jQuery.sap.log.LogLevel.WARNING) && 
				sap.ui.getCore().getConfiguration().getDebug()) {
				// try catch to avoid that getVersionInfo breaks the execution
				try {
					var oVersionInfo = sap.ui.getVersionInfo();
					var oMinVersion = getVersionWithoutSuffix(sMinUI5Version);
					var oVersion = getVersionWithoutSuffix(oVersionInfo && oVersionInfo.version);
					if (oMinVersion.compareTo(oVersion) > 0) {
						jQuery.sap.log.warning("Component \"" + this.getComponentName() + "\" requires at least version \"" + oMinVersion.toString() + "\" but running on \"" + oVersion.toString() + "\"!");
					}
				} catch (e) {
					jQuery.sap.log.warning("The validation of the version for Component \"" + this.getComponentName() + "\" failed! Reasion: " + e);
				}
			}

			// define the resource roots
			// => if not loaded via manifest first approach the resource roots 
			//    will be registered too late for the AMD modules of the Component
			//    controller. This is a constraint for the resource roots config
			//    in the manifest!
			this._defineResourceRoots();

			// first the dependencies have to be loaded (other UI5 libraries)
			this._loadDependencies();

			// then load the custom scripts and CSS files
			this._loadIncludes();

			this._bInitialized = true;

		}
	};

	/**
	 * Static termination of components.
	 *
	 * TODO: Right now it is unclear when this function should be called. Just to
	 *       make sure that we do not forget this in future.
	 *
	 * @private
	 */
	ComponentMetadata.prototype.exit = function() {
		if (this._bInitialized) {
			var oParent = this.getParent();
			if (oParent instanceof ComponentMetadata) {
				oParent.exit();
			}
			// TODO: implement unload of CSS, ...
			this._bInitialized = false;
		}
	};

	/**
	 * Component instances need to register themselves in this method to enable
	 * the customizing for this component. This will only be done for the first
	 * instance and only if a customizing configuration is available.
	 * @private
	 */
	ComponentMetadata.prototype.onInitComponent = function() {
		var oUI5Manifest = this.getManifestEntry("sap.ui5", true),
			mExtensions = oUI5Manifest && oUI5Manifest["extends"] && oUI5Manifest["extends"].extensions;
		if (this._iInstanceCount === 0 && !jQuery.isEmptyObject(mExtensions)) {
			jQuery.sap.require("sap.ui.core.CustomizingConfiguration");
			var CustomizingConfiguration = sap.ui.require('sap/ui/core/CustomizingConfiguration');
			CustomizingConfiguration.activateForComponent(this._sComponentName);
		}
		this._iInstanceCount++;
	};

	/**
	 * Component instances need to unregister themselves in this method to disable
	 * the customizing for this component. This will only be done for the last
	 * instance and only if a customizing configuration is available.
	 * @private
	 */
	ComponentMetadata.prototype.onExitComponent = function() {
		this._iInstanceCount = Math.max(this._iInstanceCount - 1, 0);
		var oUI5Manifest = this.getManifestEntry("sap.ui5", true),
			mExtensions = oUI5Manifest && oUI5Manifest["extends"] && oUI5Manifest["extends"].extensions;
		if (this._iInstanceCount === 0 && !jQuery.isEmptyObject(mExtensions)) {
			var CustomizingConfiguration = sap.ui.require('sap/ui/core/CustomizingConfiguration');
			if (CustomizingConfiguration) {
				CustomizingConfiguration.deactivateForComponent(this._sComponentName);
			}
		}
	};

	/**
	 * Returns the version of the metadata which could be 1 or 2. 1 is for legacy
	 * metadata whereas 2 is for the manifest.
	 * @return {int} metadata version (1: legacy metadata, 2: manifest)
	 * @protected
	 * @since 1.27.1
	 */
	ComponentMetadata.prototype.getMetadataVersion = function() {
		return this._oStaticInfo.__metadataVersion;
	};

	/**
	 * Returns the manifest defined in the metadata of the component.
	 * If not specified, the return value is null.
	 * @return {Object} manifest.
	 * @public
	 * @since 1.27.1
	 */
	ComponentMetadata.prototype.getManifest = function() {

		// use raw manifest in case of legacy metadata
		if (this.getMetadataVersion() === 1) {
			return this.getRawManifest();
		}

		// only a copy of the manifest will be returned to make sure that it
		// cannot be modified - TODO: think about Object.freeze() instead
		return jQuery.extend(true, {}, this._getManifest());
	};

	/**
	 * Returns the processed manifest object (no copy).
	 * Processing will be done in a "lazy" way.
	 *
	 * @return {object} manifest
	 * @private
	 * @since 1.29.0
	 */
	ComponentMetadata.prototype._getManifest = function() {

		// check if the manifest was already processed and set as a separate private property
		var oProcessedManifest = this._oStaticInfo["processed-manifest"];
		if (!oProcessedManifest) {

			// use public getter to get a copy of the raw manifest
			// otherwise the raw manifest would get modified
			var oRawManifest = this.getRawManifest();

			// process manifest and set it as private property
			oProcessedManifest = this._oStaticInfo["processed-manifest"] = this._processManifestEntries(oRawManifest);
		}

		return oProcessedManifest;
	};

	/**
	 * Returns the raw manifest defined in the metadata of the component.
	 * If not specified, the return value is null.
	 * @return {Object} manifest
	 * @public
	 * @since 1.29.0
	 */
	ComponentMetadata.prototype.getRawManifest = function() {
		// only a copy of the manifest will be returned to make sure that it
		// cannot be modified - TODO: think about Object.freeze() instead
		return jQuery.extend(true, {}, this._getRawManifest());
	};

	/**
	 * Returns the raw manifest object (no copy).
	 *
	 * @return {object} manifest
	 * @private
	 * @since 1.29.0
	 */
	ComponentMetadata.prototype._getRawManifest = function() {
		return this._oStaticInfo["manifest"];
	};

	/**
	 * Replaces template placeholder in manifest with values from
	 * ResourceBundle referenced in manifest "sap.app/i18n".
	 *
	 * @private
	 * @since 1.29.0
	 */
	ComponentMetadata.prototype._processManifestEntries = function(oManifest) {

		// exclude abstract base classes and legacy metadata
		if (!this.isAbstract() && this._oStaticInfo.__metadataVersion === 2) {

			var that = this;

			// read out i18n URI, defaults to i18n/i18n.properties
			var sComponentRelativeI18nUri = (oManifest["sap.app"] && oManifest["sap.app"]["i18n"]) || "i18n/i18n.properties";

			var oResourceBundle;

			processObject(oManifest, function(oObject, sKey, vValue) {
				oObject[sKey] = vValue.replace(rManifestTemplate, function(sMatch, s1) {
					// only create a resource bundle if there is something to replace
					if (!oResourceBundle) {
						oResourceBundle = jQuery.sap.resources({
							url: that._resolveUri(new URI(sComponentRelativeI18nUri)).toString()
						});
					}
					return oResourceBundle.getText(s1);
				});
			});

		}

		return oManifest;
	};

	/**
	 * Returns the manifest configuration entry with the specified key (Must be a JSON object).
	 * If no key is specified, the return value is null.
	 *
	 * Example:
	 * <code>
	 *   sap.ui.core.Component.extend("sample.Component", {
	 *       metadata: {
	 *           manifest: {
	 *               "my.custom.config" : {
	 *                   "property1" : true,
	 *                   "property2" : "Something else"
	 *               }
	 *           }
	 *       }
	 *   });
	 * </code>
	 *
	 * The configuration above can be accessed via <code>sample.Component.getMetadata().getManifestEntry("my.custom.config")</code>.
	 *
	 * @param {string} sKey key of the custom configuration (must be prefixed with a namespace / separated with dots)
	 * @param {boolean} [bMerged] whether the custom configuration should be merged with components parent custom configuration.
	 * @return {Object} custom Component configuration with the specified key.
	 * @public
	 * @since 1.27.1
	 */
	ComponentMetadata.prototype.getManifestEntry = function(sKey, bMerged) {
		if (!sKey || sKey.indexOf(".") <= 0) {
			jQuery.sap.log.warning("Manifest entries with keys without namespace prefix can not be read via getManifestEntry. Key: " + sKey + ", Component: " + this.getName());
			return null;
		}

		var oParent,
		    oManifest = this.getManifest(),
		    oData = oManifest && oManifest[sKey] || {};

		if (!jQuery.isPlainObject(oData)) {
			jQuery.sap.log.warning("Custom Manifest entry with key '" + sKey + "' must be an object. Component: " + this.getName());
			return null;
		}

		if (bMerged && (oParent = this.getParent()) instanceof ComponentMetadata) {
			return jQuery.extend(true, {}, oParent.getManifestEntry(sKey, bMerged), oData);
		}
		return jQuery.extend(true, {}, oData);
	};

	/**
	 * Returns the custom Component configuration entry with the specified key (Must be a JSON object).
	 * If no key is specified, the return value is null.
	 *
	 * Example:
	 * <code>
	 *   sap.ui.core.Component.extend("sample.Component", {
	 *       metadata: {
	 *           "my.custom.config" : {
	 *               "property1" : true,
	 *               "property2" : "Something else"
	 *           }
	 *       }
	 *   });
	 * </code>
	 *
	 * The configuration above can be accessed via <code>sample.Component.getMetadata().getCustomEntry("my.custom.config")</code>.
	 *
	 * @param {string} sKey key of the custom configuration (must be prefixed with a namespace)
	 * @param {boolean} bMerged whether the custom configuration should be merged with components parent custom configuration.
	 * @return {Object} custom Component configuration with the specified key.
	 * @public
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifestEntry
	 */
	ComponentMetadata.prototype.getCustomEntry = function(sKey, bMerged) {
		if (!sKey || sKey.indexOf(".") <= 0) {
			jQuery.sap.log.warning("Component Metadata entries with keys without namespace prefix can not be read via getCustomEntry. Key: " + sKey + ", Component: " + this.getName());
			return null;
		}

		var oParent,
		    oData = this._oStaticInfo[sKey] || {};

		if (!jQuery.isPlainObject(oData)) {
			jQuery.sap.log.warning("Custom Component Metadata entry with key '" + sKey + "' must be an object. Component: " + this.getName());
			return null;
		}

		if (bMerged && (oParent = this.getParent()) instanceof ComponentMetadata) {
			return jQuery.extend(true, {}, oParent.getCustomEntry(sKey, bMerged), oData);
		}
		return jQuery.extend(true, {}, oData);
	};


	/**
	 * Returns the name of the Component (which is the namespace only with the module name)
	 * @return {string} Component name
	 * @public
	 */
	ComponentMetadata.prototype.getComponentName = function() {
		return this._sComponentName;
	};

	/**
	 * Returns the dependencies defined in the metadata of the component. If not specified, the return value is null.
	 * @return {Object} Component dependencies.
	 * @public
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getDependencies = function() {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getDependencies is deprecated!");
		if (!this._oLegacyDependencies) {
			var oUI5Manifest = this.getManifestEntry("sap.ui5"),
			    mDependencies = oUI5Manifest && oUI5Manifest.dependencies,
			    sUI5Version = mDependencies && mDependencies.minUI5Version || null,
			    mLibs = mDependencies && mDependencies.libs || {},
			    mComponents = mDependencies && mDependencies.components || {};
			var mLegacyDependencies = {
				ui5version: sUI5Version,
				libs: [],
				components: []
			};
			for (var sLib in mLibs) {
				mLegacyDependencies.libs.push(sLib);
			}
			for (var sComponent in mComponents) {
				mLegacyDependencies.components.push(sComponent);
			}
			this._oLegacyDependencies = mLegacyDependencies;
		}
		return this._oLegacyDependencies;
	};

	/**
	 * Returns the array of the included files that the Component requires such as css and js. If not specified or the array is empty, the return value is null.
	 * @return {string[]} Included files.
	 * @public
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getIncludes = function() {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getIncludes is deprecated!");
		if (!this._aLegacyIncludes) {
			var aIncludes = [],
			    oUI5Manifest = this.getManifestEntry("sap.ui5"),
			    mResources = oUI5Manifest && oUI5Manifest.resources || {},
			    aCSSResources = mResources && mResources.css || [],
			    aJSResources = mResources && mResources.js || [];
				for (var i = 0, l = aCSSResources.length; i < l; i++) {
					if (aCSSResources[i] && aCSSResources[i].uri) {
						aIncludes.push(aCSSResources[i].uri);
					}
				}
				for (var i = 0, l = aJSResources.length; i < l; i++) {
					if (aJSResources[i] && aJSResources[i].uri) {
						aIncludes.push(aJSResources[i].uri);
					}
				}
			this._aLegacyIncludes = (aIncludes.length > 0) ? aIncludes : null;
		}
		return this._aLegacyIncludes;
	};

	/**
	 * Returns the required version of SAP UI5 defined in the metadata of the Component. If returned value is null, then no special UI5 version is required.
	 * @return {string} Required version of UI5 or if not specified then null.
	 * @public
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getUI5Version = function() {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getUI5Version is deprecated!");
		var oUI5Manifest = this.getManifestEntry("sap.ui5");
		return oUI5Manifest && oUI5Manifest.dependencies && oUI5Manifest.dependencies.minUI5Version;
	};

	/**
	 * Returns array of components specified in the metadata of the Component. If not specified or the array is empty, the return value is null.
	 * @return {string[]} Required Components.
	 * @public
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getComponents = function() {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getComponents is deprecated!");
		return this.getDependencies().components;
	};

	/**
	 * Returns array of libraries specified in metadata of the Component, that are automatically loaded when an instance of the component is created.
	 * If not specified or the array is empty, the return value is null.
	 * @return {string[]} Required libraries.
	 * @public
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getLibs = function() {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getLibs is deprecated!");
		return this.getDependencies().libs;
	};

	/**
	 * Returns the version of the component. If not specified, the return value is null.
	 * @return {string} The version of the component.
	 * @public
	 */
	ComponentMetadata.prototype.getVersion = function() {
		var oAppManifest = this.getManifestEntry("sap.app");
		return oAppManifest && oAppManifest.applicationVersion && oAppManifest.applicationVersion.version;
	};

	/**
	 * Returns a copy of the configuration property to disallow modifications. If no
	 * key is specified it returns the complete configuration property.
	 * @param {string} [sKey] the key of the configuration property
	 * @param {boolean} [bDoNotMerge] true, to return only the local configuration
	 * @return {object} the value of the configuration property
	 * @public
	 * @since 1.15.1
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getConfig = function(sKey, bDoNotMerge) {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getConfig is deprecated!");
		var oUI5Manifest = this.getManifestEntry("sap.ui5", !bDoNotMerge),
		    mConfig = oUI5Manifest && oUI5Manifest.config;

		// return the configuration
		return jQuery.extend(true, {}, mConfig && sKey ? mConfig[sKey] : mConfig);
	};


	/**
	 * Returns a copy of the customizing property
	 * @param {boolean} [bDoNotMerge] true, to return only the local customizing config
	 * @return {object} the value of the customizing property
	 * @private
	 * @since 1.15.1
	 * @experimental Since 1.15.1. Implementation might change.
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getCustomizing = function(bDoNotMerge) {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getCustomizing is deprecated!");
		var  oUI5Manifest = this.getManifestEntry("sap.ui5", !bDoNotMerge),
		    mExtensions = jQuery.extend(true, {}, oUI5Manifest && oUI5Manifest["extends"] && oUI5Manifest["extends"].extensions);

		// return the exensions object
		return mExtensions;
	};


	/**
	 * Returns the models configuration which defines the available models of the
	 * component.
	 * @param {boolean} [bDoNotMerge] true, to return only the local model config
	 * @return {object} models configuration
	 * @private
	 * @since 1.15.1
	 * @experimental Since 1.15.1. Implementation might change.
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getModels = function(bDoNotMerge) {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getModels is deprecated!");
		if (!this._oLegacyModels) {
			this._oLegacyModels = {};
			var oUI5Manifest = this.getManifestEntry("sap.ui5"),
			    mDataSources = oUI5Manifest && oUI5Manifest.models || {};
			for (var sDataSource in mDataSources) {
				var oDataSource = mDataSources[sDataSource];
				this._oLegacyModels[sDataSource] = oDataSource.settings || {};
				this._oLegacyModels[sDataSource].type = oDataSource.type;
				this._oLegacyModels[sDataSource].uri = oDataSource.uri;
			}
		}

		// deep copy of the legacy models object
		var oParent,
		    mModels = jQuery.extend(true, {}, this._oLegacyModels);
		// merge the models object if defined via parameter
		if (!bDoNotMerge && (oParent = this.getParent()) instanceof ComponentMetadata) {
			mModels = jQuery.extend(true, {}, oParent.getModels(), mModels);
		}

		// return a clone of the models
		return mModels;
	};

	/**
	 * Returns messaging flag
	 *
	 * @return {boolean} bMessaging Messaging enabled/disabled
	 * @private
	 * @since 1.28.0
	 * @deprecated Since 1.28.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.handleValidation = function() {
		//jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.handleValidation is deprecated!");
		var oUI5Manifest = this.getManifestEntry("sap.ui5");
		return oUI5Manifest && oUI5Manifest.handleValidation;
	};

	/**
	 * Returns the services configuration which defines the available services of the
	 * component.
	 * @return {object} services configuration
	 * @private
	 * @since 1.15.1
	 * @experimental Since 1.15.1. Implementation might change.
	 * @deprecated Since 1.27.1. Please use the sap.ui.core.ComponentMetadata#getManifest
	 */
	ComponentMetadata.prototype.getServices = function() {
		jQuery.sap.log.warning("Usage of sap.ui.core.ComponentMetadata.protoype.getServices is deprecated!");
		// legacy API - for the manifest services has a different meaning!
		return this._oStaticInfo.services || {};
	};

	/**
	 * Loads the included CSS and JavaScript resources. The resources will be
	 * resoloved relative to the component location.
	 *
	 * @private
	 */
	ComponentMetadata.prototype._loadIncludes = function() {

		var oUI5Manifest = this.getManifestEntry("sap.ui5");
		var mResources = oUI5Manifest["resources"];

		if (!mResources) {
			return;
		}

		var sComponentName = this.getComponentName();

		// load JS files
		var aJSResources = mResources["js"];
		if (aJSResources) {
			for (var i = 0; i < aJSResources.length; i++) {
				var oJSResource = aJSResources[i];
				var sFile = oJSResource.uri;
				if (sFile) {
					// load javascript file
					var m = sFile.match(/\.js$/i);
					if (m) {
						// prepend lib name to path, remove extension
						var sPath = sComponentName.replace(/\./g, '/') + (sFile.slice(0, 1) === '/' ? '' : '/') + sFile.slice(0, m.index);
						jQuery.sap.log.info("Component \"" + this.getName() + "\" is loading JS: \"" + sPath + "\"");
						// call internal require variant that accepts a requireJS path
						jQuery.sap._requirePath(sPath);
					}
				}
			}
		}

		// include CSS files
		var aCSSResources = mResources["css"];
		if (aCSSResources) {
			for (var j = 0; j < aCSSResources.length; j++) {
				var oCSSResource = aCSSResources[j];
				if (oCSSResource.uri) {
					var sCssUrl = this._resolveUri(new URI(oCSSResource.uri)).toString();
					jQuery.sap.log.info("Component \"" + this.getName() + "\" is loading CSS: \"" + sCssUrl + "\"");
					jQuery.sap.includeStyleSheet(sCssUrl, oCSSResource.id);
				}
			}
		}

	};

	/**
	 * Load external dependencies (like libraries and components)
	 *
	 * @private
	 */
	ComponentMetadata.prototype._loadDependencies = function() {

		// afterwards we load our dependencies!
		var that = this,
			oDep = this.getDependencies();
		if (oDep) {

			// load the libraries
			var aLibraries = oDep.libs;
			if (aLibraries) {
				for (var i = 0, l = aLibraries.length; i < l; i++) {
					var sLib = aLibraries[i];
					jQuery.sap.log.info("Component \"" + that.getName() + "\" is loading library: \"" + sLib + "\"");
					sap.ui.getCore().loadLibrary(sLib);
				}
			}

			// load the components
			var aComponents = oDep.components;
			if (aComponents) {
				for (var i = 0, l = aComponents.length; i < l; i++) {
					var sName = aComponents[i];
					jQuery.sap.log.info("Component \"" + that.getName() + "\" is loading component: \"" + sName + ".Component\"");
					sap.ui.component.load({
						name: sName
					});
				}
			}

		}

	};

	/**
	 * Converts the legacy metadata into the new manifest format
	 *
	 * @private
	 */
	ComponentMetadata.prototype._convertLegacyMetadata = function(oStaticInfo, oManifest) {

		// this function can be outsourced in future when the ComponentMetadata
		// is not used anymore and the new Application manifest is used -
		// but for now we keep it as it will be one of the common use cases
		// to have the classical ComponentMetadata and this should be
		// transformed into the new manifest structure for compatibility

		// converter for array with string values to object
		var fnCreateObject = function(a, fnCallback) {
			var o = {};
			if (a) {
				for (var i = 0, l = a.length; i < l; i++) {
					var oValue = a[i];
					if (typeof oValue === "string") {
						o[oValue] = typeof fnCallback === "function" && fnCallback(oValue) || {};
					}
				}
			}
			return o;
		};

		// add the old information on component metadata to the manifest info
		var oAppManifest = oManifest["sap.app"];
		var oUI5Manifest = oManifest["sap.ui5"];

		// we do not merge the manifest and the metadata - once a manifest
		// entry exists, the metadata entries will be ignored and the specific
		// metadata entry needs to be migrated into the manifest.
		for (var sName in oStaticInfo) {
			var oValue = oStaticInfo[sName];
			if (oValue !== undefined) {
				switch (sName) {
					case "name":
						oManifest[sName] = oManifest[sName] || oValue;
						oAppManifest["id"] = oAppManifest["id"] || oValue;
						break;
					case "description":
					case "keywords":
						oAppManifest[sName] = oAppManifest[sName] || oValue;
						break;
					case "version":
						var mAppVersion = oAppManifest.applicationVersion = oAppManifest.applicationVersion || {};
						mAppVersion.version = mAppVersion.version || oValue;
						break;
					case "config":
						oUI5Manifest[sName] = oUI5Manifest[sName] || oValue;
						break;
					case "customizing":
						var mExtends = oUI5Manifest["extends"] = oUI5Manifest["extends"] || {};
						mExtends.extensions = mExtends.extensions || oValue;
						break;
					case "dependencies":
						if (!oUI5Manifest[sName]) {
							oUI5Manifest[sName] = {};
							oUI5Manifest[sName].minUI5Version = oValue.ui5version;
							oUI5Manifest[sName].libs = fnCreateObject(oValue.libs);
							oUI5Manifest[sName].components = fnCreateObject(oValue.components);
						}
						break;
					case "includes":
						if (!oUI5Manifest["resources"]) {
							oUI5Manifest["resources"] = {};
							if (oValue && oValue.length > 0) {
								for (var i = 0, l = oValue.length; i < l; i++) {
									var sResource = oValue[i];
									var m = sResource.match(/\.(css|js)$/i);
									if (m) {
										oUI5Manifest["resources"][m[1]] = oUI5Manifest["resources"][m[1]] || [];
										oUI5Manifest["resources"][m[1]].push({
											"uri": sResource
										});
									}
								}
							}
						}
						break;
					case "handleValidation":
						if (oUI5Manifest[sName] === undefined) {
							oUI5Manifest[sName] = oValue;
						}
						break;
					case "models":
						if (!oUI5Manifest["models"]) {
							var oModels = {};
							for (var sModel in oValue) {
								var oDS = oValue[sModel];
								var oModel = {};
								for (var sDSSetting in oDS) {
									var oDSSetting = oDS[sDSSetting];
									switch (sDSSetting) {
										case "type":
										case "uri":
											oModel[sDSSetting] = oDSSetting;
											break;
										default:
											oModel.settings = oModel.settings || {};
											oModel.settings[sDSSetting] = oDSSetting;
									}
								}
								oModels[sModel] = oModel;
							}
							oUI5Manifest["models"] = oModels;
						}
						break;
					// no default
				}
			}
		}

	};

	/**
	 * Resolves the given URI relative to the component.
	 *
	 * @private
	 * @param {URI} oUri URI to resolve
	 * @return {URI} resolved URI
	 * @since 1.29.1
	 */
	ComponentMetadata.prototype._resolveUri = function(oUri) {
		return ComponentMetadata._resolveUriRelativeTo(oUri, new URI(jQuery.sap.getModulePath(this.getComponentName()) + "/"));
	};

	/**
	 * Resolves the given URI relative to the given base URI.
	 *
	 * @private
	 * @param {URI} oUri URI to resolve
	 * @param {URI} oBase base URI
	 * @return {URI} resolved URI
	 * @since 1.29.1
	 */
	ComponentMetadata._resolveUriRelativeTo = function(oUri, oBase) {
		if (oUri.is("absolute") || (oUri.path() && oUri.path()[0] === "/")) {
			return oUri;
		}
		var oPageBase = new URI().search("");
		oBase = oBase.absoluteTo(oPageBase);
		return oUri.absoluteTo(oBase).relativeTo(oPageBase);
	};

	/**
	 * Define the resource roots in the manifest
	 *
	 * <p>
	 * 
	 * TODO: Once enabling manifest first for Components we need to consider
	 *       to move the registration of the resource roots before loading
	 *       the component controller in order to allow to use the resource
	 *       roots configuration for the Component controller dependencies
	 *       (sap.ui.define dependencies).
	 *
	 * @private
	 */
	ComponentMetadata.prototype._defineResourceRoots = function() {

		var oUI5Manifest = this.getManifestEntry("sap.ui5");
		var mResourceRoots = oUI5Manifest["resourceRoots"];

		if (!mResourceRoots) {
			return;
		}

		for (var sResourceRoot in mResourceRoots) {
			var sResourceRootPath = mResourceRoots[sResourceRoot];
			var oResourceRootURI = new URI(sResourceRootPath);
			if (oResourceRootURI.is("absolute") || (oResourceRootURI.path() && oResourceRootURI.path()[0] === "/")) {
				jQuery.sap.log.error("Resource root for \"" + sResourceRoot + "\" is absolute and therefore won't be registered! \"" + sResourceRootPath + "\"", this.getComponentName());
				continue;
			}
			sResourceRootPath = this._resolveUri(oResourceRootURI).toString();
			jQuery.sap.registerModulePath(sResourceRoot, sResourceRootPath);
		}

	};

	return ComponentMetadata;

}, /* bExport= */ true);
