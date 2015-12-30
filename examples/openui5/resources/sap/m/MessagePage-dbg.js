/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.MessagePage.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool'],
	function(jQuery, library, Control, IconPool) {
		"use strict";

		/**
		 * Constructor for a new MessagePage.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * MessagePage is displayed when there is no data or matching content. There are different use cases where a MessagePage might be visualized, for example:
		 *		- The search query returned no results
		 *		- The app contains no items
		 *		- There are too many items
		 *		- The application is loading
		 *	The layout is unchanged but the text varies depending on the use case.
		 * @extends sap.ui.core.Control
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.28
		 * @alias sap.m.MessagePage
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var MessagePage = Control.extend("sap.m.MessagePage", /** @lends sap.m.MessagePage.prototype */ { metadata : {

			library : "sap.m",
			properties : {
				/**
				 * Determines the main text displayed on the MessagePage.
				 */
				text : {type : "string", group : "Misc", defaultValue : "No matching items found."},
				/**
				 * Determines the detailed description that shows additional information on the MessagePage.
				 */
				description : {type : "string", group : "Misc", defaultValue : "Check the filter settings."},
				/**
				 * Determines the title in the header of MessagePage.
				 */
				title : { type : "string", group : "Misc", defaultValue : null },
				/**
				 * Determines the visibility of the MessagePage header.
				 * Can be used to hide the header of the MessagePage when it's embedded in another page.
				 */
				showHeader : { type : "boolean", group : "Appearance", defaultValue : true },
				/**
				 * Determines the visibility of the navigation button in MessagePage header.
				 */
				showNavButton : {type : "boolean", group : "Appearance", defaultValue : false},
				/**
				 * Determines the icon displayed on the MessagePage.
				 */
				icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : IconPool.getIconURI("documents") },
				/**
				 * Determines the element's text directionality with enumerated options. By default, the control inherits text direction from the DOM.
				 */
				textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit}
			},
			aggregations : {
				/**
				 * The (optional) custom Text control of this page.
				 * Use this aggregation when the "text" (sap.m.Text) control needs to be replaced with a sap.m.Link control.
				 * "text" and "textDirection" setters can be used for this aggregation.
				 */
				customText : {type : "sap.m.Link", multiple : false},
				/**
				 * The (optional) custom description control of this page.
				 * Use this aggregation when the "description" (sap.m.Text) control needs to be replaced with a sap.m.Link control.
				 * "description" and "textDirection" setters can be used for this aggregation.
				 */
				customDescription : {type : "sap.m.Link", multiple : false},
				/**
				 * A Page control which is managed internally by the MessagePage control.
				 */
				_page : {type : "sap.m.Page", multiple : false, visibility : "hidden"}
			},
			associations : {

				/**
				 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
				 */
				ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"},

				/**
				 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
				 */
				ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
			},
			events : {
				/**
				 * This event is fired when Nav Button is pressed.
				 * @since 1.28.1
				 */
				navButtonPress : {}
			}
		}});

		MessagePage.prototype.init = function() {
			var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");

			this.setAggregation("_page", new sap.m.Page({
				showHeader : this.getShowHeader(),
				navButtonPress : jQuery.proxy(function() {
					this.fireNavButtonPress();
				}, this)
			}));
			this.setProperty("text", oBundle.getText("MESSAGE_PAGE_TEXT"), true);
			this.setProperty("description", oBundle.getText("MESSAGE_PAGE_DESCRIPTION"), true);
		};

		MessagePage.prototype.onBeforeRendering = function() {
			// Don't want controls to be added again on re-rendering
			if (!(this._oText && this._oDescription)) {
				this._addPageContent();
			}
		};

		MessagePage.prototype.exit = function() {
			var oPage = this.getAggregation("_page");

			if (oPage) {
				oPage.destroy();
				oPage = null;
			}

			if (this._oText) {
				this._oText = null;
			}

			if (this._oDescription) {
				this._oDescription = null;
			}

			if (this._oIconControl) {
				this._oIconControl = null;
			}
		};

		MessagePage.prototype.setTitle = function(sTitle) {
			this.setProperty("title", sTitle, true); // no re-rendering
			this.getAggregation("_page").setTitle(sTitle);
		};

		MessagePage.prototype.setText = function(sText) {
			this.setProperty("text", sText, true); // no re-rendering
			this._oText && this._oText.setText(sText);
		};

		MessagePage.prototype.setDescription = function(sDescription) {
			this.setProperty("description", sDescription, true); // no re-rendering
			this._oDescription && this._oDescription.setText(sDescription);
		};

		MessagePage.prototype.setShowHeader = function(bShowHeader) {
			this.setProperty("showHeader", bShowHeader, true); // no re-rendering
			this.getAggregation("_page").setShowHeader(bShowHeader);
		};

		MessagePage.prototype.setShowNavButton = function(bShowNavButton) {
			this.setProperty("showNavButton", bShowNavButton, true); // no re-rendering
			this.getAggregation("_page").setShowNavButton(bShowNavButton);
		};

		MessagePage.prototype.setTextDirection = function(sTextDirection) {
			this.setProperty("textDirection", sTextDirection, true); // no re-rendering
			this._oText && this._oText.setTextDirection(sTextDirection);
			this._oDescription && this._oDescription.setTextDirection(sTextDirection);
		};

		MessagePage.prototype.setIcon = function(sIconUri) {
			var sOldIconUri = this.getIcon();
			this.setProperty("icon", sIconUri, true); // no re-rendering

			if (this._oIconControl) {
				// check if the value is changed and if URIs are from different type(icon or image) in order to avoid destroying and creating of icon control
				if (sOldIconUri !== sIconUri && IconPool.isIconURI(sOldIconUri) != IconPool.isIconURI(sIconUri)) {
					var oPage = this.getAggregation("_page");

					oPage.removeContent(this._oIconControl);
					this._oIconControl.destroy();
					oPage.insertContent(this._getIconControl(), 0);
				} else {
					this._oIconControl.setSrc(sIconUri);
				}
			}
		};

		MessagePage.prototype._addPageContent = function() {
			var oPage = this.getAggregation("_page");

			if (this.getAggregation("customText")) {
				this._oText = this.getAggregation("customText");
			} else {
				this._oText = new sap.m.Text({
					text: this.getText(),
					textAlign: sap.ui.core.TextAlign.Center,
					textDirection: this.getTextDirection()
				});
			}

			if (this.getAggregation("customDescription")) {
				this._oDescription = this.getAggregation("customDescription");
			} else {
				this._oDescription = new sap.m.Text({
					text: this.getDescription(),
					textAlign: sap.ui.core.TextAlign.Center,
					textDirection: this.getTextDirection()
				});
			}

			oPage.addContent(this._getIconControl());
			oPage.addContent(this._oText.addStyleClass("sapMMessagePageMainText"));
			oPage.addContent(this._oDescription.addStyleClass("sapMMessagePageDescription"));
		};

		MessagePage.prototype._getIconControl = function() {
			this._oIconControl = IconPool.createControlByURI({
				id: this.getId() + "-pageIcon",
				src: this.getIcon(),
				height: "8rem",
				useIconTooltip: true,
				decorative: false
			}, sap.m.Image).addStyleClass("sapMMessagePageIcon");

			return this._oIconControl;
		};

		/**
		 * Returns the internal header
		 * Adding this functions because they are needed by the SplitContainer logic to show the "hamburger" button.
		 * @private
		 * @returns {sap.m.IBar}
		 */
		MessagePage.prototype._getAnyHeader = function() {
			return this._getInternalHeader();
		};

		/**
		 * Adding this functions because they are needed by the SplitContainer logic to show the "hamburger" button.
		 * @returns {sap.m.IBar}
		 * @private
		 */

		MessagePage.prototype._getInternalHeader = function() {
			return this.getAggregation("_page").getAggregation("_internalHeader");
		};


		return MessagePage;
	}, /* bExport= */ true);
