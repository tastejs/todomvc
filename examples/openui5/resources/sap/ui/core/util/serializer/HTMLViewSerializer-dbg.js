/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/base/EventProvider', './Serializer', './delegate/HTML', 'sap/ui/thirdparty/vkbeautify'],
	function(EventProvider, Serializer, HTML, vkbeautify) {
	"use strict";


	/**
	 * HTML view serializer class. Serializes a given view.
	 *
	 * @param {sap.ui.core.mvc.HTMLView} oView the view to serialize
	 * @param {object} [oWindow=window] the window object. Default is the window object the instance of the serializer is running in
	 * @param {function} fnGetControlId delegate function which returns the control id
	 * @param {function} fnGetEventHandlerName delegate function which returns the event handler name
	 *
	 * @public
	 * @class HTMLViewSerializer class.
	 * @extends sap.ui.base.EventProvider
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.util.serializer.HTMLViewSerializer
	 * @experimental Since 1.15.1. The HTMLViewSerializer is still under construction, so some implementation details can be changed in future.
	 */
	var HTMLViewSerializer = EventProvider.extend("sap.ui.core.util.serializer.HTMLViewSerializer", /** @lends sap.ui.core.util.serializer.HTMLViewSerializer.prototype */
	{
		constructor : function (oView, oWindow, fnGetControlId, fnGetEventHandlerName) {
			EventProvider.apply(this);
			this._oView = oView;
			this._oWindow = oWindow;
			this._fnGetControlId = fnGetControlId;
			this._fnGetEventHandlerName = fnGetEventHandlerName;
		}
	});
	
	
	/**
	 * Serializes the given HTML view.
	 * 
	 * @returns {string} the serialized HTML view.
	 */
	HTMLViewSerializer.prototype.serialize = function () {
	
		// a function to understand if to skip aggregations
		var fnSkipAggregations = function (oControl) {
			return (oControl instanceof this._oWindow.sap.ui.core.mvc.View);
		};
	
		// create serializer
		var oControlSerializer = new Serializer(
			this._oView,
			new HTML(
				this._fnGetControlId,
				this._fnGetEventHandlerName),
			true,
			this._oWindow,
			fnSkipAggregations);
		
		// run serializer
		var sResult = oControlSerializer.serialize();
		
		// wrap result with the template tag
		var sView = [];
		sView.push('<template');
		if (this._oView.getControllerName && this._oView.getControllerName()) {
			sView.push(' data-controller-name="' + this._oView.getControllerName() + '"');
		}
		sView.push(" >");
		sView.push(sResult);
		sView.push("</template>");
		
		// done
		return vkbeautify.xml(sView.join(""));
	};

	return HTMLViewSerializer;

});
