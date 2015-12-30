/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/layout/ResponsiveFlowLayoutRenderer'],
	function(jQuery, Renderer, ResponsiveFlowLayoutRenderer1) {
	"use strict";


	var ResponsiveFlowLayoutRenderer = Renderer.extend(ResponsiveFlowLayoutRenderer1);

	return ResponsiveFlowLayoutRenderer;

}, /* bExport= */ true);
