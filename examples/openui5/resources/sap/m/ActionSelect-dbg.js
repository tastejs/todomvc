/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ActionSelect.
sap.ui.define(['jquery.sap.global', './Select', './library'],
	function(jQuery, Select, library) {
		"use strict";

		/**
		 * Constructor for a new ActionSelect.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given 
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * The ActionSelect control provides a list of predefined items that allows end users to choose options and additionally trigger some actions.
		 * @extends sap.m.Select
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.16
		 * @alias sap.m.ActionSelect
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var ActionSelect = Select.extend("sap.m.ActionSelect", /** @lends sap.m.ActionSelect.prototype */ { metadata : {

			library : "sap.m",
			associations : {
		
				/**
				 * Buttons to be added to the ActionSelect content.
				 */
				buttons : {type : "sap.m.Button", multiple : true, singularName : "button"}
			}
		}});

		ActionSelect.prototype.init = function() {
			Select.prototype.init.call(this);
			this.getList().addEventDelegate({
				onfocusin: this.onfocusinList
			}, this);
		};
		/* =========================================================== */
		/* Internal methods and properties                             */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* Private methods                                             */
		/* ----------------------------------------------------------- */

		/**
		 * Determines whether the ActionSelect has content or not.
		 *
		 * @return {boolean}
		 * @override
		 * @private
		 */
		ActionSelect.prototype.hasContent = function() {
			return Select.prototype.hasContent.call(this) || !!this.getButtons().length;
		};

		/**
		 * Add additional content.
		 *
		 * @override
		 * @private
		 */
		ActionSelect.prototype.addContent = function() {
			var oCore = sap.ui.getCore(),
				oPicker = this.getPicker();

			this.getButtons().forEach(function(sButtonId) {
				oPicker.addContent(oCore.byId(sButtonId));
			});
		};

		/* =========================================================== */
		/* Lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called after the ActionSelect picker pop-up is render.
		 *
		 * @override
		 * @protected
		 */
		ActionSelect.prototype.onAfterRenderingPicker = function() {
			Select.prototype.onAfterRenderingPicker.call(this);
			var oPicker = this.getPicker(),
				oRenderer = this.getRenderer();

			oPicker.addStyleClass(oRenderer.CSS_CLASS + "Picker");
			oPicker.addStyleClass(oRenderer.ACTION_SELECT_CSS_CLASS + "Picker");
			oPicker.addStyleClass(oRenderer.ACTION_SELECT_CSS_CLASS + "Picker-CTX");
		};

		/* =========================================================== */
		/* API methods                                                 */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* Public methods                                              */
		/* ----------------------------------------------------------- */

		/**
		 * Button to be removed from the ActionSelect content.
		 *
		 * @param {int | string | sap.m.Button} vButton The button to remove or its index or id.
		 * @returns {string} The id of the removed button or null.
		 * @public
		 */
		ActionSelect.prototype.removeButton = function(vButton) {
			var oPicker = this.getPicker();

			if (oPicker) {

				if (typeof vButton === "number") {
					vButton = this.getButtons()[vButton];
				}

				oPicker.removeContent(vButton);
			}

			return this.removeAssociation("buttons", vButton);
		};

		/**
		 * Remove all buttons from the ActionSelect.
		 *
		 * @returns {string[]} An array with the ids of the removed elements (might be empty).
		 * @public
		 */
		ActionSelect.prototype.removeAllButtons = function() {
			var oPicker = this.getPicker();

			if (oPicker) {
				this.getButtons().forEach(function(sButtonId) {
					oPicker.removeContent(sButtonId);
				});
			}

			return this.removeAllAssociation("buttons");
		};

		// Keyboard Navigation for Action buttons

		/**
		 * Handler for SHIFT-TAB key  - 'tab previous' sap ui5 key event.
		 *
		 * @param oEvent - key event
		 * @private
		 *
		 */
		ActionSelect.prototype.onsaptabprevious = function(oEvent) {

			// check whether event is marked or not
			if ( oEvent.isMarked() || !this.getEnabled()) {
				return;
			}

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();
			var aButtons = this.getButtons();
			var oPicker = this.getPicker();

			if (oPicker && oPicker.isOpen() && aButtons.length > 0) {
				sap.ui.getCore().byId(aButtons[aButtons.length - 1]).focus();
				oEvent.preventDefault();
			}
		};

		/**
		 * Handler for TAB key - sap 'tab next' key event.
		 *
		 * @param oEvent - key event
		 * @private
		 *
		 */
		ActionSelect.prototype.onsaptabnext = function(oEvent) {

			// check whether event is marked or not
			if ( oEvent.isMarked() || !this.getEnabled()) {
				return;
			}

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			var aButtons = this.getButtons();
			var oPicker = this.getPicker();

			if (oPicker && oPicker.isOpen() && aButtons.length > 0) {
				sap.ui.getCore().byId(aButtons[0]).focus();
				oEvent.preventDefault();
			}
		};

		/**
		 * Handle the focus leave event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		ActionSelect.prototype.onsapfocusleave = function(oEvent) {

			// Keep focus on Action Select's input field if does not go to
			// the buttons in Action sheet part of the ActionSelect
			var aButtons = this.getButtons();
			var bKeepFocus = (aButtons.indexOf(oEvent.relatedControlId) == -1);

			if (bKeepFocus) {
				Select.prototype.onsapfocusleave.apply(this, arguments);
			}
		};

		/**
		 * Handler for focus in event on The Selection List.
		 *
		 * @param oEvent - key event
		 * @private
		 */
		ActionSelect.prototype.onfocusinList = function(oEvent) {
			if (document.activeElement !== this.getList().getDomRef()) {
				this.focus();
			}
		};

		return ActionSelect;

	}, /* bExport= */ true);