/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './TableRenderer'],
	function(jQuery, Renderer, TableRenderer) {
	"use strict";


	/**
	 * AnalyticalTable renderer. 
	 * @namespace
	 */
	var AnalyticalTableRenderer = Renderer.extend(TableRenderer);

	AnalyticalTableRenderer.getAriaAttributesForCell = function(oTable, bFixedTable, oRow, oColumn, iColIndex, oCell) {
		// since the analytical table is a read-only control there is no need for the toggleedit description.
		// invoke the TableRenderer function to retrieve aria attributes for cells and then remove the
		// toggleedit description from aria-describedby
		var mAriaAttributes = TableRenderer.getAriaAttributesForCell.apply(this, arguments);
		if (mAriaAttributes["aria-describedby"]) {
			var aDescribedByParts = mAriaAttributes["aria-describedby"].value.split(" ");
			var iIndex = aDescribedByParts.indexOf(oTable.getId() + "-toggleedit");
			delete mAriaAttributes["aria-describedby"];

			if (iIndex >= 0) {
				aDescribedByParts.splice(iIndex);
			}

			if (aDescribedByParts.length > 0) {
				mAriaAttributes["aria-describedby"].value = aDescribedByParts.join(" ");
			}
		}

		return mAriaAttributes;
	};

	return AnalyticalTableRenderer;

}, /* bExport= */ true);
