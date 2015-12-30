/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Carousel.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/ResizeHandler', 'sap/ui/core/delegate/ItemNavigation'],
	function(jQuery, library, Control, ResizeHandler, ItemNavigation) {
	"use strict";



	/**
	 * Constructor for a new Carousel.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {Object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Carousel holds multiple controls and displays them vertically or horizontally next to each other. You can define how many content items should be displayed at once or let the Carousel determine that for you. Navigation is done through buttons or keys.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.8.0
	 * @alias sap.ui.commons.Carousel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Carousel = Control.extend("sap.ui.commons.Carousel", /** @lends sap.ui.commons.Carousel.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Determines the orientation of the Carousel. Can be either "horizontal" or "vertical"
			 */
			orientation : {type : "sap.ui.commons.enums.Orientation", group : "Misc", defaultValue : sap.ui.commons.enums.Orientation.horizontal},

			/**
			 * Determines the width of the Carousel
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

			/**
			 * Determines the height of the Carousel
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

			/**
			 * Default height of the item in a carousel if no height can be determined
			 */
			defaultItemHeight : {type : "int", group : "Misc", defaultValue : 150},

			/**
			 * Default width of the item in a carousel if no height can be determined
			 */
			defaultItemWidth : {type : "int", group : "Misc", defaultValue : 150},

			/**
			 * Duration for animation when navigating through the contents of the Carousel
			 */
			animationDuration : {type : "int", group : "Misc", defaultValue : 500},

			/**
			 * If defined, the carousel displays the number of items defined. Items will be resized to fit the area.
			 */
			visibleItems : {type : "int", group : "Misc", defaultValue : null},

			/**
			 * Determines the size of the handle in pixels. (Height for vertical carousel, width for horizontal carousel)
			 */
			handleSize : {type : "int", group : "Misc", defaultValue : 22},

			/**
			 * The index of the element in the content aggreation which is displayed first on rendering
			 * @since 1.11.0
			 */
			firstVisibleIndex : {type : "int", group : "Appearance", defaultValue : 0}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * Controls which are displayed inside the Carousel
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content", bindable : "bindable"}
		}
	}});


	/**
	 * Initialize the carousel control
	 * @private
	 */
	Carousel.prototype.init = function() {
		this._visibleItems = 0;

		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	};

	/**
	 * Clean up control when it is destroyed
	 * @private
	 */
	Carousel.prototype.exit = function() {
		// Cleanup resize event registration on exit
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
		this._destroyItemNavigation();
	};

	/**
	 * If one of the navigation buttons is clicked we trigger the navigation
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onclick = function(oEvent) {
		var sCarouselId = this.getId();

		switch (oEvent.target) {
		case jQuery.sap.byId(sCarouselId + '-prevbutton')[0]:
			this.showPrevious();
			break;
		case jQuery.sap.byId(sCarouselId + '-nextbutton')[0]:
			this.showNext();
			break;
		default:
			return;
		}
	};

	/**
	 * Used for before-rendering initialization.
	 * @private
	 */
	Carousel.prototype.onBeforeRendering = function() {
		// Cleanup resize event registration before re-rendering
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};

	/**
	 * Used for after-rendering initialization.
	 * @private
	 */
	Carousel.prototype.onAfterRendering = function() {
		// Define which attribute needs to be animated
		if (this.getOrientation() == "vertical") {
			this._sAnimationAttribute = 'margin-top';
		} else {
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				this._sAnimationAttribute = 'margin-right';
			} else {
				this._sAnimationAttribute = 'margin-left';
			}
		}

		this.showElementWithId(this._getItemIdByIndex(this.getFirstVisibleIndex()));

		this.calculateAndSetSize();
		this.oDomRef = this.getDomRef();
		this.sResizeListenerId = ResizeHandler.register(this.oDomRef, jQuery.proxy(this.onresize, this));

		this._initItemNavigation();
	};

	/**
	 * Initialize item navigation
	 * @private
	 */
	Carousel.prototype._initItemNavigation = function() {
		var $scrollList = this.$("scrolllist");

		if (!this._oItemNavigation) {
			this._oItemNavigation = new ItemNavigation();
			this._oItemNavigation.setCycling(true);
			this.addDelegate(this._oItemNavigation);
			//Setting focus on next to an invisible element changes the scollPosition and messes up correct display
			//So after setting the focus, we need to reset the left scrollpos
			this._oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, function(oEvent) {
				var $ContentArea = this.$("contentarea"),
					$ScrollList = this.$("scrolllist");

				// ItemNavigation should only handle keyboard, do not set the focus on a carousel item if clicked on control inside
				var oOrgEvent = oEvent.getParameter("event");
				if (oOrgEvent && oOrgEvent.type == "mousedown") {
					var bItem = false;
					for ( var i = 0; i < $ScrollList.children().length; i++) {
						var oItem = $ScrollList.children()[i];
						if (oOrgEvent.target.id == oItem.id) {
							bItem = true;
							break;
						}
					}
					if (!bItem) {
						// something inside carousel item clicked -> focus this one
						oOrgEvent.target.focus();
					}
				}

				if (sap.ui.getCore().getConfiguration().getRTL()) {
					$ContentArea.scrollLeft($ScrollList.width()  - $ContentArea.width());
				} else {
					$ContentArea.scrollLeft(0);
				}
			}, this);
		}

		this._oItemNavigation.setRootDomRef($scrollList[0]);
		this._oItemNavigation.setItemDomRefs($scrollList.children());
	};

	/**
	 * Destroy item navigation
	 * @private
	 */
	Carousel.prototype._destroyItemNavigation = function() {
		if (this._oItemNavigation) {
			this._oItemNavigation.destroy();
			this._oItemNavigation = undefined;
		}
	};

	/**
	 * Called after the theme has been switched. Some adjustments required.
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onThemeChanged = function (oEvent) {
		this.calculateAndSetSize();
	};

	/**
	 * Focus in handling
	 * handles the focus when you tab into the control
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onfocusin = function(oEvent) {
		var $target = jQuery(oEvent.target);
		// KEYBOARD HANDLING (_bIgnoreFocusIn is set in onsaptabXXX)
		if (!this._bIgnoreFocusIn && ($target.hasClass("sapUiCrslBefore") || $target.hasClass("sapUiCrslAfter"))) {
			// when entering the before or after helper DOM elements we put the
			// focus on the current focus element of the item navigation and we
			// leave the action mode!
			this._leaveActionMode();
			// set the focus on the last focused dom ref of the item navigation or
			// in case if not set yet (tab previous into item nav) then we set the
			// focus to the root domref
			jQuery(this._oItemNavigation.getFocusedDomRef() || this._oItemNavigation.getRootDomRef()).focus();
		}
	};

	/**
	 * If we are in action mode we only allow tabbing within the selected element
	 * else we focus on the next element in the tab chain (not in the carousel item)
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onsaptabnext = function(oEvent) {
		var $this = this.$();
		if (this._bActionMode) {
			if ($this.find(".sapUiCrslScl").lastFocusableDomRef() === oEvent.target) {
				$this.find(".sapUiCrslScl").firstFocusableDomRef().focus();
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		} else {
			if (this._oItemNavigation.getFocusedDomRef() === oEvent.target) {
				this._bIgnoreFocusIn = true;
				$this.find(".sapUiCrslAfter").focus();
				this._bIgnoreFocusIn = false;
			}
		}
	};

	/**
	 * If we are in action mode we only allow tabbing within the selected element
	 * else we focus on the previous element in the tab chain (not in the carousel item)
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onsaptabprevious = function(oEvent) {
		var $this = this.$();
		if (this._bActionMode) {
			if ($this.find(".sapUiCrslScl").firstFocusableDomRef() === oEvent.target) {
				$this.find(".sapUiCrslScl").lastFocusableDomRef().focus();
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		} else {
			if (this._oItemNavigation.getFocusedDomRef() === oEvent.target &&
					jQuery.sap.containsOrEquals($this.find(".sapUiCrslScl").get(0), oEvent.target)) {
				this._bIgnoreFocusIn = true;
				$this.find(".sapUiCrslBefore").focus();
				this._bIgnoreFocusIn = false;
			}
		}
	};

	/**
	 * Handle the ESCAPE key to leave the action mode
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onsapescape = function(oEvent) {
		this._leaveActionMode(oEvent);
	};

	/**
	 * Trigger the navigation to the next item and stop current animations (if available)
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onsapnext = function(oEvent) {
		var $target = jQuery(oEvent.target);
		var $ScrollList = this.$("scrolllist");
		$ScrollList.stop(true, true);
		if ($target.hasClass('sapUiCrslItm') && $target.nextAll(':visible').length < 2) {
			this.showNext();
			oEvent.preventDefault();
		}
	};

	/**
	 * Trigger the navigation to the previous item and stop current animations (if available)
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onsapprevious = function(oEvent) {
		var $target = jQuery(oEvent.target);
		var $ScrollList = this.$("scrolllist");
		$ScrollList.stop(true, true);
		if ($target.hasClass('sapUiCrslItm') && $target.prevAll(':visible').length < 2) {
			this.showPrevious();
			oEvent.preventDefault();
		}
	};

	/**
	 * If in action mode and F2 or ENTER are pressed the user exits the action mode
	 * If not in action mode and F2 or ENTER are pressed action mode is entered
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onkeydown = function(oEvent) {
		var $this = this.$();
		if (!this._bActionMode &&
			oEvent.keyCode == jQuery.sap.KeyCodes.F2 ||
			oEvent.keyCode == jQuery.sap.KeyCodes.ENTER) {
			if ($this.find(".sapUiCrslScl li:focus").length > 0) {
				this._enterActionMode($this.find(".sapUiCrslScl li:focus :sapFocusable").get(0));
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		} else if (this._bActionMode &&
			oEvent.keyCode == jQuery.sap.KeyCodes.F2) {
			this._leaveActionMode(oEvent);
		}
	};

	/**
	 * Handle clicking into elements
	 * @param {jQuery.Event} oEvent The triggered event
	 * @private
	 */
	Carousel.prototype.onmouseup = function(oEvent) {
		if (this.$().find(".sapUiCrslScl li :focus").length > 0) {
			// when clicking into a focusable control we enter the action mode!
			this._enterActionMode(this.$().find(".sapUiCrslScl li :focus").get(0));
		} else {
			// when clicking anywhere else in the table we leave the action mode!
			this._leaveActionMode(oEvent);
		}
	};

	// If the application supports touch gestures the event handlers are added to cath swiping right and left
	if (sap.ui.Device.support.touch) {

		/**
		 * If the device supports touch gestures and left swipe is triggered shows the next carousel item
		 * @param {jQuery.Event} oEvent
		 * @public
		 */
		Carousel.prototype.onswipeleft = function(oEvent) {
			this.showNext();
		};

		/**
		 * If the device supports touch gestures and right swipe is triggered shows the previous carousel item
		 * @param {jQuery.Event} oEvent
		 * @public
		 */
		Carousel.prototype.onswiperight = function(oEvent) {
			this.showPrevious();
		};
	}

	/**
	 * Enters action mode
	 * @param {Object} oDomRef The HTML element to be focused
	 * @private
	 */
	Carousel.prototype._enterActionMode = function(oDomRef) {
		// only enter the action mode when not already in action mode
		if (oDomRef && !this._bActionMode) {

			// in the action mode we need no item navigation
			this._bActionMode = true;
			this.removeDelegate(this._oItemNavigation);

			// remove the tab index from the item navigation
			jQuery(this._oItemNavigation.getFocusedDomRef()).attr("tabindex", "-1");

			//set aria active descendent
			this.$("scrolllist").attr("aria-activedescendant", jQuery(this._oItemNavigation.getFocusedDomRef()).attr("id"));

			// set the focus to the active control
			jQuery(oDomRef).focus();
		}
	};

	/**
	 * Leaves action mode
	 * @param {jQuery.Event} oEvent The event that triggered leaving the action mode
	 * @private
	 */
	Carousel.prototype._leaveActionMode = function(oEvent) {
		if (this._bActionMode) {

			// in the navigation mode we use the item navigation
			this._bActionMode = false;
			this.addDelegate(this._oItemNavigation);

			// reset the tabindex of the focused domref of the item navigation
			jQuery(this._oItemNavigation.getFocusedDomRef()).attr("tabindex", "0");

			//remove aria active descendent
			this.$("scrolllist").removeAttr("aria-activedescendant");

			// when we have an event which is responsible to leave the action mode
			// we search for the closest
			if (oEvent) {
				if (jQuery(oEvent.target).closest("li[tabindex=-1]").length > 0) {
					// triggered when clicking into an item, then we focus the item
					var iIndex = jQuery(this._oItemNavigation.aItemDomRefs).index(jQuery(oEvent.target).closest("li[tabindex=-1]").get(0));
					this._oItemNavigation.focusItem(iIndex, null);
				} else {
					// somewhere else means whe check if the click happend inside
					// the container, then we focus the last focused element
					if (jQuery.sap.containsOrEquals(this.$().find(".sapUiCrslScl").get(0), oEvent.target)) {
						this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex(), null);
					}
				}
			} else {
				// when no event is given we just focus the last focused index
				this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex(), null);
			}
		}
	};

	/**
	 * Function is called when window is resized
	 * @param {jQuery.Event} oEvent The event that triggered onresize
	 * @private
	 */
	Carousel.prototype.onresize = function(oEvent) {
		if (!this.getDomRef()) {
			// carousel is not rendered, maybe deleted from DOM -> deregister resize
			// handler and do nothing
			// Cleanup resize event registration on exit
			if (this.sResizeListenerId) {
				ResizeHandler.deregister(this.sResizeListenerId);
				this.sResizeListenerId = null;
			}
			return;
		}

		this.calculateAndSetSize();
	};

	/**
	 * Shows the previous item in carousel. This can be only used after the component is rendered.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Carousel.prototype.showPrevious = function() {
		var that = this,
			mAnimationArguments = {},
			$ScrollList = this.$("scrolllist");

		var $lastItem, $firstItem;
		mAnimationArguments[this._sAnimationAttribute] = 0;

		if ($ScrollList.children('li').length < 2) {
			return;
		}

		$ScrollList.stop(true, true);
		$ScrollList.css(this._sAnimationAttribute, -this._iMaxWidth);

		$lastItem = $ScrollList.children('li:last');
		$firstItem = $ScrollList.children('li:first');

		this._showAllItems();
		$lastItem.insertBefore($firstItem);
		$ScrollList.append($lastItem.sapExtendedClone(true));

		$ScrollList.animate(mAnimationArguments, this.getAnimationDuration(), function() {
			$ScrollList.children('li:last').remove();
			that.setProperty("firstVisibleIndex", that._getContentIndex($ScrollList.children('li:first').attr('id')), true);
			that._hideInvisibleItems();
		});
	};

	/**
	 * Shows the next item in carousel. This can be only used after the component is rendered.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Carousel.prototype.showNext = function() {
		var that = this,
			mAnimationArguments = {},
			sAnimationAttribute = this._sAnimationAttribute,
			$ScrollList = this.$("scrolllist");

		var $firstItem;
		mAnimationArguments[this._sAnimationAttribute] = -this._iMaxWidth;

		if ($ScrollList.children('li').length < 2) {
			return;
		}

		$ScrollList.stop(true, true);
		this._showAllItems();

		$firstItem = $ScrollList.children('li:first');
		$firstItem.appendTo($ScrollList);
		$firstItem.sapExtendedClone(true).insertBefore($ScrollList.children('li:first'));

		$ScrollList.animate(mAnimationArguments, this.getAnimationDuration(), function() {
			$ScrollList.children('li:first').remove();
			jQuery(this).css(sAnimationAttribute, '0px');
			that.setProperty("firstVisibleIndex", that._getContentIndex($ScrollList.children('li:first').attr('id')), true);
			that._hideInvisibleItems();
		});
	};

	/**
	 * Shows the element with the specified Id. This can be only used after the component is rendered.
	 * @param {string} sElementId Id of the element to slide to.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Carousel.prototype.showElementWithId = function(sElementId) {
		this._showAllItems();

		var $ScrollList = this.$("scrolllist"),
			index;

		sElementId = this.getId() + "-item-" + sElementId;
		index = $ScrollList.children('li').index(jQuery.sap.byId(sElementId));

		$ScrollList.children('li:lt(' + index + ')').appendTo($ScrollList);
		this._hideInvisibleItems();
	};

	/**
	 * Calculates and sets the size of the carousel, its items and its buttons
	 * @public
	 */
	Carousel.prototype.calculateAndSetSize = function() {
		var sCarouselId = this.getId();
		var oDimensions = this._getDimensions();
		var maxWidth = oDimensions.maxWidth;
		var maxHeight = oDimensions.maxHeight;
		var contentBarSize;
		var visibleItems = this.getVisibleItems();
		var $Me = jQuery.sap.byId(sCarouselId);
		var $NextButton = jQuery.sap.byId(sCarouselId + '-nextbutton');
		var $PrevButton = jQuery.sap.byId(sCarouselId + '-prevbutton');
		var $ContentArea = jQuery.sap.byId(sCarouselId + '-contentarea');

		this._showAllItems();

		if (this.getContent().length <= 0) {
		    return;
		}

		if (this.getWidth() && this.getOrientation() == "vertical") {
			maxWidth = $Me.width();
		}
		if (this.getHeight() && this.getOrientation() == "horizontal") {
			maxHeight = $Me.height();
		}

		this.$().addClass('sapUiCrsl' + jQuery.sap.charToUpperCase(this.getOrientation(), 0));

		if (this.getOrientation() == "horizontal") {
			contentBarSize = $Me.width() - this.getHandleSize() * 2 - 1;
			$ContentArea.css('left', this.getHandleSize() + "px").css('right', this.getHandleSize() + "px");

			if (visibleItems == 0) {
				visibleItems = Math.floor(contentBarSize / maxWidth);
			}

			maxWidth = contentBarSize / visibleItems;
			this._iMaxWidth = maxWidth;

			var cLineHeight = maxHeight + "px";
			$ContentArea.find('.sapUiCrslItm').css("width", maxWidth + "px").css("height", maxHeight + "px").css("display", "inline-block");
			$PrevButton.css("height", maxHeight).css("line-height", cLineHeight);
			$NextButton.css("height", maxHeight).css("line-height", cLineHeight);
			$ContentArea.height(maxHeight);
			$Me.height(maxHeight);

			var iVisibleItemsCount = this.getContent().length < visibleItems ? this.getContent().length : visibleItems;
			//If the width is set explicitly by the developer the carousel will be set to this value.
			//Othervise it will be the visible items plus the handles
			if (this.getWidth()) {
				$Me.width(this.getWidth());
			} else {
				$Me.width(maxWidth * iVisibleItemsCount + (this.getHandleSize() * 2 - 1));
			}
		} else {
			contentBarSize = $Me.height() - this.getHandleSize() * 2 - 1;
			$ContentArea.css('top', this.getHandleSize() + "px").css('bottom', this.getHandleSize() + "px");

			if (visibleItems == 0) {
				visibleItems = Math.floor(contentBarSize / maxHeight);
			}

			maxHeight = contentBarSize / visibleItems;
			this._iMaxWidth = maxHeight;

			$ContentArea.find('.sapUiCrslItm').css("width", maxWidth + "px").css("height", maxHeight + "px").css("display", "block");
			$PrevButton.width(maxWidth).after($ContentArea);
			$NextButton.width(maxWidth);
			$ContentArea.width(maxWidth);
			$Me.width(maxWidth);
		}

		this._visibleItems = visibleItems;
		this._hideInvisibleItems();
	};

	/**
	 * Calculates the max vlues for a carousel item which would be used in calculating the size of the Carousel itself
	 * @returns {{maxWidth: number, maxHeight: number}}
	 * @private
	 */
	Carousel.prototype._getDimensions = function() {
		var aContent = this.getContent();

		var maxWidth = 0;
		var maxHeight = 0;

		for ( var i = 0; i < aContent.length; i++) {
			var childWidth, childHeight;
			try {
				childWidth = aContent[i].getWidth();
				if (childWidth.substr( -1) == "%") {
					childWidth = this.getDefaultItemWidth();
				}
			} catch (e) {
				childWidth = this.getDefaultItemWidth();
			}
			try {
				childHeight = aContent[i].getHeight();
				if (childHeight.substr( -1) == "%") {
					childHeight = this.getDefaultItemHeight();
				}
			} catch (e) {
				childHeight = this.getDefaultItemHeight();
			}
			maxWidth = Math.max(maxWidth, parseInt(childWidth, 10));
			maxHeight = Math.max(maxHeight, parseInt(childHeight, 10));
		}

		if (maxWidth == 0 || isNaN(maxWidth)) {
			maxWidth = this.getDefaultItemWidth();
		}
		if (maxHeight == 0 || isNaN(maxHeight)) {
			maxHeight = this.getDefaultItemHeight();
		}

		return {
			maxWidth: maxWidth,
			maxHeight: maxHeight
		};
	};

	/**
	 * Returns the focused DOM element
	 * @returns {jQuery} The focused DOM element
	 * @public
	 */
	Carousel.prototype.getFocusDomRef = function() {
		return this.$("scrolllist");
	};

	/**
	 * Makes all carousel items visible
	 * @private
	 */
	Carousel.prototype._showAllItems = function() {
		var $ContentArea = this.$("contentarea");
		$ContentArea.find('.sapUiCrslItm').show().css("display", "inline-block");
	};

	/**
	 * Hides all carousel items
	 * @private
	 */
	Carousel.prototype._hideInvisibleItems = function() {
		var $ContentArea = this.$("contentarea");
		$ContentArea.find('.sapUiCrslItm:gt(' + (this._visibleItems - 1)  + ')').hide();
	};

	/**
	 * Gets the current carousel item's index in the carousel based on its ID
	 * @param {string} sId The item's ID
	 * @returns {number|null} The item's index or null if nothing is found
	 * @private
	 */
	Carousel.prototype._getContentIndex = function(sId) {
		var aIdParts = sId.split("-item-");
		return jQuery.inArray(sap.ui.getCore().byId(aIdParts[1]), this.getContent());
	};

	Carousel.prototype._getItemIdByIndex = function(iIndex) {
		var oContent = this.getContent()[iIndex];
		if (!oContent) {
			return null;
		}
		return oContent.getId();
	};

	/**
	 * Setter for property <code>firstVisibleIndex</code>.
	 *
	 * Default value is <code>0</code>
	 *
	 * @param {int} iFirstVisibleIndex  new value for property <code>firstVisibleIndex</code>
	 * @return {sap.ui.commons.Carousel} <code>this</code> to allow method chaining
	 * @public
	 * @since 1.11.0
	 */
	Carousel.prototype.setFirstVisibleIndex = function(iFirstVisibleIndex) {
		if (iFirstVisibleIndex > this.getContent().length - 1) {
			jQuery.sap.log.warning("The index is invalid. There are less items available in the carousel.");
			return this;
		}
		this.setProperty("firstVisibleIndex", iFirstVisibleIndex, true);
		this.showElementWithId(this._getItemIdByIndex(iFirstVisibleIndex));

		if (this._oItemNavigation) {
			this._oItemNavigation.focusItem(iFirstVisibleIndex);
		}

		return this;
	};

	//Fix because jQuery clone doesn't support cloning textarea values
	//jQuery Ticket #3016 (http://bugs.jquery.com/ticket/3016)

	//Textarea and select clone() bug workaround | Spencer Tipping
	//Licensed under the terms of the MIT source code license

	//Motivation.
	//jQuery's clone() method works in most cases, but it fails to copy the value of textareas and select elements. This patch replaces jQuery's clone() method with a wrapper that fills in the
	//values after the fact.

	//An interesting error case submitted by Piotr Przybył: If two <select> options had the same value, the clone() method would select the wrong one in the cloned box. The fix, suggested by Piotr
	//and implemented here, is to use the selectedIndex property on the <select> box itself rather than relying on jQuery's value-based val().

	(function (original) {
		jQuery.fn.sapExtendedClone = function () {
			var result           = original.apply(this, arguments);
			var my_textareas     = this.find('textarea').add(this.filter('textarea'));
			var result_textareas = result.find('textarea').add(result.filter('textarea'));
			var my_selects       = this.find('select').add(this.filter('select'));
			var result_selects   = result.find('select').add(result.filter('select'));

			for (var i = 0, l = my_textareas.length; i < l; ++i) {
				jQuery(result_textareas[i]).val(jQuery(my_textareas[i]).val());
			}
			for (var i = 0, l = my_selects.length;   i < l; ++i) {
				result_selects[i].selectedIndex = my_selects[i].selectedIndex;
			}

			return result;
		};
	})(jQuery.fn.clone);

	return Carousel;

}, /* bExport= */ true);
