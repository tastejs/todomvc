/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.FeedListItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library'],
	function(jQuery, ListItemBase, library) {
	"use strict";



	/**
	 * Constructor for a new FeedListItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The control provides a set of properties for text, sender information, time stamp.
	 * Beginning with release 1.23 the new feature expand / collapse was introduced, which uses the property maxCharacters.
	 * @extends sap.m.ListItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.12
	 * @alias sap.m.FeedListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FeedListItem = ListItemBase.extend("sap.m.FeedListItem", /** @lends sap.m.FeedListItem.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Icon to be displayed as graphical element within the FeedListItem. This can be an image or an icon from the icon font. If no icon is provided, a default person-placeholder icon is displayed.
			 * Icon is only shown if showIcon = true.
			 */
			icon : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

			/**
			 * Icon displayed when the list item is active.
			 */
			activeIcon : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

			/**
			 * Sender of the chunk
			 */
			sender : {type : "string", group : "Data", defaultValue : null},

			/**
			 * The FeedListItem text.
			 */
			text : {type : "string", group : "Data", defaultValue : null},

			/**
			 * The Info text.
			 */
			info : {type : "string", group : "Data", defaultValue : null},

			/**
			 * This chunks timestamp
			 */
			timestamp : {type : "string", group : "Data", defaultValue : null},

			/**
			 * If true, sender string is an link, which will fire 'senderPress' events. If false, sender is normal text.
			 */
			senderActive : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * If true, icon is an link, which will fire 'iconPress' events. If false, icon is normal image
			 */
			iconActive : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * By default, this is set to true but then one or more requests are sent trying to get the density perfect version of image if this version of image doesn't exist on the server.
			 * 
			 * If bandwidth is the key for the application, set this value to false.
			 */
			iconDensityAware : {type : "boolean", defaultValue : true},

			/**
			 * If set to "true" (default), icons will be displayed, if set to false icons are hidden
			 */
			showIcon : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * The expand and collapse feature is set by default and uses 300 characters on mobile devices and 500 characters on desktops as limits. Based on these values, the text of the FeedListItem is collapsed once text reaches these limits. In this case, only the specified number of characters is displayed. By clicking on the text link More, the entire text can be displayed. The text link Less collapses the text. The application is able to set the value to its needs.
			 */
			maxCharacters : {type : "int", group : "Behavior", defaultValue : null}
		},
		events : {

			/**
			 * Event is fired when name of the sender is pressed.
			 */
			senderPress : {
				parameters : {

					/**
					 * Dom reference of the feed item's sender string to be used for positioning.
					 */
					domRef : {type : "string"}
				}
			}, 

			/**
			 * Event is fired when the icon is pressed.
			 */
			iconPress : {
				parameters : {

					/**
					 * Dom reference of the feed item's icon to be used for positioning.
					 */
					domRef : {type : "string"}
				}
			}
		}
	}});

	///**
	// * This file defines behavior for the control,
	// */

	FeedListItem._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");

	FeedListItem._nMaxCharactersMobile = 300;
	FeedListItem._nMaxCharactersDesktop = 500;

	/**
	 * Default texts are fetched from the sap.m resource bundle
	 */

	FeedListItem._sTextShowMore = FeedListItem._oRb.getText("TEXT_SHOW_MORE");
	FeedListItem._sTextShowLess = FeedListItem._oRb.getText("TEXT_SHOW_LESS");

	/**
	 * Function is called when exiting the control.
	 *
	 * @private
	 */
	FeedListItem.prototype.exit = function(oEvent) {
		// destroy link control if initialized
		if (this._oLinkControl) {
			this._oLinkControl.destroy();
		}
		if (this._oImageControl) {
			this._oImageControl.destroy();
		}
		if (this._oLinkExpandCollapse) {
			this._oLinkExpandCollapse.destroy();
		}

		ListItemBase.prototype.exit.apply(this);
	};

	/**
	 * Overwrite ListItemBase's ontap: Propagate tap event from FeedListItem to ListItemBase only when tap performed
	 * not on active elements of FeedListItem (i.e. image, sender link, expand/collapse link)
	 *
	 * @private
	 */
	FeedListItem.prototype.ontap = function(oEvent) {
		if (oEvent.srcControl) {
			if ((!this.getIconActive() && this._oImageControl && oEvent.srcControl.getId() === this._oImageControl.getId()) || // click on inactive image
					(!this.getSenderActive() && this._oLinkControl && oEvent.srcControl.getId() === this._oLinkControl.getId()) || // click on inactive sender link
					(!this._oImageControl || (oEvent.srcControl.getId() !== this._oImageControl.getId()) &&                        // not image clicked
					(!this._oLinkControl || (oEvent.srcControl.getId() !== this._oLinkControl.getId())) &&                         // not sender link clicked
					(!this._oLinkExpandCollapse || (oEvent.srcControl.getId() !== this._oLinkExpandCollapse.getId())))) {          // not expand/collapse link clicked
				ListItemBase.prototype.ontap.apply(this, [oEvent]);
			}
		}
	};

	/**
	 * Lazy load feed icon image.
	 *
	 * @private
	 */
	FeedListItem.prototype._getImageControl = function() {

		var sIconSrc = this.getIcon() ? this.getIcon() : sap.ui.core.IconPool.getIconURI("person-placeholder"), sImgId = this
				.getId()
				+ '-icon', mProperties = {
			src : sIconSrc,
			alt : this.getSender(),
			densityAware : this.getIconDensityAware(),
			decorative : false,
			useIconTooltip : false
		}, aCssClasses = ['sapMFeedListItemImage'];

		var that = this;
		this._oImageControl = sap.m.ImageHelper.getImageControl(sImgId, this._oImageControl, this, mProperties, aCssClasses);

		if (this.getIconActive()) {
			this._oImageControl.attachPress(function() {
				var sIconDomRef = this.getDomRef();
				that.fireIconPress({
					domRef : sIconDomRef
				});
			});
		}

		return this._oImageControl;
	};

	/**
	 * Returns a link control with sender text firing a 'senderPress' event. Does not take care of the 'senderActive' flag,
	 * though
	 *
	 * @returns link control with current sender text which fires a 'senderPress' event.
	 * @private
	 */
	FeedListItem.prototype._getLinkSender = function(withColon) {
		if (!this._oLinkControl) {
			jQuery.sap.require("sap.m.Link");
			var that = this;
			this._oLinkControl = new sap.m.Link({
				press : function() {
					var sSenderDomRef = this.getDomRef();
					that.fireSenderPress({
						domRef : sSenderDomRef
					});
				}
			});
			// Necessary so this gets garbage collected
			this._oLinkControl.setParent(this, null, true);
		}

		if (withColon) {
			this._oLinkControl.setProperty("text", this.getSender() + FeedListItem._oRb.getText("COLON"), true);
		} else {
			this._oLinkControl.setProperty("text", this.getSender(), true);
		}
		this._oLinkControl.setProperty("enabled", this.getSenderActive(), true);

		return this._oLinkControl;
	};

	/**
	 * Overwrite base method to hook into list item's active handling
	 *
	 * @private
	 */
	FeedListItem.prototype._activeHandlingInheritor = function() {
		var sActiveSrc = this.getActiveIcon();

		if (!!this._oImageControl && !!sActiveSrc) {
			this._oImageControl.setSrc(sActiveSrc);
		}
	};

	/**
	 * Overwrite base method to hook into list item's inactive handling
	 *
	 * @private
	 */
	FeedListItem.prototype._inactiveHandlingInheritor = function() {
		var sSrc = this.getIcon() ? this.getIcon() : sap.ui.core.IconPool.getIconURI("person-placeholder");
		if (!!this._oImageControl) {
			this._oImageControl.setSrc(sSrc);
		}
	};

	/**
	 * The first this._nMaxCollapsedLength characters of the text are shown in the collapsed form, the text string ends up
	 * with a complete word, the text string contains at least one word
	 *
	 * @private
	 */
	FeedListItem.prototype._getCollapsedText = function() {
		var sShortText = this._sFullText.substring(0, this._nMaxCollapsedLength);
		var nLastSpace = sShortText.lastIndexOf(" ");
		if (nLastSpace > 0) {
			this._sShortText = sShortText.substr(0, nLastSpace);
		} else {
			this._sShortText = sShortText;
		}
		return this._sShortText;
	};

	/**
	 * Expands or collapses the text of the FeedListItem expanded state: this._sFullText + ' ' + 'LESS' collapsed state:
	 * this._sShortText + '...' + 'MORE'
	 *
	 * @private
	 */
	FeedListItem.prototype._toggleTextExpanded = function() {
		var $text = this.$("realtext");
		var $threeDots = this.$("threeDots");
		if (this._bTextExpanded) {
			$text.html(jQuery.sap.encodeHTML(this._sShortText).replace(/&#xa;/g, "<br>"));
			$threeDots.text(" ... ");
			this._oLinkExpandCollapse.setText(FeedListItem._sTextShowMore);
			this._bTextExpanded = false;
		} else {
			$text.html(jQuery.sap.encodeHTML(this._sFullText).replace(/&#xa;/g, "<br>"));
			$threeDots.text("  ");
			this._oLinkExpandCollapse.setText(FeedListItem._sTextShowLess);
			this._bTextExpanded = true;
		}
	};

	/**
	 * Gets the link for expanding/collapsing the text
	 *
	 * @private
	 */
	FeedListItem.prototype._getLinkExpandCollapse = function() {
		if (!this._oLinkExpandCollapse) {
			jQuery.sap.require("sap.m.Link");
			this._oLinkExpandCollapse = new sap.m.Link({
				text : FeedListItem._sTextShowMore,
				press : jQuery.proxy(function() {
					this._toggleTextExpanded();
				}, this)
			});
			this._bTextExpanded = false;
			// Necessary so this gets garbage collected and the text of the link changes at clicking on it
			this._oLinkExpandCollapse.setParent(this, null, true);
		}
		return this._oLinkExpandCollapse;
	};

	/**
	 * Checks if the text is expandable: If maxCharacters is empty the default values are used, which are 300 characters (
	 * on mobile devices) and 500 characters ( on tablet and desktop). Otherwise maxCharacters is used as a limit. Based on
	 * this value, the text of the FeedListItem is collapsed once the text reaches this limit.
	 *
	 * @private
	 */
	FeedListItem.prototype._checkTextIsExpandable = function() {
		this._nMaxCollapsedLength = this.getMaxCharacters();
		if (this._nMaxCollapsedLength === 0) {
			if (sap.ui.Device.system.phone) {
				this._nMaxCollapsedLength = FeedListItem._nMaxCharactersMobile;
			} else {
				this._nMaxCollapsedLength = FeedListItem._nMaxCharactersDesktop;
			}
		}
		this._sFullText = this.getText();
		var bTextIsExpandable = false;
		if (this._sFullText.length > this._nMaxCollapsedLength) {
			bTextIsExpandable = true;
		}
		return bTextIsExpandable;
	};

	/**
	 * Redefinition of sap.m.ListItemBase.setType: type = "sap.m.ListType.Navigation" behaves like type = "sap.m.ListType.Active" for a FeedListItem
	 * @public
	 * @param {sap.m.ListType} type	new value for property type
	 * @returns {sap.m.FeedListItem} this allows method chaining
	 */
	sap.m.FeedListItem.prototype.setType = function(type) {
		if (type == sap.m.ListType.Navigation) {
			this.setProperty("type", sap.m.ListType.Active);
		} else {
			this.setProperty("type", type);
		}
		return this;
	};

	/**
	 * Redefinition of sap.m.ListItemBase.setUnread: Unread is not supported for FeedListItem
	 * @public
	 * @param {boolean} new value for property unread is ignored
	 */
	FeedListItem.prototype.setUnread = function(bValue) {
		this.setProperty("unread", false);
		return this;
	};

	return FeedListItem;

}, /* bExport= */ true);
