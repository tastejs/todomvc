/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Menu
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/unified/MenuRenderer'],
	function(jQuery, Renderer, MenuRenderer1) {
	"use strict";


	var MenuRenderer = Renderer.extend(MenuRenderer1);

	return MenuRenderer;

}, /* bExport= */ true);
