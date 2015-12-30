/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.table.Row.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './library'],
	function(jQuery, Element, library) {
	"use strict";


	
	/**
	 * Constructor for a new Row.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The row.
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.table.Row
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Row = Element.extend("sap.ui.table.Row", /** @lends sap.ui.table.Row.prototype */ { metadata : {
	
		library : "sap.ui.table",
		defaultAggregation : "cells",
		aggregations : {
	
			/**
			 * The controls for the cells.
			 */
			cells : {type : "sap.ui.core.Control", multiple : true, singularName : "cell"}
		}
	}});
	
	
	/**
	 * Returns the index of the row in the table or -1 if not added to a table. This
	 * function considers the scroll position of the table and also takes fixed rows and
	 * fixed bottom rows into account.
	 *
	 * @return {int} index of the row (considers scroll position and fixed rows)
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Row.prototype.getIndex = function() {
		var oTable = this.getParent();
		if (oTable) {
			// get the index of the row in the aggregation
			var iRowIndex = oTable.indexOfRow(this);

			// check for fixed rows. In this case the index of the context is the same like the index of the row in the aggregation
			var iNumberOfFixedRows = oTable.getFixedRowCount();
			if (iNumberOfFixedRows > 0 && iRowIndex < iNumberOfFixedRows) {
				return iRowIndex;
			}

			// check for fixed bottom rows
			var iNumberOfFixedBottomRows = oTable.getFixedBottomRowCount();
			var iVisibleRowCount = oTable.getVisibleRowCount();
			if (iNumberOfFixedBottomRows > 0 && iRowIndex >= iVisibleRowCount - iNumberOfFixedBottomRows) {
				var oBinding = oTable.getBinding("rows");
				if (oBinding && oBinding.getLength() >= iVisibleRowCount) {
					return oBinding.getLength() - (iVisibleRowCount - iRowIndex);
				} else {
					return iRowIndex;
				}
			}

			var iFirstRow = oTable.getFirstVisibleRow();
			return iFirstRow + iRowIndex;
		}
		return -1;
	};

	/**
	 *
	 * @param bJQuery Set to true to get jQuery object instead of DomRef
	 * @returns {object} contains DomRefs or jQuery objects of the row
	 */
	Row.prototype.getDomRefs = function (bJQuery) {
		var oDomRefs = {};
		var fnAccess = jQuery.sap.domById;
		if (bJQuery === true) {
			fnAccess = jQuery.sap.byId;
		}

		var oTable = this.getParent();
		if (oTable) {
			var iRowIndex = oTable.indexOfRow(this);
			// row selector domRef
			oDomRefs.rowSelector = fnAccess(oTable.getId() + "-rowsel" + iRowIndex);
		}

		// row domRef
		oDomRefs.rowScrollPart = fnAccess(this.getId());
		// row domRef (the fixed part)
		oDomRefs.rowFixedPart = fnAccess(this.getId() + "-fixed");
		// row selector domRef
		oDomRefs.rowSelectorText = fnAccess(this.getId() + "-rowselecttext");

		if (bJQuery === true) {
			oDomRefs.row = oDomRefs.rowScrollPart;
			if (oDomRefs.rowSelector && oDomRefs.rowSelector.length > 0) {
				oDomRefs.row = oDomRefs.row.add(oDomRefs.rowSelector);
			} else {
				// since this won't be undefined in jQuery case
				oDomRefs.rowSelector = undefined;
			}

			if (oDomRefs.rowFixedPart.length > 0) {
				oDomRefs.row = oDomRefs.row.add(oDomRefs.rowFixedPart);
			} else {
				// since this won't be undefined in jQuery case
				oDomRefs.rowFixedPart = undefined;
			}
		}

		return oDomRefs;
	};

	/**
	 *
	 * @param {sap.ui.table.Table} oTable Instance of the table
	 * @param {Object} mTooltipTexts texts for aria descriptions and tooltips
	 * @param {Object} mTooltipTexts.mouse texts for tooltips
	 * @param {String} mTooltipTexts.mouse.rowSelect text for row select tooltip (if row is unselected)
	 * @param {String} mTooltipTexts.mouse.rowDeselect text for row de-select tooltip (if row is selected)
	 * @param {Object} mTooltipTexts.keyboard texts for aria descriptions
	 * @param {String} mTooltipTexts.keyboard.rowSelect text for row select aria description (if row is unselected)
	 * @param {String} mTooltipTexts.keyboard.rowDeselect text for row de-select aria description (if row is selected)
	 * @param {Boolean} bSelectOnCellsAllowed set to true when the entire row may be clicked for selecting it
	 * @private
	 */
	Row.prototype._updateSelection = function(oTable, mTooltipTexts, bSelectOnCellsAllowed) {
		var bIsSelected = oTable.isIndexSelected(this.getIndex());
		var $DomRefs = this.getDomRefs(true);

		var sSelectReference = "rowSelect";
		if (bIsSelected) {
			// when the row is selected it must show texts how to deselect
			sSelectReference = "rowDeselect";
		}

		// update tooltips and aria texts
		if ($DomRefs.rowSelector) {
			$DomRefs.rowSelector.attr("title", mTooltipTexts.mouse[sSelectReference]);
			$DomRefs.rowSelector.attr("aria-label", mTooltipTexts.keyboard[sSelectReference]);
		}

		if ($DomRefs.rowSelectorText) {
			$DomRefs.rowSelectorText.text(mTooltipTexts.keyboard[sSelectReference]);
		}

		var $Row = $DomRefs.rowScrollPart;
		if ($DomRefs.rowFixedPart) {
			$Row = $Row.add($DomRefs.rowFixedPart);
		}

		if (bSelectOnCellsAllowed) {
			// the row requires a tooltip for selection if the cell selection is allowed
			$Row.attr("title", mTooltipTexts.mouse[sSelectReference]);
			$Row.attr("aria-label", mTooltipTexts.keyboard[sSelectReference]);
		} else {
			$Row.removeAttr("title");
			$Row.removeAttr("aria-label");
		}

		// update aria-selected state, do at the very end since this forces the screen reader to read the aria texts again
		if ($DomRefs.row) {
			// update visual selection state
			$DomRefs.row.toggleClass("sapUiTableRowSel", bIsSelected);
			$DomRefs.row.children("td").add($DomRefs.row).attr("aria-selected", bIsSelected.toString());
		}
	};

	return Row;

}, /* bExport= */ true);
