/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/layout/form/SimpleFormRenderer'],
	function(jQuery, Renderer, SimpleFormRenderer1) {
	"use strict";


	var SimpleFormRenderer = Renderer.extend(SimpleFormRenderer1);

	return SimpleFormRenderer;

}, /* bExport= */ true);
