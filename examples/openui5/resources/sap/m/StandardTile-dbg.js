/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.StandardTile.
sap.ui.define(['jquery.sap.global', './Tile', './library', 'sap/ui/core/IconPool'],
	function(jQuery, Tile, library, IconPool) {
	"use strict";



	/**
	 * Constructor for a new StandardTile.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The StandardTile control is displayed in the tile container.
	 * @extends sap.m.Tile
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.StandardTile
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var StandardTile = Tile.extend("sap.m.StandardTile", /** @lends sap.m.StandardTile.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the title of the StandardTile.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the description of the StandardTile.
			 */
			info : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the icon of the StandardTile.
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * Defines the active icon of the StandardTile.
			 */
			activeIcon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * Defines the number field of the StandardTile.
			 */
			number : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the number units qualifier of the StandardTile.
			 */
			numberUnit : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Defines the color of the info text. Possible values are Error, Warning, Success and so on.
			 */
			infoState : {type : "sap.ui.core.ValueState", group : "Misc", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * Defines the type of the StandardTile.
			 */
			type : {type : "sap.m.StandardTileType", group : "Misc", defaultValue : sap.m.StandardTileType.None},

			/**
			 * By default, this is set to true but then one or more requests are sent trying to get the density perfect version of image if this version of image doesn't exist on the server.
			 *
			 * If bandwidth is key for the application, set this value to false.
			 */
			iconDensityAware : {type : "boolean", group : "Appearance", defaultValue : true}
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
	StandardTile.prototype.exit = function() {
		if (this._oImageControl) {
			this._oImageControl.destroy();
			this._oImageControl = null;
		}
	};

	/**
	 * Overrides the icon property of the StandardTile control.
	 *
	 * @private
	 */
	StandardTile.prototype.getIcon = function() {
		if (!this.getProperty("icon") && this.getType() === "Create") {
			return IconPool.getIconURI("add");
		} else {
			return this.getProperty("icon");
		}
	};


	/**
	 * Lazy loads StandardTile icon image.
	 *
	 * @private
	 */
	StandardTile.prototype._getImage = function() {

		var sImgId = this.getId() + "-img";
		var sSize = sap.ui.Device.system.phone ? "1.3rem" : "2rem";

		var mProperties = {
			src : this.getIcon(),
			height : sSize,
			width : sSize,
			size: sSize,
			densityAware : this.getIconDensityAware(),
			useIconTooltip : false
		};

		this._oImageControl = sap.m.ImageHelper.getImageControl(sImgId, this._oImageControl, this, mProperties);

		return this._oImageControl;
	};


	return StandardTile;

}, /* bExport= */ true);
