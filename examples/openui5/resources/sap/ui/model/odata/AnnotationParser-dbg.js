/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.odata.ODataAnnotations
sap.ui.define(['jquery.sap.global', 'sap/ui/Device'], function(jQuery, Device) {
"use strict";

/**
 * Whitelist of property node names whose values should be put through alias replacement
 */
var mAliasNodeWhitelist = {
	EnumMember: true,
	Path: true,
	PropertyPath: true,
	NavigationPropertyPath: true,
	AnnotationPath: true
};

var mTextNodeWhitelist = {
	Binary: true,
	Bool: true,
	Date: true,
	DateTimeOffset: true,
	Decimal: true,
	Duration: true,
	Float: true,
	Guid: true,
	Int: true,
	String: true,
	TimeOfDay: true,

	LabelElementReference: true,
	EnumMember: true,
	Path: true,
	PropertyPath: true,
	NavigationPropertyPath: true,
	AnnotationPath: true
};

var mMultipleArgumentDynamicExpressions = {
	And: true,
	Or: true,
	// Not: true,
	Eq: true,
	Ne: true,
	Gt: true,
	Ge: true,
	Lt: true,
	Le: true,
	If: true,
	Collection: true
};



var AnnotationsParser =  { 

	parse: function(oMetadataContainer, oXMLDoc) {
		this.oMetadata = oMetadataContainer.metadata;
		var mappingList = {}, schemaNodes, oSchema = {}, schemaNode,
		termNodes, oTerms, termNode, sTermType, oMetadataProperties, annotationNodes, annotationNode,
		annotationTarget, annotationNamespace, annotation, propertyAnnotation, propertyAnnotationNodes,
		propertyAnnotationNode, sTermValue, targetAnnotation, annotationQualifier, annotationTerm,
		valueAnnotation, expandNodes, expandNode, path, pathValues, expandNodesApplFunc, i, nodeIndex;

		var xPath = this.getXPath();
		this.oServiceMetadata = this.oMetadata.getServiceMetadata();

		// Set XPath namespace
		oXMLDoc = xPath.setNameSpace(oXMLDoc);
		// Schema Alias
		schemaNodes = xPath.selectNodes(oXMLDoc, "//d:Schema", oXMLDoc);
		for (i = 0; i < schemaNodes.length; i += 1) {
			schemaNode = xPath.nextNode(schemaNodes, i);
			oSchema.Alias = schemaNode.getAttribute("Alias");
			oSchema.Namespace = schemaNode.getAttribute("Namespace");
		}

		// Fill local alias and reference objects
		var oAnnotationReferences = {};
		var oAlias = {};
		var bFoundReferences = this._parseReferences(oXMLDoc, oAnnotationReferences, oAlias);
		if (bFoundReferences) {
			mappingList.annotationReferences = oAnnotationReferences;
			mappingList.aliasDefinitions = oAlias;
		}

		// Term nodes
		termNodes = xPath.selectNodes(oXMLDoc, "//d:Term", oXMLDoc);
		if (termNodes.length > 0) {
			oTerms = {};
			for (nodeIndex = 0; nodeIndex < termNodes.length; nodeIndex += 1) {
				termNode = xPath.nextNode(termNodes, nodeIndex);
				sTermType = this.replaceWithAlias(termNode.getAttribute("Type"), oAlias);
				oTerms["@" + oSchema.Alias + "." + termNode.getAttribute("Name")] = sTermType;
			}
			mappingList.termDefinitions = oTerms;
		}
		// Metadata information of all properties
		if (!this.oMetadata.references) {
			this.oMetadata.references = this.getAllPropertiesMetadata(this.oServiceMetadata);
		}
		oMetadataProperties = this.oMetadata.references;
		if (oMetadataProperties.extensions) {
			mappingList.propertyExtensions = oMetadataProperties.extensions;
		}
		// Annotations
		annotationNodes = xPath.selectNodes(oXMLDoc, "//d:Annotations ", oXMLDoc);
		for (nodeIndex = 0; nodeIndex < annotationNodes.length; nodeIndex += 1) {
			annotationNode = xPath.nextNode(annotationNodes, nodeIndex);
			if (annotationNode.hasChildNodes() === false) {
				continue;
			}
			annotationTarget = annotationNode.getAttribute("Target");
			annotationNamespace = annotationTarget.split(".")[0];
			if (annotationNamespace && oAlias[annotationNamespace]) {
				annotationTarget = annotationTarget.replace(new RegExp(annotationNamespace, ""), oAlias[annotationNamespace]);
			}
			annotation = annotationTarget;
			propertyAnnotation = null;
			var sContainerAnnotation = null;
			if (annotationTarget.indexOf("/") > 0) {
				annotation = annotationTarget.split("/")[0];
				// check sAnnotation is EntityContainer: if yes, something in there is annotated - EntitySet, FunctionImport, ..
				var bSchemaExists =
					this.oServiceMetadata.dataServices &&
					this.oServiceMetadata.dataServices.schema &&
					this.oServiceMetadata.dataServices.schema.length;

				if (bSchemaExists) {
					for (var j = this.oServiceMetadata.dataServices.schema.length - 1; j >= 0; j--) {
						var oMetadataSchema = this.oServiceMetadata.dataServices.schema[j];
						if (oMetadataSchema.entityContainer) {
							var aAnnotation = annotation.split('.');
							for (var k = oMetadataSchema.entityContainer.length - 1; k >= 0; k--) {
								if (oMetadataSchema.entityContainer[k].name === aAnnotation[aAnnotation.length - 1] ) {
									sContainerAnnotation = annotationTarget.replace(annotation + "/", "");
									break;
								}
							}
						}
					}
				}

				//else - it's a property annotation
				if (!sContainerAnnotation) {
					propertyAnnotation = annotationTarget.replace(annotation + "/", "");
				}
			}
			// --- Value annotation of complex types. ---
			if (propertyAnnotation) {
				if (!mappingList.propertyAnnotations) {
					mappingList.propertyAnnotations = {};
				}
				if (!mappingList.propertyAnnotations[annotation]) {
					mappingList.propertyAnnotations[annotation] = {};
				}
				if (!mappingList.propertyAnnotations[annotation][propertyAnnotation]) {
					mappingList.propertyAnnotations[annotation][propertyAnnotation] = {};
				}

				propertyAnnotationNodes = xPath.selectNodes(oXMLDoc, "./d:Annotation", annotationNode);
				for (var nodeIndexValue = 0; nodeIndexValue < propertyAnnotationNodes.length; nodeIndexValue += 1) {
					propertyAnnotationNode = xPath.nextNode(propertyAnnotationNodes, nodeIndexValue);
					sTermValue = this.replaceWithAlias(propertyAnnotationNode.getAttribute("Term"), oAlias);
					var sQualifierValue = annotationNode.getAttribute("Qualifier") || propertyAnnotationNode.getAttribute("Qualifier");
					if (sQualifierValue) {
						sTermValue += "#" + sQualifierValue;
					}

					if (propertyAnnotationNode.hasChildNodes() === false) {
						mappingList.propertyAnnotations[annotation][propertyAnnotation][sTermValue] = 
							this.enrichFromPropertyValueAttributes({}, propertyAnnotationNode, oAlias);
					} else {
						mappingList.propertyAnnotations[annotation][propertyAnnotation][sTermValue] = this.getPropertyValue(oXMLDoc, propertyAnnotationNode, oAlias);
					}

				}
				// --- Annotations ---
			} else {
				var mTarget;
				if (sContainerAnnotation) {
					// Target is an entity container
					if (!mappingList["EntityContainer"]) {
						mappingList["EntityContainer"] = {};
					}
					if (!mappingList["EntityContainer"][annotation]) {
						mappingList["EntityContainer"][annotation] = {};
					}
					mTarget = mappingList["EntityContainer"][annotation];
				} else {
					if (!mappingList[annotation]) {
						mappingList[annotation] = {};
					}
					mTarget = mappingList[annotation];
				}

				targetAnnotation = annotation.replace(oAlias[annotationNamespace], annotationNamespace);
				propertyAnnotationNodes = xPath.selectNodes(oXMLDoc, "./d:Annotation", annotationNode);
				for (var nodeIndexAnnotation = 0; nodeIndexAnnotation < propertyAnnotationNodes.length; nodeIndexAnnotation += 1) {
					propertyAnnotationNode = xPath.nextNode(propertyAnnotationNodes, nodeIndexAnnotation);
					annotationQualifier = annotationNode.getAttribute("Qualifier") || propertyAnnotationNode.getAttribute("Qualifier");
					annotationTerm = this.replaceWithAlias(propertyAnnotationNode.getAttribute("Term"), oAlias);
					if (annotationQualifier) {
						annotationTerm += "#" + annotationQualifier;
					}
					valueAnnotation = this.getPropertyValue(oXMLDoc, propertyAnnotationNode, oAlias);
					valueAnnotation = this.setEdmTypes(valueAnnotation, oMetadataProperties.types, annotation, oSchema);

					if (!sContainerAnnotation) {
						mTarget[annotationTerm] = valueAnnotation;
					} else {
						if (!mTarget[sContainerAnnotation]) {
							mTarget[sContainerAnnotation] = {};
						}
						mTarget[sContainerAnnotation][annotationTerm] = valueAnnotation;
					}

				}
				// --- Setup of Expand nodes. ---
				expandNodes = xPath.selectNodes(oXMLDoc, "//d:Annotations[contains(@Target, '" + targetAnnotation
						+ "')]//d:PropertyValue[contains(@Path, '/')]//@Path", oXMLDoc);
				for (i = 0; i < expandNodes.length; i += 1) {
					expandNode = xPath.nextNode(expandNodes, i);
					path = expandNode.value;
					if (mappingList.propertyAnnotations) {
						if (mappingList.propertyAnnotations[annotation]) {
							if (mappingList.propertyAnnotations[annotation][path]) {
								continue;
							}
						}
					}
					pathValues = path.split('/');
					if (!!this.findNavProperty(annotation, pathValues[0], this.oServiceMetadata)) {
						if (!mappingList.expand) {
							mappingList.expand = {};
						}
						if (!mappingList.expand[annotation]) {
							mappingList.expand[annotation] = {};
						}
						mappingList.expand[annotation][pathValues[0]] = pathValues[0];
					}
				}
				expandNodesApplFunc = xPath.selectNodes(oXMLDoc, "//d:Annotations[contains(@Target, '" + targetAnnotation
						+ "')]//d:Path[contains(., '/')]", oXMLDoc);
				for (i = 0; i < expandNodesApplFunc.length; i += 1) {
					expandNode = xPath.nextNode(expandNodesApplFunc, i);
					path = xPath.getNodeText(expandNode);
					if (
						mappingList.propertyAnnotations &&
						mappingList.propertyAnnotations[annotation] &&
						mappingList.propertyAnnotations[annotation][path]
					) {
						continue;
					}
					if (!mappingList.expand) {
						mappingList.expand = {};
					}
					if (!mappingList.expand[annotation]) {
						mappingList.expand[annotation] = {};
					}
					pathValues = path.split('/');
					if (!!this.findNavProperty(annotation, pathValues[0], this.oServiceMetadata)) {
						if (!mappingList.expand) {
							mappingList.expand = {};
						}
						if (!mappingList.expand[annotation]) {
							mappingList.expand[annotation] = {};
						}
						mappingList.expand[annotation][pathValues[0]] = pathValues[0];
					}
				}
			}
		}

		return mappingList;
	},


	/**
	 * Parses the alias definitions of the annotation document and fills the internal oAlias object.
	 *
	 * @param {object} oXMLDoc - The document containing the alias definitions
	 * @param {map} mAnnotationReferences - The annotation reference object (output)
	 * @param {map} mAlias - The alias reference object (output)
	 * @return {boolean} Whether references where found in the XML document
	 * @private
	 */
	_parseReferences: function(oXMLDoc, mAnnotationReferences, mAlias) {
		var bFound = false;

		var oNode, i;
		var xPath = this.getXPath();

		var sAliasSelector = "//edmx:Reference/edmx:Include[@Namespace and @Alias]";
		var oAliasNodes = xPath.selectNodes(oXMLDoc, sAliasSelector, oXMLDoc);
		for (i = 0; i < oAliasNodes.length; ++i) {
			bFound = true;
			oNode = xPath.nextNode(oAliasNodes, i);
			mAlias[oNode.getAttribute("Alias")] = oNode.getAttribute("Namespace");
		}


		var sReferenceSelector = "//edmx:Reference[@Uri]/edmx:IncludeAnnotations[@TermNamespace]";
		var oReferenceNodes = xPath.selectNodes(oXMLDoc, sReferenceSelector, oXMLDoc);
		for (i = 0; i < oReferenceNodes.length; ++i) {
			bFound = true;
			oNode = xPath.nextNode(oReferenceNodes, i);
			var sTermNamespace   = oNode.getAttribute("TermNamespace");
			var sTargetNamespace = oNode.getAttribute("TargetNamespace");
			var sReferenceUri    = oNode.parentNode.getAttribute("Uri");

			if (sTargetNamespace) {
				if (!mAnnotationReferences[sTargetNamespace]) {
					mAnnotationReferences[sTargetNamespace] = {};
				}
				mAnnotationReferences[sTargetNamespace][sTermNamespace] = sReferenceUri;
			} else {
				mAnnotationReferences[sTermNamespace] = sReferenceUri;
			}
		}

		return bFound;
	},

	getAllPropertiesMetadata: function(oMetadata) {
		var oMetadataSchema = {},
		oPropertyTypes = {},
		oPropertyExtensions = {},
		bPropertyExtensions = false,
		sNamespace,
		aEntityTypes,
		aComplexTypes,
		oEntityType = {},
		oProperties = {},
		oExtensions = {},
		bExtensions = false,
		oProperty,
		oComplexTypeProp,
		sPropertyName,
		sType,
		oPropExtension,
		oReturn = {
			types : oPropertyTypes
		};

		if (!oMetadata.dataServices.schema) {
			return oReturn;
		}

		for (var i = oMetadata.dataServices.schema.length - 1; i >= 0; i -= 1) {
			oMetadataSchema = oMetadata.dataServices.schema[i];
			if (oMetadataSchema.entityType) {
				sNamespace = oMetadataSchema.namespace;
				aEntityTypes = oMetadataSchema.entityType;
				aComplexTypes = oMetadataSchema.complexType;
				for (var j in aEntityTypes) {
					oEntityType = aEntityTypes[j];
					oExtensions = {};
					oProperties = {};
					if (oEntityType.hasStream && oEntityType.hasStream === "true") {
						continue;
					}
					for (var k in oEntityType.property) {
						oProperty = oEntityType.property[k];
						if (oProperty.type.substring(0, sNamespace.length) === sNamespace) {
							for (var l in aComplexTypes) {
								if (aComplexTypes[l].name === oProperty.type.substring(sNamespace.length + 1)) {
									for (k in aComplexTypes[l].property) {
										oComplexTypeProp = aComplexTypes[l].property[k];
										oProperties[aComplexTypes[l].name + "/" + oComplexTypeProp.name] = oComplexTypeProp.type;
									}
								}
							}
						} else {
							sPropertyName = oProperty.name;
							sType = oProperty.type;
							for (var p in oProperty.extensions) {
								oPropExtension = oProperty.extensions[p];
								if ((oPropExtension.name === "display-format") && (oPropExtension.value === "Date")) {
									sType = "Edm.Date";
								} else {
									bExtensions = true;
									if (!oExtensions[sPropertyName]) {
										oExtensions[sPropertyName] = {};
									}
									if (oPropExtension.namespace && !oExtensions[sPropertyName][oPropExtension.namespace]) {
										oExtensions[sPropertyName][oPropExtension.namespace] = {};
									}
									oExtensions[sPropertyName][oPropExtension.namespace][oPropExtension.name] = oPropExtension.value;
								}
							}
							oProperties[sPropertyName] = sType;
						}
					}
					if (!oPropertyTypes[sNamespace + "." + oEntityType.name]) {
						oPropertyTypes[sNamespace + "." + oEntityType.name] = {};
					}
					oPropertyTypes[sNamespace + "." + oEntityType.name] = oProperties;
					if (bExtensions) {
						if (!oPropertyExtensions[sNamespace + "." + oEntityType.name]) {
							bPropertyExtensions = true;
						}
						oPropertyExtensions[sNamespace + "." + oEntityType.name] = {};
						oPropertyExtensions[sNamespace + "." + oEntityType.name] = oExtensions;
					}
				}
			}
		}
		if (bPropertyExtensions) {
			oReturn = {
				types : oPropertyTypes,
				extensions : oPropertyExtensions
			};
		}
		return oReturn;
	},

	setEdmTypes: function(aPropertyValues, oProperties, sTarget, oSchema) {
		var oPropertyValue, sEdmType = '';
		for (var pValueIndex in aPropertyValues) {
			if (aPropertyValues[pValueIndex]) {
				oPropertyValue = aPropertyValues[pValueIndex];
				if (oPropertyValue.Value && oPropertyValue.Value.Path) {
					sEdmType = this.getEdmType(oPropertyValue.Value.Path, oProperties, sTarget, oSchema);
					if (sEdmType) {
						aPropertyValues[pValueIndex].EdmType = sEdmType;
					}
					continue;
				}
				if (oPropertyValue.Path) {
					sEdmType = this.getEdmType(oPropertyValue.Path, oProperties, sTarget, oSchema);
					if (sEdmType) {
						aPropertyValues[pValueIndex].EdmType = sEdmType;
					}
					continue;
				}
				if (oPropertyValue.Facets) {
					aPropertyValues[pValueIndex].Facets = this.setEdmTypes(oPropertyValue.Facets, oProperties, sTarget, oSchema);
					continue;
				}
				if (oPropertyValue.Data) {
					aPropertyValues[pValueIndex].Data = this.setEdmTypes(oPropertyValue.Data, oProperties, sTarget, oSchema);
					continue;
				}
				if (pValueIndex === "Data") {
					aPropertyValues.Data = this.setEdmTypes(oPropertyValue, oProperties, sTarget, oSchema);
					continue;
				}
				if (oPropertyValue.Value && oPropertyValue.Value.Apply) {
					aPropertyValues[pValueIndex].Value.Apply.Parameters = this.setEdmTypes(oPropertyValue.Value.Apply.Parameters,
							oProperties, sTarget, oSchema);
					continue;
				}
				if (oPropertyValue.Value && oPropertyValue.Type && (oPropertyValue.Type === "Path")) {
					sEdmType = this.getEdmType(oPropertyValue.Value, oProperties, sTarget, oSchema);
					if (sEdmType) {
						aPropertyValues[pValueIndex].EdmType = sEdmType;
					}
				}
			}
		}
		return aPropertyValues;
	},

	getEdmType: function(sPath, oProperties, sTarget, oSchema) {
		var iPos = sPath.indexOf("/");
		if (iPos > -1) {
			var sPropertyName = sPath.substr(0, iPos);
			var mNavProperty = this.findNavProperty(sTarget, sPropertyName, this.oServiceMetadata);
			
			if (mNavProperty) {
				var mToEntityType = this.oMetadata._getEntityTypeByNavPropertyObject(mNavProperty);

				if (mToEntityType) {
					sTarget = mToEntityType.entityType;
					sPath = sPath.substr(iPos + 1);
				}
			}
		}
		
		if ((sPath.charAt(0) === "@") && (sPath.indexOf(oSchema.Alias) === 1)) {
			sPath = sPath.slice(oSchema.Alias.length + 2);
		}
		if (sPath.indexOf("/") >= 0) {
			if (oProperties[sPath.slice(0, sPath.indexOf("/"))]) {
				sTarget = sPath.slice(0, sPath.indexOf("/"));
				sPath = sPath.slice(sPath.indexOf("/") + 1);
			}
		}
		for (var pIndex in oProperties[sTarget]) {
			if (sPath === pIndex) {
				return oProperties[sTarget][pIndex];
			}
		}
	},


	/**
	 * Returns a map of key value pairs corresponding to the attributes of the given Node -
	 * attributes named "Property", "Term" and "Qualifier" are ignored.
	 *
	 * @param {map} mAttributes - A map that may already contain attributes, this map will be filled and returned by this method
	 * @param {Node} oNode - The node with the attributes
	 * @param {map} mAlias - A map containing aliases that should be replaced in the attribute value
	 * @return {map} A map containing the attributes as key/value pairs
	 * @private
	 */
	enrichFromPropertyValueAttributes: function(mAttributes, oNode, mAlias) {
		var mIgnoredAttributes = { "Property" : true, "Term": true, "Qualifier": true };
		
		var fnReplaceAlias = function(sValue) {
			return this.replaceWithAlias(sValue, mAlias);
		}.bind(this);

		for (var i = 0; i < oNode.attributes.length; i += 1) {
			if (!mIgnoredAttributes[oNode.attributes[i].name]) {
				var sName = oNode.attributes[i].name;
				var sValue = oNode.attributes[i].value;
				
				// Special case: EnumMember can contain a space separated list of properties that must all have their
				// aliases replaced
				if (sName === "EnumMember" && sValue.indexOf(" ") > -1) {
					var aValues = sValue.split(" ");
					mAttributes[sName] = aValues.map(fnReplaceAlias).join(" ");
				} else {
					mAttributes[sName] = this.replaceWithAlias(sValue, mAlias);
				}
			}
		}

		return mAttributes;
	},

	/**
	 * Returns a property value object for the given nodes
	 *
	 * @param {Document} oXmlDoc - The XML document that is parsed
	 * @param {map} mAlias - Alias map
	 * @param {XPathResult} oNodeList - As many nodes as should be checked for Record values
	 * @return {object|object[]} The extracted values
	 * @private
	 */
	_getRecordValues: function(oXmlDoc, mAlias, oNodeList) {
		var aNodeValues = [];
		var xPath = this.getXPath();

		for (var i = 0; i < oNodeList.length; ++i) {
			var oNode = xPath.nextNode(oNodeList, i);
			var vNodeValue = this.getPropertyValues(oXmlDoc, oNode, mAlias);

			var sType = oNode.getAttribute("Type");
			if (sType) {
				vNodeValue["RecordType"] = this.replaceWithAlias(sType, mAlias);
			}

			aNodeValues.push(vNodeValue);
		}

		return aNodeValues;
	},

	/**
	 * Extracts the text value from all nodes in the given NodeList and puts them into an array
	 *
	 * @param {Document} oXmlDoc - The XML document that is parsed
	 * @param {XPathResult} oNodeList - As many nodes as should be checked for Record values
	 * @param {map} [mAlias] - If this map is given, alias replacement with the given values will be performed on the found text
	 * @return {object[]} Array of values
	 * @private
	 */
	_getTextValues: function(oXmlDoc, oNodeList, mAlias) {
		var aNodeValues = [];
		var xPath = this.getXPath();

		for (var i = 0; i < oNodeList.length; i += 1) {
			var oNode = xPath.nextNode(oNodeList, i);
			var oValue = {};
			var sText = xPath.getNodeText(oNode);
			// TODO: Is nodeName correct or should we remove the namespace?
			oValue[oNode.nodeName] = mAlias ? this.replaceWithAlias(sText, mAlias) : sText;
			aNodeValues.push(oValue);
		}

		return aNodeValues;
	},

	/**
	 * Returns the text value of a given node and does an alias replacement if neccessary.
	 *
	 * @param {Node} oNode - The Node of which the text value should be determined
	 * @param {map} mAlias - The alias map
	 * @return {string} The text content
	 */
	_getTextValue: function(oNode, mAlias) {
		var xPath = this.getXPath();

		var sValue = "";
		if (oNode.nodeName in mAliasNodeWhitelist) {
			sValue = this.replaceWithAlias(xPath.getNodeText(oNode), mAlias);
		} else {
			sValue = xPath.getNodeText(oNode);
		}
		if (oNode.nodeName !== "String") {
			// Trim whitespace if it's not specified as string value
			sValue = sValue.trim();
		}
		return sValue;
	},

	getPropertyValue: function(oXmlDocument, oDocumentNode, mAlias) {
		var xPath = this.getXPath();

		var vPropertyValue = oDocumentNode.nodeName === "Collection" ? [] : {};

		if (oDocumentNode.hasChildNodes()) {
			// This is a complex value, check for child values

			var oRecordNodeList = xPath.selectNodes(oXmlDocument, "./d:Record", oDocumentNode);
			var aRecordValues = this._getRecordValues(oXmlDocument, mAlias, oRecordNodeList);

			var oCollectionRecordNodeList = xPath.selectNodes(oXmlDocument, "./d:Collection/d:Record | ./d:Collection/d:If/d:Record", oDocumentNode);
			var aCollectionRecordValues = this._getRecordValues(oXmlDocument, mAlias, oCollectionRecordNodeList);

			var aPropertyValues = aRecordValues.concat(aCollectionRecordValues);
			if (aPropertyValues.length > 0) {
				if (oCollectionRecordNodeList.length === 0 && oRecordNodeList.length > 0) {
					// Record without a collection, only ise the first one (there should be only one)
					vPropertyValue = aPropertyValues[0];
				} else {
					vPropertyValue = aPropertyValues;
				}
			} else {
				var oCollectionNodes = xPath.selectNodes(oXmlDocument, "./d:Collection/d:AnnotationPath | ./d:Collection/d:PropertyPath", oDocumentNode);

				if (oCollectionNodes.length > 0) {
					vPropertyValue = this._getTextValues(oXmlDocument, oCollectionNodes, mAlias);
				} else {

					var oChildNodes = xPath.selectNodes(oXmlDocument, "./d:*[not(local-name() = \"Annotation\")]", oDocumentNode);
					if (oChildNodes.length > 0) {
						// Now get all values for child elements
						for (var i = 0; i < oChildNodes.length; i++) {
							var oChildNode = xPath.nextNode(oChildNodes, i);
							var vValue;

							var sNodeName = oChildNode.nodeName;
							var sParentName = oChildNode.parentNode.nodeName;

							if (sNodeName === "Apply") {
								vValue = this.getApplyFunctions(oXmlDocument, oChildNode, mAlias);
							} else {
								vValue = this.getPropertyValue(oXmlDocument, oChildNode, mAlias);									
							}

							// For dynamic expressions, add a Parameters Array so we can iterate over all parameters in
							// their order within the document
							if (mMultipleArgumentDynamicExpressions[sParentName]) {
								if (!Array.isArray(vPropertyValue)) {
									vPropertyValue = [];
								}

								var mValue = {};
								mValue[sNodeName] = vValue;
								vPropertyValue.push(mValue);
							} else if (sNodeName === "Collection") {
								// Collections are lists by definition and thus should be parsed as arrays
								vPropertyValue = vValue;
							} else {
								if (vPropertyValue[sNodeName]) {
									jQuery.sap.log.warning(
										"Annotation contained multiple " + sNodeName + " values. Only the last " +
										"one will be stored: " + xPath.getPath(oChildNode)
									);
								}
								vPropertyValue[sNodeName] = vValue;
							}
						}
					} else if (oDocumentNode.nodeName in mTextNodeWhitelist) {
						vPropertyValue = this._getTextValue(oDocumentNode, mAlias);
					}
					
					this.enrichFromPropertyValueAttributes(vPropertyValue, oDocumentNode, mAlias);
				}
			}
		} else if (oDocumentNode.nodeName in mTextNodeWhitelist) {
			vPropertyValue = this._getTextValue(oDocumentNode, mAlias);
		} else if (oDocumentNode.nodeName.toLowerCase() === "null") {
			vPropertyValue = null;
		} else {
			this.enrichFromPropertyValueAttributes(vPropertyValue, oDocumentNode, mAlias);
		}
		return vPropertyValue;
	},

	/**
	 * Returns a map with all Annotation- and PropertyValue-elements of the given Node. The properties of the returned
	 * map consist of the PropertyValue's "Property" attribute or the Annotation's "Term" attribute.
	 * 
	 * @param {Document} oXmlDocument - The document to use for the node search
	 * @param {Element} oParentElement - The parent element in which to search
	 * @param {map} mAlias - The alias map used in {@link ODataAnnotations#replaceWithAlias}
	 * @returns {map} The collection of record values and annotations as a map
	 * @private
	 */
	getPropertyValues: function(oXmlDocument, oParentElement, mAlias) {
		var mProperties = {}, i; 
		var xPath = this.getXPath();

		var oAnnotationNodes = xPath.selectNodes(oXmlDocument, "./d:Annotation", oParentElement);
		var oPropertyValueNodes = xPath.selectNodes(oXmlDocument, "./d:PropertyValue", oParentElement);

		jQuery.sap.assert(oAnnotationNodes.length === 0 || oPropertyValueNodes.length === 0, function () {
			return (
				"Record contains PropertyValue and Annotation elements, this is not allowed and might lead to " +
				"annotation values being overwritten. Element: " + xPath.getPath(oParentElement)
			);
		});

		if (oAnnotationNodes.length === 0 && oPropertyValueNodes.length === 0) {
			mProperties = this.getPropertyValue(oXmlDocument, oParentElement, mAlias);
		} else {
			for (i = 0; i < oAnnotationNodes.length; i++) {
				var oAnnotationNode = xPath.nextNode(oAnnotationNodes, i);
				var sTerm = this.replaceWithAlias(oAnnotationNode.getAttribute("Term"), mAlias);
				mProperties[sTerm] = this.getPropertyValue(oXmlDocument, oAnnotationNode, mAlias);
			}

			for (i = 0; i < oPropertyValueNodes.length; i++) {
				var oPropertyValueNode = xPath.nextNode(oPropertyValueNodes, i);
				var sPropertyName = oPropertyValueNode.getAttribute("Property");
				mProperties[sPropertyName] = this.getPropertyValue(oXmlDocument, oPropertyValueNode, mAlias);
				
				var oApplyNodes = xPath.selectNodes(oXmlDocument, "./d:Apply", oPropertyValueNode);
				for (var n = 0; n < oApplyNodes.length; n += 1) {
					var oApplyNode = xPath.nextNode(oApplyNodes, n);
					mProperties[sPropertyName] = {};
					mProperties[sPropertyName]['Apply'] = this.getApplyFunctions(oXmlDocument, oApplyNode, mAlias);
				}
			}
		}

		return mProperties;
	},

	getApplyFunctions: function(xmlDoc, applyNode, mAlias) {
		var xPath = this.getXPath();

		var mApply = {
			Name: applyNode.getAttribute('Function'),
			Parameters: []
		};

		var oParameterNodes = xPath.selectNodes(xmlDoc, "./d:*", applyNode);
		for (var i = 0; i < oParameterNodes.length; i += 1) {
			var oParameterNode = xPath.nextNode(oParameterNodes, i);
			var mParameter = {
				Type:  oParameterNode.nodeName
			};

			if (oParameterNode.nodeName === "Apply") {
				mParameter.Value = this.getApplyFunctions(xmlDoc, oParameterNode);
			} else if (oParameterNode.nodeName === "LabeledElement") {
				mParameter.Value = this.getPropertyValue(xmlDoc, oParameterNode, mAlias);
				
				// Move the name attribute up one level to keep compatibility with earlier implementation
				mParameter.Name = mParameter.Value.Name;
				delete mParameter.Value.Name;
			} else if (mMultipleArgumentDynamicExpressions[oParameterNode.nodeName]) {
				mParameter.Value = this.getPropertyValue(xmlDoc, oParameterNode, mAlias);
			} else {
				mParameter.Value = xPath.getNodeText(oParameterNode);
			}

			mApply.Parameters.push(mParameter);
		}

		return mApply;
	},

	/**
	 * Returns true if the given path combined with the given entity-type is found in the
	 * given metadata
	 *
	 * @param {string} sEntityType - The entity type to look for
	 * @param {string} sPathValue - The path to look for
	 * @param {object} oMetadata - The service's metadata object to search in
	 * @returns {boolean} True if the path/entityType combination is found
	 */
	findNavProperty: function(sEntityType, sPathValue, oMetadata) {
		for (var i = oMetadata.dataServices.schema.length - 1; i >= 0; i -= 1) {
			var oMetadataSchema = oMetadata.dataServices.schema[i];
			if (oMetadataSchema.entityType) {
				var sNamespace = oMetadataSchema.namespace + ".";
				var aEntityTypes = oMetadataSchema.entityType;
				for (var k = aEntityTypes.length - 1; k >= 0; k -= 1) {
					if (sNamespace + aEntityTypes[k].name === sEntityType && aEntityTypes[k].navigationProperty) {
						for (var j = 0; j < aEntityTypes[k].navigationProperty.length; j += 1) {
							if (aEntityTypes[k].navigationProperty[j].name === sPathValue) {
								return aEntityTypes[k].navigationProperty[j];
							}
						}
					}
				}
			}
		}
		return null;
	},

	/**
	 * Replaces the first alias (existing as key in the map) found in the given string with the
	 * respective value in the map if it is not directly behind a ".". By default only one
	 * replacement is done, unless the iReplacements parameter is set to a higher number or 0
	 *
	 * @param {string} sValue - The string where the alias should be replaced
	 * @param {map} mAlias - The alias map with the alias as key and the target value as value
	 * @param {int} iReplacements - The number of replacements to doo at most or 0 for all
	 * @return {string} The string with the alias replaced
	 */
	replaceWithAlias: function(sValue, mAlias, iReplacements) {
		if (iReplacements === undefined) {
			iReplacements = 1;
		}

		for (var sAlias in mAlias) {
			if (sValue.indexOf(sAlias + ".") >= 0 && sValue.indexOf("." + sAlias + ".") < 0) {
				sValue = sValue.replace(sAlias + ".", mAlias[sAlias] + ".");

				iReplacements--;
				if (iReplacements === 0) {
					return sValue;
				}
			}
		}
		return sValue;
	},




	getXPath: function() {
		var xPath = {};

		if (Device.browser.internet_explorer) {// old IE
			xPath = {
				setNameSpace : function(outNode) {
					outNode.setProperty("SelectionNamespaces",
							'xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" xmlns:d="http://docs.oasis-open.org/odata/ns/edm"');
					outNode.setProperty("SelectionLanguage", "XPath");
					return outNode;
				},
				selectNodes : function(outNode, xPath, inNode) {
					return inNode.selectNodes(xPath);
				},
				nextNode : function(node) {
					return node.nextNode();
				},
				getNodeText : function(node) {
					return node.text;
				}
			};
		} else {// Chrome, Firefox, Opera, etc.
			xPath = {
				setNameSpace : function(outNode) {
					return outNode;
				},
				nsResolver : function(prefix) {
					var ns = {
						"edmx" : "http://docs.oasis-open.org/odata/ns/edmx",
						"d" : "http://docs.oasis-open.org/odata/ns/edm"
					};
					return ns[prefix] || null;
				},
				selectNodes : function(outNode, sPath, inNode) {
					var xmlNodes = outNode.evaluate(sPath, inNode, this.nsResolver, /* ORDERED_NODE_SNAPSHOT_TYPE: */ 7, null);
					xmlNodes.length = xmlNodes.snapshotLength;
					return xmlNodes;
				},
				nextNode : function(node, item) {
					return node.snapshotItem(item);
				},
				getNodeText : function(node) {
					return node.textContent;
				}
			};
		}
		
		xPath.getPath = function(oNode) {
			var sPath = "";
			var sId = "getAttribute" in oNode ? oNode.getAttribute("id") : "";
			var sTagName = oNode.tagName ? oNode.tagName : "";
			
		    if (sId) {
				// If node has an ID, use that
				sPath = 'id("' + sId + '")';
			} else if (oNode instanceof Document) {
				sPath = "/";
			} else if (sTagName.toLowerCase() === "body") {
				// If node is the body element, just return its tag name
				sPath = sTagName;
			} else if (oNode.parentNode) {
				// Count the position in the parent and get the path of the parent recursively
				
				var iPos = 1;
				for (var i = 0; i < oNode.parentNode.childNodes.length; ++i) {
					if (oNode.parentNode.childNodes[i] === oNode) {
						// Found the node inside its parent
						sPath = xPath.getPath(oNode.parentNode) +  "/" + sTagName + "[" + iPos + "]";
						break;
					} else if (oNode.parentNode.childNodes[i].nodeType === 1 && oNode.parentNode.childNodes[i].tagName === sTagName) {
						// In case there are other elements of the same kind, count them
						++iPos;
					}
				}
			} else {
				jQuery.sap.log.error("Wrong Input node - cannot find XPath to it: " + sTagName);
			}
			
			return sPath;
		};
		
		return xPath;
	}
	
};


return AnnotationsParser;

});