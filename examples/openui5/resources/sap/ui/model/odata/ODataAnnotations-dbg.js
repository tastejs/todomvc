/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.odata.ODataAnnotations
sap.ui.define(['./AnnotationParser', 'jquery.sap.global', 'sap/ui/Device', 'sap/ui/base/EventProvider'],
	function(AnnotationParser, jQuery, Device, EventProvider) {
	"use strict";

	/*global ActiveXObject */



	/**
	 * @param {string|string[]} aAnnotationURI The annotation-URL or an array of URLS that should be parsed and merged
	 * @param {sap.ui.model.odata.ODataMetadata} oMetadata
	 * @param {object} mParams
	 *
	 * @class Implementation to access oData Annotations
	 *
	 * @author SAP SE
	 * @version
	 * 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.model.odata.ODataAnnotations
	 * @extends sap.ui.base.Object
	 */
	var ODataAnnotations = EventProvider.extend("sap.ui.model.odata.ODataAnnotations", /** @lends sap.ui.model.odata.ODataAnnotations.prototype */
	{

		// constructor : function(aAnnotationURI, oMetadata, mParams) {
		constructor : function(mOptions) {
			EventProvider.apply(this, arguments);
			
			if (arguments.length !== 1) {
				// Old constructor argument syntax
				if (typeof arguments[2] === "object") {
					mOptions = arguments[2];
				}
				
				mOptions.urls = arguments[0];
				mOptions.metadata = arguments[1];
			}
			
			this.oMetadata = {
				metadata: mOptions.metadata,
				references: null
			};
			this.oAnnotations = mOptions.annotationData ? mOptions.annotationData : {};
			this.bLoaded = false;
			this.bAsync = mOptions && mOptions.async;
			this.xPath = null;
			this.oError = null;
			this.bValidXML = true;
			this.oRequestHandles = [];
			this.oLoadEvent = null;
			this.oFailedEvent = null;
			this.mCustomHeaders = mOptions.headers ? jQuery.extend({}, mOptions.headers) : {};

			if (mOptions.urls) {
				this.addUrl(mOptions.urls);

				if (!this.bAsync) {
					// Synchronous loading, we can directly check for errors
					jQuery.sap.assert(
						!jQuery.isEmptyObject(this.oMetadata.metadata),
						"Metadata must be available for synchronous annotation loading"
					);
					if (this.oError) {
						jQuery.sap.log.error(
							"OData annotations could not be loaded: " + this.oError.message
						);
					}
				}
			}
		},
		metadata : {
			publicMethods : ["parse", "getAnnotationsData", "attachFailed", "detachFailed", "attachLoaded", "detachLoaded"]
		}

	});
	
	
	///////////////////////////////////////////////// Prototype Members ////////////////////////////////////////////////
	
	/**
	 * returns the raw annotation data
	 *
	 * @public
	 * @returns {object} returns annotations data
	 */
	ODataAnnotations.prototype.getAnnotationsData = function() {
		return this.oAnnotations;
	};

	/**
	 * Checks whether annotations from at least one source are available
	 *
	 * @public
	 * @returns {boolean} returns whether annotations is already loaded
	 */
	ODataAnnotations.prototype.isLoaded = function() {
		return this.bLoaded;
	};

	/**
	 * Checks whether annotations loading of at least one of the given URLs has already failed.
	 * Note: For asynchronous annotations {@link #attachFailed} has to be used.
	 *
	 * @public
	 * @returns {boolean} whether annotations request has failed
	 */
	ODataAnnotations.prototype.isFailed = function() {
		return this.oError !== null;
	};

	/**
	 * Fire event loaded to attached listeners.
	 *
	 * @param {map} [mArguments] Map of arguments that will be given as parameters to teh event handler
	 * @return {sap.ui.model.odata.ODataAnnotations} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataAnnotations.prototype.fireLoaded = function(mArguments) {
		this.fireEvent("loaded", mArguments);
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'loaded' event of this <code>sap.ui.model.odata.ODataAnnotations</code>.
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
	 * @return {sap.ui.model.odata.ODataAnnotations} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataAnnotations.prototype.attachLoaded = function(oData, fnFunction, oListener) {
		this.attachEvent("loaded", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'loaded' event of this <code>sap.ui.model.odata.ODataAnnotations</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataAnnotations} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataAnnotations.prototype.detachLoaded = function(fnFunction, oListener) {
		this.detachEvent("loaded", fnFunction, oListener);
		return this;
	};


	/**
	 * Fire event failed to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {string} [mArguments.message]  A text that describes the failure.
	 * @param {string} [mArguments.statusCode]  HTTP status code returned by the request (if available)
	 * @param {string} [mArguments.statusText] The status as a text, details not specified, intended only for diagnosis output
	 * @param {string} [mArguments.responseText] Response that has been received for the request ,as a text string
	 *
	 * @return {sap.ui.model.odata.ODataAnnotations} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataAnnotations.prototype.fireFailed = function(mArguments) {
		this.fireEvent("failed", mArguments);
		return this;
	};


	/**
	 * Attach event-handler <code>fnFunction</code> to the 'failed' event of this <code>sap.ui.model.odata.ODataAnnotations</code>.
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
	 * @return {sap.ui.model.odata.ODataAnnotations} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataAnnotations.prototype.attachFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("failed", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'failed' event of this <code>sap.ui.model.odata.ODataAnnotations</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataAnnotations} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataAnnotations.prototype.detachFailed = function(fnFunction, oListener) {
		this.detachEvent("failed", fnFunction, oListener);
		return this;
	};

	/**
	 * Set custom headers which are provided in a key/value map. These headers are used for all requests.
	 * The Accept-Language header cannot be modified and is set using the Core's language setting.
	 *
	 * To remove these headers simply set the mHeaders parameter to {}. Please also note that when calling this method 
	 * again all previous custom headers are removed unless they are specified again in the mCustomHeaders parameter.
	 *
	 * @param {map} mHeaders the header name/value map.
	 * @public
	 */
	ODataAnnotations.prototype.setHeaders = function(mHeaders) {
		// Copy headers (dont use reference to mHeaders map)
		this.mCustomHeaders = jQuery.extend({}, mHeaders);
	};

	/**
	 * Creates an XML document that can be used by this parser from the given XML content.
	 * 
	 * @param {object|string} vXML - Either an XML Document to be used for parsing or a string that should be parsed as an XML document. In case the first parameter is an object, the second parameter must be set to ensure browser compatibility
	 * @param {string} [sXMLContent] - Fallback XML content as string in case the first parameter was an object and could not be used
	 * @returns {object} The compatible XML document object
	 * @private
	 */
	ODataAnnotations.prototype._createXMLDocument = function(vXML, sXMLContent) {
		var oXMLDoc = null;
		if (typeof vXML === "string") {
			sXMLContent = vXML;
			vXML = null;
		}
		
		if (sap.ui.Device.browser.internet_explorer) {
			// IE creates an XML Document, but we cannot use it since it does not support the
			// evaluate-method. So we have to create a new document from the XML string every time.
			// This also leads to using a difference XPath implementation @see getXPath
			oXMLDoc = new ActiveXObject("Microsoft.XMLDOM"); // ??? "Msxml2.DOMDocument.6.0"
			oXMLDoc.preserveWhiteSpace = true;

			// The MSXML implementation does not parse documents with the technically correct "xmlns:xml"-attribute
			// So if a document contains 'xmlns:xml="http://www.w3.org/XML/1998/namespace"', IE will stop working.
			// This hack removes the XML namespace declaration which is then implicitly set to the default one.
			if (sXMLContent.indexOf(" xmlns:xml=") > -1) {
				sXMLContent = sXMLContent
					.replace(' xmlns:xml="http://www.w3.org/XML/1998/namespace"', "")
					.replace(" xmlns:xml='http://www.w3.org/XML/1998/namespace'", "");
			}

			oXMLDoc.loadXML(sXMLContent);
		} else if (vXML) {
			oXMLDoc = vXML;
		} else if (window.DOMParser) {
			oXMLDoc = new DOMParser().parseFromString(sXMLContent, 'application/xml');
		} else {
			jQuery.sap.log.fatal("The browser does not support XML parsing. Annotations are not available.");
		}
		

		return oXMLDoc;
	};
	
	/**
	 * Checks the given XML document for parse errors
	 *
	 * @param {object} oXMLDoc - The XML document object
	 * @return {boolean} true if errors exist false otherwise
	 */
	ODataAnnotations.prototype._documentHasErrors = function(oXMLDoc) {
		return (
			// All browsers including IE
			oXMLDoc.getElementsByTagName("parsererror").length > 0
			// IE 11 special case
			|| (oXMLDoc.parseError && oXMLDoc.parseError.errorCode !== 0)
		);
	};
	
	/**
	 * Merges the newly parsed annotation data into the already existing one.
	 * The merge operates on Terms and overwrites existing annotations on that level.
	 * 
	 * @param {map} mAnnotations - The new annotations that should be merged into the ones in this instance
	 * @param {boolean} [bSuppressEvents] - if set to true, the "loaded"-event is not fired
	 * @returns {void}
	 */
	ODataAnnotations.prototype._mergeAnnotationData = function(mAnnotations, bSuppressEvents) {
		if (!this.oAnnotations) {
			this.oAnnotations = {};
		}

		// Merge must be done on Term level, this is why the original line does not suffice any more:
		//     jQuery.extend(true, this.oAnnotations, mAnnotations);
		// Terms are defined on different levels, the main one is below the target level, which is directly
		// added as property to the annotations object and then in the same way inside two special properties
		// named "propertyAnnotations" and "EntityContainer"

		function mergeAnnotation(sName, mSource, mTarget) {
			// Everythin in here must be on Term level, so we overwrite the target with the data from the source

			if (Array.isArray(mSource[sName])) {
				// This is a collection - make sure it stays one
				mTarget[sName] = mSource[sName].slice(0);
			} else {
				// Make sure the map exists in the target
				mTarget[sName] = mTarget[sName] || {};

				for (var sKey in mSource[sName]) {
					mTarget[sName][sKey] = mSource[sName][sKey];
				}
			}
		}

		var sTarget, sTerm;
		var aSpecialCases = ["propertyAnnotations", "EntityContainer", "annotationReferences"];
		
		// First merge standard annotations
		for (sTarget in mAnnotations) {
			if (aSpecialCases.indexOf(sTarget) !== -1) {
				// Skip these as they are special properties that contain Target level definitions
				continue;
			}

			// ...all others contain Term level definitions
			mergeAnnotation(sTarget, mAnnotations, this.oAnnotations);
		}

		// Now merge special cases
		for (var i = 0; i < aSpecialCases.length; ++i) {
			var sSpecialCase = aSpecialCases[i];

			this.oAnnotations[sSpecialCase] = this.oAnnotations[sSpecialCase] || {}; // Make sure the the target namespace exists
			for (sTarget in mAnnotations[sSpecialCase]) {
				for (sTerm in mAnnotations[sSpecialCase][sTarget]) {
					// Now merge every term
					this.oAnnotations[sSpecialCase][sTarget] = this.oAnnotations[sSpecialCase][sTarget] || {};
					mergeAnnotation(sTerm, mAnnotations[sSpecialCase][sTarget], this.oAnnotations[sSpecialCase][sTarget]);
				}
			}
		}

		this.bLoaded = true;

		if (!bSuppressEvents) {
			this.fireLoaded({
				annotations: mAnnotations
			});
		}
	};	
	
	/**
	 * Sets an XML document
	 *
	 * @param {object} oXMLDocument The XML document to parse for annotations
	 * @param {string} sXMLContent The XML content as string to parse for annotations
	 * @param {map} [mOptions] Additional options
	 * @param {fuction} [mOptions.success] Success callback gets an objec as argument with the
	 *                  properties "annotations" containing the parsed annotations and "xmlDoc"
	 *                  containing the XML-Document that was returned by the request.
	 * @param {fuction} [mOptions.error] Error callback gets an objec as argument with the
	 *                  property "xmlDoc" containing the XML-Document that was returned by the
	 *                  request and could not be correctly parsed.
	 * @param {boolean} [mOptions.fireEvents] If this option is set to true, events are fired as if the annotations
	 *                  were loaded from a URL
	 * @return {boolean} Whether or not parsing was successful
	 * @public
	 */
	ODataAnnotations.prototype.setXML = function(oXMLDocument, sXMLContent, mOptions) {
		// Make sure there are always callable handlers
		var mDefaultOptions = {
			success:    function() {},
			error:      function() {},
			fireEvents: false
		};
		mOptions = jQuery.extend({}, mDefaultOptions, mOptions);

		var oXMLDoc = this._createXMLDocument(oXMLDocument, sXMLContent);

		var fnParseDocument = function(oXMLDoc) {
			var mResult = {
				xmlDoc : oXMLDoc
			};

			var oAnnotations = AnnotationParser.parse(this.oMetadata, oXMLDoc);

			if (oAnnotations) {
				mResult.annotations = oAnnotations;
				mOptions.success(mResult);
				this._mergeAnnotationData(oAnnotations, !mOptions.fireEvents);
			} else {
				
				mOptions.error(mResult);
				if (mOptions.fireEvents) {
					this.fireFailed(mResult);
				}
			}
		}.bind(this, oXMLDoc);



		if (this._documentHasErrors(oXMLDoc)) {
			// Malformed XML, notify application of the problem

			// This seems to be needed since with some jQuery versions the XML document
			// is partly parsed and with some it is not parsed at all. We now choose the
			// "safe" approach and only accept completely valid documents.
			mOptions.error({
				xmlDoc : oXMLDoc
			});
			return false;
		} else {
			// Check if Metadata is loaded on the model. We need the Metadata to parse the annotations

			var oMetadata = this.oMetadata.metadata.getServiceMetadata();
			if (!oMetadata || jQuery.isEmptyObject(oMetadata)) {
				// Metadata is not loaded, wait for it before trying to parse
				this.oMetadata.metadata.attachLoaded(fnParseDocument);
			} else {
				fnParseDocument();
			}
			return true;
		}
	};

	/**
	 * Adds (a) new URL(s) to the be parsed for OData annotations, which are then merged into the annotations object
	 * which can be retrieved by calling the getAnnotations()-method.
	 *
	 * @param {string|sting[]} vUrl - Either one URL as string or an array or URL strings
	 * @return {Promise} The Promise to load the given URL(s), resolved if all URLs have been loaded, rejected if at least one failed to load
	 * 		The argument is an object containing the annotations-object, success (an array of sucessfully loaded URLs), fail (an array ob of failed URLs)
	 * @public
	 */
	ODataAnnotations.prototype.addUrl = function(vUrl) {
		var that = this;

		var aUris = vUrl;

		if (Array.isArray(vUrl) && vUrl.length == 0) {
			return Promise.resolve({annotations: this.oAnnotations});
		}

		if (!Array.isArray(vUrl)) {
			aUris = [ vUrl ];
		}

		return new Promise(function(fnResolve, fnReject) {
			var iLoadCount = 0;

			var mResults = {
				annotations: null,
				success: [],
				fail: []
			};
			var fnRequestCompleted = function(mResult) {
				iLoadCount++;

				if (mResult.type === "success") {
					mResults.success.push(mResult);
				} else {
					mResults.fail.push(mResult);
				}

				if (iLoadCount === aUris.length) {
					// Finished loading all URIs
					mResults.annotations = that.oAnnotations;

					if (mResults.success.length > 0) {
						// For compatibility reasons, we fire the loaded event if at least one has been loaded...
						var mSuccess = {
							annotations: that.oAnnotations,
							results: mResults
						};

						if (that.bAsync) {
							that.fireLoaded(mSuccess);
						} else {
							that.oLoadEvent = jQuery.sap.delayedCall(0, that, that.fireLoaded, [ mSuccess ]);
						}
					}

					if (mResults.success.length < aUris.length) {
						// firefailed is called for every failed URL in _loadFromUrl
						fnReject(mResults);
					} else {
						// All URLs could be loaded and parsed
						fnResolve(mResults);
					}
				}
			};

			var i = 0;
			if (that.bAsync) {
				var promiseChain = Promise.resolve();
				
				for (i = 0; i < aUris.length; ++i) {
					var fnLoadNext = that._loadFromUrl.bind(that, aUris[i]);
					promiseChain = promiseChain
						.then(fnLoadNext, fnLoadNext)
						.then(fnRequestCompleted, fnRequestCompleted);
				}
				
			} else {
				for (i = 0; i < aUris.length; ++i) {
					that._loadFromUrl(aUris[i]).then(fnRequestCompleted, fnRequestCompleted);
				}
			}
		});
	};

	/**
	 * Returns a promise to load and parse annotations from a single URL, resolves if the URL could be loaded and parsed, rejects
	 * otherwise
	 *
	 * @param {string} sUrl - The URL to load
	 * @return {Promise} The promise to load the URL. Argument contains information about the failed or succeeded request
	 */
	ODataAnnotations.prototype._loadFromUrl = function(sUrl) {
		var that = this;
		return new Promise(function(fnResolve, fnReject) {
			var mAjaxOptions = {
				url: sUrl,
				async: that.bAsync,
				headers: jQuery.extend({}, that.mCustomHeaders, {
					"Accept-Language": sap.ui.getCore().getConfiguration().getLanguage() // Always overwrite
				})
			};

			var oRequestHandle;
			var fnFail = function(oJQXHR, sStatusText) {
				if (oRequestHandle && oRequestHandle.bSuppressErrorHandlerCall) {
					return;
				}

				that.oError = {
					type:			"fail",
					url:			sUrl,
					message:		sStatusText,
					statusCode:		oJQXHR.statusCode,
					statusText:		oJQXHR.statusText,
					responseText:	oJQXHR.responseText
				};

				if (that.bAsync) {
					that.oFailedEvent = jQuery.sap.delayedCall(0, that, that.fireFailed, [ that.oError ]);
				} else {
					that.fireFailed(that.oError);
				}

				fnReject(that.oError);

			};

			var fnSuccess = function(sData, sStatusText, oJQXHR) {
				that.setXML(oJQXHR.responseXML, oJQXHR.responseText, {
					success: function(mData) {
						fnResolve({
							type:			"success",
							url: 			sUrl,
							message:		sStatusText,
							statusCode:		oJQXHR.statusCode,
							statusText:		oJQXHR.statusText,
							responseText:		oJQXHR.responseText
						});
					},
					error : function(mData) {
						fnFail(oJQXHR, "Malformed XML document");
					},
					url: sUrl
				});
			};

			jQuery.ajax(mAjaxOptions).done(fnSuccess).fail(fnFail);
		});
	};


	ODataAnnotations.prototype.destroy = function() {
		// Abort pending xml request
		for (var i = 0; i < this.oRequestHandles.length; ++i) {
			if (this.oRequestHandles[i]) {
				this.oRequestHandles[i].bSuppressErrorHandlerCall = true;
				this.oRequestHandles[i].abort();
				this.oRequestHandles[i] = null;
			}
		}

		EventProvider.prototype.destroy.apply(this, arguments);
		if (this.oLoadEvent) {
			jQuery.sap.clearDelayedCall(this.oLoadEvent);
		}
		if (this.oFailedEvent) {
			jQuery.sap.clearDelayedCall(this.oFailedEvent);
		}
	};


	return ODataAnnotations;

});
