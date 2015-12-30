/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides default renderer for control sap.ui.table.TreeTable
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './TableRenderer'],
	function(jQuery, Renderer, TableRenderer) {
	"use strict";


	/**
	 * TreeTable renderer.
	 * @namespace
	 */
	var TreeTableRenderer = Renderer.extend(TableRenderer);
	
	
	TreeTableRenderer.renderTableCellControl = function(rm, oTable, oCell, iCellIndex) {
		if (oTable.isTreeBinding("rows") && iCellIndex === 0 && !oTable.getUseGroupMode()) {
			rm.write("<span");
			rm.addClass("sapUiTableTreeIcon");
			rm.addClass("sapUiTableTreeIconLeaf");
			rm.writeClasses();
			rm.writeAttribute("tabindex", -1);
			rm.write(">&nbsp;</span>");
		}
		rm.renderControl(oCell);
	};
	

	return TreeTableRenderer;

}, /* bExport= */ true);
