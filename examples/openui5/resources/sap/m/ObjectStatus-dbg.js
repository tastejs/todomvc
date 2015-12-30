/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ObjectStatus.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool'],
	function(jQuery, library, Control, IconPool) {
	"use strict";



	/**
	 * Constructor for a new ObjectStatus.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Status information that can be either text with a value state, or an icon.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.ObjectStatus
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ObjectStatus = Control.extend("sap.m.ObjectStatus", /** @lends sap.m.ObjectStatus.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the ObjectStatus title.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the ObjectStatus text.
			 */
			text : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the text value state.
			 */
			state : {type : "sap.ui.core.ValueState", group : "Misc", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * Icon URI. This may be either an icon font or image path.
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * By default, this is set to true but then one or more requests are sent trying to get the density perfect version of image if this version of image doesn't exist on the server.
			 *
			 * If bandwidth is key for the application, set this value to false.
			 */
			iconDensityAware : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Determines the direction of the text, not including the title.
			 * Available options for the text direction are LTR (left-to-right) and RTL (right-to-left). By default the control inherits the text direction from its parent control.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit}
		},
		associations : {

			/**
			 * Association to controls / IDs, which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}
		}
	}});

	/**
	 * Called when the control is destroyed.
	 *
	 * @private
	 */
	ObjectStatus.prototype.exit = function() {
		if (this._oImageControl) {
			this._oImageControl.destroy();
			this._oImageControl = null;
		}
	};

	/**
	 * Lazy loads feed icon image.
	 *
	 * @private
	 */
	ObjectStatus.prototype._getImageControl = function() {
		var sImgId = this.getId() + '-icon';
		var mProperties = {
			src : this.getIcon(),
			densityAware : this.getIconDensityAware(),
			useIconTooltip : false
		};

		this._oImageControl = sap.m.ImageHelper.getImageControl(sImgId, this._oImageControl, this, mProperties);

		return this._oImageControl;
	};

	/**
	 * Sets the title.
	 * The default value is empty/undefined.
	 * @public
	 * @param {string} sTitle New value for property title
	 * @returns {sap.m.ObjectStatus} this to allow method chaining
	 */
	ObjectStatus.prototype.setTitle = function (sTitle) {
		var $Title = this.$().children(".sapMObjStatusTitle"),
			bShouldSuppressInvalidate = !!$Title.length && !!this.validateProperty("title", sTitle).trim();

		this.setProperty("title", sTitle, bShouldSuppressInvalidate);

		if (bShouldSuppressInvalidate) {
			$Title.text(this.getTitle() + ":");
		}

		return this;
	};

	/**
	 * Sets the text.
	 * The default value is empty/undefined.
	 * @public
	 * @param {string} sText New value for property text
	 * @returns {sap.m.ObjectStatus} this to allow method chaining
	 */
	ObjectStatus.prototype.setText = function (sText) {
		var $Text = this.$().children(".sapMObjStatusText"),
			bShouldSuppressInvalidate = !!$Text.length && !!this.validateProperty("text", sText).trim();

		this.setProperty("text", sText, bShouldSuppressInvalidate);

		if (bShouldSuppressInvalidate) {
			$Text.text(this.getText());
		}

		return this;
	};

	/**
	 * Checks if the ObjectStatus is empty.
	 * @private
	 * @returns {boolean}
	 */
	ObjectStatus.prototype._isEmpty = function() {

		return !(this.getText().trim() || this.getIcon().trim() || this.getTitle().trim());
	};

	return ObjectStatus;

}, /* bExport= */ true);
