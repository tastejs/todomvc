/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.BusyDialog.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function (jQuery, library, Control, Popup, Parameters) {
		"use strict";

		/**
		 * Constructor for a new BusyDialog.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given.
		 * @param {object} [mSettings] Initial settings for the new control.
		 *
		 * @class
		 * BusyDialog is used to indicate that the system is busy and the user has to wait.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.m.BusyDialog
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var BusyDialog = Control.extend("sap.m.BusyDialog", /** @lends sap.m.BusyDialog.prototype */ {

			metadata: {
				library: "sap.m",
				properties: {
					/**
					 * Optional text displayed inside the dialog.
					 */
					text: {type: "string", group: "Appearance", defaultValue: ''},

					/**
					 * Sets the title of the BusyDialog. The default value is an empty string.
					 */
					title: {type: "string", group: "Appearance", defaultValue: ''},

					/**
					 * Icon displayed in the dialog header. This icon is invisible in iOS platform and it is density aware. You can use the density convention (@2, @1.5, etc.) to provide higher resolution image for higher density screens.
					 */
					customIcon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: ''},

					/**
					 * Defines the rotation speed of the given image. If GIF file is used, the speed has to be set to 0. The value is in milliseconds.
					 */
					customIconRotationSpeed: {type: "int", group: "Appearance", defaultValue: 1000},

					/**
					 * If this is set to <code>false</code>, the source image will be loaded directly without attempting to fetch the density perfect image for high density devices.
					 * By default, this is set to <code>true</code> but then one or more requests are sent trying to get the density perfect version of the image.
					 *
					 * If bandwidth is the key for the application, set this value to <code>false</code>.
					 */
					customIconDensityAware: {type: "boolean", defaultValue: true},

					/**
					 * Width of the provided icon with default value "44px".
					 */
					customIconWidth: {type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "44px"},

					/**
					 * Height of the provided icon with default value "44px".
					 */
					customIconHeight: {type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "44px"},

					/**
					 * The text of the cancel button. The default text is "Cancel" (translated to the respective language).
					 */
					cancelButtonText: {type: "string", group: "Misc", defaultValue: ''},

					/**
					 * Indicates if the cancel button will be rendered inside the busy dialog. The default value is set to <code>false</code>.
					 */
					showCancelButton: {type: "boolean", group: "Appearance", defaultValue: false}
				},
				events: {
					/**
					 * Fires when the busy dialog is closed.
					 */
					close: {
						parameters: {
							/**
							 * Indicates if the close events are triggered by a user, pressing a cancel button or because the operation was terminated.
							 * This parameter is set to true if the close event is fired by user interaction.
							 */
							cancelPressed: {type: "boolean"}
						}
					}
				}
			},

			// requires a dummy render function to avoid loading of separate
			// renderer file and in case of usage in control tree a render
			// function has to be available to not crash the rendering
			renderer: function(oRm, oControl) { /* just do nothing */ }

		});

		BusyDialog.prototype.init = function () {
			this._busyIndicator = new sap.m.BusyIndicator(this.getId() + '-busyInd', {
				visible: true
			});

			//create the dialog
			this._oDialog = new sap.m.Dialog(this.getId() + '-Dialog', {
				content: this._busyIndicator,
				showHeader: false
			}).addStyleClass('sapMBusyDialog');

			this._oDialog.addEventDelegate({
				onBeforeRendering: function () {
					var text = this.getText();
					var title = this.getTitle();
					var showCancelButton = this.getShowCancelButton() || this.getCancelButtonText();

					if (!text && !title && !showCancelButton) {
						this._oDialog.addStyleClass('sapMBusyDialog-Light');
					} else {
						this._oDialog.removeStyleClass('sapMBusyDialog-Light');
					}
				}
			}, this);

			//keyboard handling
			this._oDialog.oPopup.onsapescape = function (e) {
				this.close(true);
			}.bind(this);
		};

		/**
		 * Destroys the BusyDialog.
		 * @private
		 */
		BusyDialog.prototype.exit = function () {
			this._busyIndicator.destroy();
			this._busyIndicator = null;

			if (this._cancelButton) {
				this._cancelButton.destroy();
				this._cancelButton = null;
			}

			if (this._oLabel) {
				this._oLabel.destroy();
				this._oLabel = null;
			}

			this._oDialog.destroy();
			this._oDialog = null;
		};

		/**
		 * Opens the BusyDialog.
		 *
		 * @type sap.m.BusyDialog
		 * @public
		 */
		BusyDialog.prototype.open = function () {
			jQuery.sap.log.debug("sap.m.BusyDialog.open called at " + new Date().getTime());

			//if the code is not ready yet (new sap.m.BusyDialog().open()) wait 50ms and then try ot open it.
			if (!document.body || !sap.ui.getCore().isInitialized()) {
				setTimeout(function() {
					this.open();
				}.bind(this), 50);
			} else {
				this._oDialog.open();
			}

			return this;
		};

		/**
		 * Closes the BusyDialog.
		 *
		 * @type sap.m.BusyDialog
		 * @public
		 */
		BusyDialog.prototype.close = function (isClosedFromUserInteraction) {

			//fire the close event with 'cancelPressed' = true/false depending on how the busyDialog is closed
			this.fireClose({cancelPressed: isClosedFromUserInteraction || false});

			this._oDialog.close();
		};

		BusyDialog.prototype.setTitle = function (title) {
			//the text can be changed only before opening
			this.setProperty('title', title, true);
			this._oDialog.setTitle(title).setShowHeader(!!title);

			return this;
		};

		BusyDialog.prototype.setText = function (text) {
			//the text can be changed only before opening
			this.setProperty('text', text, true);

			if (!this._oLabel) {
				if (text) {
					this._oLabel = new sap.m.Label(this.getId() + '-TextLabel', {text: text}).addStyleClass('sapMBusyDialogLabel');
					this._oDialog.insertAggregation('content', this._oLabel, 0);
				}
			} else {
				if (text) {
					this._oLabel.setText(text).setVisible(true);
				} else {
					this._oLabel.setVisible(false);
				}
			}

			return this;
		};

		BusyDialog.prototype.setCustomIcon = function (icon) {
			this.setProperty("customIcon", icon, true);
			this._busyIndicator.setCustomIcon(icon);
			return this;
		};

		BusyDialog.prototype.setCustomIconRotationSpeed = function (speed) {
			this.setProperty("customIconRotationSpeed", speed, true);
			this._busyIndicator.setCustomIconRotationSpeed(speed);
			return this;
		};

		BusyDialog.prototype.setCustomIconDensityAware = function (isDensityAware) {
			this.setProperty("customIconDensityAware", isDensityAware, true);
			this._busyIndicator.setCustomIconDensityAware(isDensityAware);
			return this;
		};

		BusyDialog.prototype.setCustomIconWidth = function (width) {
			this.setProperty("customIconWidth", width, true);
			this._busyIndicator.setCustomIconWidth(width);
			return this;
		};

		BusyDialog.prototype.setCustomIconHeight = function (height) {
			this.setProperty("customIconHeight", height, true);
			this._busyIndicator.setCustomIconHeight(height);
			return this;
		};

		BusyDialog.prototype.setShowCancelButton = function (isCancelButtonShown) {
			this.setProperty("showCancelButton", isCancelButtonShown, false);

			if (isCancelButtonShown) {
				this._oDialog.setEndButton(this._getCloseButton());
			} else {
				this._destroyTheCloseButton();
			}

			return this;
		};

		BusyDialog.prototype.setCancelButtonText = function (text) {
			this.setProperty("cancelButtonText", text, false);

			if (text) {
				this._getCloseButton().setText(text);
				this._oDialog.setEndButton(this._getCloseButton());
			} else {
				this._destroyTheCloseButton();
			}

			return this;
		};

		//private functions

		BusyDialog.prototype._destroyTheCloseButton = function () {
			this._oDialog.destroyEndButton();
			this._cancelButton = null;
		};

		BusyDialog.prototype._getCloseButton = function () {
			var cancelButtonText = this.getCancelButtonText();
			var closeButtonText = cancelButtonText ? cancelButtonText : sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("BUSYDIALOG_CANCELBUTTON_TEXT");

			return this._cancelButton ? this._cancelButton : this._cancelButton = new sap.m.Button({
				text: closeButtonText,
				press: function () {
					this.close(true);
				}.bind(this)
			});
		};

		return BusyDialog;

	}, /* bExport= */ true
);
