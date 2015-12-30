/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
   'jquery.sap.global',
   'sap/ui/model/BindingMode', 'sap/ui/base/BindingParser', 'sap/ui/model/Context',
   'sap/ui/base/ManagedObject', 'sap/ui/model/ClientContextBinding',
   'sap/ui/model/FilterProcessor', 'sap/ui/model/json/JSONModel',
   'sap/ui/model/json/JSONListBinding', 'sap/ui/model/json/JSONPropertyBinding',
   'sap/ui/model/json/JSONTreeBinding', 'sap/ui/model/MetaModel', './_ODataMetaModelUtils'
], function (jQuery, BindingMode, BindingParser, Context, ManagedObject, ClientContextBinding,
		FilterProcessor, JSONModel, JSONListBinding, JSONPropertyBinding, JSONTreeBinding,
		MetaModel, Utils) {
	"use strict";

	// path to a type's property e.g. ("/dataServices/schema/<i>/entityType/<j>/property/<k>")
	var rPropertyPath = /^((\/dataServices\/schema\/\d+)\/(?:complexType|entityType)\/\d+)\/property\/\d+$/;

	/**
	 * @class List binding implementation for the OData meta model which supports filtering on
	 * the virtual property "@sapui.name" (which refers back to the name of the object in
	 * question).
	 *
	 * Example:
	 * <pre>
	 * &lt;template:repeat list="{path:'entityType>', filters: {path: '@sapui.name', operator: 'StartsWith', value1: 'com.sap.vocabularies.UI.v1.FieldGroup'}}" var="fieldGroup">
	 * </pre>
	 *
	 * @extends sap.ui.model.json.JSONListBinding
	 * @private
	 */
	var ODataMetaListBinding = JSONListBinding.extend("sap.ui.model.odata.ODataMetaListBinding"),
		Resolver = ManagedObject.extend("sap.ui.model.odata._resolver", {
			metadata: {
				properties: {
					any: "any"
				}
			}
		});

	ODataMetaListBinding.prototype.applyFilter = function () {
		var that = this;

		this.aIndices = FilterProcessor.apply(this.aIndices,
			this.aFilters.concat(this.aApplicationFilters), function (vRef, sPath) {
			return sPath === "@sapui.name"
				? vRef
				: that.oModel.getProperty(sPath, that.oList[vRef]);
		});
		this.iLength = this.aIndices.length;
	};

	/**
	 * DO NOT CALL this private constructor for a new <code>ODataMetaModel</code>,
	 * but rather use {@link sap.ui.model.odata.ODataModel#getMetaModel getMetaModel} instead!
	 *
	 * @param {sap.ui.model.odata.ODataMetadata} oMetadata
	 *   the OData model's meta data object
	 * @param {sap.ui.model.odata.ODataAnnotations} [oAnnotations]
	 *   the OData model's annotations object
	 * @param {object} [oODataModelInterface]
	 *   the private interface object of the OData model which provides friend access to
	 *   selected methods
	 * @param {function} [oODataModelInterface.addAnnotationUrl]
	 *   the {@link sap.ui.model.odata.v2.ODataModel#addAnnotationUrl addAnnotationUrl} method
	 *   of the OData model, in case this feature is supported
	 * @param {Promise} [oODataModelInterface.annotationsLoadedPromise]
	 *   a promise which is resolved by the OData model once meta data and annotations have been
	 *   fully loaded
	 *
	 * @class Implementation of an OData meta model which offers a unified access to both OData v2
	 * meta data and v4 annotations. It uses the existing {@link sap.ui.model.odata.ODataMetadata}
	 * as a foundation and merges v4 annotations from the existing
	 * {@link sap.ui.model.odata.ODataAnnotations} directly into the corresponding model element.
	 *
	 * Also, annotations from the "http://www.sap.com/Protocols/SAPData" namespace are lifted up
	 * from the <code>extensions</code> array and transformed from objects into simple properties
	 * with an "sap:" prefix for their name. Note that this happens in addition, thus the
	 * following example shows both representations. This way, such annotations can be addressed
	 * via a simple relative path instead of searching an array.
	 * <pre>
		{
			"name" : "BusinessPartnerID",
			"extensions" : [{
				"name" : "label",
				"value" : "Bus. Part. ID",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}],
			"sap:label" : "Bus. Part. ID"
		}
	 * </pre>
	 *
	 * As of 1.29.0, the corresponding vocabulary-based annotations for the following
	 * "<a href="http://www.sap.com/Protocols/SAPData">SAP Annotations for OData Version 2.0</a>"
	 * are added, if they are not yet defined in the v4 annotations:
	 * <ul>
	 * <li><code>label</code>;</li>
	 * <li><code>creatable</code>, <code>deletable</code>, <code>deletable-path</code>,
	 * <code>pageable</code>, <code>requires-filter</code>, <code>searchable</code>,
	 * <code>topable</code>, <code>updatable</code> and <code>updatable-path</code> on entity sets;
	 * </li>
	 * <li><code>creatable</code>, <code>display-format</code> ("UpperCase" and "NonNegative"),
	 * <code>field-control</code>, <code>filterable</code>, <code>filter-restriction</code>,
	 * <code>heading</code>, <code>precision</code>, <code>quickinfo</code>,
	 * <code>required-in-filter</code>, <code>sortable</code>, <code>text</code>, <code>unit</code>,
	 * <code>updatable</code> and <code>visible</code> on properties;</li>
	 * <li><code>semantics</code>; the following values are supported:
	 * <ul>
	 * <li>"bday", "city", "country", "email" (including support for types, for example
	 * "email;type=home,pref"), "familyname", "givenname", "honorific", "middlename", "name",
	 * "nickname", "note", "org", "org-unit", "org-role", "photo", "pobox", "region", "street",
	 * "suffix", "tel" (including support for types, for example "tel;type=cell,pref"), "title" and
	 * "zip" (mapped to v4 annotation <code>com.sap.vocabularies.Communication.v1.Contact</code>);
	 * </li>
	 * <li>"class", "dtend", "dtstart", "duration", "fbtype", "location", "status", "transp" and
	 * "wholeday" (mapped to v4 annotation
	 * <code>com.sap.vocabularies.Communication.v1.Event</code>);</li>
	 * <li>"body", "from", "received", "sender" and "subject" (mapped to v4 annotation
	 * <code>com.sap.vocabularies.Communication.v1.Message</code>);</li>
	 * <li>"completed", "due", "percent-complete" and "priority" (mapped to v4 annotation
	 * <code>com.sap.vocabularies.Communication.v1.Task</code>).</li>
	 * </ul>
	 * </ul>
	 * For example:
	 * <pre>
		{
			"name" : "BusinessPartnerID",
			...
			"sap:label" : "Bus. Part. ID",
			"com.sap.vocabularies.Common.v1.Label" : {
				"String" : "Bus. Part. ID"
			}
		}
	 * </pre>
	 *
	 * This model is read-only and thus only supports
	 * {@link sap.ui.model.BindingMode.OneTime OneTime} binding mode. No events
	 * ({@link sap.ui.model.Model#event:parseError parseError},
	 * {@link sap.ui.model.Model#event:requestCompleted requestCompleted},
	 * {@link sap.ui.model.Model#event:requestFailed requestFailed},
	 * {@link sap.ui.model.Model#event:requestSent requestSent}) are fired!
	 *
	 * Within the meta model, the objects are arranged in arrays.
	 * <code>/dataServices/schema</code>, for example, is an array of schemas where each schema has
	 * an <code>entityType</code> property with an array of entity types, and so on. So,
	 * <code>/dataServices/schema/0/entityType/16</code> can be the path to the entity type with
	 * name "Order" in the schema with namespace "MySchema". However, these paths are not stable:
	 * If an entity type with lower index is removed from the schema, the path to
	 * <code>Order</code> changes to <code>/dataServices/schema/0/entityType/15</code>.
	 *
	 * To avoid problems with changing indexes, {@link sap.ui.model.Model#getObject getObject} and
	 * {@link sap.ui.model.Model#getProperty getProperty} support XPath-like queries for the
	 * indexes (since 1.29.1). Each index can be replaced by a query in square brackets. You can,
	 * for example, address the schema using the path
	 * <code>/dataServices/schema/[${namespace}==='MySchema']</code> or the entity using
	 * <code>/dataServices/schema/[${namespace}==='MySchema']/entityType/[sap.ui.core==='Order']</code>.
	 *
	 * The syntax inside the square brackets is the same as in expression binding. The query is
	 * executed for each object in the array until the result is true (truthy) for the first time.
	 * This object is then chosen.
	 *
	 * <b>BEWARE:</b> Access to this OData meta model will fail before the promise returned by
	 * {@link #loaded loaded} has been resolved!
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.model.odata.ODataMetaModel
	 * @extends sap.ui.model.MetaModel
	 * @public
	 * @since 1.27.0
	 */
	var ODataMetaModel = MetaModel.extend("sap.ui.model.odata.ODataMetaModel", {
			constructor : function (oMetadata, oAnnotations, oODataModelInterface) {
				var that = this;

				function load() {
					var oData = JSON.parse(JSON.stringify(oMetadata.getServiceMetadata()));
					Utils.merge(oAnnotations ? oAnnotations.getAnnotationsData() : {}, oData);
					that.oModel = new JSONModel(oData);
					that.oModel.setDefaultBindingMode(that.sDefaultBindingMode);
				}

				oODataModelInterface = oODataModelInterface || {};

				MetaModel.apply(this); // no arguments to pass!
				this.oModel = null; // not yet available!

				// map path of property to promise for loading its value list
				this.mContext2Promise = {};
				this.sDefaultBindingMode = BindingMode.OneTime;
				this.oLoadedPromise
					= oODataModelInterface.annotationsLoadedPromise
					? oODataModelInterface.annotationsLoadedPromise.then(load)
					: new Promise(function (fnResolve, fnReject) {
							load();
							fnResolve();
						}); // call load() synchronously!
				this.oMetadata = oMetadata;
				this.oODataModelInterface = oODataModelInterface;
				this.mQueryCache = {};
				// map qualified property name to internal "promise interface" for request bundling
				this.mQName2PendingRequest = {};
				this.oResolver = undefined;
				this.mSupportedBindingModes = {"OneTime" : true};
			}
		});

	/**
	 * Returns the value of the object or property inside this model's data which can be reached,
	 * starting at the given context, by following the given path.
	 *
	 * @param {string} sPath
	 *   a relative or absolute path
	 * @param {object|sap.ui.model.Context} [oContext]
	 *   the context to be used as a starting point in case of a relative path
	 * @returns {any}
	 *   the value of the object or property or <code>null</code> in case a relative path without
	 *   a context is given
	 * @private
	 */
	ODataMetaModel.prototype._getObject = function (sPath, oContext) {
		var oBaseNode = oContext,
			oBinding,
			sCacheKey,
			i,
			iEnd,
			oNode,
			vPart,
			sProcessedPath,
			sResolvedPath = sPath || "",
			oResult;

		if (!oContext || oContext instanceof Context) {
			sResolvedPath = this.resolve(sPath || "", oContext);
			if (!sResolvedPath) {
				jQuery.sap.log.error("Invalid relative path w/o context", sPath,
					"sap.ui.model.odata.ODataMetaModel");
				return null;
			}
		}

		if (sResolvedPath.charAt(0) === "/") {
			oBaseNode = this.oModel._getObject("/");
			sResolvedPath = sResolvedPath.slice(1);
		}

		sProcessedPath = "/";
		oNode = oBaseNode;
		while (sResolvedPath) {
			vPart = undefined;
			oBinding = undefined;
			if (sResolvedPath.charAt(0) === '[') {
				try {
					oResult = BindingParser.parseExpression(sResolvedPath, 1);
					iEnd = oResult.at;
					if (iEnd >= 0 && (sResolvedPath.length === iEnd + 1
							|| sResolvedPath.charAt(iEnd + 1) === '/')) {
						oBinding = oResult.result;
						vPart = sResolvedPath.slice(0, iEnd + 1);
						sResolvedPath = sResolvedPath.slice(iEnd + 2);
					}
				} catch (ex) {
					if (!(ex instanceof SyntaxError)) {
						throw ex;
					}
					// do nothing, syntax error is logged already
				}
			}
			if (vPart === undefined) {
				// No query or unsuccessful query, simply take the next part until '/'
				iEnd = sResolvedPath.indexOf("/");
				if (iEnd < 0) {
					vPart = sResolvedPath;
					sResolvedPath = "";
				} else {
					vPart = sResolvedPath.slice(0, iEnd);
					sResolvedPath = sResolvedPath.slice(iEnd + 1);
				}
			}
			if (!oNode) {
				if (jQuery.sap.log.isLoggable(jQuery.sap.log.Level.WARNING)) {
					jQuery.sap.log.warning("Invalid part: " + vPart,
						"path: " + sPath + ", context: "
							+ (oContext instanceof Context ? oContext.getPath() : oContext),
						"sap.ui.model.odata.ODataMetaModel");
				}
				break;
			}
			if (oBinding) {
				if (oBaseNode === oContext) {
					jQuery.sap.log.error(
						"A query is not allowed when an object context has been given", sPath,
						"sap.ui.model.odata.ODataMetaModel");
					return null;
				}
				if (!Array.isArray(oNode)) {
					jQuery.sap.log.error(
						"Invalid query: '" + sProcessedPath + "' does not point to an array",
						sPath, "sap.ui.model.odata.ODataMetaModel");
					return null;
				}
				sCacheKey = sProcessedPath + vPart;
				vPart = this.mQueryCache[sCacheKey];
				if (vPart === undefined) {
					// Set the resolver on the internal JSON model, so that resolving does not use
					// this._getObject itself.
					this.oResolver = this.oResolver || new Resolver({models: this.oModel});
					for (i = 0; i < oNode.length; i++) {
						this.oResolver.bindObject(sProcessedPath + i);
						this.oResolver.bindProperty("any", oBinding);
						try {
							if (this.oResolver.getAny()) {
								this.mQueryCache[sCacheKey] = vPart = i;
								break;
							}
						} finally {
							this.oResolver.unbindProperty("any");
							this.oResolver.unbindObject();
						}
					}
				}
			}
			oNode = oNode[vPart];
			sProcessedPath = sProcessedPath + vPart + "/";
		}
		return oNode;
	};

	/**
	 * Merges metadata retrieved via <code>this.oODataModelInterface.addAnnotationUrl</code>.
	 *
	 * @param {object} oResponse response from addAnnotationUrl.
	 *
	 * @private
	 */
	ODataMetaModel.prototype._mergeMetadata = function (oResponse) {
		var oEntityContainer = this.getODataEntityContainer(),
			mChildAnnotations = Utils.getChildAnnotations(oResponse.annotations,
				oEntityContainer.namespace + "." + oEntityContainer.name, true),
			iFirstNewEntitySet = oEntityContainer.entitySet.length,
			aSchemas = this.oModel.getObject("/dataServices/schema"),
			that = this;

		// merge meta data for entity sets/types
		oResponse.entitySets.forEach(function (oEntitySet) {
			var oEntityType,
				oSchema,
				sTypeName = oEntitySet.entityType,
				// Note: namespaces may contain dots themselves!
				sNamespace = sTypeName.slice(0, sTypeName.lastIndexOf("."));

			if (!that.getODataEntitySet(oEntitySet.name)) {
				oEntityContainer.entitySet.push(JSON.parse(JSON.stringify(oEntitySet)));

				if (!that.getODataEntityType(sTypeName)) {
					oEntityType = that.oMetadata._getEntityTypeByName(sTypeName);
					oSchema = Utils.getSchema(aSchemas, sNamespace);
					oSchema.entityType.push(JSON.parse(JSON.stringify(oEntityType)));

					// visit all entity types before visiting the entity sets to ensure that v2
					// annotations are already lifted up and can be used for calculating entity
					// set annotations which are based on v2 annotations on entity properties
					Utils.visitParents(oSchema, oResponse.annotations,
						"entityType", Utils.visitEntityType,
						oSchema.entityType.length - 1);
				}
			}
		});

		Utils.visitChildren(oEntityContainer.entitySet, mChildAnnotations, "EntitySet", aSchemas,
			/*fnCallback*/null, iFirstNewEntitySet);
	};


	/**
	 * Send all currently pending value list requests as a single bundle.
	 *
	 * @private
	 */
	ODataMetaModel.prototype._sendBundledRequest = function () {
		var mQName2PendingRequest = this.mQName2PendingRequest, // remember current state
			aQualifiedPropertyNames = Object.keys(mQName2PendingRequest),
			that = this;

		if (!aQualifiedPropertyNames.length) {
			return; // nothing to do
		}

		this.mQName2PendingRequest = {}; // clear pending requests for next bundle

		// normalize URL to be browser cache friendly with value list request
		aQualifiedPropertyNames = aQualifiedPropertyNames.sort();
		aQualifiedPropertyNames.forEach(function (sQualifiedPropertyName, i) {
			aQualifiedPropertyNames[i] = encodeURIComponent(sQualifiedPropertyName);
		});

		this.oODataModelInterface
			.addAnnotationUrl("$metadata?sap-value-list=" + aQualifiedPropertyNames.join(","))
			.then(
				function (oResponse) {
					var sQualifiedPropertyName;
					that._mergeMetadata(oResponse);
					for (sQualifiedPropertyName in mQName2PendingRequest) {
						try {
							mQName2PendingRequest[sQualifiedPropertyName].resolve(oResponse);
						} catch (oError) {
							mQName2PendingRequest[sQualifiedPropertyName].reject(oError);
						}
					}
				},
				function (oError) {
					var sQualifiedPropertyName;
					for (sQualifiedPropertyName in mQName2PendingRequest) {
						mQName2PendingRequest[sQualifiedPropertyName].reject(oError);
					}
				}
			);
	};

	ODataMetaModel.prototype.bindContext = function (sPath, oContext, mParameters) {
		return new ClientContextBinding(this, sPath, oContext, mParameters);
	};

	ODataMetaModel.prototype.bindList = function (sPath, oContext, aSorters, aFilters,
		mParameters) {
		return new ODataMetaListBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
	};

	ODataMetaModel.prototype.bindProperty = function (sPath, oContext, mParameters) {
		return new JSONPropertyBinding(this, sPath, oContext, mParameters);
	};

	ODataMetaModel.prototype.bindTree = function (sPath, oContext, aFilters, mParameters) {
		return new JSONTreeBinding(this, sPath, oContext, aFilters, mParameters);
	};

	ODataMetaModel.prototype.destroy = function () {
		MetaModel.prototype.destroy.apply(this, arguments);
		return this.oModel.destroy.apply(this.oModel, arguments);
	};

	/**
	 * Returns the OData meta model context corresponding to the given OData model path.
	 *
	 * @param {string} [sPath]
	 *   an absolute path pointing to an entity or property, e.g.
	 *   "/ProductSet(1)/ToSupplier/BusinessPartnerID"; this equals the
	 *   <a href="http://www.odata.org/documentation/odata-version-2-0/uri-conventions#ResourcePath">
	 *   resource path</a> component of a URI according to OData v2 URI conventions
	 * @returns {sap.ui.model.Context}
	 *   the context for the corresponding meta data object, i.e. an entity type or its property,
	 *   or <code>null</code> in case no path is given
	 * @throws {Error} in case no context can be determined
	 * @public
	 */
	ODataMetaModel.prototype.getMetaContext = function (sPath) {
		var oAssocationEnd,
			oEntitySet,
			oEntityType,
			sMetaPath,
			sNavigationPropertyName,
			aParts,
			sQualifiedName; // qualified name of current entity type across navigations

		/*
		 * Strips the OData key predicate from a resource path segment.
		 *
		 * @param {string} sSegment
		 * @returns {string}
		 */
		function stripKeyPredicate(sSegment) {
			var iPos = sSegment.indexOf("(");
			return iPos >= 0
				? sSegment.slice(0, iPos)
				: sSegment;
		}

		if (!sPath) {
			return null;
		}

		aParts = sPath.split("/");
		if (aParts[0] !== "") {
			throw new Error("Not an absolute path: " + sPath);
		}
		aParts.shift();

		// from entity set to entity type
		oEntitySet = this.getODataEntitySet(stripKeyPredicate(aParts[0]));
		if (!oEntitySet) {
			throw new Error("Entity set not found: " + aParts[0]);
		}
		aParts.shift();
		sQualifiedName = oEntitySet.entityType;

		// follow (navigation) properties
		while (aParts.length) {
			oEntityType = this.getODataEntityType(sQualifiedName);
			sNavigationPropertyName = stripKeyPredicate(aParts[0]);
			oAssocationEnd = this.getODataAssociationEnd(oEntityType, sNavigationPropertyName);

			if (oAssocationEnd) {
				// navigation property
				sQualifiedName = oAssocationEnd.type;
				if (oAssocationEnd.multiplicity === "1" && sNavigationPropertyName !== aParts[0]) {
					// key predicate not allowed here
					throw new Error("Multiplicity is 1: " + aParts[0]);
				}
				aParts.shift();
			} else {
				// structural property, incl. complex types
				sMetaPath = this.getODataProperty(oEntityType, aParts, true);
				if (aParts.length) {
					throw new Error("Property not found: " + aParts.join("/"));
				}
				break;
			}
		}

		sMetaPath = sMetaPath || this.getODataEntityType(sQualifiedName, true);
		return this.createBindingContext(sMetaPath);
	};

	/**
	 * Returns the OData association end corresponding to the given entity type's navigation
	 * property of given name.
	 *
	 * @param {object} oEntityType
	 *   an entity type as returned by {@link #getODataEntityType getODataEntityType}
	 * @param {string} sName
	 *   the name of a navigation property within this entity type
	 * @returns {object}
	 *   the OData association end or <code>null</code> if no such association end is found
	 * @public
	 */
	ODataMetaModel.prototype.getODataAssociationEnd = function (oEntityType, sName) {
		var oNavigationProperty = oEntityType
				? Utils.findObject(oEntityType.navigationProperty, sName)
				: null,
			oAssociation = oNavigationProperty
				? Utils.getObject(this.oModel, "association", oNavigationProperty.relationship)
				: null,
			oAssociationEnd = oAssociation
				? Utils.findObject(oAssociation.end, oNavigationProperty.toRole, "role")
				: null;

		return oAssociationEnd;
	};

	/**
	 * Returns the OData association <em>set</em> end corresponding to the given entity type's
	 * navigation property of given name.
	 *
	 * @param {object} oEntityType
	 *   an entity type as returned by {@link #getODataEntityType getODataEntityType}
	 * @param {string} sName
	 *   the name of a navigation property within this entity type
	 * @returns {object}
	 *   the OData association set end or <code>null</code> if no such association set end is found
	 * @public
	 */
	ODataMetaModel.prototype.getODataAssociationSetEnd = function (oEntityType, sName) {
		var oAssociationSet,
			oAssociationSetEnd = null,
			oEntityContainer = this.getODataEntityContainer(),
			oNavigationProperty = oEntityType
				? Utils.findObject(oEntityType.navigationProperty, sName)
				: null;

		if (oEntityContainer && oNavigationProperty) {
			oAssociationSet = Utils.findObject(oEntityContainer.associationSet,
				oNavigationProperty.relationship, "association");
			oAssociationSetEnd = oAssociationSet
				? Utils.findObject(oAssociationSet.end, oNavigationProperty.toRole, "role")
				: null;
		}

		return oAssociationSetEnd;
	};

	/**
	 * Returns the OData complex type with the given qualified name, either as a path or as an
	 * object, as indicated.
	 *
	 * @param {string} sQualifiedName
	 *   a qualified name, e.g. "ACME.Address"
	 * @param {boolean} [bAsPath=false]
	 *   determines whether the complex type is returned as a path or as an object
	 * @returns {object|string}
	 *   (the path to) the complex type with the given qualified name; <code>undefined</code> (for
	 *   a path) or <code>null</code> (for an object) if no such type is found
	 * @public
	 */
	ODataMetaModel.prototype.getODataComplexType = function (sQualifiedName, bAsPath) {
		return Utils.getObject(this.oModel, "complexType", sQualifiedName, bAsPath);
	};

	/**
	 * Returns the OData default entity container.
	 *
	 * @param {boolean} [bAsPath=false]
	 *   determines whether the entity container is returned as a path or as an object
	 * @returns {object|string}
	 *   (the path to) the default entity container; <code>undefined</code> (for a path) or
	 *   <code>null</code> (for an object) if no such container is found
	 * @public
	 */
	ODataMetaModel.prototype.getODataEntityContainer = function (bAsPath) {
		var vResult = bAsPath ? undefined : null;

		(this.oModel.getObject("/dataServices/schema") || []).forEach(function (oSchema, i) {
			var j = Utils.findIndex(oSchema.entityContainer, "true", "isDefaultEntityContainer");

			if (j >= 0) {
				vResult = bAsPath
					? "/dataServices/schema/" + i + "/entityContainer/" + j
					: oSchema.entityContainer[j];
				return false; //break
			}
		});

		return vResult;
	};

	/**
	 * Returns the OData entity set with the given simple name from the default entity container.
	 *
	 * @param {string} sName
	 *   a simple name, e.g. "ProductSet"
	 * @param {boolean} [bAsPath=false]
	 *   determines whether the entity set is returned as a path or as an object
	 * @returns {object|string}
	 *   (the path to) the entity set with the given simple name; <code>undefined</code> (for a
	 *   path) or <code>null</code> (for an object) if no such set is found
	 * @public
	 */
	ODataMetaModel.prototype.getODataEntitySet = function (sName, bAsPath) {
		return Utils.getFromContainer(this.getODataEntityContainer(), "entitySet", sName, bAsPath);
	};

	/**
	 * Returns the OData entity type with the given qualified name, either as a path or as an
	 * object, as indicated.
	 *
	 * @param {string} sQualifiedName
	 *   a qualified name, e.g. "ACME.Product"
	 * @param {boolean} [bAsPath=false]
	 *   determines whether the entity type is returned as a path or as an object
	 * @returns {object|string}
	 *   (the path to) the entity type with the given qualified name; <code>undefined</code> (for a
	 *   path) or <code>null</code> (for an object) if no such type is found
	 * @public
	 */
	ODataMetaModel.prototype.getODataEntityType = function (sQualifiedName, bAsPath) {
		return Utils.getObject(this.oModel, "entityType", sQualifiedName, bAsPath);
	};

	/**
	 * Returns the OData function import with the given simple or qualified name from the default
	 * entity container or the respective entity container specified in the qualified name.
	 *
	 * @param {string} sName
	 *   a simple or qualified name, e.g. "Save" or "MyService.Entities/Save"
	 * @param {boolean} [bAsPath=false]
	 *   determines whether the function import is returned as a path or as an object
	 * @returns {object|string}
	 *   (the path to) the function import with the given simple name; <code>undefined</code> (for
	 *   a path) or <code>null</code> (for an object) if no such function import is found
	 * @public
	 * @since 1.29.0
	 */
	ODataMetaModel.prototype.getODataFunctionImport = function (sName, bAsPath) {
		var aParts =  sName && sName.indexOf('/') >= 0  ? sName.split('/') : undefined,
			oEntityContainer = aParts ?
				Utils.getObject(this.oModel, "entityContainer", aParts[0]) :
				this.getODataEntityContainer();

		return Utils.getFromContainer(oEntityContainer, "functionImport",
			aParts ? aParts[1] : sName, bAsPath);
	};

	/**
	 * Returns the given OData type's property (not navigation property!) of given name.
	 *
	 * If an array is given instead of a single name, it is consumed (via
	 * <code>Array.prototype.shift</code>) piece by piece. Each element is interpreted as a
	 * property name of the current type, and the current type is replaced by that property's type.
	 * This is repeated until an element is encountered which cannot be resolved as a property name
	 * of the current type anymore; in this case, the last property found is returned and
	 * <code>vName</code> contains only the remaining names, with <code>vName[0]</code> being the
	 * one which was not found.
	 *
	 * Examples:
	 * <ul>
	 * <li> Get address property of business partner:
	 * <pre>
	 * var oEntityType = oMetaModel.getODataEntityType("GWSAMPLE_BASIC.BusinessPartner"),
	 *     oAddressProperty = oMetaModel.getODataProperty(oEntityType, "Address");
	 * oAddressProperty.name === "Address";
	 * oAddressProperty.type === "GWSAMPLE_BASIC.CT_Address";
	 * </pre>
	 * </li>
	 * <li> Get street property of address type:
	 * <pre>
	 * var oComplexType = oMetaModel.getODataComplexType("GWSAMPLE_BASIC.CT_Address"),
	 *     oStreetProperty = oMetaModel.getODataProperty(oComplexType, "Street");
	 * oStreetProperty.name === "Street";
	 * oStreetProperty.type === "Edm.String";
	 * </pre>
	 * </li>
	 * <li> Get address' street property directly from business partner:
	 * <pre>
	 * var aParts = ["Address", "Street"];
	 * oMetaModel.getODataProperty(oEntityType, aParts) === oStreetProperty;
	 * aParts.length === 0;
	 * </pre>
	 * </li>
	 * <li> Trying to get address' foo property directly from business partner:
	 * <pre>
	 * aParts = ["Address", "foo"];
	 * oMetaModel.getODataProperty(oEntityType, aParts) === oAddressProperty;
	 * aParts.length === 1;
	 * aParts[0] === "foo";
	 * </pre>
	 * </li>
	 * </ul>
	 *
	 * @param {object} oType
	 *   a complex type as returned by {@link #getODataComplexType getODataComplexType}, or
	 *   an entity type as returned by {@link #getODataEntityType getODataEntityType}
	 * @param {string|string[]} vName
	 *   the name of a property within this type (e.g. "Address"), or an array of such names (e.g.
	 *   <code>["Address", "Street"]</code>) in order to drill-down into complex types;
	 *   <b>BEWARE</b> that this array is modified by removing each part which is understood!
	 * @param {boolean} [bAsPath=false]
	 *   determines whether the property is returned as a path or as an object
	 * @returns {object|string}
	 *   (the path to) the last OData property found; <code>undefined</code> (for a path) or
	 *   <code>null</code> (for an object) if no property was found at all
	 * @public
	 */
	ODataMetaModel.prototype.getODataProperty = function (oType, vName, bAsPath) {
		var i,
			aParts = Array.isArray(vName) ? vName : [vName],
			oProperty = null,
			sPropertyPath;

		while (oType && aParts.length) {
			i = Utils.findIndex(oType.property, aParts[0]);
			if (i < 0) {
				break;
			}

			aParts.shift();
			oProperty = oType.property[i];
			sPropertyPath = oType.$path + "/property/" + i;

			if (aParts.length) {
				// go to complex type in order to allow drill-down
				oType = this.getODataComplexType(oProperty.type);
			}
		}

		return bAsPath ? sPropertyPath : oProperty;
	};

	/**
	 * Returns a <code>Promise</code> which is resolved with a map representing the
	 * <code>com.sap.vocabularies.Common.v1.ValueList</code> annotations of the given property or
	 * rejected with an error.
	 * The key in the map provided on successful resolution is the qualifier of the annotation or
	 * the empty string if no qualifier is defined. The value in the map is the JSON object for
	 * the annotation. The map is empty if the property has no
	 * <code>com.sap.vocabularies.Common.v1.ValueList</code> annotations.
	 *
	 * @param {sap.ui.model.Context} oPropertyContext
	 *   a model context for a structural property of an entity type or a complex type, as
	 *   returned by {@link #getMetaContext getMetaContext}
	 * @returns {Promise}
	 *   a Promise that gets resolved as soon as the value lists as well as the required model
	 *   elements have been loaded
	 * @since 1.29.1
	 * @public
	 */
	ODataMetaModel.prototype.getODataValueLists = function (oPropertyContext) {
		var bCachePromise = false, // cache only promises which trigger a request
			aMatches,
			sPropertyPath = oPropertyContext.getPath(),
			oPromise = this.mContext2Promise[sPropertyPath],
			that = this;

		if (oPromise) {
			return oPromise;
		}

		aMatches = rPropertyPath.exec(sPropertyPath);
		if (!aMatches) {
			throw new Error("Unsupported property context with path " + sPropertyPath);
		}

		oPromise = new Promise(function (fnResolve, fnReject) {
			var oProperty = oPropertyContext.getObject(),
				sQualifiedTypeName,
				mValueLists = Utils.getValueLists(oProperty);

			if (jQuery.isEmptyObject(mValueLists) && oProperty["sap:value-list"]
				&& that.oODataModelInterface.addAnnotationUrl) {
				// property with value list which is not yet loaded
				bCachePromise = true;
				sQualifiedTypeName = that.oModel.getObject(aMatches[2]).namespace
					+ "." + that.oModel.getObject(aMatches[1]).name;
				that.mQName2PendingRequest[sQualifiedTypeName + "/" + oProperty.name] = {
					resolve : function (oResponse) {
						// enhance property by annotations from response to get value lists
						jQuery.extend(oProperty,
							((oResponse.annotations.propertyAnnotations || {})
								[sQualifiedTypeName] || {})
									[oProperty.name]
						);
						mValueLists = Utils.getValueLists(oProperty);
						if (jQuery.isEmptyObject(mValueLists)) {
							fnReject(new Error("No value lists returned for " + sPropertyPath));
						} else {
							delete that.mContext2Promise[sPropertyPath];
							fnResolve(mValueLists);
						}
					},
					reject : fnReject
				};
				// send bundled value list request once after multiple synchronous API calls
				setTimeout(that._sendBundledRequest.bind(that), 0);
			} else {
				fnResolve(mValueLists);
			}
		});
		if (bCachePromise) {
			this.mContext2Promise[sPropertyPath] = oPromise;
		}

		return oPromise;
	};

	ODataMetaModel.prototype.getProperty = function () {
		return this._getObject.apply(this, arguments);
	};

	ODataMetaModel.prototype.isList = function () {
		return this.oModel.isList.apply(this.oModel, arguments);
	};

	/**
	 * Returns a promise which is fulfilled once the meta model data is loaded and can be used.
	 *
	 * @public
	 * @returns {Promise} a Promise
	 */
	ODataMetaModel.prototype.loaded = function () {
		return this.oLoadedPromise;
	};

	/**
	 * Refresh not supported by OData meta model!
	 *
	 * @throws {Error}
	 * @returns {void}
	 * @public
	 */
	ODataMetaModel.prototype.refresh = function () {
		throw new Error("Unsupported operation: ODataMetaModel#refresh");
	};

	/**
	 * Legacy syntax not supported by OData meta model!
	 *
	 * @param {boolean} bLegacySyntax
	 *   must not be true!
	 * @throws {Error} if <code>bLegacySyntax</code> is true
	 * @returns {void}
	 * @public
	 */
	ODataMetaModel.prototype.setLegacySyntax = function (bLegacySyntax) {
		if (bLegacySyntax) {
			throw new Error("Legacy syntax not supported by ODataMetaModel");
		}
	};

	/**
	 * Changes not supported by OData meta model!
	 *
	 * @throws {Error}
	 * @returns {void}
	 * @private
	 */
	ODataMetaModel.prototype.setProperty = function () {
		// Note: this method is called by JSONPropertyBinding#setValue
		throw new Error("Unsupported operation: ODataMetaModel#setProperty");
	};

	return ODataMetaModel;
});
