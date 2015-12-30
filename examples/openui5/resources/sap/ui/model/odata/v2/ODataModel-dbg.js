/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * OData-based DataBinding
 *
 * @namespace
 * @name sap.ui.model.odata.v2
 * @public
 */

//Provides class sap.ui.model.odata.v2.ODataModel
sap.ui.define([
		'jquery.sap.global', 
		'sap/ui/model/BindingMode', 'sap/ui/model/Context', 'sap/ui/model/Model', 
		'sap/ui/model/odata/ODataAnnotations', 'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/CountMode', 'sap/ui/model/odata/UpdateMethod', 'sap/ui/model/odata/OperationMode', 
		'./ODataContextBinding', './ODataListBinding', 'sap/ui/model/odata/ODataMetadata', 'sap/ui/model/odata/ODataPropertyBinding', './ODataTreeBinding', 'sap/ui/model/odata/ODataMetaModel', 'sap/ui/core/message/MessageParser', 'sap/ui/model/odata/ODataMessageParser', 'sap/ui/thirdparty/datajs'
	], function(
		jQuery, 
		BindingMode, Context, Model, 
		ODataAnnotations, ODataUtils, CountMode, UpdateMethod, OperationMode, 
		ODataContextBinding, ODataListBinding, ODataMetadata, ODataPropertyBinding, ODataTreeBinding, ODataMetaModel, MessageParser, ODataMessageParser, OData) {

	"use strict";


	/**
	 * Constructor for a new ODataModel.
	 *
	 * @param {string} [sServiceUrl] base uri of the service to request data from; additional URL parameters appended here will be appended to every request
	 * 								can be passed with the mParameters object as well: [mParameters.serviceUrl] A serviceURl is required!
	 * @param {object} [mParameters] (optional) a map which contains the following parameter properties:
	 * @param {boolean} [mParameters.json] if set true request payloads will be JSON, XML for false (default = true),
	 * @param {string} [mParameters.user] user for the service,
	 * @param {string} [mParameters.password] password for service,
	 * @param {map} [mParameters.headers] a map of custom headers like {"myHeader":"myHeaderValue",...},
	 * @param {boolean} [mParameters.tokenHandling] enable/disable XCSRF-Token handling (default = true),
	 * @param {boolean} [mParameters.withCredentials] experimental - true when user credentials are to be included in a cross-origin request. Please note that this works only if all requests are asynchronous.
	 * @param [mParameters.maxDataServiceVersion] (default = '2.0') please use the following string format e.g. '2.0' or '3.0'.
	 * 									OData version supported by the ODataModel: '2.0',
	 * @param {boolean} [mParameters.useBatch] when true all requests will be sent in batch requests (default = true),
	 * @param {boolean} [mParameters.refreshAfterChange] enable/disable automatic refresh after change operations: default = true,
	 * @param  {string|string[]} [mParameters.annotationURI] The URL (or an array of URLs) from which the annotation metadata should be loaded,
	 * @param {boolean} [mParameters.loadAnnotationsJoined] Whether or not to fire the metadataLoaded-event only after annotations have been loaded as well,
	 * @param {map} [mParameters.serviceUrlParams] map of URL parameters - these parameters will be attached to all requests,
	 * @param {map} [mParameters.metadataUrlParams] map of URL parameters for metadata requests - only attached to $metadata request.
	 * @param {string} [mParameters.defaultBindingMode] sets the default binding mode for the model. If not set, sap.ui.model.BindingMode.OneWay is used.
	 * @param {string} [mParameters.defaultCountMode] sets the default count mode for the model. If not set, sap.ui.model.odata.CountMode.Request is used.
	 * @param {string} [mParameters.defaultOperationMode] sets the default operation mode for the model. If not set, sap.ui.model.odata.OperationModel.Server is used.
	 * @param {string} [mParameters.defaultUpdateMethod] sets the default update method which is used for all update requests. If not set, sap.ui.model.odata.UpdateMethod.Merge is used.
	 * @param {map} [mParameters.metadataNamespaces] a map of namespaces (name => URI) used for parsing the service metadata.
	 * @param {boolean} [mParameters.skipMetadataAnnotationParsing] Whether to skip the automated loading of annotations from the metadata document. Loading annotations from metadata does not have any effects (except the lost performance by invoking the parser) if there are not annotations inside the metadata document
	 * @param {bolean} [mParameters.disableHeadRequestForToken=false] Set this flag to true if your service does not support HEAD requests for fetching the service document (and thus the CSRF-token) to avoid sending a HEAD-request before falling back to GET
	 *
	 * @class
	 * Model implementation for oData format
	 *
	 * @extends sap.ui.model.Model
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.model.odata.v2.ODataModel
	 */
	var ODataModel = Model.extend("sap.ui.model.odata.v2.ODataModel", /** @lends sap.ui.model.odata.v2.ODataModel.prototype */ {

		constructor : function(sServiceUrl, mParameters) {
			Model.apply(this, arguments);

			var sUser, sPassword,
			mHeaders, bTokenHandling,
			bWithCredentials, sMaxDataServiceVersion,
			bUseBatch, bRefreshAfterChange, sAnnotationURI, bLoadAnnotationsJoined,
			sDefaultCountMode, sDefaultBindingMode, sDefaultOperationMode, mMetadataNamespaces,
			mServiceUrlParams, mMetadataUrlParams, aMetadataUrlParams, bJSON, oMessageParser,
			bSkipMetadataAnnotationParsing, sDefaultUpdateMethod, bDisableHeadRequestForToken,
			that = this;

			if (typeof (sServiceUrl) === "object") {
				mParameters = sServiceUrl;
				sServiceUrl = mParameters.serviceUrl;
			}

			if (mParameters) {
				sUser = mParameters.user;
				sPassword = mParameters.password;
				mHeaders = mParameters.headers;
				bTokenHandling = mParameters.tokenHandling;
				bWithCredentials = mParameters.withCredentials;
				sMaxDataServiceVersion = mParameters.maxDataServiceVersion;
				bUseBatch = mParameters.useBatch;
				bRefreshAfterChange = mParameters.refreshAfterChange;
				sAnnotationURI = mParameters.annotationURI;
				bLoadAnnotationsJoined = mParameters.loadAnnotationsJoined;
				sDefaultBindingMode = mParameters.defaultBindingMode;
				sDefaultCountMode = mParameters.defaultCountMode;
				sDefaultOperationMode = mParameters.defaultOperationMode;
				mMetadataNamespaces = mParameters.metadataNamespaces;
				mServiceUrlParams = mParameters.serviceUrlParams;
				mMetadataUrlParams = mParameters.metadataUrlParams;
				bJSON = mParameters.json;
				oMessageParser = mParameters.messageParser;
				bSkipMetadataAnnotationParsing = mParameters.skipMetadataAnnotationParsing;
				sDefaultUpdateMethod = mParameters.defaultUpdateMethod;
				bDisableHeadRequestForToken = mParameters.disableHeadRequestForToken;
			}
			this.mSupportedBindingModes = {"OneWay": true, "OneTime": true, "TwoWay":true};
			this.sDefaultBindingMode = sDefaultBindingMode || BindingMode.OneWay;

			this.bJSON = bJSON !== false;
			this.aPendingRequestHandles = [];
			this.aCallAfterUpdate = [];
			this.mRequests = {};
			this.mDeferredRequests = {};
			this.mChangedEntities = {};
			this.mChangeHandles = {};
			this.mDeferredGroups = {};
			this.mLaunderingState = {};
			this.sDefaultUpdateMethod = sDefaultUpdateMethod || UpdateMethod.Merge;

			this.bTokenHandling = bTokenHandling !== false;
			this.bWithCredentials = bWithCredentials === true;
			this.bUseBatch = bUseBatch !== false;
			this.bRefreshAfterChange = bRefreshAfterChange !== false;
			this.sMaxDataServiceVersion = sMaxDataServiceVersion;
			this.bLoadMetadataAsync = true;
			this.bLoadAnnotationsJoined = bLoadAnnotationsJoined !== false;
			this.sAnnotationURI = sAnnotationURI;
			this.sDefaultCountMode = sDefaultCountMode || CountMode.Request;
			this.sDefaultOperationMode = sDefaultOperationMode || OperationMode.Server;
			this.oMetadataLoadEvent = null;
			this.oMetadataFailedEvent = null;
			this.sRefreshGroupId = undefined;
			this.bIncludeInCurrentBatch = false;
			this.bSkipMetadataAnnotationParsing = bSkipMetadataAnnotationParsing;
			this.bDisableHeadRequestForToken = !!bDisableHeadRequestForToken;

			if (oMessageParser) {
				oMessageParser.setProcessor(this);
			}
			this.oMessageParser = oMessageParser;

			//collect internal changes in a deferred group as default
			this.sDefaultChangeGroup = "changes";
			this.setDeferredGroups([this.sDefaultChangeGroup]);
			this.setChangeGroups({"*":{groupId: this.sDefaultChangeGroup}});

			this.oData = {};
			this.oMetadata = null;
			this.oAnnotations = null;
			this.aUrlParams = [];
			
			// Promise for request chaining
			this.pReadyForRequest = Promise.resolve();
			
			// determine the service base url and the url parameters
			this.sServiceUrl = sServiceUrl;
			var aUrlParts = sServiceUrl.split("?");
			if (aUrlParts.length > 1) {
				this.sServiceUrl = aUrlParts[0];
				if (aUrlParts[1]) {
					this.aUrlParams.push(aUrlParts[1]);
				}
			}
			// Remove trailing slash (if any)
			this.sServiceUrl = this.sServiceUrl.replace(/\/$/, "");

			// store user and password
			this.sUser = sUser;
			this.sPassword = sPassword;

			if (sap.ui.getCore().getConfiguration().getStatistics()) {
				// add statistics parameter to every request (supported only on Gateway servers)
				this.aUrlParams.push("sap-statistics=true");
			}

			this.oHeaders = {};
			this.setHeaders(mHeaders);

			// Get/create service specific data container
			aMetadataUrlParams = ODataUtils._createUrlParamsArray(mMetadataUrlParams);
			var sMetadataUrl = this._createRequestUrl("/$metadata", undefined, aMetadataUrlParams);
			this.oServiceData = ODataModel.mServiceData[sMetadataUrl];
			if (!this.oServiceData) {
				ODataModel.mServiceData[sMetadataUrl] = {};
				this.oServiceData = ODataModel.mServiceData[sMetadataUrl];
			}

			if (!this.oServiceData.oMetadata) {
				//create Metadata object
				this.oMetadata = new ODataMetadata(sMetadataUrl,{
					async: this.bLoadMetadataAsync,
					user: this.sUser,
					password: this.sPassword,
					headers: this.mCustomHeaders,
					namespaces: mMetadataNamespaces,
					withCredentials: this.bWithCredentials
				});
				this.oServiceData.oMetadata = this.oMetadata;
			} else {
				this.oMetadata = this.oServiceData.oMetadata;
			}
			
			this.pAnnotationsLoaded = this.oMetadata.loaded();

			if (this.sAnnotationURI || !this.bSkipMetadataAnnotationParsing) {
				// Make sure the annotation parser object is already created and can be used by the MetaModel
				var oAnnotations = this._getAnnotationParser();
				
				if (!this.bSkipMetadataAnnotationParsing) {
					this.pAnnotationsLoaded = this.oMetadata.loaded().then(function(bSuppressEvents, mParams) {
						// Only fire annotationsLoaded event if no further annotation URLs will be loaded
						if (this.bDestroyed) {
							return Promise.reject();
						}
						return this.addAnnotationXML(mParams["metadataString"], bSuppressEvents);
					}.bind(this, !!this.sAnnotationURI));
				}
				
				if (this.sAnnotationURI) {
					this.pAnnotationsLoaded = this.pAnnotationsLoaded
						.then(oAnnotations.addUrl.bind(oAnnotations, this.sAnnotationURI));
				}
			}


			if (mServiceUrlParams) {
				// new URL params used -> add to ones from sServiceUrl
				// do this after the Metadata request is created to not put the serviceUrlParams on this one
				this.aUrlParams = this.aUrlParams.concat(ODataUtils._createUrlParamsArray(mServiceUrlParams));
			}

			this.onMetadataLoaded = function(oEvent){
				that._initializeMetadata();
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
			} else {
				this.oHeaders["Accept"] = "application/atom+xml,application/atomsvc+xml,application/xml";
			}

			// Get CSRF token, if already available
			if (this.bTokenHandling && this.oServiceData.securityToken) {
				this.oHeaders["x-csrf-token"] = this.oServiceData.securityToken;
			}
			this.oHeaders["Accept-Language"] = sap.ui.getCore().getConfiguration().getLanguage();

			// set version to 2.0 because 1.0 does not support e.g. skip/top, inlinecount...
			// states the version of the Open Data Protocol used by the client to generate the request.
			this.oHeaders["DataServiceVersion"] = "2.0";
			// the max version number the client can accept in a response
			this.oHeaders["MaxDataServiceVersion"] = "2.0";
			if (this.sMaxDataServiceVersion) {
				this.oHeaders["MaxDataServiceVersion"] = this.sMaxDataServiceVersion;
			}
		},
		metadata : {
			publicMethods : ["read", "create", "update", "remove", "submitChanges", "getServiceMetadata", "metadataLoaded",
			                 "hasPendingChanges", "refresh", "refreshMetadata", "resetChanges", "setDefaultCountMode",
			                 "setDefaultBindingMode", "getDefaultBindingMode", "getDefaultCountMode",
			                 "setProperty", "getSecurityToken", "refreshSecurityToken", "setHeaders",
			                 "getHeaders", "setUseBatch", "setDeferredBatchGroups", "getDeferredBatchGroups",
			                 "setChangeBatchGroups", "getChangeBatchGroups"]
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
			AnnotationsFailed: "annotationsFailed",

			/**
			 * Depending on the model implementation a RequestFailed should be fired if a batch request to a backend failed.
			 * Contains the parameters:
			 * message, statusCode, statusText and responseText
			 *
			 */
			BatchRequestFailed : "batchRequestFailed",

			/**
			 * Depending on the model implementation a RequestSent should be fired when a batch request to a backend is sent.
			 * Contains Parameters: url, type, async
			 *
			 */
			BatchRequestSent : "batchRequestSent",

			/**
			 * Depending on the model implementation a RequestCompleted should be fired when a batch request to a backend is completed regardless if the request failed or succeeded.
			 * Contains Parameters: url, type, async, success, errorobject
			 *
			 */
			BatchRequestCompleted : "batchRequestCompleted"
	};

	// document event again, as parameters differ from sap.ui.model.Model#event:requestFailed
	/**
	 * The 'requestFailed' event is fired, when data retrieval from a backend failed.
	 *
	 * Note: Subclasses might add additional parameters to the event object. Optional parameters can be omitted.
	 *
	 * @name sap.ui.model.odata.v2.ODataModel#requestFailed
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters

	 * @param {string} oControlEvent.getParameters.ID The request ID
	 * @param {string} oControlEvent.getParameters.url The url which is sent to the backend
	 * @param {string} oControlEvent.getParameters.method The HTTP method
	 * @param {map} oControlEvent.getParameters.headers The request headers
	 * @param {boolean} oControlEvent.getParameters.async If the request is synchronous or asynchronous (if available)
	 * @param {boolean} oControlEvent.getParameters.success Request was successful or not
	 * @param {object} oControlEvent.getParameters.response The response object - empty object if no response
	 * The response object contains the following properties: message, success, headers, statusCode, statusText, responseText
	 * @public
	 */

	// document event again, as parameters differ from sap.ui.model.Model#event:requestSent
	/**
	 * The 'requestSent' event is fired, after a request has been sent to a backend.
	 *
	 * Note: Subclasses might add additional parameters to the event object. Optional parameters can be omitted.
	 *
	 * @name sap.ui.model.odata.v2.ODataModel#requestSent
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.ID The request ID
	 * @param {string} oControlEvent.getParameters.url The url which is sent to the backend
	 * @param {string} oControlEvent.getParameters.method The HTTP method
	 * @param {map} oControlEvent.getParameters.headers The request headers
	 * @param {boolean} oControlEvent.getParameters.async If the request is synchronous or asynchronous (if available)
	 *
	 * @public
	 */

	// document event again, as parameters differ from sap.ui.model.Model#event:requestCompleted
	/**
	 * The 'requestCompleted' event is fired, after a request has been completed (includes receiving a response),
	 * no matter whether the request succeeded or not.
	 *
	 * Note: Subclasses might add additional parameters to the event object. Optional parameters can be omitted.
	 *
	 * @name sap.ui.model.odata.v2.ODataModel#requestCompleted
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.ID The request ID
	 * @param {string} oControlEvent.getParameters.url The url which is sent to the backend
	 * @param {string} oControlEvent.getParameters.method The HTTP method
	 * @param {map} oControlEvent.getParameters.headers The request headers
	 * @param {boolean} oControlEvent.getParameters.success Request was successful or not
	 * @param {boolean} oControlEvent.getParameters.async If the request is synchronous or asynchronous (if available)
	 * @param {object} oControlEvent.getParameters.response The response object - empty object if no response:
	 * The response object contains the following properties: message, success, headers, statusCode, statusText, responseText
	 * @public
	 */


	/**
	 * The 'batchRequestFailed' event is fired, when a batch request failed.
	 *
	 * @name sap.ui.model.odata.v2.ODataModel#batchRequestFailed
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters

	 * @param {string} oControlEvent.getParameters.ID The request ID
	 * @param {string} oControlEvent.getParameters.url The url which is sent to the backend
	 * @param {string} oControlEvent.getParameters.method The HTTP method
	 * @param {map} oControlEvent.getParameters.headers The request headers
	 * @param {boolean} oControlEvent.getParameters.async If the request is synchronous or asynchronous (if available)
	 * @param {boolean} oControlEvent.getParameters.success Request was successful or not
	 * @param {object} oControlEvent.getParameters.response The response object - empty object if no response
	 * The response object contains the following properties: message, success, headers, statusCode, statusText, responseText
	 * @param {array} oControlEvent.getParameters.requests Array of embedded requests ($batch)
	 * Each request object within the array contains the following properties: url, method, headers, response object
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'batchRequestFailed' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.<br/>
	 *
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, this Model is used.
	 *
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachBatchRequestFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("batchRequestFailed", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'batchRequestFailed' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.<br/>
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachBatchRequestFailed = function(fnFunction, oListener) {
		this.detachEvent("batchRequestFailed", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event batchRequestFailed to attached listeners.
	 *
	 * @param {object} mArguments the arguments to pass along with the event.
	 * @param {string} mArguments.ID The request ID
	 * @param {string} mArguments.url The url which is sent to the backend
	 * @param {string} mArguments.method The HTTP method
	 * @param {map} mArguments.headers The request headers
	 * @param {boolean} mArguments.async If the request is synchronous or asynchronous (if available)
	 * @param {boolean} mArguments.success Request was successful or not
	 * @param {object} mArguments.response The response object - empty object if no response
	 * The response object contains the following properties: message, success, headers, statusCode, statusText, responseText
	 * @param {array} mArguments.requests Array of embedded requests ($batch)
	 * Each request object within the array contains the following properties: url, method, headers, response object
	 *
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireBatchRequestFailed = function(mArguments) {
		this.fireEvent("batchRequestFailed", mArguments);
		return this;
	};


	/**
	 * The 'batchRequestSent' event is fired, after a request has been sent to a backend.
	 *
	 * @name sap.ui.model.odata.v2.ODataModel#batchRequestSent
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.url The url which is sent to the backend
	 * @param {string} [oControlEvent.getParameters.type] The type of the request (if available)
	 * @param {boolean} [oControlEvent.getParameters.async] If the request is synchronous or asynchronous (if available)
	 * @param {array} oControlEvent.getParameters.requests Array of embedded requests ($batch)
	 * Each request object within the array contains the following properties: url, method, headers
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'requestSent' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachBatchRequestSent = function(oData, fnFunction, oListener) {
		this.attachEvent("batchRequestSent", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'batchRequestSent' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachBatchRequestSent = function(fnFunction, oListener) {
		this.detachEvent("batchRequestSent", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event batchRequestSent to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {string} [mArguments.url] The url which is sent to the backend.
	 * @param {string} [mArguments.type] The type of the request (if available)
	 * @param {boolean} [mArguments.async] If the request is synchronous or asynchronous (if available)
	 * @param {array} mArguments.requests Array of embedded requests ($batch)
	 * Each request object within the array contains the following properties: url, method, headers
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireBatchRequestSent = function(mArguments) {
		this.fireEvent("batchRequestSent", mArguments);
		return this;
	};

	/**
	 * The 'batchRequestCompleted' event is fired, after a request has been completed (includes receiving a response),
	 * no matter whether the request succeeded or not.
	 *
	 * @name sap.ui.model.odata.v2.ODataModel#batchRequestCompleted
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.ID The request ID
	 * @param {string} oControlEvent.getParameters.url The url which is sent to the backend
	 * @param {string} oControlEvent.getParameters.method The HTTP method
	 * @param {map} oControlEvent.getParameters.headers The request headers
	 * @param {boolean} oControlEvent.getParameters.success Request was successful or not
	 * @param {boolean} oControlEvent.getParameters.async If the request is synchronous or asynchronous (if available)
	 * @param {array} oControlEvent.getParameters.requests Array of embedded requests ($batch)
	 * Each request object within the array contains the following properties: url, method, headers, response object
	 * @param {object} oControlEvent.getParameters.response The response object - empty object if no response:
	 * The response object contains the following properties: message, success, headers, statusCode, statusText, responseText
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'batchRequestCompleted' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachBatchRequestCompleted = function(oData, fnFunction, oListener) {
		this.attachEvent("batchRequestCompleted", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'batchRequestCompleted' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachBatchRequestCompleted = function(fnFunction, oListener) {
		this.detachEvent("batchRequestCompleted", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event batchRequestCompleted to attached listeners.
	 *
	 * @param {object} mArguments parameters to add to the fired event
	 * @param {string} mArguments.ID The request ID
	 * @param {string} mArguments.url The url which is sent to the backend
	 * @param {string} mArguments.method The HTTP method
	 * @param {map} mArguments.headers The request headers
	 * @param {boolean} mArguments.success Request was successful or not
	 * @param {boolean} mArguments.async If the request is synchronous or asynchronous (if available)
	 * @param {array} mArguments.requests Array of embedded requests ($batch) - empty array for non batch requests.
	 * Each request object within the array contains the following properties: url, method, headers, response object
	 * @param {object} mArguments.response The response object - empty object if no response:
	 * The response object contains the following properties: message, success, headers, statusCode, statusText, responseText
	 *
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireBatchRequestCompleted = function(mArguments) {
		this.fireEvent("batchRequestCompleted", mArguments);
		return this;
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
	 * @param {boolean} bDelayEvent metadataLoaded event will be fired asynchronous
	 * @private
	 */
	ODataModel.prototype._initializeMetadata = function(bDelayEvent) {
		var that = this;
		this.bUseBatch = this.bUseBatch || this.oMetadata.getUseBatch();
		var doFire = function(bInitialize, bDelay){
			if (bDelay) {
				that.metadataLoadEvent = jQuery.sap.delayedCall(0, that, doFire, [that.bLoadMetadataAsync]);
			} else {
				if (bInitialize) {
					that.initialize();
				}
				that.fireMetadataLoaded({metadata: that.oMetadata});
				jQuery.sap.log.debug(that + " - metadataloaded fired");
			}
		};


		if (this.bLoadMetadataAsync && this.sAnnotationURI && this.bLoadAnnotationsJoined) {
			// In case of joined loading, wait for the annotations before firing the event
			// This is also tested in the fireMetadataLoaded-method and no event is fired in case
			// of joined loading.
			if (this.oAnnotations && this.oAnnotations.bInitialized) {
				doFire(true);
			} else {
				this.oAnnotations.attachEventOnce("loaded", function() {
					doFire(true);
				});
			}
		} else {
			// In case of synchronous or asynchronous non-joined loading, or if no annotations are
			// loaded at all, the events are fired individually
			doFire(this.bLoadMetadataAsync, bDelayEvent);
		}
	};



	/**
	 * Refreshes the metadata for model, e.g. in case the request for metadata has failed. 
	 * Returns a new promise which can be resolved or rejected depending on the metadata loading state.
	 *
	 * @returns {Promise} returns a promise on metadata loaded state or null if metadata is not initialized or currently refreshed.
	 *
	 * @public
	 */
	ODataModel.prototype.refreshMetadata = function(){
		if (this.oMetadata && this.oMetadata.refresh){
			return this.oMetadata.refresh();
		}
	};


	/**
	 * Fire event annotationsLoaded to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {sap.ui.model.odata.ODataAnnotations} [mArguments.annotations]  the annotations object.
	 *
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireAnnotationsLoaded = function(mArguments) {
		this.fireEvent("annotationsLoaded", mArguments);
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'annotationsLoaded' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachAnnotationsLoaded = function(oData, fnFunction, oListener) {
		this.attachEvent("annotationsLoaded", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'annotationsLoaded' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
	 * @experimental The API is NOT stable yet. Use at your own risk.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireAnnotationsFailed = function(mArguments) {
		this.fireEvent("annotationsFailed", mArguments);
		jQuery.sap.log.debug(this + " - annotationsfailed fired");
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'annotationsFailed' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachAnnotationsFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("annotationsFailed", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'annotationsFailed' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireMetadataLoaded = function(mArguments) {
		this.fireEvent("metadataLoaded", mArguments);
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'metadataLoaded' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachMetadataLoaded = function(oData, fnFunction, oListener) {
		this.attachEvent("metadataLoaded", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'metadataLoaded' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataModel.prototype.fireMetadataFailed = function(mArguments) {
		this.fireEvent("metadataFailed", mArguments);
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'metadataFailed' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
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
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.attachMetadataFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("metadataFailed", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'metadataFailed' event of this <code>sap.ui.model.odata.v2.ODataModel</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.v2.ODataModel} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataModel.prototype.detachMetadataFailed = function(fnFunction, oListener) {
		this.detachEvent("metadataFailed", fnFunction, oListener);
		return this;
	};

	/**
	 * creates the EventInfo Object for request sent/completed/failed
	 * @param {object} oRequest The request object
	 * @param {object} oResponse The response/error object
	 * @param {object} aBatchRequests Array of batch requests
	 * @returns {object} oEventInfo The EventInfo object
	 * @private
	 */
	ODataModel.prototype._createEventInfo = function(oRequest, oResponse, aBatchRequests) {
		var oEventInfo = {};

		oEventInfo.url = oRequest.requestUri;
		oEventInfo.method = oRequest.method;
		oEventInfo.async = oRequest.async;
		oEventInfo.headers = oRequest.headers;
		//in batch case list inner requests
		if (aBatchRequests) {
			oEventInfo.requests = [];
			for (var i = 0; i < aBatchRequests.length; i++) {
				var oBatchRequest = {};
				//changeSets
				if (jQuery.isArray(aBatchRequests[i])) {
					var aChangeSet = aBatchRequests[i];
					for (var j = 0; j < aChangeSet.length; j++) {
						var oRequest = aChangeSet[j].request;
						var oInnerResponse = aBatchRequests[i][j].response;
						oBatchRequest = {};
						oBatchRequest.url = oRequest.requestUri;
						oBatchRequest.method = oRequest.method;
						oBatchRequest.headers = oRequest.headers;
						if (oInnerResponse) {
							oBatchRequest.response = {};
							if (oRequest._aborted) {
								oBatchRequest.success = false;
								oBatchRequest.response.statusCode = 0;
								oBatchRequest.response.statusText = "abort";
							} else {
								oBatchRequest.success = true;
								if (oInnerResponse.message) {
									oBatchRequest.response.message = oInnerResponse.message;
									oInnerResponse = oInnerResponse.response;
									oBatchRequest.response.responseText = oInnerResponse.body;
									oBatchRequest.success = false;
								}
								oBatchRequest.response.headers = oInnerResponse.headers;
								oBatchRequest.response.statusCode = oInnerResponse.statusCode;
								oBatchRequest.response.statusText = oInnerResponse.statusText;
							}
						}
						oEventInfo.requests.push(oBatchRequest);
					}
				} else {
					var oRequest = aBatchRequests[i].request;
					var oInnerResponse = aBatchRequests[i].response;
					oBatchRequest.url = oRequest.requestUri;
					oBatchRequest.method = oRequest.method;
					oBatchRequest.headers = oRequest.headers;
					if (oInnerResponse) {
						oBatchRequest.response = {};
						if (oRequest._aborted) {
							oBatchRequest.success = false;
							oBatchRequest.response.statusCode = 0;
							oBatchRequest.response.statusText = "abort";
						} else {
							oBatchRequest.success = true;
							if (oInnerResponse.message) {
								oBatchRequest.response.message = oInnerResponse.message;
								oInnerResponse = oInnerResponse.response;
								oBatchRequest.response.responseText = oInnerResponse.body;
								oBatchRequest.success = false;
							}
							oBatchRequest.response.headers = oInnerResponse.headers;
							oBatchRequest.response.statusCode = oInnerResponse.statusCode;
							oBatchRequest.response.statusText = oInnerResponse.statusText;
						}
					}
					oEventInfo.requests.push(oBatchRequest);
				}
			}
		}
		if (oResponse) {
			oEventInfo.response = {};
			oEventInfo.success = true;
			if (oResponse.message) {
				oEventInfo.response.message = oResponse.message;
				oEventInfo.success = false;
			}
			if (oResponse.response) {
				// oResponse is response object
				oResponse = oResponse.response;
			}
			//in case of aborted requests there is no further info
			if (oResponse && oResponse.statusCode != undefined) {
				oEventInfo.response.headers = oResponse.headers;
				oEventInfo.response.statusCode = oResponse.statusCode;
				oEventInfo.response.statusText = oResponse.statusText;
				oEventInfo.response.responseText = oResponse.body !== undefined ? oResponse.body : oResponse.responseText;
			}
		}
		oEventInfo.ID = oRequest.requestID;
		return oEventInfo;
	};

	/**
	 * create a request ID
	 *
	 * @returns {string} sRequestID A request ID
	 * @private
	 */
	ODataModel.prototype._createRequestID = function () {
		var sRequestID;

		sRequestID = jQuery.sap.uid();
		return sRequestID;
	};

	/**
	 * creates a request url
	 * @param {string} sPath binding path
	 * @param {object} [oContext] bindingContext
	 * @param {array} [aUrlParams] url parameters
	 * @param {boolean} [bBatch] for requests nested in a batch relative uri will be created
	 * @returns {string} sUrl request url
	 * @private
	 */
	ODataModel.prototype._createRequestUrl = function(sPath, oContext, aUrlParams, bBatch) {

		// create the url for the service
		var sNormalizedPath,
			aAllUrlParameters = [],
			sUrl = "";

		sNormalizedPath = this._normalizePath(sPath, oContext);

		if (!bBatch) {
			sUrl = this.sServiceUrl + sNormalizedPath;
		} else {
			sUrl = sNormalizedPath.substr(sNormalizedPath.indexOf('/') + 1);
		}

		if (this.aUrlParams) {
			aAllUrlParameters = aAllUrlParameters.concat(this.aUrlParams);
		}
		if (aUrlParams) {
			aAllUrlParameters = aAllUrlParameters.concat(aUrlParams);
		}

		if (aAllUrlParameters && aAllUrlParameters.length > 0) {
			sUrl += "?" + aAllUrlParameters.join("&");
		}
		return sUrl;
	};

	/**
	 * Imports the data to the internal storage.
	 * Nested entries are processed recursively, moved to the canonic location and referenced from the parent entry.
	 * keys are collected in a map for updating bindings
	 *
	 * @param {object} oData data that should be imported
	 * @param {map} mChangedEntities map of changed entities
	 * @return {map} mChangedEntities
	 * @private
	 */
	ODataModel.prototype._importData = function(oData, mChangedEntities) {
		var that = this,
		aList, sKey, oResult, oEntry;
		if (oData.results) {
			aList = [];
			jQuery.each(oData.results, function(i, entry) {
				var sKey = that._importData(entry, mChangedEntities);
				if (sKey) {
					aList.push(sKey);
				}
			});
			return aList;
		} else {
			sKey = this._getKey(oData);
			if (!sKey) {
				return sKey;
			}
			oEntry = this.oData[sKey];
			if (!oEntry) {
				oEntry = oData;
				this.oData[sKey] = oEntry;
			}
			jQuery.each(oData, function(sName, oProperty) {
				if (oProperty && (oProperty.__metadata && oProperty.__metadata.uri || oProperty.results) && !oProperty.__deferred) {
					oResult = that._importData(oProperty, mChangedEntities);
					if (jQuery.isArray(oResult)) {
						oEntry[sName] = { __list: oResult };
					} else {
						oEntry[sName] = { __ref: oResult };
					}
				} else if (!oProperty || !oProperty.__deferred) { //do not store deferred navprops
					oEntry[sName] = oProperty;
				}
			});
			mChangedEntities[sKey] = true;
			return sKey;
		}
	};

	/**
	 * Remove references of navigation properties created in importData function
	 *
	 * @param {object} oData entry that contains references
	 * @returns {object} oData entry
	 * @private
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
	 * @param {object} oData entry which references should be restored
	 * @returns {object} oData entry
	 * @private
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
	 * @private
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
	 * @param {string} [sGroupId] The GroupId
	 *
	 * @public
	 */
	ODataModel.prototype.refresh = function(bForceUpdate, bRemoveData, sGroupId) {
		if (typeof bForceUpdate === "string") {
			sGroupId = bForceUpdate;
			bForceUpdate = false;
			bRemoveData = false;
		}
		
		// Call refresh on all bindings instead of checkUpdate to properly reset cached data in bindings
		if (bRemoveData) {
			this.removeData();
		}
		this._refresh(bForceUpdate, sGroupId);
	};

	/**
	 * @param {boolean} [bForceUpdate=false] Force update of controls
	 * @param {string} [sGroupId] The GroupId
	 * @param {map} mChangedEntities map of changed entities
	 * @param {map} mEntityTypes map of changed entityTypes
	 * @private
	 */
	ODataModel.prototype._refresh = function(bForceUpdate, sGroupId, mChangedEntities, mEntityTypes) {
		// Call refresh on all bindings instead of checkUpdate to properly reset cached data in bindings
		var aBindings = this.aBindings.slice(0);
		//the refresh calls read synchronous; we use this.sRefreshGroupId in this case
		this.sRefreshGroupId = sGroupId;
		jQuery.each(aBindings, function(iIndex, oBinding) {
			oBinding._refresh(bForceUpdate, mChangedEntities, mEntityTypes);
		});
		this.sRefreshGroupId = undefined;
	};

	/**
	 * Private method iterating the registered bindings of this model instance and initiating their check for update
	 *
	 * @param {boolean} bForceUpdate force update of controls
	 * @param {boolean} bAsync asynchronous execution
	 * @param {map} mChangedEntities Map of changed entities
	 * @param {boolean} bMetaModelOnly update metamodel bindings only
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
				oBinding.checkDataState(bForceUpdate);
			}
		}.bind(this));
		//handle calls after update
		var aCallAfterUpdate = this.aCallAfterUpdate;
		this.aCallAfterUpdate = [];
		for (var i = 0; i < aCallAfterUpdate.length; i++) {
			aCallAfterUpdate[i]();
		}
	};
	
	/**
	 * Private method iterating the registered bindings of this model instance and calls their check dataState method
	 * 
	 * @param {boolean} bForceUpdate force update of controls
	 * @private
	 */
	ODataModel.prototype.checkDataState = function(bForceUpdate) {
		var aBindings = this.aBindings.slice(0);
		jQuery.each(aBindings, function(iIndex, oBinding) {
			oBinding.checkDataState(bForceUpdate);
		});
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.bindProperty
	 * @param {string} sPath binding path
	 * @param {object} [oContext] bindingContext
	 * @param {map} [mParameters] map of parameters
	 * @returns {object} oBinding new bindingObject
	 * @private
	 */
	ODataModel.prototype.bindProperty = function(sPath, oContext, mParameters) {
		var oBinding = new ODataPropertyBinding(this, sPath, oContext, mParameters);
		return oBinding;
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindList
	 * @see sap.ui.model.Model.prototype.bindProperty
	 * @param {string} sPath binding path
	 * @param {object} [oContext] bindingContext
	 * @param {array} aSorters array of sap.ui.model.Sorter
	 * @param {array} aFilters array of sap.ui.model.Filter
	 * @param {map} [mParameters] map of parameters
	 * @returns {object} oBinding new bindingObject
	 * @private
	 */
	ODataModel.prototype.bindList = function(sPath, oContext, aSorters, aFilters, mParameters) {
		var oBinding = new ODataListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
		return oBinding;
	};

	/**
	 * @see sap.ui.model.Model.prototype.bindTree
	 * @param {string} sPath binding path
	 * @param {object} [oContext] bindingContext
	 * @param {array} aFilters array of sap.ui.model.Filter
	 * @param {map} [mParameters] map of parameters
	 * @returns {object} oBinding new bindingObject
	 * @private
	 */
	ODataModel.prototype.bindTree = function(sPath, oContext, aFilters, mParameters, aSorters) {
		var oBinding = new ODataTreeBinding(this, sPath, oContext, aFilters, mParameters, aSorters);
		return oBinding;
	};

	/**
	 * Creates a binding context for the given path
	 * If the data of the context is not yet available, it can not be created, but first the
	 * entity needs to be fetched from the server asynchronously. In case no callback function
	 * is provided, the request will not be triggered.
	 *
	 * @see sap.ui.model.Model.prototype.createBindingContext
	 * @param {string} sPath binding path
	 * @param {object} [oContext] bindingContext
	 * @param {map} [mParameters] map of parameters
	 * @param {function} [fnCallBack] function called when context is created
	 * @param {boolean} [bReload] reload of data
	 * @return sap.ui.model.Context
	 * @public
	 */
	ODataModel.prototype.createBindingContext = function(sPath, oContext, mParameters, fnCallBack, bReload) {
		var sFullPath = this.resolve(sPath, oContext);

		bReload = !!bReload;

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
		sGroupId,
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
				if (mParameters && (mParameters.batchGroupId || mParameters.groupId)) {
					sGroupId = mParameters.groupId || mParameters.batchGroupId;
				}
				var handleSuccess = function(oData) {
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
				};
				var handleError = function(oError) {
					if (oError.statusCode == '404' && oContext && bIsRelative) {
						var sContextPath = oContext.getPath();
						// remove starting slash
						sContextPath = sContextPath.substr(1);
						// when model is refreshed, parent entity might not be available yet
						if (that.oData[sContextPath]) {
							that.oData[sContextPath][sPath] = {__ref: null};
						}
					}
					fnCallBack(null); // error - notify to recreate contexts
				};
				this.read(sFullPath, {groupId: sGroupId, urlParameters: aParams, success: handleSuccess, error: handleError});
			} else {
				fnCallBack(null); // error - notify to recreate contexts
			}
		}
	};

	/**
	 * checks if data based on select, expand parameters is already loaded or not.
	 * In case it couldn't be found we should reload the data so we return true.
	 *
	 * @param {string} sFullPath resolved path
	 * @param {object} oData entry object
	 * @param {map} [mParameters] map of parameters
	 * @returns {boolean} bReload reload needed
	 * @private
	 */
	ODataModel.prototype._isReloadNeeded = function(sFullPath, oData, mParameters) {
		var sNavProps, aNavProps = [], //aChainedNavProp,
		sSelectProps, aSelectProps = [], i;

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
			for (i = 0; i < aNavProps.length; i++) {
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
		for (i = 0; i < aNavProps.length; i++) {
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
						var sPropKey, oDataObject, bReloadNeeded;
						//the first nav prop contains a __list of entry-keys (and the __list is not empty)
						if (oFirstNavProp.__list && oFirstNavProp.__list.length > 0) {
							//Follow all keys in the __list collection by recursively calling
							//this function to check if all linked properties are loaded.
							//This is basically a depth-first search.
							for (var iNavIndex = 0; iNavIndex < oFirstNavProp.__list.length; iNavIndex++) {
								sPropKey = "/" + oFirstNavProp.__list[iNavIndex];
								oDataObject = this.getObject(sPropKey);
								bReloadNeeded = this._isReloadNeeded(sPropKey, oDataObject, {expand: sNavPropRest});
								if (bReloadNeeded) { //if a single nav-prop path is not loaded -> reload needed
									return true;
								}
							}
						} else if (oFirstNavProp.__ref) {
							//the first nav-prop is not a __list, but only a reference to a single entry (__ref)
							sPropKey = "/" + oFirstNavProp.__ref;
							oDataObject = this.getObject(sPropKey);
							bReloadNeeded = this._isReloadNeeded(sPropKey, oDataObject, {expand: sNavPropRest});
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

		for (i = 0; i < aSelectProps.length; i++) {
			// reload data if select property not available
			if (oData[aSelectProps[i]] === undefined) {
				return true;
			}
		}

		if (aSelectProps.length === 0){
			// check if all props exist and are already loaded...
			// only a subset of props may already be loaded before and now we want to load all.
			var oEntityType = this.oMetadata._getEntityTypeByPath(sFullPath);
			if (!oEntityType) {
				// if no entity type could be found we decide not to reload
				return false;
			} else {
				for (i = 0; i < oEntityType.property.length; i++) {
					if (oData[oEntityType.property[i].name] === undefined) {
						return true;
					}
				}
			}
		}
		return false;
	};

	/**
	 * Create URL parameters from custom parameters
	 *
	 * @param {map} mParameters map of custom parameters
	 * @returns {string} sCustomParameters & joined parameters
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
			if (sName === "custom") {
				mCustomQueryOptions = mParameters[sName];
				for (sName in mCustomQueryOptions) {
					if (sName.indexOf("$") === 0) {
						jQuery.sap.log.warning(this + " - Trying to set OData parameter '" + sName + "' as custom query option!");
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
	 * @param {string} sPath resolved path
	 * @param {object} oContext context object
	 * @param {map} [mParameters] map of parameters
	 * @returns {object} oBinding contextBinding object
	 * @private
	 */
	ODataModel.prototype.bindContext = function(sPath, oContext, mParameters) {
		var oBinding = new ODataContextBinding(this, sPath, oContext, mParameters);
		return oBinding;
	};

	/**
	 * Sets the default way to retrieve the count of collections in this model.
	 * Count can be determined either by sending a separate $count request, including
	 * $inlinecount=allpages in data requests, both of them or not at all.
	 *
	 * @param {sap.ui.model.odata.CountMode} sCountMode sets default count mode
	 * @since 1.20
	 * @public
	 */
	ODataModel.prototype.setDefaultCountMode = function(sCountMode) {
		this.sDefaultCountMode = sCountMode;
	};

	/**
	 * Returns the default count mode for retrieving the count of collections
	 *
	 * @returns {sap.ui.model.odata.CountMode} sCountMode returns defaultCountMode
	 * @since 1.20
	 * @public
	 */
	ODataModel.prototype.getDefaultCountMode = function() {
		return this.sDefaultCountMode;
	};


	/**
	 * Returns the key part from the entry URI or the given context or object
	 *
	 * @param {object|sap.ui.model.Context} oObject The context or entry object
	 * @returns {string} [sKey] key of the entry
	 * @private
	 */
	ODataModel.prototype._getKey = function(oObject) {
		var sKey, sURI;
		if (oObject instanceof Context) {
			sKey = oObject.getPath().substr(1);
		} else if (oObject && oObject.__metadata && oObject.__metadata.uri) {
			sURI = oObject.__metadata.uri;
			sKey = sURI.substr(sURI.lastIndexOf("/") + 1);
		}
		return sKey;
	};

	/**
	 * Returns the key part from the entry URI or the given context or object
	 *
	 * @param {object|sap.ui.model.Context} oObject The context or entry object
	 * @returns {string} [sKey] key of the entry
	 * @public
	 */
	ODataModel.prototype.getKey = function(oObject) {
		return this._getKey(oObject);
	};

	/**
	 * Creates the key from the given collection name and property map. Please make sure that the metadata document is loaded before using this function.
	 *
	 * @param {string} sCollection The name of the collection
	 * @param {object} oKeyProperties The object containing at least all the key properties of the entity type
	 * @returns {string} [sKey] key of the entry
	 * @public
	 */
	ODataModel.prototype.createKey = function(sCollection, oKeyProperties) {
		var oEntityType = this.oMetadata._getEntityTypeByPath(sCollection),
		sKey = sCollection,
		that = this,
		//aKeys,
		sName,
		oProperty;
		jQuery.sap.assert(oEntityType, "Could not find entity type of collection \"" + sCollection + "\" in service metadata!");
		sKey += "(";
		if (oEntityType.key.propertyRef.length === 1) {
			sName = oEntityType.key.propertyRef[0].name;
			jQuery.sap.assert(sName in oKeyProperties, "Key property \"" + sName + "\" is missing in object!");
			oProperty = this.oMetadata._getPropertyMetadata(oEntityType, sName);
			sKey += ODataUtils.formatValue(oKeyProperties[sName], oProperty.type);
		} else {
			jQuery.each(oEntityType.key.propertyRef, function(i, oPropertyRef) {
				if (i > 0) {
					sKey += ",";
				}
				sName = oPropertyRef.name;
				jQuery.sap.assert(sName in oKeyProperties, "Key property \"" + sName + "\" is missing in object!");
				oProperty = that.oMetadata._getPropertyMetadata(oEntityType, sName);
				sKey += sName;
				sKey += "=";
				sKey += ODataUtils.formatValue(oKeyProperties[sName], oProperty.type);
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
	 * @param {string} sPath the path/name of the property
	 * @param {object} [oContext] the context if available to access the property value
	 * @param {boolean} [bIncludeExpandEntries=null] This parameter should be set when a URI or custom parameter
	 * with a $expand System Query Option was used to retrieve associated entries embedded/inline.
	 * If true then the getProperty function returns a desired property value/entry and includes the associated expand entries (if any).
	 * If false the associated/expanded entry properties are removed and not included in the
	 * desired entry as properties at all. This is useful for performing updates on the base entry only. Note: A copy and not a reference of the entry will be returned.
	 * @returns {any} vValue the value of the property
	 * @public
	 */
	ODataModel.prototype.getProperty = function(sPath, oContext, bIncludeExpandEntries) {
		var oValue = this._getObject(sPath, oContext);

		// same behavior as before
		if (!bIncludeExpandEntries) {
			return oValue;
		}

		// if value is a plain value and not an object we return directly
		if (!jQuery.isPlainObject(oValue)) {
			return oValue;
		}

		// do a value copy or the changes to that value will be modified in the model as well (reference)
		oValue = jQuery.sap.extend(true, {}, oValue);

		if (bIncludeExpandEntries === true) {
			// include expand entries
			return this._restoreReferences(oValue);
		} else {
			// remove expanded references
			return this._removeReferences(oValue);
		}
	};

	/**
	 * @param {string} sPath binding path
	 * @param {object} [oContext] binding context
	 * @param {boolean} [bOriginalValue] returns the original value read from the server even if changes where made
	 * @returns {any} vValue the value for the given path/context
	 * @private
	 */
	ODataModel.prototype._getObject = function(sPath, oContext, bOriginalValue) {
		var oNode = this.isLegacySyntax() ? this.oData : null, oChangedNode, oOrigNode,
			sResolvedPath = this.resolve(sPath, oContext),
			iSeparator, sDataPath, sMetaPath, oMetaContext, sKey, oMetaModel;

		//check for metadata path
		if (this.oMetadata && this.oMetadata.isLoaded() && sResolvedPath && sResolvedPath.indexOf('/#') > -1)  {
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
		} else {
			if (!sResolvedPath) {
				return oNode;
			}
			var aParts = sResolvedPath.split("/"),
			iIndex = 0;
			// absolute path starting with slash
			sKey = aParts[1];
			aParts.splice(0,2);
			
			oChangedNode = this.mChangedEntities[sKey];
			oOrigNode = this.oData[sKey];
			if (!bOriginalValue) {
				//if sKey is undefined (for example sPath = '/') we have to return the data container
				oNode = !sKey ? this.oData : oChangedNode || oOrigNode;
			} else {
				oNode = !sKey ? this.oData : oOrigNode;
			}
			while (oNode && aParts[iIndex]) {
				var bHasChange = oChangedNode && oChangedNode.hasOwnProperty(aParts[iIndex]);
				oChangedNode = oChangedNode && oChangedNode[aParts[iIndex]];
				oOrigNode = oOrigNode && oOrigNode[aParts[iIndex]];
				oNode = bOriginalValue || !bHasChange ? oOrigNode : oChangedNode;
				if (oNode) {
					if (oNode.__ref) {
						oChangedNode = this.mChangedEntities[oNode.__ref];
						oOrigNode =  this.oData[oNode.__ref];
						oNode =  bOriginalValue ? oOrigNode : oChangedNode || oOrigNode;
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
		//if we have a changed Entity we need to extend it with the backend data
		if (this._getKey(oChangedNode)) {
			oNode =  bOriginalValue ? oOrigNode : jQuery.sap.extend(true, {}, oOrigNode, oChangedNode);
		}
		return oNode;
	};

	/**
	 * Update the security token, if token handling is enabled and token is not available yet
	 * @private
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
	 * @private
	 */
	ODataModel.prototype.resetSecurityToken = function() {
		delete this.oServiceData.securityToken;
		delete this.oHeaders["x-csrf-token"];
		delete this.pSecurityToken;
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
	 * Returns a promise, which will resolve with the security token as soon as it is available
	 *
	 * @returns {Promise} the CSRF security token
	 *
	 * @public
	 */
	ODataModel.prototype.securityTokenAvailable = function() {
		if (!this.pSecurityToken) {
			if (this.oServiceData.securityToken) {
				this.pSecurityToken = Promise.resolve(this.oServiceData.securityToken);
			} else {
				this.pSecurityToken = new Promise(function(resolve, reject) {
					this.refreshSecurityToken(function() {
						resolve(this.oServiceData.securityToken);
					}.bind(this),function(){
						reject();
					}, true);
				}.bind(this));
			}
		}
		return this.pSecurityToken;
	};

	/**
	 * refresh XSRF token by performing a GET request against the service root URL.
	 *
	 * @param {function} [fnSuccess] a callback function which is called when the data has
	 *            					 been successfully retrieved.
	 * @param {function} [fnError] a callback function which is called when the request failed. The handler can have the parameter: oError which contains
	 *  additional error information.
	 *
	 * @returns {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.refreshSecurityToken = function(fnSuccess, fnError, bAsync) {
		var sToken;
		var that = this;
		var sUrl = this._createRequestUrl("/");

		var mTokenRequest = {
			abort: function() {
				this.request.abort();
			}
		};
		

		function _handleSuccess(oData, oResponse) {
			if (oResponse) {
				sToken = that._getHeader("x-csrf-token", oResponse.headers);
				if (sToken) {
					that.oServiceData.securityToken = sToken;
					that.pSecurityToken = Promise.resolve(sToken);
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

		function _handleGetError(oError) {
			// Disable token handling, if token request returns an error
			that.resetSecurityToken();
			that.bTokenHandling = false;
			that._handleError(oError);

			if (fnError) {
				fnError(oError);
			}
		}
		
		function _handleHeadError(oError) {
			// Disable token handling, if token request returns an error
			mTokenRequest.request = requestToken("GET", _handleGetError);
		}

		function requestToken(sRequestType, fnError) {
			// trigger a read to the service url to fetch the token
			var oRequest = that._createRequest(sUrl, sRequestType, that._getHeaders(), null, null, !!bAsync);
			oRequest.headers["x-csrf-token"] = "Fetch";
			return that._request(oRequest, _handleSuccess, fnError, undefined, undefined, that.getServiceMetadata());
		}


		// Initially try method "HEAD", error handler falls back to "GET" unless the flag forbids HEAD request
		if (this.bDisableHeadRequestForToken) {
			mTokenRequest.request = requestToken("GET", _handleGetError);
		} else {
			mTokenRequest.request = requestToken("HEAD", _handleHeadError);
		}
		return mTokenRequest;

	};

	/**
	 * submit changes from the requestQueue (queue can currently have only one request)
	 * @param {object} oRequest The request object
	 * @param {function} [fnSuccess] Success callback function
	 * @param {function} [fnError] Error callback function
	 * @returns {object} oHandler request handle
	 * @private
	 */
	ODataModel.prototype._submitRequest = function(oRequest, fnSuccess, fnError){
		var that = this, /* oResponseData, mChangedEntities = {}, */ oHandler, oRequestHandle, bAborted;

		function _handleSuccess(oData, oResponse) {
			//if batch the responses are handled by the batch success handler
			if (fnSuccess) {
				fnSuccess(oData, oResponse);
			}
		}

		function _handleError(oError) {

			// If error is a 403 with XSRF token "Required" reset the token and retry sending request
			if (that.bTokenHandling && oError.response) {
				var sToken = that._getHeader("x-csrf-token", oError.response.headers);
				if (!oRequest.bTokenReset && oError.response.statusCode == '403' && sToken && sToken.toLowerCase() === "required") {
					that.resetSecurityToken();
					oRequest.bTokenReset = true;
					_submitWithToken();
					return;
				}
			}

			if (fnError) {
				fnError(oError);
			}
		}
		
		function _readyForRequest(oRequest) {
			if (that.bTokenHandling && oRequest.method !== "GET") {
				that.pReadyForRequest = that.securityTokenAvailable();
			}
			return that.pReadyForRequest;
		}
		
		function _submitWithToken() {
			// request token only if we have change operations or batch requests
			// token needs to be set directly on request headers, as request is already created
			_readyForRequest(oRequest).then(function(sToken) {	
				// Check bTokenHandling again, as updating the token might disable token handling
				if (that.bTokenHandling) {
					oRequest.headers["x-csrf-token"] = sToken;
				}
				_submit();
			}, function() {
				_submit();
			});
		}
		
		var fireEvent = function(sType, oRequest, oError) {
			var oEventInfo,
				aRequests = oRequest.eventInfo.requests;
			if (aRequests) {
				jQuery.each(aRequests, function(i, oRequest) {
					if (jQuery.isArray(oRequest)) {
						jQuery.each(oRequest, function(i, oRequest) {
							oEventInfo = that._createEventInfo(oRequest.request, oError);
							that["fireRequest" + sType](oEventInfo);
						});
					} else {
						oEventInfo = that._createEventInfo(oRequest.request, oError);
						that["fireRequest" + sType](oEventInfo);
					}
				});
				
				oEventInfo = that._createEventInfo(oRequest, oError, aRequests);
				that["fireBatchRequest" + sType](oEventInfo);
			} else {
				oEventInfo = that._createEventInfo(oRequest, oError, aRequests);
				that["fireRequest" + sType](oEventInfo);
			}
		};
		
		function _submit() {
			oRequestHandle = that._request(oRequest, _handleSuccess, _handleError, oHandler, undefined, that.getServiceMetadata());
			if (oRequest.eventInfo) {
				fireEvent("Sent", oRequest, null);
				delete oRequest.eventInfo;
			}
			if (bAborted) {
				oRequestHandle.abort();
			}
		}
		
		//handler only needed for $batch; datajs gets the handler from the accept header
		oHandler = that._getODataHandler(oRequest.requestUri);

		_submitWithToken();
		
		return {
			abort: function() {
				if (oRequestHandle) {
					oRequestHandle.abort();
				}
				bAborted = true;
			}
		};
	};
	
	/**
	 * submit of a single request
	 *
	 * @param {object} oRequest The request object
	 * @param {function} fnSuccess Success callback function
	 * @param {function} fnError Error callback function
	 * @returns {object} oHandler request handle
	 * @private
	 */
	ODataModel.prototype._submitSingleRequest = function(oRequest, fnSuccess, fnError) {
		var that = this,
			oRequestHandle,
			mChangeEntities = {},
			mGetEntities = {},
			mEntityTypes = {};
		
		var handleSuccess = function(oData, oResponse) {
			var fnSingleSuccess = function(oData, oResponse) {
				if (fnSuccess) {
					fnSuccess(oData, oResponse);
				}
				if (oRequest.requestUri.indexOf("$count") === -1) {
					that.checkUpdate(false, false, mGetEntities);
					if (that._isRefreshNeeded(oRequest, oResponse)){
						that._refresh(false, undefined, mChangeEntities, mEntityTypes);
					}
				}
			};
			that._processSuccess(oRequest, oResponse, fnSingleSuccess, mGetEntities, mChangeEntities, mEntityTypes);
		};
		var handleError = function(oError) {
			if (oError.message == "Request aborted") {
				that._processAborted(oRequest, oError, fnError);
			} else {
				that._processError(oRequest, oError, fnError);
			}
		};
		oRequest.eventInfo = {};
		oRequestHandle =  this._submitRequest(oRequest, handleSuccess, handleError);

		return oRequestHandle;
	};

	/**
	 * submit of a batch request
	 *
	 * @param {object} oBatchRequest The batch request object
	 * @param {array} aRequests array of request; represents the order of requests in the batch
	 * @param {function} fnSuccess Success callback function
	 * @param {fnError} fnError Error callback function
	 * @returns {object} orequestHandle requestHandle
	 * @private
	 */
	ODataModel.prototype._submitBatchRequest = function(oBatchRequest, aRequests, fnSuccess, fnError) {
		var that = this;

		var handleSuccess = function(oData, oBatchResponse) {
			var oResponse, oRequestObject, aChangeResponses,
				aBatchResponses = oData.__batchResponses,
				oEventInfo,
				mChangeEntities = {},
				mGetEntities = {},
				mEntityTypes = {};

			if (aBatchResponses) {
				var i,j;
				for (i = 0; i < aBatchResponses.length; i++) {
					oResponse = aBatchResponses[i];

					if (jQuery.isArray(aRequests[i])) {
						//changeSet failed
						if (oResponse.message) {
							for (j = 0; j < aRequests[i].length; j++) {
								oRequestObject = aRequests[i][j];

								if (oRequestObject.request._aborted) {
									that._processAborted(oRequestObject.request, oResponse, oRequestObject.fnError);
								} else {
									that._processError(oRequestObject.request, oResponse, oRequestObject.fnError);
								}
								oRequestObject.response = oResponse;
							}
						} else {
							aChangeResponses = oResponse.__changeResponses;
							for (j = 0; j < aChangeResponses.length; j++) {
								var oChangeResponse = aChangeResponses[j];
								oRequestObject = aRequests[i][j];
								//check for error
								if (oRequestObject.request._aborted) {
									that._processAborted(oRequestObject.request, oChangeResponse, oRequestObject.fnError);
								} else if (oChangeResponse.message) {
									that._processError(oRequestObject.request, oChangeResponse, oRequestObject.fnError);
								} else {
									that._processSuccess(oRequestObject.request, oChangeResponse, oRequestObject.fnSuccess, mGetEntities, mChangeEntities, mEntityTypes);
								}
								oRequestObject.response = oChangeResponse;
							}
						}
					} else {
						oRequestObject = aRequests[i];
						if (oRequestObject.request._aborted) {
							that._processAborted(oRequestObject.request, oResponse, oRequestObject.fnError);
						} else if (oResponse.message) {
							that._processError(oRequestObject.request, oResponse, oRequestObject.fnError);
						} else {
							that._processSuccess(oRequestObject.request, oResponse, oRequestObject.fnSuccess, mGetEntities, mChangeEntities, mEntityTypes);
						}
						oRequestObject.response = oResponse;
					}
				}
				that.checkUpdate(false, false, mGetEntities);
			}
			if (fnSuccess) {
				fnSuccess(oData);
			}
			oEventInfo = that._createEventInfo(oBatchRequest, oBatchResponse, aRequests);
			that.fireBatchRequestCompleted(oEventInfo);
		};

		var handleError = function(oError) {
			var oEventInfo,
				bAborted = oRequestHandle && oRequestHandle.bAborted;
			// Call procesError for all contained requests first
			jQuery.each(aRequests, function(i, oRequest) {
				if (jQuery.isArray(oRequest)) {
					jQuery.each(oRequest, function(i, oRequest) {
						if (bAborted) {
							that._processAborted(oRequest.request, oError, oRequest.fnError);
						} else {
							that._processError(oRequest.request, oError, oRequest.fnError);
						}
					});
				} else {
					if (bAborted) {
						that._processAborted(oRequest.request, oError, oRequest.fnError);
					} else {
						that._processError(oRequest.request, oError, oRequest.fnError);
					}
				}
			});
			// Call callback and fire events for the batch request
			if (fnError) {
				fnError(oError);
			}
			oEventInfo = that._createEventInfo(oBatchRequest, oError, aRequests);
			that.fireBatchRequestCompleted(oEventInfo);
			// Don't fire RequestFailed for intentionally aborted requests; fire event if we have no (OData.read fails before handle creation)
			if (!bAborted) {
				that.fireBatchRequestFailed(oEventInfo);
			}
		};
		
		oBatchRequest.eventInfo = {
				requests: aRequests,
				batch: true
		};
		
		var oRequestHandle = this._submitRequest(oBatchRequest, handleSuccess, handleError);

		return oRequestHandle;
	};

	/**
	 * Create a Batch request
	 *
	 * @param {array} aBatchRequests array of request objects
	 * @returns {object} oBatchRequest The batch request
	 * @private
	 */
	ODataModel.prototype._createBatchRequest = function(aBatchRequests) {
		var sUrl, oRequest,
		oChangeHeader = {},
		oPayload = {};

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
				async: true
		};

		oRequest.withCredentials = this.bWithCredentials;

		return oRequest;
	};

	/**
	 * push request to internal request queue
	 *
	 * @param {map} mRequests Request queue
	 * @param {string} sGroupId The group Id
	 * @param {string} [sChangeSetId] The changeSet Id
	 * @param {oRequest} oRequest The request
	 * @param {function} fnSuccess The success callback function
	 * @param {function} fnError The error callback function
	 * @private
	 */
	ODataModel.prototype._pushToRequestQueue = function(mRequests, sGroupId, sChangeSetId, oRequest, fnSuccess, fnError) {
		var oChangeGroup, oRequestGroup = mRequests[sGroupId];

		if (!oRequestGroup) {
			oRequestGroup = {};
			oRequestGroup.map = {};
			oRequestGroup.requests = [];
			mRequests[sGroupId] = oRequestGroup;
		}
		if (oRequest.method !== "GET") {
			if (!oRequestGroup.changes) {
				oRequestGroup.changes = {};
			}
			if (oRequest.key && oRequestGroup.map && oRequest.key in oRequestGroup.map) {
				var oChangeRequest = oRequestGroup.map[oRequest.key]; 
				oChangeRequest.method = oRequest.method;
				if (oRequest.method === "PUT") {
					// if stored request was a MERGE before (created by setProperty) but is now sent via PUT
					// (by submitChanges) the merge header must be removed
					delete oChangeRequest.headers["x-http-method"];
				}

				// if change is aborted (resetChanges) and a change happens before submit we should delete
				// the aborted flag
				if (oChangeRequest._aborted) {
					delete oChangeRequest._aborted;
					var oRequestHandle = {
							abort: function() {
								oChangeRequest._aborted = true;
							}
					};
					this.mChangeHandles[oRequest.key] = oRequestHandle;
				}
				oChangeRequest.data = oRequest.data;

			} else {
				oChangeGroup = oRequestGroup.changes[sChangeSetId];
				if (!oChangeGroup) {
					oChangeGroup = [];
					oRequestGroup.changes[sChangeSetId] = oChangeGroup;
				}
				oRequest._changeSetId = sChangeSetId;
				oChangeGroup.push({
					request:	oRequest,
					fnSuccess:	fnSuccess,
					fnError:	fnError,
					changeSetId: sChangeSetId
				});
				if (oRequest.key) {
					oRequestGroup.map[oRequest.key] = oRequest;
				}
			}
		} else {
			oRequestGroup.requests.push({
				request:	oRequest,
				fnSuccess:	fnSuccess,
				fnError:	fnError
			});
		}
	};

	/**
	 * Request queue processing
	 *
	 * @param {object} oGroup The batchGroup
	 * @param {map} mChangedEntities A map containing the changed entities of the bacthGroup
	 * @param {map} mEntityTypes Aa map containing the changed EntityTypes
	 *
	 * @private
	 */
	ODataModel.prototype._collectChangedEntities = function(oGroup, mChangedEntities, mEntityTypes) {
		var that = this;

		if (oGroup.changes) {
			jQuery.each(oGroup.changes, function(sChangeSetId, aChangeSet){
				for (var i = 0; i < aChangeSet.length; i++) {
					var oRequest = aChangeSet[i].request,
						sKey = oRequest.requestUri.split('?')[0];
					if (oRequest.method === "POST") {
						var oEntityMetadata = that.oMetadata._getEntityTypeByPath("/" + sKey);
						if (oEntityMetadata) {
							mEntityTypes[oEntityMetadata.entityType] = true;
						}
					} else {
						mChangedEntities[sKey] = true;
					}
				}
			});
		}
	};

	/**
	 * Request queue processing
	 *
	 * @param {map} mRequests Request queue
	 * @param {string} sGroupId The GroupId
	 * @param {function} fnSuccess Success callback function
	 * @param {function} fnError Erro callback function
	 * @returns {object|array} oRequestHandle The request handle: array if multiple request will be sent
	 * @private
	 */
	ODataModel.prototype._processRequestQueue = function(mRequests, sGroupId, fnSuccess, fnError){
		var that = this, sPath,
			oRequestHandle = [];

		if (this.bUseBatch) {
			//auto refresh for batch / for single requests we refresh after the request was successful
			if (that.bRefreshAfterChange) {
				jQuery.each(mRequests, function(sRequestGroupId, oRequestGroup) {
					if (sRequestGroupId === sGroupId || !sGroupId) {
						var mChangedEntities = {},
							mEntityTypes = {};
						that._collectChangedEntities(oRequestGroup, mChangedEntities, mEntityTypes);
						that.bIncludeInCurrentBatch = true;
						that._refresh(false, sRequestGroupId, mChangedEntities, mEntityTypes);
						that.bIncludeInCurrentBatch = false;
					}
				});
			}
			jQuery.each(mRequests, function(sRequestGroupId, oRequestGroup) {
				if (sRequestGroupId === sGroupId || !sGroupId) {
					var aReadRequests = [], aBatchGroup = [], /* aChangeRequests, */ oChangeSet, aChanges;

					if (oRequestGroup.changes) {
						jQuery.each(oRequestGroup.changes, function(sChangeSetId, aChangeSet){
							oChangeSet = {__changeRequests:[]};
							aChanges = [];
							for (var i = 0; i < aChangeSet.length; i++) {
								//increase laundering
								sPath = '/' + that.getKey(aChangeSet[i].request.data);
								that.increaseLaundering(sPath, aChangeSet[i].request.data);
								if (aChangeSet[i].request._aborted) {
									that._processAborted(aChangeSet[i].request, null, aChangeSet[i].fnError);
								} else {
									//clear metadata.create
									if (aChangeSet[i].request.data && aChangeSet[i].request.data.__metadata) {
										delete aChangeSet[i].request.data.__metadata.created;
									}
									oChangeSet.__changeRequests.push(aChangeSet[i].request);
									aChanges.push(aChangeSet[i]);
								}
							}
							if (oChangeSet.__changeRequests && oChangeSet.__changeRequests.length > 0) {
								aReadRequests.push(oChangeSet);
								aBatchGroup.push(aChanges);
							}
						});
					}
					if (oRequestGroup.requests) {
						var aRequests = oRequestGroup.requests;
						for (var i = 0; i < aRequests.length; i++) {
							if (aRequests[i].request._aborted) {
								that._processAborted(aRequests[i].request, null, aRequests[i].fnError);
							} else {
								aReadRequests.push(aRequests[i].request);
								aBatchGroup.push(aRequests[i]);
							}
						}
					}
					if (aReadRequests.length > 0) {
						var oBatchRequest = that._createBatchRequest(aReadRequests, true);
						oRequestHandle.push(that._submitBatchRequest(oBatchRequest, aBatchGroup, fnSuccess, fnError));
					}
					delete mRequests[sRequestGroupId];
				}
			});
		} else  {
			jQuery.each(mRequests, function(sRequestGroupId, oRequestGroup) {
				if (sRequestGroupId === sGroupId || !sGroupId) {
					if (oRequestGroup.changes) {
						jQuery.each(oRequestGroup.changes, function(sChangeSetId, aChangeSet){
							for (var i = 0; i < aChangeSet.length; i++) {
								//increase laundering
								sPath = '/' + that.getKey(aChangeSet[i].request.data);
								that.increaseLaundering(sPath, aChangeSet[i].request.data);
								// store last request Handle. If no batch there will be only 1 and we cpould return it?
								if (aChangeSet[i].request._aborted) {
									that._processAborted(aChangeSet[i].request, null, aChangeSet[i].fnError);
								} else {
									aChangeSet[i].request._handle = that._submitSingleRequest(aChangeSet[i].request, aChangeSet[i].fnSuccess, aChangeSet[i].fnError);
									oRequestHandle.push(aChangeSet[i].request._handle);
								}
							}
						});
					}
					if (oRequestGroup.requests) {
						var aRequests = oRequestGroup.requests;
						for (var i = 0; i < aRequests.length; i++) {
							// store last request Handle. If no batch there will be only 1 and we cpould return it?
							if (aRequests[i].request._aborted) {
								that._processAborted(aRequests[i].request, null, aRequests[i].fnError);
							} else {
								aRequests[i].request._handle = that._submitSingleRequest(aRequests[i].request, aRequests[i].fnSuccess, aRequests[i].fnError);
								oRequestHandle.push(aRequests[i].request._handle);
							}
						}
					}
					delete mRequests[sRequestGroupId];
				}
			});
		}
		this.checkDataState();
		return oRequestHandle.length == 1 ? oRequestHandle[0] : oRequestHandle;
	};
	
	/**
	 * Process request queue asynchronously 
	 * 
	 * @param {map} mRequestQueue The request queue to process
	 * @private
	 */
	ODataModel.prototype._processRequestQueueAsync = function(mRequestQueue) {
		var that = this;
		if (!this.pCallAsnyc) {
			this.pCallAsnyc = Promise.resolve();
			this.pCallAsnyc.then(function() {
				that._processRequestQueue(mRequestQueue);
				that.pCallAsnyc = undefined;
			});
		}
	};
	
	/**
	 * process request response for successful requests
	 *
	 * @param {object} oRequest The request
	 * @param {object} oResponse The response
	 * @param {function} fnSuccess The success callback function
	 * @param {map} mGetEntities map of read entities
	 * @param {map} mChangeEntities map of changed entities
	 * @param {map} mEntityTypes map of changed entityTypes
	 * @returns {boolean} bSuccess Processed successfully
	 * @private
	 */
	ODataModel.prototype._processSuccess = function(oRequest, oResponse, fnSuccess, mGetEntities, mChangeEntities, mEntityTypes) {
		var oResultData = oResponse.data, bContent, sUri, sPath, aParts,
		oEntityMetadata, mLocalGetEntities = {}, mLocalChangeEntities = {}, that = this;

		bContent = !(oResponse.statusCode === 204 || oResponse.statusCode === '204');

		sUri = oRequest.requestUri;
		sPath = sUri.replace(this.sServiceUrl,"");
		//in batch requests all paths are relative
		if (!jQuery.sap.startsWith(sPath,'/')) {
			sPath = '/' + sPath;
		}
		sPath = this._normalizePath(sPath);
		// decrease laundering
		this.decreaseLaundering(sPath, oRequest.data);
		
		// no data available
		if (bContent && oResultData === undefined && oResponse) {
			// Parse error messages from the back-end
			this._parseResponse(oResponse, oRequest);

			jQuery.sap.log.fatal(this + " - No data was retrieved by service: '" + oResponse.requestUri + "'");
			that.fireRequestCompleted({url : oResponse.requestUri, type : "GET", async : oResponse.async,
				info: "Accept headers:" + this.oHeaders["Accept"], infoObject : {acceptHeaders: this.oHeaders["Accept"]},  success: false});
			return false;
		}
		if (oResultData && oResultData.results && !jQuery.isArray(oResultData.results)) {
			oResultData = oResultData.results;
		}

		// adding the result data to the data object
		if (oResultData && (jQuery.isArray(oResultData) || typeof oResultData == 'object')) {
			//need a deep data copy for import
			oResultData = jQuery.sap.extend(true, {}, oResultData);
			that._importData(oResultData, mLocalGetEntities);
		}


		//get change entities for update/remove
		if (!bContent) {
			aParts = sPath.split("/");
			if (aParts[1]) {
				mLocalChangeEntities[aParts[1]] = oRequest;
				//cleanup of this.mChangedEntities; use only the actual response key
				var oMap = {};
				oMap[aParts[1]] = oRequest;
				this._updateChangedEntities(oMap);
			}
			//for delete requests delete data in model
			if (oRequest.method === "DELETE") {
				delete that.oData[aParts[1]];
				delete that.mContexts["/" + aParts[1]]; // contexts are stored starting with /
				delete that.mChangedEntities[aParts[1]];
			}
		}
		//get entityType for creates
		if (bContent && oRequest.method === "POST") {
			oEntityMetadata = this.oMetadata._getEntityTypeByPath(sPath);
			if (oEntityMetadata) {
				mEntityTypes[oEntityMetadata.entityType] = true;
			}
			// for createEntry entities change context path to new one
			if (oRequest.key) {
				var sKey = this._getKey(oResultData);
				delete this.mChangedEntities[oRequest.key];
				delete this.oData[oRequest.key];
				var oContext = this.getContext("/" + oRequest.key);
				oContext.sPath = '/' + sKey;
				//delete created flag after successfull creation
				if (this.oData[sKey]) {
					delete this.oData[sKey].__metadata.created;
				}
			}
		}

		// Parse messages from the back-end
		this._parseResponse(oResponse, oRequest, mLocalGetEntities, mLocalChangeEntities);

		// Add the Get and Change entities from this request to the main ones (which differ in case of batch requests)
		jQuery.extend(mGetEntities, mLocalGetEntities);
		jQuery.extend(mChangeEntities, mLocalChangeEntities);

		this._updateETag(oRequest, oResponse);
		
		if (fnSuccess) {
			fnSuccess(oResponse.data, oResponse);
		}

		var oEventInfo = this._createEventInfo(oRequest, oResponse);
		this.fireRequestCompleted(oEventInfo);

		return true;
	};

	/**
	 * process request response for failed requests
	 *
	 * @param {object} oRequest The request
	 * @param {object} oResponse The response
	 * @param {function} fnError The error callback function
	 * @private
	 */
	ODataModel.prototype._processError = function(oRequest, oResponse, fnError) {
		var sPath, oError = this._handleError(oResponse, oRequest);
		// decrease laundering
		sPath = '/' + this.getKey(oRequest.data);
		this.decreaseLaundering(sPath, oRequest.data);

		if (fnError) {
			fnError(oError);
		}
		
		var oEventInfo = this._createEventInfo(oRequest, oError);
		this.fireRequestCompleted(oEventInfo);
		this.fireRequestFailed(oEventInfo);

	};

	/**
	 * process request response for aborted requests
	 *
	 * @param {object} oRequest The request
	 * @param {object} oResponse The response
	 * @param {function} fnError The error callback function
	 * @private
	 */
	ODataModel.prototype._processAborted = function(oRequest, oResponse, fnError) {
		var sPath;
		var oError = {
			message: "Request aborted",
			statusCode: 0,
			statusText: "abort",
			headers: {},
			responseText: ""
		};
		// decrease laundering
		sPath = '/' + this.getKey(oRequest.data);
		this.decreaseLaundering(sPath, oRequest.data);
		if (fnError) {
			fnError(oError);
		}
		
		// If no response is contained, request was never sent and completes event can be omitted
		if (oResponse) {
			var oEventInfo = this._createEventInfo(oRequest, oError);
			oEventInfo.success = false;
			this.fireRequestCompleted(oEventInfo);
		}
	};

	/**
	 * process a 'TwoWay' change
	 *
	 * @param {string} sKey Key of the entity to change
	 * @param {object} oData The entry data
	 * @param {boolean} [sUpdateMethod] Sets MERGE/PUT method
	 * @returns {object} oRequest The request object
	 * @private
	 */
	ODataModel.prototype._processChange = function(sKey, oData, sUpdateMethod) {
		var oPayload, oEntityType, mParams, sMethod, sETag, sUrl, mHeaders, aUrlParams, oRequest, oUnModifiedEntry, that = this;

		// delete expand properties = navigation properties
		oEntityType = this.oMetadata._getEntityTypeByPath(sKey);

		//default to MERGE
		if (!sUpdateMethod) {
			sUpdateMethod = "MERGE";
		}

		// do a copy of the payload or the changes will be deleted in the model as well (reference)
		oPayload = jQuery.sap.extend(true, {}, this._getObject('/' + sKey, true), oData);

		if (oData.__metadata && oData.__metadata.created){
			sMethod = "POST";
			sKey = oData.__metadata.created.key;
			mParams = oData.__metadata.created;
		} else if (sUpdateMethod === "MERGE") {
			sMethod = "MERGE";
			// get original unmodified entry for diff
			oUnModifiedEntry = this.oData[sKey];
		} else {
			sMethod = "PUT";
		}

		// remove metadata, navigation properties to reduce payload
		if (oPayload.__metadata) {
			for (var n in oPayload.__metadata) {
				if (n !== 'type' && n !== 'uri' && n !== 'etag') {
					delete oPayload.__metadata[n];
				}
			}
		}

		// delete nav props
		if (oEntityType) {
			var aNavProps = this.oMetadata._getNavigationPropertyNames(oEntityType);
			jQuery.each(aNavProps, function(iIndex, sNavPropName) {
				delete oPayload[sNavPropName];
			});
		}

		if (sMethod === "MERGE" && oEntityType && oUnModifiedEntry) {
			jQuery.each(oPayload, function(sPropName, oPropValue) {
				if (sPropName !== '__metadata') {
					// remove unmodified properties and keep only modified properties for delta MERGE
					if (jQuery.sap.equal(oUnModifiedEntry[sPropName], oPropValue) && !that.isLaundering('/' + sKey + '/' + sPropName)) {
						delete oPayload[sPropName];
					}
				}
			});
			// check if we have unit properties which were changed and if yes sent the associated unit prop also.
			var sPath = "/" + sKey, sUnitNameProp;
			jQuery.each(oPayload, function(sPropName, oPropValue) {
				if (sPropName !== '__metadata') {
					sUnitNameProp = that.getProperty(sPath + "/" + sPropName + "/#@sap:unit");
					if (sUnitNameProp) {
						// set unit property only if it wasn't modified. Otherwise it should already exist on the payload.
						if (oPayload[sUnitNameProp] === undefined) {
							oPayload[sUnitNameProp] = oUnModifiedEntry[sUnitNameProp];
						}
					}
				}
			});
		}

		// remove any yet existing references which should already have been deleted
		oPayload = this._removeReferences(oPayload);
		
		//get additional request info for created entries 
		aUrlParams = mParams && mParams.urlParameters ? ODataUtils._createUrlParamsArray(mParams.urlParameters) : undefined;
		mHeaders = mParams && mParams.headers ? this._getHeaders(mParams.headers) : this._getHeaders();
		sETag = mParams && mParams.eTag ? mParams.eTag : this.getETag(oPayload);
		
		sUrl = this._createRequestUrl('/' + sKey, null, aUrlParams, this.bUseBatch);
		
		oRequest = this._createRequest(sUrl, sMethod, mHeaders, oPayload, sETag);

		if (this.bUseBatch) {
			oRequest.requestUri = oRequest.requestUri.replace(this.sServiceUrl + '/','');
		}

		return oRequest;
	};

	/**
	 * Resolves batchGroup settings for an Entity
	 *
	 * @param {string} sKey Key of the entity
	 * @returns {object} oGroupInfo BatchGroup info
	 * @private
	 * @param {string} skey Path to the Entity
	 * @function
	 */
	ODataModel.prototype._resolveGroup = function(sKey) {
		var oChangeGroup, oEntityType, mParams, sGroupId, sChangeSetId, oData;

		oEntityType = this.oMetadata._getEntityTypeByPath(sKey);
		oData = this._getObject('/' + sKey);
		mParams = oData.__metadata.created;
		//for created entries the group information is retrieved from the params
		if (mParams) {
			return {groupId: mParams.groupId, changeSetId: mParams.changeSetId};
		}
		//resolve groupId/changeSetId
		if (this.mChangeGroups[oEntityType.name]) {
			oChangeGroup = this.mChangeGroups[oEntityType.name];
			sGroupId = oChangeGroup.groupId;
			sChangeSetId = oChangeGroup.single ? jQuery.sap.uid() : oChangeGroup.changeSetId;
		} else if (this.mChangeGroups['*']) {
			oChangeGroup = this.mChangeGroups['*'];
			sGroupId = oChangeGroup.groupId;
			sChangeSetId = oChangeGroup.single ? jQuery.sap.uid() : oChangeGroup.changeSetId;
		}

		return {groupId: sGroupId, changeSetId: sChangeSetId};
	};

	/**
	 * handle ETag
	 *
	 * @param {object} oRequest The request
	 * @param {object} oResponse The response
	 * @private
	 */
	ODataModel.prototype._updateETag = function(oRequest, oResponse) {
		var sUrl, oEntry, sETag;

		// refresh ETag from response directly. We can not wait for the refresh.
		sUrl = oRequest.requestUri.replace(this.sServiceUrl + '/', '');
		if (!jQuery.sap.startsWith(sUrl , "/")) {
			sUrl = "/" + sUrl;
		}
		oEntry = this._getObject(sUrl);
		sETag = this._getHeader("etag", oResponse.headers);
		if (oEntry && oEntry.__metadata && sETag){
			oEntry.__metadata.etag = sETag;
		}
	};

	/**
	 * error handling for requests
	 *
	 * @param {object} oError The error object
	 * @returns {map} mParameters A map of error information
	 * @private
	 */
	ODataModel.prototype._handleError = function(oError, oRequest) {
		var mParameters = {}, /* fnHandler, */ sToken;
		var sErrorMsg = "The following problem occurred: " + oError.message;


		mParameters.message = oError.message;
		if (oError.response){
			// Parse messages from the back-end
			this._parseResponse(oError.response, oRequest);

			if (this.bTokenHandling) {
				// if XSRFToken is not valid we get 403 with the x-csrf-token header : Required.
				// a new token will be fetched in the refresh afterwards.
				sToken = this._getHeader("x-csrf-token", oError.response.headers);
				if (oError.response.statusCode == '403' && sToken && sToken.toLowerCase() === "required") {
					this.resetSecurityToken();
				}
			}
			sErrorMsg += oError.response.statusCode + "," +
			oError.response.statusText + "," +
			oError.response.body;
			mParameters.statusCode = oError.response.statusCode;
			mParameters.statusText = oError.response.statusText;
			mParameters.headers = oError.response.headers;
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

	ODataModel.prototype._getODataHandler = function(sUrl) {
		if (sUrl.indexOf("$batch") > -1) {
			return OData.batchHandler;
		} else if (sUrl.indexOf("$count") > -1) {
			return undefined;
		}else if (this.bJSON) {
			return OData.jsonHandler;
		} else {
			return OData.atomHandler;
		}
	};

	/**
	 * Returns the ETag for a given binding path/context or data object
	 *
	 * @param {string} [sPath] The binding path
	 * @param {sap.ui.model.Context} [oContext] The binding context
	 * @param {object} [oEntity] The entity data
	 *
	 * @returns {string} The found ETag (or null if none could be found)
	 * @public
	 */
	ODataModel.prototype.getETag = function(sPath, oContext, oEntity) {
		if (typeof sPath == "object") {
			oEntity = sPath;
			sPath = "";
		}
		return this._getETag(sPath, oContext, oEntity);
	};
	
	/**
	 * Returns the ETag for a given url, binding path/context or data object
	 *
	 * @param {string} sPath The binding path
	 * @param {sap.ui.model.Context} [oContext] The binding context
	 * @param {object} [oData] The entry data
	 *
	 * @returns {string} The found ETag (or null if none could be found)
	 * @private
	 */
	ODataModel.prototype._getETag = function(sPath, oContext, oData) {
		if (!oData || !oData.__metadata) {
			oData = this._getObject(sPath, oContext);
		}
		if (oData && oData.__metadata) {
			return oData.__metadata.etag;
		}
		return null;
	};

	/**
	 * creation of a request object
	 *
	 * @param {string} sUrl The request Url
	 * @param {string} sMethod The request method
	 * @param {map} [mHeaders] A map of headers
	 * @param {object} [oData] The Data for this request
	 * @param {string} [sETag] The eTag
	 * @param {boolean} [bAsync] Async request
	 * @return {object} request object
	 * @private
	 */
	ODataModel.prototype._createRequest = function(sUrl, sMethod, mHeaders, oData, sETag, bAsync) {
		bAsync = bAsync !== false;

		if (sETag && sMethod !== "GET") {
			mHeaders["If-Match"] = sETag;
		}

		/* make sure to set content type header for POST/PUT requests when using JSON
		 * format to prevent datajs to add "odata=verbose" to the content-type header
		 * may be removed as later gateway versions support this */
		if (sMethod !== "DELETE" && sMethod !== "GET") {
			if (this.bJSON) {
				mHeaders["Content-Type"] = "application/json";
			} else {
				mHeaders["Content-Type"] = "application/atom+xml";
			}
		}
		
		// Set Accept header for $count requests
		if (sUrl.indexOf("$count") > -1) {
			mHeaders["Accept"] = "text/plain, */*;q=0.5";
		}

		// format handling
		if (sMethod === "MERGE" && !this.bUseBatch) {
			mHeaders["x-http-method"] = "MERGE";
			sMethod = "POST";
		}

		var oRequest = {
				headers : mHeaders,
				requestUri : sUrl,
				method : sMethod,
				user: this.sUser,
				password: this.sPassword,
				async: bAsync
		};

		if (oData) {
			oRequest.data = oData;
		}

		if (this.bWithCredentials) {
			oRequest.withCredentials = this.bWithCredentials;
		}

		oRequest.requestID = this._createRequestID();

		return oRequest;
	};

	/**
	 * Checks if a model refresh is needed, either because the the data provided by the sPath and oContext is stored
	 * in the model or new data is added (POST). For batch requests all embedded requests are checked separately.
	 *
	 * @param {object} oRequest The request
	 * @param {object} oResponse The response
	 * @return {boolean} bRefresh Refresh needed
	 * @private
	 */
	ODataModel.prototype._isRefreshNeeded = function(oRequest, oResponse) {
		var bRefreshNeeded = false;

		if (this.bRefreshAfterChange) {
			bRefreshNeeded = true;
		}
		return bRefreshNeeded;
	};
	
	/**
	 * Executes the passed process request method when the metadata is available and takes care
	 * of properly wrapping the response handler and allow request abortion
	 *
	 * @param {function} [fnProcessRequest] the method to prepare the request and add it to the request queue
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 */
	ODataModel.prototype._processRequest = function(fnProcessRequest) {
		var oRequestHandle, oRequest,
			bAborted = false,
			that = this;

		this.oMetadata.loaded().then(function() {
			oRequest = fnProcessRequest();

			that._processRequestQueueAsync(that.mRequests);
			
			if (bAborted) {
				oRequestHandle.abort();
			}
		});

		oRequestHandle = {
			abort: function() {
				bAborted = true;
				if (oRequest) {
					oRequest._aborted = true;
					if (oRequest._handle) {
						oRequest._handle.abort();
					}
				}
			}
		};

		return oRequestHandle;
	};

	/**
	 * Trigger a PUT/MERGE request to the odata service that was specified in the model constructor.
	 * The update method used is defined by the global <code>defaultUpdateMethod</code> parameter which is sap.ui.model.odata.UpdateMethod.Merge by default.
	 * Please note that deep updates are not supported and may not work. These should be done seperate on the entry directly.
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
	 * @param {string} [mParameters.eTag] If specified, the If-Match-Header will be set to this Etag.
	 * 		Please be advised that this feature is officially unsupported as using asynchronous
	 * 		requests can lead to data inconsistencies if the application does not make sure that
	 * 		the request was completed before continuing to work with the data.
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 * @param {map} [mParameters.headers] A map of headers for this request
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: batchGroupId for this request 
	 * @param {string} [mParameters.groupId] groupId for this request
	 * @param {string} [mParameters.changeSetId] changeSetId for this request
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.update = function(sPath, oData, mParameters) {
		var fnSuccess, fnError, oRequest, sUrl, oContext, sETag,
			oStoredEntry, sKey, aUrlParams, sGroupId, sChangeSetId,
			mUrlParams, mHeaders, sMethod, mRequests,
			oKeys = {},
			that = this;

		if (mParameters) {
			sGroupId = mParameters.groupId || mParameters.batchGroupId;
			sChangeSetId = mParameters.changeSetId;
			oContext  = mParameters.context;
			fnSuccess = mParameters.success;
			fnError   = mParameters.error;
			sETag     = mParameters.eTag;
			mHeaders  = mParameters.headers;
			mUrlParams = mParameters.urlParameters;
			// ensure merge paramater backwards compatibility
			if (mParameters.merge !== undefined) {
				sMethod =  mParameters.merge ? "MERGE" : "PUT";
			}
		}

		aUrlParams = ODataUtils._createUrlParamsArray(mUrlParams);
		mHeaders = this._getHeaders(mHeaders);
		sMethod = sMethod ? sMethod : this.sDefaultUpdateMethod;
		sETag = sETag || this._getETag(sPath, oContext, oData);
		oStoredEntry = that._getObject(sPath, oContext);
		if (oStoredEntry) {
			sKey = this._getKey(oStoredEntry);
			oKeys[sKey] = true;
		}

		return this._processRequest(function() {
			sUrl = that._createRequestUrl(sPath, oContext, aUrlParams, that.bUseBatch);
			oRequest = that._createRequest(sUrl, sMethod, mHeaders, oData, sETag);
			oRequest.keys = oKeys;

			mRequests = that.mRequests;
			if (sGroupId in that.mDeferredGroups) {
				mRequests = that.mDeferredRequests;
			}
			that._pushToRequestQueue(mRequests, sGroupId, sChangeSetId, oRequest, fnSuccess, fnError);

			return oRequest;
		});

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
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 * @param {map} [mParameters.headers] A map of headers for this request
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: batchGroupId for this request
	 * @param {string} [mParameters.groupId] groupId for this request
	 * @param {string} [mParameters.changeSetId] changeSetId for this request
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.create = function(sPath, oData, mParameters) {
		var oRequest, sUrl, oEntityMetadata,
		oContext, fnSuccess, fnError, mUrlParams, mRequests,
		mHeaders, aUrlParams, sEtag, sGroupId, sMethod, sChangeSetId,
		that = this;

		// The object parameter syntax has been used.
		if (mParameters) {
			oContext   = mParameters.context;
			mUrlParams = mParameters.urlParameters;
			fnSuccess  = mParameters.success;
			fnError    = mParameters.error;
			sGroupId	= mParameters.groupId || mParameters.batchGroupId;
			sChangeSetId	= mParameters.changeSetId;
			sEtag		= mParameters.eTag;
			mHeaders	= mParameters.headers;
		}

		aUrlParams = ODataUtils._createUrlParamsArray(mUrlParams);
		mHeaders = this._getHeaders(mHeaders);
		sMethod = "POST";

		return this._processRequest(function() {
			sUrl = that._createRequestUrl(sPath, oContext, aUrlParams, that.bUseBatch);
			oRequest = that._createRequest(sUrl, sMethod, mHeaders, oData, sEtag);

			sPath = that._normalizePath(sPath, oContext);
			oEntityMetadata = that.oMetadata._getEntityTypeByPath(sPath);
			oRequest.entityTypes = {};
			if (oEntityMetadata) {
				oRequest.entityTypes[oEntityMetadata.entityType] = true;
			}

			mRequests = that.mRequests;
			if (sGroupId in that.mDeferredGroups) {
				mRequests = that.mDeferredRequests;
			}
			that._pushToRequestQueue(mRequests, sGroupId, sChangeSetId, oRequest, fnSuccess, fnError);

			return oRequest;
		});
	};

	/**
	 * Trigger a DELETE request to the odata service that was specified in the model constructor.
	 *
	 * @param {string} sPath A string containing the path to the data that should be removed.
	 *		The path is concatenated to the sServiceUrl which was specified in the model constructor.
	 * @param {object} [mParameters] Optional, can contain the following attributes:
	 * @param {object} [mParameters.context] If specified the sPath has to be relative to the path given with the context.
	 * @param {function} [mParameters.success]  a callback function which is called when the data has been successfully retrieved.
	 *		The handler can have the following parameters: <code>oData<code> and <code>response</code>.
	 * @param {function} [mParameters.error] a callback function which is called when the request failed.
	 *		The handler can have the parameter: <code>oError</code> which contains additional error information.
	 * @param {string} [mParameters.eTag] If specified, the If-Match-Header will be set to this Etag.
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: batchGroupId for this request
	 * @param {string} [mParameters.groupId] groupId for this request
	 * @param {string} [mParameters.changeSetId] changeSetId for this request
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.remove = function(sPath, mParameters) {
		var oContext, sEntry, fnSuccess, fnError, oRequest, sUrl, sGroupId,
		sChangeSetId, sETag, handleSuccess,
		mUrlParams, mHeaders, aUrlParams, sMethod, mRequests,
		that = this;

		if (mParameters) {
			sGroupId = mParameters.groupId || mParameters.batchGroupId;
			sChangeSetId = mParameters.changeSetId;
			oContext  = mParameters.context;
			fnSuccess = mParameters.success;
			fnError   = mParameters.error;
			sETag     = mParameters.eTag;
			mHeaders  = mParameters.headers;
			mUrlParams = mParameters.urlParameters;
		}

		aUrlParams = ODataUtils._createUrlParamsArray(mUrlParams);
		mHeaders = this._getHeaders(mHeaders);
		sMethod = "DELETE";
		sETag = sETag || this._getETag(sPath, oContext);

		handleSuccess = function(oData, oResponse) {
			sEntry = sUrl.substr(sUrl.lastIndexOf('/') + 1);
			//remove query params if any
			if (sEntry.indexOf('?') !== -1) {
				sEntry = sEntry.substr(0, sEntry.indexOf('?'));
			}
			delete that.oData[sEntry];
			delete that.mContexts["/" + sEntry]; // contexts are stored starting with /

			if (fnSuccess) {
				fnSuccess(oData, oResponse);
			}
		};

		return this._processRequest(function() {
			sUrl = that._createRequestUrl(sPath, oContext, aUrlParams, that.bUseBatch);
			oRequest = that._createRequest(sUrl, sMethod, mHeaders, undefined, sETag);

			mRequests = that.mRequests;
			if (sGroupId in that.mDeferredGroups) {
				mRequests = that.mDeferredRequests;
			}

			that._pushToRequestQueue(mRequests, sGroupId, sChangeSetId, oRequest, handleSuccess, fnError);

			return oRequest;
		});
	};

	/**
	 * Trigger a request to the function import odata service that was specified in the model constructor.
	 *
	 * If the ReturnType of the function import is either an EntityType or a collection of EntityType the
	 * changes are reflected in the model, otherwise they are ignored, and the <code>response</code> can
	 * be processed in the successHandler.
	 *
	 * @param {string} sFunctionName A string containing the name of the function to call. The name is concatenated to the sServiceUrl which was
	 *        specified in the model constructor.
	 * @param {map} [mParameters] Optional parameter map containing any of the following properties:
	 * @param {string} [mParameters.method] A string containing the type of method to call this function with
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 * @param {function} [mParameters.success] a callback function which is called when the data has been successfully retrieved. The handler can have
	 *        the following parameters: <code>oData<code> and <code>response</code>.
	 * @param {function} [mParameters.error] a callback function which is called when the request failed.
	 *		The handler can have the parameter: <code>oError</code> which contains additional error information.
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: batchGroupId for this request
	 * @param {string} [mParameters.groupId] groupId for this request
	 * @param {string} [mParameters.changeSetId] changeSetId for this request
	 *
	 * @return {object} oRequestHandle An object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.callFunction = function (sFunctionName, mParameters) {
		var oRequest, sUrl,
			oFunctionMetadata,
			mRequests,
			mUrlParams,
			aUrlParams,
			fnSuccess, fnError,
			sMethod = "GET",
			aUrlParams,
			mInputParams = {},
			sGroupId,
			sChangeSetId,
			mHeaders,
			that = this;

		if (mParameters) {
			sGroupId 		= mParameters.groupId || mParameters.batchGroupId;
			sChangeSetId 	= mParameters.changeSetId;
			sMethod			= mParameters.method ? mParameters.method : sMethod;
			mUrlParams		= mParameters.urlParameters;
			fnSuccess		= mParameters.success;
			fnError			= mParameters.error;
			mHeaders		= mParameters.headers;
		}

		if (!jQuery.sap.startsWith(sFunctionName, "/")) {
			jQuery.sap.log.fatal(this + " callFunction: path '" + sFunctionName + "' must be absolute!");
			return;
		}

		mHeaders = this._getHeaders(mHeaders);

		return this._processRequest(function() {
			oFunctionMetadata = that.oMetadata._getFunctionImportMetadata(sFunctionName, sMethod);
			jQuery.sap.assert(oFunctionMetadata, that + ": Function " + sFunctionName + " not found in the metadata !");
			if (!oFunctionMetadata) {
				return;
			}

			if (oFunctionMetadata.parameter != null) {
				jQuery.each(mUrlParams, function (sParameterName, oParameterValue) {
					var matchingParams = jQuery.grep(oFunctionMetadata.parameter, function (oParameter) {
						return oParameter.name === sParameterName &&
								(!oParameter.mode || oParameter.mode === "In");
					});
					if (matchingParams != null && matchingParams.length > 0) {
						mInputParams[sParameterName] = ODataUtils.formatValue(oParameterValue, matchingParams[0].type);
					} else {
						jQuery.sap.log.warning(that + " - Parameter '" + sParameterName + "' is not defined for function call '" + sFunctionName + "'!");
					}
				});
			}
			aUrlParams = ODataUtils._createUrlParamsArray(mInputParams);

			sUrl = that._createRequestUrl(sFunctionName, null, aUrlParams, that.bUseBatch);
			oRequest = that._createRequest(sUrl, sMethod, mHeaders, undefined);

			mRequests = that.mRequests;
			if (sGroupId in that.mDeferredGroups) {
				mRequests = that.mDeferredRequests;
			}
			that._pushToRequestQueue(mRequests, sGroupId, sChangeSetId, oRequest, fnSuccess, fnError);

			return oRequest;
		});
	};

	/**
	 * Trigger a GET request to the odata service that was specified in the model constructor.
	 * The data will be stored in the model. The requested data is returned with the response.
	 *
	 * @param {string} sPath A string containing the path to the data which should
	 *		be retrieved. The path is concatenated to the sServiceUrl
	 *		which was specified in the model constructor.
	 * @param {map} [mParameters] Optional parameter map containing any of the following properties:
	 * @param {object} [mParameters.context] If specified the sPath has to be is relative to the path
	 * 		given with the context.
	 * @param {map} [mParameters.urlParameters] A map containing the parameters that will be passed as query strings
	 * @param {array} [mParameters.filters] an array of sap.ui.model.Filter to be included in the request URL
	 * @param {array} [mParameters.sorters] an array of sap.ui.model.Sorter to be included in the request URL
	 * @param {function} [mParameters.success] a callback function which is called when the data has
	 *		been successfully retrieved. The handler can have the
	 *		following parameters: oData and response.
	 * @param {function} [mParameters.error] a callback function which is called when the request
	 * 		failed. The handler can have the parameter: oError which contains additional error information.
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: batchGroupId for this request
	 * @param {string} [mParameters.groupId] groupId for this request
	 *
	 * @return {object} an object which has an <code>abort</code> function to abort the current request.
	 *
	 * @public
	 */
	ODataModel.prototype.read = function(sPath, mParameters) {
		var oRequest, sUrl,
		oContext, mUrlParams, fnSuccess, fnError,
		aFilters, aSorters, sFilterParams, sSorterParams,
		oEntityType, sNormalizedPath,
		aUrlParams, mHeaders, sMethod,
		sGroupId, sETag,
		mRequests,
		that = this;

		// The object parameter syntax has been used.
		if (mParameters) {
			oContext	= mParameters.context;
			mUrlParams	= mParameters.urlParameters;
			fnSuccess	= mParameters.success;
			fnError		= mParameters.error;
			aFilters	= mParameters.filters;
			aSorters	= mParameters.sorters;
			sGroupId 	= mParameters.groupId || mParameters.batchGroupId;
			mHeaders 	= mParameters.headers;
		}
		//if the read is triggered via a refresh we should use the refreshGroupId instead
		if (this.sRefreshGroupId) {
			sGroupId = this.sRefreshGroupId;
		}

		aUrlParams = ODataUtils._createUrlParamsArray(mUrlParams);
		mHeaders = this._getHeaders(mHeaders);
		sMethod = "GET";
		sETag = this._getETag(sPath, oContext);

		function createReadRequest() {
			// Add filter/sorter to URL parameters
			sSorterParams = ODataUtils.createSortParams(aSorters);
			if (sSorterParams) {
				aUrlParams.push(sSorterParams);
			}

			var sTempPath = sPath;
			var iIndex = sPath.indexOf("$count");
			// check if we have a manual count request with filters. Then we have to manually adjust the path.
			if (iIndex !== -1) {
				sTempPath = sPath.substring(0, iIndex - 1);
			}
			
			sNormalizedPath = that._normalizePath(sTempPath, oContext);
			oEntityType = that.oMetadata._getEntityTypeByPath(sNormalizedPath);
			sFilterParams = ODataUtils.createFilterParams(aFilters, that.oMetadata, oEntityType);
			if (sFilterParams) {
				aUrlParams.push(sFilterParams);
			}

			sUrl = that._createRequestUrl(sPath, oContext, aUrlParams, that.bUseBatch);
			oRequest = that._createRequest(sUrl, sMethod, mHeaders, null, sETag);

			mRequests = that.mRequests;
			if (sGroupId in that.mDeferredGroups) {
				mRequests = that.mDeferredRequests;
			}
			that._pushToRequestQueue(mRequests, sGroupId, null, oRequest, fnSuccess, fnError);

			return oRequest;
		}

		// In case we are in batch mode and are processing refreshes before sending changes to the server,
		// the request must be processed synchronously to be contained in the same batch as the changes
		if (this.bUseBatch && this.bIncludeInCurrentBatch) {
			oRequest = createReadRequest();
			return {
				abort: function() {
					if (oRequest) {
						oRequest._aborted = true;
					}
				}
			};
		} else {
			return this._processRequest(createReadRequest);
		}
	};

	/**
	 * Return the parsed XML metadata as a Javascript object. Please note that the metadata is loaded asynchronously and this function might return undefined because the
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
	 * Returns a promise for the loaded state of the metadata. The promise won't get rejected in case the metadata loading failed but
	 * is only resolved if the metadata is loaded successfully.
	 * If <code>refreshMetadata</code> function is called after this promise is already resolved you should rely on the promise returned by
	 * <code>refreshMetadata</code> to get information about the refreshed metadata loaded state.
	 *
	 * @public
	 * @returns {Promise} returns a promise on metadata loaded state
	 *
	 * @since 1.30
	 */
	ODataModel.prototype.metadataLoaded = function() {
			return this.oMetadata.loaded();
	};

	/**
	 * Return the annotation object. Please note that the metadata is loaded asynchronously and this function might return undefined because the
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
	 * Singleton Lazy loading of the annotation parser on demand
	 *
	 * @return {sap.ui.model.odata.Annotations} The annotation parser instance
	 */
	ODataModel.prototype._getAnnotationParser = function(mAnnotationData) {
		if (!this.oAnnotations) {
			jQuery.sap.require("sap.ui.model.odata.ODataAnnotations");
			this.oAnnotations = new ODataAnnotations({
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
	 * Submits the collected changes which were collected by the setProperty method. The update method is defined by the global <code>defaultUpdateMethod</code>
	 * parameter which is sap.ui.model.odata.UpdateMethod.Merge by default. In case of a sap.ui.model.odata.UpdateMethod.Merge request only the changed properties will be updated.
	 * If a URI with a $expand System Query Option was used then the expand entries will be removed from the collected changes.
	 * Changes to this entries should be done on the entry itself. So no deep updates are supported.
	 *
	 * @param {object} [mParameters] a map which contains the following parameter properties:
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: defines the batchGroup that should be submitted. If not specified all deferred groups will be submitted
	 * @param {string} [mParameters.groupId] defines the group that should be submitted. If not specified all deferred groups will be submitted
	 * @param {function} [mParameters.success] a callback function which is called when the data has
	 *            					 been successfully updated. The handler can have the
	 *            	                 following parameters: oData
	 * @param {function} [mParameters.error] a callback function which is called when the request failed. The handler can have the parameter: oError which contains
	 * additional error information
	 *
	 * Important: The success/error handler will only be called if batch support is enabled. If multiple batchGroups are submitted the handlers will be called for every batchGroup.
	 *
	 * @param {string} [mParameters.eTag] an ETag which can be used for concurrency control. If it is specified, it will be used in an If-Match-Header in the request to the server for this entry.
	 * @return {object} an object which has an <code>abort</code> function to abort the current request or requests
	 *
	 * @public
	 */
	ODataModel.prototype.submitChanges = function(mParameters) {
		var oRequest, sGroupId, oGroupInfo, fnSuccess, fnError,
			oRequestHandle, vRequestHandleInternal,
			bAborted = false, sMethod, mChangedEntities,
			mParams,
			that = this;

		if (mParameters) {
			sGroupId = mParameters.groupId || mParameters.batchGroupId;
			fnSuccess =	mParameters.success;
			fnError = mParameters.error;
			// ensure merge paramater backwards compatibility
			if (mParameters.merge !== undefined) {
				sMethod =  mParameters.merge ? "MERGE" : "PUT";
			}
		}

		if (sGroupId && !this.mDeferredGroups[sGroupId]) {
			jQuery.sap.log.fatal(this + " submitChanges: \"" + sGroupId + "\" is not a deferred group!");
		}
		
		mChangedEntities = jQuery.sap.extend(true, {}, that.mChangedEntities);
		
		this.oMetadata.loaded().then(function() {
			jQuery.each(mChangedEntities, function(sKey, oData) {
				oGroupInfo = that._resolveGroup(sKey);
				if (oGroupInfo.groupId === sGroupId || !sGroupId) {
					oRequest = that._processChange(sKey, oData, sMethod || that.sDefaultUpdateMethod);
					oRequest.key = sKey;
					//get params for created entries: could contain success/error handler
					mParams = oData.__metadata && oData.__metadata.created ? oData.__metadata.created : {};
					if (oGroupInfo.groupId in that.mDeferredGroups) {
						that._pushToRequestQueue(that.mDeferredRequests, oGroupInfo.groupId, oGroupInfo.changeSetId, oRequest, mParams.success, mParams.error);
					}
				}
			});

			vRequestHandleInternal = that._processRequestQueue(that.mDeferredRequests, sGroupId, fnSuccess, fnError);
			if (bAborted) {
				oRequestHandle.abort();
			}
		});

		oRequestHandle = {
			abort: function() {
				if (vRequestHandleInternal) {
					if (jQuery.isArray(vRequestHandleInternal)) {
						jQuery.each(vRequestHandleInternal, function(i, oRequestHandle) {
							oRequestHandle.abort();
						});
					} else {
						vRequestHandleInternal.abort();
					}
				} else {
					bAborted = true;
				}
			}
		};

		return oRequestHandle;
	};

	/*
	 * updateChangedEntities
	 * @private
	 * @param {map} mChangedEntities Map of changedEntities
	 */
	ODataModel.prototype._updateChangedEntities = function(mChangedEntities) {
		var that = this, sRootPath;
		function updateChangedEntities(oOriginalObject, oChangedObject) {
			jQuery.each(oChangedObject,function(sKey) {
				var sActPath = sRootPath + '/' + sKey;
				if (jQuery.isPlainObject(oChangedObject[sKey]) && jQuery.isPlainObject(oOriginalObject[sKey])) {
					updateChangedEntities(oOriginalObject[sKey], oChangedObject[sKey]);
					if (jQuery.isEmptyObject(oChangedObject[sKey])) {
						delete oChangedObject[sKey];
					}
				} else if (jQuery.sap.equal(oChangedObject[sKey], oOriginalObject[sKey]) && !that.isLaundering(sActPath)) { 
					delete oChangedObject[sKey];
				} 
			});
		}
		
		jQuery.each(mChangedEntities, function(sKey, oRequest) {
			if (sKey in that.mChangedEntities) {
				var oEntry = that._getObject('/' + sKey, null, true);
				var oChangedEntry = that._getObject('/' + sKey);
				
				jQuery.sap.extend(true, oEntry, oRequest.data);
				
				sRootPath = '/' + sKey;
				updateChangedEntities(oEntry, oChangedEntry);
				
				if (jQuery.isEmptyObject(oChangedEntry)) {
					delete that.mChangedEntities[sKey];
				} else {
					that.mChangedEntities[sKey] = oChangedEntry;
					oChangedEntry.__metadata = {};
					jQuery.extend(oChangedEntry.__metadata, oEntry.__metadata);
				}
			}
		});
	};

	/**
	 *
	 * Resets the collected changes by the setProperty method.
	 *
	 * @param {array} [aPath] 	Array of paths that should be resetted.
	 * 							If no array is passed all changes will be resetted.
	 *
	 * @public
	 */
	ODataModel.prototype.resetChanges = function(aPath) {
		var that = this, aParts, oEntityInfo = {}, oChangeObject, sKey, oEntityMetadata;

		if (aPath) {
			jQuery.each(aPath, function(iIndex, sPath) {
				that.getEntityByPath(sPath, null, oEntityInfo);
				aParts = oEntityInfo.propertyPath.split("/");
				sKey = oEntityInfo.key;
				oChangeObject = that.mChangedEntities[sKey];
				for (var i = 0; i < aParts.length - 1; i++) {
					if (oChangeObject.hasOwnProperty(aParts[i])) {
						oChangeObject = oChangeObject[aParts[i]];
					} else {
						oChangeObject = undefined;
					}
				}
				
				if (oChangeObject) {
					delete oChangeObject[aParts[aParts.length - 1]];
				} 
				
				if (that.mChangedEntities[sKey]) {
					//delete metadata to check if object has changes
					oEntityMetadata = that.mChangedEntities[sKey].__metadata;
					delete that.mChangedEntities[sKey].__metadata;
					if (jQuery.isEmptyObject(that.mChangedEntities[sKey]) || !oEntityInfo.propertyPath) {
						that.metadataLoaded().then(function() {
							that.mChangeHandles[sKey].abort();
						});
						delete that.mChangedEntities[sKey];
					} else {
						that.mChangedEntities[sKey].__metadata = oEntityMetadata;
					}
				} else {
					jQuery.sap.log.warning(that + " - resetChanges: " + sPath + " is not changed");
				}
			});
		} else {
			jQuery.each(this.mChangedEntities, function(sKey, oObject) {
				that.metadataLoaded().then(function() {
					that.mChangeHandles[sKey].abort();
					delete that.mChangeHandles[sKey];
				});
				delete that.mChangedEntities[sKey];
			});
		}
		this.checkUpdate();
	};

	/**
	 * Sets a new value for the given property <code>sPropertyName</code> in the model.
	 *
	 * If the changeBatchGroup for the changed EntityType is set to deferred changes could be submitted
	 * with submitChanges. Otherwise the change will be submitted directly.
	 *
	 * @param {string}  sPath path of the property to set
	 * @param {any}     oValue value to set the property to
	 * @param {object} [oContext=null] the context which will be used to set the property
	 * @param {boolean} [bAsyncUpdate] whether to update other bindings dependent on this property asynchronously
	 * @return {boolean} true if the value was set correctly and false if errors occurred like the entry was not found or another entry was already updated.
	 * @public
	 */
	ODataModel.prototype.setProperty = function(sPath, oValue, oContext, bAsyncUpdate) {

		var oOriginalValue, sPropertyPath, mRequests, oRequest, oEntry = { },
		sResolvedPath, aParts,	sKey, oGroupInfo, oRequestHandle, oEntityMetadata,
		mChangedEntities = {}, oEntityInfo = {}, mParams, that = this;
		
		sResolvedPath = this.resolve(sPath, oContext, true);
		
		var oEntry = this.getEntityByPath(sResolvedPath, null, oEntityInfo);
		if (!oEntry) {
			return false;
		}
		
		sPropertyPath = sResolvedPath.substring(sResolvedPath.lastIndexOf("/") + 1); 
		sKey = oEntityInfo.key;
		oOriginalValue = this._getObject(sPath, oContext, true);
		
		//clone property 
		if (!this.mChangedEntities[sKey]) {
			oEntityMetadata = oEntry.__metadata;
			oEntry = {};
			oEntry.__metadata = jQuery.extend({},oEntityMetadata);
			this.mChangedEntities[sKey] = oEntry;
		}
		
		var oChangeObject = this.mChangedEntities[sKey];
	
		// if property is not available check if it is a complex type and update it
		aParts = oEntityInfo.propertyPath.split("/");
		for (var i = 0; i < aParts.length - 1; i++) {
			if (!oChangeObject.hasOwnProperty(aParts[i])) {
				oChangeObject[aParts[i]] = {};
			}
			oChangeObject = oChangeObject[aParts[i]];
		}
		
		//reset clone if oValue equals the original value
		if (oValue == oOriginalValue && !this.isLaundering('/' + sKey)) {
			delete oChangeObject[sPropertyPath];
			//delete metadata to check if object has changes
			oEntityMetadata = this.mChangedEntities[sKey].__metadata;
			delete this.mChangedEntities[sKey].__metadata;
			if (jQuery.isEmptyObject(this.mChangedEntities[sKey])) {
				that.metadataLoaded().then(function() {
					//setProperty with no change does not create a request the first time so no handle exists
					if (that.mChangeHandles[sKey]) {
						that.mChangeHandles[sKey].abort();
					}
				});
				delete this.mChangedEntities[sKey];
				mChangedEntities[sKey] = true;
				this.checkUpdate(false, bAsyncUpdate, mChangedEntities);
				return true;
			}
			this.mChangedEntities[sKey].__metadata = oEntityMetadata;
		} else {
			oChangeObject[sPropertyPath] = oValue;
		}
		
		oGroupInfo = this._resolveGroup(sKey);

		mRequests = this.mRequests;

		if (oGroupInfo.groupId in this.mDeferredGroups) {
			mRequests = this.mDeferredRequests;
			oRequest = this._processChange(sKey, {__metadata : oEntry.__metadata});
			oRequest.key = sKey;
		} else {
			oRequest = this._processChange(sKey, this._getObject('/' + sKey));
		}
		//get params for created entries: could contain success/error handler
		mParams = oChangeObject.__metadata && oChangeObject.__metadata.created ? oChangeObject.__metadata.created : {};
		
		this.metadataLoaded().then(function() {
			if (!that.mChangeHandles[sKey]) {
				oRequestHandle = {
						abort: function() {
							oRequest._aborted = true;
						}
				};
				that.mChangeHandles[sKey] = oRequestHandle;
			}
			that._pushToRequestQueue(mRequests, oGroupInfo.groupId, oGroupInfo.changeSetId, oRequest, mParams.success, mParams.error);
			that._processRequestQueueAsync(that.mRequests);
		});
		
		mChangedEntities[sKey] = true;
		this.checkUpdate(false, bAsyncUpdate, mChangedEntities);
		return true;
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
		return false;
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
		this.mCustomHeaders = {};

		if (mHeaders) {
			jQuery.each(mHeaders, function(sHeaderName, sHeaderValue){
				// case sensitive check needed to make sure private headers cannot be overridden by difference in the upper/lower case (e.g. accept and Accept).
				if (that._isHeaderPrivate(sHeaderName)){
					jQuery.sap.log.warning(this + " - modifying private header: '" + sHeaderName + "' not allowed!");
				} else {
					mCheckedHeaders[sHeaderName] = sHeaderValue;
				}
			});
			this.mCustomHeaders = mCheckedHeaders;
		}

		// Custom set headers should also be used when requesting annotations, but do not instantiate annotations just for this
		if (this.oAnnotations) {
			this.oAnnotations.setHeaders(this.mCustomHeaders);
		}
	};

	ODataModel.prototype._getHeaders = function(mHeaders) {
		var mCheckedHeaders = {},
		that = this;
		if (mHeaders) {
			jQuery.each(mHeaders, function(sHeaderName, sHeaderValue){
				// case sensitive check needed to make sure private headers cannot be overridden by difference in the upper/lower case (e.g. accept and Accept).
				if (that._isHeaderPrivate(sHeaderName)){
					jQuery.sap.log.warning(this + " - modifying private header: '" + sHeaderName + "' not allowed!");
				} else {
					mCheckedHeaders[sHeaderName] = sHeaderValue;
				}
			});
		}
		return jQuery.extend({}, this.mCustomHeaders, mCheckedHeaders, this.oHeaders);
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
	 * @param {string} sHeader The header
	 * @param {map} mHeaders The map of headers
	 * @returns {string} sHeaderValue The value of the header
	 */
	ODataModel.prototype._getHeader = function(sHeader, mHeaders) {
		var sHeaderName;
		for (sHeaderName in mHeaders) {
			if (sHeaderName.toLowerCase() === sHeader.toLowerCase()) {
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
		return !jQuery.isEmptyObject(this.mChangedEntities);
	};

	ODataModel.prototype.getPendingChanges = function() {
		return jQuery.sap.extend(true, {}, this.mChangedEntities);
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
	 * Enable/Disable XCSRF-Token handling
	 * @param {boolean} [bTokenHandling=true] whether to use token handling or not
	 * @public
	 */
	ODataModel.prototype.setTokenHandlingEnabled  = function(bTokenHandling) {
		this.bTokenHandling = bTokenHandling;
	};

	/**
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
		var that = this;
		if (oContext) {
			var sPath = oContext.getPath();
			delete this.mContexts[sPath]; // contexts are stored starting with /
			// remove starting / if any
			if (jQuery.sap.startsWith(sPath, "/")) {
				sPath = sPath.substr(1);
			}
			that.metadataLoaded().then(function() {
				that.mChangeHandles[sPath].abort();
				delete that.mChangeHandles[sPath];
			});
			delete this.mChangedEntities[sPath];
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
	 * The optional properties parameter can be used as follows:
	 *
	 *   - properties could be an array containing the property names which should be included
	 *     in the new entry. Other properties defined in the entity type are not included.
	 *   - properties could be an object which includes the desired properties and the values
	 *     which should be used for the created entry.
	 *
	 * If properties is not specified, all properties in the entity type will be included in the
	 * created entry.
	 *
	 * If there are no values specified the properties will have undefined values.
	 *
	 * Please note that deep creates (including data defined by navigationproperties) are not supported
	 *
	 * @param {String} sPath Name of the path to the EntitySet
	 * @param {map} mParameters A map of the following parameters:
	 * @param {array|object} [mParameters.properties] An array that specifies a set of properties or the entry
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: The batchGroupId
	 * @param {string} [mParameters.groupId] The GroupId
	 * @param {string} [mParameters.changeSetId] The changeSetId
	 * @param {sap.ui.model.Context} [mParameters.context] The binding context
	 * @param {function} [mParameters.success] The success callback function
	 * @param {function} [mParameters.error] The error callback function
	 * @param {map} [mParameters.headers] A map of headers
	 * @param {map} [mParameters.urlParameters] A map of url parameters
	 *
	 * @return {sap.ui.model.Context} oContext A Context object that point to the new created entry.
	 * @public
	 */
	ODataModel.prototype.createEntry = function(sPath, mParameters) {
		var fnSuccess, fnError, oRequest, sUrl, sETag, oContext,
			sKey, aUrlParams, sGroupId, sChangeSetId, oRequestHandle,
			mUrlParams, mHeaders, mRequests, vProperties, oEntity = {},
			fnCreated,
			sMethod = "POST",
			that = this;

		if (mParameters) {
			vProperties = mParameters.properties;
			sGroupId = mParameters.groupId || mParameters.batchGroupId;
			sChangeSetId = mParameters.changeSetId;
			oContext  = mParameters.context;
			fnSuccess = mParameters.success;
			fnError   = mParameters.error;
			fnCreated = mParameters.created;
			sETag     = mParameters.eTag;
			mHeaders  = mParameters.headers;
			mUrlParams = mParameters.urlParameters;
		}

		sGroupId = sGroupId ? sGroupId : this.sDefaultChangeGroup;
		aUrlParams = ODataUtils._createUrlParamsArray(mUrlParams);
		mHeaders = this._getHeaders(mHeaders);

		function create() {
			var oCreatedContext;
			if (!jQuery.sap.startsWith(sPath, "/")) {
				sPath = "/" + sPath;
			}
			var oEntityMetadata = that.oMetadata._getEntityTypeByPath(sPath);
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
						oEntity[oPropertyMetadata.name] = that._createPropertyValue(oPropertyMetadata.type);
						if (bPropertyInArray) {
							vProperties.splice(vProperties.indexOf(oPropertyMetadata.name),1);
						}
					}
				}
				if (vProperties) {
					jQuery.sap.assert(vProperties.length === 0, "No metadata for the following properties found: " + vProperties.join(","));
				}
			}
			//get EntitySet metadata for data storage
			var oEntitySetMetadata = that.oMetadata._getEntitySetByType(oEntityMetadata);
			sKey = oEntitySetMetadata.name + "('" + jQuery.sap.uid() + "')";
			
			oEntity.__metadata = {type: "" + oEntityMetadata.entityType, uri: that.sServiceUrl + '/' + sKey, created: {
				//store path for later POST
				key: sPath.substring(1), 
				success: fnSuccess, 
				error: fnError, 
				headers: mHeaders, 
				urlParameters: mUrlParams, 
				groupId: sGroupId,
				changeSetId: sChangeSetId,
				eTag: sETag}};
			
			that.oData[sKey] = jQuery.sap.extend(true, {}, oEntity);
			that.mChangedEntities[sKey] = oEntity;
			
			sUrl = that._createRequestUrl(sPath, oContext, aUrlParams, that.bUseBatch);
			oRequest = that._createRequest(sUrl, sMethod, mHeaders, oEntity, sETag);

			oCreatedContext = that.getContext("/" + sKey); // context wants a path
			oRequest.key = sKey;
			
			mRequests = that.mRequests;
			if (sGroupId in that.mDeferredGroups) {
				mRequests = that.mDeferredRequests;
			}

			that.metadataLoaded().then(function() {
				that._pushToRequestQueue(mRequests, sGroupId, sChangeSetId, oRequest, fnSuccess, fnError, mParameters);
	
				oRequestHandle = {
						abort: function() {
							oRequest._aborted = true;
						}
				};
	
				that.mChangeHandles[sKey] = oRequestHandle;
	
				that._processRequestQueueAsync(that.mRequests);
			});
			return oCreatedContext;
		}

		// If no callback function is provided context must be returned sychnronously
		if (fnCreated) {
			this.oMetadata.loaded().then(function() {
				fnCreated(create());
			});
		} else if (this.oMetadata.isLoaded()) {
			return create();
		} else {
			jQuery.sap.log.error("Tried to use createEntry without created-callback, before metadata is available!");
		}
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
	 * @param {string} sType The property type
	 * @param {string} sNamespace The property Namespaace
	 * @returns {string} sDefault Returns undefined
	 * @private
	 */
	ODataModel.prototype._getDefaultPropertyValue = function(sType, sNamespace) {
		return undefined;
	};

	/**
	 * remove url params from path and make path absolute if not already
	 *
	 * @param {string} sPath The binding path
	 * @param {sap.ui.model.Context} [oContext] The binding context
	 * @returns {string} sPath The resolved path
	 * @private
	 */
	ODataModel.prototype._normalizePath = function(sPath, oContext) {
		// remove query params from path if any
		if (sPath && sPath.indexOf('?') !== -1 ) {
			sPath = sPath.substr(0, sPath.indexOf('?'));
		}
		if (!oContext && !jQuery.sap.startsWith(sPath,"/")) {
			jQuery.sap.log.fatal(this + " path " + sPath + " must be absolute if no Context is set");
		}
		return this.resolve(sPath, oContext);
	};

	/**
	 * Enable/Disable automatic updates of all Bindings after change operations
	 * @param {boolean} bRefreshAfterChange Refresh after change
	 * @public
	 * @since 1.16.3
	 */
	ODataModel.prototype.setRefreshAfterChange = function(bRefreshAfterChange) {
		this.bRefreshAfterChange = bRefreshAfterChange;
	};

	/**
	 * Checks if Path points to a list or a single entry
	 * @param {string} sPath The binding path
	 * @param {sap.ui.model.Context} [oContext] The binding context
	 * @returns {boolean} bList Is List
	 * @private
	 */
	ODataModel.prototype.isList = function(sPath, oContext) {
		sPath = this.resolve(sPath, oContext);
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
	 * @param {object} oRequest The request object
	 * @param {function} fnSuccess Success callback function
	 * @param {function} fnError Error callback function
	 * @param {object} oHandler The request handler object
	 * @param {object} oHttpClient The HttpClient object
	 * @param {object} oMetadata The metadata object
	 * @returns {object} oRequestHandle The request handle
	 * @private
	 */
	ODataModel.prototype._request = function(oRequest, fnSuccess, fnError, oHandler, oHttpClient, oMetadata) {
		var oRequestHandle;

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
		oRequestHandle = OData.request(
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
		
		Model.prototype.destroy.apply(this, arguments);

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
		if (this.oMetadataLoadEvent) {
			jQuery.sap.clearDelayedCall(this.oMetadataLoadEvent);
		}
		if (this.oMetadataFailedEvent) {
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
			this.oAnnotations.detachLoaded(this.onAnnotationsLoaded);
			this.oAnnotations.detachFailed(this.onAnnotationsFailed);

			this.oAnnotations.destroy();
			delete this.oAnnotations;
		}

	};

	/**
	 * Setting batch groups as deferred. Requests that belongs to a deferred batch group will be sent manually
	 * via a submitChanges call.
	 *
	 * @param {array} aGroupIds Array of batchGroupIds that should be set as deferred
	 * @deprecated Deprecated since 1.32 use 
	 * @public
	 */
	ODataModel.prototype.setDeferredBatchGroups = function(aGroupIds) {
		this.setDeferredGroups(aGroupIds);
	};
	
	/**
	 * Setting request groups as deferred. Requests that belongs to a deferred group will be sent manually
	 * via a submitChanges call.
	 *
	 * @param {array} aGroupIds Array of GroupIds that should be set as deferred
	 * @public
	 */
	ODataModel.prototype.setDeferredGroups = function(aGroupIds) {
		var that = this;
		this.mDeferredGroups = {};
		jQuery.each(aGroupIds, function(iIndex,sGroupId){
			that.mDeferredGroups[sGroupId] = sGroupId;
		});
	};
	
	/**
	 * Returns the array of batchGroupIds that are set as deferred
	 *
	 * @returns {array} aGroupIds The array of deferred batchGroupIds
	 * @deprecated Deprecated since 1.32 use 
	 * @public
	 */
	ODataModel.prototype.getDeferredBatchGroups = function() {
		return this.getDeferredGroups();
	};
	
		/**
	 * Returns the array of GroupIds that are set as deferred
	 *
	 * @returns {array} aGroupIds The array of deferred GroupIds
	 * @public
	 */
	ODataModel.prototype.getDeferredGroups = function() {
		var aGroupIds = [], i = 0;
		jQuery.each(this.mDeferredGroups, function(sKey, sGroupId){
			aGroupIds[i] = sGroupId;
			i++;
		});
		return aGroupIds;
	};

	/**
	 * Definition of batchGroups per EntityType for "TwoWay" changes
	 *
	 * @param {map} mGroups A map containing the definition of bacthGroups for TwoWay changes. The Map has the
	 * following format:
	 * {
	 * 		"EntityTypeName": {
	 * 			batchGroupId: "ID",
	 * 			[changeSetId: "ID",]
	 * 			[single: true/false,]
	 * 		}
	 * }
	 * bacthGroupId: Defines the bacthGroup for changes of the defined EntityTypeName
	 * changeSetId: Defines a changeSetId wich bundles the changes for the EntityType.
	 * single: Defines if every change will get an own changeSet (true)
	 * @deprecated Deprecated since 1.32 use 
	 * @public
	 */
	ODataModel.prototype.setChangeBatchGroups = function(mGroups) {
		jQuery.each(mGroups, function(sEntityName, oGroup) {
			oGroup.groupId = oGroup.batchGroupId;
		});
		this.setChangeGroups(mGroups);
	};
	
	/**
	 * Definition of batchGroups per EntityType for "TwoWay" changes
	 *
	 * @param {map} mGroups A map containing the definition of bacthGroups for TwoWay changes. The Map has the
	 * following format:
	 * {
	 * 		"EntityTypeName": {
	 * 			groupId: "ID",
	 * 			[changeSetId: "ID",]
	 * 			[single: true/false,]
	 * 		}
	 * }
	 * GroupId: Defines the Group for changes of the defined EntityTypeName
	 * changeSetId: Defines a changeSetId wich bundles the changes for the EntityType.
	 * single: Defines if every change will get an own changeSet (true)
	 * @public
	 */
	ODataModel.prototype.setChangeGroups = function(mGroups) {
		this.mChangeGroups = mGroups;
	};
	
	/**
	 * Returns the definition of batchGroups per EntityType for TwoWay changes
	 * @returns {map} mChangeBatchGroups Definition of bactchGRoups for "TwoWay" changes
	 * @public
	 */
	ODataModel.prototype.getChangeBatchGroups = function() {
		return this.getChangeGroups();
	};
	
	/**
	 * Returns the definition of groups per EntityType for TwoWay changes
	 * @returns {map} mChangeGroups Definition of Groups for "TwoWay" changes
	 * @public
	 */
	ODataModel.prototype.getChangeGroups = function() {
		return this.mChangeGroups;
	};

	/**
	 * Sets the MessageParser that is invoked upon every back-end request. This message parser
	 * analyzes the response and notifies the MessageManager about added and deleted messages.
	 *
	 * @param {object|null} [oParser] The MessageParser instance that parses the responses and adds messages to the MessageManager
	 * @return {ODataModel} Model instance for method chaining
	 */
	ODataModel.prototype.setMessageParser = function(oParser) {
		if (!(oParser instanceof MessageParser)) {
			jQuery.sap.log.error("Given MessageParser is not of type sap.ui.core.message.MessageParser");
			return;
		}
		oParser.setProcessor(this);
		this.oMessageParser = oParser;
		return this;
	};

	/**
	 * Gives the back-end response to the MessageParser in case there is one attached
	 *
	 * @return {void}
	 * @private
	 */
	ODataModel.prototype._parseResponse = function(oResponse, oRequest, mGetEntities, mChangeEntities) {
		try {
			if (!this.oMessageParser) {
				this.oMessageParser = new ODataMessageParser(this.sServiceUrl, this.oMetadata);
				this.oMessageParser.setProcessor(this);
			}
			// Parse response and delegate messages to the set message parser
			return this.oMessageParser.parse(oResponse, oRequest, mGetEntities, mChangeEntities);
		} catch (ex) {
			jQuery.sap.log.error("Error parsing OData messages: " + ex);
		}
	};

	/**
	 * REgister function calls that should be called after an update (e.g. calling dataReceived event of a binding)
	 * @param {function} oFunction The callback function
	 * @private
	 */
	ODataModel.prototype.callAfterUpdate = function(oFunction) {
		this.aCallAfterUpdate.push(oFunction);
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
				annotationsLoadedPromise : this.pAnnotationsLoaded
			});
			// Call checkUpdate when metamodel has been loaded to update metamodel bindings
			this.oMetaModel.loaded().then(function() {
				that.bMetaModelLoaded = true;
				// Update metamodel bindings only
				that.checkUpdate(false, false, null, true);
			}, function (oError) {
				var sMessage = oError.message,
					sDetails;

				if (!sMessage && oError.xmlDoc && oError.xmlDoc.parseError) {
					sMessage = oError.xmlDoc.parseError.reason;
					sDetails = oError.xmlDoc.parseError.srcText;
				}
				jQuery.sap.log.error("error in ODataMetaModel.loaded(): " + sMessage, sDetails,
					"sap.ui.model.odata.v2.ODataModel");
			});
		}
		return this.oMetaModel;
	};
	
	/**
	 * Returns the original value for the property with the given path and context.
	 * The original value is the value that was last responded by the server.
	 * 
	 * @param {string} sPath the path/name of the property
	 * @param {object} [oContext] the context if available to access the property value
	 * @returns {any} vValue the value of the property
	 * @public
	 */
	ODataModel.prototype.getOriginalProperty = function(sPath, oContext) {
		return this._getObject(sPath, oContext, true);
	};
	
	/**
	 * Returns the nearest entity of a path relative to the given context.
	 * Additional entity information will be passed back to the given <code>oEntityInfo</code> object if
	 * a nearest entity exists.
	 * 
	 * @param {string} sPath path to an entity
	 * @param {sap.ui.core.Context} [oContext] context to resolve a relative path against
	 * @param {object} [oEntityInfo.key] The key of the entity.
	 *                 [oEntityInfo.propertyPath] The propertyPath within the entity.
	 * @param {sap.ui.core.Context} [oContext] context to resolve a relative path against
	 * @return {object} the nearest entity object or null if no entity can be resolved.
	 */
	ODataModel.prototype.getEntityByPath = function(sPath, oContext, oEntityInfo) {
		var sResolvedPath = Model.prototype.resolve.call(this,sPath, oContext);
		if (!sResolvedPath) {
			return null;
		}
		var aParts = sResolvedPath.split("/"),
			oEntity = null,
			aPropertyPath = [];
		while (aParts.length > 0)  {
			var sEntryPath = aParts.join("/"),
				oObject = this._getObject(sEntryPath);
			if (oObject) {
				var sKey = this._getKey(oObject);
				if (sKey) {
					oEntity = oObject;
					break;
				}
			}
			aPropertyPath.unshift(aParts.pop());
		}
		if (oEntity) {
			oEntityInfo.propertyPath = aPropertyPath.join("/");
			oEntityInfo.key = sKey;
			return oEntity;
		} 
		return null;
	};
	
	/**
	 * Resolve the path relative to the given context.
	 * In addition to {@link sap.ui.model.Model#resolve resolve} a
	 * canonical path can be resolved that will not contain navigation properties.
	 * 
	 * @param {string} sPath path to resolve
	 * @param {sap.ui.core.Context} [oContext] context to resolve a relative path against
	 * @param {boolean} [bCanonical] if true the canonical path is returned
	 * @return {string} resolved path, canonical path or undefined
	 */
	ODataModel.prototype.resolve = function(sPath, oContext, bCanonical) {
		var sResolvedPath = Model.prototype.resolve.call(this,sPath, oContext);
		if (bCanonical) {
			var oEntityInfo = {},
				oEntity = this.getEntityByPath(sPath, oContext, oEntityInfo);
			if (oEntity) {
				if (oEntityInfo.propertyPath) {
					return "/" + oEntityInfo.key + "/" + oEntityInfo.propertyPath;
				} else {
					return "/" + oEntityInfo.key;
				}
			} else {
				return undefined;
			}
		}
		return sResolvedPath;
	};
	
	/**
	 * Returns whether a given path relative to the given contexts is in laundering state.
	 * If data is send to the server the data state becomes laundering until the 
	 * data was accepted or rejected
	 * 
	 * @param {string} sPath path to resolve
	 * @param {sap.ui.core.Context} [oContext] context to resolve a relative path against
	 * @returns {boolean} true if the data in this path is laundering
	 */
	ODataModel.prototype.isLaundering = function(sPath, oContext) {
		var sResolvedPath = this.resolve(sPath, oContext);
		return (sResolvedPath in this.mLaunderingState) && this.mLaunderingState[sResolvedPath] > 0;
	};
	
	/**
	 * Increases laundering state for a canonical path
	 * @param {string} sPath the canonical path
	 * @param {object} oChangedEntity the changed entity
	 * @private
	 */
	ODataModel.prototype.increaseLaundering = function(sPath, oChangedEntity) {
		if (!oChangedEntity) {
			return;
		}
		for (var n in oChangedEntity) {
			if (n === "__metadata") {
				continue;
			}
			var  oObject = oChangedEntity[n];
			if (jQuery.isPlainObject(oObject)) {
				this.increaseLaundering(sPath + "/" + n, oObject);
			} else {
				var sTargetPath = sPath + "/" + n;
				if (!(sTargetPath in this.mLaunderingState)) {
					this.mLaunderingState[sTargetPath] = 0;
				}
				this.mLaunderingState[sTargetPath]++;
			}
		}
		if (!(sPath in this.mLaunderingState)) {
			this.mLaunderingState[sPath] = 0;
		}
		this.mLaunderingState[sPath]++;
	};

	/**
	 * Decrease one laundering state for the given canonical path
	 * @param {string} sPath the canonical path
	 * @param {object} oChangedEntity the changed entity
	 * @private
	 */
	ODataModel.prototype.decreaseLaundering = function(sPath, oChangedEntity) {
		if (!oChangedEntity) {
			return;
		}
		for (var n in oChangedEntity) {
			if (n === "__metadata") {
				continue;
			}
			var oObject = oChangedEntity[n],
				sTargetPath = sPath + "/" + n;
			if (jQuery.isPlainObject(oObject)) {
				this.decreaseLaundering(sTargetPath, oObject);
			} else {
				if (sTargetPath in this.mLaunderingState) {
					this.mLaunderingState[sTargetPath]--;
					if (this.mLaunderingState[sTargetPath] === 0) {
						delete this.mLaunderingState[sTargetPath];
					}
				}
			}
		}
		this.mLaunderingState[sPath]--;
		if (this.mLaunderingState[sPath] === 0) {
			delete this.mLaunderingState[sPath];
		}
	};
	
	return ODataModel;
});
