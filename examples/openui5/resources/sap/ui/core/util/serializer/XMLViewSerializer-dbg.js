/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', './Serializer', './delegate/XML', 'sap/ui/thirdparty/vkbeautify'],
	function(jQuery, EventProvider, Serializer, XML, vkbeautify) {
	"use strict";

	/**
	 * XML view serializer class. Serializes a given view.
	 *
	 * @param {sap.ui.core.mvc.XMLView} oView the view to serialize
	 * @param {object} [oWindow=window] the window object. Default is the window object the instance of the serializer is running in
	 * @param {string} [sDefaultXmlNamespace] defines the default XML namespace
	 * @param {function} fnGetControlId delegate function which returns the control id
	 * @param {function} fnGetEventHandlerName delegate function which returns the event handler name
	 *
	 * @public
	 * @class XMLViewSerializer class.
	 * @extends sap.ui.base.EventProvider
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.util.serializer.XMLViewSerializer
	 * @experimental Since 1.15.1. The XMLViewSerializer is still under construction, so some implementation details can be changed in future.
	 */
	var XMLViewSerializer = EventProvider.extend("sap.ui.core.util.serializer.XMLViewSerializer", /** @lends sap.ui.core.util.serializer.XMLViewSerializer.prototype */
	{
		constructor : function (oView, oWindow, sDefaultNamespace, fnGetControlId, fnGetEventHandlerName) {
			EventProvider.apply(this);
			this._oView = oView;
			this._oWindow = oWindow;
			this._sDefaultNamespace = sDefaultNamespace;
			this._fnGetControlId = fnGetControlId;
			this._fnGetEventHandlerName = fnGetEventHandlerName;
		}
	});
	
	
	
	/**
	 * Serializes the given XML view.
	 * 
	 * @returns {string} the serialized XML view.
	 */
	XMLViewSerializer.prototype.serialize = function () {
	
		// a function to memorize the control packages
		var mPackages = [];
		var fnMemorizePackage = function (oControl, sPackage) {
			if (!sPackage) {
				var sType = (oControl) ? oControl.constructor : "?";
				throw Error("Controls with empty package are currently not supported by the XML serializer: " + sType);
			}
			if (jQuery.inArray(sPackage, mPackages) === -1) {
				mPackages.push(sPackage);
			}
		};
		
		// a function to understand if to skip aggregations
		var fnSkipAggregations = function (oControl) {
			return (oControl instanceof this._oWindow.sap.ui.core.mvc.View);
		};
		
		// create serializer
		var oControlSerializer = new Serializer(
			this._oView,
			new XML(
				this._sDefaultNamespace,
				this._fnGetControlId,
				this._fnGetEventHandlerName,
				fnMemorizePackage),
			true,
			this._oWindow,
			fnSkipAggregations);
		
		// run serializer ... before writing namespaces
		var sResult = oControlSerializer.serialize();
		
		// write view start
		var sView = [];
		sView.push('<sap.ui.core.mvc:View');
		if (this._oView.getControllerName && this._oView.getControllerName()) {
			sView.push(' controllerName="' + this._oView.getControllerName() + '"');
		}
		
		// write view namespaces ... after running serializer
		if (jQuery.inArray('sap.ui.core.mvc', mPackages) === -1) {
			mPackages.push('sap.ui.core.mvc');
		}
		for (var i = 0 ; i < mPackages.length ; i++) {
			if (this._sDefaultNamespace && this._sDefaultNamespace === mPackages[i]) {
				sView.push(' xmlns="' + mPackages[i] + '"');
			} else {
				sView.push(' xmlns:' + mPackages[i] + '="' + mPackages[i] + '"');
			}
		}
		
		// write the main content
		sView.push(" >");
		sView.push(sResult);
		sView.push("</sap.ui.core.mvc:View>");
		
		return vkbeautify.xml(sView.join(""));
	};

	return XMLViewSerializer;

});
