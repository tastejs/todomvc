/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Tile.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";



	/**
	 * Constructor for a new Tile.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A tile to be displayed in the tile container. Use this
	 * tile as the base class for specialized tile implementations.
	 * Use the renderer _addOuterClass methods to add a style class to the main
	 * surface of the Tile. In this class set the background color, gradients
	 * or background images.
	 * Instead of implementing the default render method in the renderer, implement
	 * your content HTML in the _renderContent method of the specialized tile.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.Tile
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Tile = Control.extend("sap.m.Tile", /** @lends sap.m.Tile.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Determines whether the tile is movable within the surrounding tile container. The remove event is fired by the tile container.
			 */
			removable : {type : "boolean", group : "Misc", defaultValue : true}
		},
		events : {

			/**
			 * Tap event is raised if the user taps or clicks the control.
			 */
			press : {}
		}
	}});

	/**
	 * Initializes the control.
	 * @private
	 */
	Tile.prototype.init = function() {
		//keyboard support for desktop environments
		if (sap.ui.Device.system.desktop) {
			var fnOnSpaceOrEnter = jQuery.proxy(function(oEvent) {
				if (oEvent.srcControl === this && !oEvent.isMarked()) {
					this.ontap();
					//event should not trigger any further actions
					oEvent.stopPropagation();
				}
			}, this);

			this.onsapspace = fnOnSpaceOrEnter;
			this.onsapenter = fnOnSpaceOrEnter;
		}
	};

	/**
	 * Handles the internal event onAfterRendering.
	 * @private
	 */
	Tile.prototype.onAfterRendering = function(){
		if (this._rendered && !this._bIsDragged && this.getParent() instanceof sap.m.TileContainer) {
			this.setPos(this._posX,this._posY);
		}
		this._rendered = true;
	};


	/**
	 * Sets the position of the tile to the given coordinates.
	 * @param {int} iX Left position
	 * @param {int} iY Top position
	 * @private
	 */
	Tile.prototype.setPos = function(iX,iY){
		// store in member
		this._posX = iX = Math.floor(iX);
		this._posY = iY = Math.floor(iY);
		if (!this._rendered) {
			return;
		}
		var o = this.getDomRef();
		if ("webkitTransform" in o.style) {
			this.$().css('-webkit-transform','translate3d(' + iX + 'px,' + iY + 'px,0)');
		} else if ("transform" in o.style) {
			this.$().css('transform','translate3d(' + iX + 'px,' + iY + 'px,0)');
		} else if ("msTransform" in o.style) {
			this.$().css('msTransform','translate(' + iX + 'px,' + iY + 'px)');
		} else if ("MozTransform" in o.style) {
			this.$().css('-moz-transform','translate3d(' + iX + 'px,' + iY + 'px,0)');
		}
		if (this._invisible) {
			this.$().css("visibility","");
			delete this._invisible;
		}
		//jQuery.sap.log.info("Set tile pos, id:" + this.getId() + ", x:" + iX + ", y:" + iY);

	};

	/**
	 * Sets the px size of the Tile.
	 * @param {int} iX left position
	 * @param {int} iY top position
	 * @private
	 */
	Tile.prototype.setSize = function(iWidth,iHeight){
		//jQuery.sap.log.debug("Set tile size, id:" + this.getId() + ", x:" + iWidth + ", y:" + iHeight);
		this._width = iWidth;
		this._height = iHeight;
	};


	/**
	 * Returns and optionally sets whether the Tile is editable.
	 * @param {boolean} optional The editable state of the tile
	 * @returns {boolean} Whether the tile is editable
	 * @see sap.m.TileContainer
	 * @private
	 */
	Tile.prototype.isEditable = function(bIsEditable) {
		if (bIsEditable === true || bIsEditable === false) {
			this._bIsEditable = bIsEditable;
		}

		return this._bIsEditable;
	};

	/**
	 * Returns and optionally sets whether the Tile is dragged and applies or removes the drag styles.
	 * @param {boolean} bIsDragged The editable state of the Tile
	 * @returns {boolean} whether the Tile is dragged
	 * @see sap.m.TileContainer
	 * @private
	 */
	Tile.prototype.isDragged = function(bIsDragged) {
		if (!this._bIsEditable) {
			return;
		}
		if (bIsDragged === true || bIsDragged === false) {
			var o = this.$();
			 o.toggleClass("sapMTileDrag",bIsDragged);
			this._bIsDragged = bIsDragged;
		}
		return this._bIsDragged;
	};

	/**
	 * Sets active state.
	 * @private
	 */
	Tile.prototype.ontouchstart = function(oEvent) {
		if (!this.isEditable() && !this._parentPreventsTapEvent) {
			this.$().toggleClass("sapMTileActive sapMTileActive-CTX",true);
			this._clientX = oEvent.clientX;
			this._clientY = oEvent.clientY;
		}
	};

	/**
	 * Unsets active state.
	 * @private
	 */
	Tile.prototype.ontouchend = function() {
		if (!this.isEditable()) {
			this.$().toggleClass("sapMTileActive sapMTileActive-CTX",false);
		}
	};

	/**
	 * Checks if a parent Tile wants to prevent the Tap events for its children - read-only.
	 * @private
	 */
	Object.defineProperty(Tile.prototype,"_parentPreventsTapEvent",{
		get : function () {
			var oParent = this.getParent();
			while (oParent) {
				if (oParent._bAvoidChildTapEvent || (oParent instanceof Tile && oParent.isEditable())) {
					return true;
				}
				oParent = oParent.getParent();
			}

			return false;
		}
	});

	/**
	 * Unsets active state on touch move.
	 * @private
	 */
	Tile.prototype.ontouchmove = function(oEvent) {
		if (!this.isEditable() && !this._parentPreventsTapEvent) {
			if (Math.abs(oEvent.clientX - this._clientX) > 30 || Math.abs(oEvent.clientY - this._clientY) > 10) {
				this.$().toggleClass("sapMTileActive sapMTileActive-CTX",false);
			}
		}
	};

	Tile.prototype.ontap = function() {
		if (!this.isEditable() && !this._parentPreventsTapEvent) {
			this.firePress({});
		}
	};

	/**
	 * Sets initial visibility of the Tile.
	 * @param {boolean} bVisible visibility
	 * @private
	 */
	Tile.prototype._setVisible = function(bVisible){
		this._invisible = !bVisible;
		return this;
	};

	/**
	 * Gets the index of the Tile in TileContainer.
	 * @private
	 * @returns {int | null} The corresponding index of the Tile if it is in TileContainer or otherwise null
	 */
	Tile.prototype._getTileIndex = function() {
		var oTileContainer = this.getParent(),
			iTileIndex = null;
		if (oTileContainer && oTileContainer instanceof sap.m.TileContainer) {
			iTileIndex = oTileContainer.indexOfAggregation("tiles", this) + 1;
		}
		return iTileIndex;
	};

	/**
	 * Gets the number of tiles in the TileContainer.
	 * @private
	 * @returns The number of tiles in TileContainer if it is in TileContainer or otherwise null
	 */
	Tile.prototype._getTilesCount = function() {
		var oTileContainer = this.getParent(),
			iTileCount = null;
		if (oTileContainer && oTileContainer instanceof sap.m.TileContainer) {
			iTileCount = oTileContainer.getTiles().length;
		}
		return iTileCount;
	};


	/**
	 * Updates the value of the ARIA posinset attribute of the control's DOM element.
	 * @private
	 * @returns {sap.m.Tile} this pointer for chaining
	 */
	Tile.prototype._updateAriaPosition = function () {
		this.$().attr('aria-posinset', this._getTileIndex());
		return this;
	};

	return Tile;

}, /* bExport= */ true);
