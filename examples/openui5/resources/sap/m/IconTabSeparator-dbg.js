/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.IconTabSeparator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";



	/**
	 * Constructor for a new IconTabSeparator.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Represents an Icon used to separate 2 tab filters.
	 *
	 * @extends sap.ui.core.Element
	 * @implements sap.m.IconTab
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.IconTabSeparator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var IconTabSeparator = Element.extend("sap.m.IconTabSeparator", /** @lends sap.m.IconTabSeparator.prototype */ { metadata : {

		interfaces : [
			"sap.m.IconTab"
		],
		library : "sap.m",
		properties : {

			/**
			 * The icon to display for this separator. If no icon is given, a separator line is used instead.
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : ''},

			/**
			 * If set to true, it sends one or more requests,
			 * trying to get the density perfect version of the image if this version of
			 * the image doesn't exist on the server. Default value is set to true.
			 *
			 * If bandwidth is key for the application, set this value to false.
			 */
			iconDensityAware : {type : "boolean", group : "Appearance", defaultValue : true}
		}
	}});

	/**
	 * Lazy load feed icon image.
	 *
	 * @param {Array} aCssClasses Array of CSS classes, which will be added if the image needs to be created.
	 * @param {sap.ui.core.Control} oParent This element's parent.
	 * @private
	 */
	IconTabSeparator.prototype._getImageControl = function(aCssClasses, oParent) {
		var mProperties = {
			src : this.getIcon(),
			densityAware : this.getIconDensityAware(),
			useIconTooltip : false
		};

		this._oImageControl = sap.m.ImageHelper.getImageControl(this.getId() + "-icon", this._oImageControl, oParent, mProperties, aCssClasses);

		return this._oImageControl;
	};

	/**
	 * Function is called when exiting the element.
	 *
	 * @private
	 */
	IconTabSeparator.prototype.exit = function(oEvent) {

		if (this._oImageControl) {
			this._oImageControl.destroy();
		}

		if (sap.ui.core.Item.prototype.exit) {
			sap.ui.core.Item.prototype.exit.call(this, oEvent);
		}
	};

	return IconTabSeparator;

}, /* bExport= */ true);
