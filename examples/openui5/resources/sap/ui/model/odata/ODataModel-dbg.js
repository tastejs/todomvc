/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * OData-based DataBinding
 *
 * @namespace
 * @name sap.ui.model.odata
 * @public
 */

// Provides class sap.ui.model.odata.ODataModel
sap.ui.define(['jquery.sap.global', 'sap/ui/model/Model', './ODataUtils', './CountMode', './ODataContextBinding', './ODataListBinding', './ODataMetadata', './ODataPropertyBinding', './ODataTreeBinding', 'sap/ui/model/odata/ODataMetaModel', 'sap/ui/thirdparty/URI', 'sap/ui/thirdparty/datajs'],
	function(jQuery, Model, ODataUtils, CountMode, ODataContextBinding, ODataListBinding, ODataMetadata, ODataPropertyBinding, ODataTreeBinding, ODataMetaModel, URI, OData) {
	"use strict";


	/**
	 * Constructor for a new ODataModel.
	 *
	 * @param {string} [sServiceUrl] base uri of the service to request data from; additional URL parameters appended here will be appended to every request
	 * 								can be passed with the mParameters object as well: [mParameters.serviceUrl] A serviceURl is required!
	 * @param {object} [mParameters] (optional) a map which contains the following parameter properties:
	 * @param {boolean} [mParameters.json] if set true request payloads will be JSON, XML for false (default = false),
	 * @param {string} [mParameters.user] user for the service,
	 * @param {string} [mParameters.password] password for service,
	 * @param {map} [mParameters.headers] a map of custom headers like {"myHeader":"myHeaderValue",...},
	 * @param {boolean} [mParameters.tokenHandling] enable/disable XCSRF-Token handling (default = true),
	 * @param {boolean} [mParameters.withCredentials] experimental - true when user credentials are to be included in a cross-origin request. Please note that this works only if all requests are asynchronous.
	 * @param {object} [mParameters.loadMetadataAsync] (optional) determined if the service metadata request is sent synchronous or asynchronous. Default is false.
	 * @param [mParameters.maxDataServiceVersion] (default = '2.0') please use the following string format e.g. '2.0' or '3.0'.
	 * 									OData version supported by the ODataModel: '2.0',
	 * @param {boolean} [mParameters.useBatch] when true all requests will be sent in batch requests (default = false),
	 * @param {boolean} [mParameters.refreshAfterChange] enable/disable automatic refresh after change operations: default = true,
	 * @param  {string|string[]} [mParameters.annotationURI] The URL (or an array of URLs) from which the annotation metadata should be loaded,
	 * @param {boolean} [mParameters.loadAnnotationsJoined] Whether or not to fire the metadataLoaded-event only after annotations have been loaded as well,
	 * @param {map} [mParameters.serviceUrlParams] map of URL parameters - these parameters will be attached to all requests,
	 * @param {map} [mParameters.metadataUrlParams] map of URL parameters for metadata requests - only attached to $metadata request.
	 * @param {string} [mParameters.defaultCountMode] sets the default count mode for the model. If not set, sap.ui.model.odata.CountMode.Both is used.
	 * @param {map} [mParameters.metadataNamespaces] a map of namespaces (name => URI) used for parsing the service metadata.
	 * @param {boolean} [mParameters.skipMetadataAnnotationParsing] Whether to skip the automated loading of annotations from the metadata document. Loading annotations from metadata does not have any effects (except the lost performance by invoking the parser) if there are not annotations inside the metadata document
	 *
	 * @class
	 * Model implementation for oData format
	 * Binding to V4 metadata annotations is experimental!
	 *
	 * @extends sap.ui.model.Model
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.model.odata.ODataModel
	 */
	var ODataModel = Model.extend("sap.ui.model.odata.ODataModel", /** @lends sap.ui.model.odata.ODataModel.prototype */ {

		constructor : function(sServiceUrl, bJSON, sUser, sPassword, mHeaders, bTokenHandling, bWithCredentials, bLoadMetadataAsync) {
			Model.apply(this, arguments);

			var bUseBatch,
				bRefreshAfterChange,
				sMaxDataServiceVersion,
				sAnnotationURI = null,
				bLoadAnnotationsJoined,
				mMetadataNamespaces,
				sDefaultCountMode,
				mServiceUrlParams,
				mMetadataUrlParams,
				bSkipMetadataAnnotationParsing,
				that = this;

			if (typeof (sServiceUrl) === "object") {
				bJSON = sServiceUrl;
				sServiceUrl = bJSON.serviceUrl;
			}

			if (typeof bJSON === "object") {
				sUser = bJSON.user;
				sPassword = bJSON.password;
				mHeaders = bJSON.headers;
				bTokenHandling = bJSON.tokenHandling;
				bLoadMetadataAsync = bJSON.loadMetadataAsync;
				bWithCredentials = bJSON.withCredentials;
				sMaxDataServiceVersion = bJSON.maxDataServiceVersion;
				bUseBatch = bJSON.useBatch;
				bRefreshAfterChange = bJSON.refreshAfterChange;
				sAnnotationURI = bJSON.annotationURI;
				bLoadAnnotationsJoined = bJSON.loadAnnotationsJoined;
				sDefaultCountMode = bJSON.defaultCountMode;
				mMetadataNamespaces = bJSON.metadataNamespaces;
				mServiceUrlParams = bJSON.serviceUrlParams;
				mMetadataUrlParams = bJSON.metadataUrlParams;
				bSkipMetadataAnnotationParsing = bJSON.skipMetadataAnnotationParsing;
				bJSON = bJSON.json;
			}

			this.oServiceData = {};
			this.sDefaultBindingMode = sap.ui.model.BindingMode.OneWay;
			this.mSupportedBindingModes = {"OneWay": true, "OneTime": true, "TwoWay":true};
			this.bCountSupported = true;
			this.bJSON = bJSON;
			this.bCache = true;
			this.aPendingRequestHandles = [];
			this.oRequestQueue = {};
			this.aBatchOperations = [];
			this.oHandler;
			this.bTokenHandling = bTokenHandling !== false;
			this.bWithCredentials = bWithCredentials === true;
			this.bUseBatch = bUseBatch === true;
			this.bRefreshAfterChange = bRefreshAfterChange !== false;
			this.sMaxDataServiceVersion = sMaxDataServiceVersion;
			this.bLoadMetadataAsync = !!bLoadMetadataAsync;
			this.bLoadAnnotationsJoined = bLoadAnnotationsJoined === undefined ? true : bLoadAnnotationsJoined;
			this.sAnnotationURI = sAnnotationURI;
			this.sDefaultCountMode = sDefaultCountMode || CountMode.Both;
			this.oMetadataLoadEvent = null;
			this.oMetadataFailedEvent = null;
			this.bSkipMetadataAnnotationParsing = bSkipMetadataAnnotationParsing;
			

			// prepare variables for request headers, data and metadata
			this.oHeaders = {};
			this.setHeaders(mHeaders);
			this.oData = {};
			this.oMetadata = null;
			this.oAnnotations = null;
			this.aUrlParams = [];

			// determine the service base url and the url parameters
			if (sServiceUrl.indexOf("?") == -1) {
				this.sServiceUrl = sServiceUrl;
			} else {
				var aUrlParts = sServiceUrl.split("?");
				this.sServiceUrl = aUrlParts[0];
				if (aUrlParts[1]) {
					this.aUrlParams.push(aUrlParts[1]);
				}
			}

			if (sap.ui.getCore().getConfiguration().getStatistics()) {
				// add statistics parameter to every request (supported only on Gateway servers)
				this.aUrlParams.push("sap-statistics=true");
			}

			// Remove trailing slash (if any)
			this.sServiceUrl = this.sServiceUrl.replace(/\/$/, "");

			// Get/create service specific data container or create one if it doesn't exist
			var sMetadataUrl = this._createRequestUrl("$metadata", undefined, mMetadataUrlParams);
			if (!ODataModel.mServiceData[sMetadataUrl]) {
				ODataModel.mServiceData[sMetadataUrl] = {};
			}
			this.oServiceData = ODataModel.mServiceData[sMetadataUrl];


			// Get CSRF token, if already available
			if (this.bTokenHandling && this.oServiceData.securityToken) {
				this.oHeaders["x-csrf-token"] = this.oServiceData.securityToken;
			}

			// store user and password
			this.sUser = sUser;
			this.sPassword = sPassword;

			this.oHeaders["Accept-Language"] = sap.ui.getCore().getConfiguration().getLanguage();

			if (!this.oServiceData.oMetadata) {
				//create Metadata object
				this.oServiceData.oMetadata = new sap.ui.model.odata.ODataMetadata(sMetadataUrl, { 
					async: this.bLoadMetadataAsync,
					user: this.sUser,
					password: this.sPassword,
					headers: this.mCustomHeaders,
					namespaces: mMetadataNamespaces,
					withCredentials: this.bWithCredentials
				});
			}
			this.oMetadata = this.oServiceData.oMetadata;
			
			this.pAnnotationsLoaded = this.oMetadata.loaded();
			
			if (this.sAnnotationURI || !this.bSkipMetadataAnnotationParsing) {
				// Make sure the annotation parser object is already created and can be used by the MetaModel
				var oAnnotations = this._getAnnotationParser();
				
				if (!this.bSkipMetadataAnnotationParsing) {
					if (!this.bLoadMetadataAsync) {
						//Synchronous metadata load --> metadata should already be available, try to stay synchronous
						// Don't fire additional events for automatic metadata annotations parsing, but if no annotation URL exists, fire the event
						this.addAnnotationXML(this.oMetadata.sMetadataBody, !!this.sAnnotationURI);
					} else {
						this.pAnnotationsLoaded = this.oMetadata.loaded().then(function(bSuppressEvents, mParams) {
							//Don't fire additional events for automatic metadata annotations parsing, but if no annotation URL exists, fire the event
							if (this.bDestroyed) {
								return Promise.reject();
							}
							return this.addAnnotationXML(mParams["metadataString"], bSuppressEvents);
						}.bind(this, !!this.sAnnotationURI));
					}
				}
				
				if (this.sAnnotationURI) {
					if (this.bLoadMetadataAsync) {
						this.pAnnotationsLoaded = this.pAnnotationsLoaded
							.then(oAnnotations.addUrl.bind(oAnnotations, this.sAnnotationURI));
					} else {
						this.pAnnotationsLoaded = Promise.all([
							this.pAnnotationsLoaded,
							oAnnotations.addUrl(this.sAnnotationURI)
						]);
					}
				}
			}

			if (mServiceUrlParams) {
				// new URL params used -> add to ones from sServiceUrl
				// do this after the Metadata request is created to not put the serviceUrlParams on this one
				this.aUrlParams = this.aUrlParams.concat(ODataUtils._createUrlParamsArray(mServiceUrlParams));
			}

			
			this.onMetadataLoaded = function(oEvent){
				that._initializeMetadata();
				that.initialize();
			};
			this.onMetadataFailed = function(oEvent) {
				that.fireMetadataFailed(oEvent.getParameters());
			};
			
			if (!this.oMetadata.isLoaded()) {
				this.oMetadata.attachLoaded(this.onMetadataLoaded);
				this.oMetadata.attachFailed(this.onMetadataFailed);
			}
			if (this.oMetadata.isFailed()){
				this.refreshMetadata();
			}
			if (this.oMetadata.isLoaded()) {
				this._initializeMetadata(true);
			}


			// set the header for the accepted content types
			if (this.bJSON) {
				if (this.sMaxDataServiceVersion === "3.0") {
					this.oHeaders["Accept"] = "application/json;odata=fullmetadata";
				} else {
					this.oHeaders["Accept"] = "application/json";
				}
				this.oHandler = OData.jsonHandler;
			} else {
				this.oHeaders["Accept"] = "application/atom+xml,application/atomsvc+xml,application/xml";
				this.oHandler = OData.atomHandler;
			}


			// the max version number the client can accept in a response
			this.oHeaders["MaxDataServiceVersion"] = "2.0";
			if (this.sMaxDataServiceVersion) {
				this.oHeaders["MaxDataServiceVersion"] = this.sMaxDataServiceVersion;
			}

			// set version to 2.0 because 1.0 does not support e.g. skip/top, inlinecount...
			// states the version of the Open Data Protocol used by the client to generate the request.
			this.oHeaders["DataServiceVersion"] = "2.0";

		},
		metadata : {

			publicMethods : ["create", "remove", "update", "submitChanges", "getServiceMetadata", "read", "hasPendingChanges", "refresh", "refreshMetadata", "resetChanges",
							 "isCountSupported", "setCountSupported", "setDefaultCountMode", "getDefaultCountMode", "forceNoCache", "setProperty",
							 "getSecurityToken", "refreshSecurityToken", "setHeaders", "getHeaders", "setUseBatch"]
		}
	});

	//
	ODataModel.M_EVENTS = {
			RejectChange: "rejectChange",
			/**
			 * Event is fired if the metadata document was successfully loaded
			 */
			MetadataLoaded: "metadataLoaded",

			/**
			 * Event is fired if the metadata document has failed to load
			 */
			MetadataFailed: "metadataFailed",

			/**
			 * Event is fired if the annotations document was successfully loaded
			 */
			AnnotationsLoaded: "annotationsLoaded",

			/**
			 * Event is fired if the annotations document has failed to load
			 */
			AnnotationsFailed: "annotationsFailed"

	};


	// Keep a map of service specific data, which can be shared across different model instances
	// on the same OData service
	ODataModel.mServiceData = {
	};

	ODataModel.prototype.fireRejectChange = function(mArguments) {
		this.fireEvent("rejectChange", mArguments);
		return this;
	};

	ODataModel.prototype.attachRejectChange = function(oData, fnFunction, oListener) {
		this.attachEvent("rejectChange", oData, fnFunction, oListener);
		return this;
	};

	ODataModel.prototype.detachRejectChange = function(fnFunction, oListener) {
		this.detachEvent("rejectChange", fnFunction, oListener);
		return this;
	};

	/**
	 * @private
	 */
	ODataModel.prototype._initializeMetadata = function(bDelayEvent) {
		var that = this;
		this.bUseBatch = this.bUseBatch || this.oMetadata.getUseBatch();
		var doFire = function(bDelay){
			if (!!bDelay) {
				that.metadataLoadEvent = jQuery.sap.delayedCall(0, that, doFire);
			} else {
				if (that.oMetadata) {
					that.fireMetadataLoaded({metadata: that.oMetadata});
					jQuery.sap.log.debug("ODataModel fired metadataloaded");
				}
			}
		};

		if (this.bLoadMetadataAsync && this.sAnnotationURI && this.bLoadAnnotationsJoined) {
			// In case of joined loading, wait for the annotations before firing the event
			// This is also tested in the fireMetadataLoaded-method and no event is fired in case
			// of joined loading.
			if (this.oAnnotations && this.oAnnotations.bInitialized) {
				doFire();
			} else {
				this.oAnnotations.attachEventOnce("loaded", function() {
					doFire(true);
				});
			}
		} else {
			// In case of synchronous or asynchronous non-joined loading, or if no annotations are
			// loaded at all, the events are fired individually
				doFire(bDelayEvent);
		}
	};

	/**
	 * Fire event annotationsLoaded to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {sap.ui.model.odata.ODataAnnotations} [mArguments.annotations]  the annotations object.
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireAnnotationsLoaded = function(mArguments) {
		this.fireEvent("annotationsLoaded", mArguments);
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'annotationsLoaded' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 * @experimental The API is NOT stable yet. Use at your own risk.
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, the global context (window) is used.
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachAnnotationsLoaded = function(oData, fnFunction, oListener) {
		this.attachEvent("annotationsLoaded", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'annotationsLoaded' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 * @experimental The API is NOT stable yet. Use at your own risk.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachAnnotationsLoaded = function(fnFunction, oListener) {
		this.detachEvent("annotationsLoaded", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event annotationsFailed to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {string} [mArguments.message]  A text that describes the failure.
	 * @param {string} [mArguments.statusCode]  HTTP status code returned by the request (if available)
	 * @param {string} [mArguments.statusText] The status as a text, details not specified, intended only for diagnosis output
	 * @param {string} [mArguments.responseText] Response that has been received for the request ,as a text string
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireAnnotationsFailed = function(mArguments) {
		this.fireEvent("annotationsFailed", mArguments);
		jQuery.sap.log.debug("ODataModel fired annotationsfailed");
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'annotationsFailed' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 *
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, the global context (window) is used.
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachAnnotationsFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("annotationsFailed", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'annotationsFailed' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachAnnotationsFailed = function(fnFunction, oListener) {
		this.detachEvent("annotationsFailed", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event metadataLoaded to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {sap.ui.model.odata.ODataMetadata} [mArguments.metadata]  the metadata object.
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireMetadataLoaded = function(mArguments) {
		this.fireEvent("metadataLoaded", mArguments);
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'metadataLoaded' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 *
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, the global context (window) is used.
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachMetadataLoaded = function(oData, fnFunction, oListener) {
		this.attachEvent("metadataLoaded", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'metadataLoaded' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachMetadataLoaded = function(fnFunction, oListener) {
		this.detachEvent("metadataLoaded", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event metadataFailed to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {string} [mArguments.message]  A text that describes the failure.
	 * @param {string} [mArguments.statusCode]  HTTP status code returned by the request (if available)
	 * @param {string} [mArguments.statusText] The status as a text, details not specified, intended only for diagnosis output
	 * @param {string} [mArguments.responseText] Response that has been received for the request ,as a text string
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireMetadataFailed = function(mArguments) {
		this.fireEvent("metadataFailed", mArguments);
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'metadataFailed' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 *
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, the global context (window) is used.
	 *
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachMetadataFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("metadataFailed", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'metadataFailed' event of this <code>sap.ui.model.odata.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachMetadataFailed = function(fnFunction, oListener) {
		this.detachEvent("metadataFailed", fnFunction, oListener);
		return this;
	};

	/**
	 * refreshes the metadata for model, e.g. in case the first request for metadata has failed
	 *
	 * @public
	 */
	ODataModel.prototype.refreshMetadata = function(){
		if (this.oMetadata && this.oMetadata.refresh){
			this.oMetadata.refresh();
		}
	};

	/**
	 * creates a request url
	 * @private
	 */
	ODataModel.prototype._createRequestUrl = function(sPath, oContext, oUrlParams, bBatch, bCache) {

		// create the url for the service
		var aUrlParams,
			sResolvedPath,
			sUrlParams,
			sUrl = "";

		//we need to handle url params that can be passed from the manual CRUD methods due to compatibility
		if (sPath && sPath.indexOf('?') != -1 ) {
			sUrlParams = sPath.substr(sPath.indexOf('?') + 1);
			sPath = sPath.substr(0, sPath.indexOf('?'));
		}

		sResolvedPath = this._normalizePath(sPath, oContext);

		if (!bBatch) {
			sUrl = this.sServiceUrl + sResolvedPath;
		} else {
			sUrl = sResolvedPath.substr(sResolvedPath.indexOf('/') + 1);
		}

		aUrlParams = ODataUtils._createUrlParamsArray(oUrlParams);

		if (this.aUrlParams) {
			aUrlParams = aUrlParams.concat(this.aUrlParams);
		}
		if (sUrlParams) {
			aUrlParams.push(sUrlParams);
		}
		if (aUrlParams.length > 0) {
			sUrl += "?" + aUrlParams.join("&");
		}
		if (bCache === undefined) {
			bCache = true;
		}
		if (bCache === false) {

			var timeStamp = jQuery.now();
			// try replacing _= if it is there
			var ret = sUrl.replace( /([?&])_=[^&]*/, "$1_=" + timeStamp );
			// if nothing was replaced, add timestamp to the end
			sUrl = ret + ( ( ret === sUrl ) ? ( /\?/.test( sUrl ) ? "&" : "?" ) + "_=" + timeStamp : "" );
		}

		return sUrl;
	};

	/**
	 * Does a request using the service URL and configuration parameters
	 * provided in the model's constructor and sets the response data into the
	 * model. This request is performed asynchronously.
	 *
	 * @param {string}
	 *            sPath Path A string containing the path to the data which should
	 *            be retrieved. The path is concatenated to the <code>sServiceUrl</code>
	 *            which was specified in the model constructor.
	 * @param {function}
	 *            [fnSuccess] a callback function which is called when the data has
	 *            been successfully retrieved and stored in the model
	 * @param {function}
	 *            [fnError] a callback function which is called when the request failed
	 *
	 * @param {boolean} [bCache=true] Force no caching if false
	 *
	 * @private
	 */
	ODataModel.prototype._loadData = function(sPath, aParams, fnSuccess, fnError, bCache, fnHandleUpdate, fnCompleted){

		// create a request object for the data request
		var oRequestHandle,
			oRequest,
			that = this;

		function _handleSuccess(oData, oResponse) {

			var oResultData = oData,
				mChangedEntities = {};

			// no data response
			if (oResponse.statusCode == 204) {
				if (fnSuccess) {
					fnSuccess(null);
				}
				if (fnCompleted) {
					fnCompleted(null);
				}
				that.fireRequestCompleted({url : oRequest.requestUri, type : "GET", async : oRequest.async,
					info: "Accept headers:" + that.oHeaders["Accept"], infoObject : {acceptHeaders: that.oHeaders["Accept"]}, success: true});
				return;
			}
			
			// no data available
			if (!oResultData) {
				jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: " + oResponse.requestUri);
				that.fireRequestCompleted({url : oRequest.requestUri, type : "GET", async : oRequest.async,
					info: "Accept headers:" + that.oHeaders["Accept"], infoObject : {acceptHeaders: that.oHeaders["Accept"]},  success: false});
				return false;
			}

			if (that.bUseBatch) { // process batch response
				// check if errors occurred in the batch
				var aErrorResponses = that._getBatchErrors(oData);
				if (aErrorResponses.length > 0) {
					// call handle error with the first error.
					_handleError(aErrorResponses[0]);
					return false;
				}

				if (oResultData.__batchResponses && oResultData.__batchResponses.length > 0) {
					oResultData = oResultData.__batchResponses[0].data;
				} else {
					jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: " + oResponse.requestUri);
				}
			}

			aResults = aResults.concat(oResultData.results);
			// check if not all requested data was loaded
			if (oResultData.__next) {
				// replace request uri with next uri to retrieve additional data
				var oURI = new URI(oResultData.__next);
				oRequest.requestUri = oURI.absoluteTo(oResponse.requestUri).toString();
				_submit(oRequest);
			} else {
				// all data is read so merge all data
				jQuery.sap.extend(oResultData.results, aResults);
				// broken implementations need this
				if (oResultData.results && !jQuery.isArray(oResultData.results)) {
					oResultData = oResultData.results;
				}
				// adding the result data to the data object
				that._importData(oResultData, mChangedEntities);

				// reset change key if refresh was triggered on that entry
				if (that.sChangeKey && mChangedEntities) {
					var sEntry = that.sChangeKey.substr(that.sChangeKey.lastIndexOf('/') + 1);
					if (mChangedEntities[sEntry]) {
						delete that.oRequestQueue[that.sChangeKey];
						that.sChangeKey = null;
					}
				}

				if (fnSuccess) {
					fnSuccess(oResultData);
				}
				that.checkUpdate(false, false, mChangedEntities);
				if (fnCompleted) {
					fnCompleted(oResultData);
				}
				that.fireRequestCompleted({url : oRequest.requestUri, type : "GET", async : oRequest.async,
					info: "Accept headers:" + that.oHeaders["Accept"], infoObject : {acceptHeaders: that.oHeaders["Accept"]}, success: true});
			}
		}

		function _handleError(oError) {
			// If error is a 403 with XSRF token "Required" reset token and retry sending request
			if (that.bTokenHandling && oError.response) {
				var sToken = that._getHeader("x-csrf-token", oError.response.headers);
				if (!oRequest.bTokenReset && oError.response.statusCode == '403' && sToken && sToken.toLowerCase() == "required") {
					that.resetSecurityToken();
					oRequest.bTokenReset = true;
					_submit();
					return;
				}
			}

			var mParameters = that._handleError(oError);

			if (fnError) {
				fnError(oError, oRequestHandle && oRequestHandle.bAborted);
			}

			that.fireRequestCompleted({url : oRequest.requestUri, type : "GET", async : oRequest.async,
				info: "Accept headers:" + that.oHeaders["Accept"], infoObject : {acceptHeaders: that.oHeaders["Accept"]}, success: false, errorobject: mParameters});

			// Don't fire RequestFailed for intentionally aborted requests; fire event if we have no (OData.read fails before handle creation)
			if (!oRequestHandle || !oRequestHandle.bAborted) {
				mParameters.url = oRequest.requestUri;
				that.fireRequestFailed(mParameters);
			}
		}

		/**
		 * this method is used to retrieve all desired data. It triggers additional read requests if the server paging size
		 * permits to return all the requested data. This could only happen for servers with support for oData > 2.0.
		 */
		function _submit(){
			// execute the request and use the metadata if available

			if (that.bUseBatch) {
				that.updateSecurityToken();
				// batch requests only need the path without the service URL
				// extract query of url and combine it with the path...
				var sUriQuery = URI.parse(oRequest.requestUri).query;
				//var sRequestUrl = sPath.replace(/\/$/, ""); // remove trailing slash if any
				//sRequestUrl += sUriQuery ? "?" + sUriQuery : "";
				var sRequestUrl = that._createRequestUrl(sPath, null, sUriQuery, that.bUseBatch);
				oRequest = that._createRequest(sRequestUrl, "GET", true);
				var oBatchRequest = that._createBatchRequest([oRequest],true);
				oRequestHandle = that._request(oBatchRequest, _handleSuccess, _handleError, OData.batchHandler, undefined, that.getServiceMetadata());
			} else {
				oRequestHandle = that._request(oRequest, _handleSuccess, _handleError, that.oHandler, undefined, that.getServiceMetadata());
			}

			if (fnHandleUpdate) {
				// Create a wrapper for the request handle to be able to differentiate
				// between intentionally aborted requests and failed requests
				var oWrappedHandle = {
					abort: function() {
						oRequestHandle.bAborted = true;
						oRequestHandle.abort();
					}
				};
				fnHandleUpdate(oWrappedHandle);
			}
		}

		// execute request
		var aResults = [];
		var sUrl = this._createRequestUrl(sPath, null, aParams, null, bCache || this.bCache);
		oRequest = this._createRequest(sUrl, "GET", true);
		this.fireRequestSent({url : oRequest.requestUri, type : "GET", async : oRequest.async,
			info: "Accept headers:" + this.oHeaders["Accept"], infoObject : {acceptHeaders: this.oHeaders["Accept"]}});
		_submit();
	};

	/**
	 * Imports the data to the internal storage.
	 * Nested entries are processed recursively, moved to the canonic location and referenced from the parent entry.
	 * keys are collected in a map for updating bindings
	 */
	ODataModel.prototype._importData = function(oData, mKeys) {
		var that = this,
		aList, sKey, oResult, oEntry;
		if (oData.results) {
			aList = [];
			jQuery.each(oData.results, function(i, entry) {
				aList.push(that._importData(entry, mKeys));
			});
			return aList;
		} else {
			sKey = this._getKey(oData);
			oEntry = this.oData[sKey];
			if (!oEntry) {
				oEntry = oData;
				this.oData[sKey] = oEntry;
			}
			jQuery.each(oData, function(sName, oProperty) {
				if (oProperty && (oProperty.__metadata && oProperty.__metadata.uri || oProperty.results) && !oProperty.__deferred) {
					oResult = that._importData(oProperty, mKeys);
					if (jQuery.isArray(oResult)) {
						oEntry[sName] = { __list: oResult };
					} else {
						oEntry[sName] = { __ref: oResult };
					}
				} else if (!oProperty || !oProperty.__deferred) { //do not store deferred navprops
					oEntry[sName] = oProperty;
				}
			});
			mKeys[sKey] = true;
			return sKey;
		}
	};

	/**
	 * Remove references of navigation properties created in importData function
	 */
	ODataModel.prototype._removeReferences = function(oData){
		var that = this, aList;
		if (oData.results) {
			aList = [];
			jQuery.each(oData.results, function(i, entry) {
				aList.push(that._removeReferences(entry));
			});
			return aList;
		} else {
			jQuery.each(oData, function(sPropName, oCurrentEntry) {
				if (oCurrentEntry) {
					if (oCurrentEntry["__ref"] || oCurrentEntry["__list"]) {
						delete oData[sPropName];
					}
				}
			});
			return oData;
		}
	};

	/**
	 * Restore reference entries of navigation properties created in importData function
	 */
	ODataModel.prototype._restoreReferences = function(oData){
		var that = this,
		aList,
		aResults = [];
		if (oData.results) {
			aList = [];
			jQuery.each(oData.results, function(i, entry) {
				aList.push(that._restoreReferences(entry));
			});
			return aList;
		} else {
			jQuery.each(oData, function(sPropName, oCurrentEntry) {
				if (oCurrentEntry && oCurrentEntry["__ref"]) {
					var oChildEntry = that._getObject("/" + oCurrentEntry["__ref"]);
					jQuery.sap.assert(oChildEntry, "ODataModel inconsistent: " + oCurrentEntry["__ref"] + " not found!");
					if (oChildEntry) {
						delete oCurrentEntry["__ref"];
						oData[sPropName] = oChildEntry;
						// check recursively for found child entries
						that._restoreReferences(oChildEntry);
					}
				} else if (oCurrentEntry && oCurrentEntry["__list"]) {
					jQuery.each(oCurrentEntry["__list"], function(j, sEntry) {
						var oChildEntry = that._getObject("/" + oCurrentEntry["__list"][j]);
						jQuery.sap.assert(oChildEntry, "ODataModel inconsistent: " +  oCurrentEntry["__list"][j] + " not found!");
						if (oChildEntry) {
							aResults.push(oChildEntry);
							// check recursively for found child entries
							that._restoreReferences(oChildEntry);
						}
					});
					delete oCurrentEntry["__list"];
					oCurrentEntry.results = aResults;
					aResults = [];
				}
			});
			return oData;
		}
	};

	/**
	 * removes all existing data from the model
	 */
	ODataModel.prototype.removeData = function(){
		this.oData = {};
	};

	/**
	 * Initialize the model.
	 * This will call initialize on all bindings. This is done if metadata is loaded asynchronously.
	 *
	 * @private
	 */
	ODataModel.prototype.initialize = function() {
		// Call initialize on all bindings in case metadata was not available when they were created
		var aBindings = this.aBindings.slice(0);
		jQuery.each(aBindings, function(iIndex, oBinding) {
			oBinding.initialize();
		});
	};

	/**
	 * Refresh the model.
	 * This will check all bindings for updated data and update the controls if data has been changed.
	 *
	 * @param {boolean} [bForceUpdate=false] Force update of controls
	 * @param {boolean} [bRemoveData=false] If set to true then the model data will be removed/cleared.
	 * 					Please note that the data might not be there when calling e.g. getProperty too early before the refresh call returned.
	 *
	 * @public
	 */
	ODataModel.prototype.refresh = function(bForceUpdate, bRemoveData) {
		// Call refresh on all bindings instead of checkUpdate to properly reset cached data in bindings
		if (bRemoveData) {
			this.removeData();
		}
		this._refresh(bForceUpdate);
	};

	ODataModel.prototype._refresh = function(bForceUpdate, mChangedEntities, mEntityTypes) {
		// Call refresh on all bindings instead of checkUpdate to properly reset cached data in bindings
		var aBindings = this.aBindings.slice(0);
		jQuery.each(aBindings, function(iIndex, oBinding) {
			oBinding.refresh(bForceUpdate, mChangedEntities, mEntityTypes);
		});
	};


	/**
	 * Private method iterating the registered bindings of this model instance and initiating their check for update
	 *
	 * @param {boolean} bForceUpdate
	 * @param {boolean} bAsync
	 * @param {object} mChangedEntities
	 * @param {boolean} bMetaModelOnly update metamodel bindings only
	 *
	 * @private
	 */
	ODataModel.prototype.checkUpdate = function(bForceUpdate, bAsync, mChangedEntities, bMetaModelOnly) {
		if (bAsync) {
			if (!this.sUpdateTimer) {
				this.sUpdateTimer = jQuery.sap.delayedCall(0, this, function() {
					this.checkUpdate(bForceUpdate, false, mChangedEntities);
				});
			}
			return;
		}
		if (this.sUpdateTimer) {
			jQuery.sap.clearDelayedCall(this.sUpdateTimer);
			this.sUpdateTimer = null;
		}
		var aBindings = this.aBindings.slice(0);
		jQuery.each(aBindings, function(iIndex, oBinding) {
			if (!bMetaModelOnly || this.isMetaModelPath(oBinding.getPath())) {
				oBinding.checkUpdate(bForceUpdate, mChangedEntities);
			}
		}.bind(this));
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindProperty
	 */
	ODataModel.prototype.bindProperty = function(sPath, oContext, mParameters) {
		var oBinding = new ODataPropertyBinding(this, sPath, oContext, mParameters);
		return oBinding;
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindList
	 */
	ODataModel.prototype.bindList = function(sPath, oContext, aSorters, aFilters, mParameters) {
		var oBinding = new ODataListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
		return oBinding;
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindTree
	 */
	ODataModel.prototype.bindTree = function(sPath, oContext, aFilters, mParameters) {
		var oBinding = new ODataTreeBinding(this, sPath, oContext, aFilters, mParameters);
		return oBinding;
	};

	/**
	 * Creates a binding context for the given path
	 * If the data of the context is not yet available, it can not be created, but first the
	 * entity needs to be fetched from the server asynchronously. In case no callback function
	 * is provided, the request will not be triggered.
	 *
	 * @see sap.ui.model.Model.prototype.createBindingContext
	 */
	ODataModel.prototype.createBindingContext = function(sPath, oContext, mParameters, fnCallBack, bReload) {
		var bReload = !!bReload,
			sFullPath = this.resolve(sPath, oContext);
		// optional parameter handling
		if (typeof oContext == "function") {
			fnCallBack = oContext;
			oContext = null;
		}
		if (typeof mParameters == "function") {
			fnCallBack = mParameters;
			mParameters = null;
		}
		
		// if path cannot be resolved, call the callback function and return null
		if (!sFullPath) {
			if (fnCallBack) {
				fnCallBack(null);
			}
			return null;
		}
		
		// try to resolve path, send a request to the server if data is not available yet
		// if we have set forceUpdate in mParameters we send the request even if the data is available
		var oData = this._getObject(sPath, oContext),
			sKey,
			oNewContext,
			that = this;

		if (!bReload) {
			bReload = this._isReloadNeeded(sFullPath, oData, mParameters);
		}

		if (!bReload) {
			sKey = this._getKey(oData);
			oNewContext = this.getContext('/' + sKey);
			if (fnCallBack) {
				fnCallBack(oNewContext);
			}
			return oNewContext;
		}

		if (fnCallBack) {
			var bIsRelative = !jQuery.sap.startsWith(sPath, "/");
			if (sFullPath) {
				var aParams = [],
					sCustomParams = this.createCustomParams(mParameters);
				if (sCustomParams) {
					aParams.push(sCustomParams);
				}
				this._loadData(sFullPath, aParams, function(oData) {
					sKey = oData ? that._getKey(oData) : undefined;
					if (sKey && oContext && bIsRelative) {
						var sContextPath = oContext.getPath();
						// remove starting slash
						sContextPath = sContextPath.substr(1);
						// when model is refreshed, parent entity might not be available yet
						if (that.oData[sContextPath]) {
							that.oData[sContextPath][sPath] = {__ref: sKey};
						}
					}
					oNewContext = that.getContext('/' + sKey);
					fnCallBack(oNewContext);
				}, function() {
					fnCallBack(null); // error - notify to recreate contexts
				});
			} else {
				fnCallBack(null); // error - notify to recreate contexts
			}
		}
	};

	/**
	 * checks if data based on select, expand parameters is already loaded or not.
	 * In case it couldn't be found we should reload the data so we return true.
	 */
	ODataModel.prototype._isReloadNeeded = function(sFullPath, oData, mParameters) {
		var sNavProps, aNavProps = [],
			sSelectProps, aSelectProps = [];

		// no valid path --> no reload
		if (!sFullPath) {
			return false;
		}
		
		// no data --> reload needed
		if (!oData) {
			return true;
		}

		//Split the Navigation-Properties (or multi-level chains) which should be expanded
		if (mParameters && mParameters["expand"]) {
			sNavProps = mParameters["expand"].replace(/\s/g, "");
			aNavProps = sNavProps.split(',');
		}

		//Split the Navigation properties again, if there are multi-level properties chained together by "/"
		//The resulting aNavProps array will look like this: ["a", ["b", "c/d/e"], ["f", "g/h"], "i"]
		if (aNavProps) {
			for (var i = 0; i < aNavProps.length; i++) {
				var chainedPropIndex = aNavProps[i].indexOf("/");
				if (chainedPropIndex !== -1) {
					//cut of the first nav property of the chain
					var chainedPropFirst = aNavProps[i].slice(0, chainedPropIndex);
					var chainedPropRest = aNavProps[i].slice(chainedPropIndex + 1);
					//keep track of the newly splitted nav prop chain
					aNavProps[i] = [chainedPropFirst, chainedPropRest];
				}
			}
		}

		//Iterate all nav props and follow the given expand-chain
		for (var i = 0; i < aNavProps.length; i++) {
			var navProp = aNavProps[i];

			//check if the navProp was split into multiple parts (meaning it's an array), e.g. ["Orders", "Products/Suppliers"]
			if (jQuery.isArray(navProp)) {

				var oFirstNavProp = oData[navProp[0]];
				var sNavPropRest = navProp[1];

				//first nav prop in the chain is either undefined or deferred -> reload needed
				if (!oFirstNavProp || (oFirstNavProp && oFirstNavProp.__deferred)) {
					return true;
				} else {
					//the first nav prop exists on the Data-Object
					if (oFirstNavProp) {
						//the first nav prop contains a __list of entry-keys (and the __list is not empty)
						if (oFirstNavProp.__list && oFirstNavProp.__list.length > 0) {
							//Follow all keys in the __list collection by recursively calling
							//this function to check if all linked properties are loaded.
							//This is basically a depth-first search.
							for (var iNavIndex = 0; iNavIndex < oFirstNavProp.__list.length; iNavIndex++) {
								var sPropKey = "/" + oFirstNavProp.__list[iNavIndex];
								var oDataObject = this.getObject(sPropKey);
								var bReloadNeeded = this._isReloadNeeded(sPropKey, oDataObject, {expand: sNavPropRest});
								if (bReloadNeeded) { //if a single nav-prop path is not loaded -> reload needed
									return true;
								}
							}
						} else if (oFirstNavProp.__ref) {
							//the first nav-prop is not a __list, but only a reference to a single entry (__ref)
							var sPropKey = "/" + oFirstNavProp.__ref;
							var oDataObject = this.getObject(sPropKey);
							var bReloadNeeded = this._isReloadNeeded(sPropKey, oDataObject, {expand: sNavPropRest});
							if (bReloadNeeded) {
								return true;
							}
						}
					}
				}

			} else {
				//only one single Part, e.g. "Orders"
				//@TODO: why 'undefined'? Old compatibility issue?
				if (oData[navProp] === undefined || (oData[navProp] && oData[navProp].__deferred)) {
					return true;
				}
			}
		}

		if (mParameters && mParameters["select"]) {
			sSelectProps = mParameters["select"].replace(/\s/g, "");
			aSelectProps = sSelectProps.split(',');
		}

		for (var i = 0; i < aSelectProps.length; i++) {
			// reload data if select property not available
			if (oData[aSelectProps[i]] === undefined) {
				return true;
			}
		}

		if (aSelectProps.length == 0) {
			// check if all props exist and are already loaded...
			// only a subset of props may already be loaded before and now we want to load all.
			var oEntityType = this.oMetadata._getEntityTypeByPath(sFullPath);
			if (!oEntityType) {
				// if no entity type could be found we decide not to reload
				return false;
			} else {
				for (var i = 0; i < oEntityType.property.length; i++) {
					if (oData[oEntityType.property[i].name] === undefined) {
						return true;
					}
				}
			}
		}
		return false;
	};

	/**
	 * @see sap.ui.model.Model.prototype.destroyBindingContext
	 */
	ODataModel.prototype.destroyBindingContext = function(oContext) {
	};

	/**
	 * Create URL parameters from custom parameters
	 * @private
	 */
	ODataModel.prototype.createCustomParams = function(mParameters) {
		var aCustomParams = [],
			mCustomQueryOptions,
			mSupportedParams = {
				expand: true,
				select: true
			};
		for (var sName in mParameters) {
			if (sName in mSupportedParams) {
				aCustomParams.push("$" + sName + "=" + jQuery.sap.encodeURL(mParameters[sName]));
			}
			if (sName == "custom") {
				mCustomQueryOptions = mParameters[sName];
				for (var sName in mCustomQueryOptions) {
					if (sName.indexOf("$") == 0) {
						jQuery.sap.log.warning("Trying to set OData parameter " + sName + " as custom query option!");
					} else {
						aCustomParams.push(sName + "=" + jQuery.sap.encodeURL(mCustomQueryOptions[sName]));
					}
				}
			}
		}
		return aCustomParams.join("&");
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindContext
	 */
	ODataModel.prototype.bindContext = function(sPath, oContext, mParameters) {
		var oBinding = new ODataContextBinding(this, sPath, oContext, mParameters);
		return oBinding;
	};

	/**
	 * Sets whether this OData service supports $count on its collections.
	 * This method is deprecated, please use setDefaultCountMode instead.
	 *
	 * @param {boolean} bCountSupported
	 * @deprecated
	 * @public
	 */
	ODataModel.prototype.setCountSupported = function(bCountSupported) {
		this.bCountSupported = bCountSupported;
	};

	/**
	 * Returns whether this model supports the $count on its collections
	 * This method is deprecated, please use getDefaultCountMode instead.
	 *
	 * @returns {boolean}
	 * @deprecated
	 * @public
	 */
	ODataModel.prototype.isCountSupported = function() {
		return this.bCountSupported;
	};

	/**
	 * Sets the default way to retrieve the count of collections in this model.
	 * Count can be determined either by sending a separate $count request, including
	 * $inlinecount=allpages in data requests, both of them or not at all.
	 *
	 * @param {sap.ui.model.odata.CountMode} sCountMode
	 * @since 1.20
	 * @public
	 */
	ODataModel.prototype.setDefaultCountMode = function(sCountMode) {
		this.sDefaultCountMode = sCountMode;
	};

	/**
	 * Returns the default count mode for retrieving the count of collections
	 *
	 * @returns {sap.ui.model.odata.CountMode}
	 * @since 1.20
	 * @public
	 */
	ODataModel.prototype.getDefaultCountMode = function() {
		return this.sDefaultCountMode;
	};


	/**
	 * Returns the key part from the entry URI or the given context
	 *
	 * @param {object|sap.ui.model.Context} oObject
	 * @param {boolean} bDecode Whether the URI decoding should be applied on the key
	 * @private
	 */
	ODataModel.prototype._getKey = function(oObject, bDecode) {
		var sKey, sURI;
		if (oObject instanceof sap.ui.model.Context) {
			sKey = oObject.getPath().substr(1);
		} else if (oObject && oObject.__metadata && oObject.__metadata.uri) {
			sURI = oObject.__metadata.uri;
			sKey = sURI.substr(sURI.lastIndexOf("/") + 1);
		}
		if (bDecode) {
			sKey = decodeURIComponent(sKey);
		}
		return sKey;
	};

	/**
	 * Returns the key part from the entry URI or the given context or object
	 *
	 * @param {object|sap.ui.model.Context} oObject The context or object
	 * @param {boolean} bDecode Whether the URI decoding should be applied on the key
	 * @public
	 */
	ODataModel.prototype.getKey = function(oObject, bDecode) {
		return this._getKey(oObject, bDecode);
	};

	/**
	 * Creates the key from the given collection name and property map
	 *
	 * @param {string} sCollection The name of the collection
	 * @param {object} oKeyParameters The object containing at least all the key properties of the entity type
	 * @param {boolean} bDecode Whether the URI decoding should be applied on the key
	 * @public
	 */
	ODataModel.prototype.createKey = function(sCollection, oKeyProperties, bDecode) {
		var oEntityType = this.oMetadata._getEntityTypeByPath(sCollection),
			sKey = sCollection,
			that = this,
			sName,
			sValue,
			oProperty;
		jQuery.sap.assert(oEntityType, "Could not find entity type of collection \"" + sCollection + "\" in service metadata!");
		sKey += "(";
		if (oEntityType.key.propertyRef.length == 1) {
			sName = oEntityType.key.propertyRef[0].name;
			jQuery.sap.assert(sName in oKeyProperties, "Key property \"" + sName + "\" is missing in object!");
			oProperty = this.oMetadata._getPropertyMetadata(oEntityType, sName);
			sValue = ODataUtils.formatValue(oKeyProperties[sName], oProperty.type);
			sKey += bDecode ? sValue : encodeURIComponent(sValue);
		} else {
			jQuery.each(oEntityType.key.propertyRef, function(i, oPropertyRef) {
				if (i > 0) {
					sKey += ",";
				}
				sName = oPropertyRef.name;
				jQuery.sap.assert(sName in oKeyProperties, "Key property \"" + sName + "\" is missing in object!");
				oProperty = that.oMetadata._getPropertyMetadata(oEntityType, sName);
				sValue = ODataUtils.formatValue(oKeyProperties[sName], oProperty.type);
				sKey += sName;
				sKey += "=";
				sKey += bDecode ? sValue : encodeURIComponent(sValue);
			});
		}
		sKey += ")";
		return sKey;
	};

	/**
	 * Returns the value for the property with the given <code>sPath</code>.
	 * If the path points to a navigation property which has been loaded via $expand then the <code>bIncludeExpandEntries</code>
	 * parameter determines if the navigation property should be included in the returned value or not. 
	 * Please note that this currently works for 1..1 navigation properties only.
	 * 
	 *
	 * @param {string} sPath the path/name of the property
	 * @param {object} [oContext] the context if available to access the property value
	 * @param {boolean} [bIncludeExpandEntries=null] This parameter should be set when a URI or custom parameter
	 * with a $expand System Query Option was used to retrieve associated entries embedded/inline.
	 * If true then the getProperty function returns a desired property value/entry and includes the associated expand entries (if any).
	 * If false the associated/expanded entry properties are removed and not included in the
	 * desired entry as properties at all. This is useful for performing updates on the base entry only. Note: A copy and not a reference of the entry will be returned.
	 * @type any
	 * @return the value of the property
	 * @public
	 */
	ODataModel.prototype.getProperty = function(sPath, oContext, bIncludeExpandEntries) {
		var oValue = this._getObject(sPath, oContext);

		// same behavior as before
		if (bIncludeExpandEntries == null || bIncludeExpandEntries == undefined) {
			return oValue;
		}

		// if value is a plain value and not an object we return directly
		if (!jQuery.isPlainObject(oValue)) {
			return oValue;
		}

		// do a value copy or the changes to that value will be modified in the model as well (reference)
		oValue = jQuery.sap.extend(true, {}, oValue);

		if (bIncludeExpandEntries == true) {
			// include expand entries
			return this._restoreReferences(oValue);
		} else {
			// remove expanded references
			return this._removeReferences(oValue);
		}
	};

	/**
	 * @param {string} sPath
	 * @param {object} oContext
	 * @returns {any}
	 */
	ODataModel.prototype._getObject = function(sPath, oContext) {
		var oNode = this.isLegacySyntax() ? this.oData : null, 
			sResolvedPath = this.resolve(sPath, oContext),
			iSeparator, sDataPath, sMetaPath, oMetaContext, sKey, oMetaModel;

		//check for metadata path
		if (this.oMetadata && sResolvedPath && sResolvedPath.indexOf('/#') > -1)  {
			if (this.isMetaModelPath(sResolvedPath)) {
				// Metadata binding resolved by ODataMetaModel
				iSeparator = sResolvedPath.indexOf('/##');
				oMetaModel = this.getMetaModel();
				if (!this.bMetaModelLoaded) {
					return null;
				}
				sDataPath = sResolvedPath.substr(0, iSeparator);
				sMetaPath = sResolvedPath.substr(iSeparator + 3);
				oMetaContext = oMetaModel.getMetaContext(sDataPath);
				oNode = oMetaModel.getProperty(sMetaPath, oMetaContext);
			} else {
				// Metadata binding resolved by ODataMetadata
				oNode = this.oMetadata._getAnnotation(sResolvedPath);
			}
		} else  {
			if (oContext) {
				sKey = oContext.getPath();
				// remove starting slash
				sKey = sKey.substr(1);
				oNode = this.oData[sKey];
			}
			if (!sPath) {
				return oNode;
			}
			var aParts = sPath.split("/"),
				iIndex = 0;
			if (!aParts[0]) {
				// absolute path starting with slash
				oNode = this.oData;
				iIndex++;
			}
			while (oNode && aParts[iIndex]) {
				oNode = oNode[aParts[iIndex]];
				if (oNode) {
					if (oNode.__ref) {
						oNode = this.oData[oNode.__ref];
					} else if (oNode.__list) {
						oNode = oNode.__list;
					} else if (oNode.__deferred) {
					// set to undefined and not to null because navigation properties can have a null value
						oNode = undefined;
					}
				}
				iIndex++;
			}
		}
		return oNode;
	};

	/**
	 * Update the security token, if token handling is enabled and token is not available yet
	 */
	ODataModel.prototype.updateSecurityToken = function() {
		if (this.bTokenHandling) {
			if (!this.oServiceData.securityToken) {
				this.refreshSecurityToken();
			}
			// Update header every time, in case security token was changed by other model
			// Check bTokenHandling again, as updateSecurityToken() might disable token handling
			if (this.bTokenHandling) {
				this.oHeaders["x-csrf-token"] = this.oServiceData.securityToken;
			}
		}
	};

	/**
	 * Clears the security token, as well from the service data as from the headers object
	 */
	ODataModel.prototype.resetSecurityToken = function() {
		delete this.oServiceData.securityToken;
		delete this.oHeaders["x-csrf-token"];
	};

	/**
	 * Returns the current security token. If the token has not been requested from the server it will be requested first.
	 *
	 * @returns {string} the CSRF security token
	 *
	 * @public
	 */
	ODataModel.prototype.getSecurityToken = function() {
		var sToken = this.oServiceData.securityToken;
		if (!sToken) {
			this.refreshSecurityToken();
			sToken = this.oServiceData.securityToken;
		}
		return sToken;
	};

	/**
	 * refresh XSRF token by performing a GET request against the service root URL.
	 *
	 * @param {function} [fnSuccess] a callback function which is called when the data has
	 *            					 been successfully retrieved.
	 * @param {function} [fnError] a callback function which is called when the request failed. The handler can have the parameter: oError which contains
	 *  additional error information.
	 *
	 * @param {boolean} [bAsync=false] true for asynchronous requests.
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.refreshSecurityToken = function(fnSuccess, fnError, bAsync) {
		var that = this, sUrl, sToken;

		// bAsync default is false ?!
		bAsync = bAsync === true;

		// trigger a read to the service url to fetch the token
		sUrl = this._createRequestUrl("/");
		var oRequest = this._createRequest(sUrl, "GET", bAsync);
		oRequest.headers["x-csrf-token"] = "Fetch";

		function _handleSuccess(oData, oResponse) {
			if (oResponse) {
				sToken = that._getHeader("x-csrf-token", oResponse.headers);
				if (sToken) {
					that.oServiceData.securityToken = sToken;
					// For compatibility with applications, that are using getHeaders() to retrieve the current
					// CSRF token additionally keep it in the oHeaders object
					that.oHeaders["x-csrf-token"] = sToken;
				} else {
					// Disable token handling, if service does not return tokens
					that.resetSecurityToken();
					that.bTokenHandling = false;
				}
			}

			if (fnSuccess) {
				fnSuccess(oData, oResponse);
			}
		}

		function _handleError(oError) {
			// Disable token handling, if token request returns an error
			that.resetSecurityToken();
			that.bTokenHandling = false;
			that._handleError(oError);

			if (fnError) {
				fnError(oError);
			}
		}

		return this._request(oRequest, _handleSuccess, _handleError, undefined, undefined, this.getServiceMetadata());
	};

	/**
	 * submit changes from the requestQueue (queue can currently have only one request)
	 *
	 * @private
	 */
	ODataModel.prototype._submitRequest = function(oRequest, bBatch, fnSuccess, fnError, bHandleBatchErrors, bImportData){
		var that = this, oResponseData, mChangedEntities = {};

		function _handleSuccess(oData, oResponse) {
			// check if embedded errors occurred in success request. We don't do that for manual batch requests
			// so we have to check for bHandleBatchErrors
			if (bBatch && bHandleBatchErrors) {
				// check if errors occurred in the batch
				var aErrorResponses = that._getBatchErrors(oData);
				if (aErrorResponses.length > 0) {
					// call handle error with the first error.
					_handleError(aErrorResponses[0]);
					return false;
				}
				// if response contains data
				if (oData.__batchResponses && oData.__batchResponses.length > 0) {

					oResponseData = oData.__batchResponses[0].data;
					if (!oResponseData && oData.__batchResponses[0].__changeResponses) {
						oResponseData = oData.__batchResponses[0].__changeResponses[0].data;
					}
				}
				oData = oResponseData;
			}

			if (bImportData) {
				if (oData && oData.__batchResponses) {
					jQuery.each(oData.__batchResponses, function(iIndex, oResponse) {
						if (oResponse && oResponse.data) {
							that._importData(oResponse.data, mChangedEntities);
						}
					});
				}
			}

			that._handleETag(oRequest, oResponse, bBatch);

			that._updateRequestQueue(oRequest, bBatch);

			if (that._isRefreshNeeded(oRequest, oResponse)) {
				that._refresh(false, oRequest.keys, oRequest.entityTypes );
			}

			if (fnSuccess) {
				fnSuccess(oData, oResponse);
			}
		}

		function _handleError(oError) {

			// If error is a 403 with XSRF token "Required" reset the token and retry sending request
			if (that.bTokenHandling && oError.response) {
				var sToken = that._getHeader("x-csrf-token", oError.response.headers);
				if (!oRequest.bTokenReset && oError.response.statusCode == '403' && sToken && sToken.toLowerCase() == "required") {
					that.resetSecurityToken();
					oRequest.bTokenReset = true;
					_submit();
					return;
				}
			}

			that._handleError(oError);

			if (fnError) {
				fnError(oError);
			}
		}

		function _submit() {
			// request token only if we have change operations or batch requests
			// token needs to be set directly on request headers, as request is already created
			if (that.bTokenHandling && oRequest.method !== "GET") {
				that.updateSecurityToken();
				// Check bTokenHandling again, as updateSecurityToken() might disable token handling
				if (that.bTokenHandling) {
					oRequest.headers["x-csrf-token"] = that.oServiceData.securityToken;
				}
			}

			if (bBatch) {
				return that._request(oRequest, _handleSuccess, _handleError, OData.batchHandler, undefined, that.getServiceMetadata());
			} else {
				return that._request(oRequest, _handleSuccess, _handleError, that.oHandler, undefined, that.getServiceMetadata());
			}
		}

		return _submit();
	};

	/*
	 * Create a Batch request
	 * @private
	 */
	ODataModel.prototype._createBatchRequest = function(aBatchRequests, bAsync) {
		var sUrl, oRequest,
			oChangeHeader = {},
			oPayload = {},
			mKeys = {}, mEntityTypes = {};

		oPayload.__batchRequests = aBatchRequests;

		sUrl = this.sServiceUrl	+ "/$batch";

		if (this.aUrlParams.length > 0) {
			sUrl += "?" + this.aUrlParams.join("&");
		}

		jQuery.extend(oChangeHeader, this.mCustomHeaders, this.oHeaders);

		// reset
		delete oChangeHeader["Content-Type"];

		oRequest = {
				headers : oChangeHeader,
				requestUri : sUrl,
				method : "POST",
				data : oPayload,
				user: this.sUser,
				password: this.sPassword,
				async: bAsync
		};

		if (bAsync) {
			oRequest.withCredentials = this.bWithCredentials;
		}
		//collect keys
		jQuery.each(aBatchRequests, function(i, oBatchOperation) {
			if (oBatchOperation["__changeRequests"]) {
				//this is a changeset
				jQuery.each(oBatchOperation["__changeRequests"],function(j, oChangeRequest){
					if (oChangeRequest.keys && oChangeRequest.method != "POST") {
						jQuery.each(oChangeRequest.keys, function(k,sKey){
							mKeys[k] = sKey;
						});
					} else if (oChangeRequest.entityTypes && oChangeRequest.method == "POST") {
						jQuery.each(oChangeRequest.entityTypes, function(l, sEntityType){
							mEntityTypes[l] = sEntityType;
						});
					}
				});
			}
		});

		oRequest.keys = mKeys;
		oRequest.entityTypes = mEntityTypes;

		return oRequest;
	};

	/*
	 * handle ETag
	 * @private
	 */
	ODataModel.prototype._handleETag = function(oRequest, oResponse, bBatch) {
		var sUrl,
			oEntry,
			aChangeRequests,
			aChangeResponses,
			aBatchRequests,
			aBatchResponses;

		if (bBatch) {
			aBatchRequests = oRequest.data.__batchRequests;
			aBatchResponses = oResponse.data.__batchResponses;
			if (aBatchResponses && aBatchRequests) {
				for (var i = 0; i < aBatchRequests.length; i++) {
					// get change requests and corresponding responses - the latter are in the same order as the requests according to odata spec
					aChangeRequests = aBatchRequests[i].__changeRequests;
					if (aBatchResponses[i]) {
						aChangeResponses = aBatchResponses[i].__changeResponses;
						if (aChangeRequests && aChangeResponses) {
							for (var j = 0; j < aChangeRequests.length; j++) {
								if (aChangeRequests[j].method == "MERGE" || aChangeRequests[j].method == "PUT") {
									//try to get the object to the uri from the model
									sUrl = aChangeRequests[j].requestUri.replace(this.sServiceUrl + '/','');
									if (!jQuery.sap.startsWith(sUrl , "/")) {
										sUrl = "/" + sUrl;
									}
									oEntry = this._getObject(sUrl);
									// if there is an object, try to update its eTag from the response.
									if (oEntry && oEntry.__metadata && aChangeResponses[j].headers && aChangeResponses[j].headers.ETag) {
										oEntry.__metadata.etag = aChangeResponses[j].headers.ETag;
									}
								}
							}
						}
					} else {
						jQuery.sap.log.warning("could not update ETags for batch request: corresponding response for request missing");
					}
				}
			} else {
				jQuery.sap.log.warning("could not update ETags for batch request: no batch responses/requests available");
			}
		} else {
			// refresh ETag from response directly. We can not wait for the refresh.
			sUrl = oRequest.requestUri.replace(this.sServiceUrl + '/','');
			if (!jQuery.sap.startsWith(sUrl , "/")) {
				sUrl = "/" + sUrl;
			}
			oEntry = this._getObject(sUrl);
			if (oEntry && oEntry.__metadata && oResponse.headers.ETag) {
				oEntry.__metadata.etag = oResponse.headers.ETag;
			}
		}
	};

	/*
	 * handle batch errors
	 * @private
	 */
	ODataModel.prototype._handleBatchErrors = function(oResponse, oData) {
		this._getBatchErrors(oData);
		this._handleETag();

	};

	/*
	 * returns array of batch errors
	 */
	ODataModel.prototype._getBatchErrors = function(oData) {
		var aErrorResponses = [], sErrorMsg;
		// check if errors occurred in the batch
		jQuery.each(oData.__batchResponses, function(iIndex, oOperationResponse) {
			if (oOperationResponse.message) {
				sErrorMsg = "The following problem occurred: " + oOperationResponse.message;
				if (oOperationResponse.response) {
					sErrorMsg += oOperationResponse.response.statusCode + "," +
					oOperationResponse.response.statusText + "," +
					oOperationResponse.response.body;
				}
				aErrorResponses.push(oOperationResponse);
				jQuery.sap.log.fatal(sErrorMsg);
			}
			if (oOperationResponse.__changeResponses) {
				jQuery.each(oOperationResponse.__changeResponses, function(iIndex, oChangeOperationResponse) {
					if (oChangeOperationResponse.message) {
						sErrorMsg = "The following problem occurred: " + oChangeOperationResponse.message;
						if (oChangeOperationResponse.response) {
							sErrorMsg += oChangeOperationResponse.response.statusCode + "," +
							oChangeOperationResponse.response.statusText + "," +
							oChangeOperationResponse.response.body;
						}
						aErrorResponses.push(oChangeOperationResponse);
						jQuery.sap.log.fatal(sErrorMsg);
					}
				});
			}
		});
		return aErrorResponses;
	};

	/**
	 * error handling for requests
	 * @private
	 */
	ODataModel.prototype._handleError = function(oError) {
		var mParameters = {}, sToken;
		var sErrorMsg = "The following problem occurred: " + oError.message;

		mParameters.message = oError.message;
		if (oError.response) {
			if (this.bTokenHandling) {
				// if XSRFToken is not valid we get 403 with the x-csrf-token header : Required.
				// a new token will be fetched in the refresh afterwards.
				sToken = this._getHeader("x-csrf-token", oError.response.headers);
				if (oError.response.statusCode == '403' && sToken && sToken.toLowerCase() == "required") {
					this.resetSecurityToken();
				}
			}
			sErrorMsg += oError.response.statusCode + "," +
			oError.response.statusText + "," +
			oError.response.body;
			mParameters.statusCode = oError.response.statusCode;
			mParameters.statusText = oError.response.statusText;
			mParameters.responseText = oError.response.body;
		}
		jQuery.sap.log.fatal(sErrorMsg);

		return mParameters;
	};

	/**
	 * Return requested data as object if the data has already been loaded and stored in the model.
	 *
	 * @param {string} sPath A string containing the path to the data object that should be returned.
	 * @param {object} [oContext] the optional context which is used with the sPath to retrieve the requested data.
	 * @param {boolean} [bIncludeExpandEntries=null] This parameter should be set when a URI or custom parameter
	 * with a $expand System Query Option was used to retrieve associated entries embedded/inline.
	 * If true then the getProperty function returns a desired property value/entry and includes the associated expand entries (if any).
	 * If false the associated/expanded entry properties are removed and not included in the
	 * desired entry as properties at all. This is useful for performing updates on the base entry only. Note: A copy and not a reference of the entry will be returned.
	 *
	 * @return {object} oData Object containing the requested data if the path is valid.
	 * @public
	 * @deprecated please use {@link #getProperty} instead
	 */
	ODataModel.prototype.getData = function(sPath, oContext, bIncludeExpandEntries) {
		return this.getProperty(sPath, oContext, bIncludeExpandEntries);
	};

	/**
	 * returns an ETag: either the passed sETag or tries to retrieve the ETag from the metadata of oPayload or sPath
	 *
	 * @private
	 */
	ODataModel.prototype._getETag = function(sPath, oPayload, sETag) {
		var sETagHeader, sEntry, iIndex;
		if (sETag) {
			sETagHeader = sETag;
		} else {
			if (oPayload && oPayload.__metadata) {
				sETagHeader = oPayload.__metadata.etag;
			} else if (sPath) {
				sEntry = sPath.replace(this.sServiceUrl + '/','');
				iIndex = sEntry.indexOf("?");
				if (iIndex > -1) {
					sEntry = sEntry.substr(0, iIndex);
				}
				if (this.oData.hasOwnProperty(sEntry)) {
					sETagHeader = this.getProperty('/' + sEntry + '/__metadata/etag');
				}
			}
		}
		return sETagHeader;
	};
	/**
	 * creation of a request object for changes
	 *
	 * @return {object} request object
	 * @private
	 */
	ODataModel.prototype._createRequest = function(sUrl, sMethod, bAsync, oPayload, sETag) {
		var oChangeHeader = {}, sETagHeader;
		jQuery.extend(oChangeHeader, this.mCustomHeaders, this.oHeaders);

		sETagHeader = this._getETag(sUrl, oPayload, sETag);

		if (sETagHeader && sMethod != "GET") {
			oChangeHeader["If-Match"] = sETagHeader;
		}

		// make sure to set content type header for POST/PUT requests when using JSON format to prevent datajs to add "odata=verbose" to the content-type header
		// may be removed as later gateway versions support this
		if (this.bJSON && sMethod != "DELETE" && this.sMaxDataServiceVersion === "2.0") {
			oChangeHeader["Content-Type"] = "application/json";
		}

		if (sMethod == "MERGE" && !this.bUseBatch) {
			oChangeHeader["x-http-method"] = "MERGE";
			sMethod = "POST";
		}

		var oRequest = {
				headers : oChangeHeader,
				requestUri : sUrl,
				method : sMethod,
				//data : oPayload,
				user: this.sUser,
				password: this.sPassword,
				async: bAsync
		};

		if (oPayload) {
			oRequest.data = oPayload;
		}

		if (bAsync) {
			oRequest.withCredentials = this.bWithCredentials;
		}

		return oRequest;
	};

	/**
	 * Checks if a model refresh is needed, either because the the data provided by the sPath and oContext is stored
	 * in the model or new data is added (POST). For batch requests all embedded requests are checked separately.
	 *
	 * @return {boolean}
	 * @private
	 */
	ODataModel.prototype._isRefreshNeeded = function(oRequest, oResponse) {
		var bRefreshNeeded = false,
		sErrorCode,
		aErrorResponses = [],
			that = this;

		if (!this.bRefreshAfterChange) {
			return bRefreshNeeded;
		}
		// if this is a batch request, loop through the batch operations, find change requests
		// and check every change request individually
		if (oRequest.data && jQuery.isArray(oRequest.data.__batchRequests)) {
			if (oResponse) {
				aErrorResponses = that._getBatchErrors(oResponse.data);
				jQuery.each(aErrorResponses, function(iIndex, oErrorResponse){
					if (oErrorResponse.response && oErrorResponse.response.statusCode == "412") {
						sErrorCode = oErrorResponse.response.statusCode;
						return false;
					}
				});
				if (!!sErrorCode) {
					return false;
				}
			}
			jQuery.each(oRequest.data.__batchRequests, function(iIndex, oBatchRequest) {
				if (jQuery.isArray(oBatchRequest.__changeRequests)) {
					jQuery.each(oBatchRequest.__changeRequests, function(iIndex, oChangeRequest) {
						bRefreshNeeded = bRefreshNeeded || that._isRefreshNeeded(oChangeRequest);
						return !bRefreshNeeded; //break
					});
				}
				return !bRefreshNeeded; //break
			});
		} else {
			if (oRequest.method === "GET" ) {
				return false;
			} else {
				if (oResponse && oResponse.statusCode == "412") {
					bRefreshNeeded = false;
				} else {
					bRefreshNeeded = true;
				}
			}
		}
		return bRefreshNeeded;
	};

	/**
	 * Trigger a PUT/MERGE request to the odata service that was specified in the model constructor. Please note that deep updates are not supported
	 * and may not work. These should be done seperate on the entry directly.
	 *
	 * @param {string} sPath A string containing the path to the data that should be updated.
	 * 		The path is concatenated to the sServiceUrl which was specified
	 * 		in the model constructor.
	 * @param {object} oData data of the entry that should be updated.
	 * @param {map} [mParameters] Optional, can contain the following attributes:
	 * @param {object} [mParameters.context] If specified the sPath has to be is relative to the path given with the context.
	 * @param {function} [mParameters.success] a callback function which is called when the data has been successfully updated.
	 * @param {function} [mParameters.error] a callback function which is called when the request failed.
	 * 		The handler can have the parameter <code>oError</code> which contains additional error information.
	 * @param {boolean} [mParameters.merge=false] trigger a MERGE request instead of a PUT request to perform a differential update
	 * @param {string} [mParameters.eTag] If specified, the If-Match-Header will be set to this Etag.
	 * @param {boolean} [mParameters.async=false] Whether the request should be done asynchronously.
	 * 		Please be advised that this feature is officially unsupported as using asynchronous
	 * 		requests can lead to data inconsistencies if the application does not make sure that
	 * 		the request was completed before continuing to work with the data.
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */

	ODataModel.prototype.update = function(sPath, oData, mParameters) {
		var fnSuccess, fnError, bMerge, oRequest, sUrl, oContext, sETag, oRequestHandle,
			oBatchRequest, oStoredEntry, sKey,
			mUrlParams,
			bAsync = false;

	//ensure compatibility, check for old or new declaration of parameters
		if (mParameters instanceof sap.ui.model.Context || arguments.length > 3) {
			oContext  = mParameters;
			fnSuccess = arguments[3];
			fnError = arguments[4];
			bMerge = arguments[5];
		} else {
			//we are using the new parameters
			// For API compatibility, we also allow the "old" hungarian syntax
			oContext  = mParameters.context || mParameters.oContext;
			fnSuccess = mParameters.success || mParameters.fnSuccess;
			fnError   = mParameters.error   || mParameters.fnError;
			sETag     = mParameters.eTag    || mParameters.sETag;
			bMerge    = typeof (mParameters.merge) == "undefined"
				? mParameters.bMerge === true
				: mParameters.merge  === true;
			bAsync    = typeof (mParameters.async) == "undefined"
				? mParameters.bAsync === true
				: mParameters.async  === true;
			mUrlParams = mParameters.urlParameters;
		}

		sUrl = this._createRequestUrl(sPath, oContext, mUrlParams, this.bUseBatch);
		if (bMerge) {
			oRequest = this._createRequest(sUrl, "MERGE", bAsync, oData, sETag);
		} else {
			oRequest = this._createRequest(sUrl, "PUT", bAsync, oData, sETag);
		}

		sPath = this._normalizePath(sPath, oContext);
		oStoredEntry = this._getObject(sPath);
		oRequest.keys = {};
		if (oStoredEntry) {
			sKey = this._getKey(oStoredEntry);
			oRequest.keys[sKey] = true;
		}

		if (this.bUseBatch) {
			oBatchRequest = this._createBatchRequest([{__changeRequests:[oRequest]}], bAsync);
			oRequestHandle = this._submitRequest(oBatchRequest, this.bUseBatch, fnSuccess, fnError, true);
		} else {
			oRequestHandle = this._submitRequest(oRequest, this.bUseBatch, fnSuccess, fnError);
		}
		return oRequestHandle;
	};

	/**
	 * Trigger a POST request to the odata service that was specified in the model constructor. Please note that deep creates are not supported
	 * and may not work.
	 *
	 * @param {string} sPath A string containing the path to the collection where an entry
	 *		should be created. The path is concatenated to the sServiceUrl
	 *		which was specified in the model constructor.
	 * @param {object} oData data of the entry that should be created.
	 * @param {map} [mParameters] Optional parameter map containing any of the following properties:
	 * @param {object} [mParameters.context] If specified the sPath has to be relative to the path given with the context.
	 * @param {function} [mParameters.success] a callback function which is called when the data has
	 *		been successfully retrieved. The handler can have the
	 *		following parameters: oData and response.
	 * @param {function} [mParameters.error] a callback function which is called when the request failed.
	 *		The handler can have the parameter <code>oError</code> which contains additional error information.
	 * @param {boolean} [mParameters.async=false] Whether the request should be done asynchronously. Default: false
	 * 		Please be advised that this feature is officially unsupported as using asynchronous
	 * 		requests can lead to data inconsistencies if the application does not make sure that
	 * 		the request was completed before continuing to work with the data.
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.create = function(sPath, oData, mParameters) {
		var oRequest, oBatchRequest, sUrl, oRequestHandle, oEntityMetadata,
			oContext, fnSuccess, fnError, bAsync = false, mUrlParams;

		if (mParameters && typeof (mParameters) == "object" && !(mParameters instanceof sap.ui.model.Context)) {
			// The object parameter syntax has been used.
			oContext	= mParameters.context;
			fnSuccess	= mParameters.success;
			mUrlParams	= mParameters.urlParameters;
			fnError		= mParameters.error;
			bAsync		= mParameters.async === true;
		} else {
			// Legacy parameter syntax is used
			oContext	= mParameters;
			fnSuccess	= arguments[3];
			fnError		= arguments[4];
		}

		sUrl = this._createRequestUrl(sPath, oContext, mUrlParams, this.bUseBatch);
		oRequest = this._createRequest(sUrl, "POST", bAsync, oData);

		sPath = this._normalizePath(sPath, oContext);
		oEntityMetadata = this.oMetadata._getEntityTypeByPath(sPath);
		oRequest.entityTypes = {};
		if (oEntityMetadata) {
			oRequest.entityTypes[oEntityMetadata.entityType] = true;
		}

		if (this.bUseBatch) {
			oBatchRequest = this._createBatchRequest([{__changeRequests:[oRequest]}], bAsync);
			oRequestHandle = this._submitRequest(oBatchRequest, this.bUseBatch, fnSuccess, fnError, true);
		} else {
			oRequestHandle = this._submitRequest(oRequest, this.bUseBatch, fnSuccess, fnError);
		}
		return oRequestHandle;
	};

	/**
	 * Trigger a DELETE request to the odata service that was specified in the model constructor.
	 *
	 * @param {string} sPath A string containing the path to the data that should be removed.
	 *		The path is concatenated to the sServiceUrl which was specified in the model constructor.
	 * @param {object} [mParameters] Optional, can contain the following attributes: oContext, fnSuccess, fnError, sETag:
	 * @param {object} [mParameters.context] If specified the sPath has to be relative to the path given with the context.
	 * @param {function} [mParameters.success]  a callback function which is called when the data has been successfully retrieved.
	 *		The handler can have the following parameters: <code>oData<code> and <code>response</code>.
	 * @param {function} [mParameters.error] a callback function which is called when the request failed.
	 *		The handler can have the parameter: <code>oError</code> which contains additional error information.
	 * @param {string} [mParameters.eTag] If specified, the If-Match-Header will be set to this Etag.
	 * @param {object} [mParameters.payload] if specified, this optional variable can be used to pass a payload into the delete function,
	 *		e.g. if the entry which should be deleted has not been bound to any control, but has been retrieved via read, only.
	 * @param {boolean} [mParameters.async=false] Whether the request should be done asynchronously.
	 * 		Please be advised that this feature is officially unsupported as using asynchronous
	 * 		requests can lead to data inconsistencies if the application does not make sure that
	 * 		the request was completed before continuing to work with the data.
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.remove = function(sPath, mParameters) {
		var oContext, sEntry, oStoredEntry, fnSuccess, fnError, oRequest, sUrl,
			sETag, sKey, oPayload, _fnSuccess, oBatchRequest, oRequestHandle,
			mUrlParams,
			bAsync = false,
			that = this;

		// maintain compatibility, check if the old or new function parameters are used and set values accordingly:
		if ((mParameters && mParameters instanceof sap.ui.model.Context) || arguments[2]) {
			oContext  = mParameters;
			fnSuccess = arguments[2];
			fnError   = arguments[3];
		} else if (mParameters) {
			oContext  = mParameters.context || mParameters.oContext;
			fnSuccess = mParameters.success || mParameters.fnSuccess;
			fnError   = mParameters.error   || mParameters.fnError;
			sETag     = mParameters.eTag    || mParameters.sETag;
			oPayload  = mParameters.payload || mParameters.oPayload;
			bAsync    = typeof (mParameters.async) == "undefined"
				? mParameters.bAsync === true
				: mParameters.async === true;
			mUrlParams = mParameters.urlParameters;
		}

		_fnSuccess = function(oData, oResponse) {
			sEntry = sUrl.substr(sUrl.lastIndexOf('/') + 1);
			//remove query params if any
			if (sEntry.indexOf('?') != -1) {
				sEntry = sEntry.substr(0, sEntry.indexOf('?'));
			}
			delete that.oData[sEntry];
			delete that.mContexts["/" + sEntry]; // contexts are stored starting with /

			if (fnSuccess) {
				fnSuccess(oData, oResponse);
			}
		};

		sUrl = this._createRequestUrl(sPath, oContext, mUrlParams, this.bUseBatch);
		oRequest = this._createRequest(sUrl, "DELETE", bAsync, oPayload, sETag);

		sPath = this._normalizePath(sPath, oContext);
		oStoredEntry = this._getObject(sPath);
		oRequest.keys = {};
		if (oStoredEntry) {
			sKey = this._getKey(oStoredEntry);
			oRequest.keys[sKey] = true;
		}

		if (this.bUseBatch) {
			oBatchRequest = this._createBatchRequest([{__changeRequests:[oRequest]}], bAsync);
			oRequestHandle = this._submitRequest(oBatchRequest, this.bUseBatch, _fnSuccess, fnError, true);
		} else {
			oRequestHandle = this._submitRequest(oRequest, this.bUseBatch, _fnSuccess, fnError);
		}
		return oRequestHandle;

	};

	/**
	 * Trigger a request to the function import odata service that was specified in the model constructor.
	 *
	 * @param {string} sFunctionName A string containing the name of the function to call.
	 *		The name is concatenated to the sServiceUrl which was specified in the model constructor.
	 * @param {map} [mParameters] Optional parameter map containing any of the following properties:
	 * @param {string} [mParameters.method] A string containing the type of method to call this function with
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 * @param {object} [mParameters.context] If specified the sPath has to be relative to the path given with the context.
	 * @param {function} [mParameters.success] a callback function which is called when the data has been successfully retrieved.
	 *		The handler can have the following parameters: <code>oData<code> and <code>response</code>.
	 * @param {function} [mParameters.error] a callback function which is called when the request failed.
	 *		The handler can have the parameter: <code>oError</code> which contains additional error information.
	 * @param {boolean} [mParameters.async=false] Whether or not to send the request asynchronously. Default: false
	 * 		In case sMethod is "GET", the request is always asynchronous.
	 * 		Please be advised that this feature is officially unsupported as using asynchronous
	 * 		requests can lead to data inconsistencies if the application does not make sure that
	 * 		the request was completed before continuing to work with the data.
	* @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.callFunction = function (sFunctionName, mParameters) {
		var oRequest, oBatchRequest, sUrl, oRequestHandle,
			oFunctionMetadata,
			oParameters, oContext, fnSuccess, fnError, bAsync,
			sMethod = "GET",
			oUrlParams = {},
			that = this;

		if (mParameters && typeof (mParameters) == "object") {
			// The object parameter syntax has been used.
			sMethod     = mParameters.method ? mParameters.method : sMethod;
			oParameters = mParameters.urlParameters;
			oContext    = mParameters.context;
			fnSuccess   = mParameters.success;
			fnError     = mParameters.error;
			bAsync      = mParameters.async === true;
		} else {
			// Legacy parameter syntax is used
			sMethod     = mParameters;
			oParameters = arguments[2];
			oContext    = arguments[3];
			fnSuccess   = arguments[4];
			fnError     = arguments[5];
			bAsync      = arguments[6] === true;
		}


		oFunctionMetadata = this.oMetadata._getFunctionImportMetadata(sFunctionName, sMethod);
		jQuery.sap.assert(oFunctionMetadata, "Function " + sFunctionName + " not found in the metadata !");

		if (oFunctionMetadata) {
			sUrl = this._createRequestUrl(sFunctionName, oContext, null,  this.bUseBatch);
			var sUrlURI = URI(sUrl);
			if (oFunctionMetadata.parameter != null) {
				jQuery.each(oParameters, function (sParameterName, oParameterValue) {
					var matchingParameters = jQuery.grep(oFunctionMetadata.parameter, function (oParameter) {
						return oParameter.name == sParameterName && oParameter.mode == "In";
					});
					if (matchingParameters != null && matchingParameters.length > 0) {
						var matchingParameter = matchingParameters[0];
						oUrlParams[sParameterName] = ODataUtils.formatValue(oParameterValue, matchingParameter.type);
					} else {
						jQuery.sap.log.warning("Parameter " + sParameterName + " is not defined for function call " + sFunctionName + "!");
					}
				});
			}
			if (sMethod === "GET") {
	//			parameters are encoded in read function
				return that.read(sFunctionName, oContext, oUrlParams, true, fnSuccess, fnError);
			} else {
				jQuery.each(oUrlParams, function (sParameterName, oParameterValue) {
					// addQuery also encodes the url
					sUrlURI.addQuery(sParameterName, oParameterValue);
				});
				oRequest = this._createRequest(sUrlURI.toString(), sMethod, bAsync);

				if (this.bUseBatch) {
					oBatchRequest = this._createBatchRequest([{__changeRequests:[oRequest]}], bAsync);
					oRequestHandle = this._submitRequest(oBatchRequest, this.bUseBatch, fnSuccess, fnError, true);
				} else {
					oRequestHandle = this._submitRequest(oRequest, this.bUseBatch, fnSuccess, fnError);
				}
				return oRequestHandle;
			}
		}
	};

	/**
	 * Trigger a GET request to the odata service that was specified in the model constructor.
	 * The data will not be stored in the model. The requested data is returned with the response.
	 *
	 * @param {string} sPath A string containing the path to the data which should
	 *		be retrieved. The path is concatenated to the sServiceUrl
	 *		which was specified in the model constructor.
	 * @param {map} [mParameters] Optional parameter map containing any of the following properties:
	 * @param {object} [mParameters.context] If specified the sPath has to be is relative to the path
	 * 		given with the context.
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 * @param {boolean} [mParameters.async=true] true for asynchronous requests.
	 * @param {array} [mParameters.filters] an array of sap.ui.model.Filter to be included in the request URL
	 * @param {array} [mParameters.sorters] an array of sap.ui.model.Sorter to be included in the request URL
	 * @param {function} [mParameters.success] a callback function which is called when the data has
	 *		been successfully retrieved. The handler can have the
	 *		following parameters: oData and response.
	 * @param {function} [mParameters.error] a callback function which is called when the request
	 * 		failed. The handler can have the parameter: oError which contains
	 * additional error information.
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.read = function(sPath, mParameters) {
		var oRequest, sUrl, oRequestHandle, oBatchRequest,
			oContext, mUrlParams, bAsync, fnSuccess, fnError,
			aFilters, aSorters, sFilterParams, sSorterParams,
			oEntityType, sResolvedPath,
			aUrlParams;

		if (mParameters && typeof (mParameters) == "object" && !(mParameters instanceof sap.ui.model.Context)) {
			// The object parameter syntax has been used.
			oContext   = mParameters.context;
			mUrlParams = mParameters.urlParameters;
			bAsync     = mParameters.async !== false; // Defaults to true...
			fnSuccess  = mParameters.success;
			fnError    = mParameters.error;
			aFilters   = mParameters.filters;
			aSorters   = mParameters.sorters;
		} else {
			// Legacy parameter syntax is used
			oContext   = mParameters;
			mUrlParams = arguments[2];
			bAsync     = arguments[3] !== false; // Defaults to true...
			fnSuccess  = arguments[4];
			fnError    = arguments[5];
		}

		// bAsync default is true ?!
		bAsync = bAsync !== false;

		aUrlParams = ODataUtils._createUrlParamsArray(mUrlParams);

		// Add filter/sorter to URL parameters
		sSorterParams = ODataUtils.createSortParams(aSorters);
		if (sSorterParams) { aUrlParams.push(sSorterParams); }

		if (aFilters && !this.oMetadata) {
			jQuery.sap.log.fatal("Tried to use filters in read method before metadata is available.");
		} else {
			sResolvedPath = this._normalizePath(sPath, oContext);
			oEntityType = this.oMetadata && this.oMetadata._getEntityTypeByPath(sResolvedPath);
			sFilterParams = ODataUtils.createFilterParams(aFilters, this.oMetadata, oEntityType);
			if (sFilterParams) { aUrlParams.push(sFilterParams); }
		}

		sUrl = this._createRequestUrl(sPath, oContext, aUrlParams, this.bUseBatch);
		oRequest = this._createRequest(sUrl, "GET", bAsync);

		if (this.bUseBatch) {
			oBatchRequest = this._createBatchRequest([oRequest], bAsync);
			oRequestHandle = this._submitRequest(oBatchRequest, this.bUseBatch, fnSuccess, fnError, true);
		} else {
			oRequestHandle = this._submitRequest(oRequest, this.bUseBatch, fnSuccess, fnError);
		}
		return oRequestHandle;
	};

	/**
	 * Creates a single batch operation (read or change operation) which can be used in a batch request.
	 *
	 * @param {string} sPath A string containing the path to the collection or entry where the batch operation should be performed.
	 * 						The path is concatenated to the sServiceUrl which was specified in the model constructor.
	 * @param {string} sMethod for the batch operation. Possible values are GET, PUT, MERGE, POST, DELETE
	 * @param {object} [oData] optional data payload which should be created, updated, deleted in a change batch operation.
	 * @param {object} [oParameters] optional parameter for additional information introduced in SAPUI5 1.9.1,
	 * @param {string} [oParameters.sETag] an ETag which can be used for concurrency control. If it is specified,
	 *                  it will be used in an If-Match-Header in the request to the server for this entry.
	 * @public
	 */
	ODataModel.prototype.createBatchOperation = function(sPath, sMethod, oData, oParameters) {
		var oChangeHeader = {}, sETag, oStoredEntry, sKey, oEntityType;

		jQuery.extend(oChangeHeader, this.mCustomHeaders, this.oHeaders);

		// for batch remove starting / if any
		if (jQuery.sap.startsWith(sPath, "/")) {
			sPath = sPath.substr(1);
		}

		if (oParameters) {
			sETag = oParameters.sETag;
		}

		if (sMethod != "GET") {
			sETag = this._getETag(sPath, oData, sETag);
			if (sETag) {
				oChangeHeader["If-Match"] = sETag;
			}
		}
		// make sure to set content type header for POST/PUT requests when using JSON format to prevent datajs to add "odata=verbose" to the content-type header
		// may be removed as later gateway versions support this
		if (this.bJSON) {
			if (sMethod != "DELETE" && sMethod != "GET" && this.sMaxDataServiceVersion === "2.0") {
				oChangeHeader["Content-Type"] = "application/json";
			}
		} else {
			// for XML case set the content-type accordingly so that the data is transformed to XML in the batch part
			oChangeHeader["Content-Type"] = "application/atom+xml";
		}

		var oRequest = {
			requestUri: sPath,
			method: sMethod.toUpperCase(),
			headers: oChangeHeader
		};

		if (oData) {
			oRequest.data = oData;
		}

		if (sMethod != "GET" && sMethod != "POST") {
			if (sPath && sPath.indexOf("/") != 0) {
				sPath = '/' + sPath;
			}
			oStoredEntry = this._getObject(sPath);
			if (oStoredEntry) {
				sKey = this._getKey(oStoredEntry);
				oRequest.keys = {};
				oRequest.keys[sKey] = true;
			}
		} else if (sMethod == "POST") {
			// remove URL params
			var sNormalizedPath = sPath;
			if (sPath.indexOf('?') != -1 ) {
				sNormalizedPath = sPath.substr(0, sPath.indexOf('?'));
			}
			oEntityType = this.oMetadata._getEntityTypeByPath(sNormalizedPath);
			if (oEntityType) {
				oRequest.entityTypes = {};
				oRequest.entityTypes[oEntityType.entityType] = true;
			}
		}
		return oRequest;
	};

	/**
	 * Appends the read batch operations to the end of the batch stack. Only GET batch operations should be included in the specified array.
	 * If an illegal batch operation is added to the batch nothing will be performed and false will be returned.
	 *
	 * @param {any[]} aReadOperations an array of read batch operations created via <code>createBatchOperation</code> and <code>sMethod</code> = GET
	 *
	 * @public
	 */
	ODataModel.prototype.addBatchReadOperations = function(aReadOperations) {
		if (!jQuery.isArray(aReadOperations) || aReadOperations.length <= 0) {
			jQuery.sap.log.warning("No array with batch operations provided!");
			return false;
		}
		var that = this;
		jQuery.each(aReadOperations, function(iIndex, oReadOperation) {
			if (oReadOperation.method != "GET") {
				jQuery.sap.log.warning("Batch operation should be a GET operation!");
				return false;
			}
			that.aBatchOperations.push(oReadOperation);
		});
	};

	/**
	 * Appends the change batch operations to the end of the batch stack. Only PUT, POST or DELETE batch operations should be included in the specified array.
	 * The operations in the array will be included in a single changeset. To embed change operations in different change sets call this method with the corresponding change operations again.
	 * If an illegal batch operation is added to the change set nothing will be performed and false will be returned.
	 *
	 * @param {any[]} aChangeOperations an array of change batch operations created via <code>createBatchOperation</code> and <code>sMethod</code> = POST, PUT, MERGE or DELETE
	 *
	 * @public
	 */
	ODataModel.prototype.addBatchChangeOperations = function(aChangeOperations) {
		if (!jQuery.isArray(aChangeOperations) || aChangeOperations.length <= 0) {
			return false;
		}
		jQuery.each(aChangeOperations, function(iIndex, oChangeOperation) {
			if (oChangeOperation.method != "POST" && oChangeOperation.method != "PUT" && oChangeOperation.method != "MERGE" && oChangeOperation.method != "DELETE") {
				jQuery.sap.log.warning("Batch operation should be a POST/PUT/MERGE/DELETE operation!");
				return false;
			}
		});
		this.aBatchOperations.push({ __changeRequests : aChangeOperations });
	};

	/**
	 * Removes all operations in the current batch.
	 * @public
	 */
	ODataModel.prototype.clearBatch = function() {
		this.aBatchOperations = [];
	};

	/**
	 * Submits the collected changes in the batch which were collected via <code>addBatchReadOperations</code> or <code>addBatchChangeOperations</code>.
	 * The batch will be cleared afterwards. If the batch is empty no request will be performed and false will be returned.
	 * Note: No data will be stored in the model.
	 *
	 * @param {function} [fnSuccess] a callback function which is called when the batch request has
	 *            					 been successfully sent. Note: There might have errors occured in the single batch operations. These errors can be accessed in the
	 *            aErrorResponses parameter in the callback handler.
	 *            The handler can have the
	 *            	                 following parameters: oData, oResponse and aErrorResponses.
	 *
	 * @param {function} [fnError] a callback function which is called when the batch request failed. The handler can have the parameter: oError which contains
	 * additional error information.
	 * @param {boolean} [bAsync] true for asynchronous request. Default is true.
	 *
	 * @param {boolean} bImportData
	 * @return {object} an object which has an <code>abort</code> function to abort the current request. Returns false if no request will be performed because the batch is empty.
	 *
	 * @public
	 */
	ODataModel.prototype.submitBatch = function(fnSuccess, fnError, bAsync, bImportData) {
		var oRequest, oRequestHandle, that = this;

		function _handleSuccess(oData, oResponse) {
			if (fnSuccess) {
				fnSuccess(oData, oResponse, that._getBatchErrors(oData));
			}
		}

		// ensure compatibility with old declaration: // bAsync, fnSuccess, fnError
		if (!(typeof (fnSuccess) == "function")) {
			var fnOldError = bAsync;
			var fnOldSuccess = fnError;
			bAsync = fnSuccess;
			fnSuccess = fnOldSuccess;
			fnError = fnOldError;
		}

		// bAsync default is true ?!
		bAsync = bAsync !== false;

		if (this.aBatchOperations.length <= 0) {
			jQuery.sap.log.warning("No batch operations in batch. No request will be triggered!");
			return false;
		}
		oRequest = this._createBatchRequest(this.aBatchOperations, bAsync);
		oRequestHandle = this._submitRequest(oRequest, true, _handleSuccess, fnError, false, bImportData);
		this.clearBatch();
		return oRequestHandle;
	};

	/**
	 * Return the metadata object. Please note that when using the model with bLoadMetadataAsync = true then this function might return undefined because the
	 * metadata has not been loaded yet.
	 * In this case attach to the <code>metadataLoaded</code> event to get notified when the metadata is available and then call this function.
	 *
	 * @return {Object} metdata object
	 * @public
	 */
	ODataModel.prototype.getServiceMetadata = function() {
		if (this.oMetadata && this.oMetadata.isLoaded()) {
			return this.oMetadata.getServiceMetadata();
		}
	};

	/**
	 * Return the annotation object. Please note that when using the model with bLoadMetadataAsync = true then this function might return undefined because the
	 * metadata has not been loaded yet.
	 * In this case attach to the <code>annotationsLoaded</code> event to get notified when the annotations are available and then call this function.
	 *
	 * @return {Object} metdata object
	 * @public
	 * @experimental This feature has not been tested due to the lack of OData testing infrastructure. The API is NOT stable yet. Use at your own risk.
	 */
	ODataModel.prototype.getServiceAnnotations = function() {
		if (this.oAnnotations && this.oAnnotations.getAnnotationsData) {
			return this.oAnnotations.getAnnotationsData();
		}
	};

	/**
	 * Submits the collected changes which were collected by the setProperty method. A MERGE request will be triggered to only update the changed properties.
	 * If a URI with a $expand System Query Option was used then the expand entries will be removed from the collected changes.
	 * Changes to this entries should be done on the entry itself. So no deep updates are supported.
	 *
	 * @param {function} [fnSuccess] a callback function which is called when the data has
	 *            					 been successfully updated. The handler can have the
	 *            	                 following parameters: oData and response.
	 * @param {function} [fnError] a callback function which is called when the request failed. The handler can have the parameter: oError which contains
	 * additional error information
	 * @param {object} [oParameters] optional parameter for additional information introduced in SAPUI5 1.9.1
	 * @param {string} [oParameters.sETag] an ETag which can be used for concurrency control. If it is specified, it will be used in an If-Match-Header in the request to the server for this entry.
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.submitChanges = function(fnSuccess, fnError, oParameters) {

		var oRequest, oPayload, that = this, sPath, sETag, sType, sMetadataETag, oStoredEntry, sKey;

		if (this.sChangeKey) {
			sPath = this.sChangeKey.replace(this.sServiceUrl,'');
			oStoredEntry = this._getObject(sPath);
			oPayload = oStoredEntry;

			if (jQuery.isPlainObject(oStoredEntry)) {
				// do a copy of the payload or the changes will be deleted in the model as well (reference)
				oPayload = jQuery.sap.extend(true, {}, oStoredEntry);
				// remove metadata, navigation properties to reduce payload
				if (oPayload.__metadata) {
					sType = oPayload.__metadata.type;
					sMetadataETag = oPayload.__metadata.etag;
					delete oPayload.__metadata;
					if (sType || sMetadataETag) {
						oPayload.__metadata = {};
					}
					// type information may be needed by an odata service!!!
					if (sType) {
						oPayload.__metadata.type = sType;
					}
					// etag information may be needed by an odata service, too!!!
					if (!!sMetadataETag) {
						oPayload.__metadata.etag = sMetadataETag;
					}
				}
				jQuery.each(oPayload, function(sPropName, oPropValue) {
					if (oPropValue && oPropValue.__deferred) {
						delete oPayload[sPropName];
					}
				});

				// delete expand properties = navigation properties
				var oEntityType = this.oMetadata._getEntityTypeByPath(sPath);
				if (oEntityType) {
					var aNavProps = this.oMetadata._getNavigationPropertyNames(oEntityType);
					jQuery.each(aNavProps, function(iIndex, sNavPropName) {
						delete oPayload[sNavPropName];
					});
				}
				// remove any yet existing references which should already have been deleted
				oPayload = this._removeReferences(oPayload);
			}
			if (oParameters && oParameters.sETag) {
				sETag = oParameters.sETag;
			}

			oRequest = this._createRequest(this.sChangeKey, "MERGE", true, oPayload, sETag);
			if (this.sUrlParams) {
				oRequest.requestUri += "?" + this.sUrlParams;
			}

			//get entry from model. If entry exists get key for update bindings
			oRequest.keys = {};
			if (oStoredEntry) {
				sKey = this._getKey(oStoredEntry);
				oRequest.keys[sKey] = true;
			}

			this.oRequestQueue[this.sChangeKey] = oRequest;
		}

		if (jQuery.isEmptyObject(this.oRequestQueue)) {
			return undefined;
		}

		if (this.bUseBatch) {
			var aChangeRequests = [];
			jQuery.each(this.oRequestQueue, function(sKey, oCurrentRequest){
				delete oCurrentRequest._oRef;
				var oReqClone = jQuery.sap.extend(true, {}, oCurrentRequest);
				oCurrentRequest._oRef = oReqClone;

				oReqClone.requestUri = oReqClone.requestUri.replace(that.sServiceUrl + '/','');
				oReqClone.data._bCreate ? delete oReqClone.data._bCreate : false;
				aChangeRequests.push(oReqClone);
			});

			oRequest = this._createBatchRequest([{__changeRequests:aChangeRequests}], true);
			this._submitRequest(oRequest, this.bUseBatch, fnSuccess, fnError, true);
		} else {
			//loop request queue
			jQuery.each(this.oRequestQueue, function(sKey, oCurrentRequest){
				// clone request and store the clone as reference to compare it in updateRequestQueue.
				// We send the cloned request which will be modified by datajs but we want to keep the original request stored
				// because it may fail and we need to send the request again.
				delete oCurrentRequest._oRef;
				var oReqClone = jQuery.sap.extend(true, {}, oCurrentRequest);
				oCurrentRequest._oRef = oReqClone;
				//remove create flag
				 if (oReqClone.data && oReqClone.data._bCreate) {
					 delete oReqClone.data._bCreate;
				 }

				that._submitRequest(oReqClone, this.bUseBatch, fnSuccess, fnError, true);
			});
		}
		return undefined;
	};

	/*
	 * updateRequestQueue
	 * @private
	 */
	ODataModel.prototype._updateRequestQueue = function(oRequest, bBatch) {
		var aBatchRequests,
			aChangeRequests,
			oChangeRequest,
			that = this;

		if (bBatch) {
			aBatchRequests = oRequest.data.__batchRequests;
			if (aBatchRequests) {
				for (var i = 0; i < aBatchRequests.length; i++) {
					// get change requests and corresponding responses - the latter are in the same order as the requests according to odata spec
					aChangeRequests = aBatchRequests[i].__changeRequests;
					if (aChangeRequests) {
						for (var j = 0; j < aChangeRequests.length; j++) {
							oChangeRequest = aChangeRequests[j];
							/*eslint-disable no-loop-func */
							jQuery.each(this.oRequestQueue, function(sKey,oCurrentRequest) {
								if (oCurrentRequest._oRef === oChangeRequest && sKey !== that.sChangeKey) {
									delete that.oRequestQueue[sKey];
									delete that.oData[sKey];
									delete that.mContexts["/" + sKey];
								} else if (that.sChangeKey && sKey === that.sChangeKey) {
									delete that.oRequestQueue[sKey];
									that.sChangeKey = null;
								}
							});
							/*eslint-enable no-loop-func */
						}
					}
				}
			}
		} else {
			jQuery.each(this.oRequestQueue, function(sKey,oCurrentRequest) {
				if (oCurrentRequest._oRef === oRequest && sKey !== that.sChangeKey) {
					delete that.oRequestQueue[sKey];
					delete that.oData[sKey];
					delete that.mContexts["/" + sKey];
				} else if (that.sChangeKey && sKey === that.sChangeKey) {
					delete that.oRequestQueue[sKey];
					that.sChangeKey = null;
				}
			});
		}
	};

	/**
	 *
	 * Resets the collected changes by the setProperty method and reloads the data from the server.
	 *
	 * @param {function} [fnSuccess] a callback function which is called when the data has
	 *            					 been successfully resetted. The handler can have the
	 *            	                 following parameters: oData and response.
	 * @param {function} [fnError] a callback function which is called when the request failed
	 *
	 * @public
	 */
	ODataModel.prototype.resetChanges = function(fnSuccess, fnError) {

		var sPath;
		if (this.sChangeKey) {
			sPath = this.sChangeKey.replace(this.sServiceUrl,'');
			this._loadData(sPath, null, fnSuccess, fnError);
		}
	};

	/**
	 * Sets a new value for the given property <code>sPropertyName</code> in the model without triggering a server request.
	 *  This can be done by the submitChanges method.
	 *
	 *  Note: Only one entry of one collection can be updated at once. Otherwise a fireRejectChange event is fired.
	 *
	 *  Before updating a different entry the existing changes of the current entry have to be submitted or resetted by the
	 *  corresponding methods: submitChanges, resetChanges.
	 *
	 *  IMPORTANT: All pending changes are resetted in the model if the application triggeres any kind of refresh
	 *  on that entry. Make sure to submit the pending changes first. To determine if there are any pending changes call the hasPendingChanges method.
	 *
	 * @param {string}  sPath path of the property to set
	 * @param {any}     oValue value to set the property to
	 * @param {object} [oContext=null] the context which will be used to set the property
	 * @param {boolean} [bAsyncUpdate] whether to update other bindings dependent on this property asynchronously
	 * @return {boolean} true if the value was set correctly and false if errors occurred like the entry was not found or another entry was already updated.
	 * @public
	 */
	ODataModel.prototype.setProperty = function(sPath, oValue, oContext, bAsyncUpdate) {

		var sProperty, oEntry = { }, oData = { },
			sChangeKey = this._createRequestUrl(sPath, oContext),
			sObjectPath = sPath.substring(0, sPath.lastIndexOf("/")),
			sKey, aPathSegments,
			mChangedEntities = {},
			success = false;

		// check if path / context is valid
		if (!this.resolve(sPath, oContext) ) {
			return false;
		}

		// extract the Url that points to the 'entry'. We need to do this if a complex type will be updated.
		sChangeKey = sChangeKey.replace(this.sServiceUrl + '/','');
		sChangeKey = sChangeKey.substring(0, sChangeKey.indexOf("/"));
		sChangeKey = this.sServiceUrl + '/' + sChangeKey;

		sProperty = sPath.substr(sPath.lastIndexOf("/") + 1);

		oData = this._getObject(sObjectPath, oContext);
		if (!oData) {
			return false;
		}

		//check all path segments to find the entity; The last segment can also point to a complex type
		aPathSegments = sObjectPath.split("/");
		for (var i = aPathSegments.length - 1; i >= 0; i--) {
			oEntry = this._getObject(aPathSegments.join("/"), oContext);
			if (oEntry) {
				sKey = this._getKey(oEntry);
				if (sKey) {
					break;
				}
			}
			aPathSegments.splice(i - 1,1);
		}

		if (!sKey) {
			sKey = this._getKey(oContext);
		}

		if (sKey) {
			mChangedEntities[sKey] = true;
		}

		if (oData._bCreate) {
			oData[sProperty] = oValue;
			success = true;
			this.checkUpdate(false, bAsyncUpdate, mChangedEntities);
		} else {
			if (!this.sChangeKey) {
				this.sChangeKey = sChangeKey;
			}

			if (this.sChangeKey == sChangeKey) {
				oData[sProperty] = oValue;
				success = true;
				this.checkUpdate(false, bAsyncUpdate, mChangedEntities);
			} else {
				this.fireRejectChange(
						{rejectedValue : oValue,
							oldValue: oData[sProperty]}
				);
			}
		}
		return success;

	};


	ODataModel.prototype._isHeaderPrivate = function(sHeaderName) {
		// case sensitive check needed to make sure private headers cannot be overridden by difference in the upper/lower case (e.g. accept and Accept).
		switch (sHeaderName.toLowerCase()) {
			case "accept":
			case "accept-language":
			case "maxdataserviceversion":
			case "dataserviceversion":
				return true;
			case "x-csrf-token":
				return this.bTokenHandling;
			default:
				return false;
		}
	};

	/**
	 * Set custom headers which are provided in a key/value map. These headers are used for requests against the OData backend.
	 * Private headers which are set in the ODataModel cannot be modified.
	 * These private headers are: accept, accept-language, x-csrf-token, MaxDataServiceVersion, DataServiceVersion.
	 *
	 * To remove these headers simply set the mCustomHeaders parameter to null. Please also note that when calling this method again all previous custom headers
	 * are removed unless they are specified again in the mCustomHeaders parameter.
	 *
	 * @param {object} mHeaders the header name/value map.
	 * @public
	 */
	ODataModel.prototype.setHeaders = function(mHeaders) {
		var mCheckedHeaders = {},
			that = this;
		if (mHeaders) {
			jQuery.each(mHeaders, function(sHeaderName, sHeaderValue){
				// case sensitive check needed to make sure private headers cannot be overridden by difference in the upper/lower case (e.g. accept and Accept).
				if (that._isHeaderPrivate(sHeaderName)) {
					jQuery.sap.log.warning("Not allowed to modify private header: " + sHeaderName);
				} else {
					mCheckedHeaders[sHeaderName] = sHeaderValue;
				}
			});
			this.mCustomHeaders = mCheckedHeaders;

		} else {
			this.mCustomHeaders = {};
		}

		// Custom set headers should also be used when requesting annotations, but do not instantiate annotations just for this
		if (this.oAnnotations) {
			this.oAnnotations.setHeaders(this.mCustomHeaders);
		}
	};

	/**
	 * Returns all headers and custom headers which are stored in the OData model.
	 * @return {object} the header map
	 * @public
	 */
	ODataModel.prototype.getHeaders = function() {
		return jQuery.extend({}, this.mCustomHeaders, this.oHeaders);
	};

	/**
	 * Searches the specified headers map for the specified header name and returns the found header value
	 */
	ODataModel.prototype._getHeader = function(sFindHeader, mHeaders) {
		var sHeaderName;
		for (sHeaderName in mHeaders) {
			if (sHeaderName.toLowerCase() === sFindHeader.toLowerCase()) {
				return mHeaders[sHeaderName];
			}
		}
		return null;
	};

	/**
	 * Checks if there exist pending changes in the model created by the setProperty method.
	 * @return {boolean} true/false
	 * @public
	 */
	ODataModel.prototype.hasPendingChanges = function() {
		return this.sChangeKey != null;
	};

	/**
	 * update all bindings
	 * @param {boolean} [bForceUpdate=false] If set to false an update  will only be done when the value of a binding changed.
	 * @public
	 */
	ODataModel.prototype.updateBindings = function(bForceUpdate) {
		this.checkUpdate(bForceUpdate);
	};

	/**
	 * Force no caching
	 * @param {boolean} [bForceNoCache=false] whether to force no caching
	 * @public
	 * @deprecated The caching should be controlled by the backend by setting the correct cache control header
	 */
	ODataModel.prototype.forceNoCache = function(bForceNoCache) {
		this.bCache = !bForceNoCache;
	};

	/**
	 * Enable/Disable XCSRF-Token handling
	 * @param {boolean} [bTokenHandling=true] whether to use token handling or not
	 * @public
	 */
	ODataModel.prototype.setTokenHandlingEnabled  = function(bTokenHandling) {
		this.bTokenHandling = bTokenHandling;
	};

	/**
	 * Enable/Disable batch for all requests
	 * @param {boolean} [bUseBatch=false] whether the requests should be encapsulated in a batch request
	 * @public
	 */
	ODataModel.prototype.setUseBatch  = function(bUseBatch) {
		this.bUseBatch = bUseBatch;
	};

	/**
	 * Formats a JavaScript value according to the given
	 * <a href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * EDM type</a>.
	 *
	 * @param {any} vValue the value to format
	 * @param {string} sType the EDM type (e.g. Edm.Decimal)
	 * @return {string} the formatted value
	 */
	ODataModel.prototype.formatValue = function(vValue, sType) {
		return ODataUtils.formatValue(vValue, sType);
	};

	/**
	 * Deletes a created entry from the request queue and the model.
	 * @param {sap.ui.model.Context} oContext The context object pointing to the created entry
	 * @public
	 */
	ODataModel.prototype.deleteCreatedEntry = function(oContext) {
		if (oContext) {
			var sPath = oContext.getPath();
			delete this.mContexts[sPath]; // contexts are stored starting with /
			// remove starting / if any
			if (jQuery.sap.startsWith(sPath, "/")) {
				sPath = sPath.substr(1);
			}
			delete this.oRequestQueue[sPath];
			delete this.oData[sPath];

		}
	};

	/**
	 * Creates a new entry object which is described by the metadata of the entity type of the
	 * specified sPath Name. A context object is returned which can be used to bind
	 * against the newly created object.
	 *
	 * For each created entry a request is created and stored in a request queue.
	 * The request queue can be submitted by calling submitChanges. To delete a created
	 * entry from the request queue call deleteCreateEntry.
	 *
	 * The optional vProperties parameter can be used as follows:
	 *
	 *   - vProperties could be an array containing the property names which should be included
	 *     in the new entry. Other properties defined in the entity type are not included.
	 *   - vProperties could be an object which includes the desired properties and the values
	 *     which should be used for the created entry.
	 *
	 * If vProperties is not specified, all properties in the entity type will be included in the
	 * created entry.
	 *
	 * If there are no values specified the properties will have undefined values.
	 *
	 * Please note that deep creates (including data defined by navigationproperties) are not supported
	 *
	 * @param {String} sPath Name of the path to the collection
	 * @param {array|object} vProperties An array that specifies a set of properties or the entry
	 * @return {sap.ui.model.Context} oContext A Context object that point to the new created entry.
	 * @public
	 */
	ODataModel.prototype.createEntry = function(sPath, vProperties) {
		var oEntity = {},
			sKey,
			sUrl,
			oRequest;

		if (!jQuery.sap.startsWith(sPath, "/")) {
			sPath = "/" + sPath;
		}
		var oEntityMetadata = this.oMetadata._getEntityTypeByPath(sPath);
		if (!oEntityMetadata) {
			jQuery.sap.assert(oEntityMetadata, "No Metadata for collection " + sPath + " found");
			return undefined;
		}
		if (typeof vProperties === "object" && !jQuery.isArray(vProperties)) {
			oEntity = vProperties;
		} else {
			for (var i = 0; i < oEntityMetadata.property.length; i++) {
				var oPropertyMetadata = oEntityMetadata.property[i];

				var bPropertyInArray = jQuery.inArray(oPropertyMetadata.name,vProperties) > -1;
				if (!vProperties || bPropertyInArray)  {
					oEntity[oPropertyMetadata.name] = this._createPropertyValue(oPropertyMetadata.type);
					if (bPropertyInArray) {
						vProperties.splice(vProperties.indexOf(oPropertyMetadata.name),1);
					}
				}
			}
			if (vProperties) {
				jQuery.sap.assert(vProperties.length === 0, "No metadata for the following properties found: " + vProperties.join(","));
			}
		}
		//mark as entity for create; we need this for setProperty
		oEntity._bCreate = true;

		// remove starting / for key only
		sKey = sPath.substring(1) + "('" + jQuery.sap.uid() + "')";

		this.oData[sKey] = oEntity;

		oEntity.__metadata = {type: "" + oEntityMetadata.entityType};

		sUrl = this._createRequestUrl(sPath);

		oRequest = this._createRequest(sUrl, "POST", true, oEntity);

		oRequest.entityTypes = {};
		oRequest.entityTypes[oEntityMetadata.entityType] = true;

		this.oRequestQueue[sKey] = oRequest;

		return this.getContext("/" + sKey); // context wants a path
	};

	/**
	 * Return value for a property. This can also be a ComplexType property
	 * @param {string} full qualified Type name
	 * @returns {any} vValue The property value
	 * @private
	 */
	ODataModel.prototype._createPropertyValue = function(sType) {
		var aTypeName = this.oMetadata._splitName(sType); // name, namespace
		var sNamespace = aTypeName[1];
		var sTypeName = aTypeName[0];
		if (sNamespace.toUpperCase() !== 'EDM') {
			var oComplexType = {};
			var oComplexTypeMetadata = this.oMetadata._getObjectMetadata("complexType",sTypeName,sNamespace);
			jQuery.sap.assert(oComplexTypeMetadata, "Complex type " + sType + " not found in the metadata !");
			for (var i = 0; i < oComplexTypeMetadata.property.length; i++) {
				var oPropertyMetadata = oComplexTypeMetadata.property[i];
				oComplexType[oPropertyMetadata.name] = this._createPropertyValue(oPropertyMetadata.type);
			}
			return oComplexType;
		} else {
			return this._getDefaultPropertyValue(sTypeName,sNamespace);
		}
	};

	/**
	 * Returns the default value for a property
	 * @param {string} sType
	 * @param {string} sNamespace
	 * @private
	 */
	ODataModel.prototype._getDefaultPropertyValue = function(sType, sNamespace) {
		return undefined;
	};

	/**
	 * remove url params from path and make path absolute if not already
	 */
	ODataModel.prototype._normalizePath = function(sPath, oContext) {

		// remove query params from path if any
		if (sPath && sPath.indexOf('?') != -1 ) {
			sPath = sPath.substr(0, sPath.indexOf('?'));
		}

		if (!oContext && !jQuery.sap.startsWith(sPath,"/")) {
			// we need to add a / due to compatibility reasons; but only if there is no context
			sPath = '/' + sPath;
			jQuery.sap.log.warning(this + " path " + sPath + " should be absolute if no Context is set");
		}
		return this.resolve(sPath, oContext);
	};


	/**
	 * Enable/Disable automatic updates of all Bindings after change operations
	 * @param {boolean} bRefreshAfterChange
	 * @public
	 * @since 1.16.3
	 */
	ODataModel.prototype.setRefreshAfterChange = function(bRefreshAfterChange) {
		this.bRefreshAfterChange = bRefreshAfterChange;
	};

	ODataModel.prototype.isList = function(sPath, oContext) {
		var sPath = this.resolve(sPath, oContext);
		return sPath && sPath.substr(sPath.lastIndexOf("/")).indexOf("(") === -1;
	};

	/**
	 * Checks if path points to a metamodel property
	 * @param {string} sPath The binding path
	 * @returns {boolean}
	 * @private
	 */
	ODataModel.prototype.isMetaModelPath = function(sPath) {
		return sPath.indexOf("##") == 0 || sPath.indexOf("/##") > -1;
	};

	/**
	 * Wraps the OData.request method and keeps track of pending requests
	 *
	 * @private
	 */
	ODataModel.prototype._request = function(oRequest, fnSuccess, fnError, oHandler, oHttpClient, oMetadata) {

		if (this.bDestroyed) {
			return {
				abort: function() {}
			};
		}

		var that = this;

		function wrapHandler(fn) {
			return function() {
				// request finished, remove request handle from pending request array
				var iIndex = jQuery.inArray(oRequestHandle, that.aPendingRequestHandles);
				if (iIndex > -1) {
					that.aPendingRequestHandles.splice(iIndex, 1);
				}

				// call original handler method
				if (!(oRequestHandle && oRequestHandle.bSuppressErrorHandlerCall)) {
					fn.apply(this, arguments);
				}
			};
		}

		// create request with wrapped handlers
		var oRequestHandle = OData.request(
				oRequest,
				wrapHandler(fnSuccess || OData.defaultSuccess),
				wrapHandler(fnError || OData.defaultError),
				oHandler,
				oHttpClient,
				oMetadata
		);

		// add request handle to array and return it (only for async requests)
		if (oRequest.async !== false) {
			this.aPendingRequestHandles.push(oRequestHandle);
		}

		return oRequestHandle;
	};

	/**
	 * @see sap.ui.model.Model.prototype.destroy
	 * @public
	 */
	ODataModel.prototype.destroy = function() {
		this.bDestroyed = true;

		// Abort pending requests
		if (this.aPendingRequestHandles) {
			for (var i = this.aPendingRequestHandles.length - 1; i >= 0; i--) {
				var oRequestHandle = this.aPendingRequestHandles[i];
				if (oRequestHandle && oRequestHandle.abort) {
					oRequestHandle.bSuppressErrorHandlerCall = true;
					oRequestHandle.abort();
				}
			}
			delete this.aPendingRequestHandles;
		}
		if (!!this.oMetadataLoadEvent) {
			jQuery.sap.clearDelayedCall(this.oMetadataLoadEvent);
		}
		if (!!this.oMetadataFailedEvent) {
			jQuery.sap.clearDelayedCall(this.oMetadataFailedEvent);
		}

		if (this.oMetadata) {
			this.oMetadata.detachLoaded(this.onMetadataLoaded);
			this.oMetadata.detachFailed(this.onMetadataFailed);
			// Only destroy metadata, if request is still running and no other models
			// are registered to it
			if (!this.oMetadata.isLoaded() && !this.oMetadata.hasListeners("loaded")) {
				this.oMetadata.destroy();
				delete this.oServiceData.oMetadata;
			}
			delete this.oMetadata;
		}


		if (this.oAnnotations) {
			this.oAnnotations.detachFailed(this.onAnnotationsFailed);
			this.oAnnotations.detachLoaded(this.onAnnotationsLoaded);
			this.oAnnotations.destroy();
			delete this.oAnnotations;
		}

		Model.prototype.destroy.apply(this, arguments);
	};
	
	/**
	 * Singleton Lazy loading of the annotation parser on demand
	 *
	 * @return {sap.ui.model.odata.Annotations} The annotation parser instance
	 */
	ODataModel.prototype._getAnnotationParser = function(mAnnotationData) {
		if (!this.oAnnotations) {
			jQuery.sap.require("sap.ui.model.odata.ODataAnnotations");
			this.oAnnotations = new sap.ui.model.odata.ODataAnnotations({
				annotationData: mAnnotationData,
				url: null,
				metadata: this.oMetadata,
				async: this.bLoadMetadataAsync,
				headers: this.mCustomHeaders
			});
			this.oAnnotations.attachFailed(this.onAnnotationsFailed, this);
			this.oAnnotations.attachLoaded(this.onAnnotationsLoaded, this);
		}

		return this.oAnnotations;
	};
	
	ODataModel.prototype.onAnnotationsFailed = function(oEvent) {
		this.fireAnnotationsFailed(oEvent.getParameters());
	};
	
	ODataModel.prototype.onAnnotationsLoaded = function(oEvent) {
		this.fireAnnotationsLoaded(oEvent.getParameters());
	};
	
	/**
	 * Adds (a) new URL(s) to the be parsed for OData annotations, which are then merged into the annotations object
	 * which can be retrieved by calling the getServiceAnnotations()-method. If a $metadata url is passed the data will 
	 * also be merged into the metadata object, which can be reached by calling the getServiceMetadata() method.
	 *
	 * @param {string|sting[]} vUrl - Either one URL as string or an array or URL strings
	 * @return {Promise} The Promise to load the given URL(s), resolved if all URLs have been loaded, rejected if at least one fails to load. 
	 * 					 If this promise resolves it returns the following parameters:
	 * 					 annotations: The annotation object
	 * 					 entitySets: An array of EntitySet objects containing the newly merged EntitySets from a $metadata requests. 
	 * 								 the structure is the same as in the metadata object reached by the getServiceMetadata() method.
	 * 								 For non $metadata requests the array will be empty.
	 * 					
	 * @protected
	 */
	ODataModel.prototype.addAnnotationUrl = function(vUrl) {
		var aUrls = [].concat(vUrl),
			aMetadataUrls = [],
			aAnnotationUrls = [],
			aEntitySets = [],
			that = this;

		jQuery.each(aUrls, function(i, sUrl) {
			var iIndex = sUrl.indexOf("$metadata");
			if (iIndex >= 0) {
				//add serviceUrl for relative metadata urls
				if (iIndex == 0) {
					sUrl = that.sServiceUrl + '/' + sUrl;
				}
				aMetadataUrls.push(sUrl);
			} else {
				aAnnotationUrls.push(sUrl);
			}
		});

		return this.oMetadata._addUrl(aMetadataUrls).then(function(aParams) {
			return Promise.all(jQuery.map(aParams, function(oParam) {
				aEntitySets = aEntitySets.concat(oParam.entitySets);
				return that.addAnnotationXML(oParam["metadataString"]);
			}));
		}).then(function() {
			return that._getAnnotationParser().addUrl(aAnnotationUrls);
		}).then(function(oParam) {
			return {
				annotations: oParam.annotations,
				entitySets: aEntitySets
			};
		});
	};
	
	/**
	 * Adds new xml content to be parsed for OData annotations, which are then merged into the annotations object which
	 * can be retrieved by calling the getServiceAnnotations()-method.
	 *
	 * @param {string} sXMLContent - The string that should be parsed as annotation XML
	 * @param {boolean} [bSuppressEvents=false] - Whether not to fire annotationsLoaded event on the annotationParser
	 * @return {Promise} The Promise to parse the given XML-String, resolved if parsed without errors, rejected if errors occur
	 * @protected
	 */
	ODataModel.prototype.addAnnotationXML = function(sXMLContent, bSuppressEvents) {
		return new Promise(function(resolve, reject) {
			this._getAnnotationParser().setXML(null, sXMLContent, {
				success:    resolve,
				error:      reject,
				fireEvents: !bSuppressEvents
			});
		}.bind(this));
	};


	/**
	 * Returns an instance of an OData meta model which offers a unified access to both OData v2
	 * meta data and v4 annotations. It uses the existing {@link sap.ui.model.odata.ODataMetadata}
	 * as a foundation and merges v4 annotations from the existing
	 * {@link sap.ui.model.odata.ODataAnnotations} directly into the corresponding model element.
	 *
	 * <b>BEWARE:</b> Access to this OData meta model will fail before the promise returned by
	 * {@link sap.ui.model.odata.ODataMetaModel#loaded loaded} has been resolved!
	 *
	 * @public
	 * @returns {sap.ui.model.odata.ODataMetaModel} The meta model for this ODataModel
	 */
	ODataModel.prototype.getMetaModel = function() {
		var that = this;
		if (!this.oMetaModel) {
			this.oMetaModel = new ODataMetaModel(this.oMetadata, this.oAnnotations, {
				addAnnotationUrl : this.addAnnotationUrl.bind(this),
				annotationsLoadedPromise :
					this.oMetadata.isLoaded() && (!this.oAnnotations || this.oAnnotations.isLoaded())
					? null // stay synchronous
					: this.pAnnotationsLoaded
			});
			// Call checkUpdate when metamodel has been loaded to update metamodel bindings
			this.oMetaModel.loaded().then(function() {
				that.bMetaModelLoaded = true;
				that.checkUpdate(false, false, null, true);
			});
		}
		return this.oMetaModel;
	};

	return ODataModel;

});
