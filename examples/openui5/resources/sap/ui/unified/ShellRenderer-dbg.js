/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.unified.Shell
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './ShellLayoutRenderer'],
	function(jQuery, Renderer, ShellLayoutRenderer) {
	"use strict";


	/**
	 * Renderer for the sap.ui.unified.Shell
	 * @namespace
	 */
	var ShellRenderer = Renderer.extend(ShellLayoutRenderer);
	

	return ShellRenderer;

}, /* bExport= */ true);
