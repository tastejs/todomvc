/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides base class sap.ui.core.Component for all components
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', './ComponentMetadata', './Core', 'sap/ui/thirdparty/URI'],
	function(jQuery, ManagedObject, ComponentMetadata, Core, URI) {
	"use strict";

	/*global Promise */

	/**
	 * Util function which adds SAP-specific search parameters to an URI instance
	 *
	 * @param {object} oUriParams See <code>jQuery.sap.getUriParameters()</code>
	 * @param {URI} oUri URI.js instance
	 * @private
	 */
	function addSapUriParams(oUriParams, oUri) {
		['sap-client', 'sap-server'].forEach(function(sName) {
			var sValue = oUriParams.get(sName);
			if (sValue && !oUri.hasSearch(sName)) {
				oUri.addSearch(sName, sValue);
			}
		});
	}

	/**
	 * Util function which merges/creates a map of property definitions to track
	 * from which "source" a property was defined.
	 *
	 * This function gets used to find out which Component has defined
	 * which "dataSource/model".
	 *
	 * @param {object} mDefinitions Map with definitions to check
	 * @param {object} mDefinitionSource Object to extend with definition - source mapping
	 * @param {object} mSourceData Actual map with definitions
	 * @param {object} oSource Corresponding source object which should be assigened to the definitions-source map
	 * @private
	 */
	function mergeDefinitionSource(mDefinitions, mDefinitionSource, mSourceData, oSource) {
		if (mSourceData) {
			for (var sName in mDefinitions) {
				if (!mDefinitionSource[sName] && mSourceData[sName] && mSourceData[sName].uri) {
					mDefinitionSource[sName] = oSource;
				}
			}
		}
	}

	/**
	 * Creates and initializes a new component with the given <code>sId</code> and
	 * settings.
	 *
	 * The set of allowed entries in the <code>mSettings</code> object depends on
	 * the concrete subclass and is described there. See {@link sap.ui.core.Component}
	 * for a general description of this argument.
	 *
	 * @param {string}
	 *            [sId] optional id for the new control; generated automatically if
	 *            no non-empty id is given Note: this can be omitted, no matter
	 *            whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *            [mSettings] optional map/JSON-object with initial settings for the
	 *            new component instance
	 * @public
	 *
	 * @class Base Class for Component.
	 * @extends sap.ui.base.ManagedObject
	 * @abstract
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.Component
	 * @since 1.9.2
	 */
	var Component = ManagedObject.extend("sap.ui.core.Component", /** @lends sap.ui.core.Component.prototype */

	{
		constructor : function(sId, mSettings) {

			ManagedObject.apply(this, arguments);

		},

		metadata : {
			stereotype : "component",
			"abstract": true,
			specialSettings: {
				/*
				 * Component data
				 */
				componentData: true
			},
			version : "0.0",
			/*enable/disable type validation by MessageManager
			handleValidation: 'boolean'*/
			includes : [],    // css, javascript files that should be used in the component
			dependencies : {  // external dependencies
				libs : [],
				components : [],
				ui5version : ""
			},
			config: {}, // static configuration
			customizing: { // component/view customizing

				/* Example:
				"sap.ui.viewReplacements": {
					"sap.xx.org.Main": {
						viewName: "sap.xx.new.Main",
						type: "XML"
					}
				},
				"sap.ui.viewExtensions": {
					"sap.xx.new.Main": {
						"extensionX": {
							name: "sap.xx.new.Fragment1",
							type: "sap.ui.core.XMLFragment"
						},
						"extensionY": {
							...
						}
					}
				},
				"sap.ui.controllerExtensions": {
					"sap.xx.org.Main": {
						"controllerName": "sap.xx.new.Main",
						"controllerNames": ["sap.xx.new.Sub1", "sap.xx.new.Sub2"]
					}
				},
				"sap.ui.viewModification": {
					"sap.xx.new.Main": {
						"myControlId": {
							text: "{i18n_custom>mytext}"
						}
					}
				}
				*/
			},
			/*
			properties: {
				config : "any"
			},
			*/
			library: "sap.ui.core"
		}

	}, /* Metadata constructor */ ComponentMetadata);

	/**
	 * Returns the metadata for the Component class.
	 *
	 * @return {sap.ui.core.ComponentMetadata} Metadata for the Component class.
	 * @static
	 * @public
	 * @name sap.ui.core.Component.getMetadata
	 * @function
	 */

	/**
	 * Returns the metadata for the specific class of the current instance. 
	 *
	 * @return {sap.ui.core.ComponentMetadata} Metadata for the specific class of the current instance.
	 * @public
	 * @name sap.ui.core.Component#getMetadata
	 * @function
	 */


	/**
	 * Activates the customizing configuration for the given component.
	 * @param {string} sComponentName the name of the component to activate
	 * @private
	 * @deprecated Since 1.21.0 as it is handled by component instantiation
	 */
	Component.activateCustomizing = function(sComponentName) {
		// noop since it will be handled by component instantiation
	};

	/**
	 * Deactivates the customizing configuration for the given component.
	 * @param {string} sComponentName the name of the component to activate
	 * @private
	 * @deprecated Since 1.21.0 as it is handled by component termination
	 */
	Component.deactivateCustomizing = function(sComponentName) {
		// noop since it will be handled by component termination
	};

	// ---- Ownership functionality ------------------------------------------------------------

	//
	// Implementation note: the whole ownership functionality is now part of Component
	//  a) to ensure that only Components are used as owners
	//  b) to keep component related code out of ManagedObject as far as possible
	//
	// Only exception is the _sOwnerId property and its assignment in the ManagedObject
	// constructor, but that doesn't require much knowledge about components

	/**
	 * Returns the Id of the object in whose "context" the given ManagedObject has been created.
	 *
	 * For objects that are not ManagedObjects or for which the owner is unknown,
	 * <code>undefined</code> will be returned as owner Id.
	 *
	 * <strong>Note</strong>: Ownership for objects is only checked by the framework at the time
	 * when they are created. It is not checked or updated afterwards. And it can only be detected
	 * while the {@link sap.ui.core.Component.runAsOwner Component.runAsOwner} function is executing.
	 * Without further action, this is only the case while the content of an UIComponent is
	 * {@link sap.ui.core.UIComponent.createContent constructed} or when a
	 * {@link sap.ui.core.routing.Router Router} creates a new View and its content.
	 *
	 * <strong>Note</string>: This method does not guarantee that the returned owner Id belongs
	 * to a Component. Currently, it always does. But future versions of UI5 might introduce a
	 * more fine grained ownership concept, e.g. taking Views into account. Callers that
	 * want to deal only with components as owners, should use the following method:
	 * {@link sap.ui.core.Component.getOwnerComponentFor Component.getOwnerComponentFor}.
	 * It guarantees that the returned object (if any) will be a Component.
	 *
	 * <strong>Further note</strong> that only the Id of the owner is recorded. In rare cases,
	 * when the lifecycle of a ManagedObject is not bound to the lifecycle of its owner,
	 * (e.g. by the means of aggregations), then the owner might have been destroyed already
	 * whereas the ManagedObject is still alive. So even the existence of an owner Id is
	 * not a guarantee for the existence of the corresponding owner.
	 *
	 * @param {sap.ui.base.ManagedObject} oObject Object to retrieve the owner Id for
	 * @return {string} the Id of the owner or <code>undefined</code>
	 * @static
	 * @public
	 * @since 1.15.1
	 */
	Component.getOwnerIdFor = function(oObject) {
		jQuery.sap.assert(oObject instanceof ManagedObject, "oObject must be given and must be a ManagedObject");
		var sOwnerId = ( oObject instanceof ManagedObject ) && oObject._sOwnerId;
		return sOwnerId || undefined; // no or empty id --> undefined
	};

	/**
	 * Returns the Component instance in whose "context" the given ManagedObject has been created
	 * or <code>undefined</code>.
	 *
	 * This is a convenience wrapper around {@link sap.ui.core.Component.getOwnerIdFor Component.getOwnerIdFor}.
	 * If the owner Id cannot be determined for the reasons document with <code>getOwnerForId</code>
	 * or when the Component for the determined Id no longer exists, <code>undefined</code>
	 * will be returned.
	 *
	 * @param {sap.ui.base.ManagedObject} oObject Object to retrieve the owner Component for
	 * @return {sap.ui.core.Component} the owner Component or <code>undefined</code>.
	 * @static
	 * @public
	 * @since 1.25.1
	 */
	Component.getOwnerComponentFor = function(oObject) {
		var sOwnerId = Component.getOwnerIdFor(oObject);
		return sOwnerId && sap.ui.component(sOwnerId);
	};

	/**
	 * Calls the function <code>fn</code> once and marks all ManagedObjects
	 * created during that call as "owned" by this Component.
	 *
	 * Nested calls of this method are supported (e.g. inside a newly created,
	 * nested component). The currently active owner Component will be remembered
	 * before executing <code>fn</code> and restored afterwards.
	 *
	 * @param {function} fn the function to execute
	 * @return {any} result of function <code>fn</code>
	 * @since 1.25.1
	 * @public
	 * @experimental
	 */
	Component.prototype.runAsOwner = function(fn) {
		jQuery.sap.assert(typeof fn === "function", "fn must be a function");

		var oldOwnerId = ManagedObject._sOwnerId;
		try {
			ManagedObject._sOwnerId = this.getId();
			return fn.call();
		} finally {
			ManagedObject._sOwnerId = oldOwnerId;
		}
	};

	// ---- ----

	/**
	 * @see sap.ui.base.Object#getInterface
	 * @public
	 */
	Component.prototype.getInterface = function() {
		return this;
	};

	/*
	 * initialize the Component and keep the component data
	 */
	Component.prototype._initCompositeSupport = function(mSettings) {

		// registry of models from manifest
		this._mManifestModels = {};

		// register the component instance
		this.getMetadata().onInitComponent();

		// make user specific data available during component instantiation
		this.oComponentData = mSettings && mSettings.componentData;

		// static initialization
		this.getMetadata().init();

		// init the component models
		this.initComponentModels();

		// error handler (if exists)
		if (this.onWindowError) {
			this._fnWindowErrorHandler = jQuery.proxy(function(oEvent) {
				var oError = oEvent.originalEvent;
				this.onWindowError(oError.message, oError.filename, oError.lineno);
			}, this);
			jQuery(window).bind("error", this._fnWindowErrorHandler);
		}


		// before unload handler (if exists)
		if (this.onWindowBeforeUnload) {
			this._fnWindowBeforeUnloadHandler = jQuery.proxy(this.onWindowBeforeUnload, this);
			jQuery(window).bind("beforeunload", this._fnWindowBeforeUnloadHandler);
		}

		// unload handler (if exists)
		if (this.onWindowUnload) {
			this._fnWindowUnloadHandler = jQuery.proxy(this.onWindowUnload, this);
			jQuery(window).bind("unload", this._fnWindowUnloadHandler);
		}

	};

	/*
	 * clean up mock server and event handlers
	 */
	Component.prototype.destroy = function() {

		// destroy all models created via manifest definition
		if (typeof this._mManifestModels === 'object') {
			for (var sModelName in this._mManifestModels) {
				this._mManifestModels[sModelName].destroy();
			}
			this._mManifestModels = null;
		}

		// remove the event handlers
		if (this._fnWindowErrorHandler) {
			jQuery(window).unbind("error", this._fnWindowErrorHandler);
			delete this._fnWindowErrorHandler;
		}
		if (this._fnWindowBeforeUnloadHandler) {
			jQuery(window).unbind("beforeunload", this._fnWindowBeforeUnloadHandler);
			delete this._fnWindowBeforeUnloadHandler;
		}
		if (this._fnWindowUnloadHandler) {
			jQuery(window).unbind("unload", this._fnWindowUnloadHandler);
			delete this._fnWindowUnloadHandler;
		}

		// destroy event bus
		if (this._oEventBus) {
			this._oEventBus.destroy();
			delete this._oEventBus;
		}

		// destroy the object
		ManagedObject.prototype.destroy.apply(this, arguments);

		//unregister for messging
		sap.ui.getCore().getMessageManager().unregisterObject(this);

		// unregister the component instance
		this.getMetadata().onExitComponent();

	};


	/**
	 * Returns user specific data object
	 *
	 * @return {object} componentData
	 * @public
	 * @since 1.15.0
	 */
	Component.prototype.getComponentData = function() {
		return this.oComponentData;
	};


	/**
	 * Returns the event bus of this component.
	 * @return {sap.ui.core.EventBus} the event bus
	 * @since 1.20.0
	 * @public
	 */
	Component.prototype.getEventBus = function() {
		if (!this._oEventBus) {
			jQuery.sap.require("sap.ui.core.EventBus");
			this._oEventBus = new sap.ui.core.EventBus();
		}
		return this._oEventBus;
	};

	/**
	 * Initializes the component models and services.
	 *
	 * @private
	 */
	Component.prototype.initComponentModels = function() {

		// retrieve the merged sap.app and sap.ui5 sections of the manifest
		// to create the models for the component + inherited ones
		var oMetadata = this.getMetadata();
		var oAppManifest = oMetadata.getManifestEntry("sap.app", true);
		var oUI5Manifest = oMetadata.getManifestEntry("sap.ui5", true);

		var mConfig = {

			// ui5 model definitions
			models: oUI5Manifest["models"],

			// optional dataSources from "sap.app" manifest
			dataSources: oAppManifest["dataSources"] || {},

			// to identify where the dataSources/models have been orginally defined
			origin: {
				dataSources: {},
				models: {}
			}

		};

		if (!mConfig.models) {
			// skipping model creation because of missing sap.ui5 models manifest entry
			return;
		}

		var oMeta = oMetadata;
		while (oMeta && oMeta instanceof ComponentMetadata) {

			var mCurrentDataSources = oMeta.getManifestEntry("sap.app")["dataSources"];
			mergeDefinitionSource(mConfig.dataSources, mConfig.origin.dataSources, mCurrentDataSources, oMeta);

			var mCurrentModelConfigs = oMeta.getManifestEntry("sap.ui5")["models"];
			mergeDefinitionSource(mConfig.models, mConfig.origin.models, mCurrentModelConfigs, oMeta);

			oMeta = oMeta.getParent();
		}

		// read current URI params to mix them into model URI
		var oUriParams = jQuery.sap.getUriParameters();

		// create a model for each ["sap.ui5"]["models"] entry
		for (var sModelName in mConfig.models) {

			var oModelConfig = mConfig.models[sModelName];
			var bIsDataSourceUri = false;

			// normalize dataSource shorthand, e.g.
			// "myModel": "myDataSource" => "myModel": { dataSource: "myDataSource" }
			if (typeof oModelConfig === 'string') {
				oModelConfig = {
					dataSource: oModelConfig
				};
			}

			// check for referenced dataSource entry and read out settings/uri/type
			// if not already provided in model config
			if (oModelConfig.dataSource) {

				var oDataSource = mConfig.dataSources && mConfig.dataSources[oModelConfig.dataSource];
				if (typeof oDataSource === 'object') {

					// default type is OData
					if (oDataSource.type === undefined) {
						oDataSource.type = 'OData';
					}

					// read out type and translate to model class
					// (only if no model type was set to allow overriding)
					if (!oModelConfig.type) {
						switch (oDataSource.type) {
							case 'OData':
								oModelConfig.type = 'sap.ui.model.odata.v2.ODataModel';
								break;
							case 'JSON':
								oModelConfig.type = 'sap.ui.model.json.JSONModel';
								break;
							case 'XML':
								oModelConfig.type = 'sap.ui.model.xml.XMLModel';
								break;
							default:
								// for custom dataSource types, the class should already be specified in the sap.ui5 models config
						}
					}

					// use dataSource uri if it isn't already defined in model config
					if (!oModelConfig.uri) {
						oModelConfig.uri = oDataSource.uri;
						bIsDataSourceUri = true;
					}

					// read out OData annotations and create ODataModel settings for it
					if (oDataSource.type === 'OData' && oDataSource.settings && oDataSource.settings.annotations) {
						var aAnnotations = oDataSource.settings.annotations;

						for (var i = 0; i < aAnnotations.length; i++) {
							var oAnnotation = mConfig.dataSources[aAnnotations[i]];

							// dataSource entry should be defined!
							if (!oAnnotation) {
								jQuery.sap.log.error("Component Manifest: ODataAnnotation \"" + aAnnotations[i] + "\" for dataSource \"" + oModelConfig.dataSource + "\" could not be found in manifest", "[\"sap.app\"][\"dataSources\"][\"" + aAnnotations[i] + "\"]", this);
								continue;
							}

							// type should be ODataAnnotation!
							if (oAnnotation.type !== 'ODataAnnotation') {
								jQuery.sap.log.error("Component Manifest: dataSource \"" + aAnnotations[i] + "\" was expected to have type \"ODataAnnotation\" but was \"" + oAnnotation.type + "\"", "[\"sap.app\"][\"dataSources\"][\"" + aAnnotations[i] + "\"]", this);
								continue;
							}

							// uri is required!
							if (!oAnnotation.uri) {
								jQuery.sap.log.error("Component Manifest: Missing \"uri\" for ODataAnnotation \"" + aAnnotations[i] + "\"", "[\"sap.app\"][\"dataSources\"][\"" + aAnnotations[i] + "\"]", this);
								continue;
							}

							// resolve relative to component
							var oAnnotationUri = mConfig.origin.dataSources[aAnnotations[i]]._resolveUri(new URI(oAnnotation.uri)).toString();

							// add uri to annotationURI array in settings (this parameter applies for ODataModel v1 & v2)
							oModelConfig.settings = oModelConfig.settings || {};
							oModelConfig.settings.annotationURI = oModelConfig.settings.annotationURI || [];
							oModelConfig.settings.annotationURI.push(oAnnotationUri);
						}
					}

				} else {
					jQuery.sap.log.error("Component Manifest: dataSource \"" + oModelConfig.dataSource + "\" for model \"" + sModelName + "\" not found or invalid", "[\"sap.app\"][\"dataSources\"][\"" + oModelConfig.dataSource + "\"]", this);
				}
			}

			// model type is required!
			if (!oModelConfig.type) {
				jQuery.sap.log.error("Component Manifest: Missing \"type\" for model \"" + sModelName + "\"", "[\"sap.ui5\"][\"models\"][\"" + sModelName + "\"]", this);
				continue;
			}

			// load model class and log error message if it couldn't be loaded.
			// error gets catched to continue creating the other models and not breaking the execution here
			try {
				jQuery.sap.require(oModelConfig.type);
			} catch (oError) {
				jQuery.sap.log.error("Component Manifest: Class \"" + oModelConfig.type + "\" for model \"" + sModelName + "\" could not be loaded. " + oError, "[\"sap.ui5\"][\"models\"][\"" + sModelName + "\"]", this);
				continue;
			}

			// get model class object
			var ModelClass = jQuery.sap.getObject(oModelConfig.type);
			if (!ModelClass) {
				// this could be the case if the required module doesn't register itself in the defined namespace
				jQuery.sap.log.error("Component Manifest: Class \"" + oModelConfig.type + "\" for model \"" + sModelName + "\" could not be found", "[\"sap.ui5\"][\"models\"][\"" + sModelName + "\"]", this);
				continue;
			}

			// set mode of old ODataModel to "json" (default is xml).
			// as the automatic model creation is a new feature, this is not incompatible here
			if (oModelConfig.type === 'sap.ui.model.odata.ODataModel' &&
					(!oModelConfig.settings || oModelConfig.settings.json === undefined)) {
					// do not overwrite the flag if it was explicitly defined!

					oModelConfig.settings = oModelConfig.settings || {};
					oModelConfig.settings.json = true;
			}

			// adopt model uri
			if (oModelConfig.uri) {

				// parse model URI to be able to modify it
				var oUri = new URI(oModelConfig.uri);

				// resolve URI relative to component which defined it
				var oUriSourceComponent = (bIsDataSourceUri) ? mConfig.origin.dataSources[oModelConfig.dataSource] : mConfig.origin.models[sModelName];
				oUri = oUriSourceComponent._resolveUri(oUri);

				// inherit sap-specific parameters from document (only if "sap.app/dataSources" reference is defined)
				if (oModelConfig.dataSource) {
					addSapUriParams(oUriParams, oUri);
				}

				oModelConfig.uri = oUri.toString();
			}

			// set model specific "uri" property names which should be used to map "uri" to model specific constructor
			// (only if it wasn't specified before)
			if (oModelConfig.uriSettingName === undefined) {
				switch (oModelConfig.type) {
					case 'sap.ui.model.odata.ODataModel':
					case 'sap.ui.model.odata.v2.ODataModel':
						oModelConfig.uriSettingName = 'serviceUrl';
						break;
					case 'sap.ui.model.resource.ResourceModel':
						oModelConfig.uriSettingName = 'bundleUrl';
						break;
					default:
						// default 'undefined' is already set in this case
				}
			}
			
			// Origin: if sap-system paramter is given -> add this alias to the service url(s) of ODataModels
			var oComponentData = this.getComponentData();
			var sSystemParameter = oComponentData && oComponentData.startupParameters && oComponentData.startupParameters["sap-system"];
			// Check the URL as "fallback", the system parameter of the componentData.startup has precedence over a URL parameter
			if (!sSystemParameter) {
				sSystemParameter = oUriParams.get("sap-system");
			}
			
			// lazy load the ODataUtils if systemParameter is given
			var bAddOrigin = false;
			var ODataUtils;
			if (sSystemParameter && jQuery.inArray(oModelConfig.type, ["sap.ui.model.odata.ODataModel", "sap.ui.model.odata.v2.ODataModel"]) != -1) {
				bAddOrigin = true;
				jQuery.sap.require("sap.ui.model.odata.ODataUtils");
				ODataUtils = sap.ui.require("sap/ui/model/odata/ODataUtils");
			}
			
			// include "uri" property in "settings" object, depending on "uriSettingName"
			if (oModelConfig.uri) {
				
				if (bAddOrigin) {
					// Origin segment: pre- and postOriginBaseUris do not include uri params, they will be used for annotation uri adaption
					oModelConfig.preOriginBaseUri = oModelConfig.uri.split("?")[0];
					oModelConfig.uri = ODataUtils.setOrigin(oModelConfig.uri, {
						alias: sSystemParameter
					});
					oModelConfig.postOriginBaseUri = oModelConfig.uri.split("?")[0];
				}
				
				if (oModelConfig.uriSettingName !== undefined) {
					oModelConfig.settings = oModelConfig.settings || {};

					// do not override the property if it's already defined!
					if (!oModelConfig.settings[oModelConfig.uriSettingName]) {
						oModelConfig.settings[oModelConfig.uriSettingName] = oModelConfig.uri;
					}

				} else if (oModelConfig.settings) {
					// shift settings to 2nd argument if no "uriSettingName" was specified
					oModelConfig.settings = [ oModelConfig.uri, oModelConfig.settings ];
				} else {
					// only use 1st argument with "uri" string if there are no settings
					oModelConfig.settings = [ oModelConfig.uri ];
				}
			} else {
				// Origin segment: check if the uri is given via the respective settingsName, e.g. "serviceURL"
				if (bAddOrigin && oModelConfig.uriSettingName !== undefined && oModelConfig.settings && oModelConfig.settings[oModelConfig.uriSettingName]) {
					oModelConfig.preOriginBaseUri = oModelConfig.settings[oModelConfig.uriSettingName].split("?")[0];
					oModelConfig.settings[oModelConfig.uriSettingName] = ODataUtils.setOrigin(oModelConfig.settings[oModelConfig.uriSettingName], {
						alias: sSystemParameter
					});
					oModelConfig.postOriginUri = oModelConfig.settings[oModelConfig.uriSettingName].split("?")[0];
				}
			}
			
			// Origin segment: Adapt annotation uris here, based on the base part of the service uri.
			// Replaces the base uri prefix with the one after adding the origin
			if (bAddOrigin && oModelConfig.settings && oModelConfig.settings.annotationURI) {
				var aAnnotationUris = [].concat(oModelConfig.settings.annotationURI); //"to array"
				var aOriginAnnotations = [];
				for (var i = 0; i < aAnnotationUris.length; i++) {
					aOriginAnnotations.push(aAnnotationUris[i].replace(oModelConfig.preOriginBaseUri, oModelConfig.postOriginBaseUri.split("?")[0]));
				}
				oModelConfig.settings.annotationURI = aOriginAnnotations;
			}
			
			// normalize settings object to array
			if (oModelConfig.settings && !jQuery.isArray(oModelConfig.settings)) {
				oModelConfig.settings = [ oModelConfig.settings ];
			}
			
			// create arguments array with leading "null" value so that it can be passed to the apply function
			var aArgs = [null].concat(oModelConfig.settings || []);

			// create factory function by calling "Model.bind" with the provided arguments
			var Factory = ModelClass.bind.apply(ModelClass, aArgs);

			// the factory will create the model with the arguments above
			var oModel = new Factory();

			// keep the model instance to be able to destroy the created models on component destroy
			this._mManifestModels[sModelName] = oModel;

			// apply the model to the component with provided name ("" as key means unnamed model)
			this.setModel(oModel, sModelName || undefined);
		}

	};


	/**
	 * Initializes the Component instance after creation.
	 *
	 * Applications must not call this hook method directly, it is called by the
	 * framework while the constructor of an Component is executed.
	 *
	 * Subclasses of Component should override this hook to implement any necessary
	 * initialization.
	 *
	 * @function
	 * @name sap.ui.core.Component.prototype.init
	 * @protected
	 */
	//sap.ui.core.Component.prototype.init = function() {};

	/**
	 * Cleans up the component instance before destruction.
	 *
	 * Applications must not call this hook method directly, it is called by the
	 * framework when the element is {@link #destroy destroyed}.
	 *
	 * Subclasses of Component should override this hook to implement any necessary
	 * cleanup.
	 *
	 * @function
	 * @name sap.ui.core.Component.prototype.exit
	 * @protected
	 */
	//sap.ui.core.Component.prototype.exit = function() {};


	/**
	 * The window before unload hook. Override this method in your Component class
	 * implementation, to handle cleanup before the real unload or to prompt a question
	 * to the user, if the component should be exited.
	 *
	 * @return {string} return a string if a prompt should be displayed to the user
	 *                  confirming closing the component (e.g. when the component is not yet saved).
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onWindowBeforeUnload
	 * @function
	 */
	//onWindowBeforeUnload : function() {},


	/**
	 * The window unload hook. Override this method in your Component class
	 * implementation, to handle cleanup of the component once the window
	 * will be unloaded (e.g. closed).
	 *
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onWindowUnload
	 * @function
	 */
	//onWindowUnload : function() {},


	/**
	 * The window error hook. Override this method in your Component class implementation
	 * to listen to unhandled errors.
	 *
	 * @param {string} sMessage The error message.
	 * @param {string} sFile The file where the error occurred
	 * @param {number} iLine The line number of the error
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onError
	 * @function
	 */
	//onWindowError : null, // function(sMessage, sFile, iLine) - function not added directly as it might result in bad stack traces in older browsers


	/**
	 * The hook which gets called when the static configuration of the component
	 * has been changed by some configuration extension.
	 *
	 * @param {string} sConfigKey The error message.
	 * @public
	 * @since 1.15.1
	 * @name sap.ui.core.Component.prototype.onConfigChange
	 * @function
	 */
	//onConfigChange : null, // function(sConfigKey)


	/**
	 * Creates a new instance of a <code>Component</code> or returns the instance
	 * of an existing <code>Component</code>.
	 *
	 * If you want to lookup all an existing <code>Component</code> you can call
	 * this function with a component Id as parameter:
	 * <pre>
	 *   var oComponent = sap.ui.component(sComponentId);
	 * </pre>
	 *
	 * To create a new instance of a component you pass a component configuration
	 * object into this function:
	 * <pre>
	 *   var oComponent = sap.ui.component({
	 *     name: "my.Component",
	 *     url: "my/component/location",
	 *     id: "myCompId1"
	 *   });
	 * </pre>
	 *
	 * @param {string|object} vConfig the id of an existing Component or the configuration object to create the Component
	 * @param {string} vConfig.name the name of the Component to load
	 * @param {string} [vConfig.url] an alternate location from where to load the Component
	 * @param {object} [vConfig.componentData] initial data of the Component (@see sap.ui.core.Component#getComponentData)
	 * @param {string} [vConfig.id] the sId of the new Component
	 * @param {object} [vConfig.settings] the mSettings of the new Component
	 * @param {boolean} [vConfig.async=false] whether the component creation should be done asynchronously (experimental setting)
	 * @param {object} [vConfig.asyncHints] hints for the asynchronous loading (experimental setting)
	 * @param {string[]} [vConfig.asyncHints.libs] libraries that should be (pre-)loaded before the component (experimental setting)
	 * @param {string[]} [vConfig.asyncHints.components] components that should be (pre-)loaded before the component (experimental setting)
	 * @return {sap.ui.core.Component|Promise} the Component instance or a Promise in case of asynchronous loading
	 *
	 * @public
	 * @static
	 * @since 1.15.0
	 * @experimental Since 1.27.0. Support for asynchronous loading and the corresponding hints is still experimental
	 *   and might be modified or removed completely again. It must not be used in productive code, except in code
	 *   delivered by the UI5 teams. The synchronous usage of the API is not experimental and can be used without
	 *   restrictions.
	 */
	sap.ui.component = function(vConfig) {

		// a parameter must be given!
		if (!vConfig) {
			throw new Error("sap.ui.component cannot be called without parameter!");
		}

		// when only a string is given then this function behaves like a
		// getter and returns an existing component instance
		if (typeof vConfig === 'string') {

			// lookup and return the component
			return sap.ui.getCore().getComponent(vConfig);

		}

		function createInstance(oClass) {

			// retrieve the required properties
			var sName = vConfig.name,
				sId = vConfig.id,
				oComponentData = vConfig.componentData,
				sController = sName + '.Component',
				mSettings = vConfig.settings;

			// create an instance
			var oInstance = new oClass(jQuery.extend({}, mSettings, {
				id: sId,
				componentData: oComponentData
			}));
			jQuery.sap.assert(oInstance instanceof Component, "The specified component \"" + sController + "\" must be an instance of sap.ui.core.Component!");
			jQuery.sap.log.info("Component instance Id = " + oInstance.getId());

			/*register for messging: register if either handleValidation is set in metadata or if not set in metadata and
			 * set on instance
			 */
			var bHandleValidation = oInstance.getMetadata().handleValidation() !== undefined || vConfig.handleValidation;
			if (bHandleValidation) {
				//calc handleValidation for registration
				if (oInstance.getMetadata().handleValidation() !== undefined) {
					bHandleValidation = oInstance.getMetadata().handleValidation();
				} else {
					bHandleValidation = vConfig.handleValidation;
				}
				sap.ui.getCore().getMessageManager().registerObject(oInstance, bHandleValidation);
			}

			return oInstance;
		}

		// load the component class
		var vClassOrPromise = sap.ui.component.load(vConfig, true);
		if ( vConfig.async ) {
			// async: instantiate component after Promise has been fulfilled with component constructor
			return vClassOrPromise.then(createInstance);
		} else {
			// sync: constructor has been returned, instantiate component immediately
			return createInstance(vClassOrPromise);
		}
	};

	/**
	 * Load a component without instantiating it.
	 *
	 * Provides experimental support for loading components asynchronously by setting
	 * <code>oConfig.async</code> to true. In that case, the method returns a Javascript 6
	 * Promise that will be fulfilled with the component class after loading.
	 *
	 * Using <code>async = true</code> doesn't necessarily mean that no more synchronous loading
	 * occurs. Both the framework as well as component implementations might still execute
	 * synchronous requests. The contract for <code>async = true</code> just allows to use
	 * async calls.
	 *
	 * When asynchronous loading is used, additional <code>hints</code> can be provided :
	 * <ul>
	 * <li><code>oConfig.asyncHints.components : string[]</code>a list of components needed by the current component and its subcomponents
	 *     The framework will try to preload these components (their Component-preload.js) asynchronously, errors will be ignored.
	 *     Please note that the framework has no knowledge about whether a component provides a preload file or whether it is bundled
	 *     in some library preload. If components are listed in the hints section, they will be preloaded.</li>
	 * <li><code>oConfig.asyncHints.libs : string[]</code>libraries needed by the component and its subcomponents.
	 *     The framework will asynchronously load those libraries, if they're not loaded yet.</li>
	 * <li><code>oConfig.asyncHints.preloadBundles : string[]</code>a list of additional preload bundles
	 *     The framework will try to load these bundles asynchronously before requiring the component, errors will be ignored.
	 *     The named modules must only represent preload bundles. If they are normal modules, their dependencies
	 *     will be loaded with the normal synchronous request mechanism and performance might degrade.</li>
	 * <li><code>oConfig.asyncHints.preloadOnly : boolean (default: false)</code> whether only the preloads should be done,
	 *     but not the loading of the Component controller class itself.
	 * </ul>
	 *
	 * If components and/or libraries are listed in the hints section, all the corresponding preload files will
	 * be requested in parallel. The constructor class will only be required after all of them are rejected or resolved.
	 *
	 * Note: so far, only the requests for the preload files (library and/or component) are executed asynchronously.
	 * If a preload is deactivated by configuration (e.g. debug mode), then requests won't be asynchronous.
	 *
	 * @param {object} oConfig a configuration object describing the component to be loaded. See {@link sap.ui.component} for more Information.
	 * @return {function|Promise} the constructor of the component class or a Promise that will be fulfilled with the same
	 *
	 * @since 1.16.3
	 * @static
	 * @public
	 * @experimental Since 1.27.0. Support for asynchronous loading and the corresponding hints is still experimental
	 *   and might be modified or removed completely again. It must not be used in productive code, except in code
	 *   delivered by the UI5 teams. The synchronous usage of the API is not experimental and can be used without
	 *   restrictions.
	 */
	sap.ui.component.load = function(oConfig, bFailOnError) {

		var sName = oConfig.name,
			sUrl = oConfig.url,
			bComponentPreload = /^(sync|async)$/.test(sap.ui.getCore().getConfiguration().getComponentPreload());

		// check for an existing name
		if (!sName) {
			throw new Error("The name of the component is undefined.");
		}

		// check the type of the name
		jQuery.sap.assert(typeof sName === 'string', "sName must be a string");

		// if a URL is given we register this URL for the name of the component:
		// the name is the package in which the component is located (dot separated)
		if (sUrl) {
			jQuery.sap.registerModulePath(sName, sUrl);
		}

		function getControllerClass() {

			var sController = sName + '.Component';

			// require the component controller
			jQuery.sap.require(sController);
			var oClass = jQuery.sap.getObject(sController);

			if (!oClass) {
				var sMsg = "The specified component controller '" + sController + "' could not be found!";
				if (bFailOnError) {
					throw new Error(sMsg);
				} else {
					jQuery.sap.log.warning(sMsg);
				}
			}

			return oClass;
		}

		function registerPath(vObj) {

			jQuery.sap.assert(
				(typeof vObj === 'string' && vObj) ||
				(typeof vObj === 'object' && typeof vObj.name === 'string' && vObj.name),
				"reference either must be a non-empty string or an object with a non-empty 'name' and an optional 'url' property");

			if ( typeof vObj === 'object' ) {
				if ( vObj.url ) {
					jQuery.sap.registerModulePath(vObj.name, vObj.url);
				}
				return vObj.name;
			}

			return vObj;
		}

		function preload(sComponentName, bAsync) {

			var sController = sComponentName + '.Component',
				sPreloadName;

			// only load the Component-preload file if the Component module is not yet available
			if ( bComponentPreload && !jQuery.sap.isDeclared(sController, /* bIncludePreloaded=*/ true) ) {

				if ( bAsync ) {
					sPreloadName = jQuery.sap.getResourceName(sController, '-preload.js'); // URN
					return jQuery.sap._loadJSResourceAsync(sPreloadName, true);
				}

				try {
					sPreloadName = sController + '-preload'; // Module name
					jQuery.sap.require(sPreloadName);
				} catch (e) {
					jQuery.sap.log.warning("couldn't preload component from " + sPreloadName + ": " + ((e && e.message) || e));
				}
			}
		}

		if ( oConfig.async ) {

			// trigger loading of libraries and component preloads and collect the given promises
			var hints = oConfig.asyncHints || {},
				promises = [],
				collect = function(oPromise) {
					if ( oPromise ) {
						promises.push(oPromise);
					}
				};

			// load any required preload bundles
			if ( hints.preloadBundles ) {
				jQuery.each(hints.preloadBundles, function(i, vBundle) {
					collect(jQuery.sap._loadJSResourceAsync(registerPath(vBundle), true));
				});
			}

			// preload required libraries
			if ( hints.libs ) {
				collect(sap.ui.getCore().loadLibraries( hints.libs.map(registerPath) ));
			}

			// preload the component itself
			collect(preload(sName, true));

			// if a hint about "used" components is given, preload those components
			if ( hints.components ) {
				jQuery.each(hints.components, function(i, vComp) {
					collect(preload(registerPath(vComp), true));
				});
			}

			// combine given promises
			return Promise.all(promises).then(function(v) {
				jQuery.sap.log.debug("Component.load: all promises fulfilled, then " + v);
				return hints.preloadOnly ? true : getControllerClass();
			});

		}

		preload(sName);
		return getControllerClass();
	};

	return Component;

});
