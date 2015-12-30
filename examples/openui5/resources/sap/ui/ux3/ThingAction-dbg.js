/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ThingAction.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './library'],
	function(jQuery, Element) {
	"use strict";



	/**
	 * Constructor for a new ThingAction.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Thing Action for Swatch, QuickView, Thinginspector
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.ThingAction
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ThingAction = Element.extend("sap.ui.ux3.ThingAction", /** @lends sap.ui.ux3.ThingAction.prototype */ { metadata : {

		library : "sap.ui.ux3",
		properties : {

			/**
			 * text of action
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * action enabled (true/false)
			 */
			enabled : {type : "boolean", group : "Misc", defaultValue : true}
		},
		events : {

			/**
			 * Event will be fired when the action was triggered.
			 */
			select : {
				parameters : {

					/**
					 * Id of selected action
					 */
					id : {type : "string"},

					/**
					 * Selected Thing Action
					 */
					action : {type : "sap.ui.ux3.ThingAction"}
				}
			}
		}
	}});

	ThingAction.prototype.onclick = function(oEvent) {
		this.fireSelect({
			id : this.getId(),
			action: this
		});
	};
	ThingAction.prototype.onsapselect = function(oEvent) {
		this.fireSelect({
			id : this.getId(),
			action: this
		});
	};

	return ThingAction;

}, /* bExport= */ true);
