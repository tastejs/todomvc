/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/m/semantic/SemanticButton'], function(SemanticButton) {
	"use strict";

	/**
	 * Constructor for a new PositiveAction.
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] custom initial settings for the new control
	 *
	 * @class
	 * A PositiveAction button has default semantic-specific properties and
	 * is eligible for aggregation content of a {@link sap.m.semantic.SemanticPage}.
	 *
	 * @extends sap.m.semantic.SemanticButton
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.m.semantic.PositiveAction
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var PositiveAction = SemanticButton.extend("sap.m.semantic.PositiveAction", /** @lends sap.m.semantic.PositiveAction.prototype */ {
		metadata: {
			properties : {

				/**
				 * Button text
				 */
				text: {type: "string", group: "Misc", defaultValue: null}
			}
		}
	});

	return PositiveAction;
}, /* bExport= */ true);
