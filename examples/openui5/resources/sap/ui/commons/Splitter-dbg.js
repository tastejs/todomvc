/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Splitter.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/Popup', 'sap/ui/core/ResizeHandler', 'sap/ui/core/delegate/ItemNavigation', 'jquery.sap.events', 'jquery.sap.keycodes'],
	function(jQuery, library, Control, Popup, ResizeHandler, ItemNavigation/* , jQuerySap, jQuerySap1 */) {
	"use strict";



	/**
	 * Constructor for a new Splitter.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Allows to split the screen into two areas. Make sure that the container for the splitter has an absolute height or set an absolute height for the splitter using the height property. Otherwise the height of the splitter is calculated by the height of its contents.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Splitter
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Splitter = Control.extend("sap.ui.commons.Splitter", /** @lends sap.ui.commons.Splitter.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * The splitter can have horizontal or vertical orientation.
			 */
			splitterOrientation : {type : "sap.ui.core.Orientation", group : "Behavior", defaultValue : sap.ui.core.Orientation.Vertical},

			/**
			 * Position of splitter bar in percentage.
			 * The default value means that the splitter is positioned in the middle of the area that is available for the splitter.
			 */
			splitterPosition : {type : "sap.ui.core.Percentage", group : "Behavior", defaultValue : '50%'},

			/**
			 * The minimum size (width for vertical splitter or height for horizontal splitter) of the first Pane
			 */
			minSizeFirstPane : {type : "sap.ui.core.Percentage", group : "Behavior", defaultValue : '0%'},

			/**
			 * The minimum size (width for vertical splitter or height for horizontal splitter) of the second Pane
			 */
			minSizeSecondPane : {type : "sap.ui.core.Percentage", group : "Behavior", defaultValue : '0%'},

			/**
			 * The width of the split area in px or in %
			 */
			width : {type : "sap.ui.commons.SplitterSize", group : "Behavior", defaultValue : '100%'},

			/**
			 * The height of the split area in px or in %
			 */
			height : {type : "sap.ui.commons.SplitterSize", group : "Behavior", defaultValue : '100%'},

			/**
			 * Specifies if the browser should display scroll bars or simply cut the content of a splitter pane when the content does not fit into its pane.
			 */
			showScrollBars : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * set the splitter bar to be visible or not.
			 */
			splitterBarVisible : {type : "boolean", group : "Behavior", defaultValue : true}
		},
		aggregations : {

			/**
			 * Controls inside the first pane. These are the left ones in case of defining a vertical splitter, and the top ones in case of using the horizontal splitter.
			 */
			firstPaneContent : {type : "sap.ui.core.Control", multiple : true, singularName : "firstPaneContent"},

			/**
			 * Controls inside the second pane. These are the right ones in case of defining a vertical splitter, and the bottom ones in case of using the horizontal splitter.
			 */
			secondPaneContent : {type : "sap.ui.core.Control", multiple : true, singularName : "secondPaneContent"}
		}
	}});



	Splitter.prototype.onBeforeRendering = function() {
		// cleanup resize event registration before re-rendering
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
		if (this.sSpecialResizeListenerId) {
			ResizeHandler.deregister(this.sSpecialResizeListenerId);
			this.sSpecialResizeListenerId = null;
		}
	};

	Splitter.prototype.onAfterRendering = function() {
		this._recalculateInternals();
		this.sResizeListenerId = ResizeHandler.register(this.splitterDIV, jQuery.proxy(this.onresize, this));
	};


	Splitter.prototype._recalculateInternals = function() {

		this.splitterDIV = this.getDomRef();
		this.splitterBar = jQuery.sap.domById(this.getId() + '_SB');
		this.firstPane = jQuery.sap.domById(this.getId() + '_firstPane');
		this.secondPane = jQuery.sap.domById(this.getId() + '_secondPane');

		this.minSizeFP = this.getMinSizeFirstPane();
		this.minSizeSP = this.getMinSizeSecondPane();

		this.minSizeFP = this.minSizeFP.substring(0, (this.minSizeFP).length - 1);
		this.minSizeFP = parseFloat(this.minSizeFP);

		this.minSizeSP = this.minSizeSP.substring(0, (this.minSizeSP).length - 1);
		this.minSizeSP = parseFloat(this.minSizeSP);

		this.spOrientation =  this.getSplitterOrientation();

		this.sBarPosition = this.getSplitterPosition();
		this.sBarPosition = this.sBarPosition.substring(0, this.sBarPosition.length - 1);
		this.sBarPosition = parseFloat(this.sBarPosition);

		// in hcb mode set splitter bar width to 6 px
		if (sap.ui.getCore().getConfiguration().getTheme() == "sap_hcb") {
			this.sbSize = 6;
		} else {
			this.sbSize = 4;
		}
		this.resizeSplitterElements();

		// if no splitter parent height is specified and the splitter height is specified in % the splitter won't be displayed
		// and the splitterbar height will be
		// FF: 0 in vertical and horizontal splitters
		// or in IE: >= the div height (vertical) or  != sbSize (horizontal)
		// if any above is the case we have to set its height to a fixed pixel value
		var splitterBarHeight = jQuery(this.splitterBar).height();
		if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
			if (splitterBarHeight <= 0 || splitterBarHeight > jQuery(this.splitterDIV).height()) {
				this.fixHeight();
			}
		} else {
			if (splitterBarHeight <= 0 || splitterBarHeight != this.sbSize) {
				this.fixHeight();
			}
		}

	};


	Splitter.prototype.onresize = function(oEvent) {

		this.resizeSplitterElements();

	};

	Splitter.prototype.resizeSplitterElements = function() {

		var sbW, sbH, width, height, widthSP, heightSP;

		/**
		 * Calculate the equivalent percentage of the 4px : the width/height of the splitter bar
		 */

		if (this.spOrientation == sap.ui.core.Orientation.Vertical) {

			width = jQuery(this.splitterDIV).width();
			if (width == 0) {
				width = 100; //px so it would show something at least
			}
			sbW = (this.sbSize * 100) / width;

			// check if bar is in the far right
			if (this.sBarPosition >= 100 || this.sBarPosition + sbW > 100) {
				this.sBarPosition = 100 - sbW;
				widthSP = 0;
			} else {
				widthSP = 100 - sbW - this.sBarPosition;
			}
			jQuery(this.firstPane).css("width", this.sBarPosition + "%");
			jQuery(this.splitterBar).css("width", sbW + "%");
			jQuery(this.secondPane).css("width", widthSP + "%");

		} else {

			height = jQuery(this.splitterDIV).height();
			if (height == 0 ) {
				height = 100; //px so it would show something at least
			}
			sbH = (this.sbSize * 100) / height;

			// check if bar is in the far bottom
			if (this.sBarPosition >= 100 || this.sBarPosition + sbH > 100) {
				this.sBarPosition = 100 - sbH;
				heightSP = 0;
			} else {
				heightSP = 100 - sbH - this.sBarPosition;
			}
			jQuery(this.firstPane).css("height", this.sBarPosition + "%");
			jQuery(this.splitterBar).css("height", sbH + "%");
			jQuery(this.secondPane).css("height", heightSP + "%");

		}

		// update splitterpos value...suppress rerendering
		this.setProperty("splitterPosition", this.sBarPosition + "%", true);

		// fix height if splitterdiv height is 0 we set it to 100 px to show something at least
		// further resizing should then work correctly
		if (jQuery(this.splitterDIV).height() == 0 && !this.splitterDIV.style.height) {
			jQuery(this.splitterDIV).css("height", "100px");
			jQuery(this.splitterBar).css("height", "100px");
		}

	};

	Splitter.prototype.setSplitterPosition = function(sPos){
		if (this.getDomRef()) {
			this.setProperty("splitterPosition", sPos, true);
			this._recalculateInternals();
		} else {
			this.setProperty("splitterPosition", sPos);
		}
	};

	Splitter.prototype.setSplitterBarVisible = function(bVisible){
		if (this.getDomRef()) {
			this.setProperty("splitterBarVisible", bVisible, true);
			var sClassPrefix = this.getSplitterOrientation() === sap.ui.core.Orientation.Vertical ? "sapUiVertical" : "sapUiHorizontal";
			if (bVisible) {
				jQuery.sap.byId(this.getId() + "_SB").removeClass(sClassPrefix + "SplitterBarHidden").addClass(sClassPrefix + "SplitterBar");
			} else {
				jQuery.sap.byId(this.getId() + "_SB").removeClass(sClassPrefix + "SplitterBar").addClass(sClassPrefix + "SplitterBarHidden");
			}
		} else {
			this.setProperty("splitterBarVisible", bVisible);
		}
	};


	/**
	 * set height to a fixed height if there is no absolute height specified
	 */
	Splitter.prototype.fixHeight = function() {
		// check the parentNode height
		var parentHeight = jQuery(this.splitterDIV.parentNode).height();
		var splitterHeight = jQuery(this.splitterDIV).height();
		if (parentHeight > splitterHeight) {

			splitterHeight = parentHeight;

			// check if there was a custom max height set...then we use it regardless
			// of container height but only for px values
			var customMaxHeight = this.getHeight();
			if (customMaxHeight && customMaxHeight.toLowerCase().indexOf("px") != -1) {
				splitterHeight = parseInt(customMaxHeight, 10);
			}
			// for % values we use the splitter div height if the % is < 100% else
			// we leave the size as the parent height
			if (customMaxHeight && customMaxHeight.toLowerCase().indexOf("%") != -1) {
				var percentValue = parseInt(customMaxHeight, 10);
				if (percentValue < 100) {
					splitterHeight = jQuery(this.splitterDIV).height();
				}
			}

			// if splitterheight is 0 which shouldn't be the case we set the parent height again.
			if (splitterHeight <= 0) {
				splitterHeight = parentHeight;
			}
		}

		// reset the splitter div height so that its contents fit inside...
		jQuery(this.splitterDIV).css("height", splitterHeight + "px");
		if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
			jQuery(this.splitterBar).css("height", splitterHeight + "px");
		}
		var oParent = this.splitterDIV.parentNode;
		if (oParent) {
			var fHandler = jQuery.proxy(this.onresizespecial, this);
			this.sSpecialResizeListenerId = ResizeHandler.register(oParent, fHandler);
			//fHandler({target: oParent});
		}
	};

	/**
	 *	cleanup resize event registration before re-rendering
	 */
	Splitter.prototype.exit = function() {
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
		if (this.sSpecialResizeListenerId) {
			ResizeHandler.deregister(this.sSpecialResizeListenerId);
			this.sSpecialResizeListenerId = null;
		}
	};


	/**
	 * resize event handler to handle the special case when no splitter parent height is specified and the splitter height is specified in %.
	 * Then the splitter won't be displayed. In this case when the parent gets resized, get the parents height and use it to adapt the current fixed splitter height in px
	 * so that everything stays in place.
	 */
	Splitter.prototype.onresizespecial = function(oEvent) {
		var $Splitter = jQuery(this.splitterDIV);
		var oldHeight = $Splitter.height();
		$Splitter.css("height", "0px");
		var oDom = this.getDomRef();
		if (oDom && window.getComputedStyle) {
			// force browser to apply CSS so that the height is 0 and can then be calculated from new
			window.getComputedStyle(oDom);
		}

		// perhaps this is event handler is not needed. depends on if current child elements should be resized or not
		var parentHeight = jQuery(oEvent.target).height();
		var currentHeight = $Splitter.height();
		if (currentHeight != parentHeight) {
			// set bar height to the splitterDIV height value
			$Splitter.css("height", parentHeight + "px");
			if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
				jQuery(this.splitterBar).css("height", parentHeight + "px");
			}
		}
		// if there is no parent height set the old height again. This might be the case if the parent doesn't have a height yet...
		if (parentHeight <= 0) {
			$Splitter.css("height", oldHeight + "px");
			if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
				jQuery(this.splitterBar).css("height", oldHeight + "px");
			}
		}
	};

	/**
	 * mousedown event handler: create a ghost bar for the splitter bar and starts dragging it
	 */
	Splitter.prototype.onmousedown = function(oEvent) {

		if (oEvent.target != this.splitterBar) {
			return;
		}

		var oJBody = jQuery(document.body);
			// Fix for IE text selection while dragging
		oJBody.bind("selectstart",jQuery.proxy(this.splitterSelectStart,this));

		var offset = jQuery(this.splitterBar).offset();
		var height = jQuery(this.splitterBar).height();
		var width = jQuery(this.splitterBar).width();
		var cssClass;

		if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
			cssClass = "sapUiVSBGhost";
		} else {
			cssClass = "sapUiHSBGhost";
		}

		var iZIndex = Popup.getLastZIndex() + 5;
		if (iZIndex < 20) {
			iZIndex = 20;
		}

		jQuery(document.body).append(
				"<div id=\"" + this.getId() + "_ghost\" class=\"" + cssClass + "\" style =\" height:" + height + "px; width:"
				+ width + "px; left:" + offset.left + "px; top:" + offset.top + "px;z-index:" + iZIndex + "\"></div>");

		// append overlay over splitter to enable correct functionality of moving the splitter
		jQuery(document.body).append(
				"<div id=\"" + this.getId() + "_overlay\" style =\"left: 0px;" +
						" right: 0px; bottom: 0px; top: 0px; position:fixed; z-index:" + iZIndex + "\" ></div>");

		jQuery(document).bind("mouseup", jQuery.proxy(this.onGhostMouseRelease, this));
		jQuery(document).bind("mousemove", jQuery.proxy(this.onGhostMouseMove, this));

		// focus splitter bar
		jQuery(this.splitterBar).focus();

		// cancel the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

	};

	/**
	 * The selectstart event triggered in IE to select the text.
	 * @private
	 * @param {event} oEvent The splitterselectstart event
	 * @return {boolean} false
	 */
	Splitter.prototype.splitterSelectStart = function(oEvent){
		oEvent.preventDefault();
		oEvent.stopPropagation();
		return false;
	};

	/**
	 * drops the splitter bar
	 */

	Splitter.prototype.onGhostMouseRelease = function(oEvent) {

		var newSbPosition, spHeight, spWidth;
		var splitterBarGhost = jQuery.sap.domById(this.getId() + "_ghost");
		var rtl = sap.ui.getCore().getConfiguration().getRTL();

		if ( this.spOrientation == sap.ui.core.Orientation.Vertical) {

			if (!rtl) {
				newSbPosition = oEvent.pageX - jQuery(this.firstPane).offset().left;
				spWidth = jQuery(this.splitterDIV).width();
				newSbPosition = (newSbPosition * 100) / spWidth;
			} else {
				newSbPosition = oEvent.pageX - jQuery(this.secondPane).offset().left;
				spWidth = jQuery(this.splitterDIV).width();
				newSbPosition = (( spWidth - newSbPosition ) * 100) / spWidth;
			}
		} else {
			newSbPosition = oEvent.pageY - jQuery(this.firstPane).offset().top;
			spHeight = jQuery(this.splitterDIV).height();
			newSbPosition = (newSbPosition * 100) / spHeight;
		}

		if (newSbPosition < this.minSizeFP) {
			newSbPosition = this.minSizeFP;
		} else if ((100 - newSbPosition) < this.minSizeSP) {
			newSbPosition = 100 - this.minSizeSP;
		}

		this.sBarPosition =  newSbPosition;

		this.resizeSplitterElements();

		jQuery(splitterBarGhost).remove();
		jQuery.sap.byId(this.getId() + "_overlay").remove();

		var oJBody = jQuery(document.body);
		oJBody.unbind("selectstart", this.splitterSelectStart);

		jQuery(document).unbind("mouseup", this.onGhostMouseRelease);
		jQuery(document).unbind("mousemove", this.onGhostMouseMove);

	};

	Splitter.prototype.onGhostMouseMove = function(oEvent) {

		var splitterBarGhost = jQuery.sap.domById(this.getId() + "_ghost");
		var max;
		var min;
		var rtl = sap.ui.getCore().getConfiguration().getRTL();

		var leftFirstPane = jQuery(this.firstPane).offset().left;
		var w = jQuery(this.splitterDIV).width();
		var leftSecondPane = jQuery(this.secondPane).offset().left;

		if (this.getSplitterOrientation() == sap.ui.core.Orientation.Vertical) {

			if (!rtl) {

				min = leftFirstPane + (w * this.minSizeFP) / 100;
				max = leftFirstPane + (w * (100 - this.minSizeSP)) / 100;

				if (oEvent.pageX > min && oEvent.pageX < max) {
					jQuery(splitterBarGhost).css("left", oEvent.pageX + "px");
				}
			} else {


				min = leftSecondPane + (w * this.minSizeSP) / 100;
				max = leftSecondPane + (w * (100 - this.minSizeFP)) / 100;

				if (oEvent.pageX > min && oEvent.pageX < max) {
					jQuery(splitterBarGhost).css("left", oEvent.pageX + "px");
				}


			}

		} else {

			var h = jQuery(this.splitterDIV).height();

			min = jQuery(this.firstPane).offset().top + (h * this.minSizeFP) / 100;
			max = jQuery(this.secondPane).offset().top + jQuery(this.secondPane).height() - (h * this.minSizeSP) / 100;
			if (oEvent.pageY > min && oEvent.pageY < max) {
				jQuery(splitterBarGhost).css("top", oEvent.pageY + "px");
			}
		}
	};

	/**
	 * Convenience method for handling of Ctrl key, meta key etc.
	 *
	 * @private
	 */
	Splitter.prototype.getCtrlKey = function(oEvent) {
		return !!(oEvent.ctrlKey || oEvent.metaKey); // double negation doesn't have effect on boolean but ensures null and undefined are equivalent to false.
	};

	/**
	 * Convenience method to check an event for a certain combination of modifier keys
	 *
	 * @private
	 */
	Splitter.prototype.checkModifierKey = function(oEvent, bCtrlKey, bAltKey, bShiftKey) {
		return oEvent.shiftKey == bShiftKey && oEvent.altKey == bAltKey && this.getCtrlKey(oEvent) == bCtrlKey;
	};

	/**
	 * Home key minimizes the first pane to the last possible position
	 */
	Splitter.prototype.onsaphome = function(oEvent) {
		if (oEvent.target == this.splitterBar) {
			this.sBarPosition = this.minSizeFP;
			this.resizeSplitterElements();
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * End key maximizes the first pane to the last possible position
	 */
	Splitter.prototype.onsapend = function(oEvent) {
		if (oEvent.target == this.splitterBar) {
			this.sBarPosition = 100 - this.minSizeSP;
			this.resizeSplitterElements();
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	Splitter.prototype.onArrowKeys = function(oEvent,oInc) {
		var width, height, sbSize, sbPosition, newSbPosition;

		if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
			width = jQuery(this.splitterDIV).width();
			sbPosition = jQuery(this.firstPane).width();
			sbPosition = (sbPosition * 100) / width;
			// move 10 pixels
			sbSize = (10 * 100) / width;
		} else {
			height = jQuery(this.splitterDIV).height();
			sbPosition = jQuery(this.firstPane).height();
			sbPosition = (sbPosition * 100) / height;
			// move 10 pixels
			sbSize = (10 * 100) / height;
		}

		if (oInc == "false") {
			newSbPosition = sbPosition - sbSize;
		} else if (oInc == "true") {
			newSbPosition = sbPosition + sbSize;
		}

		if (newSbPosition < this.minSizeFP)	{
			newSbPosition = this.minSizeFP;
		} else if ((100 - newSbPosition) < this.minSizeSP) {
			newSbPosition = 100 - this.minSizeSP;
		}

		this.sBarPosition = newSbPosition;
		this.resizeSplitterElements();
	};

	/**
	 * If the Shift and Up keys are pressed and if the focus is the onsplitterBar moves the horizontal sash bar up by one step
	 * and the vertical sash bar left one step
	 */
	Splitter.prototype.onsapupmodifiers = function(oEvent) {
		if (this.checkModifierKey(oEvent, false, false, true)) {
			if (oEvent.target == this.splitterBar) {

				if (this.spOrientation == sap.ui.core.Orientation.Horizontal) {
					this.onArrowKeys(oEvent,"false");
				} else {
					// move vertical splitter left
					this.onsapleftmodifiers(oEvent);
				}

			}
			// cancel the event
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};


	/**
	 * If the Shift and Up keys are pressed and if the focus is on the splitterBar moves the horizontal sash bar down by one step
	 * and the vertical sash bar right one step
	 */
	Splitter.prototype.onsapdownmodifiers = function(oEvent) {
		if (this.checkModifierKey(oEvent, false, false, true)) {
			if (oEvent.target == this.splitterBar) {
				if (this.spOrientation == sap.ui.core.Orientation.Horizontal) {
					this.onArrowKeys(oEvent,"true");
				} else {
					// move vertical splitter right
					this.onsaprightmodifiers(oEvent);
				}
			}
			// cancel the event
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * If the Shift and Left keys are pressed and if the focus is on splitterBar moves the vertical sash bar left by one step or
	 * the horizontal sash bar up one step
	 */
	Splitter.prototype.onsapleftmodifiers = function(oEvent) {
		if (this.checkModifierKey(oEvent, false, false, true)) {
			if (oEvent.target == this.splitterBar) {
				if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
					var rtl = sap.ui.getCore().getConfiguration().getRTL();
					if (rtl) {
						this.onArrowKeys(oEvent,"true");
					} else {
						this.onArrowKeys(oEvent,"false");
					}
				} else {
					// move horizontal splitter up
					this.onsapupmodifiers(oEvent);
				}
			}
			// cancel the event
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * If the Shift and Right keys are pressed and if the focus is on the splitterBar moves the vertical sash bar right by one step
	 * and the horizontal sash bar down one step
	 */
	Splitter.prototype.onsaprightmodifiers = function(oEvent) {
		if (this.checkModifierKey(oEvent, false, false, true)) {
			if (oEvent.target == this.splitterBar) {
				if (this.spOrientation == sap.ui.core.Orientation.Vertical) {
					var rtl = sap.ui.getCore().getConfiguration().getRTL();
					if (rtl) {
						this.onArrowKeys(oEvent,"false");
					} else {
						this.onArrowKeys(oEvent,"true");
					}
				} else {
					// move horizontal splitter down
					this.onsapdownmodifiers(oEvent);
				}
			}
			// cancel the event
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * only drag events are fired; mouse events such as mousemove are not fired during drag operation
	 */
	/**
	 * event dragstart fired when the user starts dragging the sash bar
	 */

	Splitter.prototype.ondragstart = function(oEvent) {

		if (oEvent.target != this.splitterBar) {
			return;
		}

		// cancel the event
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};


	Splitter.prototype.getText = function(sKey, aArgs) {
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
		if (rb) {
			return rb.getText(sKey, aArgs);
		}
		return sKey;
	};



	return Splitter;

}, /* bExport= */ true);
