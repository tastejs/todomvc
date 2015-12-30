/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Disable some ESLint rules. camelcase (some "_" in names to indicate indexed variables (like in math)), valid-jsdoc (not completed yet), no-warning-comments (some TODOs are left)
// All other warnings, errors should be resolved
/*eslint-disable camelcase, valid-jsdoc, no-warning-comments */

// Provides API for analytical extensions in OData service metadata
sap.ui.define(['jquery.sap.global', './AnalyticalVersionInfo'],
	function(jQuery, AnalyticalVersionInfo) {
	"use strict";

	/**
	 * The OData4Analytics API is purely experimental, not yet functionally complete
	 * and not meant for productive usage. At present, its only purpose is to
	 * demonstrate how easy analytical extensions of OData4SAP can be consumed.
	 *
	 * <em>USE OBJECTS VIA METHODS ONLY - DO NOT ACCESS JAVASCRIPT OBJECT PROPERTIES DIRECTLY !</em>
	 *
	 * Lazy initialization of attributes will cause unexpected values when you
	 * access object attributes directly.
	 *
	 * @author SAP SE
	 * @experimental This module is only for experimental use!
	 * @namespace
	 * @name sap.ui.model.analytics.odata4analytics
	 * @protected
	 */
	var odata4analytics = odata4analytics || {};

	odata4analytics.constants = {};
	odata4analytics.constants["SAP_NAMESPACE"] = "http://www.sap.com/Protocols/SAPData";
	odata4analytics.constants["VERSION"] = "0.7";

	odata4analytics.helper = {
			/*
			 * Old helpers that got replaced by robust functions provided by the UI5 ODataModel
			 */
/*
		renderPropertyKeyValue : function(sKeyValue, sPropertyEDMTypeName) {
			if (typeof sKeyValue == "string" && sKeyValue.charAt(0) == "'")
				throw "Illegal property value starting with a quote";
			switch (sPropertyEDMTypeName) {
			case 'Edm.String':
				return "'" + sKeyValue + "'";
			case 'Edm.DateTime':
				return "datetime'" + sKeyValue + "'";
			case 'Edm.Guid':
				return "guid'" + sKeyValue + "'";
			case 'Edm.Time':
				return "time'" + sKeyValue + "'";
			case 'Edm.DateTimeOffset':
				return "datetimeoffset'" + sKeyValue + "'";
			default:
				return sKeyValue;
			}
		},

		renderPropertyFilterValue : function(sFilterValue, sPropertyEDMTypeName) {
			if (typeof sFilterValue == "string" && sFilterValue.charAt(0) == "'")
				throw "Illegal property value starting with a quote";
			switch (sPropertyEDMTypeName) {
			case 'Edm.String':
				return "'" + sFilterValue + "'";
			case 'Edm.DateTime':
				return "datetime'" + sFilterValue + "'";
			case 'Edm.Guid':
				return "guid'" + sFilterValue + "'";
			case 'Edm.Time':
				return "time'" + sFilterValue + "'";
			case 'Edm.DateTimeOffset':
				return "datetimeoffset'" + sFilterValue + "'";
			default:
				return sFilterValue;
			}
		},
*/
		tokenizeNametoLabelText : function(sName) {
			var sLabel = "";

			// remove leading 'P_' often used for parameter properties on HANA
			sLabel = sName.replace(/^P_(.*)/, "$1");
			// split UpperCamelCase in words (treat numbers and _ as upper case)
			sLabel = sLabel.replace(/([^A-Z0-9_]+)([A-Z0-9_])/g, "$1 $2");
			// split acronyms in words
			sLabel = sLabel.replace(/([A-Z0-9_]{2,})([A-Z0-9_])([^A-Z0-9_]+)/g, "$1 $2$3");
			// remove trailing _E
			sLabel = sLabel.replace(/(.*) _E$/, "$1");
			// remove underscores that were identified as upper case
			sLabel = sLabel.replace(/(.*) _(.*)/g, "$1 $2");
			return sLabel;
		}
	};

	/**
	 * Create a representation of the analytical semantics of OData service metadata
	 *
	 * @param {object}
	 *            oModelReference An instance of ReferenceByURI, ReferenceByModel or
	 *            ReferenceWithWorkaround for locating the OData service.
	 * @param {object}
	 * 	          [mParameter] Additional parameters for controlling the model construction. Currently supported are:
	 *            <li> sAnnotationJSONDoc - A JSON document providing extra annotations to the elements of the 
	 *                 structure of the given service
	 *            </li>
	 *            <li> modelVersion - Parameter to define which ODataModel version should be used, in you use 
	 *                 'odata4analytics.Model.ReferenceByURI': 1 (default), 2
	 *                 see also: AnalyticalVersionInfo constants
	 *            </li>
	 * @constructor
	 *
	 * @class Representation of an OData model with analytical annotations defined
	 *        by OData4SAP.
	 * @name sap.ui.model.analytics.odata4analytics.Model
	 * @public
	 */

	odata4analytics.Model = function(oModelReference, mParameter) {
		this._init(oModelReference, mParameter);
	};

	/**
	 * Create a reference to an OData model by the URI of the related OData service.
	 *
	 * @param {string}
	 *            sURI holding the URI.
	 * @constructor
	 *
	 * @class Handle to an OData model by the URI pointing to it.
	 * @name sap.ui.model.analytics.odata4analytics.Model.ReferenceByURI
	 * @public
	 */
	odata4analytics.Model.ReferenceByURI = function(sURI) {
		return {
			sServiceURI : sURI
		};
	};

	/**
	 * Create a reference to an OData model already loaded elsewhere with the help
	 * of SAP UI5.
	 *
	 * @param {object}
	 *            oModel holding the OData model.
	 * @constructor
	 *
	 * @class Handle to an already instantiated SAP UI5 OData model.
	 * @name sap.ui.model.analytics.odata4analytics.Model.ReferenceByModel
	 * @public
	 */
	odata4analytics.Model.ReferenceByModel = function(oModel) {
		return {
			oModel : oModel
		};
	};

	/**
	 * Create a reference to an OData model having certain workarounds activated. A
	 * workaround is an implementation that changes the standard behavior of the API
	 * to overcome some gap or limitation in the OData provider. The workaround
	 * implementation can be conditionally activated by passing the identifier in
	 * the contructor.
	 *
	 * Known workaround identifiers are:
	 *
	 * <li>"CreateLabelsFromTechnicalNames" - If a property has no label text, it
	 * gets generated from the property name.</li>
	 *
	 * <li>"IdentifyTextPropertiesByName" -If a dimension property has no text and
	 * another property with the same name and an appended "Name", "Text" etc.
	 * exists, they are linked via annotation.</li>
	 *
	 *
	 * @param {object}
	 *            oModel holding a reference to the OData model, obtained
	 *            by odata4analytics.Model.ReferenceByModel or by
	 *            sap.odata4analytics.Model.ReferenceByURI.
	 * @param {string[]}
	 *            aWorkaroundID listing all workarounds to be applied.
	 * @constructor
	 *
	 * @class Handle to an already instantiated SAP UI5 OData model.
	 * @name sap.ui.model.analytics.odata4analytics.Model.ReferenceWithWorkaround
	 * @public
	 */
	odata4analytics.Model.ReferenceWithWorkaround = function(oModel, aWorkaroundID) {
		return {
			oModelReference : oModel,
			aWorkaroundID : aWorkaroundID
		};
	};

	odata4analytics.Model.prototype = {

		/**
		 * initialize a new object
		 *
		 * @private
		 */
		_init : function(oModelReference, mParameter) {
			if (typeof mParameter == "string") {
				throw "Deprecated second argument: Adjust your invocation by passing an object with a property sAnnotationJSONDoc as a second argument instead";
			}
			this._mParameter = mParameter;
			
			var that = this;
			/*
			 * get access to OData model
			 */

			this._oActivatedWorkarounds = {};

			if (oModelReference && oModelReference.aWorkaroundID) {
				for (var i = -1, sID; (sID = oModelReference.aWorkaroundID[++i]) !== undefined;) {
					this._oActivatedWorkarounds[sID] = true;
				}
				oModelReference = oModelReference.oModelReference;
			}

			// check proper usage
			if (!oModelReference || (!oModelReference.sServiceURI && !oModelReference.oModel)) {
				throw "Usage with oModelReference being an instance of Model.ReferenceByURI or Model.ReferenceByModel";
			}

			//check if a model is given, or we need to create one from the service URI
			if (oModelReference.oModel) {
				this._oModel = oModelReference.oModel;
				// find out which model version we are running
				this._iVersion = AnalyticalVersionInfo.getVersion(this._oModel);
				checkForMetadata();
			} else {
				// Check if the user wants a V2 model
				if (mParameter && mParameter.modelVersion === AnalyticalVersionInfo.V2) {
					this._oModel = new sap.ui.model.odata.v2.ODataModel(oModelReference.sServiceURI);
					this._iVersion = AnalyticalVersionInfo.V2;
					checkForMetadata();
				} else {
					//default is V1 Model
					this._oModel = new sap.ui.model.odata.ODataModel(oModelReference.sServiceURI);
					this._iVersion = AnalyticalVersionInfo.V1;
					checkForMetadata();
				}
			}

			if (this._oModel.getServiceMetadata().dataServices == undefined) {
				throw "Model could not be loaded";
			}
	
			/**
			 * Check if the metadata is already available, if not defere the interpretation of the Metadata
			 */
			function checkForMetadata() {
				// V2 supports asynchronous loading of metadata
				// we have to register for the MetadataLoaded Event in case, the data is not loaded already
				if (!that._oModel.getServiceMetadata()) {
					that._oModel.attachMetadataLoaded(processMetadata);
				} else {
					// metadata already loaded
					processMetadata();
				}
			}

			/**
			 * Kickstart the interpretation of the metadata,
			 * either called directly if metadata is available, or deferred and then
			 * executed via callback by the model during the metadata loaded event.
			 */
			function processMetadata () {
				//only interprete the metadata if the analytics model was not initialised yet
				if (that.bIsInitialized) {
					return;
				}
				
				//mark analytics model as initialized
				that.bIsInitialized = true;
				
				/*
				 * add extra annotations if provided
				 */
				if (mParameter && mParameter.sAnnotationJSONDoc) {
					that.mergeV2Annotations(mParameter.sAnnotationJSONDoc);
				}
				
				that._interpreteMetadata(that._oModel.getServiceMetadata().dataServices);
			}

		},
		
		/**
		 * @private
		 */
		_interpreteMetadata: function (oMetadata) {
			/*
			 * parse OData model for analytic queries
			 */

			this._oQueryResultSet = {};
			this._oParameterizationSet = {};
			this._oEntityTypeSet = {};
			this._oEntitySetSet = {};
			this._oEntityTypeNameToEntitySetMap = {};

			// loop over all schemas and entity containers
			// TODO: extend this implementation to support many schemas
			var oSchema = this._oModel.getServiceMetadata().dataServices.schema[0];

			// remember default container
			for (var j = -1, oContainer; (oContainer = oSchema.entityContainer[++j]) !== undefined;) {
				if (oContainer.isDefaultEntityContainer == "true") {
					this._oDefaultEntityContainer = oContainer;
					break;
				}
			}

			var aEntityType = oSchema.entityType;

			// A. preparation

			// A.1 collect all relevant OData entity types representing query
			// results, parameters
			var aQueryResultEntityTypes = [], aParameterEntityTypes = [], aUnsortedEntityTypes = [];

			for (var k = -1, oType; (oType = aEntityType[++k]) !== undefined;) {
				var bProcessed = false;

				if (oType.extensions != undefined) {
					for (var l = -1, oExtension; (oExtension = oType.extensions[++l]) !== undefined;) {
						if (oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE
								&& oExtension.name == "semantics") {
							bProcessed = true;
							switch (oExtension.value) {
							case "aggregate":
								aQueryResultEntityTypes.push(oType);
								break;
							case "parameters":
								aParameterEntityTypes.push(oType);
								break;
							default:
								aUnsortedEntityTypes.push(oType);
							}
						}
						if (bProcessed) {
							continue;
						}
					}
					if (!bProcessed) {
						aUnsortedEntityTypes.push(oType);
					}
				} else {
					aUnsortedEntityTypes.push(oType);
				}
			}
			// A.2 create entity type representations for the unsorted types
			for (var m = -1, oType2; (oType2 = aUnsortedEntityTypes[++m]) !== undefined;) {
				var oEntityType = new odata4analytics.EntityType(this._oModel.getServiceMetadata(), oSchema, oType2);
				this._oEntityTypeSet[oEntityType.getQName()] = oEntityType;
				var aEntitySet = this._getEntitySetsOfType(oSchema, oEntityType.getQName());
				if (aEntitySet.length == 0) {
					throw "Invalid consumption model: No entity set for entity type " + oEntityType.getQName() + " found";
				}
				if (aEntitySet.length > 1) {
					throw "Unsupported consumption model: More than one entity set for entity type " + oEntityType.getQName() + " found";
				}
				var oEntitySet = new odata4analytics.EntitySet(this._oModel.getServiceMetadata(), oSchema,
						aEntitySet[0][0], aEntitySet[0][1], oEntityType);
				this._oEntitySetSet[oEntitySet.getQName()] = oEntitySet;
				this._oEntityTypeNameToEntitySetMap[oEntityType.getQName()] = oEntitySet;
			}

			// B. create objects for the analytical extensions of these entity types
			// B.1 create parameters

			// temporary storage for lookup of entity *types* annotated with
			// parameters semantics
			var oParameterizationEntityTypeSet = {};

			for (var n = -1, oType3; (oType3 = aParameterEntityTypes[++n]) !== undefined;) {
				// B.1.1 create object for OData entity type
				var oEntityType2 = new odata4analytics.EntityType(this._oModel.getServiceMetadata(), oSchema, oType3);
				this._oEntityTypeSet[oEntityType2.getQName()] = oEntityType2;
				// B.1.2 get sets with this type
				var aEntitySet2 = this._getEntitySetsOfType(oSchema, oEntityType2.getQName());
				if (aEntitySet2.length == 0) {
					throw "Invalid consumption model: No entity set for parameter entity type " + oEntityType2.getQName() + " found";
				}
				if (aEntitySet2.length > 1) {
					throw "Unsupported consumption model: More than one entity set for parameter entity type " + oEntityType2.getQName() + " found";
				}

				// B.1.3 create object for OData entity set
				var oEntitySet2 = new odata4analytics.EntitySet(this._oModel.getServiceMetadata(), oSchema,
						aEntitySet2[0][0], aEntitySet2[0][1], oEntityType2);
				this._oEntitySetSet[oEntitySet2.getQName()] = oEntitySet2;
				this._oEntityTypeNameToEntitySetMap[oEntityType2.getQName()] = oEntitySet2;

				// B.1.4 create object for parameters and related OData entity
				var oParameterization = new odata4analytics.Parameterization(oEntityType2, oEntitySet2);
				this._oParameterizationSet[oParameterization.getName()] = oParameterization;
				oParameterizationEntityTypeSet[oEntityType2.getQName()] = oParameterization;

				// B.1.5 recognize all available parameter value helps
				var sParameterizationEntityTypeQTypeName = oEntityType2.getQName();

				if (oSchema.association != undefined) {
					for (var p = -1, oAssoc; (oAssoc = oSchema.association[++p]) !== undefined;) {
						// value help always established by a referential constraint
						// on an association
						if (oAssoc.referentialConstraint == undefined) {
							continue;
						}

						var sParameterValueHelpEntityTypeQTypeName = null;

						// B.1.5.1 relevant only if one end has same type as the
						// given parameterization entity type
						if (oAssoc.end[0].type == sParameterizationEntityTypeQTypeName && oAssoc.end[0].multiplicity == "*"
								&& oAssoc.end[1].multiplicity == "1") {
							sParameterValueHelpEntityTypeQTypeName = oAssoc.end[1].type;

						} else if (oAssoc.end[1].type == sParameterizationEntityTypeQTypeName && oAssoc.end[1].multiplicity == "*"
								&& oAssoc.end[0].multiplicity == "1") {
							sParameterValueHelpEntityTypeQTypeName = oAssoc.end[0].type;
						}
						if (!sParameterValueHelpEntityTypeQTypeName) {
							continue;
						}

						// B.1.5.2 check if the referential constraint declares a
						// parameter property as dependent
						if (oAssoc.referentialConstraint.dependent.propertyRef.length != 1) {
							continue;
						}
						var oParameter = oParameterization.findParameterByName(oAssoc.referentialConstraint.dependent.propertyRef[0].name);
						if (oParameter == null) {
							continue;
						}

						// B.1.5.3 Register the recognized parameter value help
						// entity type and set and link them to the parameter
						var oValueListEntityType = this._oEntityTypeSet[sParameterValueHelpEntityTypeQTypeName];
						var oValueListEntitySet = this._oEntityTypeNameToEntitySetMap[sParameterValueHelpEntityTypeQTypeName];
						oParameter.setValueSetEntity(oValueListEntityType, oValueListEntitySet);
					}
				}
			}

			// B.2
			// B.2 create analytic queries
			for (var r = -1, oType4; (oType4 = aQueryResultEntityTypes[++r]) !== undefined;) {

				// B.2.1 create object for OData entity
				var oEntityType3 = new odata4analytics.EntityType(this._oModel.getServiceMetadata(), oSchema, oType4);
				this._oEntityTypeSet[oEntityType3.getQName()] = oEntityType3;
				var sQueryResultEntityTypeQTypeName = oEntityType3.getQName();

				// B.2.2 find assocs to parameter entity types
				var oParameterization3 = null;
				var oAssocFromParamsToResult = null;

				if (oSchema.association != undefined) {
					for (var s = -1, oAssoc2; (oAssoc2 = oSchema.association[++s]) !== undefined;) {
						var sParameterEntityTypeQTypeName = null;
						if (oAssoc2.end[0].type == sQueryResultEntityTypeQTypeName) {
							sParameterEntityTypeQTypeName = oAssoc2.end[1].type;
						} else if (oAssoc2.end[1].type == sQueryResultEntityTypeQTypeName) {
							sParameterEntityTypeQTypeName = oAssoc2.end[0].type;
						} else {
							continue;
						}

						// B.2.2.2 fetch Parameterization object if any
						var oMatchingParameterization = null;

						oMatchingParameterization = oParameterizationEntityTypeSet[sParameterEntityTypeQTypeName];
						if (oMatchingParameterization != null) {
							if (oParameterization3 != null) {
								// TODO: extend this implementation to support more
								// than one related parameter entity type
								throw "LIMITATION: Unable to handle multiple parameter entity types of query entity "
										+ oEntityType3.name;
							} else {
								oParameterization3 = oMatchingParameterization;
								oAssocFromParamsToResult = oAssoc2;
							}
						}
					}
				}

				// B.2.3 get sets with this type
				var aEntitySet3 = this._getEntitySetsOfType(oSchema, oEntityType3.getQName());
				if (aEntitySet3.length != 1) {
					throw "Invalid consumption model: There must be exactly one entity set for an entity type annotated with aggregating semantics";
				}

				// B.2.4 create object for OData entity set of analytic query result
				var oEntitySet3 = new odata4analytics.EntitySet(this._oModel.getServiceMetadata(), oSchema,
						aEntitySet3[0][0], aEntitySet3[0][1], oEntityType3);
				this._oEntitySetSet[oEntitySet3.getQName()] = oEntitySet3;
				this._oEntityTypeNameToEntitySetMap[oEntityType3.getQName()] = oEntitySet3;

				// B.2.5 create object for analytic query result, related OData
				// entity type and set and (if any) related parameters
				// object
				var oQueryResult = new odata4analytics.QueryResult(this, oEntityType3, oEntitySet3, oParameterization3);
				this._oQueryResultSet[oQueryResult.getName()] = oQueryResult;

				// B.2.6 set target result for found parameterization
				if (oParameterization3) {
					oParameterization3.setTargetQueryResult(oQueryResult, oAssocFromParamsToResult);
				}

				// B.2.7 recognize all available dimension value helps
				if (oSchema.association != undefined) {
					for (var t = -1, oAssoc3; (oAssoc3 = oSchema.association[++t]) !== undefined;) {
						// value help always established by a referential constraint
						// on an association
						if (oAssoc3.referentialConstraint == undefined) {
							continue;
						}

						var sDimensionValueHelpEntityTypeQTypeName = null;

						// B.2.7.1 relevant only if one end has same type as the
						// given query result entity type
						if (oAssoc3.end[0].type == sQueryResultEntityTypeQTypeName && oAssoc3.end[0].multiplicity == "*"
								&& oAssoc3.end[1].multiplicity == "1") {
							sDimensionValueHelpEntityTypeQTypeName = oAssoc3.end[1].type;

						} else if (oAssoc3.end[1].type == sQueryResultEntityTypeQTypeName && oAssoc3.end[1].multiplicity == "*"
								&& oAssoc3.end[0].multiplicity == "1") {
							sDimensionValueHelpEntityTypeQTypeName = oAssoc3.end[0].type;
						}
						if (!sDimensionValueHelpEntityTypeQTypeName) {
							continue;
						}

						// B.2.7.2 check if the referential constraint declares a
						// dimension property as dependent
						if (oAssoc3.referentialConstraint.dependent.propertyRef.length != 1) {
							continue;
						}
						var oDimension = oQueryResult.findDimensionByName(oAssoc3.referentialConstraint.dependent.propertyRef[0].name);
						if (oDimension == null) {
							continue;
						}

						// B.2.7.3 Register the recognized dimension value help
						// entity set and link it to the dimension
						var oDimensionMembersEntitySet = this._oEntityTypeNameToEntitySetMap[sDimensionValueHelpEntityTypeQTypeName];
						oDimension.setMembersEntitySet(oDimensionMembersEntitySet);
					}
				}

			}

		},

		/*
		 * Control data for adding extra annotations to service metadata
		 *
		 * @private
		 */
		oUI5ODataModelAnnotatableObject : {
			objectName : "schema",
			keyPropName : "namespace",
			extensions : true,
			aSubObject : [ {
				objectName : "entityType",
				keyPropName : "name",
				extensions : true,
				aSubObject : [ {
					objectName : "property",
					keyPropName : "name",
					aSubObject : [],
					extensions : true
				} ]
			}, {
				objectName : "entityContainer",
				keyPropName : "name",
				extensions : false,
				aSubObject : [ {
					objectName : "entitySet",
					keyPropName : "name",
					extensions : true,
					aSubObject : []
				} ]
			} ]
		},

		/*
		 * merging extra annotations with provided service metadata
		 *
		 * @private
		 */
		mergeV2Annotations : function(sAnnotationJSONDoc) {
			var oAnnotation = null;
			try {
				oAnnotation = JSON.parse(sAnnotationJSONDoc);
			} catch (exception) {
				return;
			}

			var oMetadata;
			try {
				oMetadata = this._oModel.getServiceMetadata().dataServices;
			} catch (exception) {
				return;
			}

			// find "schema" entry in annotation document
			for ( var propName in oAnnotation) {
				if (!(this.oUI5ODataModelAnnotatableObject.objectName == propName)) {
					continue;
				}
				if (!(oAnnotation[propName] instanceof Array)) {
					continue;
				}
				this.mergeV2AnnotationLevel(oMetadata[this.oUI5ODataModelAnnotatableObject.objectName],
						oAnnotation[this.oUI5ODataModelAnnotatableObject.objectName], this.oUI5ODataModelAnnotatableObject);
				break;
			}

			return;
		},

		/*
		 * merging extra annotations with a given service metadata object
		 *
		 * @private
		 */

		mergeV2AnnotationLevel : function(aMetadata, aAnnotation, oUI5ODataModelAnnotatableObject) {

			for (var i = -1, oAnnotation; (oAnnotation = aAnnotation[++i]) !== undefined;) {
				for (var j = -1, oMetadata; (oMetadata = aMetadata[++j]) !== undefined;) {

					if (!(oAnnotation[oUI5ODataModelAnnotatableObject.keyPropName] == oMetadata[oUI5ODataModelAnnotatableObject.keyPropName])) {
						continue;
					}
					// found match: apply extensions from oAnnotation object to
					// oMetadata object
					if (oAnnotation["extensions"] != undefined) {
						if (oMetadata["extensions"] == undefined) {
							oMetadata["extensions"] = [];
						}

						for (var l = -1, oAnnotationExtension; (oAnnotationExtension = oAnnotation["extensions"][++l]) !== undefined;) {
							var bFound = false;
							for (var m = -1, oMetadataExtension; (oMetadataExtension = oMetadata["extensions"][++m]) !== undefined;) {
								if (oAnnotationExtension.name == oMetadataExtension.name
										&& oAnnotationExtension.namespace == oMetadataExtension.namespace) {
									oMetadataExtension.value = oAnnotationExtension.value;
									bFound = true;
									break;
								}
							}
							if (!bFound) {
								oMetadata["extensions"].push(oAnnotationExtension);
							}
						}
					}
					// walk down to sub objects
					for (var k = -1, oUI5ODataModelAnnotatableSubObject; (oUI5ODataModelAnnotatableSubObject = oUI5ODataModelAnnotatableObject.aSubObject[++k]) !== undefined;) {

						for ( var propName in oAnnotation) {
							if (!(oUI5ODataModelAnnotatableSubObject.objectName == propName)) {
								continue;
							}
							if (!(oAnnotation[oUI5ODataModelAnnotatableSubObject.objectName] instanceof Array)) {
								continue;
							}
							if ((oMetadata[oUI5ODataModelAnnotatableSubObject.objectName] == undefined)
									|| (!(oMetadata[oUI5ODataModelAnnotatableSubObject.objectName] instanceof Array))) {
								continue;
							}
							this.mergeV2AnnotationLevel(oMetadata[oUI5ODataModelAnnotatableSubObject.objectName],
									oAnnotation[oUI5ODataModelAnnotatableSubObject.objectName], oUI5ODataModelAnnotatableSubObject);
							break;
						}
					}
				}
			}
			return;
		},

		/**
		 * Find analytic query result by name
		 *
		 * @param {string}
		 *            sName Fully qualified name of query result entity set
		 * @returns {sap.ui.model.analytics.odata4analytics.QueryResult} The query result object
		 *          with this name or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Model#findQueryResultByName
		 */
		findQueryResultByName : function(sName) {
			var oQueryResult = this._oQueryResultSet[sName];

			// Everybody should have a second chance:
			// If the name was not fully qualified, check if it is in the default
			// container
			if (!oQueryResult && this._oDefaultEntityContainer) {
				var sQName = this._oDefaultEntityContainer.name + "." + sName;

				oQueryResult = this._oQueryResultSet[sQName];
			}
			return oQueryResult;
		},

		/**
		 * Get the names of all query results (entity sets) offered by the model
		 *
		 * @returns {array(string)} List of all query result names
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Model#getAllQueryResultNames
		 */
		getAllQueryResultNames : function() {
			if (this._aQueryResultNames) {
				return this._aQueryResultNames;
			}

			this._aQueryResultNames = new Array(0);

			for ( var sName in this._oQueryResultSet) {
				this._aQueryResultNames.push(this._oQueryResultSet[sName].getName());
			}

			return this._aQueryResultNames;
		},

		/**
		 * Get all query results offered by the model
		 *
		 * @returns {object} An object with individual JS properties for each query
		 *          result included in the model. The JS object properties all are
		 *          objects of type odata4analytics.QueryResult. The names
		 *          of the JS object properties are given by the entity set names
		 *          representing the query results.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Model#getAllQueryResults
		 */
		getAllQueryResults : function() {
			return this._oQueryResultSet;
		},

		/**
		 * Get underlying OData model provided by SAP UI5
		 *
		 * @returns {object} The SAP UI5 representation of the model.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Model#getODataModel
		 */
		getODataModel : function() {
			return this._oModel;
		},
		/**
		 * Private methods
		 */

		/**
		 * Find entity sets of a given type
		 *
		 * @private
		 */
		_getEntitySetsOfType : function(oSchema, sQTypeName) {
			var aEntitySet = [];

			for (var i = -1, oEntityContainer; (oEntityContainer = oSchema.entityContainer[++i]) !== undefined;) {
				for (var j = -1, oEntitySet; (oEntitySet = oEntityContainer.entitySet[++j]) !== undefined;) {
					if (oEntitySet.entityType == sQTypeName) {
						aEntitySet.push([ oEntityContainer, oEntitySet ]);
					}
				}
			}

			return aEntitySet;
		},

		/**
		 * Private member attributes
		 */
		_mParameter : null,
		_oModel : null,
		_oDefaultEntityContainer : null,

		_aQueryResultNames : null,
		_oQueryResultSet : null,
		_oParameterizationSet : null,
		_oEntityTypeSet : null,
		_oEntitySetSet : null,
		_oEntityTypeNameToEntitySetMap : null,

		_oActivatedWorkarounds : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of an analytic query. Do not create your own instances.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.Model}
	 *            oModel The analytical model containing this query result entity
	 *            set
	 * @param {sap.ui.model.analytics.odata4analytics.EntityType}
	 *            oEntityType The OData entity type for this query
	 * @param {sap.ui.model.analytics.odata4analytics.EntitySet}
	 *            oEntitySet The OData entity set for this query offered by the
	 *            OData service
	 * @param {sap.ui.model.analytics.odata4analytics.Parameterization}
	 *            oParameterization The parameterization of this query, if any
	 *
	 * @constructor
	 * @this (QueryResult)
	 *
	 * @class Representation of an entity type annotated with
	 *        sap:semantics="aggregate".
	 * @name sap.ui.model.analytics.odata4analytics.QueryResult
	 * @public
	 */
	odata4analytics.QueryResult = function(oModel, oEntityType, oEntitySet, oParameterization) {
		this._init(oModel, oEntityType, oEntitySet, oParameterization);
	};

	odata4analytics.QueryResult.prototype = {

		/**
		 * initialize new object
		 *
		 * @private
		 */
		_init : function(oModel, oEntityType, oEntitySet, oParameterization, oAssocFromParamsToResult) {
			this._oModel = oModel;
			this._oEntityType = oEntityType;
			this._oEntitySet = oEntitySet;
			this._oParameterization = oParameterization;

			this._oDimensionSet = {};
			this._oMeasureSet = {};

			// parse entity type for analytic semantics described by annotations
			var aProperty = oEntityType.getTypeDescription().property;
			var oAttributeForPropertySet = {};
			for (var i = -1, oProperty; (oProperty = aProperty[++i]) !== undefined;) {
				if (oProperty.extensions == undefined) {
					continue;
				}
				for (var j = -1, oExtension; (oExtension = oProperty.extensions[++j]) !== undefined;) {

					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}

					switch (oExtension.name) {
					case "aggregation-role":
						switch (oExtension.value) {
						case "dimension": {
							var oDimension = new odata4analytics.Dimension(this, oProperty);
							this._oDimensionSet[oDimension.getName()] = oDimension;
							break;
							}
						case "measure": {
							var oMeasure = new odata4analytics.Measure(this, oProperty);
							this._oMeasureSet[oMeasure.getName()] = oMeasure;
							break;
							}
						case "totaled-properties-list":
							this._oTotaledPropertyListProperty = oProperty;
							break;
						default:
							}
						break;
					case "attribute-for": {
						var oDimensionAttribute = new odata4analytics.DimensionAttribute(this, oProperty);
						var oKeyProperty = oDimensionAttribute.getKeyProperty();
						oAttributeForPropertySet[oKeyProperty.name] = oDimensionAttribute;
						break;
						}
					default:
					}
				}
			}

			// assign dimension attributes to the respective dimension objects
			for ( var sDimensionAttributeName in oAttributeForPropertySet) {
				var oDimensionAttribute2 = oAttributeForPropertySet[sDimensionAttributeName];
				oDimensionAttribute2.getDimension().addAttribute(oDimensionAttribute2);
			}

			// apply workaround for missing text properties if requested
			if (oModel._oActivatedWorkarounds.IdentifyTextPropertiesByName) {
				var aMatchedTextPropertyName = [];
				for ( var oDimName in this._oDimensionSet) {
					var oDimension2 = this._oDimensionSet[oDimName];
					if (!oDimension2.getTextProperty()) {
						var oTextProperty = null; // order of matching is
						// significant!
						oTextProperty = oEntityType.findPropertyByName(oDimName + "Name");
						if (!oTextProperty) {
							oTextProperty = oEntityType.findPropertyByName(oDimName + "Text");
						}
						if (!oTextProperty) {
							oTextProperty = oEntityType.findPropertyByName(oDimName + "Desc");
						}
						if (!oTextProperty) {
							oTextProperty = oEntityType.findPropertyByName(oDimName + "Description");
						}
						if (oTextProperty) { // any match?
							oDimension2.setTextProperty(oTextProperty); // link
							// dimension
							// with text
							// property
							aMatchedTextPropertyName.push(oTextProperty.name);
						}
					}
				}
				// make sure that any matched text property is not exposed as
				// dimension (according to spec)
				for (var t = -1, sPropertyName; (sPropertyName = aMatchedTextPropertyName[++t]) !== undefined;) {
					delete this._oDimensionSet[sPropertyName];
				}
			}
		},

		/**
		 * Get the name of the query result
		 *
		 * @returns {string} The fully qualified name of the query result, which is
		 *          identical with the name of the entity set representing the query
		 *          result in the OData service
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getName
		 */
		getName : function() {
			return this.getEntitySet().getQName();
		},

		/**
		 * Get the parameterization of this query result
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.Parameterization} The object for the
		 *          parameterization or null if the query result is not
		 *          parameterized
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getParameterization
		 */
		getParameterization : function() {
			return this._oParameterization;
		},

		/**
		 * Get the names of all dimensions included in the query result
		 *
		 * @returns {array(string)} List of all dimension names
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getAllDimensionNames
		 */
		getAllDimensionNames : function() {
			if (this._aDimensionNames) {
				return this._aDimensionNames;
			}

			this._aDimensionNames = [];

			for ( var sName in this._oDimensionSet)
				this._aDimensionNames.push(this._oDimensionSet[sName].getName());

			return this._aDimensionNames;
		},

		/**
		 * Get all dimensions included in this query result
		 *
		 * @returns {object} An object with individual JS properties for each
		 *          dimension included in the query result. The JS object properties
		 *          all are objects of type odata4analytics.Dimension. The
		 *          names of the JS object properties are given by the OData entity
		 *          type property names representing the dimension keys.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getAllDimensions
		 */
		getAllDimensions : function() {
			return this._oDimensionSet;
		},

		/**
		 * Get the names of all measures included in the query result
		 *
		 * @returns {array(string)} List of all measure names
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getAllMeasureNames
		 */
		getAllMeasureNames : function() {
			if (this._aMeasureNames) {
				return this._aMeasureNames;
			}

			this._aMeasureNames = [];

			for ( var sName in this._oMeasureSet)
				this._aMeasureNames.push(this._oMeasureSet[sName].getName());

			return this._aMeasureNames;
		},

		/**
		 * Get all measures included in this query result
		 *
		 * @returns {object} An object with individual JS properties for each
		 *          measure included in the query result. The JS object properties
		 *          all are objects of type odata4analytics.Measure. The
		 *          names of the JS object properties are given by the OData entity
		 *          type property names representing the measure raw values.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getAllMeasures
		 */
		getAllMeasures : function() {
			return this._oMeasureSet;
		},

		/**
		 * Find dimension by name
		 *
		 * @param {string}
		 *            sName Dimension name
		 * @returns {sap.ui.model.analytics.odata4analytics.Dimension} The dimension object with
		 *          this name or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#findDimensionByName
		 */
		findDimensionByName : function(sName) {
			return this._oDimensionSet[sName];
		},

		/**
		 * Find dimension by property name
		 *
		 * @param {string}
		 *            sName Property name
		 * @returns {sap.ui.model.analytics.odata4analytics.Dimension} The dimension object to
		 *          which the given property name is related, because the property
		 *          holds the dimension key, its text, or is an attribute of this
		 *          dimension. If no such dimension exists, null is returned.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#findDimensionByPropertyName
		 */
		findDimensionByPropertyName : function(sName) {
			if (this._oDimensionSet[sName]) { // the easy case
				return this._oDimensionSet[sName];
			}

			for ( var sDimensionName in this._oDimensionSet) {
				var oDimension = this._oDimensionSet[sDimensionName];
				var oTextProperty = oDimension.getTextProperty();
				if (oTextProperty && oTextProperty.name == sName) {
					return oDimension;
				}
				if (oDimension.findAttributeByName(sName)) {
					return oDimension;
				}
			}
			return null;
		},

		/**
		 * Get property holding the totaled property list
		 *
		 * @returns {object} The DataJS object representing this property
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getTotaledPropertiesListProperty
		 */
		getTotaledPropertiesListProperty : function() {
			return this._oTotaledPropertyListProperty;
		},

		/**
		 * Find measure by name
		 *
		 * @param {string}
		 *            sName Measure name
		 * @returns {sap.ui.model.analytics.odata4analytics.Measure} The measure object with this
		 *          name or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#findMeasureByName
		 */
		findMeasureByName : function(sName) {
			return this._oMeasureSet[sName];
		},

		/**
		 * Find measure by property name
		 *
		 * @param {string}
		 *            sName Property name
		 * @returns {sap.ui.model.analytics.odata4analytics.Measure} The measure object to which
		 *          the given property name is related, because the property holds
		 *          the raw measure value or its formatted value. If no such measure
		 *          exists, null is returned.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#findMeasureByPropertyName
		 */
		findMeasureByPropertyName : function(sName) {
			if (this._oMeasureSet[sName]) { // the easy case
				return this._oMeasureSet[sName];
			}

			for ( var sMeasureName in this._oMeasureSet) {
				var oMeasure = this._oMeasureSet[sMeasureName];
				var oFormattedValueProperty = oMeasure.getFormattedValueProperty();
				if (oFormattedValueProperty && oFormattedValueProperty.name == sName) {
					return oMeasure;
				}
			}
			return null;
		},

		/**
		 * Get the analytical model containing the entity set for this query result
		 *
		 * @returns {object} The analytical representation of the OData model
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getModel
		 */
		getModel : function() {
			return this._oModel;
		},

		/**
		 * Get the entity type defining the type of this query result in the OData
		 * model
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.EntityType} The OData entity type for
		 *          this query result
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getEntityType
		 */
		getEntityType : function() {
			return this._oEntityType;
		},

		/**
		 * Get the entity set representing this query result in the OData model
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.EntitySet} The OData entity set
		 *          representing this query result
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResult#getEntitySet
		 */
		getEntitySet : function() {
			return this._oEntitySet;
		},

		/**
		 * Private member attributes
		 */

		_oModel : null,
		_oEntityType : null,
		_oEntitySet : null,
		_oParameterization : null,
		_aDimensionNames : null,
		_oDimensionSet : null,
		_aMeasureNames : null,
		_oMeasureSet : null,
		_oTotaledPropertyListProperty : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of a parameterization for an analytic query. Do not create your own instances.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.EntityType}
	 *            oEntityType The OData entity type for this parameterization
	 * @param {sap.ui.model.analytics.odata4analytics.EntitySet}
	 *            oEntitySet The OData entity set for this parameterization offered
	 *            by the OData service
	 *
	 * @class Representation of an entity type annotated with
	 *        sap:semantics="parameters".
	 * @name sap.ui.model.analytics.odata4analytics.Parameterization
	 * @public
	 */
	odata4analytics.Parameterization = function(oEntityType, oEntitySet) {
		this._init(oEntityType, oEntitySet);
	};

	odata4analytics.Parameterization.prototype = {
		/**
		 * @private
		 */
		_init : function(oEntityType, oEntitySet) {
			this._oEntityType = oEntityType;
			this._oEntitySet = oEntitySet;

			this._oParameterSet = {};

			// parse entity type for analytic semantics described by annotations
			var aProperty = oEntityType.getTypeDescription().property;
			for (var i = -1, oProperty; (oProperty = aProperty[++i]) !== undefined;) {
				if (oProperty.extensions == undefined) {
					continue;
				}

				for (var j = -1, oExtension; (oExtension = oProperty.extensions[++j]) !== undefined;) {

					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}

					switch (oExtension.name) {
					// process parameter semantics
					case "parameter": {
						var oParameter = new odata4analytics.Parameter(this, oProperty);
						this._oParameterSet[oParameter.getName()] = oParameter;

						break;
						}
					default:
					}
				}
			}

		},

		// to be called only by Model objects
		setTargetQueryResult : function(oQueryResult, oAssociation) {
			this._oQueryResult = oQueryResult;
			var sQAssocName = this._oEntityType.getSchema().namespace + "." + oAssociation.name;
			var aNavProp = this._oEntityType.getTypeDescription().navigationProperty;
			if (!aNavProp) {
				throw "Invalid consumption model: Parameters entity type lacks navigation property for association to query result entity type";
			}
			for (var i = -1, oNavProp; (oNavProp = aNavProp[++i]) !== undefined;) {
				if (oNavProp.relationship == sQAssocName) {
					this._oNavPropToQueryResult = oNavProp.name;
				}
			}
			if (!this._oNavPropToQueryResult) {
				throw "Invalid consumption model: Parameters entity type lacks navigation property for association to query result entity type";
			}
		},

		getTargetQueryResult : function() {
			if (!this._oQueryResult) {
				throw "No target query result set";
			}
			return this._oQueryResult;
		},

		/**
		 * Get the name of the parameter
		 *
		 * @returns {string} The name of the parameterization, which is identical
		 *          with the name of the entity set representing the
		 *          parameterization in the OData service
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameterization#getName
		 */
		getName : function() {
			return this.getEntitySet().getQName();
		},

		/**
		 * Get the names of all parameters part of the parameterization
		 *
		 * @returns {array(string)} List of all parameter names
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameterization#getAllParameterNames
		 */
		getAllParameterNames : function() {
			if (this._aParameterNames) {
				return this._aParameterNames;
			}

			this._aParameterNames = [];

			for ( var sName in this._oParameterSet)
				this._aParameterNames.push(this._oParameterSet[sName].getName());

			return this._aParameterNames;
		},

		/**
		 * Get all parameters included in this parameterization
		 *
		 * @returns {object} An object with individual JS properties for each
		 *          parameter included in the query result. The JS object properties
		 *          all are objects of type odata4analytics.Parameter. The
		 *          names of the JS object properties are given by the OData entity
		 *          type property names representing the parameter keys.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameterization#getAllParameters
		 */
		getAllParameters : function() {
			return this._oParameterSet;
		},

		/**
		 * Find parameter by name
		 *
		 * @param {string}
		 *            sName Parameter name
		 * @returns {sap.ui.model.analytics.odata4analytics.Parameter} The parameter object with
		 *          this name or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameterization#findParameterByName
		 */
		findParameterByName : function(sName) {
			return this._oParameterSet[sName];
		},

		/**
		 * Get navigation property to query result
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.QueryResult} The parameter object with
		 *          this name or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameterization#getNavigationPropertyToQueryResult
		 */
		getNavigationPropertyToQueryResult : function() {
			return this._oNavPropToQueryResult;
		},

		/**
		 * Get the entity type defining the type of this query result in the OData
		 * model
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.EntityType} The OData entity type for
		 *          this query result
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameterization#getEntityType
		 */
		getEntityType : function() {
			return this._oEntityType;
		},

		/**
		 * Get the entity set representing this query result in the OData model
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.EntitySet} The OData entity set
		 *          representing this query result
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameterization#getEntitySet
		 */
		getEntitySet : function() {
			return this._oEntitySet;
		},

		/**
		 * Private member attributes
		 */
		_oEntityType : null,
		_oEntitySet : null,
		_oQueryResult : null,
		_oNavPropToQueryResult : null,
		_aParameterNames : null,
		_oParameterSet : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of a single parameter contained in a parameterization. Do not create your own instances.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.Parameterization}
	 *            oParameterization The parameterization containing this parameter
	 * @param {object}
	 *            oProperty The DataJS object object representing the text property
	 *
	 * @constructor
	 *
	 * @class Representation of a property annotated with sap:parameter.
	 * @name sap.ui.model.analytics.odata4analytics.Parameter
	 * @public
	 */
	odata4analytics.Parameter = function(oParameterization, oProperty) {
		this._init(oParameterization, oProperty);
	};

	odata4analytics.Parameter.prototype = {
		/**
		 * @private
		 */
		_init : function(oParameterization, oProperty) {
			this._oParameterization = oParameterization;
			this._oProperty = oProperty;

			var oEntityType = oParameterization.getEntityType();

			if (oProperty.extensions != undefined) {
				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {

					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}

					switch (oExtension.name) {
					case "parameter":
						switch (oExtension.value) {
						case "mandatory":
							this._bRequired = true;
							break;
						case "optional":
							this._bRequired = false;
							break;
						default:
							throw "Invalid annotation value for parameter property";
						}
						break;
					case "label":
						this._sLabelText = oExtension.value;
						break;
					case "text":
						this._oTextProperty = oEntityType.findPropertyByName(oExtension.value);
						break;
					case "upper-boundary":
						this._bIntervalBoundaryParameter = true;
						this._oUpperIntervalBoundaryParameterProperty = oEntityType.findPropertyByName(oExtension.value);
						break;
					case "lower-boundary":
						this._bIntervalBoundaryParameter = true;
						this._oLowerIntervalBoundaryParameterProperty = oEntityType.findPropertyByName(oExtension.value);
						break;
					default:
					}
				}
			}
			if (!this._sLabelText) {
				this._sLabelText = "";
			}
		},

		// to be called only by Model objects
		setValueSetEntity : function(oEntityType, oEntitySet) {
			this._oValueSetEntityType = oEntityType;
			this._oValueSetEntitySet = oEntitySet;
		},

		/**
		 * Get text property related to this parameter
		 *
		 * @returns {object} The DataJS object representing the text property or
		 *          null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#getTextProperty
		 */
		getTextProperty : function() {
			return this._oTextProperty;
		},

		/**
		 * Get label
		 *
		 * @returns {string} The (possibly language-dependent) label text for this
		 *          parameter
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#getLabelText
		 */
		getLabelText : function() {
			if (!this._sLabelText && this._oParameterization._oQueryResult._oModel._oActivatedWorkarounds.CreateLabelsFromTechnicalNames) {
				this._sLabelText = odata4analytics.helper.tokenizeNametoLabelText(this.getName());
			}
			return this._sLabelText;
		},

		/**
		 * Get indicator whether or not the parameter is optional
		 *
		 * @returns {boolean} True iff the parameter is optional
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#isOptional
		 */
		isOptional : function() {
			return (!this._bRequired);
		},

		/**
		 * Get indicator if the parameter represents an interval boundary
		 *
		 * @returns {boolean} True iff it represents an interval boundary, otherwise
		 *          false
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#isIntervalBoundary
		 */
		isIntervalBoundary : function() {
			return this._bIntervalBoundaryParameter;
		},

		/**
		 * Get indicator if the parameter represents the lower boundary of an
		 * interval
		 *
		 * @returns {boolean} True iff it represents the lower boundary of an
		 *          interval, otherwise false
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#isLowerIntervalBoundary
		 */
		isLowerIntervalBoundary : function() {
			return (this._oUpperIntervalBoundaryParameterProperty ? true : false);
		},

		/**
		 * Get property for the parameter representing the peer boundary of the same
		 * interval
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.Parameter} The parameter representing
		 *          the peer boundary of the same interval. This means that if
		 *          *this* parameter is a lower boundary, the returned object
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#getPeerIntervalBoundaryParameter
		 */
		getPeerIntervalBoundaryParameter : function() {
			var sPeerParamPropName = null;
			if (this._oLowerIntervalBoundaryParameterProperty) {
				sPeerParamPropName = this._oLowerIntervalBoundaryParameterProperty.name;
			} else {
				sPeerParamPropName = this._oUpperIntervalBoundaryParameterProperty.name;
			}
			if (!sPeerParamPropName) {
				throw "Parameter is not an interval boundary";
			}
			return this._oParameterization.findParameterByName(sPeerParamPropName);
		},

		/**
		 * Get indicator if a set of values is available for this parameter.
		 * Typically, this is true for parameters with a finite set of known values
		 * such as products, business partners in different roles, organization
		 * units, and false for integer or date parameters
		 *
		 * @returns {boolean} True iff a value set is available, otherwise false
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#isValueSetAvailable
		 */
		isValueSetAvailable : function() {
			return (this._oValueSetEntityType ? true : false);
		},

		/**
		 * Get the name of the parameter
		 *
		 * @returns {string} The name of the parameter, which is identical with the
		 *          name of the property representing the parameter in the
		 *          parameterization entity type
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#getName
		 */
		getName : function() {
			return this._oProperty.name;
		},

		/**
		 * Get property
		 *
		 * @returns {object} The DataJS object representing the property of this
		 *          parameter
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#getProperty
		 */
		getProperty : function() {
			return this._oProperty;
		},

		/**
		 * Get parameterization containing this parameter
		 *
		 * @return {sap.ui.model.analytics.odata4analytics.Parameterization} The parameterization
		 *         object
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#getContainingParameterization
		 */
		getContainingParameterization : function() {
			return this._oParameterization;
		},

		/**
		 * Get the URI to locate the entity set holding the value set, if it is
		 * available.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 * @returns The resource path of the URI pointing to the entity set. It is a
		 *          relative URI unless a service root is given, which would then
		 *          prefixed in order to return a complete URL.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Parameter#getURIToValueEntitySet
		 */
		getURIToValueEntitySet : function(sServiceRootURI) {
			var sURI = null;
			sURI = (sServiceRootURI ? sServiceRootURI : "") + "/" + this._oValueSetEntitySet.getQName();
			return sURI;
		},

		/**
		 * Private member attributes
		 */
		_oParameterization : null,
		_oProperty : null,
		_sLabelText : null,
		_oTextProperty : null,
		_bRequired : false,
		_bIntervalBoundaryParameter : false,
		_oLowerIntervalBoundaryParameterProperty : null,
		_oUpperIntervalBoundaryParameterProperty : null,

		_oValueSetEntityType : null,
		_oValueSetEntitySet : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of a dimension provided by an analytic query. Do not create your own instances.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.QueryResult}
	 *            oQueryResult The query result containing this dimension
	 * @param {object}
	 *            oProperty The DataJS object object representing the dimension
	 *
	 * @constructor
	 *
	 * @class Representation of a property annotated with
	 *        sap:aggregation-role="dimension".
	 * @name sap.ui.model.analytics.odata4analytics.Dimension
	 * @public
	 */
	odata4analytics.Dimension = function(oQueryResult, oProperty) {
		this._init(oQueryResult, oProperty);
	};

	odata4analytics.Dimension.prototype = {
		_init : function(oQueryResult, oProperty) {
			this._oQueryResult = oQueryResult;
			this._oProperty = oProperty;

			this._oAttributeSet = {};
		},

		// to be called only by Model objects
		setMembersEntitySet : function(oEntitySet) {
			this._oMembersEntitySet = oEntitySet;
		},

		/**
		 * Get the name of the dimension
		 *
		 * @returns {string} The name of this dimension, which is identical to the
		 *          name of the dimension key property in the entity type
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getName
		 */
		getName : function() {
			return this._oProperty.name;
		},

		/**
		 * Get the key property
		 *
		 * @returns {object} The DataJS object representing the property for the
		 *          dimension key
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getKeyProperty
		 */
		getKeyProperty : function() {
			return this._oProperty;
		},

		/**
		 * Get text property related to this dimension
		 *
		 * @returns {object} The DataJS object representing the text property or
		 *          null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getTextProperty
		 */
		getTextProperty : function() {
			if (!this._oTextProperty) {
				this._oTextProperty = this._oQueryResult.getEntityType().getTextPropertyOfProperty(this.getName());
			}
			return this._oTextProperty;
		},

		/**
		 * Set text property Relevant for workaround w/ID
		 * IdentifyTextPropertiesByName
		 *
		 * @private
		 */
		setTextProperty : function(oTextProperty) {
			this._oTextProperty = oTextProperty;
		},

		/**
		 * Get label
		 *
		 * @returns {string} The (possibly language-dependent) label text for this
		 *          dimension
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getLabelText
		 */
		getLabelText : function() {
			if (!this._sLabelText) {
				this._sLabelText = this._oQueryResult.getEntityType().getLabelOfProperty(this.getName());
			}
			if (!this._sLabelText && this._oQueryResult._oModel._oActivatedWorkarounds.CreateLabelsFromTechnicalNames) {
				this._sLabelText = odata4analytics.helper.tokenizeNametoLabelText(this.getName());
			}
			return (this._sLabelText == null ? "" : this._sLabelText);
		},

		/**
		 * Get super-ordinate dimension
		 *
		 * @returns {object} The super-ordinate dimension or null if there is none
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getSuperOrdinateDimension
		 */
		getSuperOrdinateDimension : function() {
			if (!this._sSuperOrdinateDimension) {
				var sSuperOrdPropName = this._oQueryResult.getEntityType().getSuperOrdinatePropertyOfProperty(this.getName()).name;
				this._sSuperOrdinateDimension = this._oQueryResult.findDimensionByName(sSuperOrdPropName);
			}
			return this._sSuperOrdinateDimension;
		},

		/**
		 * Get associated hierarchy
		 *
		 * @returns {object} The hierarchy object or null if there is none. It can
		 *          be an instance of class
		 *          odata4analytics.RecursiveHierarchy (TODO later: or a
		 *          leveled hierarchy). Use methods isLeveledHierarchy and
		 *          isRecursiveHierarchy to determine object type.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getHierarchy
		 */
		getHierarchy : function() {
			// set associated hierarchy if any
			if (!this._oHierarchy) {
				this._oHierarchy = this._oQueryResult.getEntityType().getHierarchy(this._oProperty.name);
			}

			return this._oHierarchy;
		},

		/**
		 * Get the names of all attributes included in this dimension
		 *
		 * @returns {array(string)} List of all attribute names
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getAllAttributeNames
		 */
		getAllAttributeNames : function() {
			if (this._aAttributeNames) {
				return this._aAttributeNames;
			}

			this._aAttributeNames = [];

			for ( var sName in this._oAttributeSet)
				this._aAttributeNames.push(this._oAttributeSet[sName].getName());

			return this._aAttributeNames;
		},

		/**
		 * Get all attributes of this dimension
		 *
		 * @returns {object} An object with individual JS properties for each
		 *          attribute of this dimension. The JS object properties all are
		 *          objects of type odata4analytics.DimensionAttribute. The
		 *          names of the JS object properties are given by the OData entity
		 *          type property names representing the dimension attribute keys.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getAllAttributes
		 */
		getAllAttributes : function() {
			return this._oAttributeSet;
		},

		/**
		 * Find attribute by name
		 *
		 * @param {string}
		 *            sName Attribute name
		 * @returns {sap.ui.model.analytics.odata4analytics.Dimension} The dimension attribute
		 *          object with this name or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#findAttributeByName
		 */
		findAttributeByName : function(sName) {
			return this._oAttributeSet[sName];
		},

		// to be called only by QueryResult objects
		addAttribute : function(oDimensionAttribute) {
			this._oAttributeSet[oDimensionAttribute.getName()] = oDimensionAttribute;
		},

		/**
		 * Get query result containing this dimension
		 *
		 * @return {sap.ui.model.analytics.odata4analytics.QueryResult} The query result object
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getContainingQueryResult
		 */
		getContainingQueryResult : function() {
			return this._oQueryResult;
		},

		/**
		 * Get indicator whether or not master data is available for this dimension
		 *
		 * @returns {boolean} True iff master data is available
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#hasMasterData
		 */
		hasMasterData : function() {
			return this._oMembersEntitySet != null ? true : false;
		},

		/**
		 * Get master data entity set for this dimension
		 *
		 * @return {sap.ui.model.analytics.odata4analytics.EntitySet} The master data entity set
		 *         for this dimension, or null, if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Dimension#getMasterDataEntitySet
		 */
		getMasterDataEntitySet : function() {
			return this._oMembersEntitySet;
		},

		/**
		 * Private member attributes
		 */
		_oQueryResult : null,
		_oProperty : null,

		_oTextProperty : null,
		_sLabelText : null,
		_sSuperOrdinateDimension : null,
		_aAttributeNames : null,
		_oAttributeSet : null,

		_oMembersEntitySet : null,

		_oHierarchy : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of a dimension attribute provided by an analytic
	 * query. Do not create your own instances.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.QueryResult}
	 *            oQueryResult The query result containing this dimension attribute
	 * @param {object}
	 *            oProperty The DataJS object object representing the dimension
	 *            attribute
	 *
	 * @constructor
	 *
	 * @class Representation of a dimension attribute.
	 * @name sap.ui.model.analytics.odata4analytics.DimensionAttribute
	 * @public
	 */
	odata4analytics.DimensionAttribute = function(oQueryResult, oProperty) {
		this._init(oQueryResult, oProperty);
	};

	odata4analytics.DimensionAttribute.prototype = {
		/**
		 * @private
		 */
		_init : function(oQueryResult, oProperty) {
			this._oQueryResult = oQueryResult;
			this._oProperty = oProperty;

			if (oProperty.extensions != undefined) {

				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {

					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}

					switch (oExtension.name) {
					case "attribute-for":
						this._sDimensionName = oExtension.value;
						break;
					case "label":
						this._sLabelText = oExtension.value;
						break;
					case "text":
						this._oTextProperty = oQueryResult.getEntityType().findPropertyByName(oExtension.value);
						break;
					default:
					}
				}
			}
		},

		/**
		 * Get the name of the dimension attribute
		 *
		 * @returns {string} The name of the dimension attribute, which is identical
		 *          to the name of the property in the entity type holding the
		 *          attribute value
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionAttribute#getName
		 */
		getName : function() {
			return this._oProperty.name;
		},

		/**
		 * Get the key property
		 *
		 * @returns {object} The DataJS object representing the property for the key
		 *          of this dimension attribute
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionAttribute#getKeyProperty
		 */
		getKeyProperty : function() {
			return this._oProperty;
		},

		/**
		 * Get text property related to this dimension attribute
		 *
		 * @returns {object} The DataJS object representing the text property or
		 *          null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionAttribute#getTextProperty
		 */
		getTextProperty : function() {
			return this._oTextProperty;
		},

		/**
		 * Get label
		 *
		 * @returns {string} The (possibly language-dependent) label text for this
		 *          dimension attribute
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionAttribute#getLabelText
		 */
		getLabelText : function() {
			if (!this._sLabelText && this._oQueryResult._oModel._oActivatedWorkarounds.CreateLabelsFromTechnicalNames) {
				this._sLabelText = odata4analytics.helper.tokenizeNametoLabelText(this.getName());
			}
			return this._sLabelText;
		},

		/**
		 * Get dimension
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.Dimension} The dimension object
		 *          containing this attribute
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionAttribute#getDimension
		 */
		getDimension : function() {
			return this._oQueryResult.findDimensionByName(this._sDimensionName);
		},

		/**
		 * Private member attributes
		 */
		_oQueryResult : null,
		_oProperty : null,

		_oTextProperty : null,
		_sLabelText : null,
		_sDimensionName : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of a measure provided by an analytic query. Do not create your own instances.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.QueryResult}
	 *            oQueryResult The query result containing this measure
	 * @param {object}
	 *            oProperty The DataJS object object representing the measure
	 *
	 * @constructor
	 *
	 * @class Representation of a property annotated with
	 *        sap:aggregation-role="measure".
	 * @name sap.ui.model.analytics.odata4analytics.Measure
	 * @public
	 */
	odata4analytics.Measure = function(oQueryResult, oProperty) {
		this._init(oQueryResult, oProperty);
	};

	odata4analytics.Measure.prototype = {
		/**
		 * @private
		 */
		_init : function(oQueryResult, oProperty) {
			this._oQueryResult = oQueryResult;
			this._oProperty = oProperty;

			if (oProperty.extensions != undefined) {

				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {

					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}

					switch (oExtension.name) {
					case "label":
						this._sLabelText = oExtension.value;
						break;
					case "text":
						this._oTextProperty = oQueryResult.getEntityType().findPropertyByName(oExtension.value);
						break;
					case "unit":
						this._oUnitProperty = oQueryResult.getEntityType().findPropertyByName(oExtension.value);
						break;
					default:
					}
				}
			}
			if (!this._sLabelText) {
				this._sLabelText = "";
			}
		},

		/**
		 * Get the name of the measure
		 *
		 * @returns {string} The name of the measure, which is identical to the name
		 *          of the measure raw value property in the entity type
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Measure#getName
		 */
		getName : function() {
			return this._oProperty.name;
		},

		/**
		 * Get the raw value property
		 *
		 * @returns {object} The DataJS object representing the property holding the
		 *          raw value of this measure
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Measure#getRawValueProperty
		 */
		getRawValueProperty : function() {
			return this._oProperty;
		},

		/**
		 * Get the text property associated to the raw value property holding the
		 * formatted value related to this measure
		 *
		 * @returns {object} The DataJS object representing the property holding the
		 *          formatted value text of this measure or null if this measure
		 *          does not have a unit
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Measure#getFormattedValueProperty
		 */
		getFormattedValueProperty : function() {
			return this._oTextProperty;
		},

		/**
		 * Get the unit property related to this measure
		 *
		 * @returns {object} The DataJS object representing the unit property or
		 *          null if this measure does not have a unit
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Measure#getUnitProperty
		 */
		getUnitProperty : function() {
			return this._oUnitProperty;
		},

		/**
		 * Get label
		 *
		 * @returns {string} The (possibly language-dependent) label text for this
		 *          measure
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Measure#getLabelText
		 */
		getLabelText : function() {
			if (!this._sLabelText && this._oQueryResult._oModel._oActivatedWorkarounds.CreateLabelsFromTechnicalNames) {
				this._sLabelText = odata4analytics.helper.tokenizeNametoLabelText(this.getName());
			}
			return this._sLabelText;
		},

		/**
		 * Get indicator whether or not the measure is updatable
		 *
		 * @returns {boolean} True iff the measure is updatable
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.Measure#isUpdatable
		 */
		isUpdatable : function() {
			if (this._bIsUpdatable != null) {
				return this._bIsUpdatable;
			}
			var oUpdatablePropertyNameSet = this._oQueryResult.getEntitySet().getUpdatablePropertyNameSet();

			return (oUpdatablePropertyNameSet[this.getName()] != undefined);
		},

		/**
		 * Private member attributes
		 */
		_oQueryResult : null,
		_oProperty : null,

		_oTextProperty : null,
		_sLabelText : null,
		_oUnitProperty : null,

		_bIsUpdatable : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of an OData entity set in the context of an analytic
	 * query. Do not create your own instances.
	 *
	 * @param {object}
	 *            oModel DataJS object for the OData model containing this entity
	 *            set
	 * @param {object}
	 *            oSchema DataJS object for the schema surrounding the container of
	 *            this entity set
	 * @param {object}
	 *            oContainer DataJS object for the container holding this entity set
	 * @param {object}
	 *            oEntitySet DataJS object for the entity set
	 * @param {object}
	 *            oEntityType DataJS object for the entity type
	 *
	 * @constructor
	 *
	 * @class Representation of a OData entity set.
	 * @name sap.ui.model.analytics.odata4analytics.EntitySet
	 * @public
	 */
	odata4analytics.EntitySet = function(oModel, oSchema, oContainer, oEntitySet, oEntityType) {
		this._init(oModel, oSchema, oContainer, oEntitySet, oEntityType);
	};

	odata4analytics.EntitySet.prototype = {
		/**
		 * @private
		 */
		_init : function(oModel, oSchema, oContainer, oEntitySet, oEntityType) {
			this._oEntityType = oEntityType;
			this._oEntitySet = oEntitySet;
			this._oContainer = oContainer;
			this._oSchema = oSchema;
			this._oModel = oModel;

			if (oSchema.entityContainer.length > 1) {
				this._sQName = oContainer.name + "." + oEntitySet.name;
			} else {
				// no need to disambiguate this for the simple case
				this._sQName = oEntitySet.name;
			}
		},

		/**
		 * Get the fully qualified name for this entity type
		 *
		 * @returns {string} The fully qualified name
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntitySet#getQName
		 */
		getQName : function() {
			return this._sQName;
		},

		/**
		 * Get full description for this entity set
		 *
		 * @returns {object} The DataJS object representing the entity set
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntitySet#getSetDescription
		 */
		getSetDescription : function() {
			return this._oEntitySet;
		},

		/**
		 * Get entity type used for this entity set
		 *
		 * @returns {object} The DataJS object representing the entity type
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntitySet#getEntityType
		 */
		getEntityType : function() {
			return this._oEntityType;
		},

		getSchema : function() {
			return this._oSchema;
		},

		getModel : function() {
			return this._oModel;
		},

		/**
		 * Get names of properties in this entity set that can be updated
		 *
		 * @returns {object} An object with individual JS properties for each
		 *          updatable property. For testing whether propertyName is the name
		 *          of an updatable property, use
		 *          <code>getUpdatablePropertyNameSet()[propertyName]</code>. The
		 *          included JS object properties are all set to true.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntitySet#getUpdatablePropertyNameSet
		 */
		getUpdatablePropertyNameSet : function() {
			if (this._oUpdatablePropertyNames) {
				return this._oUpdatablePropertyNames;
			}

			this._oUpdatablePropertyNames = {};
			var bSetIsUpdatable = true;
			if (this._oEntitySet.extensions != undefined) {
				for (var j = -1, oExtension; (oExtension = this._oEntitySet.extensions[++j]) !== undefined;) {
					if (oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE && oExtension.name == "updatable") {
						if (oExtension.value == "false") {
							bSetIsUpdatable = false;
							break;
						}
					}
				}
			}
			if (!bSetIsUpdatable) { // set not updatable cascades to all properties
				return this._oUpdatablePropertyNames;
			}

			var aProperty = this._oEntityType.getTypeDescription().property;
			for (var i = -1, oProperty; (oProperty = aProperty[++i]) !== undefined;) {
				var bPropertyIsUpdatable = true;

				if (oProperty.extensions == undefined) {
					continue;
				}
				for (var k = -1, oExtension2; (oExtension2 = oProperty.extensions[++k]) !== undefined;) {
					if (oExtension2.namespace != odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}

					if (oExtension2.name == "updatable") {
						if (oExtension2.value == "false") {
							bPropertyIsUpdatable = false;
							break;
						}
					}
				}
				if (bPropertyIsUpdatable) {
					this._oUpdatablePropertyNames[oProperty.name] = true;
				}
			}
			return this._oUpdatablePropertyNames;
		},

		/**
		 * Private member attributes
		 */

		_oEntityType : null,
		_oEntitySet : null,
		_oContainer : null,
		_oSchema : null,
		_oModel : null,
		_sQName : null,
		_oUpdatablePropertyNames : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of an OData entity type in the context of an analytic
	 * query. Do not create your own instances.
	 *
	 * @param {object}
	 *            oModel DataJS object for the OData model containing this entity
	 *            type
	 * @param {object}
	 *            oSchema DataJS object for the schema containing this entity type
	 * @param {object}
	 *            oEntityType DataJS object for the entity type
	 *
	 * @constructor
	 *
	 * @class Representation of a OData entity type.
	 * @name sap.ui.model.analytics.odata4analytics.EntityType
	 * @public
	 */
	odata4analytics.EntityType = function(oModel, oSchema, oEntityType) {
		this._init(oModel, oSchema, oEntityType);
	};

	odata4analytics.EntityType.propertyFilterRestriction = {
		SINGLE_VALUE : "single-value",
		MULTI_VALUE : "multi-value",
		INTERVAL : "interval"
	};

	odata4analytics.EntityType.prototype = {
		/**
		 * @private
		 */
		_init : function(oModel, oSchema, oEntityType) {
			this._oEntityType = oEntityType;
			this._oSchema = oSchema;
			this._oModel = oModel;

			this._aKeyProperties = [];
			this._oPropertySet = {};
			this._aFilterablePropertyNames = [];
			this._aSortablePropertyNames = [];
			this._aRequiredFilterPropertyNames = [];
			this._oPropertyFilterRestrictionSet = {};

			this._oPropertyHeadingsSet = {};
			this._oPropertyQuickInfosSet = {};

			this._sQName = oSchema.namespace + "." + oEntityType.name;

			/*
			 * collect all hierarchies defined in this entity type
			 */
			var oRecursiveHierarchies = {}; // temp for collecting all properties participating in hierarchies
			var oRecursiveHierarchy = null;

			for (var i = -1, oPropertyRef; (oPropertyRef = oEntityType.key.propertyRef[++i]) !== undefined;) {
				this._aKeyProperties.push(oPropertyRef.name);
			}

			for (var k = -1, oProperty; (oProperty = oEntityType.property[++k]) !== undefined;) {

				// store property references for faster lookup
				this._oPropertySet[oProperty.name] = oProperty;

				// by default, every property can be filtered
				this._aFilterablePropertyNames.push(oProperty.name);

				// by default, every property can be sorted
				this._aSortablePropertyNames.push(oProperty.name);

				if (oProperty.extensions == undefined) {
					continue;
				}
				for (var j = -1, oExtension; (oExtension = oProperty.extensions[++j]) !== undefined;) {

					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}

					switch (oExtension.name) {
					case "filterable":
						if (oExtension.value == "false") {
							this._aFilterablePropertyNames.pop(oProperty.name);
						}
						break;
					case "sortable":
						if (oExtension.value == "false") {
							this._aSortablePropertyNames.pop(oProperty.name);
						}
						break;
					case "required-in-filter":
						if (oExtension.value == "true") {
							this._aRequiredFilterPropertyNames.push(oProperty.name);
						}
						break;
					case "filter-restriction":
						if (oExtension.value == odata4analytics.EntityType.propertyFilterRestriction.SINGLE_VALUE
								|| oExtension.value == odata4analytics.EntityType.propertyFilterRestriction.MULTI_VALUE
								|| oExtension.value == odata4analytics.EntityType.propertyFilterRestriction.INTERVAL) {
							this._oPropertyFilterRestrictionSet[oProperty.name] = oExtension.value;
						}
						break;

					// hierarchy annotations: build temporary set of
					// hierarchy-node-id properties with relevant attributes
					case "hierarchy-node-for":
						if (!(oRecursiveHierarchy = oRecursiveHierarchies[oProperty.name])) {
							oRecursiveHierarchy = oRecursiveHierarchies[oProperty.name] = {};
						}
						oRecursiveHierarchy.dimensionName = oExtension.value;
						break;
					case "hierarchy-parent-node-for":
					case "hierarchy-parent-nod": // TODO workaround for GW bug
						if (!(oRecursiveHierarchy = oRecursiveHierarchies[oExtension.value])) {
							oRecursiveHierarchy = oRecursiveHierarchies[oExtension.value] = {};
						}
						oRecursiveHierarchy.parentNodeIDProperty = oProperty;
						break;
					case "hierarchy-level-for":
						if (!(oRecursiveHierarchy = oRecursiveHierarchies[oExtension.value])) {
							oRecursiveHierarchy = oRecursiveHierarchies[oExtension.value] = {};
						}
						oRecursiveHierarchy.levelProperty = oProperty;
						break;
					case "hierarchy-drill-state-for":
					case "hierarchy-drill-stat": // TODO workaround for GW bug
						if (!(oRecursiveHierarchy = oRecursiveHierarchies[oExtension.value])) {
							oRecursiveHierarchy = oRecursiveHierarchies[oExtension.value] = {};
						}
						oRecursiveHierarchy.drillStateProperty = oProperty;
						break;
					default:
					}
				}
			}

			// post processing: set up hierarchy objects
			this._oRecursiveHierarchySet = {};
			for ( var hierNodeIDPropertyName in oRecursiveHierarchies) {
				var oHierarchy = oRecursiveHierarchies[hierNodeIDPropertyName];
				var oHierarchyNodeIDProperty = this._oPropertySet[hierNodeIDPropertyName];
				var oDimensionProperty = this._oPropertySet[oHierarchy.dimensionName];
				if (oDimensionProperty == null) {
					// TODO temporary workaround for BW provider, which does not
					// return it: let dimension coincide with hierarchy
					// node ID
					oDimensionProperty = oHierarchyNodeIDProperty;
				}
				this._oRecursiveHierarchySet[oDimensionProperty.name] = new odata4analytics.RecursiveHierarchy(oEntityType,
						oHierarchyNodeIDProperty, oHierarchy.parentNodeIDProperty, oHierarchy.levelProperty, oDimensionProperty);
			}

		},

		/**
		 * Get all properties
		 *
		 * @return {object} Object with (JavaScript) properties, one for each (OData
		 *         entity type) property. These (JavaScript) properties hold the
		 *         DataJS object representing the property
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getProperties
		 */
		getProperties : function() {
			return this._oPropertySet;
		},

		/**
		 * Find property by name
		 *
		 * @param {string}
		 *            sPropertyName Property name
		 * @returns {object} The DataJS object representing the property or null if
		 *          it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#findPropertyByName
		 */
		findPropertyByName : function(sPropertyName) {
			return this._oPropertySet[sPropertyName];
		},

		/**
		 * Get key properties of this type
		 *
		 * @returns {array(string)} The list of key property names
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getKeyProperties
		 */
		getKeyProperties : function() {
			return this._aKeyProperties;
		},

		/**
		 * Get label of the property with specified name (identified by property
		 * metadata annotation sap:label)
		 *
		 * @param {string}
		 *            sPropertyName Property name
		 * @returns {string} The label string
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getLabelOfProperty
		 */
		getLabelOfProperty : function(sPropertyName) {
			var oProperty = this._oPropertySet[sPropertyName];
			if (oProperty == null) {
				throw "no such property with name " + sPropertyName;
			}

			if (oProperty.extensions != undefined) {
				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {
					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}
					if (oExtension.name == "label") {
						return oExtension.value;
					}
				}
			}
			return null;
		},

		/**
		 * Get heading of the property with specified name (identified by property
		 * metadata annotation sap:heading)
		 *
		 * @param {string}
		 *            sPropertyName Property name
		 * @returns {string} The heading string
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getHeadingOfProperty
		 */
		getHeadingOfProperty : function(sPropertyName) {
			var oProperty = this._oPropertySet[sPropertyName];
			if (oProperty == null) {
				throw "no such property with name " + sPropertyName;
			}

			var sPropertyLabel = null;
			if (oProperty.extensions != undefined) {
				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {
					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}
					if (oExtension.name == "heading") {
						return oExtension.value;
					}
					if (oExtension.name == "label") {
						sPropertyLabel = oExtension.value;
					}
				}
			}
			// no heading found, so return property label
			return sPropertyLabel;
		},

		/**
		 * Get quick info of the property with specified name (identified by property
		 * metadata annotation sap:quickinfo)
		 *
		 * @param {string}
		 *            sPropertyName Property name
		 * @returns {string} The quick info string
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getQuickInfoOfProperty
		 */
		getQuickInfoOfProperty : function(sPropertyName) {
			var oProperty = this._oPropertySet[sPropertyName];
			if (oProperty == null) {
				throw "no such property with name " + sPropertyName;
			}

			var sPropertyLabel = null;
			if (oProperty.extensions != undefined) {
				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {
					if (!oExtension.namespace == odata4analytics.constants.SAP_NAMESPACE) {
						continue;
					}
					if (oExtension.name == "quickinfo") {
						return oExtension.value;
					}
					if (oExtension.name == "label") {
						sPropertyLabel = oExtension.value;
					}
				}
			}
			// no quick info found, so return property label
			return sPropertyLabel;
		},

		/**
		 * Get the text property related to the property with specified name
		 * (identified by property metadata annotation sap:text)
		 *
		 * @param {string}
		 *            sPropertyName Property name
		 * @returns {object} The DataJS object representing the text property or
		 *          null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getTextPropertyOfProperty
		 */
		getTextPropertyOfProperty : function(sPropertyName) {
			var oProperty = this._oPropertySet[sPropertyName];
			if (oProperty == null) {
				throw "no such property with name " + sPropertyName;
			}

			if (oProperty.extensions != undefined) {
				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {
					if (oExtension.name == "text") {
						return this.findPropertyByName(oExtension.value);
					}
				}
			}
			return null;
		},

		/**
		 * Get the super-ordinate property related to the property with specified
		 * name (identified by property metadata annotation sap:super-ordinate)
		 *
		 * @param {string}
		 *            sPropertyName Property name
		 * @returns {object} The DataJS object representing the super-ordinate
		 *          property or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getSuperOrdinatePropertyOfProperty
		 */
		getSuperOrdinatePropertyOfProperty : function(sPropertyName) {
			var oProperty = this._oPropertySet[sPropertyName];
			if (oProperty == null) {
				throw "no such property with name " + sPropertyName;
			}

			if (oProperty.extensions != undefined) {
				for (var i = -1, oExtension; (oExtension = oProperty.extensions[++i]) !== undefined;) {
					if (oExtension.name == "super-ordinate") {
						return this.findPropertyByName(oExtension.value);
					}
				}
			}
			return null;
		},

		/**
		 * Get names of properties that can be filtered, that is they can be used in
		 * $filter expressions
		 *
		 * @returns {array(string)} Array with names of properties that can be
		 *          filtered.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getFilterablePropertyNames
		 */
		getFilterablePropertyNames : function() {
			return this._aFilterablePropertyNames;
		},

		/**
		 * Get names of properties that can be sorted, that is they can be used in
		 * $orderby expressions
		 *
		 * @returns {array(string)} Array with names of properties that can be
		 *          sorted.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getSortablePropertyNames
		 */
		getSortablePropertyNames : function() {
			return this._aSortablePropertyNames;
		},

		/**
		 * Get names of properties that must be filtered, that is they must appear
		 * in every $filter expression
		 *
		 * @returns {array(string)} Array with names of properties that must be
		 *          filtered.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getRequiredFilterPropertyNames
		 */
		getRequiredFilterPropertyNames : function() {
			return this._aRequiredFilterPropertyNames;
		},

		/**
		 * Get properties for which filter restrictions have been specified
		 *
		 * @returns {object} Object with (JavaScript) properties, one for each
		 *          (OData entity type) property. The property value is from
		 *          odata4analytics.EntityType.propertyFilterRestriction and
		 *          indicates the filter restriction for this property.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getPropertiesWithFilterRestrictions
		 */
		getPropertiesWithFilterRestrictions : function() {
			return this._oPropertyFilterRestrictionSet;
		},

		/**
		 * Get the names of all properties with an associated hierarchy
		 *
		 * @returns {array(string)} List of all property names
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getAllHierarchyPropertyNames
		 */
		getAllHierarchyPropertyNames : function() {
			if (this._aHierarchyPropertyNames) {
				return this._aHierarchyPropertyNames;
			}

			this._aHierarchyPropertyNames = [];

			for ( var sName in this._oRecursiveHierarchySet)
				this._aHierarchyPropertyNames.push(this._oRecursiveHierarchySet[sName].getNodeValueProperty().name);

			return this._aHierarchyPropertyNames;
		},

		/**
		 * Get the hierarchy associated to a given property Based on the current
		 * specification, hierarchies are always recursive. TODO: Extend behavior
		 * when leveled hierarchies get in scope
		 *
		 * @param {string}
		 *            sName Parameter name
		 * @returns {sap.ui.model.analytics.odata4analytics.RecursiveHierarchy} The hierarchy
		 *          object or null if it does not exist
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getHierarchy
		 */
		getHierarchy : function(sName) {
			if (this._oRecursiveHierarchySet[sName] == undefined) {
				return null;
			}
			return this._oRecursiveHierarchySet[sName];
		},

		/**
		 * Get the fully qualified name for this entity type
		 *
		 * @returns {string} The fully qualified name
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getQName
		 */
		getQName : function() {
			return this._sQName;
		},

		/**
		 * Get full description for this entity type
		 *
		 * @returns {object} The DataJS object representing the entity type
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.EntityType#getTypeDescription
		 */
		getTypeDescription : function() {
			return this._oEntityType;
		},

		getSchema : function() {
			return this._oSchema;
		},

		getModel : function() {
			return this._oModel;
		},

		/**
		 * Private member attributes
		 */

		_oEntityType : null,
		_oSchema : null,
		_oModel : null,
		_sQName : null,

		_aKeyProperties : null,

		_oPropertySet : null,
		_aFilterablePropertyNames : null,
		_aRequiredFilterPropertyNames : null,
		_oPropertyFilterRestrictionSet : null,

		_aHierarchyPropertyNames : null,
		_oRecursiveHierarchySet : null
	};

	/** ******************************************************************** */

	/**
	 * Create a representation of a recursive hierarchy defined on one multiple
	 * properties in an OData entity type query. Do not create your own instances.
	 *
	 * @param {EntityType}
	 *            oEntityType object for the entity type
	 * @param {object}
	 *            oNodeIDProperty DataJS object for the property holding the
	 *            hierarchy node ID identifying the hierarchy node to which the
	 *            OData entry belongs
	 * @param {object}
	 *            oParentNodeIDProperty DataJS object for the property holding the
	 *            node ID of the parent of the hierarchy node pointed to by the
	 *            value of oNodeIDProperty
	 * @param {object}
	 *            oNodeLevelProperty DataJS object for the property holding the
	 *            level number for the of the hierarchy node pointed to by the value
	 *            of oNodeIDProperty
	 * @param {object}
	 *            oNodeValueProperty DataJS object for the property holding the data
	 *            value for the of the hierarchy node pointed to by the value of
	 *            oNodeIDProperty
	 *
	 * @constructor
	 *
	 * @class Representation of a recursive hierarchy.
	 * @name sap.ui.model.analytics.odata4analytics.RecursiveHierarchy
	 * @public
	 */
	odata4analytics.RecursiveHierarchy = function(oEntityType, oNodeIDProperty, oParentNodeIDProperty, oNodeLevelProperty,
			oNodeValueProperty) {
		this._init(oEntityType, oNodeIDProperty, oParentNodeIDProperty, oNodeLevelProperty, oNodeValueProperty);
	};

	odata4analytics.RecursiveHierarchy.prototype = {
		/**
		 * @private
		 */
		_init : function(oEntityType, oNodeIDProperty, oParentNodeIDProperty, oNodeLevelProperty, oNodeValueProperty) {
			this._oEntityType = oEntityType;

			this._oNodeIDProperty = oNodeIDProperty;
			this._oParentNodeIDProperty = oParentNodeIDProperty;
			this._oNodeLevelProperty = oNodeLevelProperty;
			this._oNodeValueProperty = oNodeValueProperty;

		},

		/**
		 * Get indicator if this is a recursive hierarchy
		 *
		 * @returns {boolean} True
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.RecursiveHierarchy#isRecursiveHierarchy
		 */
		isRecursiveHierarchy : function() {
			return true;
		},

		/**
		 * Get indicator if this is a leveled hierarchy
		 *
		 * @returns {boolean} False
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.RecursiveHierarchy#isLeveledHierarchy
		 */
		isLeveledHierarchy : function() {
			return false;
		},

		/**
		 * Get the property holding the node ID of the hierarchy node
		 *
		 * @returns {object} The DataJS object representing this property
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.RecursiveHierarchy#getNodeIDProperty
		 */
		getNodeIDProperty : function() {
			return this._oNodeIDProperty;
		},

		/**
		 * Get the property holding the parent node ID of the hierarchy node
		 *
		 * @returns {object} The DataJS object representing this property
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.RecursiveHierarchy#getParentNodeIDProperty
		 */
		getParentNodeIDProperty : function() {
			return this._oParentNodeIDProperty;
		},

		/**
		 * Get the property holding the level of the hierarchy node
		 *
		 * @returns {object} The DataJS object representing this property
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.RecursiveHierarchy#getNodeLevelProperty
		 */
		getNodeLevelProperty : function() {
			return this._oNodeLevelProperty;
		},

		/**
		 * Get the property holding the value that is structurally organized by the
		 * hierarchy
		 *
		 * @returns {object} The DataJS object representing this property
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.RecursiveHierarchy#getNodeValueProperty
		 */
		getNodeValueProperty : function() {
			return this._oNodeValueProperty;
		},

		/**
		 * Private member attributes
		 */

		_oNodeIDProperty : null,
		_oParentNodeIDProperty : null,
		_oNodeLevelProperty : null,
		_oNodeValueProperty : null

	};

	/** ******************************************************************** */

	/**
	 * Create a representation of a filter expression for a given entity type. It can be rendered as value for the $filter system
	 * query option.
	 *
	 * @param {object}
	 *            oModel DataJS object for the OData model containing this entity type
	 * @param {object}
	 *            oSchema DataJS object for the schema containing this entity type
	 * @param {sap.ui.model.analytics.odata4analytics.EntityType}
	 *            oEntityType object for the entity type
	 *
	 * @constructor
	 *
	 * @class Representation of a $filter expression for an OData entity type.
	 * @name sap.ui.model.analytics.odata4analytics.FilterExpression
	 * @public
	 */
	odata4analytics.FilterExpression = function(oModel, oSchema, oEntityType) {
		this._init(oModel, oSchema, oEntityType);
	};

	odata4analytics.FilterExpression.prototype = {
		/**
		 * @private
		 */
		_init : function(oModel, oSchema, oEntityType) {
			this._oEntityType = oEntityType;
			this._oSchema = oSchema;
			this._oModel = oModel;

			this._aConditionUI5Filter = [];
			this._aUI5FilterArray = [];
		},

		/**
		 * @private
		 */
		_renderPropertyFilterValue : function(sFilterValue, sPropertyEDMTypeName) {
			// initial implementation called odata4analytics.helper.renderPropertyFilterValue, which had problems with locale-specific input values
			// this is handled in the ODataModel
			return  jQuery.sap.encodeURL(
					this._oModel.getODataModel().formatValue(sFilterValue, sPropertyEDMTypeName));
		},

		/**
		 * Clear expression from any conditions that may have been set previously
		 *
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#clear
		 */
		clear : function() {
			this._aConditionUI5Filter = [];
			this._aUI5FilterArray = [];
		},

		/**
		 * @private
		 */
		_addCondition : function(sProperty, sOperator, oValue1, oValue2) {
			// make sure that the condition is new
			for ( var i = -1, oUI5Filter; (oUI5Filter = this._aConditionUI5Filter[++i]) !== undefined;) {
				if (oUI5Filter.sPath == sProperty && oUI5Filter.sOperator == sOperator && oUI5Filter.oValue1 == oValue1
						&& oUI5Filter.oValue2 == oValue2) {
					return;
				}
			}
			this._aConditionUI5Filter.push(new sap.ui.model.Filter(sProperty, sOperator, oValue1, oValue2));
		},

		/**
		 * @private
		 */
		_addUI5FilterArray : function(aUI5Filter) {
			this._aUI5FilterArray.push(aUI5Filter);
		},

		/**
		 * Add a condition to the filter expression.
		 *
		 * Multiple conditions on the same property are combined with a logical OR first, and in a second step conditions for
		 * different properties are combined with a logical AND.
		 *
		 * @param {string}
		 *            sPropertyName The name of the property bound in the condition
		 * @param {sap.ui.model.FilterOperator}
		 *            sOperator operator used for the condition
		 * @param {object}
		 *            oValue value to be used for this condition
		 * @param {object}
		 *            oValue2 (optional) as second value to be used for this condition
		 * @throws Exception
		 *             if the property is unknown or not filterable
		 * @returns {sap.ui.model.analytics.odata4analytics.FilterExpression} This object for method chaining
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#addCondition
		 */
		addCondition : function(sPropertyName, sOperator, oValue, oValue2) {
			var oProperty = this._oEntityType.findPropertyByName(sPropertyName);
			if (oProperty == null) {
				throw "Cannot add filter condition for unknown property name " + sPropertyName; // TODO
			}
			var aFilterablePropertyNames = this._oEntityType.getFilterablePropertyNames();
			if (jQuery.inArray(sPropertyName,aFilterablePropertyNames) === -1) {
				throw "Cannot add filter condition for not filterable property name " + sPropertyName; // TODO
			}
			this._addCondition(sPropertyName, sOperator, oValue, oValue2);
			return this;
		},

		/**
		 * Remove all conditions for some property from the filter expression.
		 *
		 * All previously set conditions for some property are removed from the filter expression.
		 *
		 * @param {string}
		 *            sPropertyName The name of the property bound in the condition
		 * @throws Exception
		 *             if the property is unknown
		 * @returns {sap.ui.model.analytics.odata4analytics.FilterExpression} This object for method chaining
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#removeConditions
		 */
		removeConditions : function(sPropertyName) {
			var oProperty = this._oEntityType.findPropertyByName(sPropertyName);
			if (oProperty == null) {
				throw "Cannot remove filter conditions for unknown property name " + sPropertyName; // TODO
			}
			for (var i = 0; i < this._aConditionUI5Filter.length; i++) {
				var oUI5Filter = this._aConditionUI5Filter[i];
				if (oUI5Filter.sPath == sPropertyName) {
					this._aConditionUI5Filter.splice(i--, 1);
				}
			}
			return this;
	    },

	    /**
	     * Add a set condition to the filter expression.
	     *
	     * A set condition tests if the value of a property is included in a set of given values. It is a convenience method for
	     * this particular use case eliminating the need for multiple API calls.
	     *
	     * @param {string}
	     *            sPropertyName The name of the property bound in the condition
	     * @param {array}
	     *            aValues values defining the set
	     * @throws Exception
	     *             if the property is unknown or not filterable
	     * @returns {sap.ui.model.analytics.odata4analytics.FilterExpression} This object for method chaining
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#addSetCondition
		 */
		addSetCondition : function(sPropertyName, aValues) {
			var oProperty = this._oEntityType.findPropertyByName(sPropertyName);
			if (oProperty == null) {
				throw "Cannot add filter condition for unknown property name " + sPropertyName; // TODO
			}
			var aFilterablePropertyNames = this._oEntityType.getFilterablePropertyNames();
			if (jQuery.inArray(sPropertyName, aFilterablePropertyNames) === -1) {
				throw "Cannot add filter condition for not filterable property name " + sPropertyName; // TODO
			}
			for ( var i = -1, oValue; (oValue = aValues[++i]) !== undefined;) {
				this._addCondition(sPropertyName, sap.ui.model.FilterOperator.EQ, oValue);
			}
			return this;
		},

		/**
		 * Add an array of UI5 filter conditions to the filter expression.
		 *
		 * The UI5 filter condition is combined with the other given conditions using a logical AND. This method
		 * is particularly useful for passing forward already created UI5 filter arrays.
		 *
		 * @param {array(sap.ui.model.Filter)}
		 *            aUI5Filter Array of UI5 filter objects
		 * @returns {sap.ui.model.analytics.odata4analytics.FilterExpression} This object for method chaining
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#addUI5FilterConditions
		 */
		addUI5FilterConditions : function(aUI5Filter) {
			if (!jQuery.isArray(aUI5Filter)) {
				throw "Argument is not an array";
			}
			if (aUI5Filter.length == 0) {
				return this;
			}

			// check if a multi filter is included; otherwise every element simply represents a single condition
			var bHasMultiFilter = false;
			for (var i = 0; i < aUI5Filter.length; i++) {
						if (aUI5Filter[i].aFilters != undefined) {
							bHasMultiFilter = true;
							break;
						}
			}
			if (bHasMultiFilter) {
				this._addUI5FilterArray(aUI5Filter);
			} else {
				for (var j = 0; j < aUI5Filter.length; j++) {
							this.addCondition(aUI5Filter[j].sPath, aUI5Filter[j].sOperator, aUI5Filter[j].oValue1, aUI5Filter[j].oValue2);
				}
			}
			return this;
		},


		/**
		 * Get an array of SAPUI5 Filter objects corresponding to this expression.
		 *
		 * @returns {array(sap.ui.model.Filter)} List of filter objects representing this expression
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#getExpressionAsUI5FilterArray
		 */
		getExpressionAsUI5FilterArray : function() {
			var aFilterObjects = this._aConditionUI5Filter.concat([]);

			for ( var i = -1, aFilter; (aFilter = this._aUI5FilterArray[++i]) !== undefined;) {
				for ( var j = -1, oFilter; (oFilter = aFilter[++j]) !== undefined;) {
					aFilterObjects.push(oFilter);
				}
			}
			return aFilterObjects;
		},


		/*
		 * @private
		 */
		getPropertiesReferencedByUI5FilterArray : function(aUI5Filter, oReferencedProperties) {
			for ( var i = -1, oUI5Filter; (oUI5Filter = aUI5Filter[++i]) !== undefined;) {
				if (oUI5Filter.aFilters != undefined) {
					this.getPropertiesReferencedByUI5FilterArray(oUI5Filter.aFilters, oReferencedProperties);
				} else {
					if (oReferencedProperties[oUI5Filter.sPath] == undefined) {
						oReferencedProperties[oUI5Filter.sPath] = [];
					}
					oReferencedProperties[oUI5Filter.sPath].push(oUI5Filter);
				}
			}
		},


		/**
		 * Get the properties referenced by the filter expression.
		 *
		 * @returns {object} Object containing (JavaScript) properties for all (OData entity type)
		 *          properties referenced in the filter expression. The value for each of these properties is an array holding all used UI5 filters referencing them.
		 * @private
		 */
		getReferencedProperties : function() {
			var oReferencedProperties = {};

			for ( var i = -1, oUI5Filter; (oUI5Filter = this._aConditionUI5Filter[++i]) !== undefined;) {
				if (oReferencedProperties[oUI5Filter.sPath] == undefined) {
					oReferencedProperties[oUI5Filter.sPath] = [];
				}
				oReferencedProperties[oUI5Filter.sPath].push(oUI5Filter);
			}

			for ( var j = -1, aUI5Filter; (aUI5Filter = this._aUI5FilterArray[++j]) !== undefined;) {
				this.getPropertiesReferencedByUI5FilterArray(aUI5Filter, oReferencedProperties);
			}
			return oReferencedProperties;
		},

		/**
		 * Render a UI5 Filter as OData condition.
		 *
		 * @param {string} oUI5Filter The filter object to render (must not be a multi filter)
		 * @returns {string} The $filter value for the given UI5 filter
		 * @private
		 */
		renderUI5Filter : function(oUI5Filter) {
			var oProperty = this._oEntityType.findPropertyByName(oUI5Filter.sPath);
			if (oProperty == null) {
				throw "Cannot add filter condition for unknown property name " + oUI5Filter.sPath; // TODO
			}

			var sFilterExpression = null;
			switch (oUI5Filter.sOperator) {
			case sap.ui.model.FilterOperator.BT:
				sFilterExpression = "(" + oUI5Filter.sPath + " "
						+ sap.ui.model.FilterOperator.GE.toLowerCase() + " "
						+ this._renderPropertyFilterValue(oUI5Filter.oValue1, oProperty.type)
						+ " and " + oUI5Filter.sPath + " " + sap.ui.model.FilterOperator.LE.toLowerCase() + " "
						+ this._renderPropertyFilterValue(oUI5Filter.oValue2, oProperty.type)
						+ ")";
				break;
			case sap.ui.model.FilterOperator.Contains:
				sFilterExpression = "substringof("
								+ this._renderPropertyFilterValue(oUI5Filter.oValue1, "Edm.String") + "," +  oUI5Filter.sPath + ")";
				break;
			case sap.ui.model.FilterOperator.StartsWith:
			case sap.ui.model.FilterOperator.EndsWith:
				sFilterExpression = oUI5Filter.sOperator.toLowerCase() + "("
						+ oUI5Filter.sPath + ","
						+ this._renderPropertyFilterValue(oUI5Filter.oValue1, "Edm.String") + ")";
				break;
			default:
				sFilterExpression = oUI5Filter.sPath + " " + oUI5Filter.sOperator.toLowerCase() + " "
						+ this._renderPropertyFilterValue(oUI5Filter.oValue1, oProperty.type);
			}

			return sFilterExpression;
		},

		/*
		 * @private
		 */
		renderUI5MultiFilter : function(oUI5MultiFilter) {
			var aUI5MultiFilter = [];

			var sOptionString = "";
			var sLogicalMultiOperator = oUI5MultiFilter.bAnd == true ? " and " : " or ";

			for (var i = -1, oUI5Filter; (oUI5Filter = oUI5MultiFilter.aFilters[++i]) !== undefined;) {
				if (oUI5Filter.aFilters != undefined) { // defer processing to the end
					aUI5MultiFilter.push(oUI5Filter);
					continue;
				}

				sOptionString += (sOptionString == "" ? "" : sLogicalMultiOperator) + "(" + this.renderUI5Filter(oUI5Filter) + ")";
			}
			// process multi filters if any
			if (aUI5MultiFilter.length > 0) {
				for (var j = -1, oMultiFilter; (oMultiFilter = aUI5MultiFilter[++j]) !== undefined;) {
					sOptionString += (sOptionString == "" ? "" : sLogicalMultiOperator) + "(" + this.renderUI5MultiFilter(oMultiFilter) + ")";
				}
			}
			return sOptionString;
		},

		/*
		 * @private
		 */
		renderUI5FilterArray : function(aUI5Filter) {
			if (aUI5Filter.length == 0) {
				return "";
			}

			var sOptionString = "";
			// 1. Process conditions
			aUI5Filter.sort(function(a, b) {
				if (a.sPath == b.sPath) {
					return 0;
				}
				if (a.sPath > b.sPath) {
					return 1;
				} else {
					return -1;
				}
			});

			var sPropertyName = aUI5Filter[0].sPath;
			var sSubExpression = "";
			var aNEFilter = [], aUI5MultiFilter = [];
			for ( var i = -1, oUI5Filter; (oUI5Filter = aUI5Filter[++i]) !== undefined;) {
				if (oUI5Filter.aFilters != undefined) { // defer processing to the end
					aUI5MultiFilter.push(oUI5Filter);
					continue;
				}
				if (sPropertyName != oUI5Filter.sPath) {
								if (sSubExpression != "") {
									sOptionString += (sOptionString == "" ? "" : " and ") + "(" + sSubExpression + ")";
								}
					sSubExpression = "";
					if (aNEFilter.length > 0) { // handle negated comparisons
						for (var j = -1, oNEFilter; (oNEFilter = aNEFilter[++j]) !== undefined;) {
							sSubExpression += (sSubExpression == "" ? "" : " and ") + this.renderUI5Filter(oNEFilter);
						}
						sOptionString += (sOptionString == "" ? "" : " and ") + "(" + sSubExpression + ")";
						sSubExpression = "";
					}
					sPropertyName = oUI5Filter.sPath;
					aNEFilter = [];
				}
				if (oUI5Filter.sOperator == sap.ui.model.FilterOperator.NE) {
					aNEFilter.push(oUI5Filter);
					continue;
				}
				sSubExpression += (sSubExpression == "" ? "" : " or ") + this.renderUI5Filter(oUI5Filter);
			}

			// add last sub expression
			if (sSubExpression != "") {
				sOptionString += (sOptionString == "" ? "" : " and ") + "(" + sSubExpression + ")";
			}
			if (aNEFilter.length > 0) { // handle negated comparisons
                sSubExpression = "";
				for (var k = -1, oNEFilter2; (oNEFilter2 = aNEFilter[++k]) !== undefined;) {
					sSubExpression += (sSubExpression == "" ? "" : " and ") + this.renderUI5Filter(oNEFilter2);
				}
				sOptionString += (sOptionString == "" ? "" : " and ") + "(" + sSubExpression + ")";
			}

			// process multi filters if any
			if (aUI5MultiFilter.length > 0) {
				for (var l = -1, oMultiFilter; (oMultiFilter = aUI5MultiFilter[++l]) !== undefined;) {
					sOptionString += (sOptionString == "" ? "" : " and ") + "(" + this.renderUI5MultiFilter(oMultiFilter) + ")";
				}
			}
			return sOptionString;
		},

		/**
		 * Get the value for the OData system query option $filter corresponding to this expression.
		 *
		 * @returns {string} The $filter value for the filter expression
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#getURIFilterOptionValue
		 */
		getURIFilterOptionValue : function() {
			var sOptionString = this.renderUI5FilterArray(this._aConditionUI5Filter);
			for (var i = -1, aUI5Filter; (aUI5Filter = this._aUI5FilterArray[++i]) !== undefined; ) {
				sOptionString += (sOptionString == "" ? "" : " and ") + "(" + this.renderUI5FilterArray(aUI5Filter) + ")";
			}
			return sOptionString;
		},

		/**
		 * Check if request is compliant with basic filter constraints expressed in metadata:
		 *
		 * (a) all properties required in the filter expression have been referenced (b) the single-value filter restrictions have been obeyed
		 *
		 * @returns {boolean} The value true. In case the expression violates some of the rules, an exception with some explanatory
		 *          message is thrown
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#checkValidity
		 */
		checkValidity : function() {
			// (a) all properties required in the filter expression have been referenced
			var aRequiredFilterPropertyNames = this._oEntityType.getRequiredFilterPropertyNames();
			var oPropertiesInFilterExpression = this.getReferencedProperties();
			for ( var i = -1, sPropertyName; (sPropertyName = aRequiredFilterPropertyNames[++i]) !== undefined;) {
				if (oPropertiesInFilterExpression[sPropertyName] == undefined) {
					throw "filter expression does not contain required property " + sPropertyName; // TODO
				}
			}
			// (b) basic filter restrictions have been obeyed
			var oPropertyFilterRestrictionSet = this._oEntityType.getPropertiesWithFilterRestrictions();
			for ( var sPropertyName2 in oPropertyFilterRestrictionSet) {
				var sFilterRestriction = oPropertyFilterRestrictionSet[sPropertyName2];

				if (sFilterRestriction == odata4analytics.EntityType.propertyFilterRestriction.SINGLE_VALUE) {
					if (oPropertiesInFilterExpression[sPropertyName2] != undefined) {
						if (oPropertiesInFilterExpression[sPropertyName2].length > 1) {
							// check if all filter instances of the current property have the same single value
							var vTheOnlyValue = oPropertiesInFilterExpression[sPropertyName2][0].oValue1;
							for (var j = 0; j < oPropertiesInFilterExpression[sPropertyName2].length; j++) {
								// check if we have a value change, this means we got another value in one of the filters
								if (oPropertiesInFilterExpression[sPropertyName2][j].oValue1 != vTheOnlyValue
									|| oPropertiesInFilterExpression[sPropertyName2][j].sOperator != sap.ui.model.FilterOperator.EQ) {
									throw "filter expression may use " + sPropertyName2 + " only with a single EQ condition";
								}
							}
						}
					}
				}
			}
			return true;
		},

		/**
		 * Get description for this entity type
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.EntityType} The object representing the entity type
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.FilterExpression#getEntityType
		 */
		getEntityType : function() {
			return this._oEntityType;
		},

		getSchema : function() {
			return this._oSchema;
		},

		getModel : function() {
			return this._oModel;
		},

		/**
		 * Private member attributes
		 */

		_oEntityType : null,
		_oSchema : null,
		_oModel : null,

		_aFilterCondition : null
	};

	/** ******************************************************************** */

	/**
	 * @class Sort order of a property
	 * @name sap.ui.model.analytics.odata4analytics.SortOrder
	 *
	 * @static
	 * @public
	 */
	odata4analytics.SortOrder = {

		/**
		 * Sort Order: ascending.
		 *
		 * @public
		 */
		Ascending : "asc",

		/**
		 * Sort Order: descending.
		 *
		 * @public
		 */
		Descending : "desc"

	};

	/** ******************************************************************** */

	/**
	 * Create a representation of an order by expression for a given entity type. It
	 * can be rendered as value for the $orderby system query option.
	 *
	 * @param {object}
	 *            oModel DataJS object for the OData model containing this entity
	 *            type
	 * @param {object}
	 *            oSchema DataJS object for the schema containing this entity type
	 * @param {sap.ui.model.analytics.odata4analytics.EntityType}
	 *            oEntityType object for the entity type
	 *
	 * @constructor
	 *
	 * @class Representation of a $orderby expression for an OData entity type.
	 * @name sap.ui.model.analytics.odata4analytics.SortExpression
	 * @public
	 */
	odata4analytics.SortExpression = function(oModel, oSchema, oEntityType) {
		this._init(oModel, oSchema, oEntityType);
	};

	odata4analytics.SortExpression.prototype = {
		/**
		 * @private
		 */
		_init : function(oModel, oSchema, oEntityType) {
			this._oEntityType = oEntityType;
			this._oSchema = oSchema;
			this._oModel = oModel;

			this._aSortCondition = [];
		},

		/**
		 * Checks if an order by expression for the given property is already
		 * defined and returns a reference to an object with property sorter and
		 * index of the object or null if the property is not yet defined in an
		 * order by expression.
		 *
		 * @private
		 */
		_containsSorter : function(sPropertyName) {
			var oResult = null;
			for (var i = -1, oCurrentSorter; (oCurrentSorter = this._aSortCondition[++i]) !== undefined;) {
				if (oCurrentSorter.property.name === sPropertyName) {
					oResult = {
						sorter : oCurrentSorter,
						index : i
					};
					break;
				}
			}
			return oResult;
		},

		/**
		 * TODO helper method to remove elements from array
		 *
		 * @private
		 */
		_removeFromArray : function(array, from, to) {
			var rest = array.slice((to || from) + 1 || array.length);
			array.length = from < 0 ? array.length + from : from;
			return array.push.apply(array, rest);
		},

		/**
		 * Clear expression from any sort conditions that may have been set
		 * previously
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.SortExpression#clear
		 */
		clear : function() {
			this._aSortCondition = [];
		},

		/**
		 * Add a condition to the order by expression. It replaces any previously specified
		 * sort order for the property.
		 *
		 * @param {string}
		 *            sPropertyName The name of the property bound in the condition
		 * @param {sap.ui.model.analytics.odata4analytics.SortOrder}
		 *            sSortOrder sorting order used for the condition
		 * @throws Exception
		 *             if the property is unknown, not sortable or already added as
		 *             sorter
		 * @returns {sap.ui.model.analytics.odata4analytics.SortExpression} This object for method
		 *          chaining
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.SortExpression#addSorter
		 */
		addSorter : function(sPropertyName, sSortOrder) {
			var oProperty = this._oEntityType.findPropertyByName(sPropertyName);
			if (oProperty == null) {
				throw "Cannot add sort condition for unknown property name " + sPropertyName; // TODO
			}
			var oExistingSorterEntry = this._containsSorter(sPropertyName);
			if (oExistingSorterEntry != null) {
				oExistingSorterEntry.sorter.order = sSortOrder;
				return this;
			}
			var aSortablePropertyNames = this._oEntityType.getSortablePropertyNames();
			if (jQuery.inArray(sPropertyName, aSortablePropertyNames) === -1) {
				throw "Cannot add sort condition for not sortable property name " + sPropertyName; // TODO
			}

			this._aSortCondition.push({
				property : oProperty,
				order : sSortOrder
			});
			return this;
		},

		/**
		 * Removes the order by expression for the given property name from the list
		 * of order by expression. If no order by expression with this property name
		 * exists the method does nothing.
		 *
		 * @param {string}
		 *            sPropertyName The name of the property to be removed from the
		 *            condition
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.SortExpression#removeSorter
		 */
		removeSorter : function(sPropertyName) {
			if (!sPropertyName) {
				return;
			}

			var oSorter = this._containsSorter(sPropertyName);
			if (oSorter) {
				this._removeFromArray(this._aSortCondition, oSorter.index);
			}
		},

		/**
		 * Get an array of SAPUI5 Sorter objects corresponding to this expression.
		 *
		 * @returns {array(sap.ui.model.Sorter)} List of sorter objects representing
		 *          this expression
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.SortExpression#getExpressionsAsUI5SorterArray
		 */
		getExpressionsAsUI5SorterArray : function() {
			var aSorterObjects = [];

			for (var i = -1, oCondition; (oCondition = this._aSortCondition[++i]) !== undefined;) {
				aSorterObjects.push(new sap.ui.model.Sorter(oCondition.property.name,
						oCondition.order == odata4analytics.SortOrder.Descending));
			}

			return aSorterObjects;
		},

		/**
		 * Get the first SAPUI5 Sorter object.
		 *
		 * @returns {sap.ui.model.Sorter} first sorter object or null if empty
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.SortExpression#getExpressionAsUI5Sorter
		 */
		getExpressionAsUI5Sorter : function() {
			var aSortArray = this.getExpressionsAsUI5SorterArray();
			if (aSortArray.length == 0) {
				return null;
			} else {
				return aSortArray[0];
			}
		},

		/**
		 * Get the value for the OData system query option $orderby corresponding to
		 * this expression.
		 *
		 * @param {object} oSelectedPropertyNames Object with properties requested for $select
		 *
		 * @returns {string} The $orderby value for the sort expressions
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.SortExpression#getURIOrderByOptionValue
		 */
		getURIOrderByOptionValue : function(oSelectedPropertyNames) {
			if (this._aSortCondition.length == 0) {
				return "";
			}

			var sOrderByOptionString = "";
			for (var i = -1, oCondition; (oCondition = this._aSortCondition[++i]) !== undefined;) {
				if (!oSelectedPropertyNames[oCondition.property.name]) {
					continue; // sorting of aggregated entities is meaningful only if the sorted property is also selected
				}
				sOrderByOptionString += (sOrderByOptionString == "" ? "" : ",") + oCondition.property.name + " " + oCondition.order;
			}

			return sOrderByOptionString;
		},

		/**
		 * Get description for this entity type
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.EntityType} The object representing the
		 *          entity type
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.SortExpression#getEntityType
		 */
		getEntityType : function() {
			return this._oEntityType;
		},

		getSchema : function() {
			return this._oSchema;
		},

		getModel : function() {
			return this._oModel;
		},

		/**
		 * Private member attributes
		 */

		_oEntityType : null,
		_oSchema : null,
		_oModel : null,

		_aSortCondition : null
	};

	/** ******************************************************************** */

	/**
	 * Create a request object for interaction with a query parameterization.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.Parameterization}
	 *            oParameterization Description of a query parameterization
	 *
	 * @constructor
	 *
	 * @class Creation of URIs for query parameterizations.
	 * @name sap.ui.model.analytics.odata4analytics.ParameterizationRequest
	 * @public
	 */
	odata4analytics.ParameterizationRequest = function(oParameterization) {
		this._init(oParameterization);
	};

	odata4analytics.ParameterizationRequest.prototype = {
		/**
		 * @private
		 */
		_init : function(oParameterization) {
			if (!oParameterization) {
				throw "No parameterization given"; // TODO
			}
			this._oParameterization = oParameterization;
			this._oParameterValueAssignment = [];
		},

		/**
		 * @private
		 */
		_renderParameterKeyValue : function(sKeyValue, sPropertyEDMTypeName) {
			// initial implementation called odata4analytics.helper.renderPropertyKeyValue, which had problems with locale-specific input values
			// this is handled in the ODataModel

			// TODO refactor with corresponding method FilterExpression._renderPropertyFilterValue
			return  jQuery.sap.encodeURL(
					this._oParameterization.getTargetQueryResult().getModel().getODataModel().formatValue(sKeyValue, sPropertyEDMTypeName));
		},

		/**
		 * Get the description of the parameterization on which this request
		 * operates on
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.Parameterization} Description of a
		 *          query parameterization
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterizationRequest#getParameterization
		 */
		getParameterization : function() {
			return this._oParameterization;
		},

		/**
		 * Assign a value to a parameter
		 *
		 * @param {String}
		 *            sParameterName Name of the parameter. In case of a range
		 *            value, provide the name of the lower boundary parameter.
		 * @param {String}
		 *            sValue Assigned value. Pass null to remove a value assignment.
		 * @param {String}
		 *            sToValue Omit it or set it to null for single values. If set,
		 *            it will be assigned to the upper boundary parameter
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterizationRequest#setParameterValue
		 */
		setParameterValue : function(sParameterName, sValue, sToValue) {
			var oParameter = this._oParameterization.findParameterByName(sParameterName);
			if (!oParameter) {
				throw "Invalid parameter name " + sParameterName; // TODO improve
			}
			// error handling
			if (sToValue != null) {
				if (!oParameter.isIntervalBoundary()) {
					// TODO improve error handling
					throw "Range value cannot be applied to parameter " + sParameterName + " accepting only single values"; // TODO
				}
				if (!oParameter.isLowerIntervalBoundary()) {
					// TODO improve error handling
					throw "Range value given, but parameter " + sParameterName + " does not hold the lower boundary"; // TODO
				}
			}
			if (!oParameter.isIntervalBoundary()) {
				if (sValue == null) {
					delete this._oParameterValueAssignment[sParameterName];
				} else {
					this._oParameterValueAssignment[sParameterName] = sValue;
				}
			} else {
				if (sValue == null && sToValue != null) {
					throw "Parameter " + sParameterName + ": An upper boundary cannot be given without the lower boundary"; // TODO
				}
				if (sValue == null) {
					delete this._oParameterValueAssignment[sParameterName];
					sToValue = null;
				} else {
					this._oParameterValueAssignment[sParameterName] = sValue;
				}
				var oUpperBoundaryParameter = oParameter.getPeerIntervalBoundaryParameter();
				if (sToValue == null) {
					sToValue = sValue;
				}
				if (sValue == null) {
					delete this._oParameterValueAssignment[oUpperBoundaryParameter.getName()];
				} else {
					this._oParameterValueAssignment[oUpperBoundaryParameter.getName()] = sToValue;
				}
			}
			return;
		},

		/**
		 * Get the URI to locate the entity set for the query parameterization.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 * @returns The resource path of the URI pointing to the entity set. It is a
		 *          relative URI unless a service root is given, which would then
		 *          prefixed in order to return a complete URL.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterizationRequest#getURIToParameterizationEntitySet
		 */
		getURIToParameterizationEntitySet : function(sServiceRootURI) {
			return (sServiceRootURI ? sServiceRootURI : "") + "/" + this._oParameterization.getEntitySet().getQName();
		},

		/**
		 * Get the URI to locate the parameterization entity for the values assigned
		 * to all parameters beforehand. Notice that a value must be supplied for
		 * every parameter including those marked as optional. For optional
		 * parameters, assign the special value that the service provider uses as an
		 * "omitted" value. For example, for services based on BW Easy Queries, this
		 * would be an empty string.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 * @returns The resource path of the URI pointing to the entity set. It is a
		 *          relative URI unless a service root is given, which would then
		 *          prefixed in order to return a complete URL.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterizationRequest#getURIToParameterizationEntry
		 */
		getURIToParameterizationEntry : function(sServiceRootURI) {
			var oDefinedParameters = this._oParameterization.getAllParameters();
			for ( var sDefinedParameterName in oDefinedParameters) {
				// check that all parameters have a value assigned. This is also
				// true for those marked as optional, because the
				// omitted value is conveyed by some default value, e.g. as empty
				// string.
				if (this._oParameterValueAssignment[sDefinedParameterName] == undefined) {
					throw "Parameter " + sDefinedParameterName + " has no value assigned"; // TODO
				}
			}
			var sKeyIdentification = "", bFirst = true;
			for ( var sParameterName in this._oParameterValueAssignment) {
				sKeyIdentification += (bFirst ? "" : ",")
						+ sParameterName
						+ "="
						+ this._renderParameterKeyValue(this._oParameterValueAssignment[sParameterName],
								oDefinedParameters[sParameterName].getProperty().type);
				bFirst = false;
			}

			return (sServiceRootURI ? sServiceRootURI : "") + "/" + this._oParameterization.getEntitySet().getQName() + "("
					+ sKeyIdentification + ")";
		},

		/**
		 * Private member attributes
		 */
		_oParameterization : null,
		_oParameterValueAssignment : null

	};

	/** ******************************************************************** */

	/**
	 * Create a request object for interaction with a query result.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.QueryResult}
	 *            oQueryResult Description of a query parameterization
	 * @param {sap.ui.model.analytics.odata4analytics.ParameterizationRequest}
	 *            [oParameterizationRequest] Request object for
	 *            interactions with the parameterization of this query. Only
	 *            required if the query service includes parameters.
	 *
	 * @constructor
	 *
	 * @class Creation of URIs for fetching query results.
	 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest
	 * @public
	 */
	odata4analytics.QueryResultRequest = function(oQueryResult, oParameterizationRequest) {
		this._init(oQueryResult);
	};

	odata4analytics.QueryResultRequest.prototype = {
		/**
		 * @private
		 */
		_init : function(oQueryResult, oParameterizationRequest) {
			this._oQueryResult = oQueryResult;
			this._oParameterizationRequest = oParameterizationRequest;
			this._oAggregationLevel = {};
			this._oMeasures = {};
			this._bIncludeEntityKey = false;
			this._oFilterExpression = null;
			this._oSortExpression = null;
			this._oSelectedPropertyNames = null;
		},

		/**
		 * Set the parameterization request required for interactions with the query
		 * result of parameterized queries. This method provides an alternative way
		 * to assign a parameterization request to a query result request.
		 *
		 * @param oParameterizationRequest
		 *            Request object for interactions with the parameterization of
		 *            this query
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setParameterizationRequest
		 */
		setParameterizationRequest : function(oParameterizationRequest) {
			this._oParameterizationRequest = oParameterizationRequest;
		},

		/**
		 * Set the resource path to be considered for the OData request URI of this
		 * query request object. This method provides an alternative way to assign a
		 * path comprising a parameterization. If a path is provided, it overwrites
		 * any parameterization object that might have been specified separately.
		 *
		 * @param sResourcePath
		 *            Resource path pointing to the entity set of the query result.
		 *            Must include a valid parameterization if query contains
		 *            parameters.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setResourcePath
		 */
		setResourcePath : function(sResourcePath) {
			this._sResourcePath = sResourcePath;
			if (this._sResourcePath.indexOf("/") != 0) {
				throw "Missing leading / (slash) for resource path";
			}
			if (this._oQueryResult.getParameterization()) {
				var iLastPathSep = sResourcePath.lastIndexOf("/");
				if (iLastPathSep == -1) {
					throw "Missing navigation from parameter entity set to query result in resource path";
				}
				var sNavPropName = sResourcePath.substring(iLastPathSep + 1);
				if (sNavPropName != this._oQueryResult.getParameterization().getNavigationPropertyToQueryResult()) {
					throw "Invalid navigation property from parameter entity set to query result in resource path";
				}
			}
		},

		/**
		 * Retrieves the current parametrization request
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.ParametrizationRequest}
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getParameterizationRequest
		 */
		getParameterizationRequest : function() {
			return this._oParameterizationRequest;
		},

		/**
		 * Get the description of the query result on which this request operates on
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.QueryResult} Description of a query
		 *          result
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getQueryResult
		 */
		getQueryResult : function() {
			return this._oQueryResult;
		},

		/**
		 * Set the aggregation level for the query result request. By default, the
		 * query result will include the properties holding the keys of the given
		 * dimensions. This setting can be changed using
		 * includeDimensionKeyTextAttributes.
		 *
		 * @param aDimensionName
		 *            Array of dimension names to be part of the aggregation level.
		 *            If null, the aggregation level includes all dimensions, if
		 *            empty, no dimension is included.
		 *
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setAggregationLevel
		 */
		setAggregationLevel : function(aDimensionName) {
			this._oAggregationLevel = {};
			if (!aDimensionName) {
				aDimensionName = this._oQueryResult.getAllDimensionNames();
			}
			this.addToAggregationLevel(aDimensionName);
			this._oSelectedPropertyNames = null; // reset previously compiled list of selected properties
		},

		/**
		 * Add one or more dimensions to the aggregation level
		 *
		 * @param aDimensionName
		 *            Array of dimension names to be added to the already defined
		 *            aggregation level.
		 *
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#addToAggregationLevel
		 */
		addToAggregationLevel : function(aDimensionName) {
			if (!aDimensionName) {
				return;
			}

			this._oSelectedPropertyNames = null; // reset previously compiled list of selected properties

			for (var i = -1, sDimName; (sDimName = aDimensionName[++i]) !== undefined;) {
				if (!this._oQueryResult.findDimensionByName(sDimName)) {
					throw sDimName + " is not a valid dimension name"; // TODO
				}
				this._oAggregationLevel[sDimName] = {
					key : true,
					text : false,
					attributes : null
				};
			}
		},

		/**
		 * Remove one or more dimensions from the aggregation level. The method also
		 * removed a potential sort expression on the dimension.
		 *
		 * @param aDimensionName
		 *            Array of dimension names to be removed from the already
		 *            defined aggregation level.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#removeFromAggregationLevel
		 */
		removeFromAggregationLevel : function(aDimensionName) {
			if (!aDimensionName) {
				return;
			}
			this._oSelectedPropertyNames = null; // reset previously compiled list of selected properties

			for (var i = -1, sDimName; (sDimName = aDimensionName[++i]) !== undefined;) {
				if (!this._oQueryResult.findDimensionByName(sDimName)) {
					throw sDimName + " is not a valid dimension name"; // TODO
				}
				if (this._oAggregationLevel[sDimName] != undefined) {
					delete this._oAggregationLevel[sDimName];

					// remove potential sort expression on this dimension
					this.getSortExpression().removeSorter(sDimName);
				}
			}
		},

		/**
		 * Get the names of the dimensions included in the aggregation level
		 *
		 * @returns {Array} The dimension names included in the aggregation level
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getAggregationLevel
		 */
		getAggregationLevel : function() {
			var aDimName = [];
			for ( var sDimName in this._oAggregationLevel) {
				aDimName.push(sDimName);
			}
			return aDimName;
		},

		/**
		 * Get details about a dimensions included in the aggregation level
		 *
		 * @param sDImensionName
		 *            Name of a dimension included in the aggregation level of this
		 *            request, for which details shall be returned
		 *
		 * @returns {object} An object with three properties named key and text,
		 *          both with Boolean values indicating whether the key and text of
		 *          this dimension are included in this request. The third property
		 *          named attributes is an array of attribute names of this
		 *          dimension included in this request, or null, if there are none.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getAggregationLevelDetails
		 */
		getAggregationLevelDetails : function(sDimensionName) {
			if (this._oAggregationLevel[sDimensionName] == undefined) {
				throw "Aggregation level does not include dimension " + sDimensionName;
			}
			return this._oAggregationLevel[sDimensionName];
		},

		/**
		 * Set the measures to be included in the query result request. By default,
		 * the query result will include the properties holding the raw values of
		 * the given measures. This setting can be changed using
		 * includeMeasureRawFormattedValueUnit.
		 *
		 * @param aMeasureName
		 *            Array of measure names to be part of the query result request.
		 *            If null, the request includes all measures, if empty, no
		 *            measure is included.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setMeasures
		 */
		setMeasures : function(aMeasureName) {
			if (!aMeasureName) {
				aMeasureName = this._oQueryResult.getAllMeasureNames();
			}
			this._oSelectedPropertyNames = null; // reset previously compiled list of selected properties

			this._oMeasures = {};
			for (var i = -1, sMeasName; (sMeasName = aMeasureName[++i]) !== undefined;) {
				if (!this._oQueryResult.findMeasureByName(sMeasName)) {
					throw sMeasName + " is not a valid measure name"; // TODO
				}

				this._oMeasures[sMeasName] = {
					value : true,
					text : false,
					unit : false
				};
			}
		},

		/**
		 * Get the names of the measures included in the query result request
		 *
		 * @returns {Array} The measure names included in the query result request
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getMeasureNames
		 */
		getMeasureNames : function() {
			var aMeasName = [];
			for ( var sMeasName in this._oMeasures) {
				aMeasName.push(sMeasName);
			}
			return aMeasName;
		},

		/**
		 * Specify which dimension components shall be included in the query result.
		 * The settings get applied to the currently defined aggregation level.
		 *
		 * @param sDimensionName
		 *            Name of the dimension for which the settings get applied.
		 *            Specify null to apply the settings to all dimensions in the
		 *            aggregation level.
		 * @param bIncludeKey
		 *            Indicator whether or not to include the dimension key in the
		 *            query result. Pass null to keep current setting.
		 * @param bIncludeText
		 *            Indicator whether or not to include the dimension text (if
		 *            available) in the query result. Pass null to keep current
		 *            setting.
		 * @param aAttributeName
		 *            Array of dimension attribute names to be included in the
		 *            result. Pass null to keep current setting. This argument is
		 *            ignored if sDimensionName is null.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#includeDimensionKeyTextAttributes
		 */
		includeDimensionKeyTextAttributes : function(sDimensionName, bIncludeKey, bIncludeText, aAttributeName) {
			this._oSelectedPropertyNames = null; // reset previously compiled list of selected properties

			var aDimName = [];
			if (sDimensionName) {
				if (this._oAggregationLevel[sDimensionName] == undefined) {
					throw sDimensionName + " is not included in the aggregation level";
				}
				aDimName.push(sDimensionName);
			} else {
				for ( var sName in this._oAggregationLevel) {
					aDimName.push(sName);
				}
				aAttributeName = null;
			}
			for (var i = -1, sDimName; (sDimName = aDimName[++i]) !== undefined;) {
				if (bIncludeKey != null) {
					this._oAggregationLevel[sDimName].key = bIncludeKey;
				}
				if (bIncludeText != null) {
					this._oAggregationLevel[sDimName].text = bIncludeText;
				}
				if (aAttributeName != null) {
					this._oAggregationLevel[sDimName].attributes = aAttributeName;
				}
			}
		},

		/**
		 * Specify which measure components shall be included in the query result.
		 * The settings get applied to the currently set measures.
		 *
		 * @param sMeasureName
		 *            Name of the measure for which the settings get applied.
		 *            Specify null to apply the settings to all currently set
		 *            measures.
		 * @param bIncludeRawValue
		 *            Indicator whether or not to include the raw value in the query
		 *            result. Pass null to keep current setting.
		 * @param bIncludeFormattedValue
		 *            Indicator whether or not to include the formatted value (if
		 *            available) in the query result. Pass null to keep current
		 *            setting.
		 * @param bIncludeUnit
		 *            Indicator whether or not to include the unit (if available) in
		 *            the query result. Pass null to keep current setting.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#includeMeasureRawFormattedValueUnit
		 */
		includeMeasureRawFormattedValueUnit : function(sMeasureName, bIncludeRawValue, bIncludeFormattedValue, bIncludeUnit) {
			this._oSelectedPropertyNames = null; // reset previously compiled list of selected properties

			var aMeasName = [];
			if (sMeasureName) {
				if (this._oMeasures[sMeasureName] == undefined) {
					throw sMeasureName + " is not part of the query result";
				}
				aMeasName.push(sMeasureName);
			} else {
				for ( var sName in this._oMeasures) {
					aMeasName.push(sName);
				}
			}
			for (var i = -1, sMeasName; (sMeasName = aMeasName[++i]) !== undefined;) {
				if (bIncludeRawValue != null) {
					this._oMeasures[sMeasName].value = bIncludeRawValue;
				}
				if (bIncludeFormattedValue != null) {
					this._oMeasures[sMeasName].text = bIncludeFormattedValue;
				}
				if (bIncludeUnit != null) {
					this._oMeasures[sMeasName].unit = bIncludeUnit;
				}
			}
		},

		/**
		 * Get the filter expression for this request.
		 *
		 * Expressions are represented by separate objects. If none exists so far, a
		 * new expression object gets created.
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.FilterExpression} The filter object
		 *          associated to this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getFilterExpression
		 */
		getFilterExpression : function() {
			if (this._oFilterExpression == null) {
				var oEntityType = this._oQueryResult.getEntityType();
				this._oFilterExpression = new odata4analytics.FilterExpression(this._oQueryResult.getModel(), oEntityType
						.getSchema(), oEntityType);
			}
			return this._oFilterExpression;
		},

		/**
		 * Set the filter expression for this request.
		 *
		 * Expressions are represented by separate objects. Calling this method
		 * replaces the filter object maintained by this request.
		 *
		 * @param {sap.ui.model.analytics.odata4analytics.FilterExpression}
		 *            oFilter The filter object to be associated with this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setFilterExpression
		 */
		setFilterExpression : function(oFilter) {
			this._oFilterExpression = oFilter;
		},

		/**
		 * Get the sort expression for this request.
		 *
		 * Expressions are represented by separate objects. If none exists so far, a
		 * new expression object gets created.
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.SortExpression} The sort object
		 *          associated to this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getSortExpression
		 */
		getSortExpression : function() {
			if (this._oSortExpression == null) {
				var oEntityType = this._oQueryResult.getEntityType();
				this._oSortExpression = new odata4analytics.SortExpression(oEntityType.getModel(), oEntityType.getSchema(),
						oEntityType);
			}
			return this._oSortExpression;
		},

		/**
		 * Set the sort expression for this request.
		 *
		 * Expressions are represented by separate objects. Calling this method
		 * replaces the sort object maintained by this request.
		 *
		 * @param {sap.ui.model.analytics.odata4analytics.SortExpression}
		 *            oSorter The sort object to be associated with this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setSortExpression
		 */
		setSortExpression : function(oSorter) {
			this._oSortExpression = oSorter;
		},

		/**
		 * Set further options to be applied for the OData request to fetch the
		 * query result
		 *
		 * @param {Boolean}
		 *            bIncludeEntityKey Indicates whether or not the entity key
		 *            should be returned for every entry in the query result.
		 *            Default is not to include it. Pass null to keep current
		 *            setting.
		 * @param {Boolean}
		 *            bIncludeCount Indicates whether or not the result shall
		 *            include a count for the returned entities. Default is not to
		 *            include it. Pass null to keep current setting.
		 * @param {Boolean}
		 *            bReturnNoEntities Indicates whether or not the result shall
		 *            be empty. This will translate to $top=0 in the OData request and override
		 *            any setting done with setResultPageBoundaries. The default is not to
		 *            suppress entities in the result. Pass null to keep current setting. 
		 *            The main use case for this option is to create a request
		 *            with $inlinecount returning an entity count.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setRequestOptions
		 */
		setRequestOptions : function(bIncludeEntityKey, bIncludeCount, bReturnNoEntities) {
			if (bIncludeEntityKey != null) {
				this._bIncludeEntityKey = bIncludeEntityKey;
			}
			if (bIncludeCount != null) {
				this._bIncludeCount = bIncludeCount;
			}
			if (bReturnNoEntities != null) {
				this._bReturnNoEntities = bReturnNoEntities;
			}
		},

		/**
		 * Specify that only a page of the query result shall be returned. A page is
		 * described by its boundaries, that are row numbers for the first and last
		 * rows in the query result to be returned.
		 *
		 * @param {Number}
		 *            start The first row of the query result to be returned.
		 *            Numbering starts at 1. Passing null is equivalent to start
		 *            with the first row.
		 * @param {Number}
		 *            end The last row of the query result to be returned. Passing
		 *            null is equivalent to get all rows up to the end of the query
		 *            result.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#setResultPageBoundaries
		 */
		setResultPageBoundaries : function(start, end) {
			if (start != null && typeof start !== "number") {
				throw "Start value must be null or numeric"; // TODO
			}
			if (end !== null && typeof end !== "number") {
				throw "End value must be null or numeric"; // TODO
			}

			if (start == null) {
				start = 1;
			}

			if (start < 1 || start > (end == null ? start : end)) {
				throw "Invalid values for requested page boundaries"; // TODO
			}

			this._iSkipRequestOption = (start > 1) ? start - 1 : null;
			this._iTopRequestOption = (end != null) ? (end - start + 1) : null;
		},

		/**
		 * Returns the current page boundaries as object with properties
		 * <code>start</code> and <code>end</code>. If the end of the page is
		 * unbounded, <code>end</code> is null.
		 *
		 * @returns {Object} the current page boundaries as object
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getResultPageBoundaries
		 */
		getResultPageBoundaries : function() {
			var iEnd = null;
			if (this._iTopRequestOption != null) {
				if (this._iSkipRequestOption == null) {
					iEnd = 1;
				} else {
					iEnd = this._iSkipRequestOption + this._iTopRequestOption;
				}
			}
			return {
				start : (this._iSkipRequestOption == null) ? 1 : this._iSkipRequestOption,
				end : iEnd
			};
		},

		/**
		 * Get the URI to locate the entity set for the query result.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 *
		 * @returns {String} The resource path of the URI pointing to the entity
		 *          set. It is a relative URI unless a service root is given, which
		 *          would then prefixed in order to return a complete URL.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getURIToQueryResultEntitySet
		 */
		getURIToQueryResultEntitySet : function(sServiceRootURI) {
			var sURI = null;
			if (this._sResourcePath != null) {
				sURI = (sServiceRootURI ? sServiceRootURI : "") + this._sResourcePath;
			} else if (this._oQueryResult.getParameterization()) {
				if (!this._oParameterizationRequest) {
					throw "Missing parameterization request";
				} else {
					sURI = this._oParameterizationRequest.getURIToParameterizationEntry(sServiceRootURI) + "/"
							+ this._oQueryResult.getParameterization().getNavigationPropertyToQueryResult();
				}
			} else {
				sURI = (sServiceRootURI ? sServiceRootURI : "") + "/" + this._oQueryResult.getEntitySet().getQName();
			}
			return sURI;
		},

		/**
		 * Get the value of an query option for the OData request URI corresponding
		 * to this request.
		 *
		 * @param {String}
		 *            sQueryOptionName Identifies the query option: $select,
		 *            $filter,$orderby ... or any custom query option
		 *
		 * @returns {String} The value of the requested query option or null, if
		 *          this option is not used for the OData request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getURIQueryOptionValue
		 */
		getURIQueryOptionValue : function(sQueryOptionName) {
			var sQueryOptionValue = null;

			switch (sQueryOptionName) {
			case "$select": {
				var sSelectOption = "";
				this._oSelectedPropertyNames = {};
				var sDimensionPropertyName = null;
				for ( var sDimName in this._oAggregationLevel) {
					var oDim = this._oQueryResult.findDimensionByName(sDimName);
					var oDimSelect = this._oAggregationLevel[sDimName];
					if (oDimSelect.key == true) {
						sDimensionPropertyName = oDim.getKeyProperty().name;
						if (this._oSelectedPropertyNames[sDimensionPropertyName] == undefined) {
							sSelectOption += (sSelectOption == "" ? "" : ",") + sDimensionPropertyName;
							this._oSelectedPropertyNames[sDimensionPropertyName] = true;
						}
					}
					if (oDimSelect.text == true && oDim.getTextProperty()) {
						sDimensionPropertyName = oDim.getTextProperty().name;
						if (this._oSelectedPropertyNames[sDimensionPropertyName] == undefined) {
							sSelectOption += (sSelectOption == "" ? "" : ",") + sDimensionPropertyName;
							this._oSelectedPropertyNames[sDimensionPropertyName] = true;
						}
					}
					if (oDimSelect.attributes) {
						for (var i = -1, sAttrName; (sAttrName = oDimSelect.attributes[++i]) !== undefined;) {
							sDimensionPropertyName = oDim.findAttributeByName(sAttrName).getName();
							if (this._oSelectedPropertyNames[sDimensionPropertyName] == undefined) {
								sSelectOption += (sSelectOption == "" ? "" : ",") + sDimensionPropertyName;
								this._oSelectedPropertyNames[sDimensionPropertyName] = true;
							}
						}
					}
				}

				var sMeasurePropertyName;
				for ( var sMeasName in this._oMeasures) {
					var oMeas = this._oQueryResult.findMeasureByName(sMeasName);
					var oMeasSelect = this._oMeasures[sMeasName];
					if (oMeasSelect.value == true) {
						sMeasurePropertyName = oMeas.getRawValueProperty().name;
						if (this._oSelectedPropertyNames[sMeasurePropertyName] == undefined) {
							sSelectOption += (sSelectOption == "" ? "" : ",") + sMeasurePropertyName;
							this._oSelectedPropertyNames[sMeasurePropertyName] = true;
						}
					}
					if (oMeasSelect.text == true && oMeas.getFormattedValueProperty()) {
						sMeasurePropertyName = oMeas.getFormattedValueProperty().name;
						if (this._oSelectedPropertyNames[sMeasurePropertyName] == undefined) {
							sSelectOption += (sSelectOption == "" ? "" : ",") + sMeasurePropertyName;
							this._oSelectedPropertyNames[sMeasurePropertyName] = true;
						}
					}
					if (oMeasSelect.unit == true && oMeas.getUnitProperty()) {
						sMeasurePropertyName = oMeas.getUnitProperty().name;
						if (this._oSelectedPropertyNames[sMeasurePropertyName] == undefined) {
							sSelectOption += (sSelectOption == "" ? "" : ",") + sMeasurePropertyName;
							this._oSelectedPropertyNames[sMeasurePropertyName] = true;
						}
					}
				}

				if (this._bIncludeEntityKey) {
					var aKeyPropRef = this._oQueryResult.getEntityType().getTypeDescription().key.propertyRef;
					for (var j = -1, oKeyProp; (oKeyProp = aKeyPropRef[++j]) !== undefined;) {
						sSelectOption += (sSelectOption == "" ? "" : ",") + oKeyProp.name;
					}
				}
				sQueryOptionValue = (sSelectOption ? sSelectOption : null);
				break;
			}
			case "$filter": {
				var sFilterOption = null;
				if (this._oFilterExpression) {
					sFilterOption = this._oFilterExpression.getURIFilterOptionValue();
				}
				sQueryOptionValue = (sFilterOption ? sFilterOption : null);
				break;
			}
			case "$orderby": {
				var sSortOption = null;
				if (this._oSortExpression) {
					sSortOption = this._oSortExpression.getURIOrderByOptionValue(this._oSelectedPropertyNames);
				}
				sQueryOptionValue = (sSortOption ? sSortOption : null);
				break;
			}
			case "$top": {
				sQueryOptionValue = null;
				if (this._bReturnNoEntities) {
					sQueryOptionValue = 0;
				} else if (this._iTopRequestOption !== null) {
					sQueryOptionValue = this._iTopRequestOption;
				}
				break;
			}
			case "$skip": {
				sQueryOptionValue = null;
				if (!this._bReturnNoEntities) {
					sQueryOptionValue = this._iSkipRequestOption;
				}
				break;
			}
			case "$inlinecount": {
				sQueryOptionValue = (this._bIncludeCount == true ? "allpages" : null);
				break;
			}
			default:
				break;
			}
			return sQueryOptionValue;
		},

		/**
		 * Get the unescaped URI to fetch the query result.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 * @param {String}
		 *            sResourcePath (optional) OData resource path to be considered.
		 *            If provided, it overwrites any parameterization object that
		 *            might have been specified separately.
		 *
		 * @returns {String} The unescaped URI that contains the OData resource path
		 *          and OData system query options to express the aggregation level,
		 *          filter expression and further options.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.QueryResultRequest#getURIToQueryResultEntries
		 */
		getURIToQueryResultEntries : function(sServiceRootURI, sResourcePath) {

			// construct resource path
			if (!sResourcePath) {
				sResourcePath = this.getURIToQueryResultEntitySet(sServiceRootURI);
			}

			// check if request is compliant with filter constraints expressed in
			// metadata
			this.getFilterExpression().checkValidity();

			// construct query options
			var sSelectOption = this.getURIQueryOptionValue("$select");
			var sFilterOption = this.getURIQueryOptionValue("$filter");
			var sSortOption = this.getURIQueryOptionValue("$orderby");
			var sTopOption = this.getURIQueryOptionValue("$top");
			var sSkipOption = this.getURIQueryOptionValue("$skip");
			var sInlineCountOption = this.getURIQueryOptionValue("$inlinecount");

			var sURI = sResourcePath;
			var bQuestionmark = false;

			if (sSelectOption !== null) {
				sURI += "?$select=" + sSelectOption;
				bQuestionmark = true;
			}
			if (this._oFilterExpression && sFilterOption !== null) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$filter=" + sFilterOption;
			}
			if (this._oSortExpression && sSortOption !== null) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$orderby=" + sSortOption;
			}

			if ((this._iTopRequestOption || this._bReturnNoEntities) && sTopOption !== null) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$top=" + sTopOption;
			}
			if (this._iSkipRequestOption && sSkipOption !== null) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$skip=" + sSkipOption;
			}
			if (this._bIncludeCount && sInlineCountOption !== null) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$inlinecount=" + sInlineCountOption;
			}
			return sURI;
		},

		/**
		 * Private member attributes
		 */
		_oQueryResult : null,
		_oParameterizationRequest : null,
		_sResourcePath : null,
		_oAggregationLevel : null,
		_oMeasures : null,
		_bIncludeEntityKey : null,
		_bIncludeCount : null,
		_bReturnNoEntities : null,
		_oFilterExpression : null,
		_oSortExpression : null,
		_iSkipRequestOption : null,
		_iTopRequestOption : null
	};

	/** ******************************************************************** */

	/**
	 * Create a request object for interaction with a query parameter value help.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.Parameter}
	 *            oParameter Description of a query parameter
	 *
	 * @constructor
	 *
	 * @class Creation of URIs for fetching a query parameter value set.
	 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest
	 * @public
	 */
	odata4analytics.ParameterValueSetRequest = function(oParameter) {
		this._init(oParameter);
	};

	odata4analytics.ParameterValueSetRequest.prototype = {
		/**
		 * @private
		 */
		_init : function(oParameter) {
			this._oParameter = oParameter;
			this._oValueSetResult = {};
			this._oFilterExpression = null;
			this._oSortExpression = null;
		},

		/**
		 * Specify which components of the parameter shall be included in the value
		 * set.
		 *
		 * @param bIncludeText
		 *            Indicator whether or not to include the parameter text (if
		 *            available) in the value set. Pass null to keep current
		 *            setting.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest#includeParameterText
		 */
		includeParameterText : function(bIncludeText) {
			if (bIncludeText != null) {
				this._oValueSetResult.text = bIncludeText;
			}
		},

		/**
		 * Get the filter expression for this request.
		 *
		 * Expressions are represented by separate objects. If none exists so far, a
		 * new expression object gets created.
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.FilterExpression} The filter object
		 *          associated to this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest#getFilterExpression
		 */
		getFilterExpression : function() {
			if (this._oFilterExpression == null) {
				var oEntityType = this._oParameter.getContainingParameterization().getEntityType();
				var oModel = this._oParameter.getContainingParameterization().getTargetQueryResult().getModel();
				this._oFilterExpression = new odata4analytics.FilterExpression(oModel, oEntityType
						.getSchema(), oEntityType);
			}
			return this._oFilterExpression;
		},

		/**
		 * Set the filter expression for this request.
		 *
		 * Expressions are represented by separate objects. Calling this method
		 * replaces the filter object maintained by this request.
		 *
		 * @param {sap.ui.model.analytics.odata4analytics.FilterExpression}
		 *            oFilter The filter object to be associated with this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest#setFilterExpression
		 */
		setFilterExpression : function(oFilter) {
			this._oFilterExpression = oFilter;
		},

		/**
		 * Get the sort expression for this request.
		 *
		 * Expressions are represented by separate objects. If none exists so far, a
		 * new expression object gets created.
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.SortExpression} The sort object
		 *          associated to this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest#getSortExpression
		 */
		getSortExpression : function() {
			if (this._oSortExpression == null) {
				var oEntityType = this._oParameter.getContainingParameterization().getEntityType();
				this._oSortExpression = new odata4analytics.SortExpression(oEntityType.getModel(), oEntityType.getSchema(),
						oEntityType);
			}
			return this._oSortExpression;
		},

		/**
		 * Set the sort expression for this request.
		 *
		 * Expressions are represented by separate objects. Calling this method
		 * replaces the sort object maintained by this request.
		 *
		 * @param {sap.ui.model.analytics.odata4analytics.SortExpression}
		 *            oSorter The sort object to be associated with this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest#setSortExpression
		 */
		setSortExpression : function(oSorter) {
			this._oSortExpression = oSorter;
		},

		/**
		 * Get the value of an query option for the OData request URI corresponding
		 * to this request.
		 *
		 * @param {String}
		 *            sQueryOptionName Identifies the query option: $select,
		 *            $filter,... or any custom query option
		 *
		 * @returns {String} The value of the requested query option or null, if
		 *          this option is not used for the OData request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest#getURIQueryOptionValue
		 */
		getURIQueryOptionValue : function(sQueryOptionName) {
			var sQueryOptionValue = null;

			switch (sQueryOptionName) {
			case "$select": {
				var sSelectOption = "";
				sSelectOption += (sSelectOption == "" ? "" : ",") + this._oParameter.getProperty().name;
				if (this._oValueSetResult.text == true && this._oParameter.getTextProperty()) {
					sSelectOption += (sSelectOption == "" ? "" : ",") + this._oParameter.getTextProperty().name;
				}
				sQueryOptionValue = (sSelectOption ? sSelectOption : null);
				break;
			}
			case "$filter": {
				var sFilterOption = null;
				if (this._oFilterExpression) {
					sFilterOption = this._oFilterExpression.getURIFilterOptionValue();
				}
				sQueryOptionValue = (sFilterOption ? sFilterOption : null);
				break;
			}
			case "$orderby": {
				var sSortOption = null;
				if (this._oSortExpression) {
					sSortOption = this._oSortExpression.getURIOrderByOptionValue();
				}
				sQueryOptionValue = (sSortOption ? sSortOption : null);
				break;
			}
			default:
				break;
			}

			return sQueryOptionValue;
		},

		/**
		 * Get the unescaped URI to fetch the parameter value set.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 * @returns {String} The unescaped URI that contains the OData resource path
		 *          and OData system query options to express the request for the
		 *          parameter value set..
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.ParameterValueSetRequest#getURIToParameterValueSetEntries
		 */
		getURIToParameterValueSetEntries : function(sServiceRootURI) {

			// construct resource path
			var sResourcePath = null;

			sResourcePath = (sServiceRootURI ? sServiceRootURI : "") + "/"
					+ this._oParameter.getContainingParameterization().getEntitySet().getQName();

			// check if request is compliant with filter constraints expressed in
			// metadata
			this.getFilterExpression().checkValidity();

			// construct query options
			var sSelectOption = this.getURIQueryOptionValue("$select");
			var sFilterOption = this.getURIQueryOptionValue("$filter");
			var sSortOption = this.getURIQueryOptionValue("$orderby");

			var sURI = sResourcePath;
			var bQuestionmark = false;

			if (sSelectOption) {
				sURI += "?$select=" + sSelectOption;
				bQuestionmark = true;
			}
			if (this._oFilterExpression && sFilterOption) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$filter=" + sFilterOption;
			}
			if (this._oSortExpression && sSortOption) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$orderby=" + sSortOption;
			}
			return sURI;
		},

		/**
		 * Private member attributes
		 */
		_oParameter : null,
		_oFilterExpression : null,
		_oSortExpression : null,
		_oValueSetResult : null
	};

	/** ******************************************************************** */

	/**
	 * Create a request object for interaction with a dimension value help. Such a
	 * value help is served by either the query result entity set, in which case the
	 * returned dimension members are limited to those also used in the query result
	 * data. Or, the value help is populated by a master data entity set, if made
	 * available by the service. In this case, the result will include all valid
	 * members for that dimension.
	 *
	 * @param {sap.ui.model.analytics.odata4analytics.Dimension}
	 *            oDimension Description of a dimension
	 * @param {sap.ui.model.analytics.odata4analytics.ParameterizationRequest}
	 *            oParameterizationRequest (optional) Request object for
	 *            interactions with the parameterization of the query result or (not
	 *            yet supported) master data entity set Such an object is required
	 *            if the entity set holding the dimension members includes
	 *            parameters.
	 * @param {boolean}
	 *            bUseMasterData (optional) Indicates use of master data for
	 *            determining the dimension members.
	 *
	 * @constructor
	 *
	 * @class Creation of URIs for fetching a query dimension value set.
	 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest
	 * @public
	 */
	odata4analytics.DimensionMemberSetRequest = function(oDimension, oParameterizationRequest, bUseMasterData) {
		this._init(oDimension, oParameterizationRequest, bUseMasterData);
	};

	odata4analytics.DimensionMemberSetRequest.prototype = {
		/**
		 * @private
		 */
		_init : function(oDimension, oParameterizationRequest, bUseMasterData) {
			this._oDimension = oDimension;
			this._oParameterizationRequest = oParameterizationRequest;
			this._bUseMasterData = bUseMasterData;
			this._oValueSetResult = {};
			this._oFilterExpression = null;
			this._oSortExpression = null;

			if (this._oParameterizationRequest != null && this._bUseMasterData == true) {
				throw "LIMITATION: parameterized master data entity sets are not yet implemented";
			}
			if (this._bUseMasterData) {
				this._oEntitySet = this._oDimension.getMasterDataEntitySet();
			} else {
				this._oEntitySet = this._oDimension.getContainingQueryResult().getEntitySet();
				if (this._oDimension.getContainingQueryResult().getParameterization() && !this._oParameterizationRequest) {
					throw "Missing parameterization request";
				}
			}
		},

		/**
		 * Set the parameterization request required for retrieving dimension
		 * members directly from the query result, if it is parameterized.
		 *
		 * @param oParameterizationRequest
		 *            Request object for interactions with the parameterization of
		 *            this query result
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#setParameterizationRequest
		 */
		setParameterizationRequest : function(oParameterizationRequest) {
			this._oParameterizationRequest = oParameterizationRequest;
		},

		/**
		 * Specify which components of the dimension shall be included in the value
		 * set.
		 *
		 * @param bIncludeText
		 *            Indicator whether or not to include the dimension text (if
		 *            available) in the value set.
		 * @param bIncludeAttributes
		 *            Indicator whether or not to include all dimension attributes
		 *            (if available) in the value set.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.includeDimensionTextAttributes
		 */
		includeDimensionTextAttributes : function(bIncludeText, bIncludeAttributes) {
			this._oValueSetResult.text = {
				text : false,
				attributes : false
			};
			if (bIncludeText == true) {
				this._oValueSetResult.text = true;
			}
			if (bIncludeAttributes == true) {
				this._oValueSetResult.attributes = true;
			}
		},

		/**
		 * Get the filter expression for this request.
		 *
		 * Expressions are represented by separate objects. If none exists so far, a
		 * new expression object gets created.
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.FilterExpression} The filter object
		 *          associated to this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#getFilterExpression
		 */
		getFilterExpression : function() {
			if (this._oFilterExpression == null) {
				var oEntityType = this._oEntitySet.getEntityType();
				var oModel = this._oDimension.getContainingQueryResult().getModel();
				this._oFilterExpression = new odata4analytics.FilterExpression(oModel, oEntityType
						.getSchema(), oEntityType);
			}
			return this._oFilterExpression;
		},

		/**
		 * Set the filter expression for this request.
		 *
		 * Expressions are represented by separate objects. Calling this method
		 * replaces the filter object maintained by this request.
		 *
		 * @param {sap.ui.model.analytics.odata4analytics.FilterExpression}
		 *            oFilter The filter object to be associated with this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#setFilterExpression
		 */
		setFilterExpression : function(oFilter) {
			this._oFilterExpression = oFilter;
		},

		/**
		 * Get the sort expression for this request.
		 *
		 * Expressions are represented by separate objects. If none exists so far, a
		 * new expression object gets created.
		 *
		 * @returns {sap.ui.model.analytics.odata4analytics.SortExpression} The sort object
		 *          associated to this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#getSortExpression
		 */
		getSortExpression : function() {
			if (this._oSortExpression == null) {
				this._oSortExpression = new odata4analytics.SortExpression(this._oEntityType.getModel(), this._oEntityType
						.getSchema(), this._oEntityType);
			}
			return this._oSortExpression;
		},

		/**
		 * Set the sort expression for this request.
		 *
		 * Expressions are represented by separate objects. Calling this method
		 * replaces the sort object maintained by this request.
		 *
		 * @param {sap.ui.model.analytics.odata4analytics.SortExpression}
		 *            oSorter The sort object to be associated with this request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#setSortExpression
		 */
		setSortExpression : function(oSorter) {
			this._oSortExpression = oSorter;
		},

		/**
		 * Set further options to be applied for the OData request
		 *
		 * @param {Boolean}
		 *            bIncludeCount Indicates whether or not the result shall
		 *            include a count for the returned entities. Default is not to
		 *            include it. Pass null to keep current setting.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#setRequestOptions
		 */
		setRequestOptions : function(bIncludeCount) {
			if (bIncludeCount != null) {
				this._bIncludeCount = bIncludeCount;
			}
		},

		/**
		 * Specify that only a page of the query result shall be returned. A page is
		 * described by its boundaries, that are row numbers for the first and last
		 * rows in the query result to be returned.
		 *
		 * @param {Number}
		 *            start The first row of the query result to be returned.
		 *            Numbering starts at 1. Passing null is equivalent to start
		 *            with the first row.
		 * @param {Number}
		 *            end The last row of the query result to be returned. Passing
		 *            null is equivalent to get all rows up to the end of the query
		 *            result.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#setResultPageBoundaries
		 */
		setResultPageBoundaries : function(start, end) {
			if (start != null && typeof start !== "number") {
				throw "Start value must be null or numeric"; // TODO
			}
			if (end !== null && typeof end !== "number") {
				throw "End value must be null or numeric"; // TODO
			}

			if (start == null) {
				start = 1;
			}

			if (start < 1 || start > (end == null ? start : end)) {
				throw "Invalid values for requested page boundaries"; // TODO
			}

			this._iSkipRequestOption = (start > 1) ? start - 1 : null;
			this._iTopRequestOption = (end != null) ? (end - start + 1) : null;
		},

		/**
		 * Returns the current page boundaries as object with properties
		 * <code>start</code> and <code>end</code>. If the end of the page is
		 * unbounded, <code>end</code> is null.
		 *
		 * @returns {Object} the current page boundaries as object
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#getResultPageBoundaries
		 */
		getResultPageBoundaries : function() {
			var iEnd = null;
			if (this._iTopRequestOption != null) {
				if (this._iSkipRequestOption == null) {
					iEnd = 1;
				} else {
					iEnd = this._iSkipRequestOption + this._iTopRequestOption;
				}
			}
			return {
				start : (this._iSkipRequestOption == null) ? 1 : this._iSkipRequestOption,
				end : iEnd
			};
		},

		/**
		 * Get the value of an query option for the OData request URI corresponding
		 * to this request.
		 *
		 * @param {String}
		 *            sQueryOptionName Identifies the query option: $select,
		 *            $filter,... or any custom query option
		 *
		 * @returns {String} The value of the requested query option or null, if
		 *          this option is not used for the OData request.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#getURIQueryOptionValue
		 */
		getURIQueryOptionValue : function(sQueryOptionName) {
			var sQueryOptionValue = null;

			switch (sQueryOptionName) {
			case "$select": {
				var sSelectOption = "";
				var oEntityType = this._oEntitySet.getEntityType();
				var aKeyPropName = oEntityType.getKeyProperties();
				var aKeyTextPropName = [];
				// add key properties and, if requested, their text properties
				if (this._bUseMasterData) {
					for (var i = -1, sKeyPropName; (sKeyPropName = aKeyPropName[++i]) !== undefined;) {
						sSelectOption += (sSelectOption == "" ? "" : ",") + sKeyPropName;
						var oKeyTextProperty = oEntityType.getTextPropertyOfProperty(sKeyPropName);
						if (oKeyTextProperty) {
							if (this._oValueSetResult.text == true) {
								sSelectOption += "," + oKeyTextProperty.name;
							}
							aKeyTextPropName.push(oKeyTextProperty.name);
						}
					}
				} else { // use query result
					sSelectOption += (sSelectOption == "" ? "" : ",") + this._oDimension.getKeyProperty().name;
					if (this._oValueSetResult.text == true && this._oDimension.getTextProperty()) {
						sSelectOption += (sSelectOption == "" ? "" : ",") + this._oDimension.getTextProperty().name;
					}
				}
				// add further attributes, if requested
				if (this._oValueSetResult.attributes) {
					if (this._bUseMasterData) {
						// do not require sap:attribute-for annotations, but simply
						// add all further
						// properties
						var oAllPropertiesSet = oEntityType.getProperties();
						for ( var sPropName in oAllPropertiesSet) {
							var bIsKeyOrKeyText = false;
							for (var j = -1, sKeyPropName2; (sKeyPropName2 = aKeyPropName[++j]) !== undefined;) {
								if (sPropName == sKeyPropName2) {
									bIsKeyOrKeyText = true;
									break;
								}
							}
							if (bIsKeyOrKeyText) {
								continue;
							}
							for (var k = -1, sKeyTextPropName; (sKeyTextPropName = aKeyTextPropName[++k]) !== undefined;) {
								if (sPropName == sKeyTextPropName) {
									bIsKeyOrKeyText = true;
									break;
								}
							}
							if (!bIsKeyOrKeyText) {
								sSelectOption += "," + sPropName;
							}
						}
					} else { // use query result, hence include known dimension
						// attributes
						var aAttributeName = this._oDimension.getAllAttributeNames();
						for (var l = -1, sAttrName; (sAttrName = aAttributeName[++l]) !== undefined;) {
							sSelectOption += (sSelectOption == "" ? "" : ",")
									+ this._oDimension.findAttributeByName(sAttrName).getName();
						}
					}
				}

				sQueryOptionValue = (sSelectOption ? sSelectOption : null);
				break;
			}
			case "$filter": {
				var sFilterOption = null;
				if (this._oFilterExpression) {
					sFilterOption = this._oFilterExpression.getURIFilterOptionValue();
				}
				sQueryOptionValue = (sFilterOption ? sFilterOption : null);
				break;
			}
			case "$orderby": {
				var sSortOption = null;
				if (this._oSortExpression) {
					sSortOption = this._oSortExpression.getURIOrderByOptionValue();
				}
				sQueryOptionValue = (sSortOption ? sSortOption : null);
				break;
			}
			case "$top": {
				if (this._iTopRequestOption !== null) {
					sQueryOptionValue = this._iTopRequestOption;
				}
				break;
			}
			case "$skip": {
				sQueryOptionValue = this._iSkipRequestOption;
				break;
			}
			case "$inlinecount": {
				sQueryOptionValue = (this._bIncludeCount == true ? "allpages" : null);
				break;
			}
			default:
				break;
			}

			return sQueryOptionValue;
		},

		/**
		 * Get the URI to locate the entity set for the dimension memebers.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 * @returns {String} The resource path of the URI pointing to the entity
		 *          set. It is a relative URI unless a service root is given, which
		 *          would then prefixed in order to return a complete URL.
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#getURIToDimensionMemberEntitySet
		 */
		getURIToDimensionMemberEntitySet : function(sServiceRootURI) {
			var sResourcePath = null;
			if (!this._bUseMasterData && this._oParameterizationRequest) {
				sResourcePath = this._oParameterizationRequest.getURIToParameterizationEntry(sServiceRootURI) + "/"
						+ this._oDimension.getContainingQueryResult().getParameterization().getNavigationPropertyToQueryResult();
			} else {
				sResourcePath = (sServiceRootURI ? sServiceRootURI : "") + "/" + this._oEntitySet.getQName();
			}
			return sResourcePath;
		},

		/**
		 * Get the unescaped URI to fetch the dimension members, optionally
		 * augmented by text and attributes.
		 *
		 * @param {String}
		 *            sServiceRootURI (optional) Identifies the root of the OData
		 *            service
		 * @returns {String} The unescaped URI that contains the OData resource path
		 *          and OData system query options to express the request for the
		 *          parameter value set..
		 * @public
		 * @function
		 * @name sap.ui.model.analytics.odata4analytics.DimensionMemberSetRequest#getURIToDimensionMemberEntries
		 */
		getURIToDimensionMemberEntries : function(sServiceRootURI) {

			// construct resource path
			var sResourcePath = this.getURIToDimensionMemberEntitySet(sServiceRootURI);

			// check if request is compliant with filter constraints expressed in
			// metadata
			this.getFilterExpression().checkValidity();

			// construct query options
			var sSelectOption = this.getURIQueryOptionValue("$select");
			var sFilterOption = this.getURIQueryOptionValue("$filter");
			var sSortOption = this.getURIQueryOptionValue("$orderby");
			var sTopOption = this.getURIQueryOptionValue("$top");
			var sSkipOption = this.getURIQueryOptionValue("$skip");
			var sInlineCountOption = this.getURIQueryOptionValue("$inlinecount");

			var sURI = sResourcePath;
			var bQuestionmark = false;

			if (sSelectOption) {
				sURI += "?$select=" + sSelectOption;
				bQuestionmark = true;
			}
			if (this._oFilterExpression && sFilterOption) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$filter=" + sFilterOption;
			}
			if (this._oSortExpression && sSortOption) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$orderby=" + sSortOption;
			}
			if (this._iTopRequestOption && sTopOption) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$top=" + sTopOption;
			}
			if (this._iSkipRequestOption && sSkipOption) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$skip=" + sSkipOption;
			}
			if (this._bIncludeCount && sInlineCountOption) {
				if (!bQuestionmark) {
					sURI += "?";
					bQuestionmark = true;
				} else {
					sURI += "&";
				}
				sURI += "$inlinecount=" + sInlineCountOption;
			}
			return sURI;
		},

		/**
		 * Private member attributes
		 */
		_oDimension : null,
		_oParameterizationRequest : null,
		_oEntitySet : null, // points to query result entity set or master data
		// entity set
		_bUseMasterData : false,

		_oFilterExpression : null,
		_oSortExpression : null,
		_oValueSetResult : null,

		_bIncludeCount : null,
		_iSkipRequestOption : 0,
		_iTopRequestOption : null

	};

	//
	// Desirable extensions:
	//
	// OBSOLETE due to DimensionMemberSetRequest against master data - Another class
	// for representing value help entities to
	// specifiy text properties, attribute properties (with association to
	// odata4analytics.Parameter and odata4analytics.Dimension)
	//
	// - ParameterValueSetRequest: Add option to read values from separate entity
	// set (odata4analytics.ParameterValueSetRequest)
	//
	// DONE - DimensionMemberSetRequest: Add option to read values from separate
	// master
	// data entity
	// set (odata4analytics.DimensionMemberSetRequest)
	//
	// DONE - value rendering: Add support for types other than string
	// (odata4analytics.helper.renderPropertyKeyValue)
	//
	// DONE - filter expressions are validated against filter restriction
	// annotations
	// (odata4analytics.FilterExpression)
	//
	// DONE workaround - Implemenentation of filter expressions shall use SAPUI5
	// class
	// sap.ui.model.Filter. Problem:
	// This class does not provide accessor methods for object attributes.
	// (odata4analytics.FilterExpression)
	//
	// - Shield API implementation from direct access to object properties.
	// Introduce closures for this purpose.
	/*
	 * Pattern: odata4analytics.QueryResult = (function ($){ var _init =
	 * func
	 *
	 * var class = function(oEntityType, oEntitySet, oParameterization) {
	 * _init(oEntityType, oEntitySet, oParameterization); }; }; return class;
	 * })(jQuery);
	 *
	 */

	return odata4analytics;

}, /* bExport= */ true);
