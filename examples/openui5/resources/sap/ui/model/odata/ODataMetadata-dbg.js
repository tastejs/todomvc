/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */



// Provides class sap.ui.model.odata.ODataMetadata
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/thirdparty/datajs'],
	function(jQuery, EventProvider, OData) {
	"use strict";

	/**
	 * Constructor for a new ODataMetadata.
	 *
	 * @param {string} sMetadataURI needs the correct metadata uri including $metadata
	 * @param {object} [mParams] optional map of parameters.
	 * @param {boolean} [mParams.async=true] request is per default async
	 * @param {string} [mParams.user] user for the service,
	 * @param {string} [mParams.password] password for service
	 * @param {object} [mParams.headers] (optional) map of custom headers which should be set with the request.
	 *
	 * @class
	 * Implementation to access oData metadata
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.model.odata.ODataMetadata
	 * @extends sap.ui.base.EventProvider
	 */
	var ODataMetadata = EventProvider.extend("sap.ui.model.odata.ODataMetadata", /** @lends sap.ui.model.odata.ODataMetadata.prototype */ {

		constructor : function(sMetadataURI, mParams) {
			EventProvider.apply(this, arguments);

			this.bLoaded = false;
			this.bFailed = false;
			this.mEntityTypes = {};
			this.mRequestHandles = {};
			this.sUrl = sMetadataURI;
			this.bAsync = mParams.async;
			this.sUser = mParams.user;
			this.bWithCredentials = mParams.withCredentials;
			this.sPassword = mParams.password;
			this.mHeaders = mParams.headers;
			this.oLoadEvent = null;
			this.oFailedEvent = null;
			this.oMetadata = null;
			this.mNamespaces = mParams.namespaces || {
				sap:"http://www.sap.com/Protocols/SAPData",
				m:"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata",
				"":"http://schemas.microsoft.com/ado/2007/06/edmx"
			};
			var that = this;
			this.fnResolve;
			// global promise
			this.pLoaded = new Promise(function(resolve, reject) {
					that.fnResolve = resolve;
			});

			this._loadMetadata()
				.catch(function() {
					// Ignored for initial metadata loading. Error handling is done inside _loadMetadata
					jQuery.sap.assert(false, "[ODataMetadata] initial loading of metadata failed");
				});
		},

		metadata : {
			publicMethods : ["getServiceMetadata", "attachFailed", "detachFailed", "attachLoaded", "detachLoaded", "refresh"]
		}

	});

	ODataMetadata.prototype._setNamespaces = function(mNamespaces) {
		this.mNamespaces = mNamespaces;
	};
	/**
	 * Loads the metadata for the service
	 *
	 * @param string sUrl The metadata url
	 * @param boolean bSuppressEvents Suppress metadata events
	 * @returns Promise Promise for metadata loading
	 * @private
	 */
	ODataMetadata.prototype._loadMetadata = function(sUrl, bSuppressEvents) {

		// request the metadata of the service
		var that = this;
		sUrl = sUrl || this.sUrl;
		var oRequest = this._createRequest(sUrl);
		
		return new Promise(function(resolve, reject) {
			var oRequestHandle, aEntitySets = [];
			function _handleSuccess(oMetadata, oResponse) {
				if (!oMetadata || !oMetadata.dataServices) {
					var mParameters = {
							message: "Invalid metadata document",
							request: oRequest,
							response: oResponse
					};
					_handleError(mParameters);
					return;
				}
				
				that.sMetadataBody = oResponse.body;
				that.oMetadata = that.oMetadata ? that.merge(that.oMetadata, oMetadata, aEntitySets) : oMetadata;
				that.oRequestHandle = null;
				
				var mParams = {
					metadataString: that.sMetadataBody,
					entitySets: aEntitySets
				};
				// resolve global promise
				that.fnResolve(mParams);
				// resolve this promise
				resolve(mParams);
				
				if (that.bAsync && !bSuppressEvents) {
					that.fireLoaded(that);
				} else if (!that.bAsync && !bSuppressEvents){
					//delay the event so anyone can attach to this _before_ it is fired, but make
					//sure that bLoaded is already set properly
					that.bLoaded = true;
					that.oLoadEvent = jQuery.sap.delayedCall(0, that, that.fireLoaded, [ mParams ]);
				}
			}
			
			function _handleError(oError) {
				var mParams = {
						message: oError.message,
						request: oError.request,
						response: oError.response
				};
				if (oError.response) {
					mParams.statusCode = oError.response.statusCode;
					mParams.statusText = oError.response.statusText;
					mParams.responseText = oError.response.body;
				}
				
				if (oRequestHandle && oRequestHandle.bSuppressErrorHandlerCall) {
					return;
				}
				if (that.bAsync) {
					delete that.mRequestHandles[oRequestHandle.id];
				}
				reject(mParams);
				if (that.bAsync && !bSuppressEvents) {
					that.fireFailed(mParams);
				} else if (!that.bAsync && !bSuppressEvents){
					that.bFailed = true;
					that.oFailedEvent = jQuery.sap.delayedCall(0, that, that.fireFailed, [mParams]);
				}
			}
			
			// execute the request
			oRequestHandle = OData.request(oRequest, _handleSuccess, _handleError, OData.metadataHandler);
			if (that.bAsync) {
				oRequestHandle.id = jQuery.sap.uid();
				that.mRequestHandles[oRequestHandle.id] = oRequestHandle;
			}
		});
		
	};

	/**
	 * Refreshes the metadata creating a new request to the server.
	 * Returns a new promise which can be resolved or rejected depending on the metadata loading state.
	 * 
	 * @returns {Promise} returns a promise on metadata loaded state
	 *
	 * @public
	 */
	ODataMetadata.prototype.refresh = function(){
		return this._loadMetadata();
	};


	/**
	 * Return the metadata object
	 *
	 * @return {Object} metdata object
	 * @public
	 */
	ODataMetadata.prototype.getServiceMetadata = function() {
		return this.oMetadata;
	};

	/**
	 * Checks whether metadata is available
	 *
	 * @public
	 * @returns {boolean} returns whether metadata is already loaded
	 */
	ODataMetadata.prototype.isLoaded = function() {
		return this.bLoaded;
	};

	/**
	 * Returns a promise for the loaded state of the metadata
	 *
	 * @public
	 * @returns {Promise} returns a promise on metadata loaded state
	 */
	ODataMetadata.prototype.loaded = function() {
		return this.pLoaded;
	};

	/**
	 * Checks whether metadata loading has already failed
	 *
	 * @public
	 * @returns {boolean} returns whether metadata request has failed
	 */
	ODataMetadata.prototype.isFailed = function() {
		return this.bFailed;
	};

	/**
	 * Fire event loaded to attached listeners.
	 *
	 * @return {sap.ui.model.odata.ODataMetadata} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataMetadata.prototype.fireLoaded = function(mParams) {
		this.bLoaded = true;
		this.fireEvent("loaded", mParams);
		jQuery.sap.log.debug(this + " - loaded was fired");
		return this;
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'loaded' event of this <code>sap.ui.model.odata.ODataMetadata</code>.
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
	 * @return {sap.ui.model.odata.ODataMetadata} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataMetadata.prototype.attachLoaded = function(oData, fnFunction, oListener) {
		this.attachEvent("loaded", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'loaded' event of this <code>sap.ui.model.odata.ODataMetadata</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataMetadata} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataMetadata.prototype.detachLoaded = function(fnFunction, oListener) {
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
	 * @return {sap.ui.model.odata.ODataMetadata} <code>this</code> to allow method chaining
	 * @protected
	 */
	ODataMetadata.prototype.fireFailed = function(mArguments) {
		this.bFailed = true;
		this.fireEvent("failed", mArguments);
		return this;
	};


	/**
	 * Attach event-handler <code>fnFunction</code> to the 'failed' event of this <code>sap.ui.model.odata.ODataMetadata</code>.
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
	 * @return {sap.ui.model.odata.ODataMetadata} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataMetadata.prototype.attachFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("failed", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'failed' event of this <code>sap.ui.model.odata.ODataMetadata</code>.
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.model.odata.ODataMetadata} <code>this</code> to allow method chaining
	 * @public
	 */
	ODataMetadata.prototype.detachFailed = function(fnFunction, oListener) {
		this.detachEvent("failed", fnFunction, oListener);
		return this;
	};


	/**
	 * Extract the entity type name of a given sPath. Also navigation properties in the path will be followed to get the right entity type for that property.
	 * eg.
	 * /Categories(1)/Products(1)/Category --> will get the Categories entity type
	 * /Products --> will get the Products entity type
	 * @return {object} the entity type or null if not found
	 */
	ODataMetadata.prototype._getEntityTypeByPath = function(sPath) {
		if (!sPath) {
			jQuery.sap.assert(undefined, "sPath not defined!");
			return null;
		}
		if (!this.oMetadata || jQuery.isEmptyObject(this.oMetadata)) {
			jQuery.sap.assert(undefined, "No metadata loaded!");
			return null;
		}

		if (this.mEntityTypes[sPath]) {
			return this.mEntityTypes[sPath];
		}

		// remove starting and trailing /
		var sCandidate = sPath.replace(/^\/|\/$/g, ""),
			aParts = sCandidate.split("/"),
			iLength = aParts.length,
			oParentEntityType,
			aEntityTypeName,
			oEntityType,
			oResultEntityType,
			that = this;

		// remove key from first path segment if any (e.g. Products(555) --> Products)
		if (aParts[0].indexOf("(") != -1) {
			aParts[0] = aParts[0].substring(0,aParts[0].indexOf("("));
		}

		if (iLength > 1 ) {
			// check if navigation property is used
			// e.g. Categories(1)/Products(1)/Category --> Category is a navigation property so we need the collection Categories

			oParentEntityType = that._getEntityTypeByPath(aParts[0]);

			for (var i = 1; i < aParts.length; i++ ) {
				if (oParentEntityType) {
					// remove key from current part if any
					if (aParts[i].indexOf("(") != -1) {
						aParts[i] = aParts[i].substring(0,aParts[i].indexOf("("));
					}
					// check for navigation properties
					// if no navigation property found we assume that the current part is a normal property so we return the current oParentEntityType
					// which is the parent entity type of that property
					oResultEntityType = that._getEntityTypeByNavProperty(oParentEntityType, aParts[i]);
					if (oResultEntityType) {
						oParentEntityType = oResultEntityType;
					}

					oEntityType = oParentEntityType;

				}
			}
		} else {
			// if only one part exists it should be the name of the collection and we can get the entity type for it
			aEntityTypeName = this._splitName(this._getEntityTypeName(aParts[0]));
			oEntityType = this._getObjectMetadata("entityType", aEntityTypeName[0], aEntityTypeName[1]);
			if (oEntityType) {
				// store the type name also in the oEntityType
				oEntityType.entityType = this._getEntityTypeName(aParts[0]);
			}
		}

		// check for function imports
		if (!oEntityType) {
			var sFuncCandName = aParts[aParts.length - 1]; // last segment is always a function import
			var oFuncType = this._getFunctionImportMetadata(sFuncCandName, "GET");
			if (!oFuncType) {
				oFuncType = this._getFunctionImportMetadata(sFuncCandName, "POST");
			}
			if (oFuncType && oFuncType.entitySet) { // only collections supported which have an entitySet
				oEntityType = this._getEntityTypeByPath(oFuncType.entitySet);
				if (oEntityType) {
					// store the type name also in the oEntityType
					oEntityType.entityType = this._getEntityTypeName(oFuncType.entitySet);
				}
			}
		}

		if (oEntityType) {
			this.mEntityTypes[sPath] = oEntityType;
		}

		//jQuery.sap.assert(oEntityType, "EntityType for path " + sPath + " could not be found!");
		return oEntityType;
	};

	/**
	 * Extract the entity type from a given sName. Retrieved types will be cached
	 * so further calls must not iterate the metadata structure again.
	 *
	 * #/Category/CategoryName --> will get the Category entity type
	 * @param {string} sName the qualified or unqualified name of the entity
	 * @return {object} the entity type or null if not found
	 */
	ODataMetadata.prototype._getEntityTypeByName = function(sName) {
		var oEntityType, that = this, sEntityName, sNamespace, iSeparator;

		if (!sName) {
			jQuery.sap.assert(undefined, "sName not defined!");
			return null;
		}
		iSeparator = sName.indexOf(".");
		if (iSeparator > 0) {
			sNamespace = sName.substr(0, iSeparator);
			sEntityName = sName.substr(iSeparator + 1);
		} else {
			sEntityName = sName;
		}
		if (!this.oMetadata || jQuery.isEmptyObject(this.oMetadata)) {
			jQuery.sap.assert(undefined, "No metadata loaded!");
			return null;
		}
		if (this.mEntityTypes[sName]) {
			oEntityType = this.mEntityTypes[sName];
		} else {
			jQuery.each(this.oMetadata.dataServices.schema, function(i, oSchema) {
				if (oSchema.entityType && (!sNamespace || oSchema.namespace === sNamespace)) {
					jQuery.each(oSchema.entityType, function(k, oEntity) {
						if (oEntity.name === sEntityName) {
							oEntityType = oEntity;
							that.mEntityTypes[sName] = oEntityType;
							oEntityType.namespace = oSchema.namespace;
							return false;
						}
					});
				}
			});
		}
		return oEntityType;
	};

	/**
	 * Extracts an Annotation from given path parts
	 * @param {array} aMetaParts
	 * @returns {any}
	 * @private
	 */
	ODataMetadata.prototype._getAnnotation = function(sPath) {
		var oNode, aParts, sMetaPath, aMetaParts, oEntityType, sPropertyPath, oProperty;

		aParts = sPath.split('/#');
		aMetaParts = aParts[1].split('/');

		//check if we have an absolute meta binding
		if (!aParts[0]) {
			// first part must be the entityType
			oEntityType = this._getEntityTypeByName(aMetaParts[0]);

			jQuery.sap.assert(oEntityType, aMetaParts[0] + " is not a valid EnityType");

			if (!oEntityType) {
				return;
			}

			//extract property
			sPropertyPath = aParts[1].substr(aParts[1].indexOf('/') + 1);
			oProperty = this._getPropertyMetadata(oEntityType,sPropertyPath);

			jQuery.sap.assert(oProperty, sPropertyPath + " is not a valid property path");
			if (!oProperty) {
				return;
			}

			sMetaPath = sPropertyPath.substr(sPropertyPath.indexOf(oProperty.name));
			sMetaPath = sMetaPath.substr(sMetaPath.indexOf('/') + 1);
		} else {
			//getentityType from data Path
			oEntityType = this._getEntityTypeByPath(aParts[0]);

			jQuery.sap.assert(oEntityType, aParts[0] + " is not a valid path");

			if (!oEntityType) {
				return;
			}

			//extract property
			sPath = aParts[0].replace(/^\/|\/$/g, "");
			sPropertyPath = sPath.substr(sPath.indexOf('/') + 1);
			oProperty = this._getPropertyMetadata(oEntityType,sPropertyPath);

			jQuery.sap.assert(oProperty, sPropertyPath + " is not a valid property path");
			if (!oProperty) {
				return;
			}

			sMetaPath = aMetaParts.join('/');
		}



		oNode = this._getAnnotationObject(oEntityType, oProperty, sMetaPath);

		return oNode;
	};

	/**
	 * Extract the Annotation Object from a given oProperty and a metadata path
	 *
	 * @return {object} the annotation object/value
	 */
	ODataMetadata.prototype._getAnnotationObject = function(oEntityType, oObject, sMetaDataPath) {
		var aAnnotationParts, aParts, oAnnotation, oNode, sAnnotation;

		if (!oObject) {
			return;
		}

		oNode = oObject;
		aParts = sMetaDataPath.split('/');

		//V4 annotation
		if (aParts[0].indexOf('.') > -1) {
			return this._getV4AnnotationObject(oEntityType, oObject, aParts);
		} else {
			if (aParts.length > 1) {
				//TODO:namespace handling
				oNode = oNode[aParts[0]];
				if (!oNode && oObject.extensions) {
					for (var i = 0; i < oObject.extensions.length; i++) {
						var oExtension = oObject.extensions[i];
						if (oExtension.name == aParts[0]) {
							oNode = oExtension;
							break;
						}
					}
				}
				sMetaDataPath = aParts.splice(0,1);
				oAnnotation = this._getAnnotationObject(oEntityType, oNode, aParts.join('/'));
			} else {
				//handle attributes
				if (aParts[0].indexOf('@') > -1) {
					sAnnotation = aParts[0].substr(1);
					aAnnotationParts = sAnnotation.split(':');
					oAnnotation = oNode[aAnnotationParts[0]];
					if (!oAnnotation && oNode.extensions) {
						for (var i = 0; i < oNode.extensions.length; i++) {
							var oExtension = oNode.extensions[i];
							if (oExtension.name === aAnnotationParts[1] && oExtension.namespace === this.mNamespaces[aAnnotationParts[0]]) {
								oAnnotation = oExtension.value;
								break;
							}
						}
					}
				} else { // handle nodes
					aAnnotationParts = aParts[0].split(':');
					oAnnotation = oNode[aAnnotationParts[0]];
					oAnnotation = oNode[aParts[0]];
					if (!oAnnotation && oNode.extensions) {
						for (var i = 0; i < oNode.extensions.length; i++) {
							var oExtension = oNode.extensions[i];
							if (oExtension.name === aAnnotationParts[1] && oExtension.namespace === this.mNamespaces[aAnnotationParts[0]]) {
								oAnnotation = oExtension;
								break;
							}
						}
					}
				}
			}
		}
		return oAnnotation;
	};

	/*
	 * @private
	 */
	ODataMetadata.prototype._getV4AnnotationObject = function(oEntityType, oObject, aParts) {
		var oAnnotationNode, aAnnotations = [];

		if (aParts.length > 1) {
			jQuery.sap.assert(aParts.length == 1, "'" + aParts.join('/') + "' is not a valid annotation path");
			return;
		}

		var sTargetName = oEntityType.namespace ? oEntityType.namespace + "." : "";
		sTargetName += oEntityType.name + "/" + oObject.name;

		jQuery.each(this.oMetadata.dataServices.schema, function(i, oSchema) {
			if (oSchema.annotations) {
				jQuery.each(oSchema.annotations, function(k, oObject) {
					//we do not support qualifiers on target level
					if (oObject.target === sTargetName && !oObject.qualifier) {
						aAnnotations.push(oObject.annotation);
						return false;
					}
				});
			}
		});
		if (aAnnotations) {
			jQuery.each(aAnnotations, function(i, aAnnotation) {
				jQuery.each(aAnnotation, function(j, oAnnotation) {
					if (oAnnotation.term === aParts[0]) {
						oAnnotationNode = oAnnotation;
					}
				});
			});
		}
		return oAnnotationNode;
	};

	/**
	 * splits a name e.g. Namespace.Name into [Name, Namespace]
	 */
	ODataMetadata.prototype._splitName = function(sFullName) {
		var aParts = [];
		if (sFullName) {
			var iSepIdx = sFullName.lastIndexOf(".");
			aParts[0] = sFullName.substr(iSepIdx + 1);
			aParts[1] = sFullName.substr(0, iSepIdx);
		}
		return aParts;
	};


	/**
	*  search metadata for specified collection name (= entity set name)
	*/
	ODataMetadata.prototype._getEntityTypeName = function(sCollection) {
		var sEntityTypeName;
		if (sCollection) {
			jQuery.each(this.oMetadata.dataServices.schema, function(i, oSchema) {
				if (oSchema.entityContainer) {
					jQuery.each(oSchema.entityContainer, function(k, oEntityContainer) {
						if (oEntityContainer.entitySet) {
							jQuery.each(oEntityContainer.entitySet, function(j, oEntitySet) {
								if (oEntitySet.name === sCollection) {
									sEntityTypeName = oEntitySet.entityType;
									return false;
								}
							});
						}
					});
				}
			});
		}
		//jQuery.sap.assert(sEntityTypeName, "EntityType name of EntitySet "+ sCollection + " not found!");
		return sEntityTypeName;
	};

	/**
	 * get the object of a specified type name and namespace
	 */
	ODataMetadata.prototype._getObjectMetadata = function(sObjectType, sObjectName, sNamespace) {
		var oObject;
		if (sObjectName && sNamespace) {
			// search in all schemas for the sObjectName
			jQuery.each(this.oMetadata.dataServices.schema, function(i, oSchema) {
				// check if we found the right schema which will contain the sObjectName
				if (oSchema[sObjectType] && oSchema.namespace === sNamespace) {
					jQuery.each(oSchema[sObjectType], function(j, oCurrentObject) {
						if (oCurrentObject.name === sObjectName) {
							oObject = oCurrentObject;
							oObject.namespace = oSchema.namespace;
							return false;
						}
					});
					return !oObject;
				}
			});
		}
		//jQuery.sap.assert(oObject, "ObjectType " + sObjectType + " for name " + sObjectName + " not found!");
		return oObject;
	};

	/**
	 * Get the the use-batch extension value if any
	 * @return {boolean} true/false
	 * @public
	 */
	ODataMetadata.prototype.getUseBatch = function() {
		var bUseBatch = false;
		// search in all schemas for the use batch extension
		jQuery.each(this.oMetadata.dataServices.schema, function(i, oSchema) {
			if (oSchema.entityContainer) {
				jQuery.each(oSchema.entityContainer, function(k, oEntityContainer) {
					if (oEntityContainer.extensions) {
						jQuery.each(oEntityContainer.extensions, function(l, oExtension) {
							if (oExtension.name === "use-batch" && oExtension.namespace === "http://www.sap.com/Protocols/SAPData") {
								bUseBatch = (typeof oExtension.value === 'string') ? (oExtension.value.toLowerCase() === 'true') : !!oExtension.value;
								return false;
							}
						});
					}
				});
			}
		});
		return bUseBatch;
	};

	/**
	 * Retrieve the function import metadata for a name and a method.
	 *
	 * @param {string} sFunctionName The name of the function import to look up
	 * @param {string} sMethod The HTTP Method for which this function is requested
	 */
	ODataMetadata.prototype._getFunctionImportMetadata = function(sFunctionName, sMethod) {
		var oObject = null;
		if (sFunctionName.indexOf("/") > -1) {
			sFunctionName = sFunctionName.substr(sFunctionName.indexOf("/") + 1);
		}
		// search in all schemas for the sObjectName
		jQuery.each(this.oMetadata.dataServices.schema, function(i, oSchema) {
			// check if we found the right schema which will contain the sObjectName
			if (oSchema["entityContainer"]) {
				jQuery.each(oSchema["entityContainer"], function(j,oEntityContainer) {
					if (oEntityContainer["functionImport"]) {
						jQuery.each(oEntityContainer["functionImport"], function(k,oFunctionImport) {
							if (oFunctionImport.name === sFunctionName && oFunctionImport.httpMethod === sMethod) {
								oObject = oFunctionImport;
								return false;
							}
						});
					}
					return !oObject;
				});
			}
			return !oObject;
		});
		return oObject;
	};

	
	/**
	 * Returns the target EntityType for NavgigationProperty-name of another given Entytype object. The target is 
	 * defined as the toRole of the navigationproperty; this method looks up the corresponding matching End in the 
	 * corresponding Association and returns the matching entityType
	 * @see sap.ui.model.odata.ODataMetadata#_getEntityTypeByNavPropertyObject
	 *
	 * @param {map} mEntityType - The EntityType that has the NavigationProperty
	 * @param {map} sNavPropertyName - The name of the NavigationProperty in the EntityType
	 * @returns {map|undefined} The EntityType that the NavigationProperty points to or undefined if not found
	 * @private
	 */
	ODataMetadata.prototype._getEntityTypeByNavProperty = function(mEntityType, sNavPropertyName) {
		if (!mEntityType.navigationProperty) {
			return undefined;
		}
		
		for (var i = 0; i < mEntityType.navigationProperty.length; ++i) {
			var oNavigationProperty = mEntityType.navigationProperty[i];
			if (oNavigationProperty.name === sNavPropertyName) {
				return this._getEntityTypeByNavPropertyObject(oNavigationProperty);
			}
		}
		
		return undefined;
	};
	
	
	/**
	 * Returns the target EntityType for a given NavgigationProperty object. The target is defined as the toRole of
	 * the navigationproperty; this method looks up the corresponding matching End in the corresponding Association
	 * and returns the matching entityType
	 *
	 * @param {map} mNavProperty - The NavigationProperty (from the navigationProperty array of an EntityType)
	 * @returns {map} The EntityType that the NavigationProperty points to
	 * @private
	 */
	ODataMetadata.prototype._getEntityTypeByNavPropertyObject = function(mNavProperty) {
		var mToEntityType;
		
		var aAssociationName = this._splitName(mNavProperty.relationship);		
		var mAssociation = this._getObjectMetadata("association", aAssociationName[0], aAssociationName[1]);
		
		// get association for navigation property and then the collection name
		if (mAssociation) {
			var mEnd = mAssociation.end[0];
			if (mEnd.role !== mNavProperty.toRole) {
				mEnd = mAssociation.end[1];
			}
			var aEntityTypeName = this._splitName(mEnd.type);
			mToEntityType = this._getObjectMetadata("entityType", aEntityTypeName[0], aEntityTypeName[1]);
			if (mToEntityType) {
				// store the type name also in the oEntityType
				mToEntityType.entityType = mEnd.type;
			}
		}
		return mToEntityType;
	};

	/**
	 * get all navigation property names in an array by the specified entity type
	 */
	ODataMetadata.prototype._getNavigationPropertyNames = function(oEntityType) {
		var aNavProps = [];
		if (oEntityType.navigationProperty) {
			jQuery.each(oEntityType.navigationProperty, function(k, oNavigationProperty) {
				aNavProps.push(oNavigationProperty.name);
			});
		}
		return aNavProps;
	};

	/**
	*  extract the property metadata of a specified property of a entity type out of the metadata document
	*/
	ODataMetadata.prototype._getPropertyMetadata = function(oEntityType, sProperty) {
		var oPropertyMetadata, that = this;

		if (!oEntityType) {
			return;
		}

		// remove starting/trailing /
		sProperty = sProperty.replace(/^\/|\/$/g, "");
		var aParts = sProperty.split("/"); // path could point to a complex type

		jQuery.each(oEntityType.property, function(k, oProperty) {
			if (oProperty.name === aParts[0]) {
				oPropertyMetadata = oProperty;
				return false;
			}
		});

		// check if complex type
		if (oPropertyMetadata && aParts.length > 1 && !jQuery.sap.startsWith(oPropertyMetadata.type.toLowerCase(), "edm.")) {
			var aName = this._splitName(oPropertyMetadata.type);
			oPropertyMetadata = this._getPropertyMetadata(this._getObjectMetadata("complexType", aName[0], aName[1]), aParts[1]);
		}

		// check if navigation property
		if (!oPropertyMetadata && aParts.length > 1) {
			var oParentEntityType = this._getEntityTypeByNavProperty(oEntityType, aParts[0]);
			if (oParentEntityType) {
				oPropertyMetadata = that._getPropertyMetadata(oParentEntityType, aParts[1]);
			}
		}

		//jQuery.sap.assert(oPropertyMetadata, "PropertyType for property "+ aParts[0]+ " of EntityType " + oEntityType.name + " not found!");
		return oPropertyMetadata;
	};

	ODataMetadata.prototype.destroy = function() {
		delete this.oMetadata;
		var that = this;

		// Abort pending xml request
		jQuery.each(this.mRequestHandles, function(sKey, oRequestHandle) {
			oRequestHandle.bSuppressErrorHandlerCall = true;
			oRequestHandle.abort();
			delete that.mRequestHandles[sKey];
		});
		if (!!this.oLoadEvent) {
			jQuery.sap.clearDelayedCall(this.oLoadEvent);
		}
		if (!!this.oFailedEvent) {
			jQuery.sap.clearDelayedCall(this.oFailedEvent);
		}

		EventProvider.prototype.destroy.apply(this, arguments);
	};

	/**
	 * creation of a request object for changes
	 *
	 * @return {object} request object
	 * @private
	 */
	ODataMetadata.prototype._createRequest = function(sUrl) {

		var oHeaders = {}, oLangHeader = {"Accept-Language" : sap.ui.getCore().getConfiguration().getLanguage()};

		jQuery.extend(oHeaders, this.mHeaders, oLangHeader);


		var oRequest = {
				headers : oHeaders,
				requestUri : sUrl,
				method : 'GET',
				user: this.sUser,
				password: this.sPassword,
				async: this.bAsync
		};

		if (this.bAsync) {
			oRequest.withCredentials = this.bWithCredentials;
		}

		return oRequest;
	};

	/**
	 * Returns the entity set to which the given entity path belongs
	 *
	 * @param {string} sEntityPath The path to the entity
	 * @return {map|undefined} The EntitySet to which the path belongs or undefined if none
	 */
	ODataMetadata.prototype._getEntitySetByPath = function(sEntityPath) {
		if (!this._entitySetMap) {
			// Cache results of entity set lookup
			this._entitySetMap = {};
			this.oMetadata.dataServices.schema.forEach(function(mShema) {
				if (mShema.entityContainer) {
					mShema.entityContainer.forEach(function(mContainer) {
						if (mContainer.entitySet) {
							mContainer.entitySet.forEach(function(mEntitySet) {
								this._entitySetMap[mEntitySet.entityType] = mEntitySet;
							}, this);
						}
					}, this);
				}
			}, this);
		}

		var oEntityType = this._getEntityTypeByPath(sEntityPath);

		if (oEntityType) {
			return this._entitySetMap[oEntityType.entityType];
		}

		return;
	};

	/**
	 * Add metadata url: The response will be merged with the existing metadata object
	 *
	 * @param string | array vUrl Either one URL as string or an array or Uri strings
	 * @returns Promise The Promise for metadata loading
	 * @private
	 */
	ODataMetadata.prototype._addUrl = function(vUrl) {
		var aUrls = [].concat(vUrl),
			that = this;

		return Promise.all(jQuery.map(aUrls, function(sUrl) {
			return that._loadMetadata(sUrl, true);
		}));
	};

	/**
	 * merges two metadata objects
	 * @param {object} oTarget Target metadata object
	 * @param {object} oSource Source metadata object
	 * @param {array} aEntitySets An array where the entitySets (metadata objects) from the source objects will 
	 * 								be collected and returned.
	 * @return {object} oTarget The merged metadata object
	 * @private
	 */
	ODataMetadata.prototype.merge = function(oTarget, oSource, aEntitySets) {
		var that = this;
		jQuery.each(oTarget.dataServices.schema, function(i, oTargetSchema) {
			// find schema
			jQuery.each(oSource.dataServices.schema, function(j, oSourceSchema) {
				if (oSourceSchema.namespace === oTargetSchema.namespace) {
					//merge entityTypes
					if (oSourceSchema.entityType) {
						//cache entityType names
						if (!that.mEntityTypeNames) {
							that.mEntityTypeNames = {};
							oTargetSchema.entityType.map(function(o) {
								that.mEntityTypeNames[o.name] = true;
							});
						}
						oTargetSchema.entityType = !oTargetSchema.entityType ? [] : oTargetSchema.entityType;
						for (var i = 0; i < oSourceSchema.entityType.length; i++) {
							if (!(oSourceSchema.entityType[i].name in that.mEntityTypeNames)) {
								oTargetSchema.entityType.push(oSourceSchema.entityType[i]);
								that.mEntityTypeNames[oSourceSchema.entityType[i].name] = true;
							}
						}
					}
					//find EntityContainer if any
					if (oTargetSchema.entityContainer && oSourceSchema.entityContainer) {
						jQuery.each(oTargetSchema.entityContainer, function(k, oTargetContainer) {
							//merge entitySets
							jQuery.each(oSourceSchema.entityContainer, function(l, oSourceContainer) {
								if (oSourceContainer.entitySet) {
									if (oSourceContainer.name === oTargetContainer.name) {
										//cache entitySet names
										if (!that.mEntitySetNames) {
											that.mEntitySetNames = {};
											oTargetContainer.entitySet.map(function(o) {
												that.mEntitySetNames[o.name] = true;
											});
										}
										oTargetContainer.entitySet = !oTargetContainer.entitySet ? [] : oTargetContainer.entitySet;
										for (var i = 0; i < oSourceContainer.entitySet.length; i++) {
											if (!(oSourceContainer.entitySet[i].name in that.mEntitySetNames)) {
												oTargetContainer.entitySet.push(oSourceContainer.entitySet[i]);
												that.mEntitySetNames[oSourceContainer.entitySet[i].name] = true;
											}
										}
										oSourceContainer.entitySet.forEach(function(oElement) {
											aEntitySets.push(oElement);
										});
									}
								}
							});
						});
					}
					//merge Annotations
					if (oSourceSchema.annotations) {
						oTargetSchema.annotations = !oTargetSchema.annotations ? [] : oTargetSchema.annotations;
						oTargetSchema.annotations = oTargetSchema.annotations.concat(oSourceSchema.annotations);
					}
				}
			});
		});
		return oTarget;
	};

	/**
	 * Returns the first EntitySet from all EntityContainers that matches the namespace and name of the given EntityType
	 *
	 * @param {map} mEntityType - The EntityType object
	 * @return {map|null} Retuns the EntitySet object or null if not found
	 */
	ODataMetadata.prototype._getEntitySetByType = function(mEntityType) {
		var sEntityType = mEntityType.namespace + "." + mEntityType.name;
		
		var aSchema = this.oMetadata.dataServices.schema;
		for (var i = 0; i < aSchema.length; ++i) {
			var aContainers = aSchema[i].entityContainer;
			if (aContainers) {
				for (var n = 0; n < aContainers.length; ++n) {
					var aSets = aContainers[n].entitySet;
					if (aSets) {
						for (var m = 0; m < aSets.length; ++m) {
							if (aSets[m].entityType === sEntityType) {
								return aSets[m];
							}
						}
					}
				}
			}
		}
		return null;
	};
	
	return ODataMetadata;

});
