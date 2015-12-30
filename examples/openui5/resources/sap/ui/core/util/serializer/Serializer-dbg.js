/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider'],
	function(jQuery, EventProvider) {
	"use strict";


	/**
	 * Serializer class. Iterates over all controls and call a given serializer delegate.
	 *
	 * @param {sap.ui.core.Control|sap.ui.core.UIArea} oRootControl the root control to serialize
	 * @param {object} serializeDelegate the serializer delegate. Has to implement start/middle/end methods.
	 * @param {boolean} bSkipRoot whether to skip the root node or not
	 * @param {booolean} fnSkipAggregations whether to skip aggregations
	 *
	 * @public
	 * @class Serializer class.
	 * @extends sap.ui.base.EventProvider
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.util.serializer.Serializer
	 * @experimental Since 1.15.1. The Serializer is still under construction, so some implementation details can be changed in future.
	 */
	var Serializer = EventProvider.extend("sap.ui.core.util.serializer.Serializer", /** @lends sap.ui.core.util.serializer.Serializer.prototype */
	{
		constructor : function (oRootControl, serializeDelegate, bSkipRoot, oWindow, fnSkipAggregations) {
			EventProvider.apply(this);
			this._oRootControl = oRootControl;
			this._delegate = serializeDelegate;
			this._bSkipRoot = !!bSkipRoot;
			this._oWindow = oWindow || window;
			this._fnSkipAggregations = fnSkipAggregations;
		}
	});
	
	/**
	 * Serializes the complete control tree.
	 *
	 * @returns {string} the serialized control tree.
	 */
	Serializer.prototype.serialize = function () {
		return this._serializeRecursive(this._oRootControl, 0);
	};
	
	/**
	 * Internal method for recursive serializing
	 *
	 * @param {sap.ui.core.Control|sap.ui.core.UIArea} oControl The current control to process.
	 * @param {int} iLevel The nesting level of the recursion.
	 * @param {string} sAggregationName The name of the aggregation which aggregates the control.
	 * @param {boolean} isDefaultAggregation whether the aggregation is the default aggregation.
	 * @returns {string} the serialized control tree.
	 */
	Serializer.prototype._serializeRecursive = function (oControl, iLevel, sAggregationName, isDefaultAggregation) {
	
		jQuery.sap.assert(typeof oControl !== "undefined", "The control must not be undefined");
	
		var aCode = [];
	
		var bWriteDelegate = (!this._bSkipRoot || iLevel !== 0);
		if (bWriteDelegate) {
	
			// write start and end
			var start = this._delegate.start(oControl, sAggregationName, isDefaultAggregation);
			var middle = this._delegate.middle(oControl, sAggregationName, isDefaultAggregation);
			aCode.push(start + middle);
		}
	
		// step down into recursion along the aggregations
		if (iLevel === 0 || !(this._fnSkipAggregations && this._fnSkipAggregations(oControl))) {
			var mAggregations = oControl.getMetadata().getAllAggregations();
			if (mAggregations) {
				for (var sName in mAggregations) {
	
					// compute those elements that shall be serialized
					var mElementsToSerialize = [];
					var oAggregation = mAggregations[sName];
					var oValue = oControl[oAggregation._sGetter]();
					if (oControl.getBindingPath(sName) && oControl.getBindingInfo(sName).template) {
						mElementsToSerialize.push(oControl.getBindingInfo(sName).template);
					} else if (oValue && oValue.length) { // TODO: ARRAY CHECK
						for (var i = 0 ; i < oValue.length ; i++) {
							var oObj = oValue[i];
							if (oObj instanceof this._oWindow.sap.ui.core.Element) {
								mElementsToSerialize.push(oObj);
							}
						}
					} else if (oValue instanceof this._oWindow.sap.ui.core.Element) {
						mElementsToSerialize.push(oValue);
					}
	
					// write and step down into recursion for elements
					if (mElementsToSerialize.length > 0) {
						if (bWriteDelegate) {
							aCode.push(this._delegate.startAggregation(oControl, sName));
						}
						var isDefault = this._isDefaultAggregation(oControl, sName);
						for (var i = 0 ; i < mElementsToSerialize.length ; i++) {
							aCode.push(this._serializeRecursive(mElementsToSerialize[i], iLevel + 1, sName, isDefault));
						}
						if (bWriteDelegate) {
							aCode.push(this._delegate.endAggregation(oControl, sName));
						}
					}
				}
			}
		}
	
		// write end
		if (bWriteDelegate) {
			var end = this._delegate.end(oControl, sAggregationName, isDefaultAggregation);
			aCode.push(end);
		}
	
		return aCode.join("");
	};
	
	/**
	 * Checks if a given aggregation is the default aggregation.
	 *
	 * @param {sap.ui.core.Control|sap.ui.core.UIArea} oControl The current control to process.
	 * @param {string} sAggregationName The name of the aggregation.
	 * @returns {boolean} Whether the given aggregation is the default aggregation or not
	 * @private
	 */
	Serializer.prototype._isDefaultAggregation = function (oControl, sAggregationName) {
		return oControl.getMetadata().getDefaultAggregationName() === sAggregationName;
	};

	return Serializer;

});
