/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides default renderer for control sap.ui.table.DataTable
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './TreeTableRenderer'],
	function(jQuery, Renderer, TreeTableRenderer) {
	"use strict";


	/**
	 * DataTableRenderer
	 * @namespace
	 */
	var DataTableRenderer = Renderer.extend(TreeTableRenderer);
	

	return DataTableRenderer;

}, /* bExport= */ true);
