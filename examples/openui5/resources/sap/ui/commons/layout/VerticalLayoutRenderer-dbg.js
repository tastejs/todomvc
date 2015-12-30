/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.layout.VerticalLayout
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/layout/VerticalLayoutRenderer'],
	function(jQuery, Renderer, VerticalLayoutRenderer1) {
	"use strict";


	var VerticalLayoutRenderer = Renderer.extend(VerticalLayoutRenderer1);
	

	return VerticalLayoutRenderer;

}, /* bExport= */ true);
