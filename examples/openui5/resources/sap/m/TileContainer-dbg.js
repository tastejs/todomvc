/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.TileContainer.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool'],
	function(jQuery, library, Control, IconPool) {
	"use strict";



	/**
	 * Constructor for a new TileContainer.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A container that arranges same-size tiles nicely on carousel pages.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.TileContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TileContainer = Control.extend("sap.m.TileContainer", /** @lends sap.m.TileContainer.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the width of the TileContainer in px.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * Defines the height of the TileContainer in px.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * Determines whether the TileContainer is editable so you can move, delete or add tiles.
			 */
			editable : {type : "boolean", group : "Misc", defaultValue : null},

			/**
			 * Determines whether the user is allowed to add Tiles in Edit mode (editable = true).
			 */
			allowAdd : {type : "boolean", group : "Misc", defaultValue : null}
		},
		defaultAggregation : "tiles",
		aggregations : {

			/**
			 * The Tiles to be displayed by the TileContainer.
			 */
			tiles : {type : "sap.m.Tile", multiple : true, singularName : "tile"}
		},
		events : {

			/**
			 * Fires if a Tile is moved.
			 */
			tileMove : {
				parameters : {

					/**
					 * The Tile that has been moved.
					 */
					tile : {type : "sap.m.Tile"},

					/**
					 * The new index of the Tile in the tiles aggregation.
					 */
					newIndex : {type : "int"}
				}
			},

			/**
			 * Fires if a Tile is deleted in Edit mode.
			 */
			tileDelete : {
				parameters : {

					/**
					 * The deleted Tile.
					 */
					tile : {type : "sap.m.Tile"}
				}
			},

			/**
			 * Fires when a Tile is added.
			 */
			tileAdd : {}
		}
	}});


	IconPool.insertFontFaceStyle();

	TileContainer.prototype._bRtl  = sap.ui.getCore().getConfiguration().getRTL();

	/**
	 * Initializes the control.
	 *
	 * @private
	 */
	TileContainer.prototype.init = function() {
		this._iCurrentTileStartIndex = 0;
		this._iCurrentPage = 0;
		this._iPages = 0;
		this._iScrollLeft = 0;
		this._iScrollGap = 0;	// gap to the left and right that is allowed to be moved while touchmove event if max scrollwidth or min scrollwidth is already reached

		if (!sap.ui.Device.system.desktop) {
			this._iScrollGap = 0;
		}

		this.bAllowTextSelection = false;

		//ugly but needed, initial timeout to wait until all elements are resized.
		//TODO: Check whether this is needed in no less mode
		this._iInitialResizeTimeout = 400; //needed

		this._oDragSession = null;
		this._oTouchSession = null;

		this._bAvoidChildTapEvent = false;

		// the amount on the left and right during drag drop of a tile needed to start showing the edge of the page
		this._iEdgeShowStart = sap.ui.Device.system.phone ? 10 : 20;

		// the amount of pixels a tile needs to be moved over the left or right edge to trigger a scroll
		if (sap.ui.Device.system.phone) {
			this._iTriggerScrollOffset = 10;
		} else if (sap.ui.Device.system.desktop) {
			this._iTriggerScrollOffset = -40;
		} else {
			this._iTriggerScrollOffset = 20;
		}

		// keyboard support
		this._iCurrentFocusIndex = -1;
		if (sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {
			var fnOnHome = jQuery.proxy(function(oEvent) {
				if (this._iCurrentFocusIndex >= 0) {
					var iRowFirstTileIndex = this._iCurrentFocusIndex - this._iCurrentFocusIndex % this._iMaxTilesX;
					var iFirstOnPageOrVeryFirstIndex = this._iCurrentTileStartIndex === this._iCurrentFocusIndex ? 0 : this._iCurrentTileStartIndex;
					var iTargetTileIndex = oEvent.ctrlKey
						// if we are on the first tile of the current page already, go to the very first tile
						? iFirstOnPageOrVeryFirstIndex
						: iRowFirstTileIndex;
					var oFirstTile = this.getTiles()[iTargetTileIndex];

					if (!!oFirstTile) {
						this._findTile(oFirstTile.$()).focus();
						// event should not trigger any further actions
						oEvent.stopPropagation();
					}
					this._handleAriaActiveDescendant();
				}
			}, this),

			fnOnEnd = jQuery.proxy(function(oEvent) {
				if (this._iCurrentFocusIndex >= 0) {
					var oTiles = this.getTiles();
					var iRowFirstTileIndex = this._iCurrentFocusIndex - this._iCurrentFocusIndex % this._iMaxTilesX;
					var iRowLastTileIndex = iRowFirstTileIndex + this._iMaxTilesX < oTiles.length ? iRowFirstTileIndex + this._iMaxTilesX - 1 : oTiles.length - 1;
					var iLastTileIndex = this._iCurrentTileStartIndex + this._iMaxTiles < oTiles.length ? this._iCurrentTileStartIndex + this._iMaxTiles - 1 : oTiles.length - 1;
					var iLastOnPageOrVeryLastIndex =  iLastTileIndex === this._iCurrentFocusIndex ? oTiles.length - 1 : iLastTileIndex;
					var iTargetTileIndex = oEvent.ctrlKey
						? iLastOnPageOrVeryLastIndex
						: iRowLastTileIndex;

					if (oTiles.length > 0) {
						this._findTile(oTiles[iTargetTileIndex].$()).focus();
						// event should not trigger any further actions
						oEvent.stopPropagation();
					}
					this._handleAriaActiveDescendant();
				}
			}, this),

			fnOnPageUp = jQuery.proxy(function(oEvent) {

				if (this.getTiles().length > 0) {
					var iNextIndex = this._iCurrentFocusIndex - this._iMaxTiles >= 0 ? this._iCurrentFocusIndex - this._iMaxTiles : 0;

					var oNextTile = this.getTiles()[iNextIndex];

					if (!!oNextTile) {
						this._findTile(oNextTile.$()).focus();
						// event should not trigger any further actions
						oEvent.stopPropagation();
					}
					this._handleAriaActiveDescendant();
				}
			}, this),

			fnOnPageDown = jQuery.proxy(function(oEvent) {
				var iTilesCount = this.getTiles().length;

				if (iTilesCount > 0) {
					var iNextIndex = this._iCurrentFocusIndex + this._iMaxTiles < iTilesCount ? this._iCurrentFocusIndex + this._iMaxTiles : iTilesCount - 1;

					var oNextTile = this.getTiles()[iNextIndex];

					if (!!oNextTile) {
						this._findTile(oNextTile.$()).focus();
						// event should not trigger any further actions
						oEvent.stopPropagation();
					}
					this._handleAriaActiveDescendant();
				}
			}, this),

			fnOnRight = jQuery.proxy(function(oEvent) {
				if (this._iCurrentFocusIndex >= 0) {
					var oTiles = this.getTiles();
					var iNextIndex = this._iCurrentFocusIndex + 1 < oTiles.length ? this._iCurrentFocusIndex + 1 : this._iCurrentFocusIndex;

					if (!oEvent.ctrlKey) {
						var oNextTile = oTiles[iNextIndex];

						if (!!oNextTile) {
							if (iNextIndex < this._iCurrentTileStartIndex + this._iMaxTiles) { // tile on same page?
								this._findTile(oNextTile.$()).focus();
							} else {
								this.scrollIntoView(oNextTile, true);
								var that = this;
								setTimeout(function() {
									that._findTile(oNextTile.$()).focus();
								}, 400);
							}
						}
					} else if (this.getEditable()) {
						var oTile = oTiles[this._iCurrentFocusIndex];
						this.moveTile(oTile, iNextIndex);
						oTile.$().focus();
					}
					this._handleAriaActiveDescendant();

					// event should not trigger any further actions
					oEvent.stopPropagation();
				}
			}, this),

			fnOnLeft = jQuery.proxy(function(oEvent) {
				if (this._iCurrentFocusIndex >= 0) {
					var oTiles = this.getTiles();
					var iNextIndex = this._iCurrentFocusIndex - 1 >= 0 ? this._iCurrentFocusIndex - 1 : this._iCurrentFocusIndex;

					if (!oEvent.ctrlKey) {
						var oNextTile = oTiles[iNextIndex];

						if (!!oNextTile) {
							if (iNextIndex >= this._iCurrentTileStartIndex) { // tile on same page?
								this._findTile(oNextTile.$()).focus();
							} else {
								this.scrollIntoView(oNextTile, true);
								var that = this;
								setTimeout(function () {
									that._findTile(oNextTile.$()).focus();
								}, 400);
							}
						}
					} else if (this.getEditable()) {
						var oTile = oTiles[this._iCurrentFocusIndex];
						this.moveTile(oTile, iNextIndex);
						oTile.$().focus();
					}
					this._handleAriaActiveDescendant();
					// event should not trigger any further actions
					oEvent.stopPropagation();
				}
			}, this),

			fnOnDown = jQuery.proxy(function(oEvent) {
				if (this._iCurrentFocusIndex >= 0) {
					var iModCurr = this._iCurrentFocusIndex % this._iMaxTiles,
						iNextIndex = this._iCurrentFocusIndex + this._iMaxTilesX,
						iModNext = iNextIndex % this._iMaxTiles;

					if (!oEvent.ctrlKey) {
						var oNextTile = this.getTiles()[iNextIndex];

						if ((iModNext > iModCurr) && !!oNextTile) {
							// '(iModNext > iModCurr)' means: still on same page
							this._findTile(oNextTile.$()).focus();
						}
					} else if (this.getEditable()) {
						var oTile = this.getTiles()[this._iCurrentFocusIndex];
						this.moveTile(oTile, iNextIndex);
						oTile.$().focus();
					}
					this._handleAriaActiveDescendant();
					// event should not trigger any further actions
					oEvent.stopPropagation();
				}
			}, this),

			fnOnUp = jQuery.proxy(function(oEvent) {
				if (this._iCurrentFocusIndex >= 0) {
					var iModCurr = this._iCurrentFocusIndex % this._iMaxTiles,
						iNextIndex = this._iCurrentFocusIndex - this._iMaxTilesX,
						iModNext = iNextIndex % this._iMaxTiles;

					if (!oEvent.ctrlKey) {
						var oNextTile = this.getTiles()[iNextIndex];
						if ((iModNext < iModCurr) && !!oNextTile) {
							// '(iModNext < iModCurr)' means: still on same page
							this._findTile(oNextTile.$()).focus();
						}
					} else if (this.getEditable()) {
						var oTile = this.getTiles()[this._iCurrentFocusIndex];
						this.moveTile(oTile, iNextIndex);
						oTile.$().focus();
					}
					this._handleAriaActiveDescendant();
					// event should not trigger any further actions
					oEvent.stopPropagation();
				}
			}, this),

			fnOnDelete = jQuery.proxy(function(oEvent) {
				if (this._iCurrentFocusIndex >= 0 && this.getEditable()) {
					var oTile = this.getTiles()[this._iCurrentFocusIndex];
					if (oTile.getRemovable()) {
						this.deleteTile(oTile);

						if (this._iCurrentFocusIndex === this.getTiles().length) {
							if (this.getTiles().length !== 0) {
								this.getTiles()[this._iCurrentFocusIndex - 1].$().focus();
							} else {
								this._findNextTabbable().focus();
							}
						} else {
							this.getTiles()[this._iCurrentFocusIndex].$().focus();
						}
						this._handleAriaActiveDescendant();
					}

					oEvent.stopPropagation();
				}
			}, this);

			this.onsaphome = fnOnHome;
			this.onsaphomemodifiers = fnOnHome;
			this.onsapend = fnOnEnd;
			this.onsapendmodifiers = fnOnEnd;
			this.onsapright = this._bRtl ? fnOnLeft : fnOnRight;
			this.onsaprightmodifiers = this._bRtl ? fnOnLeft : fnOnRight;
			this.onsapleft  = this._bRtl ? fnOnRight : fnOnLeft;
			this.onsapleftmodifiers  = this._bRtl ? fnOnRight : fnOnLeft;
			this.onsapup = fnOnUp;
			this.onsapupmodifiers = fnOnUp;
			this.onsapdown = fnOnDown;
			this.onsapdownmodifiers = fnOnDown;
			this.onsappageup = fnOnPageUp;
			this.onsappagedown = fnOnPageDown;
			this.onsapdelete = fnOnDelete;

			this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
		}

		if (sap.ui.Device.system.tablet || sap.ui.Device.system.phone) {
			this._fnOrientationChange = function(oEvent) {
				if (this.getDomRef()) {
					this._oTileDimensionCalculator.calc();
					//there is not need to call this._update, because resize event will be triggered also, where it is called
				}
			}.bind(this);
		}

		this._oTileDimensionCalculator = new TileDimensionCalculator(this);
	};

	/**
	 * Finds the next tabbable element after the TileContainer.
	 * @returns {Element} The next tabbable element after the tile container
	 * @private
	 */
	TileContainer.prototype._findNextTabbable = function() {
		var $Ref = this.$();
		var $Tabbables = jQuery.merge(
			jQuery.merge($Ref.nextAll(), $Ref.parents().nextAll()).find(':sapTabbable').addBack(':sapTabbable'),
			jQuery.merge($Ref.parents().prevAll(), $Ref.prevAll()).find(':sapTabbable').addBack(':sapTabbable')
		);

		return $Tabbables.first();
	};

	/**
	 * Handles the internal event onBeforeRendering.
	 *
	 * @private
	 */
	TileContainer.prototype.onBeforeRendering = function() {

		// unregister the resize listener
		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}
	};

	/**
	 * Handles the internal event onAfterRendering.
	 *
	 * @private
	 */
	TileContainer.prototype.onAfterRendering = function() {

		// init resizing
		this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef().parentElement,  jQuery.proxy(this._resize, this));

		// init the dimensions to the container scoll area
		this._applyDimension();
		this.$().toggleClass("sapMTCEditable",this.getEditable() === true);
		var that = this;

		this._sInitialResizeTimeoutId = setTimeout(function() {
			that._update(true);
		}, this._iInitialResizeTimeout);

		if (sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {
			var aTiles = this.getAggregation("tiles");
			if (aTiles.length > 0 && this._mFocusables) {
				this._mFocusables[aTiles[0].getId()].eq(0).attr('tabindex', '0');
			}
		}

		if (sap.ui.Device.system.tablet || sap.ui.Device.system.phone) {
			sap.ui.Device.orientation.attachHandler(this._fnOrientationChange, this);
		}
	};

	/**
	 * Sets the editable property to the TileContainer, allowing to move icons.
	 * This is currently also set with a long tap.
	 *
	 * @param {boolean} bValue Whether the container is in edit mode or not
	 * @returns {sap.m.TileContainer} this pointer for chaining
	 * @public
	 */
	TileContainer.prototype.setEditable = function(bValue) {
		var aTiles = this.getTiles();

		// set the property
		this.setProperty("editable", bValue, true);
		var bEditable = this.getEditable();
		this.$().toggleClass("sapMTCEditable", bEditable);

		for (var i = 0;i < aTiles.length; i++) {
			var oTile = aTiles[i];

			if (oTile instanceof sap.m.Tile) {
				oTile.isEditable(bEditable);
			}
		}

		return this;	// allow chaining;
	};

	/**
	 * Applies the container's dimensions.
	 *
	 * @private
	 */
	TileContainer.prototype._applyDimension = function() {
		var oDim = this._getContainerDimension(),
			$this = this.$(),
			oThisPos,
			iOffset = 10,
			$scroll = this.$("scrl"),
			scrollPos,
			scrollOuterHeight,
			pagerHeight = this.$("pager").outerHeight();

		$scroll.css({
			width : oDim.outerwidth + "px",
			height : (oDim.outerheight - pagerHeight) + "px"
		});

		oThisPos = $this.position();

		scrollPos  = $scroll.position();
		scrollOuterHeight = $scroll.outerHeight();

		if (sap.ui.Device.system.phone) {
			iOffset = 2;
		} else if (sap.ui.Device.system.desktop) {
			iOffset = 0;
		}

		this.$("blind").css({
			top : (scrollPos.top + iOffset) + "px",
			left : (scrollPos.left + iOffset) + "px",
			right: "auto",
			width : ($scroll.outerWidth() - iOffset) + "px",
			height : (scrollOuterHeight - iOffset) + "px"
		});

		this.$("rightedge").css({
			top : (oThisPos.top + iOffset) + "px",
			right : iOffset + "px",
			left : "auto",
			height : (scrollOuterHeight - iOffset) + "px"
		});

		this.$("leftedge").css({
			top : (oThisPos.top + iOffset) + "px",
			left : (oThisPos.left + iOffset) + "px",
			right: "auto",
			height : (scrollOuterHeight - iOffset) + "px"
		});
	};

	/**
	 * Handles the resize event for the TileContainer.
	 * Called whenever the orientation of browser size changes.
	 *
	 * @private
	 */
	TileContainer.prototype._resize = function() {
		if (this._oDragSession) {
			return;
		}

		setTimeout(jQuery.proxy(function() {
			this._update(true);
			delete this._iInitialResizeTimeout;
		},this),
		this._iInitialResizeTimeout);

		this._iInitialResizeTimeout = 0; //now we do not need to wait
	};

	/**
	 * Called from parent if the control is destroyed.
	 *
	 * @private
	 */
	TileContainer.prototype.exit = function() {

		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}

		if (this._sInitialResizeTimeoutId) {
			clearTimeout(this._sInitialResizeTimeoutId);
		}

		if (sap.ui.Device.system.tablet || sap.ui.Device.system.phone) {
			sap.ui.Device.orientation.detachHandler(this._fnOrientationChange, this);
		}
	};

	/**
	 * Updates all Tiles.
	 *
	 * @private
	 */
	TileContainer.prototype._update = function(bAnimated) {

		if (!this.getDomRef()) {
			return;
		}

		if (!this.$().is(":visible")) {
			return;
		}

		this._oTileDimensionCalculator.calc();
		this._updateTilePositions();

		if (!this._oDragSession) {
			this.scrollIntoView(this._iCurrentTileStartIndex || 0, bAnimated);
		}
	};

	/**
	 * Returns the index of the first Tile visible in the current page.
	 *
	 * @returns {int} The index of the first Tile that is visible in the current page
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TileContainer.prototype.getPageFirstTileIndex = function() {
		return this._iCurrentTileStartIndex || 0;
	};

	/**
	 * Moves a given Tile to the given index.
	 *
	 * @param {sap.m.Tile} vTile The tile to move
	 * @param {int} iNewIndex The new Tile position in the tiles aggregation
	 * @returns {sap.m.TileContainer} this pointer for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TileContainer.prototype.moveTile = function(vTile, iNewIndex) {
		if (!isNaN(vTile)) {
			vTile = this.getTiles()[vTile];
		}

		if (!vTile) {
			jQuery.sap.log.info("No Tile to move");
			return this;
		}

		this.deleteTile(vTile);
		this.insertTile(vTile, iNewIndex);

		return this;
	};

	/**
	 * Adds a Tile to the end of the tiles collection.
	 *
	 * @param {sap.m.Tile} oTile The tile to add
	 * @returns {sap.m.TileContainer} this pointer for chaining
	 * @override
	 * @public
	 */
	TileContainer.prototype.addTile = function(oTile) {
		this.insertTile(oTile,this.getTiles().length);
	};

	/**
	 * Inserts a Tile to the given index.
	 *
	 * @param {sap.m.Tile} oTile The Tile to insert
	 * @param {int} iIndex The new Tile position in the tiles aggregation
	 * @returns {sap.m.TileContainer} this pointer for chaining
	 * @override
	 * @public
	 */
	TileContainer.prototype.insertTile = function(oTile, iIndex) {
		var that = this;
		// keyboard support for desktop environments
		if (sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {
			oTile.addEventDelegate({
				"onAfterRendering": function() {
					if (!that._mFocusables) {
						that._mFocusables = {};
					}

					that._mFocusables[this.getId()] = this.$().find("[tabindex!='-1']").addBack().filter(that._isFocusable);
					that._mFocusables[this.getId()].attr('tabindex', '-1');
				}
			}, oTile);

			var fnOnFocusIn = function(oEvent) {
				var iIndex = that.indexOfAggregation("tiles", this),
					iExpectedPage = Math.floor(iIndex / that._iMaxTiles),
					iPageDelta = iExpectedPage - that._iCurrentPage;


				var iPreviousTileIndex = that._iCurrentFocusIndex >= 0 ? that._iCurrentFocusIndex : 0;
				var oPrevTile = that.getTiles()[iPreviousTileIndex];

				if (oPrevTile) {
					that._mFocusables[oPrevTile.getId()].attr("tabindex", "-1");
					that._mFocusables[this.getId()].attr("tabindex", "0");
				}

				if (iPageDelta != 0) {
					that.scrollIntoView(iIndex);
					that._resize();
				}
				that._handleAriaActiveDescendant();

				that._iCurrentFocusIndex = iIndex;
			};

			oTile.addEventDelegate({
				"onfocusin": fnOnFocusIn
			}, oTile);
		}

		if (this.getDomRef()) {
			this.insertAggregation("tiles", oTile, iIndex, true);

			if (!this._oDragSession) {
				var oRm = sap.ui.getCore().createRenderManager(),
					oContent = this.$("cnt")[0];
				oRm.renderControl(oTile);
				oRm.flush(oContent, false, iIndex);
				oRm.destroy();
			}

			//this._applyPageStartIndex(iIndex);
			this._update(false);

			// When the control is initialized/updated with data binding and optimization for rendering
			// tile by tile is used we need to be sure we have a focusable tile.
			if (sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {
				this._updateTilesTabIndex();
			}
		} else {
			this.insertAggregation("tiles",oTile,iIndex);
		}

		handleAriaPositionInSet.call(this, iIndex, this.getTiles().length);
		handleAriaSize.call(this);

		return this;
	};

	/**
	 * Updates the tab index of the Tiles.
	 * If there is no focusable Tile (for example, tabindex = 0), updates the first tile.
	 * @private
	 */
	TileContainer.prototype._updateTilesTabIndex = function () {
		var aTiles = this.getAggregation("tiles");
		if (aTiles.length && aTiles.length > 0) {
			for (var i = 0; i < aTiles.length; i++) {
				if (aTiles[i].$().attr("tabindex") === "0") {
					return;
				}
			}
		}
		aTiles[0].$().attr("tabindex", "0");
	};

	/**
	 * Checks if a DOM element is focusable.
	 * To be used within jQuery.filter function.
	 * @param {int} index Index of the element within an array
	 * @param {Element} element DOM element to check
	 * @returns {Boolean} If a DOM element is focusable
	 * @private
	 */
	TileContainer.prototype._isFocusable = function(index, element) {
		var isTabIndexNotNaN = !isNaN(jQuery(element).attr("tabindex"));
		var nodeName = element.nodeName.toLowerCase();
		if ( nodeName === "area" ) {
			var map = element.parentNode,
				mapName = map.name,
				img;
			if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
				return false;
			}
			img = jQuery( "img[usemap=#" + mapName + "]" )[0];
			return !!img;
		}
		/*eslint-disable no-nested-ternary */
		return ( /input|select|textarea|button|object/.test( nodeName )
			? !element.disabled
			: nodeName == "a"
				? element.href || isTabIndexNotNaN
				: isTabIndexNotNaN);
		/*eslint-enable no-nested-ternary */
	};

	/**
	 * Deletes a Tile.
	 *
	 * @param {sap.m.Tile} oTile The tile to move
	 * @returns {sap.m.TileContainer} this pointer for chaining
	 * @override
	 * @public
	 */
	TileContainer.prototype.deleteTile = function(oTile) {
		var iTileUnderDeletionIndex = this.indexOfAggregation("tiles",oTile);

		if (this.getDomRef()) {
			var iPreviousTileIndex = iTileUnderDeletionIndex - 1;
			this.removeAggregation("tiles",oTile,true);

			if (!this._oDragSession) {
				oTile.getDomRef().parentNode.removeChild(oTile.getDomRef());
				if (sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {
					if (this._mFocusables && this._mFocusables[oTile.getId()]) {
						delete this._mFocusables[oTile.getId()];
					}
				}
			}

			this._applyPageStartIndex(iPreviousTileIndex < 0 ? 0 : iPreviousTileIndex);
			this._update(false);
		} else {
			this.removeAggregation("tiles",oTile,false);
		}

		handleAriaPositionInSet.call(this, iTileUnderDeletionIndex, this.getTiles().length);
		handleAriaSize.call(this);
		return this;
	};

	TileContainer.prototype.removeTile = TileContainer.prototype.deleteTile;

	TileContainer.prototype.removeAllTiles = function() {
		var iTileCount = this.getTiles().length - 1; //Zero based index
		for (var iIndex = iTileCount; iIndex >= 0; iIndex--) {
			var oTile = this.getTiles()[iIndex];
			this.deleteTile(oTile);
		}
		return this;
	};

	TileContainer.prototype.destroyTiles = function(){
		if (this.getDomRef()) {
			var aTiles = this.getTiles();
			this.removeAllAggregation("tiles", true);
			this._update();
			for (var i = 0;i < aTiles.length; i++) {
				var tile = aTiles[i];
				tile.destroy();
			}
		} else {
			this.destroyAggregation("tiles", false);
		}
		return this;
	};

	TileContainer.prototype.rerender = function() {
		if (!this._oDragSession || this._oDragSession.bDropped) {
			Control.prototype.rerender.apply(this);
		}
	};

	/**
	 * Scrolls one page to the left.
	 *
	 * @public
	 */
	TileContainer.prototype.scrollLeft = function() {
		if (this._bRtl) {
			this.scrollIntoView(this._iCurrentTileStartIndex + this._iMaxTiles);
		} else {
			this.scrollIntoView(this._iCurrentTileStartIndex - this._iMaxTiles);
		}
	};

	/**
	 * Scrolls one page to the right.
	 *
	 * @public
	 */
	TileContainer.prototype.scrollRight = function() {
		if (this._bRtl) {
			this.scrollIntoView(this._iCurrentTileStartIndex - this._iMaxTiles);
		} else {
			this.scrollIntoView(this._iCurrentTileStartIndex + this._iMaxTiles);
		}
	};

	/**
	 * Scrolls to the page where the given Tile or tile index is included.
	 * Optionally this can be done animated or not. With IE9 the scroll is never animated.
	 *
	 * @param {sap.m.Tile|int} vTile The Tile or tile index to be scrolled into view
	 * @param {boolean} bAnimated Whether the scroll should be animated
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TileContainer.prototype.scrollIntoView = function(vTile, bAnimated) {

		var iContentWidth = this._getContentDimension().outerwidth,
			iIndex = vTile;

		if (isNaN(vTile)) {
			iIndex = this.indexOfAggregation("tiles",vTile);
		}

		if (!this.getTiles()[iIndex]) {
			return;
		}

		this._applyPageStartIndex(iIndex);

		this._iCurrentPage = Math.floor(this._iCurrentTileStartIndex / this._iMaxTiles);

		if (this._bRtl) {
			this._scrollTo((this._iPages - this._iCurrentPage) * iContentWidth, bAnimated);
		} else {
			this._scrollTo(this._iCurrentPage * iContentWidth, bAnimated);
		}

		this._updatePager();
	};

	/**
	 * Updates the tile positions.
	 *
	 * @private
	 */
	TileContainer.prototype._updateTilePositions = function(){

		var oContentDimension = this._getContainerDimension();

		if (oContentDimension.height === 0) {	// nothing to do because the height of the content is not (yet) available
			return;
		}

		if (this.getTiles().length === 0) {	// no tiles
			return;
		}

		this._applyPageStartIndex(this._iCurrentTileStartIndex);
		this._applyDimension();

		var aTiles = this.getTiles(),
			oContentDimension = this._getContentDimension();

		this._iPages = Math.ceil(aTiles.length / this._iMaxTiles);

		var oTileDimension = this._oTileDimensionCalculator.getLastCalculatedDimension();
		for (var i = 0; i < aTiles.length; i++) {

			if (aTiles[i].isDragged()) {
				continue;
			}

			var iPage =  Math.floor(i / this._iMaxTiles),
				oTile = aTiles[i],
				iLeft = (iPage * oContentDimension.outerwidth) + this._iOffsetX + i % this._iMaxTilesX * oTileDimension.width,
				iTop =  this._iOffsetY + Math.floor(i / this._iMaxTilesX) * oTileDimension.height - (iPage * this._iMaxTilesY * oTileDimension.height);

			if (this._bRtl) {
				iLeft = (this._iPages - iPage) * oContentDimension.outerwidth - this._iOffsetX - (i % this._iMaxTilesX  + 1) * oTileDimension.width;
			}

			oTile.setPos(iLeft,iTop);
			oTile.setSize(oTileDimension.width, oTileDimension.height);
		}
	};

	/**
	 * Finds a Tile.
	 * Convenience method, which returns $node if it has Css class sapMTile
	 * or the first child with that class.
	 *
	 * @private
	 */
	TileContainer.prototype._findTile = function($node) {
		if ($node.hasClass('sapMTile') || $node.hasClass('sapMCustomTile')) {
			return $node;
		} else {
			// return $node.find('.sapMTile');
			return $node.find('.sapMTile') || $node.find('.sapMCustomTile');
		}
	};

	/**
	 * Updates the pager part of the TileContainer.
	 * This is done dynamically.
	 *
	 * @private
	 */
	TileContainer.prototype._updatePager = function() {

		var oPager = this.$("pager")[0],
			oScrollLeft = this.$("leftscroller")[0],
			oScrollRight = this.$("rightscroller")[0];

		if (this._iPages > 1) {
			var aHTML = [""];

			for (var i = 0;i < this._iPages;i++) {
				aHTML.push("");
			}

			oPager.innerHTML = aHTML.join("<span></span>");
			oPager.style.display = "block";
			oPager.childNodes[this._iCurrentPage].className = "sapMTCActive";

			if (sap.ui.Device.system.desktop) {

				var hide = {
					r: this._iCurrentPage == this._iPages - 1,
					l: this._iCurrentPage == 0
				};

				if (this._bRtl) {
					var tmp = hide.r;
					hide.r = hide.l;
					hide.l = tmp;
					// Less builder swaps left and right in RTL styles,
					// and that is not required here
					oScrollRight.style.left = "auto";
					oScrollLeft.style.right = "auto";
				}

				oScrollRight.style.right = hide.r ? "-100px" : "1rem";
				oScrollLeft.style.left   = hide.l ? "-100px" : "1rem";
				oScrollLeft.style.display  = "block";
				oScrollRight.style.display = "block";

				if (hide.r) {
					oScrollRight.style.display = "none";
				}

				if (hide.l) {
					oScrollLeft.style.display = "none";
				}
			}
		} else {

			oPager.innerHTML = "";
			oScrollRight.style.right = "-100px";
			oScrollLeft.style.left = "-100px";
			oScrollLeft.style.display = "none";
			oScrollRight.style.display = "none";
		}
	};

	/**
	 * Returns the dimension (width and height) of the pages content.
	 *
	 * @returns {object} Width and height of the pages content
	 * @private
	 */
	TileContainer.prototype._getContentDimension = function() {

		if (!this.getDomRef()) {
			return;
		}

		var oScroll = this.$("scrl");

		return {
			width  		: oScroll.width(),
			height 		: oScroll.height() - 20,
			outerheight : oScroll.outerHeight() - 20,
			outerwidth 	: oScroll.outerWidth()
		};
	};

	/**
	 * Returns the dimension (width and height) of the TileContainer content.
	 *
	 * @returns {object} Width and height of the pages content
	 * @private
	 */
	TileContainer.prototype._getContainerDimension = function() {
		var oDomRef = this.$();

		if (!oDomRef) {
			return;
		}

		return {
			width  		: oDomRef.width(),
			height 		: oDomRef.height(),
			outerheight : oDomRef.outerHeight(),
			outerwidth 	: oDomRef.outerWidth()
		};
	};

	/**
	 * Calculates the Tile page sizes.
	 *
	 * @private
	 */
	TileContainer.prototype._calculatePositions = function() {

		if (this.getTiles().length === 0) {	// no tiles
			return;
		}

		var oContentDimension = this._getContainerDimension(),
			iTiles = this.getTiles().length,
			iPagerHeight = this.$("pager")[0].offsetHeight;

		if (oContentDimension.height === 0) {	// nothing to do because the height of the content is not (yet) available
			return;
		}

		if (sap.ui.Device.system.desktop) {
			oContentDimension.width  -= 45 * 2;
		}

		var oTileDimension = this._oTileDimensionCalculator.getLastCalculatedDimension(),
			iMaxTilesX = Math.max( Math.floor( oContentDimension.width / oTileDimension.width ),1), 		  //at least one tile needs to be visible
			iMaxTilesY = Math.max( Math.floor((oContentDimension.height - iPagerHeight) / oTileDimension.height),1), //at least one tile needs to be visible
			iNumTileX = (iTiles < iMaxTilesX)  ? iTiles : iMaxTilesX,
			iNumTileY = (iTiles / iNumTileX < iMaxTilesY)  ? Math.ceil(iTiles / iNumTileX) : iMaxTilesY;

		// set the member vars for further usage
		this._iMaxTiles = iMaxTilesX * iMaxTilesY;
		this._iMaxTilesX = iMaxTilesX;
		this._iMaxTilesY = iMaxTilesY;
		this._iOffsetX = Math.floor(( oContentDimension.width  -  (oTileDimension.width * iNumTileX)) / 2);

		if (sap.ui.Device.system.desktop) {
			this._iOffsetX += 45;
		}

		this._iOffsetY = Math.floor(( oContentDimension.height - iPagerHeight - (oTileDimension.height * iNumTileY )) / 2);

	};

	/**
	 * Gets Tiles from a given position.
	 * Returns an array for a given pixel position in the TileContainer.
	 * Normally, there is only one Tile for a position.
	 *
	 * @param {int} iX Position in px
	 * @param {int} iY Position in px
	 * @returns {array} Array of Tiles for the given position
	 * @private
	 */
	TileContainer.prototype._getTilesFromPosition = function(iX, iY) {

		if (!this.getTiles().length) {
			return [];
		}

		iX = iX + this._iScrollLeft;

		var aTiles = this.getTiles(),
			aResult = [];

		for (var i = 0;i < aTiles.length;i++) {
			var oTile = aTiles[i],
				oRect = {
					top: oTile._posY,
					left: oTile._posX,
					width: oTile._width,
					height: oTile._height
				};

			if (!aTiles[i].isDragged() && iY > oRect.top && iY < oRect.top + oRect.height && iX > oRect.left && iX < oRect.left + oRect.width) {
				aResult.push(aTiles[i]);
			}
		}

		return aResult;
	};

	/**
	 * Applies the start index of the pages' first Tile according to the given index.
	 *
	 * @param {int} iIndex The index of the tile that should be visible
	 * @private
	 */
	TileContainer.prototype._applyPageStartIndex = function(iIndex) {

		var oContentDimension = this._getContainerDimension();

		if (oContentDimension.height === 0) {	// nothing to do because the height of the content is not (yet) available
			return;
		}

		this._calculatePositions();
		var iLength = this.getTiles().length;

		if (iIndex < 0) {
			iIndex = 0;
		} else if (iIndex > iLength - 1) {
			iIndex = iLength - 1;
		}

		// where does the page start
		var iCurrentPage = Math.floor(iIndex / this._iMaxTiles || 0);
		this._iCurrentTileStartIndex = iCurrentPage * (this._iMaxTiles  || 0);

		jQuery.sap.log.info("current index " + this._iCurrentTileStartIndex);
	};

	/**
	 * Scrolls to the given position.
	 *
	 * @param {int} iScrollLeft The new scroll position
	 * @param {boolean} bAnimated Whether the scroll is animated
	 * @private
	 */
	TileContainer.prototype._scrollTo = function(iScrollLeft, bAnimated) {
		if (bAnimated !== false) {
			bAnimated = true; // animated needs to be set explicitly to false
		}

		this._applyTranslate(this.$("cnt"), -iScrollLeft, 0, bAnimated);

		if (this._bRtl) {
			this._iScrollLeft = iScrollLeft - this._getContentDimension().outerwidth;
		} else {
			this._iScrollLeft = iScrollLeft;
		}
	};

	/**
	 * Applies the translate x and y to the given jQuery object.
	 *
	 * @param {object} o$ The jQuery object
	 * @param {int} iX The px x value for the translate
	 * @param {int} iY The px y value for the translate
	 * @param {boolean} bAnimated Whether the translate should be animated or not
	 * @private
	 */
	TileContainer.prototype._applyTranslate = function(o$, iX, iY, bAnimated) {
		var o = o$[0];

		this.$("cnt").toggleClass("sapMTCAnim",bAnimated);

		if ("webkitTransform" in o.style) {
			o$.css('-webkit-transform','translate3d(' + iX + 'px,' + iY + 'px,0)');
		} else if ("MozTransform" in o.style) {
			o$.css('-moz-transform','translate(' + iX + 'px,' + iY + 'px)');
		} else if ("transform" in o.style) {
			o$.css('transform','translate3d(' + iX + 'px,' + iY + 'px,0)');
		} else if ("msTransform" in o.style) {
			o$.css('-ms-transform','translate(' + iX + 'px,' + iY + 'px)');
		}
	};

	/**
	 * Initializes the touch session for the TileContainer.
	 *
	 * @param {jQuery.Event} oEvent The event object that started the touch
	 * @private
	 */
	TileContainer.prototype._initTouchSession = function(oEvent) {
		if (oEvent.type == "touchstart") {
			var targetTouches = oEvent.targetTouches[0];
			this._oTouchSession = {
				dStartTime : new Date(),
				fStartX : targetTouches.pageX,
				fStartY : targetTouches.pageY,
				fDiffX : 0,
				fDiffY : 0,
				oControl : oEvent.srcControl,
				iOffsetX :  targetTouches.pageX - oEvent.target.offsetLeft
			};
		} else { // mousedown
			this._oTouchSession = {
				dStartTime : new Date(),
				fStartX : oEvent.pageX,
				fStartY : oEvent.pageY,
				fDiffX : 0,
				fDiffY : 0,
				oControl : oEvent.srcControl,
				iOffsetX :  oEvent.pageX - oEvent.target.offsetLeft
			};
		}
	};

	/**
	 * Initializes the drag session for the TileContainer.
	 *
	 * @param {jQuery.Event} oEvent The event object that started the drag
	 * @private
	 */
	TileContainer.prototype._initDragSession = function(oEvent) {
		while (oEvent.srcControl && oEvent.srcControl.getParent() != this) {
			 oEvent.srcControl =  oEvent.srcControl.getParent();
		}

		var iIndex = this.indexOfAggregation("tiles",oEvent.srcControl);

		if (oEvent.type == "touchstart") {

		this._oDragSession = {
				oTile  : oEvent.srcControl,
				oTileElement  : oEvent.srcControl.$()[0],
				iOffsetLeft : oEvent.targetTouches[0].pageX - oEvent.srcControl._posX + this._iScrollLeft,
				iOffsetTop  : oEvent.targetTouches[0].pageY - oEvent.srcControl._posY,
				iIndex : iIndex,
				iOldIndex : iIndex,
				iDiffX : oEvent.targetTouches[0].pageX,
				iDiffY : oEvent.targetTouches[0].pageY
		};
		} else { // mousedown
			this._oDragSession = {
					oTile  : oEvent.srcControl,
					oTileElement  : oEvent.srcControl.$()[0],
					iOffsetLeft : oEvent.pageX - oEvent.srcControl._posX + this._iScrollLeft,
					iOffsetTop  : oEvent.pageY - oEvent.srcControl._posY,
					iIndex : iIndex,
					iOldIndex : iIndex,
					iDiffX : oEvent.pageX,
					iDiffY : oEvent.pageY
			};
		}
	};

	/**
	 * Handles click events for scrollers on desktop.
	 *
	 * @param {jQuery.Event} oEvent The event object that started the drag
	 * @private
	 */
	TileContainer.prototype.onclick = function(oEvent) {
		var oPager = this.$("pager")[0];

		if (oEvent.target.id == this.getId() + "-leftscroller" || oEvent.target.parentNode.id == this.getId() + "-leftscroller") {
			this.scrollLeft();
		} else if (oEvent.target.id == this.getId() + "-rightscroller" || oEvent.target.parentNode.id == this.getId() + "-rightscroller") {
			this.scrollRight();
		} else if (oEvent.target == oPager && sap.ui.Device.system.desktop) {
			if (oEvent.offsetX < oPager.offsetWidth / 2) {
				this.scrollLeft();
			} else {
				this.scrollRight();
			}
		}
	};

	/**
	 * Handles the touchstart event on the TileContainer.
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TileContainer.prototype.ontouchstart = function(oEvent) {

		// mark the event for components that needs to know if the event was handled by this control.
		oEvent.setMarked();

		if (oEvent.targetTouches.length > 1 || this._oTouchSession) {	// allow only one touch session
			return;
		}

		while (oEvent.srcControl && oEvent.srcControl.getParent() != this) {
			 oEvent.srcControl =  oEvent.srcControl.getParent();
		}

		if (oEvent.srcControl instanceof sap.m.Tile && this.getEditable()) {

			if (oEvent.target.className != "sapMTCRemove") {
				this._initDragSession(oEvent);
				this._initTouchSession(oEvent);
				this._oDragSession.oTile.isDragged(true);
			} else {
				this._initTouchSession(oEvent);
			}

			this._bAvoidChildTapEvent = true;
		} else {
			this._initTouchSession(oEvent);
		}

		jQuery(document).on("touchmove mousemove", jQuery.proxy(this._onmove, this));
		jQuery(document).on("touchend touchcancel mouseup", jQuery.proxy(this._onend, this));
	};

	/**
	 * Handles the touchmove event on the TileContainer.
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TileContainer.prototype._onmove = function(oEvent) {

		if (document.selection && document.selection.clear) {
			document.selection.clear();
		}

		if (oEvent.isMarked("delayedMouseEvent")) {
			return;
		}

		if (oEvent.targetTouches && oEvent.targetTouches.length > 1) {	//allow only one touch session
			return;
		}

		if (!oEvent.targetTouches) {
			oEvent.targetTouches = [{pageX:oEvent.pageX,pageY:oEvent.pageY}];
		}

		var oTouchSession = this._oTouchSession;
		oTouchSession.fDiffX = oTouchSession.fStartX - oEvent.targetTouches[0].pageX;
		oTouchSession.fDiffY = oTouchSession.fStartY - oEvent.targetTouches[0].pageY;

		if (this._oDragSession) {

			if (Math.abs(oTouchSession.fDiffX) > 5) {
				if (!this._oDragSession.bStarted) {
					this._oDragSession.bStarted = true;
					this._onDragStart(oEvent);
				} else {
					this._onDrag(oEvent);
				}

				this._bAvoidChildTapEvent = true;
			}
		} else if (oTouchSession) {
			var contentWidth = this._getContentDimension().outerwidth;
			var iNewLeft = -this._iScrollLeft - oTouchSession.fDiffX;

			if (iNewLeft > this._iScrollGap) {
				return;
			} else if (iNewLeft < -(((this._iPages - 1) * contentWidth) + this._iScrollGap)) {
				return;
			}

			if (this._bRtl) {
				iNewLeft = iNewLeft - contentWidth;
			}

			this._applyTranslate(this.$("cnt"),iNewLeft,0,false);
		}
	};

	/**
	 * Handles the touchend and mouseup events on the TileContainer.
	 *
	 * @param {jQuery.Event} The event object
	 * @private
	 */
	TileContainer.prototype._onend = function(oEvent) {

		if (oEvent.isMarked("delayedMouseEvent")) {
			return;
		}

		jQuery(document).off("touchend touchcancel mouseup", this._onend);
		jQuery(document).off("touchmove mousemove", this._onmove);

		if (this._oDragSession) {

			this._onDrop(oEvent);
			delete this._oTouchSession;
			return;
		}

		if (!this._oTouchSession) {
			return;
		}

		var oTouchSession = this._oTouchSession,
			oDate = new Date(),
			bFast = (oDate - oTouchSession.dStartTime < 600),
			iRtl = this._bRtl ? -1 : 1;

		// handle fast swipe or tap
		if (bFast) {
			var oPager = this.$("pager")[0];

			if (Math.abs(oTouchSession.fDiffX) > 30) {

				this._applyPageStartIndex(this._iCurrentTileStartIndex + ((oTouchSession.fDiffX * iRtl > 0 ? 1 : -1) * this._iMaxTiles));
				this._bAvoidChildTapEvent = true;
			} else if (oEvent.target == oPager && !sap.ui.Device.system.desktop) {

				if ((oTouchSession.iOffsetX - oPager.offsetWidth / 2) * iRtl < 0) {
					this.scrollLeft();
				} else {
					this.scrollRight();
				}

				this._bAvoidChildTapEvent = true;
			} else if (oEvent.target.className == "sapMTCRemove") {
				if (oEvent.type === "touchend" || (oEvent.type === "mouseup" && oEvent.button === 0)) {
					this.fireTileDelete({ tile: oTouchSession.oControl });
				}
			}
		} else {
			var oContentDimension = this._getContentDimension();

			if (Math.abs(oTouchSession.fDiffX) > oContentDimension.outerwidth / 2) {
				this._applyPageStartIndex(this._iCurrentTileStartIndex + ((oTouchSession.fDiffX * iRtl > 0 ? 1 : -1) * this._iMaxTiles));
				this._bAvoidChildTapEvent = true;
			}
		}

		this._update();

		// remove unused properties
		delete this._oDragSession;
		delete this._oTouchSession;
		var that = this;

		setTimeout(function(){
			that._bAvoidChildTapEvent = false;
		},100);
	};

	/**
	 * Handles the drag start of an item in Edit mode.
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TileContainer.prototype._onDragStart = function(oEvent) {
		this.$().append(this._oDragSession.oTileElement);
		this._oDragSession.iDiffX = this._oTouchSession.fStartX - this._oTouchSession.fDiffX;
		this._oDragSession.iDiffY = this._oTouchSession.fStartY - this._oTouchSession.fDiffY;
		this._oDragSession.oTile.setPos(this._oDragSession.iDiffX - this._oDragSession.iOffsetLeft,this._oDragSession.iDiffY - this._oDragSession.iOffsetTop);
		this.$("blind").css("display","block");
	};

	/**
	 * Handles the dragging of an item.
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TileContainer.prototype._onDrag = function(oEvent) {

		// calculate the center and middle position of the dragged tile
		if (!this._oTouchSession) {

			// if onDrag is fired after an scroll interval but the drag session was already ended.
			clearTimeout(this.iScrollTimer);
			this._oDragSession = null;
			this.iScrollTimer = null;
			this._bTriggerScroll = false;
			return;
		}

		this._oDragSession.iDiffX = this._oTouchSession.fStartX - this._oTouchSession.fDiffX;
		this._oDragSession.iDiffY = this._oTouchSession.fStartY - this._oTouchSession.fDiffY;

		var oContentDimension = this._getContentDimension(),
			iTop = this._oDragSession.iDiffY - this._oDragSession.iOffsetTop,
			iLeft = this._oDragSession.iDiffX - this._oDragSession.iOffsetLeft,
			iMiddle = iTop + (this._oDragSession.oTileElement.offsetHeight / 2),
			iCenter = iLeft + (this._oDragSession.oTileElement.offsetWidth / 2),
			bScrollRight = iLeft +  this._oDragSession.oTileElement.offsetWidth - this._iTriggerScrollOffset > oContentDimension.width,
			bScrollLeft =  iLeft  < -this._iTriggerScrollOffset,
			iNearRight = oContentDimension.width - (iLeft +  this._oDragSession.oTileElement.offsetWidth),
			iNearLeft =  iLeft;

		//jQuery.sap.log.info("ScrollLeft = " + this._iScrollLeft + " Left = " + iLeft + " Top = " + iTop);
		this._oDragSession.oTile.setPos(iLeft,iTop);

		// reset the clipping of the tile
		this._oDragSession.oTile.$().css("clip","auto");

		// clip the right part of the tile if it is near the right edge
		var oRight = this.$("rightedge")[0];
		if (iLeft + this._oDragSession.oTile._width > oRight.offsetLeft + oRight.offsetWidth && this._iCurrentPage < this._iPages - 1) {
			var iClipRight = oRight.offsetLeft + oRight.offsetWidth - iLeft - ((this._oDragSession.oTile._width - this._oDragSession.oTile.$().outerWidth(false)) / 2) - 2;
			this._oDragSession.oTile.$().css("clip","rect(-25px," + iClipRight + "px," + (this._oDragSession.oTile._height + 20) + "px,-25px)");
		}

		// clip the left part of the tile if it is near the left edge
		var oLeft = this.$("leftedge")[0];
		if (iLeft < oLeft.offsetLeft + 2 + ((this._oDragSession.oTile._width - this._oDragSession.oTile.$().outerWidth(false)) / 2) && this._iCurrentPage > 0) {
			var iClipLeft = oLeft.offsetLeft + 4 - iLeft - ((this._oDragSession.oTile._width - this._oDragSession.oTile.$().outerWidth(false)) / 2);
			this._oDragSession.oTile.$().css("clip","rect(-25px," + this._oDragSession.oTile._width + "px," + (this._oDragSession.oTile._height + 20) + "px," + iClipLeft + "px)");
		}

		// increase the opacity of the right edge the closer the tile is moved
		if (iNearRight < this._iEdgeShowStart && this._iCurrentPage < this._iPages - 1) {
			var iOpacity = (this._iEdgeShowStart - iNearRight) / (this._iEdgeShowStart + this._iTriggerScrollOffset);
			this.$("rightedge").css("opacity","" + iOpacity);
		} else {

			// not near the edge
			this.$("rightedge").css("opacity","0.01");
		}

		// increase the opacity of the left edge the closer the tile is moved
		if (iNearLeft < this._iEdgeShowStart && this._iCurrentPage > 0) {
			var iOpacity = (this._iEdgeShowStart - iNearLeft) / (this._iEdgeShowStart + this._iTriggerScrollOffset);
			this.$("leftedge").css("opacity","" + iOpacity);
		} else {

			// not near the edge
			this.$("leftedge").css("opacity","0.01");
		}

		// check if scrolling needed
		var bScrollNeeded;

		if (this._bRtl) {
			bScrollNeeded = bScrollRight && this._iCurrentPage > 0 || bScrollLeft && this._iCurrentPage < this._iPages - 1;
		} else {
			bScrollNeeded = bScrollLeft && this._iCurrentPage > 0 || bScrollRight && this._iCurrentPage < this._iPages - 1;
		}

		if (bScrollNeeded) {
			if (this._bTriggerScroll) {
				bScrollLeft ? this.scrollLeft() : this.scrollRight();
			} else {

				// start the interval timer
				var that = this;
				if (!this.iScrollTimer) {
					this.iScrollTimer = setInterval(function () {
						that._bTriggerScroll = true;
						that._onDrag(oEvent); //retrigger the event
						that._bTriggerScroll = false;
					},1000);
				}
			}

			// do not process further to avoid hovered tiles from the next page to be processed
			return;
		} else {

			// reset the interval timer
			if (this.iScrollTimer) {
				clearTimeout(this.iScrollTimer);
				this._bTriggerScroll = false;
				this.iScrollTimer = null;
			}
		}

		// get the hovered tile
		var aHoveredTiles = this._getTilesFromPosition(iCenter, iMiddle);
		if (aHoveredTiles && aHoveredTiles.length > 0) {

			// insert the tile after if center is on the right half of the target tile
			var oHoveredTile = aHoveredTiles[0],
				oRect = {
					top: oHoveredTile._posY,
					left: oHoveredTile._posX,
					width: oHoveredTile._width,
					height: oHoveredTile._height
				};

			var iIndex = this.indexOfAggregation("tiles", oHoveredTile);

			// (iIndex % this._iMaxTilesX) != 0 = Not a start tile in a row to avoid inserting in previous row which would flicker if
			// drag right before the first tile in a row.
			if (iCenter + this._iScrollLeft < ((oRect.left + oRect.width) / 2) && (iIndex % this._iMaxTilesX) != 0) {
				iIndex--;
			}

			this._oDragSession.iIndex = iIndex;
			this.moveTile(this._oDragSession.oTile,this._oDragSession.iIndex);
		} else if (this._iCurrentPage == this._iPages - 1) {

			// check whether the dragged tile is at the end of the tile container
			var aTiles = this.getTiles(),
				oLastTile = aTiles[aTiles.length - 1];

			if (oLastTile && iCenter > oLastTile._posX - this._iScrollLeft && iMiddle > oLastTile._posY) {
				this._oDragSession.iIndex = aTiles.length - 1;
				this.moveTile(this._oDragSession.oTile, this._oDragSession.iIndex);
			}
		}
	};

	/**
	 * Handles the drop of a Tile.
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TileContainer.prototype._onDrop = function(oEvent) {
		if (this._oDragSession) {
			var oTile = this._oDragSession.oTile,
				iIndex = this._oDragSession.iIndex;

			this._oDragSession.oTile.isDragged(false);

			if (this._oDragSession.iOldIndex != this._oDragSession.iIndex) {
				this.fireTileMove({
					tile: oTile,
					newIndex: iIndex
				});
			}

			this.$("blind").css("display","block");

			if (this._oDragSession.bStarted) {
				this._oDragSession.oTile.setPos(this._oDragSession.oTile._posX + this._iScrollLeft, this._oDragSession.oTile._posY);
			}

			// reset the clipping
			this._oDragSession.oTile.$().css("clip","auto");

			// reset the edges
			this.$("rightedge").css("opacity","0.01");
			this.$("leftedge").css("opacity","0.01");
			this.$("cnt").append(this._oDragSession.oTileElement);
			delete this._oDragSession;
			this.moveTile(oTile, iIndex);
			this.scrollIntoView(oTile, false);

			if (sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {
				this._findTile(oTile.$()).focus();
			}
			this._handleAriaActiveDescendant();

			this.$("blind").css("display","none");
		}
	};

	/**
	 * Handles the WAI ARIA property aria-activedescendant.
	 *
	 * @private
	 */
	TileContainer.prototype._handleAriaActiveDescendant = function () {
		var oActiveElement = jQuery(document.activeElement).control(0);
		if (oActiveElement instanceof sap.m.Tile && oActiveElement.getParent() === this) {
			this.getDomRef().setAttribute("aria-activedescendant", oActiveElement.getId());
		}
	};

	TileContainer.prototype.onThemeChanged = function() {
		if (this.getDomRef()) {
			this.invalidate();
		}
	};

	/**
	 * Calculates a common Tile dimension (width and height) applied for all the Tiles.
	 * Function {@link getLastCalculatedDimension} does not do the calculation.
	 * The caller must explicitly call the {@link calc} function before it, or when he/she wants up-to-date dimension.
	 * @private
	 */
	var TileDimensionCalculator = function(oTileContainer) {
		this._oDimension = null;
		this._oTileContainer = oTileContainer;
	};
	/**
	 * Calculates the dimension (width and height) of a Tile.
	 * @returns {object} Width and height of a tile
	 * @protected
	 */
	TileDimensionCalculator.prototype.calc = function() {
		var oTile;

		if (!this._oTileContainer.getDomRef()) {
			return;
		}

		if (this._oTileContainer.getTiles().length) {
			//All tiles have fixed with, defined in the corresponding tile css/less file. So use the first.
			oTile = this._oTileContainer.getTiles()[0];
			this._oDimension = {
				width  : Math.round(oTile.$().outerWidth(true)),
				height : Math.round(oTile.$().outerHeight(true))
			};
		}
		return this._oDimension;
	};
	/**
	 * Returns the current dimension (width and height) of a Tile.
	 *
	 * @returns {object} Width and height of a Tile.
	 * @protected
	 */
	TileDimensionCalculator.prototype.getLastCalculatedDimension = function() {
		return this._oDimension;
	};

	/**
	 * Handles the WAI ARIA property aria-setsize after a change in the TileContainer.
	 *
	 * @private
	 */
	function handleAriaSize () {
		var iTilesCount = this.getTiles().length,
			oDomRef = null;
		this.getTiles().forEach(function(oTile) {
			oDomRef = oTile.getDomRef();
			if (oDomRef) {
				oDomRef.setAttribute("aria-setsize", iTilesCount);
			}
		});
	}
	/**
	 * Handles the WAI ARIA property aria-posinset after a change in the TileContainer.
	 * @param {int} iStartIndex The index of the Tile to start with
	 * @param {int} iEndIndex The index of the Tile to complete with
	 * @private
	 */
	function handleAriaPositionInSet(iStartIndex, iEndIndex) {
		var aTiles = this.getTiles(),
			i, oTile = null;
		for (var i = iStartIndex; i < iEndIndex; i++) {
			oTile = aTiles[i];
			if (oTile) {
				oTile._updateAriaPosition();
			}
		}
	}

	return TileContainer;

}, /* bExport= */ true);
