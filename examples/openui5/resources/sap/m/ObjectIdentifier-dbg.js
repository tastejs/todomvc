/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ObjectIdentifier.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool'],
	function(jQuery, library, Control, IconPool) {
	"use strict";



	/**
	 * Constructor for a new ObjectIdentifier.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The ObjectIdentifier is a display control that enables the user to easily identify a specific object. The ObjectIdentifier title is the key identifier of the object and additional text and icons can be used to further distinguish it from other objects.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.ObjectIdentifier
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ObjectIdentifier = Control.extend("sap.m.ObjectIdentifier", /** @lends sap.m.ObjectIdentifier.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the object title.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the object text.
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Indicates whether or not the notes icon is displayed.
			 * @deprecated Since version 1.24.0.
			 * Will be replaced in the future by a more generic mechanism.
			 */
			badgeNotes : {type : "boolean", group : "Misc", defaultValue : null, deprecated: true},

			/**
			 * Indicates whether or not the address book icon is displayed.
			 * @deprecated Since version 1.24.0.
			 * Will be replaced in the future by a more generic mechanism.
			 */
			badgePeople : {type : "boolean", group : "Misc", defaultValue : null, deprecated: true},

			/**
			 * Indicates whether or not the attachments icon is displayed.
			 * @deprecated Since version 1.24.0.
			 * Will be replaced in the future by a more generic mechanism.
			 */
			badgeAttachments : {type : "boolean", group : "Misc", defaultValue : null, deprecated: true},

			/**
			 * Indicates if the ObjectIdentifier is visible. An invisible ObjectIdentifier is not being rendered.
			 */
			visible : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Indicates if the ObjectIdentifier's title is clickable.
			 * @since 1.26
			 */
			titleActive : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Specifies the element's text directionality with enumerated options. By default, the control inherits text direction from the DOM.
			 * @since 1.28.0
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit}
		},
		aggregations : {

			/**
			 * Control to display the object title (can be either Text or Link).
			 *
			 * @private
			 */
			_titleControl : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"},

			/**
			 * Text control to display the object text.
			 *
			 * @private
			 */
			_textControl : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
		},
		events : {

			/**
			 * Fires when the title is active and the user taps/clicks on it.
			 * @since 1.26
			 */
			titlePress : {
				parameters : {

					/**
					 * DOM reference of the object identifier's title.
					 */
					domRef : {type : "object"}
				}
			}
		},
		associations: {
			/**
			 * Association to controls / IDs, which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy"}
		}
	}});

	/**
	 * Called when the control is destroyed.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype.exit = function() {

		if (this._attachmentsIcon) {
			this._attachmentsIcon.destroy();
			this._attachmentsIcon = null;
		}

		if (this._peopleIcon) {
			this._peopleIcon.destroy();
			this._peopleIcon = null;
		}

		if (this._notesIcon) {
			this._notesIcon.destroy();
			this._notesIcon = null;
		}

		if (this._oAriaInfoTextControl) {
			this._oAriaInfoTextControl.destroy();
			this._oAriaInfoTextControl = null;
		}
	};

	/**
	 * Lazy loads attachments icon.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype._getAttachmentsIcon = function() {

		if (!this._attachmentsIcon) {
			this._attachmentsIcon = this._getIcon(IconPool.getIconURI("attachment"), this.getId() + "-attachments");
		}

		return this._attachmentsIcon;
	};

	/**
	 * Lazy loads people icon.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype._getPeopleIcon = function() {

		if (!this._peopleIcon) {
			this._peopleIcon = this._getIcon(IconPool.getIconURI("group"), this.getId() + "-people");
		}

		return this._peopleIcon;
	};

	/**
	 * Lazy loads notes icon.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype._getNotesIcon = function() {

		if (!this._notesIcon ) {
			this._notesIcon  = this._getIcon(IconPool.getIconURI("notes"), this.getId() + "-notes");
		}

		return this._notesIcon;
	};

	/**
	 * Creates icon image.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype._getIcon = function(sURI, sImageId) {

		var sSize = sap.ui.Device.system.phone ? "1em" : "1em";
		var oImage;

		oImage = this._icon || IconPool.createControlByURI({
			src : sURI,
			id : sImageId + "-icon",
			size : sSize,
			useIconTooltip : false
		}, sap.m.Image);

		oImage.setSrc(sURI);

		return oImage;
	};

	/**
	 * Gets the proper control for the title.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype._getTitleControl = function() {

		var oTitleControl = this.getAggregation("_titleControl"),
			bIsTitleActive;

		if (!oTitleControl) {
			this._createAriaInfoTextControl();
			// Lazy initialization
			if (this.getProperty("titleActive")) {
				oTitleControl = new sap.m.Link({
					text: this.getProperty("title"),
					//Associate with the hidden sap.m.Text
					ariaLabelledBy: this._oAriaInfoTextControl
				});
			} else {
				oTitleControl = new sap.m.Text({
					text: this.getProperty("title")
				});
			}
			this.setAggregation("_titleControl", oTitleControl);
		} else {
			// Update the title control if necessary
			bIsTitleActive = this.getProperty("titleActive");

			if (bIsTitleActive && oTitleControl instanceof sap.m.Text) {
				this.destroyAggregation("_titleControl", true);
				oTitleControl = new sap.m.Link({
					text: this.getProperty("title"),
					//Associate with the hidden sap.m.Text
					ariaLabelledBy: this._oAriaInfoTextControl
				});
				this.setAggregation("_titleControl", oTitleControl);
			} else if (!bIsTitleActive && oTitleControl instanceof sap.m.Link) {
				this.destroyAggregation("_titleControl", true);
				oTitleControl = new sap.m.Text({
					text: this.getProperty("title")
				});
				this.setAggregation("_titleControl", oTitleControl);
			}
		}

		oTitleControl.setVisible(!!this.getTitle());

		return oTitleControl;
	};

	/**
	 * Lazy loads _textControl aggregation.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype._getTextControl = function() {

		var oTextControl = this.getAggregation("_textControl");

		if (!oTextControl) {
			oTextControl = new sap.m.Text({
				text: this.getProperty("text")
			});
			this.setAggregation("_textControl", oTextControl, true);
		}

		oTextControl.setTextDirection(this.getTextDirection());
		oTextControl.setVisible(!!this.getText());

		return oTextControl;
	};

	/**
	 * Updates the text of the title control and re-renders it.
	 * If titleActive = true, a Link control is rendered,
	 * otherwise a Text control will be rendered.
	 *
	 * @private
	 */
	ObjectIdentifier.prototype._rerenderTitle = function() {
		var oTitleControl = this._getTitleControl();
		oTitleControl.setProperty("text", this.getProperty("title"), true);
		var oRm = sap.ui.getCore().createRenderManager();
		oRm.renderControl(oTitleControl);
		oRm.flush(this.$("title")[0]);
		oRm.destroy();
	};

	/**
	 * Sets the title.
	 * Default value is empty/undefined.
	 * @public
	 * @param {string} sTitle New value for property title
	 * @returns {sap.m.ObjectIdentifier} this to allow method chaining
	 */
	ObjectIdentifier.prototype.setTitle = function (sTitle) {
		//always suppress rerendering because title div is rendered
		//if text is empty or not
		var oTitleControl = this._getTitleControl();
		oTitleControl.setProperty("text", sTitle, false);
		oTitleControl.setVisible(!!sTitle);
		this.setProperty("title", sTitle, true);
		this.$("text").toggleClass("sapMObjectIdentifierTextBellow",
				!!this.getProperty("text") && !!this.getProperty("title"));

		return this;
	};

	/**
	 * Sets text.
	 * Default value is empty/undefined.
	 * @public
	 * @param {string} sText New value for property text
	 * @returns {sap.m.ObjectIdentifier} this to allow method chaining
	 */
	ObjectIdentifier.prototype.setText = function (sText) {
		//always suppress rerendering because text div is rendered
		//if text is empty or not
		this.setProperty("text", sText, true);

		var oTextControl = this._getTextControl();
		oTextControl.setProperty("text", sText, false);
		this.$("text").toggleClass("sapMObjectIdentifierTextBellow",
				!!this.getProperty("text") && !!this.getProperty("title"));

		return this;
	};

	/**
	 * Sets property titleActive.
	 * Default value is false.
	 * @public
	 * @param {boolean} bValue new value for property titleActive
	 * @returns {sap.m.ObjectIdentifier} this to allow method chaining
	 */
	ObjectIdentifier.prototype.setTitleActive = function(bValue) {
		var bPrevValue = this.getProperty("titleActive");

		// Return if the new value is the same as the old one
		if (bPrevValue != bValue) {
			this.setProperty("titleActive", bValue, true);
			// If the title is already rendered, then the title control has to be updated and rerendered
			if (this.$("title").children().length > 0) {
				this._rerenderTitle();
			}
		}
		return this;
	};

	/**
	 * Function is called when ObjectIdentifier's title is triggered.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ObjectIdentifier.prototype._handlePress = function(oEvent) {
		var oClickedItem = oEvent.target;
		if (this.getTitleActive() && this.$("title")[0].firstChild == oClickedItem) { // checking if the title is clicked
			this.fireTitlePress({
				domRef: oClickedItem
			});
		}
	};

	/**
	 * Event handler called when the enter key is pressed.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ObjectIdentifier.prototype.onsapenter = function(oEvent) {
		ObjectIdentifier.prototype._handlePress.apply(this, arguments);
	};

	/**
	 * Event handler called when the space key is pressed.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ObjectIdentifier.prototype.onsapspace = function(oEvent) {
		ObjectIdentifier.prototype._handlePress.apply(this, arguments);
	};

	/**
	 * Event handler called when the title is clicked/taped.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	ObjectIdentifier.prototype.ontap = function(oEvent) {
		ObjectIdentifier.prototype._handlePress.apply(this, arguments);
	};

	/**
	 * Creates additional aria-labelledby info text to the control.
	 * @returns {sap.m.Text}
	 * @private
	 */
	ObjectIdentifier.prototype._createAriaInfoTextControl = function () {
		var oAriaInfoTextControl;
		//Check if ObjectIdentifier has attached controls' ids to its ariaLabelledBy association
		var aAriaLabelledAssociation = this.getAssociation("ariaLabelledBy");
		if (aAriaLabelledAssociation && aAriaLabelledAssociation instanceof Array && aAriaLabelledAssociation.length > 0) {
			var sResultIds = [];
			var sResultTexts = [];

			aAriaLabelledAssociation.forEach(function (sId) {
				if (sId) {
					sResultIds.push(sId);
					var oControl = sap.ui.getCore().byId(sId);
					var sControlText = oControl.getText();
					if (sControlText) {
						sResultTexts.push(sControlText);
					}
				}
			});

			oAriaInfoTextControl = new sap.m.Text(this.getId() + "-sapSRH", {text: "Object Identifier " + sResultTexts.join(" ")}).addStyleClass("sapUiInvisibleText");
		} else {
			oAriaInfoTextControl = new sap.m.Text(this.getId() + "-sapSRH", {text: "Object Identifier"}).addStyleClass("sapUiInvisibleText");
		}

		//Store it ot private property for later usage
		this._oAriaInfoTextControl = oAriaInfoTextControl;

		return oAriaInfoTextControl;
	};


	return ObjectIdentifier;

}, /* bExport= */ true);
