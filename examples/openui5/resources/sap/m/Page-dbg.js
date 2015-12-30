/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Page.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";



	/**
	 * Constructor for a new Page.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A page is a basic container for a mobile application screen. Usually one page is displayed at a time (in landscape mode or on tablets depending on the layout two pages might be displayed side-by-side).
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.Page
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Page = Control.extend("sap.m.Page", /** @lends sap.m.Page.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * The title text appearing in the page header bar.
			 */
			title : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Defines the semantic level of the title. Using 'Auto' no explicit level information is written.
			 * Used for accessibility purposes only.
			 */
			titleLevel : {type : "sap.ui.core.TitleLevel", group : "Appearance", defaultValue : sap.ui.core.TitleLevel.Auto},

			/**
			 * A nav button will be rendered on the left area of header bar if this property is set to true.
			 */
			showNavButton : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Whether this page shall have a header.
			 * If set to true, either the control under the "customHeader" aggregation is used, or if there is no such control, a Header control is constructed from the properties "title", "showNavButton", "navButtonText" and "icon" depending on the platform.
			 */
			showHeader : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Whether this page shall show the subheader.
			 * @since 1.28
			 */
			showSubHeader : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * The text of the nav button when running in iOS (if shown) in case it deviates from the default, which is "Back". This property is mvi-theme-dependent and will not have any effect in other themes.
			 * @deprecated Since version 1.20.
			 * Deprecated since the MVI theme is removed now. This property only affected the NavButton in that theme.
			 */
			navButtonText : {type : "string", group : "Misc", defaultValue : null, deprecated: true},

			/**
			 * Enable vertical scrolling of page contents. Page headers and footers are fixed and do not scroll.
			 * If set to false, there will be no scrolling at all.
			 *
			 * The Page only allows vertical scrolling because horizontal scrolling is discouraged in general for full-page content. If it still needs to be achieved, disable the Page scrolling and use a ScrollContainer as full-page content of the Page. This allows you to freely configure scrolling. It can also be used to create horizontally-scrolling sub-areas of (vertically-scrolling) Pages.
			 */
			enableScrolling : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * the icon that is rendered in the page header bar in non-iOS phone/tablet platforms. This property is theme-dependent and only has an effect in the MVI theme.
			 * @deprecated Since version 1.20.
			 * Deprecated since the MVI theme is removed now. This property only affected the NavButton in that theme.
			 */
			icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null, deprecated: true},

			/**
			 * This property is used to set the background color of a page. When a list is placed inside a page, the value "List" should be used to display a gray background. "Standard", with the value white, is used as default if not specified.
			 */
			backgroundDesign : {type : "sap.m.PageBackgroundDesign", group : "Appearance", defaultValue : sap.m.PageBackgroundDesign.Standard},

			/**
			 * This property is used to set the appearance of the NavButton. By default when showNavButton is set to true, a back button will be shown in iOS and an up button in other platforms. In case you want to show a normal button in the left header area, you can set the value to "Default".
			 * @since 1.12
			 * @deprecated Since version 1.20.
			 * Deprecated since the MVI theme is removed now. This property is only usable with a Button text in that theme.
			 */
			navButtonType : {type : "sap.m.ButtonType", group : "Appearance", defaultValue : sap.m.ButtonType.Back, deprecated: true},

			/**
			 * Whether this page shall have a footer
			 * @since 1.13.1
			 */
			showFooter : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Decides which area is covered by the local BusyIndicator when <code>page.setBusy()</code> is called. By default the entire page is covered, including headers and footer. When this property is set to "true", only the content area is covered (not header/sub header and footer), which is useful e.g. when there is a SearchField in the sub header and live search continuously updates the content area while the user is still able to type.
			 * @since 1.29.0
			 */
			contentOnlyBusy : {type : "boolean", group : "Appearance", defaultValue : false}
		},
		defaultAggregation : "content",
		aggregations : {
			/**
			 * The content of this page
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"},

			/**
			 * The (optional) custom header of this page.
			 * Use this aggregation only when a custom header is constructed where the default header consisting of title text + nav button is not sufficient.
			 * If this aggregation is set, the simple properties "title", "showNavButton", "NavButtonText" and "icon" are not used.
			 */
			customHeader : {type : "sap.m.IBar", multiple : false},

			/**
			 * The (optional) footer of this page. It is always located at the bottom of the page
			 */
			footer : {type : "sap.m.IBar", multiple : false},

			/**
			 * a subHeader will be rendered directly under the header
			 */
			subHeader : {type : "sap.m.IBar", multiple : false},

			/**
			 * Controls to be added to the right side of the page header. Usually an application would use Button controls and limit the number to one when the application needs to run on smartphones. There is no automatic overflow handling when the space is insufficient.
			 * When a customHeader is used, this aggregation will be ignored.
			 */
			headerContent : {type : "sap.ui.core.Control", multiple : true, singularName : "headerContent"},

			/**
			 * A header bar which is managed internally by the Page control
			 */
			_internalHeader : {type : "sap.m.IBar", multiple : false, visibility : "hidden"}
		},
		events : {

			/**
			 * this event is fired when Nav Button is tapped
			 * @deprecated Since version 1.12.2.
			 * the navButtonPress event is replacing this event
			 */
			navButtonTap : {deprecated: true},

			/**
			 * this event is fired when Nav Button is pressed
			 * @since 1.12.2
			 */
			navButtonPress : {}
		},
		designTime : true
	}});


	// Return true if scrolling is allowed
	Page.prototype._hasScrolling = function() {
		return this.getEnableScrolling();
	};

	Page.prototype.onBeforeRendering = function() {
		if (this._oScroller && !this._hasScrolling()) {
			this._oScroller.destroy();
			this._oScroller = null;
		} else if ( this._hasScrolling() && !this._oScroller) {
			jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
			this._oScroller = new sap.ui.core.delegate.ScrollEnablement(this, null, {
				scrollContainerId: this.getId() + "-cont",
				horizontal: false,
				vertical: true
			});
		}

		if (this._headerTitle) {
			this._headerTitle.setLevel(this.getTitleLevel());
		}
	};

	/**
	 * Called when the control is destroyed.
	 *
	 * @private
	 */
	Page.prototype.exit = function() {
		if (this._oScroller) {
			this._oScroller.destroy();
			this._oScroller = null;
		}
		if (this._headerTitle) {
			this._headerTitle.destroy();
			this._headerTitle = null;
		}
		if (this._navBtn) {
			this._navBtn.destroy();
			this._navBtn = null;
		}
		if (this._appIcon) {
			this._appIcon.destroy();
			this._appIcon = null;
		}
	};

	Page.prototype.setBackgroundDesign = function(sBgDesign) {
		var sBgDesignOld = this.getBackgroundDesign();

		this.setProperty("backgroundDesign", sBgDesign, true);
		this.$().removeClass("sapMPageBg" + sBgDesignOld).addClass("sapMPageBg" + this.getBackgroundDesign());
		return this;
	};

	Page.prototype.setTitle = function(sTitle) {
		var bWasNull = !this._headerTitle;

		this._headerTitle = this._headerTitle || new sap.m.Title(this.getId() + "-title", {text: sTitle, level: this.getTitleLevel()});
		this._headerTitle.setText(sTitle);

		if (bWasNull) {
			this._updateHeaderContent(this._headerTitle, 'middle', 0);
		}

		this.setProperty("title", sTitle, true);
		return this;
	};

	Page.prototype._ensureNavButton = function() {
		if (!this._navBtn) {
			var sNavButtonType = this.getNavButtonType(), 
			    sBackText = sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("PAGE_NAVBUTTON_TEXT"); // any other types than "Back" do not make sense anymore in Blue Crystal

			this._navBtn = new sap.m.Button(this.getId() + "-navButton", {tooltip: sBackText,press: jQuery.proxy(function(){this.fireNavButtonPress(); this.fireNavButtonTap();},this)});

			if (sap.ui.Device.os.android && sNavButtonType == sap.m.ButtonType.Back) {
				this._navBtn.setType(sap.m.ButtonType.Up);
			} else {
				this._navBtn.setType(sNavButtonType);
			}
		}
	};

	Page.prototype.setShowNavButton = function (bShowNavBtn) {
		var bOldValue = !!this.getShowNavButton();
		if (bShowNavBtn === bOldValue) {
			return this;
		}

		this.setProperty("showNavButton", bShowNavBtn, true);

		if (bShowNavBtn) {
			this._ensureNavButton(); // creates this._navBtn, if required
			if (this._appIcon) {
				this._updateHeaderContent(this._appIcon, 'left', -1);
			}

			this._updateHeaderContent(this._navBtn, 'left', 0);
		} else if (this._navBtn) {
			// remove back button from header bar
			this._updateHeaderContent(this._navBtn, 'left', -1);
		}
		return this;
	};

	Page.prototype.setNavButtonType = function (sNavButtonType) {
		this._ensureNavButton(); // creates this._navBtn, if required
		if (!sap.ui.Device.os.ios && sNavButtonType == sap.m.ButtonType.Back) {
			// internal conversion from Back to Up for non-iOS platform
			this._navBtn.setType(sap.m.ButtonType.Up);
		} else {
			this._navBtn.setType(sNavButtonType);
		}
		this.setProperty("navButtonType", sNavButtonType, true);
		return this;
	};

	Page.prototype.setNavButtonText = function (sText) {
		this._ensureNavButton(); // creates this._navBtn, if required
		this.setProperty("navButtonText", sText, true);
		return this;
	};

	Page.prototype.setIcon = function (sIconSrc) {
		var sOldValue = this.getIcon();
		if (sOldValue === sIconSrc) {
			return this;
		}

		this.setProperty("icon", sIconSrc, true);
		return this;
	};

	/**
	 * Update content of internal header
	 * @param oContent: control to be added
	 * @param sContentPosition: position where the control should be located, possible values left/middle/right
	 * @param iContentIndex: the order of the control to be placed. If set to -1, the control will be removed from the header
	 * @private
	 */
	Page.prototype._updateHeaderContent = function (oContent, sContentPosition, iContentIndex){
		var oInternalHeader = this._getInternalHeader();

		if (oInternalHeader) {
			switch (sContentPosition) {
			case 'left':
				if (iContentIndex == -1) {
					if (oInternalHeader.getContentLeft()) {
						oInternalHeader.removeContentLeft(oContent);
					}
				} else {
					if (oInternalHeader.indexOfContentLeft(oContent) != iContentIndex) {
						oInternalHeader.insertContentLeft(oContent, iContentIndex);
						oInternalHeader.invalidate(); // workaround for bOutput problem
					}
				}
				break;
			case 'middle':
				if (iContentIndex == -1) {
					if (oInternalHeader.getContentMiddle()) {
						oInternalHeader.removeContentMiddle(oContent);
					}
				} else {
					if (oInternalHeader.indexOfContentMiddle(oContent) != iContentIndex) {
						oInternalHeader.insertContentMiddle(oContent, iContentIndex);
						oInternalHeader.invalidate();
					}
				}
				break;
			case 'right':
				if (iContentIndex == -1) {
					if (oInternalHeader.getContentRight()) {
						oInternalHeader.removeContentRight(oContent);
					}
				} else {
					if (oInternalHeader.indexOfContentRight(oContent) != iContentIndex) {
						oInternalHeader.insertContentRight(oContent, iContentIndex);
						oInternalHeader.invalidate();
					}
				}
				break;
			default:
				break;
			}
		}
	};

	/**
	 * Create internal header
	 * @returns {sap.m.IBar}
	 * @private
	 */

	Page.prototype._getInternalHeader = function() {
		var oInternalHeader = this.getAggregation("_internalHeader");
		if (!oInternalHeader) {
			this.setAggregation('_internalHeader', new sap.m.Bar(this.getId() + "-intHeader"), true); // don't invalidate - this is only called before/during rendering, where invalidation would lead to double rendering,  or when invalidation anyway happens
			oInternalHeader = this.getAggregation("_internalHeader");
			if (sap.ui.Device.os.ios) {
				if (this.getShowNavButton() && this._navBtn) {
					this._updateHeaderContent(this._navBtn, 'left', 0);
				}
				if (this.getTitle() && this._headerTitle) {
					this._updateHeaderContent(this._headerTitle, 'middle', 0);
				}
			} else {
				if (this.getShowNavButton() && this._navBtn) {
					this._updateHeaderContent(this._navBtn, 'left', 0);
					this._titleIndex = 1;
				}
				if (this.getTitle() && this._headerTitle) {
					this._updateHeaderContent(this._headerTitle, 'middle', 0);
				}
			}
		}
		return oInternalHeader;
	};

	/**
	 * Returns the custom or internal header
	 * @private
	 * @returns {sap.m.IBar}
	 */
	Page.prototype._getAnyHeader = function() {
		var oCustomHeader = this.getCustomHeader();

		if (oCustomHeader) {
			// return aggregated header, if it exists
			return oCustomHeader.addStyleClass("sapMPageHeader");
		}

		return this._getInternalHeader().addStyleClass("sapMPageHeader");
	};

	/**
	 * Returns the sap.ui.core.ScrollEnablement delegate which is used with this control.
	 *
	 * @private
	 */
	Page.prototype.getScrollDelegate = function() {
		return this._oScroller;
	};

	//*** API Methods ***


	/**
	 * Scrolls to the given position. Only available if enableScrolling is set to "true".
	 *
	 * @param {int} iY
	 *         The vertical pixel position to scroll to. Scrolling down happens with positive values.
	 * @param {int} iTime
	 *         The duration of animated scrolling. To scroll immediately without animation, give 0 as value. 0 is also the default value, when this optional parameter is omitted.
	 * @type sap.m.Page
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Page.prototype.scrollTo = function(y, time) {
		if (this._oScroller) {
			this._oScroller.scrollTo(0, y, time);
		}
		return this;
	};

	/**
	 * Scrolls to an element(DOM or sap.ui.core.Element) within the page if the element is rendered.
	 * @param {HTMLElement | sap.ui.core.Element} oElement The element to which should be scrolled.
	 * @param {int} [iTime=0] The duration of animated scrolling. To scroll immediately without animation, give 0 as value or leave it default.
	 * @returns {sap.m.Page} <code>this</code> to facilitate method chaining.
	 * @since 1.30
	 * @public
	 */
	Page.prototype.scrollToElement = function(oElement, iTime) {
		if (oElement instanceof sap.ui.core.Element) {
			oElement = oElement.getDomRef();
		}

		if (this._oScroller) {
			this._oScroller.scrollToElement(oElement, iTime);
		}
		return this;
	};

	Page.prototype.setContentOnlyBusy = function(bContentOnly) {
		this.setProperty("contentOnlyBusy", bContentOnly, true); // no rerendering
		this.$().toggleClass("sapMPageBusyCoversAll", !bContentOnly);
		return this;
	};

	//*** Methods forwarding the "headerContent" pseudo-aggregation calls ***

	Page.prototype.getHeaderContent = function() {
		return this._getInternalHeader().getContentRight();
	};

	Page.prototype.indexOfHeaderContent = function(oControl) {
		return this._getInternalHeader().indexOfContentRight(oControl);
	};

	Page.prototype.insertHeaderContent = function(oControl, iIndex) {
		return this._getInternalHeader().insertContentRight(oControl, iIndex);
	};

	Page.prototype.addHeaderContent = function(oControl) {
		return this._getInternalHeader().addContentRight(oControl);
	};

	Page.prototype.removeHeaderContent = function(oControl) {
		return this._getInternalHeader().removeContentRight(oControl);
	};

	Page.prototype.removeAllHeaderContent = function() {
		return this._getInternalHeader().removeAllContentRight();
	};

	Page.prototype.destroyHeaderContent = function() {
		return this._getInternalHeader().destroyContentRight();
	};


	return Page;

}, /* bExport= */ true);
