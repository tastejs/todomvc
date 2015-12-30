/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/m/semantic/SemanticSelect'], function(SemanticSelect) {
	"use strict";

	/**
	 * Constructor for a new SortSelect.
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Custom initial settings for the new control
	 *
	 * @class
	 * A SortSelect button has default semantic-specific properties and is
	 * eligible for aggregation content of a {@link sap.m.semantic.SemanticPage}.
	 *
	 * @extends sap.m.semantic.SemanticSelect
	 * @implements sap.m.semantic.ISort
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.m.semantic.SortSelect
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var SortSelect = SemanticSelect.extend("sap.m.semantic.SortSelect", /** @lends sap.m.semantic.SortSelect.prototype */ {
		metadata: {
			library : "sap.m",
			interfaces : [
				"sap.m.semantic.ISort"
			]
		}
	});

	return SortSelect;

}, /* bExport= */ true);
