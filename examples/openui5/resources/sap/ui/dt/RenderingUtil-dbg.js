/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.dt.RenderingUtil.
sap.ui.define([
	'jquery.sap.global'
],
function(jQuery) {
	"use strict";

	/**
	 * Class for RenderingUtil.
	 * 
	 * @class
	 * Utility functionality to work with élements, e.g. iterate through aggregations, find parents, ...
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @private
	 * @static
	 * @since 1.30
	 * @alias sap.ui.dt.RenderingUtil
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */

	var RenderingUtil = {};

	/**
	 * 
	 */
	RenderingUtil.renderOverlay = function(oRm, oOverlay, sClassName) {
		if (oOverlay.getDomRef()) {
			this._triggerOnAfterRenderingWithoutRendering(oRm, oOverlay);

			return;
		}

		oRm.addClass("sapUiDtOverlay");
		oRm.addClass(sClassName);
		oRm.write("<div");
		oRm.writeControlData(oOverlay);
		var sAggregationName = oOverlay.getAggregationName && oOverlay.getAggregationName();
		if (sAggregationName) {
			oRm.write("data-sap-ui-dt-aggregation='" + oOverlay.getAggregationName() + "'");
		} else {
			oRm.write("data-sap-ui-dt-for='" + oOverlay.getElementInstance().getId() + "'");
		}
		oRm.writeClasses();

		oRm.writeStyles();
		oRm.write(">");

		this._renderChildren(oRm, oOverlay);

		oRm.write("</div>");
	};		

	/**
	 */
	RenderingUtil._renderChildren = function(oRm, oOverlay) {
		var aChildrenOverlays = oOverlay.getChildren();
		aChildrenOverlays.forEach(function(oChildOverlay) {
			oRm.renderControl(oChildOverlay);
		});	
	};
	
	/**
	 */
	RenderingUtil._triggerOnAfterRenderingWithoutRendering = function(oRm, oOverlay) {
		// to trigger after rendering without renfering we need to write something in a renderManager buffer
		oRm.write("");
		this._renderChildren(oRm, oOverlay);
	};

	return RenderingUtil;
}, /* bExport= */ true);
