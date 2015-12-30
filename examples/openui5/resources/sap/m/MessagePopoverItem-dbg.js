/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.MessagePopoverItem.
sap.ui.define(["jquery.sap.global", "./library", "sap/ui/core/Item"],
	function(jQuery, library, Item) {
		"use strict";

		/**
		 * Constructor for a new MessagePopoverItem.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * Items provide information about Error Messages in the page.
		 * @extends sap.ui.core.Element
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.28
		 * @alias sap.m.MessagePopoverItem
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var MessagePopoverItem = Item.extend("sap.m.MessagePopoverItem", /** @lends sap.m.MessagePopoverItem.prototype */ {
				metadata: {
					library: "sap.m",
					properties: {
						/**
						 * Specifies the type of the message
						 */
						type: { type: "sap.ui.core.MessageType", group: "Appearance", defaultValue: sap.ui.core.MessageType.Error },

						/**
						 * Specifies the title of the message
						 */
						title: { type: "string", group: "Appearance", defaultValue: "" },

						/**
						 * Specifies detailed description of the message
						 */
						description: { type: "string", group: "Appearance", defaultValue: "" },

						/**
						 * Specifies if description should be interpreted as markup
						 */
						markupDescription: { type: "boolean", group: "Appearance", defaultValue: false },

						/**
						 * Specifies long text description location URL
						 */
						longtextUrl: { type: "sap.ui.core.URI", group: "Behavior", defaultValue: null }
					}
				}
			});

		MessagePopoverItem.prototype.setDescription = function(sDescription) {
			// Avoid showing result of '' + undefined
			if (typeof sDescription === 'undefined') {
				sDescription = '';
			}

			if (this.getMarkupDescription()) {
				sDescription = jQuery.sap._sanitizeHTML(sDescription);
			}

			this.setProperty("description", sDescription, true);

			return this;
		};

		return MessagePopoverItem;

	}, /* bExport= */true);
