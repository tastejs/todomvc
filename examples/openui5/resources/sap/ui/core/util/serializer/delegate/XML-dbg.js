/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './Delegate'],
	function(jQuery, Delegate) {
	"use strict";


	
	/**
	 * XML serializer delegate class. Called by the serializer instance.
	 *
	 * @param {string} [sDefaultXmlNamespace] defines the default XML namespace
	 * @param {function} [fnGetControlId] delegate function which returns the control id
	 * @param {function} [fnGetEventHandlerName] delegate function which returns the event handler name
	 * @param {function} [fnMemorizePackage] a delegate function to memorize the control packages
	 *
	 * @public
	 * @class XML serializer delegate class.
	 * @extends sap.ui.core.util.serializer.delegate.Delegate
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.util.serializer.delegate.XML
	 * @experimental Since 1.15.1. The XML serializer delegate is still under construction, so some implementation details can be changed in future.
	 */
	var XML = Delegate.extend("sap.ui.core.util.serializer.delegate.XML", /** @lends sap.ui.core.util.serializer.delegate.XML.prototype */
	{
		constructor : function (sDefaultNamespace, fnGetControlId, fnGetEventHandlerName, fnMemorizePackage) {
			Delegate.apply(this);
			this._sDefaultNamespace = sDefaultNamespace;
			this._fnGetControlId = fnGetControlId;
			this._fnMemorizePackage = fnMemorizePackage;
			this._fnGetEventHandlerName = fnGetEventHandlerName;
		}
	});
	
	
	/**
	 * Delegate method "startAggregation".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @return {string} the created string.
	 */
	XML.prototype.startAggregation = function (oControl, sAggregationName) {
		return '<' + this._createAggregationName(oControl, sAggregationName) + '>';
	};
	
	
	/**
	 * Delegate method "endAggregation".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @return {string} the created string.
	 */
	XML.prototype.endAggregation = function (oControl, sAggregationName) {
		return '</' + this._createAggregationName(oControl, sAggregationName) + '>';
	};
	
	
	/**
	 * Delegate method "start".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @param {boolean} isDefaultAggregation Whether the aggregation is the default aggregation.
	 * @return {string} the created string.
	 */
	XML.prototype.start = function (oControl, sAggregationName, isDefaultAggregation) {
		return "<" + this._createTagName(oControl);
	};
	
	
	/**
	 * Delegate method "end".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @param {boolean} isDefaultAggregation Whether the aggregation is the default aggregation.
	 * @return {string} the created string.
	 */
	XML.prototype.end = function (oControl, sAggregationName, isDefaultAggregation) {
		return "</" + this._createTagName(oControl) + ">";
	};
	
	
	/**
	 * Delegate method "middle".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @param {boolean} isDefaultAggregation Whether the aggregation is the default aggregation.
	 * @return {string} the created string.
	 */
	XML.prototype.middle = function (oControl, sAggregationName, isDefaultAggregation) {
	
		var aXml = [];
		
		// write non-generated Ids
		var sId = (this._fnGetControlId) ? this._fnGetControlId(oControl) : oControl.getId();
		if (sId.indexOf("__") !== 0) {
			aXml.push(this._createAttribute("id", sId));
		}
	
		// write classes
		if (oControl.aCustomStyleClasses) {
			var aCustomClasses = oControl.aCustomStyleClasses;
			var aCssClasses = [];
			for (var i = 0; i < aCustomClasses.length; i++) {
				var sCssClass = aCustomClasses[i];
				if (!jQuery.sap.startsWith(sCssClass, "sapM") && !jQuery.sap.startsWith(sCssClass, "sapUi")) {
					aCssClasses.push(sCssClass);
				}
			}
			if (aCssClasses.length > 0) {
				aXml.push(this._createAttribute("class", aCssClasses.join(" ")));
			}
		}
	
		// write events
		if (this._fnGetEventHandlerName) {
			var oEvents = oControl.getMetadata().getAllEvents();
			for (var sEvent in oEvents) {
				if (oControl.hasListeners(sEvent)) {
					var aEvents = oControl.mEventRegistry[sEvent];
					for (var i = 0; i < aEvents.length; i++) {
						var sHandlerName = this._fnGetEventHandlerName(aEvents[i]);
						if (sHandlerName) {
							aXml.push(this._createAttribute(sEvent, sHandlerName));
							break; // there can be only one event in declarative views
						}
					}
				}
			}
		}
	
		// write associations
		var oAssociations = oControl.getMetadata().getAllAssociations();
		this._createAttributes(aXml, oControl, oAssociations, function (sName, oValue) {
			if (oAssociations[sName].multiple) {
				return oValue.join(" ");
			}
			return oValue;
		}, function (sName, oValue) {
			return (oValue !== null && typeof oValue !== undefined && oValue !== "");
		});
	
		// write properties
		var oProperties = oControl.getMetadata().getAllProperties();
		this._createAttributes(aXml, oControl, oProperties, null, function (sName, oValue) {
			return (!!oControl.getBindingInfo(sName) || (oValue !== null && typeof oValue !== undefined && oValue !== ""));
		});
	
		// write aggregations
		var oAggregations = oControl.getMetadata().getAllAggregations();
		this._createAttributes(aXml, oControl, oAggregations, null, function (sName, oValue) {
			if (!oControl.getBindingInfo(sName) && (!oValue || (typeof oValue !== "string"))) {
				return false;
			}
			return true;
		});
	
		// write end of tag
		aXml.push('>');
		
		return aXml.join('');
	};
	
	
	
	/**
	 * Serializes the attributes for a given control and properties
	 * 
	 * @param {string[]} aXml The serialized XML.
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {object} oObj The object to serialize the properties from.
	 * @param {function} [fnGetValue] A delegate function to retrieve the value. 
	 * @param {function} [fnValueCheck] A delegate function to check the value.
	 * @private
	 */
	XML.prototype._createAttributes = function (aXml, oControl, oObj, fnGetValue, fnValueCheck) {
		for (var sName in oObj) {
			var oProp = oObj[sName];
			var sGetter = oProp._sGetter;
			if (oControl[sGetter]) {
				var oValue = oControl[sGetter]();
				oValue = fnGetValue ? fnGetValue(sName, oValue) : oValue;
				if (!oControl.getBindingInfo(sName)) {
					if (!jQuery.sap.equal(oValue,oProp.defaultValue)) {
						if (!fnValueCheck || fnValueCheck(sName, oValue)) {
							aXml.push(this._createAttribute(sName, oValue));
						}
					}
				} else {
					aXml.push(this._createDataBindingAttribute(oControl, sName, oValue));
				}
			}
		}
	};
	
	
	/**
	 * Creates a data binding attribute.
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sName The name of the property
	 * @param {object} oValue The value of the property.
	 * @return {string} The created data binding attribute.
	 * @private
	 */
	XML.prototype._createDataBindingAttribute = function (oControl, sName, oValue) {
			
		var oBindingInfo = oControl.getBindingInfo(sName);
		var sBindingValue = null;
		var oPath = oValue;
	
		if (!oBindingInfo.bindingString) {
			if (oBindingInfo.binding) {
				var sClassName = oBindingInfo.binding.getMetadata().getName();
				if (sClassName === "sap.ui.model.PropertyBinding" || sClassName === "sap.ui.model.resource.ResourcePropertyBinding") {
					sBindingValue = oBindingInfo.binding.getValue();
				}
			}
	
			if (oBindingInfo.parts) {
				oBindingInfo = oBindingInfo.parts[0];
			}
	
			var sModel = oBindingInfo.model;
	
			// TODO: Properties Panel should edit I18n Model directly!
			if (sBindingValue === oValue || sBindingValue === null) {
				oPath = "{" + (sModel ? (sModel + ">" + oBindingInfo.path) : oBindingInfo.path) + "}";
			}
		} else {
			oPath = oBindingInfo.bindingString;
		}
	
		return this._createAttribute(sName, oPath);
	};
	
	
	/**
	 * Creates an attribute string.
	 * 
	 * @param {string} sAttribute The name of the attribute.
	 * @param {object} oValue The value of the attribute.
	 * @return {string} The created attribute string.
	 * @private
	 */
	XML.prototype._createAttribute = function (sAttribute, oValue) {
		return ' ' + sAttribute + '="' + oValue + '"';
	};
	
	
	/**
	 * Creates the tag name string for a given control
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @return {string} The tag name.
	 * @private
	 */
	XML.prototype._createTagName = function (oControl) {
		
		// compute those names
		var sClassName = oControl.getMetadata()._sClassName;
		var iLastDot = sClassName.lastIndexOf(".");
		var sControlName = (iLastDot === -1) ? sClassName : sClassName.substring(iLastDot + 1);
		var sPackageName = (iLastDot === -1) ? sClassName : sClassName.substring(0, iLastDot);
	
		// memorize package
		if (this._fnMemorizePackage) {
			this._fnMemorizePackage(oControl, sPackageName);
		}
	
		// done
		return this._createNamespace(sPackageName, sControlName);
	};
	
	
	/**
	 * Creates the aggregation name string for a given control
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @return {string} The aggregation name string.
	 * @private
	 */
	XML.prototype._createAggregationName = function (oControl, sAggregationName) {
		
		// compute those names
		var sClassName = oControl.getMetadata()._sClassName;
		var iLastDot = sClassName.lastIndexOf(".");
		var sPackageName = (iLastDot === -1) ? sClassName : sClassName.substring(0, iLastDot);
	
		// done
		return this._createNamespace(sPackageName, sAggregationName);
	};
	
	
	/**
	 * Creates the namespace string.
	 * 
	 * @param {string} sNamespace The namespace string to use
	 * @param {string} sName The name string to use
	 * @return {string} The namespace string.
	 * @private
	 */
	XML.prototype._createNamespace = function (sNamespace, sName) {
		if (this._sDefaultNamespace && this._sDefaultNamespace === sNamespace) {
			return sName;
		} else {
			return sNamespace + ":" + sName;
		}
	};

	return XML;

});
