/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './Delegate'],
	function(jQuery, Delegate) {
	"use strict";


	
	/**
	 * HTML serializer delegate class. Called by the serializer instance.
	 *
	 * @param {function} [fnGetControlId] delegate function which returns the control id
	 * @param {function} [fnGetEventHandlerName] delegate function which returns the event handler name
	 *
	 * @public
	 * @class HTML serializer delegate class.
	 * @extends sap.ui.core.util.serializer.delegate.Delegate
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.util.serializer.delegate.HTML
	 * @experimental Since 1.15.1. The HTML serializer delegate is still under construction, so some implementation details can be changed in future.
	 */
	var HTML = Delegate.extend("sap.ui.core.util.serializer.delegate.HTML", /** @lends sap.ui.core.util.serializer.delegate.HTML.prototype */
	{
		constructor : function (fnGetControlId, fnGetEventHandlerName) {
			Delegate.apply(this);
			this._fnGetControlId = fnGetControlId;
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
	HTML.prototype.startAggregation = function (oControl, sAggregationName) {
		return '<div data-sap-ui-aggregation="' + sAggregationName + '">';
	};
	
	
	/**
	 * Delegate method "endAggregation".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @return {string} the created string.
	 */
	HTML.prototype.endAggregation = function (oControl, sAggregationName) {
		return '</div>';
	};
	
	
	/**
	 * Delegate method "start".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @param {boolean} isDefaultAggregation Whether the aggregation is the default aggregation.
	 * @return {string} the created string.
	 */
	HTML.prototype.start = function (oControl, sAggregationName, isDefaultAggregation) {
		return "<div";
	};
	
	
	/**
	 * Delegate method "middle".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @param {boolean} isDefaultAggregation Whether the aggregation is the default aggregation.
	 * @return {string} the created string.
	 */
	HTML.prototype.middle = function (oControl, sAggregationName, isDefaultAggregation) {
		
		var aHtml = [];
		
		// write non-generated Ids
		var sId = (this._fnGetControlId) ? this._fnGetControlId(oControl) : oControl.getId();
		if (sId.indexOf("__") !== 0) {
			aHtml.push(this._createAttribute("id", sId));
		}
		
		// write type
		aHtml.push(this._createAttribute("data-sap-ui-type", oControl.getMetadata()._sClassName));
	
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
				aHtml.push(this._createAttribute("class", aCssClasses.join(" ")));
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
							aHtml.push(this._createAttribute("data-" + this._createHtmlAttributeName(sEvent), sHandlerName));
							break; // there can be only one event in declarative views
						}
					}
				}
			}
		}
	
		// write associations
		var oAssociations = oControl.getMetadata().getAllAssociations();
		this._createAttributes(aHtml, oControl, oAssociations, function (sName, oValue) {
			if (oAssociations[sName].multiple) {
				return oValue.join(" ");
			}
			return oValue;
		}, function (sName, oValue) {
			return (oValue !== null && typeof oValue !== undefined && oValue !== "");
		});
	
		// write properties
		var oProperties = oControl.getMetadata().getAllProperties();
		this._createAttributes(aHtml, oControl, oProperties, null, function (sName, oValue) {
			return (!!oControl.getBindingInfo(sName) || (oValue !== null && typeof oValue !== undefined && oValue !== ""));
		});
	
		// write aggregations
		var oAggregations = oControl.getMetadata().getAllAggregations();
		this._createAttributes(aHtml, oControl, oAggregations, null, function (sName, oValue) {
			if (!oControl.getBindingInfo(sName) && (!oValue || (typeof oValue !== "string"))) {
				return false;
			}
			return true;
		});
	
		aHtml.push('>');
		return aHtml.join('');
	};
	
	
	/**
	 * Delegate method "end".
	 * 
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {string} sAggregationName The current aggregation name.
	 * @param {boolean} isDefaultAggregation Whether the aggregation is the default aggregation.
	 * @return {string} the created string.
	 */
	HTML.prototype.end = function (oControl, sAggregationName, isDefaultAggregation) {
		return "</div>";
	};
	
	
	/**
	 * Serializes the attributes for a given control and properties
	 * 
	 * @param {string[]} aHtml The serialized HTML.
	 * @param {sap.ui.core.Control} oControl The current control to process.
	 * @param {object} oObj The object to serialize the properties from.
	 * @param {function} [fnGetValue] A delegate function to retrieve the value. 
	 * @param {function} [fnValueCheck] A delegate function to check the value.
	 * @private
	 */
	HTML.prototype._createAttributes = function (aHtml, oControl, oObj, fnGetValue, fnValueCheck) {
		for (var sName in oObj) {
			var oProp = oObj[sName];
			var sGetter = oProp._sGetter;
			if (oControl[sGetter]) {
				var oValue = oControl[sGetter]();
				oValue = fnGetValue ? fnGetValue(sName, oValue) : oValue;
				if (!oControl.getBindingInfo(sName)) {
					if (!jQuery.sap.equal(oValue,oProp.defaultValue)) {
						if (!fnValueCheck || fnValueCheck(sName, oValue)) {
							aHtml.push(this._createAttribute("data-" + this._createHtmlAttributeName(sName), oValue));
						}
					}
				} else {
					aHtml.push(this._createDataBindingAttribute(oControl, sName, oValue));
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
	HTML.prototype._createDataBindingAttribute = function (oControl, sName, oValue) {
			
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
	
		return this._createAttribute("data-" + this._createHtmlAttributeName(sName), oPath);
	};
	
	
	/**
	 * Creates an attribute string.
	 * 
	 * @param {string} sAttribute The name of the attribute.
	 * @param {object} oValue The value of the attribute.
	 * @return {string} The created attribute string.
	 * @private
	 */
	HTML.prototype._createAttribute = function (sAttribute, oValue) {
		return ' ' + sAttribute + '="' + oValue + '"';
	};
	
	
	/**
	 * Creates the HTML attribute name.
	 * 
	 * @param {string} sName The name of the attribute.
	 * @return {string} The created attribute name.
	 * @private
	 */
	HTML.prototype._createHtmlAttributeName = function (sName) {
		return jQuery.sap.hyphen(sName);
	};

	return HTML;

});
