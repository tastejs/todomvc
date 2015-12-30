/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Toolbar.
sap.ui.define(['jquery.sap.global', './BarInPageEnabler', './ToolbarLayoutData', './ToolbarSpacer', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/ResizeHandler'],
	function(jQuery, BarInPageEnabler, ToolbarLayoutData, ToolbarSpacer, library, Control, EnabledPropagator, ResizeHandler) {
	"use strict";


	var ToolbarDesign = sap.m.ToolbarDesign;

	/**
	 * Constructor for a new Toolbar.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The Toolbar control is a horizontal container that is most commonly used to display buttons, labels, selects and various other input controls.
	 *
	 * By default, Toolbar items are shrinkable if they have percent-based width (e.g. Input, Slider) or implement the {@link sap.ui.core.IShrinkable} interface (e.g. Text, Label). This behavior can be overridden by providing {@link sap.m.ToolbarLayoutData} for the Toolbar items.
	 *
	 * Note: It is recommended that you use {@link sap.m.OverflowToolbar} over Toolbar, unless you want to avoid overflow in favor of shrinking.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.Toolbar,sap.m.IBar
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16
	 * @alias sap.m.Toolbar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Toolbar = Control.extend("sap.m.Toolbar", /** @lends sap.m.Toolbar.prototype */ { metadata : {

		interfaces : [
			"sap.ui.core.Toolbar",
			"sap.m.IBar"
		],
		library : "sap.m",
		properties : {

			/**
			 * Defines the width of the control.
			 * By default, Toolbar is a block element. If the the width is not explicitly set, the control will assume its natural size.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : null},

			/**
			 * Indicates that the whole toolbar is clickable. The Press event is fired only if Active is set to true.
			 * Note: This property should be used when there are no interactive controls inside the toolbar and the toolbar itself is meant to be interactive.
			 */
			active : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Sets the enabled property of all controls defined in the content aggregation.
			 * Note: This property does not apply to the toolbar itself, but rather to its items.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Defines the height of the control.
			 * Note: By default, the Height property depends on the used theme and the Design property.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : ''},

			/**
			 * Defines the toolbar design.
			 * Note: Design settings are theme-dependent. They also determine the default height of the toolbar.
			 * @since 1.16.8
			 */
			design : {type : "sap.m.ToolbarDesign", group : "Appearance", defaultValue : ToolbarDesign.Auto}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * The content of the toolbar.
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
		},
		events : {

			/**
			 * Fired when the user clicks on the toolbar, if the Active property is set to "true".
			 */
			press : {
				parameters : {

					/**
					 * The toolbar item that was pressed
					 */
					srcControl : {type : "sap.ui.core.Control"}
				}
			}
		}
	}});

	EnabledPropagator.call(Toolbar.prototype);

	// shrinkable class name
	Toolbar.shrinkClass = "sapMTBShrinkItem";

	/*
	 * Checks whether the given width is relative or not
	 *
	 * @static
	 * @protected
	 * @param {String} sWidth
	 * @return {boolean}
	 */
	Toolbar.isRelativeWidth = function(sWidth) {
		return /^([-+]?\d+%|auto|inherit|)$/i.test(sWidth);
	};

	/*
	 * This sets inner controls to the initial width and
	 * checks the given element overflows horizontally
	 *
	 * @static
	 * @protected
	 * @param {jQuery} $Element jQuery Object
	 * @return {boolean} whether overflow or not
	 */
	Toolbar.checkOverflow = function($Element) {
		if (!$Element || !$Element.length) {
			return false;
		}

		$Element.children().each(function() {
			this.style.width = Toolbar.getOrigWidth(this.id);
		});

		return $Element[0].scrollWidth > $Element[0].clientWidth;

	};

	/*
	 * Returns the original width(currently only control's width) via Control ID
	 * TODO: This function is not smart enough to detect DOM width changes
	 * But tracking width changes is also expensive
	 * (last and original width values must be keep in DOM and need update)
	 * For now we only support calling setWidth from the control
	 * And controls return correct width values even default value applied with CSS
	 *
	 * @static
	 * @protected
	 * @param {String} sId Control ID
	 * @return {String} width
	 */
	Toolbar.getOrigWidth = function(sId) {
		var oControl = sap.ui.getCore().byId(sId);
		if (!oControl || !oControl.getWidth) {
			return "";
		}

		return oControl.getWidth();
	};

	/*
	 * Checks if the given control is shrinkable or not and marks according to second param
	 * Percent widths and text nodes(without fixed width) are shrinkable
	 * Controls that implement IShrinkable interface should shrink
	 * ToolbarSpacer is already shrinkable if it does not have fixed width
	 *
	 * @static
	 * @protected
	 * @param {sap.ui.core.Control} oControl UI5 Control
	 * @param {String} [sShrinkClass] Shrink item class name
	 * @returns {true|false|undefined|Object}
	 */
	Toolbar.checkShrinkable = function(oControl, sShrinkClass) {
		if (oControl instanceof ToolbarSpacer) {
			return this.isRelativeWidth(oControl.getWidth());
		}

		// remove old class
		sShrinkClass = sShrinkClass || this.shrinkClass;
		oControl.removeStyleClass(sShrinkClass);

		// ignore the controls has fixed width
		var sWidth = this.getOrigWidth(oControl.getId());
		if (!this.isRelativeWidth(sWidth)) {
			return;
		}

		// check shrinkable via layout data
		var oLayout = oControl.getLayoutData();
		if (oLayout instanceof ToolbarLayoutData) {
			return oLayout.getShrinkable() && oControl.addStyleClass(sShrinkClass);
		}

		// is percent item?
		// does implement shrinkable interface?
		if (sWidth.indexOf("%") > 0 ||
			oControl.getMetadata().isInstanceOf("sap.ui.core.IShrinkable")) {
			return oControl.addStyleClass(sShrinkClass);
		}

		// is text element?
		var oDomRef = oControl.getDomRef();
		if (oDomRef && (oDomRef.firstChild || {}).nodeType == 3) {
			return oControl.addStyleClass(sShrinkClass);
		}
	};

	/*
	 * Grow-Shrink flexbox polyfill for Toolbar
	 *
	 * @static
	 * @protected
	 * @param {jQuery} $Element The container of flex items
	 * @param {String} [sFlexClass] Flexible item class
	 * @param {String} [sShrinkClass] Shrinkable item class
	 */
	Toolbar.flexie = function($Element, sFlexClass, sShrinkClass) {

		// check element exists and has width to calculate
		if (!$Element || !$Element.length || !$Element.width()) {
			return;
		}

		// set default values
		sShrinkClass = sShrinkClass || this.shrinkClass;
		sFlexClass = sFlexClass || ToolbarSpacer.flexClass;

		// initial values
		var iTotalPercent = 0,
			aFlexibleItems = [],
			aShrinkableItems = [],
			iTotalUnShrinkableWidth = 0,
			iInnerWidth = $Element.width(),
			$Children = $Element.children(),
			bOverflow = this.checkOverflow($Element),
			isAutoWidth = function(sWidth) {
				return !sWidth || sWidth == "auto" || sWidth == "inherit";
			},
			calcUnShrinkableItem = function($Item) {
				// add to unshrinkable width calculation with margins
				iTotalUnShrinkableWidth += $Item.outerWidth(true);
			},
			pushShrinkableItem = function($Item) {
				// if calculated width and the min-width is same then item cannot shrink
				var fBoxWidth = parseFloat($Item.css("width")) || 0;
				var fMinWidth = parseFloat($Item.css("min-width")) || 0;
				if (fBoxWidth == fMinWidth) {
					calcUnShrinkableItem($Item);
					return;
				}

				// calculate related percentage according to inner width
				var iBoxSizing = 0;
				var fWidth = $Item.width();
				var fPercent = (fWidth * 100) / iInnerWidth;
				iTotalPercent += fPercent;

				// margins + paddings + borders are not shrinkable
				iTotalUnShrinkableWidth += $Item.outerWidth(true) - fWidth;
				if ($Item.css("box-sizing") == "border-box") {
					iBoxSizing = $Item.outerWidth() - fWidth;
				}

				// should also take account of max width
				// browsers does not respect computed max width when it has %
				// https://code.google.com/p/chromium/issues/detail?id=228938
				var sMaxWidth = $Item.css("max-width");
				var fMaxWidth = parseFloat(sMaxWidth);
				if (sMaxWidth.indexOf("%") > 0) {
					fMaxWidth = Math.ceil((fMaxWidth * $Element.outerWidth()) / 100);
				}

				// push item
				aShrinkableItems.push({
					boxSizing : iBoxSizing,
					maxWidth : fMaxWidth,
					minWidth : fMinWidth,
					percent : fPercent,
					el : $Item[0]
				});
			},
			setWidths = function(iTotalWidth) {
				var iSumOfWidth = 0;

				// check for max and min width and remove items if they cannot not shrink or grow anymore
				aShrinkableItems.forEach(function(oItem, iIndex) {
					var fRelativePercent = Math.min(100, (oItem.percent * 100) / iTotalPercent);
					var iContentWidth = Math.floor((iTotalWidth * fRelativePercent) / 100);
					var iCalcWidth = oItem.boxSizing + iContentWidth;

					// if we cannot set calculated shrink width because of the minimum width restriction
					// then we should shrink the other items because current item cannot shrink more
					if (iCalcWidth < oItem.minWidth) {
						oItem.el.style.width = oItem.minWidth + "px";
						iTotalWidth -= (oItem.minWidth - oItem.boxSizing);

						// ignore this element cannot shrink more
						iTotalPercent -= oItem.percent;
						delete aShrinkableItems[iIndex];
					}

					// if there is a max width restriction and calculated grow width is more than max width
					// then we should share this extra grow gap for the other items
					if (oItem.maxWidth && oItem.maxWidth > oItem.minWidth && iCalcWidth > oItem.maxWidth) {
						oItem.el.style.width = oItem.maxWidth + "px";
						iTotalWidth += (iCalcWidth - oItem.maxWidth);

						// ignore this element cannot grow more
						iTotalPercent -= oItem.percent;
						delete aShrinkableItems[iIndex];
					}
				});

				// share the width to the items (can grow or shrink)
				aShrinkableItems.forEach(function(oItem) {
					var fRelativePercent = Math.min(100, (oItem.percent * 100) / iTotalPercent);
					var fContentWidth = (iTotalWidth * fRelativePercent) / 100;
					var fCalcWidth = oItem.boxSizing + fContentWidth;
					oItem.el.style.width = fCalcWidth + "px";
					iSumOfWidth += fCalcWidth;
				});

				// calculate remain width
				iTotalWidth -= iSumOfWidth;
				if (iTotalWidth > 1) {
					// share the remaining width to the spacers
					aFlexibleItems.forEach(function(oFlexibleItem) {
						var fWidth = iTotalWidth / aFlexibleItems.length;
						oFlexibleItem.style.width = fWidth + "px";
					});
				}
			};

		// start calculation
		// here items are in their initial width
		$Children.each(function() {
			var $Child = jQuery(this);
			var bAutoWidth = isAutoWidth(this.style.width);
			if (bAutoWidth && $Child.hasClass(sFlexClass)) {
				// flexible item
				aFlexibleItems.push(this);
				this.style.width = "0px";
			} else if ($Child.is(":hidden")) {
				// invisible item
				return;
			} else if (bOverflow && $Child.hasClass(sShrinkClass)) {
				// shrinkable marked item when toolbar overflows
				pushShrinkableItem($Child);
			} else {
				// unshrinkable item
				calcUnShrinkableItem($Child);
			}
		});

		// check if there is still place for flex or do the shrink
		var iRemainWidth = iInnerWidth - iTotalUnShrinkableWidth;
		setWidths(Math.max(iRemainWidth, 0));
	};

	// determines whether toolbar has flexbox support or not
	Toolbar.hasFlexBoxSupport = jQuery.support.hasFlexBoxSupport;

	// determines whether toolbar has new flexbox (shrink) support
	Toolbar.hasNewFlexBoxSupport = (function() {
		var oStyle = document.documentElement.style;
		return (oStyle.flex !== undefined ||
				oStyle.msFlex !== undefined ||
				oStyle.webkitFlexShrink !== undefined);
	}());

	Toolbar.prototype.init = function() {
		// define group for F6 handling
		this.data("sap-ui-fastnavgroup", "true", true);

		// content delegate reference
		this._oContentDelegate = {
			onAfterRendering: this._onAfterContentRendering
		};
	};

	Toolbar.prototype.onBeforeRendering = function() {
		this._cleanup();
	};

	Toolbar.prototype.onAfterRendering = function() {
		// if there is no shrinkable item, layout is not needed
		if (!this._checkContents()) {
			return;
		}

		// layout the toolbar
		this._doLayout();
	};

	Toolbar.prototype.exit = function() {
		this._cleanup();
	};

	Toolbar.prototype.onLayoutDataChange = function() {
		this.rerender();
	};

	Toolbar.prototype.addContent = function(oControl) {
		this.addAggregation("content", oControl);
		this._onContentInserted(oControl);
		return this;
	};

	Toolbar.prototype.insertContent = function(oControl, iIndex) {
		this.insertAggregation("content", oControl, iIndex);
		this._onContentInserted(oControl);
		return this;
	};

	Toolbar.prototype.removeContent = function(vContent) {
		vContent = this.removeAggregation("content", vContent);
		this._onContentRemoved(vContent);
		return vContent;
	};

	Toolbar.prototype.removeAllContent = function() {
		var aContents = this.removeAllAggregation("content") || [];
		aContents.forEach(this._onContentRemoved, this);
		return aContents;
	};

	// handle tap for active toolbar, do nothing if already handled
	Toolbar.prototype.ontap = function(oEvent) {
		if (this.getActive() && !oEvent.isMarked()) {
			oEvent.setMarked();
			this.firePress({
				srcControl : oEvent.srcControl
			});
		}
	};

	// fire press event when enter is hit on the active toolbar
	Toolbar.prototype.onsapenter = function(oEvent) {
		if (this.getActive() && oEvent.srcControl === this && !oEvent.isMarked()) {
			oEvent.setMarked();
			this.firePress({
				srcControl : this
			});
		}
	};

	// keyboard space handling mimic the enter event
	Toolbar.prototype.onsapspace = Toolbar.prototype.onsapenter;

	// mark to inform active handling is done by toolbar
	Toolbar.prototype.ontouchstart = function(oEvent) {
		this.getActive() && oEvent.setMarked();
	};

	// mark shrinkable contents and render layout data
	// returns shrinkable and flexible content count
	Toolbar.prototype._checkContents = function() {
		var iShrinkableItemCount = 0;
		this.getContent().forEach(function(oControl) {
			if (Toolbar.checkShrinkable(oControl)) {
				iShrinkableItemCount++;
			}
		});

		return iShrinkableItemCount;
	};

	// apply the layout calculation according to flexbox support
	Toolbar.prototype._doLayout = function() {
		// let the flexbox do its job
		if (Toolbar.hasNewFlexBoxSupport) {
			return;
		}

		// apply layout according to flex support
		if (Toolbar.hasFlexBoxSupport) {
			this._resetOverflow();
		} else {
			this._reflexie();
		}
	};

	// reset overflow and mark with classname if overflows
	Toolbar.prototype._resetOverflow = function() {
		this._deregisterResize();
		var $This = this.$();
		var oDomRef = $This[0] || {};
		$This.removeClass("sapMTBOverflow");
		var bOverflow = oDomRef.scrollWidth > oDomRef.clientWidth;
		bOverflow && $This.addClass("sapMTBOverflow");
		this._iEndPoint = this._getEndPoint();
		this._registerResize();
	};

	// recalculate flexbox layout
	Toolbar.prototype._reflexie = function() {
		this._deregisterResize();
		Toolbar.flexie(this.$());
		this._iEndPoint = this._getEndPoint();
		this._registerResize();
	};

	// gets called when new control is inserted into content aggregation
	Toolbar.prototype._onContentInserted = function(oControl) {
		if (oControl) {
			oControl.attachEvent("_change", this._onContentPropertyChanged, this);
			oControl.addEventDelegate(this._oContentDelegate, oControl);
		}
	};

	// gets called when a control is removed from content aggregation
	Toolbar.prototype._onContentRemoved = function(oControl) {
		if (oControl) {
			oControl.detachEvent("_change", this._onContentPropertyChanged, this);
			oControl.removeEventDelegate(this._oContentDelegate, oControl);
		}
	};

	// gets called after content is (re)rendered
	// here "this" points to the control not to the toolbar
	Toolbar.prototype._onAfterContentRendering = function() {
		var oLayout = this.getLayoutData();
		if (oLayout instanceof ToolbarLayoutData) {
			oLayout.applyProperties();
		}
	};

	// gets called when any content property is changed
	Toolbar.prototype._onContentPropertyChanged = function(oEvent) {
		if (oEvent.getParameter("name") != "width") {
			return;
		}

		// check and mark percent widths
		var oControl = oEvent.getSource();
		var bPercent = oControl.getWidth().indexOf("%") > 0;
		oControl.toggleStyleClass(Toolbar.shrinkClass, bPercent);
	};

	// register interval timer to detect inner content size is changed
	Toolbar.prototype._registerContentResize = function() {
		sap.ui.getCore().attachIntervalTimer(this._handleContentResize, this);
	};

	// deregister interval timer for inner content
	Toolbar.prototype._deregisterContentResize = function() {
		sap.ui.getCore().detachIntervalTimer(this._handleContentResize, this);
	};

	// register toolbar resize handler
	Toolbar.prototype._registerToolbarResize = function() {
		// register resize handler only if toolbar has relative width
		if (Toolbar.isRelativeWidth(this.getWidth())) {
			var fnResizeProxy = jQuery.proxy(this._handleToolbarResize, this);
			this._sResizeListenerId = ResizeHandler.register(this, fnResizeProxy);
		}
	};

	// deregister toolbar resize handlers
	Toolbar.prototype._deregisterToolbarResize = function() {
		sap.ui.getCore().detachIntervalTimer(this._handleContentResize, this);
		if (this._sResizeListenerId) {
			ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = "";
		}
	};

	// register resize handlers
	Toolbar.prototype._registerResize = function() {
		this._registerToolbarResize();
		this._registerContentResize();
	};

	// deregister resize handlers
	Toolbar.prototype._deregisterResize = function() {
		this._deregisterToolbarResize();
		this._deregisterContentResize();
	};

	// cleanup resize handlers
	Toolbar.prototype._cleanup = function() {
		this._deregisterResize();
	};

	// get the end position of last content
	Toolbar.prototype._getEndPoint = function() {
		var oLastChild = (this.getDomRef() || {}).lastElementChild;
		if (oLastChild) {
			var iEndPoint = oLastChild.offsetLeft;
			if (!sap.ui.getCore().getConfiguration().getRTL()) {
				iEndPoint += oLastChild.offsetWidth;
			}
		}

		return iEndPoint || 0;
	};

	// handle toolbar resize
	Toolbar.prototype._handleToolbarResize = function() {
		this._handleResize(false);
	};

	// handle inner content resize
	Toolbar.prototype._handleContentResize = function() {
		this._handleResize(true);
	};

	// generic resize handler
	Toolbar.prototype._handleResize = function(bCheckEndPoint) {
		// check whether end point is changed or not
		if (bCheckEndPoint && this._iEndPoint == this._getEndPoint()) {
			return;
		}

		// re-layout the toolbar
		this._doLayout();
	};

	/*
	 * Augment design property setter.
	 * 2nd parameter can be used to define auto design context.
	 * Note: When the second parameter is used, Toolbar does not rerender. This should be done by the setter.
	 *
	 * @param {sap.m.ToolbarDesign} sDesign The design for the Toolbar.
	 * @param {boolean} [bSetAutoDesign] Determines auto design context
	 * @returns {sap.m.Toolbar}
	 */
	Toolbar.prototype.setDesign = function(sDesign, bSetAutoDesign) {
		if (!bSetAutoDesign) {
			return this.setProperty("design", sDesign);
		}

		this._sAutoDesign = this.validateProperty("design", sDesign);
		return this;
	};

	/**
	 * Returns the currently applied design property of the Toolbar.
	 *
	 * @returns {sap.m.ToolbarDesign}
	 * @protected
	 */
	Toolbar.prototype.getActiveDesign = function() {
		var sDesign = this.getDesign();
		if (sDesign != ToolbarDesign.Auto) {
			return sDesign;
		}

		return this._sAutoDesign || sDesign;
	};

	/**
	 * Returns the first sap.m.Title control id inside the toolbar for the accessibility
	 *
	 * @returns {String}
	 * @since 1.28
	 * @protected
	 */
	Toolbar.prototype.getTitleId = function() {
		if (!sap.m.Title) {
			return "";
		}

		var aContent = this.getContent();
		for (var i = 0; i < aContent.length; i++) {
			var oContent = aContent[i];
			if (oContent instanceof sap.m.Title) {
				return oContent.getId();
			}
		}

		return "";
	};

	///////////////////////////
	// Bar in page delegation
	///////////////////////////
	/**
	 * Returns if the bar is sensitive to the container context. Implementation of the IBar interface
	 * @returns {bool} isContextSensitive
	 * @protected
	 */
	Toolbar.prototype.isContextSensitive = BarInPageEnabler.prototype.isContextSensitive;

	/**
	 * Sets the HTML tag of the root domref
	 * @param {string} sTag
	 * @returns {IBar} this for chaining
	 * @protected
	 */
	Toolbar.prototype.setHTMLTag = BarInPageEnabler.prototype.setHTMLTag;

	/**
	 * Gets the HTML tag of the root domref
	 * @returns {IBarHTMLTag} the HTML-tag
	 * @protected
	 */
	Toolbar.prototype.getHTMLTag = BarInPageEnabler.prototype.getHTMLTag;

	/**
	 * Sets classes and tag according to the context in the page. Possible contexts are header, footer, subheader
	 * @returns {IBar} this for chaining
	 * @protected
	 */
	Toolbar.prototype.applyTagAndContextClassFor = BarInPageEnabler.prototype.applyTagAndContextClassFor;


	return Toolbar;

}, /* bExport= */ true);
