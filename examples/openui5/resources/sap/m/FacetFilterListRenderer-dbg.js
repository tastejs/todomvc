/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './ListRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ListRenderer, Renderer) {
	"use strict";

	/**
	 * FacetFilterList renderer.
	 *
	 * ListRenderer extends the ListBaseRenderer
	 * @namespace
	 * @alias sap.m.FacetFilterListRenderer
	 */
	var FacetFilterListRenderer = Renderer.extend(ListRenderer);

	return FacetFilterListRenderer;

}, /* bExport= */ true);
