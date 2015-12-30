/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.MessagePopover.
sap.ui.define(["jquery.sap.global", "./ResponsivePopover", "./Button", "./Toolbar", "./ToolbarSpacer", "./Bar", "./List",
		"./StandardListItem", "./library", "sap/ui/core/Control", "./PlacementType", "sap/ui/core/IconPool",
		"sap/ui/core/HTML", "./Text", "sap/ui/core/Icon", "./SegmentedButton", "./Page", "./NavContainer",
		"./semantic/SemanticPage", "./Popover", "jquery.sap.dom"],
	function (jQuery, ResponsivePopover, Button, Toolbar, ToolbarSpacer, Bar, List,
			  StandardListItem, library, Control, PlacementType, IconPool,
			  HTML, Text, Icon, SegmentedButton, Page, NavContainer, SemanticPage, Popover) {
		"use strict";

		/**
		 * Constructor for a new MessagePopover
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * A MessagePopover is a Popover containing a summarized list with messages.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.28
		 * @alias sap.m.MessagePopover
		 * @ui5-metamodel This control also will be described in the legacy UI5 design-time metamodel
		 */
		var MessagePopover = Control.extend("sap.m.MessagePopover", /** @lends sap.m.MessagePopover.prototype */ {
			metadata: {
				library: "sap.m",
				properties: {
					/**
					 * Callback function for resolving a promise after description has been asynchronously loaded inside this function
					 * @callback sap.m.MessagePopover~asyncDescriptionHandler
					 * @param {object} config A single parameter object
					 * @param {MessagePopoverItem} config.item Reference to respective MessagePopoverItem instance
					 * @param {object} config.promise Object grouping a promise's reject and resolve methods
					 * @param {function} config.promise.resolve Method to resolve promise
					 * @param {function} config.promise.reject Method to reject promise
					 */
					asyncDescriptionHandler: {type: "any", group: "Behavior", defaultValue: null},

					/**
					 * Callback function for resolving a promise after a link has been asynchronously validated inside this function
					 * @callback sap.m.MessagePopover~asyncURLHandler
					 * @param {object} config A single parameter object
					 * @param {string} config.url URL to validate
					 * @param {string|Int} config.id ID of the validation job
					 * @param {object} config.promise Object grouping a promise's reject and resolve methods
					 * @param {function} config.promise.resolve Method to resolve promise
					 * @param {function} config.promise.reject Method to reject promise
					 */
					asyncURLHandler: {type: "any", group: "Behavior", defaultValue: null},

					/**
					 * Determines the position, where the control will appear on the screen. Possible values are: sap.m.VerticalPlacementType.Top, sap.m.VerticalPlacementType.Bottom and sap.m.VerticalPlacementType.Vertical.
					 * The default value is sap.m.VerticalPlacementType.Vertical. Setting this property while the control is open, will not cause any re-rendering and changing of the position. Changes will only be applied with the next interaction.
					 */
					placement: {type: "sap.m.VerticalPlacementType", group: "Behavior", defaultValue: "Vertical"},

					/**
					 * Sets the initial state of the control - expanded or collapsed. By default the control opens as expanded
					 */
					initiallyExpanded: {type: "boolean", group: "Behavior", defaultValue: true}
				},
				defaultAggregation: "items",
				aggregations: {
					/**
					 * A list with message items
					 */
					items: {type: "sap.m.MessagePopoverItem", multiple: true, singularName: "item"}
				},
				events: {
					/**
					 * This event will be fired after the popover is opened
					 */
					afterOpen: {
						parameters: {
							/**
							 * This refers to the control which opens the popover
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * This event will be fired after the popover is closed
					 */
					afterClose: {
						parameters: {
							/**
							 * Refers to the control which opens the popover
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * This event will be fired before the popover is opened
					 */
					beforeOpen: {
						parameters: {
							/**
							 * Refers to the control which opens the popover
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * This event will be fired before the popover is closed
					 */
					beforeClose: {
						parameters: {
							/**
							 * Refers to the control which opens the popover
							 * See sap.ui.core.MessageType enum values for types
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * This event will be fired when description is shown
					 */
					itemSelect: {
						parameters: {
							/**
							 * Refers to the message popover item that is being presented
							 */
							item: {type: "sap.m.MessagePopoverItem"},
							/**
							 * Refers to the type of messages being shown
							 * See sap.ui.core.MessageType values for types
							 */
							messageTypeFilter: {type: "sap.ui.core.MessageType"}

						}
					},

					/**
					 * This event will be fired when one of the lists is shown when (not) filtered  by type
					 */
					listSelect: {
						parameters: {
							/**
							 * This parameter refers to the type of messages being shown.
							 */
							messageTypeFilter: {type: "sap.ui.core.MessageType"}
						}
					}
				}
			}
		});

		var CSS_CLASS = "sapMMsgPopover",
			ICONS = {
				back: IconPool.getIconURI("nav-back"),
				close: IconPool.getIconURI("decline"),
				information: IconPool.getIconURI("message-information"),
				warning: IconPool.getIconURI("message-warning"),
				error: IconPool.getIconURI("message-error"),
				success: IconPool.getIconURI("message-success")
			},
			LIST_TYPES = ["all", "error", "warning", "success", "information"],
			// Property names array
			ASYNC_HANDLER_NAMES = ["asyncDescriptionHandler", "asyncURLHandler"],
			// Private class variable used for static method below that sets default async handlers
			DEFAULT_ASYNC_HANDLERS = {};

		/**
		 * Setter for default description and URL validation callbacks across all instances of MessagePopover
		 * @static
		 * @protected
		 * @param {object} mDefaultHandlers An object setting default callbacks
		 * @param {function} mDefaultHandlers.asyncDescriptionHandler
		 * @param {function} mDefaultHandlers.asyncURLHandler
		 */
		MessagePopover.setDefaultHandlers = function (mDefaultHandlers) {
			ASYNC_HANDLER_NAMES.forEach(function (sFuncName) {
				if (mDefaultHandlers.hasOwnProperty(sFuncName)) {
					DEFAULT_ASYNC_HANDLERS[sFuncName] = mDefaultHandlers[sFuncName];
				}
			});
		};

		/**
		 * Initializes the control
		 *
		 * @override
		 * @private
		 */
		MessagePopover.prototype.init = function () {
			var that = this;
			var oPopupControl;

			this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");

			this._oPopover = new ResponsivePopover(this.getId() + "-messagePopover", {
				showHeader: false,
				contentWidth: "440px",
				placement: this.getPlacement(),
				showCloseButton: false,
				modal: false,
				afterOpen: function (oEvent) {
					that.fireAfterOpen({openBy: oEvent.getParameter("openBy")});
				},
				afterClose: function (oEvent) {
					that._navContainer.backToTop();
					that.fireAfterClose({openBy: oEvent.getParameter("openBy")});
				},
				beforeOpen: function (oEvent) {
					that.fireBeforeOpen({openBy: oEvent.getParameter("openBy")});
				},
				beforeClose: function (oEvent) {
					that.fireBeforeClose({openBy: oEvent.getParameter("openBy")});
				}
			}).addStyleClass(CSS_CLASS);

			this._createNavigationPages();
			this._createLists();

			oPopupControl = this._oPopover.getAggregation("_popup");
			oPopupControl.oPopup.setAutoClose(false);
			oPopupControl.addEventDelegate({
				onBeforeRendering: this.onBeforeRenderingPopover,
				onkeypress: this._onkeypress
			}, this);

			if (sap.ui.Device.system.phone) {
				this._oPopover.setBeginButton(new Button({
					text: this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE"),
					press: this.close.bind(this)
				}));
			}

			// Check for default async handlers and set them appropriately
			ASYNC_HANDLER_NAMES.forEach(function (sFuncName) {
				if (DEFAULT_ASYNC_HANDLERS.hasOwnProperty(sFuncName)) {
					that.setProperty(sFuncName, DEFAULT_ASYNC_HANDLERS[sFuncName]);
				}
			});
		};

		/**
		 * Called when the control is destroyed
		 *
		 * @private
		 */
		MessagePopover.prototype.exit = function () {
			this._oResourceBundle = null;
			this._oListHeader = null;
			this._oDetailsHeader = null;
			this._oSegmentedButton = null;
			this._oBackButton = null;
			this._navContainer = null;
			this._listPage = null;
			this._detailsPage = null;
			this._sCurrentList = null;

			if (this._oLists) {
				this._destroyLists();
			}

			// Destroys ResponsivePopover control that is used by MessagePopover
			// This will walk through all aggregations in the Popover and destroy them (in our case this is NavContainer)
			// Next this will walk through all aggregations in the NavContainer, etc.
			if (this._oPopover) {
				this._oPopover.destroy();
				this._oPopover = null;
			}
		};

		/**
		 * Required adaptations before rendering MessagePopover
		 *
		 * @private
		 */
		MessagePopover.prototype.onBeforeRenderingPopover = function () {
			// Update lists only if 'items' aggregation is changed
			if (this._bItemsChanged) {
				this._clearLists();
				this._fillLists(this.getItems());
				this._clearSegmentedButton();
				this._fillSegmentedButton();
				this._bItemsChanged = false;
			}

			this._setInitialFocus();
		};

		/**
		 * Handles keyup event
		 *
		 * @param {jQuery.Event} oEvent - keyup event object
		 * @private
		 */
		MessagePopover.prototype._onkeypress = function (oEvent) {
			if (oEvent.shiftKey && oEvent.keyCode == jQuery.sap.KeyCodes.ENTER) {
				this._fnHandleBackPress();
			}
		};

		/**
		 * Returns header of the MessagePopover's ListPage
		 *
		 * @returns {sap.m.Toolbar} ListPage header
		 * @private
		 */
		MessagePopover.prototype._getListHeader = function () {
			return this._oListHeader || this._createListHeader();
		};

		/**
		 * Returns header of the MessagePopover's ListPage
		 *
		 * @returns {sap.m.Toolbar} DetailsPage header
		 * @private
		 */
		MessagePopover.prototype._getDetailsHeader = function () {
			return this._oDetailsHeader || this._createDetailsHeader();
		};

		/**
		 * Creates header of MessagePopover's ListPage
		 *
		 * @returns {sap.m.Toolbar} ListPage header
		 * @private
		 */
		MessagePopover.prototype._createListHeader = function () {
			var sCloseBtnDescr = this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE");
			var sCloseBtnDescrId = this.getId() + "-CloseBtnDescr";
			var oCloseBtnARIAHiddenDescr = new HTML(sCloseBtnDescrId, {
				content: "<span id=\"" + sCloseBtnDescrId + "\" style=\"display: none;\">" + sCloseBtnDescr + "</span>"
			});

			var sHeadingDescr = this._oResourceBundle.getText("MESSAGEPOPOVER_ARIA_HEADING");
			var sHeadingDescrId = this.getId() + "-HeadingDescr";
			var oHeadingARIAHiddenDescr = new HTML(sHeadingDescrId, {
				content: "<span id=\"" + sHeadingDescrId + "\" style=\"display: none;\" role=\"heading\">" + sHeadingDescr + "</span>"
			});

			this._oPopover.addAssociation("ariaDescribedBy", sHeadingDescrId, true);

			var oCloseBtn = new Button({
				icon: ICONS["close"],
				visible: !sap.ui.Device.system.phone,
				ariaLabelledBy: oCloseBtnARIAHiddenDescr,
				tooltip: sCloseBtnDescr,
				press: this.close.bind(this)
			}).addStyleClass(CSS_CLASS + "CloseBtn");

			this._oSegmentedButton = new SegmentedButton(this.getId() + "-segmented", {});

			this._oListHeader = new Toolbar({
				content: [this._oSegmentedButton, new ToolbarSpacer(), oCloseBtn, oCloseBtnARIAHiddenDescr, oHeadingARIAHiddenDescr]
			});

			return this._oListHeader;
		};

		/**
		 * Creates header of MessagePopover's ListPage
		 *
		 * @returns {sap.m.Toolbar} DetailsPage header
		 * @private
		 */
		MessagePopover.prototype._createDetailsHeader = function () {
			var sCloseBtnDescr = this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE");
			var sCloseBtnDescrId = this.getId() + "-CloseBtnDetDescr";
			var oCloseBtnARIAHiddenDescr = new HTML(sCloseBtnDescrId, {
				content: "<span id=\"" + sCloseBtnDescrId + "\" style=\"display: none;\">" + sCloseBtnDescr + "</span>"
			});

			var sBackBtnDescr = this._oResourceBundle.getText("MESSAGEPOPOVER_ARIA_BACK_BUTTON");
			var sBackBtnDescrId = this.getId() + "-BackBtnDetDescr";
			var oBackBtnARIAHiddenDescr = new HTML(sBackBtnDescrId, {
				content: "<span id=\"" + sBackBtnDescrId + "\" style=\"display: none;\">" + sBackBtnDescr + "</span>"
			});

			var oCloseBtn = new Button({
				icon: ICONS["close"],
				visible: !sap.ui.Device.system.phone,
				ariaLabelledBy: oCloseBtnARIAHiddenDescr,
				tooltip: sCloseBtnDescr,
				press: this.close.bind(this)
			}).addStyleClass(CSS_CLASS + "CloseBtn");

			this._oBackButton = new Button({
				icon: ICONS["back"],
				press: this._fnHandleBackPress.bind(this),
				ariaLabelledBy: oBackBtnARIAHiddenDescr,
				tooltip: sBackBtnDescr
			});

			this._oDetailsHeader = new Toolbar({
				content: [this._oBackButton, new ToolbarSpacer(), oCloseBtn, oCloseBtnARIAHiddenDescr, oBackBtnARIAHiddenDescr]
			});

			return this._oDetailsHeader;
		};

		/**
		 * Creates navigation pages
		 *
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @private
		 */
		MessagePopover.prototype._createNavigationPages = function () {
			// Create two main pages
			this._listPage = new Page(this.getId() + "listPage", {
				customHeader: this._getListHeader()
			});

			this._detailsPage = new Page(this.getId() + "-detailsPage", {
				customHeader: this._getDetailsHeader()
			});

			// TODO: check if this is the best location for this
			// Disable clicks on disabled and/or pending links
			this._detailsPage.addEventDelegate({
				onclick: function(oEvent) {
					var target = oEvent.target;
					if (target.nodeName.toUpperCase() === 'A' &&
						(target.className.indexOf('sapMMsgPopoverItemDisabledLink') !== -1 ||
						target.className.indexOf('sapMMsgPopoverItemPendingLink') !== -1)) {

						oEvent.preventDefault();
					}
				}
			});

			// Initialize nav container with two main pages
			this._navContainer = new NavContainer(this.getId() + "-navContainer", {
				initialPage: this.getId() + "listPage",
				pages: [this._listPage, this._detailsPage],
				navigate: this._navigate.bind(this),
				afterNavigate: this._afterNavigate.bind(this)
			});

			// Assign nav container to content of _oPopover
			this._oPopover.addContent(this._navContainer);

			return this;
		};

		/**
		 * Creates Lists of the MessagePopover
		 *
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @private
		 */
		MessagePopover.prototype._createLists = function () {
			this._oLists = {};

			LIST_TYPES.forEach(function (sListName) {
				this._oLists[sListName] = new List({
					itemPress: this._fnHandleItemPress.bind(this),
					visible: false
				});

				// no re-rendering
				this._listPage.addAggregation("content", this._oLists[sListName], true);
			}, this);

			return this;
		};

		/**
		 * Destroy items in the MessagePopover's Lists
		 *
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @private
		 */
		MessagePopover.prototype._clearLists = function () {
			LIST_TYPES.forEach(function (sListName) {
				if (this._oLists[sListName]) {
					this._oLists[sListName].destroyAggregation("items", true);
				}
			}, this);

			return this;
		};

		/**
		 * Destroys internal Lists of the MessagePopover
		 *
		 * @private
		 */
		MessagePopover.prototype._destroyLists = function () {
			LIST_TYPES.forEach(function (sListName) {
				this._oLists[sListName] = null;
			}, this);

			this._oLists = null;
		};

		/**
		 * Fill the list with items
		 *
		 * @param {array} aItems An array with items type of sap.ui.core.Item.
		 * @private
		 */
		MessagePopover.prototype._fillLists = function (aItems) {
			aItems.forEach(function (oMessagePopoverItem) {
				var oListItem = this._mapItemToListItem(oMessagePopoverItem),
					oCloneListItem = this._mapItemToListItem(oMessagePopoverItem);

				// add the mapped item to the List
				this._oLists["all"].addAggregation("items", oListItem, true);
				this._oLists[oMessagePopoverItem.getType().toLowerCase()].addAggregation("items", oCloneListItem, true);
			}, this);
		};

		/**
		 * Map a MessagePopoverItem to StandardListItem
		 *
		 * @param {sap.m.MessagePopoverItem} oMessagePopoverItem Base information to generate the list items
		 * @returns {sap.m.StandardListItem | null} oListItem List item which will be displayed
		 * @private
		 */
		MessagePopover.prototype._mapItemToListItem = function (oMessagePopoverItem) {
			if (!oMessagePopoverItem) {
				return null;
			}

			var sType = oMessagePopoverItem.getType(),
				oListItem = new StandardListItem({
					title: oMessagePopoverItem.getTitle(),
					icon: this._mapIcon(sType),
					type: sap.m.ListType.Navigation
				}).addStyleClass(CSS_CLASS + "Item").addStyleClass(CSS_CLASS + "Item" + sType);

			oListItem._oMessagePopoverItem = oMessagePopoverItem;

			return oListItem;
		};

		/**
		 * Map an MessageType to the Icon URL.
		 *
		 * @param {sap.ui.core.ValueState} sIcon Type of Error
		 * @returns {string | null} Icon string
		 * @private
		 */
		MessagePopover.prototype._mapIcon = function (sIcon) {
			if (!sIcon) {
				return null;
			}

			return ICONS[sIcon.toLowerCase()];
		};

		/**
		 * Destroy the buttons in the SegmentedButton
		 *
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @private
		 */
		MessagePopover.prototype._clearSegmentedButton = function () {
			if (this._oSegmentedButton) {
				this._oSegmentedButton.destroyAggregation("buttons", true);
			}

			return this;
		};

		/**
		 * Fill SegmentedButton with needed Buttons for filtering
		 *
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @private
		 */
		MessagePopover.prototype._fillSegmentedButton = function () {
			var that = this;
			var pressClosure = function (sListName) {
				return function () {
					that._fnFilterList(sListName);
				};
			};

			LIST_TYPES.forEach(function (sListName) {
				var oList = this._oLists[sListName],
					iCount = oList.getItems().length,
					oButton;

				if (iCount > 0) {
					oButton =  new Button(this.getId() + "-" + sListName, {
						text: sListName == "all" ? this._oResourceBundle.getText("MESSAGEPOPOVER_ALL") : iCount,
						icon: ICONS[sListName],
						press: pressClosure(sListName)
					}).addStyleClass(CSS_CLASS + "Btn" + sListName.charAt(0).toUpperCase() + sListName.slice(1));

					this._oSegmentedButton.addButton(oButton, true);
				}
			}, this);

			return this;
		};

		/**
		 * Sets icon in details page
		 * @param {sap.m.MessagePopoverItem} oMessagePopoverItem
		 * @param {sap.m.StandardListItem} oListItem
		 * @private
		 */
		MessagePopover.prototype._setIcon = function (oMessagePopoverItem, oListItem) {
			this._previousIconTypeClass = CSS_CLASS + "DescIcon" + oMessagePopoverItem.getType();
			this._oMessageIcon = new Icon({
				src: oListItem.getIcon()
			})
				.addStyleClass(CSS_CLASS + "DescIcon")
				.addStyleClass(this._previousIconTypeClass);

			this._detailsPage.addContent(this._oMessageIcon);
		};

		/**
		 * Sets title part of details page
		 * @param {sap.m.MessagePopoverItem} oMessagePopoverItem
		 * @private
		 */
		MessagePopover.prototype._setTitle = function (oMessagePopoverItem) {
			this._oMessageTitleText = new Text(this.getId() + 'MessageTitleText', {
				text: oMessagePopoverItem.getTitle()
			}).addStyleClass('sapMMsgPopoverTitleText');
			this._detailsPage.addAggregation("content", this._oMessageTitleText);
		};

		/**
		 * Sets description text part of details page
		 * When markup description is used it is sanitized within it's container's setter method (MessagePopoverItem)
		 * @param {sap.m.MessagePopoverItem} oMessagePopoverItem
		 * @private
		 */
		MessagePopover.prototype._setDescription = function (oMessagePopoverItem) {
			if (oMessagePopoverItem.getMarkupDescription()) {
				// description is sanitized in MessagePopoverItem.setDescription()
				this._oMessageDescriptionText = new HTML(this.getId() + 'MarkupDescription', {
					content: "<div class='markupDescription'>" + oMessagePopoverItem.getDescription() + "</div>"
				});
			} else {
				this._oMessageDescriptionText = new Text(this.getId() + 'MessageDescriptionText', {
					text: oMessagePopoverItem.getDescription()
				}).addStyleClass('sapMMsgPopoverDescriptionText');
			}

			this._detailsPage.addContent(this._oMessageDescriptionText);
		};

		MessagePopover.prototype._iNextValidationTaskId = 0;

		MessagePopover.prototype._validateURL = function (sUrl) {
			if (jQuery.sap.validateUrl(sUrl)) {
				return sUrl;
			}

			jQuery.sap.log.warning("You have entered invalid URL");

			return '';
		};

		MessagePopover.prototype._queueValidation = function (href) {
			var fnAsyncURLHandler = this.getAsyncURLHandler();
			var iValidationTaskId = ++this._iNextValidationTaskId;
			var oPromiseArgument = {};

			var oPromise = new window.Promise(function(resolve, reject) {

				oPromiseArgument.resolve = resolve;
				oPromiseArgument.reject = reject;

				var config = {
					url: href,
					id: iValidationTaskId,
					promise: oPromiseArgument
				};

				fnAsyncURLHandler(config);
			});

			oPromise.id = iValidationTaskId;

			return oPromise;
		};

		MessagePopover.prototype._getTagPolicy = function () {
			var that = this,
				i;

			/*global html*/
			var defaultTagPolicy = html.makeTagPolicy(this._validateURL());

			return function customTagPolicy(tagName, attrs) {
				var href,
					validateLink = false;

				if (tagName.toUpperCase() === "A") {

					for (i = 0; i < attrs.length;) {
						// if there is href the link should be validated, href's value is on position(i+1)
						if (attrs[i] === "href") {
							validateLink = true;
							href = attrs[i + 1];
							attrs.splice(0, 2);
							continue;
						}

						i += 2;
					}

				}

				// let the default sanitizer do its work
				// it won't see the href attribute
				attrs = defaultTagPolicy(tagName, attrs);

				// if we detected a link before, we modify the <A> tag
				// and keep the link in a dataset attribute
				if (validateLink && typeof that.getAsyncURLHandler() === "function") {

					attrs = attrs || [];

					var done = false;
					// first check if there is a class attribute and enrich it with 'sapMMsgPopoverItemDisabledLink'
					for (i = 0; i < attrs.length; i += 2) {
						if (attrs[i] === "class") {
							attrs[i + 1] += "sapMMsgPopoverItemDisabledLink sapMMsgPopoverItemPendingLink";
							done = true;
							break;
						}
					}

					// check for existing id
					var indexOfId = attrs.indexOf("id");
					if (indexOfId > -1) {
						// we start backwards
						attrs.splice(indexOfId + 1, 1);
						attrs.splice(indexOfId, 1);
					}

					// if no class attribute was found, add one
					if (!done) {
						attrs.unshift("sapMMsgPopoverItemDisabledLink sapMMsgPopoverItemPendingLink");
						attrs.unshift("class");
					}

					var oValidation = that._queueValidation(href);

					// add other attributes
					attrs.push("href");
					// the link is deactivated via class names later read by event delegate on the description page
					attrs.push(href);

					// let the page open in another window, so state is preserved
					attrs.push("target");
					attrs.push("_blank");

					// use id here as data attributes are not passing through caja
					attrs.push("id");
					attrs.push("sap-ui-" + that.getId() + "-link-under-validation-" + oValidation.id);

					oValidation
						.then(function (result) {
							// Update link in output
							var $link = jQuery.sap.byId("sap-ui-" + that.getId() + "-link-under-validation-" + result.id);

							if (result.allowed) {
								jQuery.sap.log.info("Allow link " + href);
							} else {
								jQuery.sap.log.info("Disallow link " + href);
							}

							// Adapt the link style
							$link.removeClass('sapMMsgPopoverItemPendingLink');
							$link.toggleClass('sapMMsgPopoverItemDisabledLink', !result.allowed);
						})
						.catch(function () {
							jQuery.sap.log.warning("Async URL validation could not be performed.");
						});
				}

				return attrs;
			};
		};

		/**
		 * Perform description sanitization based on Caja HTML sanitizer
		 * @param {sap.m.MessagePopoverItem} oMessagePopoverItem
		 * @private
		 */
		MessagePopover.prototype._sanitizeDescription = function (oMessagePopoverItem) {
			jQuery.sap.require("jquery.sap.encoder");
			jQuery.sap.require("sap.ui.thirdparty.caja-html-sanitizer");

			var tagPolicy = this._getTagPolicy();
			/*global html*/
			var sanitized = html.sanitizeWithPolicy(oMessagePopoverItem.getDescription(), tagPolicy);

			oMessagePopoverItem.setDescription(sanitized);
			this._setDescription(oMessagePopoverItem);
		};

		/**
		 * Handles click of the ListItems
		 *
		 * @param {jQuery.Event} oEvent ListItem click event object
		 * @private
		 */
		MessagePopover.prototype._fnHandleItemPress = function (oEvent) {
			var oListItem = oEvent.getParameter("listItem"),
				oMessagePopoverItem = oListItem._oMessagePopoverItem;

			var asyncDescHandler = this.getAsyncDescriptionHandler();

			var loadAndNavigateToDetailsPage = function (suppressNavigate) {
				this._setTitle(oMessagePopoverItem);
				this._sanitizeDescription(oMessagePopoverItem);
				this._setIcon(oMessagePopoverItem, oListItem);

				if (!suppressNavigate) {
					this._navContainer.to(this._detailsPage);
				}
			}.bind(this);

			this._previousIconTypeClass = this._previousIconTypeClass || '';

			this.fireItemSelect({
				item: oMessagePopoverItem,
				messageTypeFilter: this._getCurrentMessageTypeFilter()
			});

			this._detailsPage.destroyContent();

			if (typeof asyncDescHandler === "function" && !!oMessagePopoverItem.getLongtextUrl()) {
				// Set markupDescription to true as markup description should be processed as markup
				oMessagePopoverItem.setMarkupDescription(true);

				var oPromiseArgument = {};

				var oPromise = new window.Promise(function (resolve, reject) {
					oPromiseArgument.resolve = resolve;
					oPromiseArgument.reject = reject;
				});

				var proceed = function () {
					this._detailsPage.setBusy(false);
					loadAndNavigateToDetailsPage(true);
				}.bind(this);

				oPromise
					.then(function () {
						proceed();
					})
					.catch(function () {
						jQuery.sap.log.warning("Async description loading could not be performed.");
						proceed();
					});

				this._navContainer.to(this._detailsPage);

				this._detailsPage.setBusy(true);

				asyncDescHandler({
					promise: oPromiseArgument,
					item: oMessagePopoverItem
				});
			} else {
				loadAndNavigateToDetailsPage();
			}

			this._listPage.$().attr("aria-hidden", "true");
		};

		/**
		 * Handles click of the BackButton
		 *
		 * @private
		 */
		MessagePopover.prototype._fnHandleBackPress = function () {
			this._listPage.$().removeAttr("aria-hidden");
			this._navContainer.back();
		};

		/**
		 * Handles click of the SegmentedButton
		 *
		 * @param {string} sCurrentListName ListName to be shown
		 * @private
		 */
		MessagePopover.prototype._fnFilterList = function (sCurrentListName) {
			LIST_TYPES.forEach(function (sListIterName) {
				if (sListIterName != sCurrentListName && this._oLists[sListIterName].getVisible()) {
					// Hide Lists if they are visible and their name is not the same as current list name
					this._oLists[sListIterName].setVisible(false);
				}
			}, this);

			this._sCurrentList = sCurrentListName;
			this._oLists[sCurrentListName].setVisible(true);

			this._expandMsgPopover();

			this.fireListSelect({messageTypeFilter: this._getCurrentMessageTypeFilter()});
		};

		/**
		 * Returns current selected List name
		 *
		 * @returns {string} Current list name
		 * @private
		 */
		MessagePopover.prototype._getCurrentMessageTypeFilter = function () {
			return this._sCurrentList == "all" ? "" : this._sCurrentList;
		};

		/**
		 * Handles navigate event of the NavContainer
		 *
		 * @private
		 */
		MessagePopover.prototype._navigate = function () {
			if (this._isListPage()) {
				this._oRestoreFocus = jQuery(document.activeElement);
			}
		};

		/**
		 * Handles navigate event of the NavContainer
		 *
		 * @private
		 */
		MessagePopover.prototype._afterNavigate = function () {
			// Just wait for the next tick to apply the focus
			jQuery.sap.delayedCall(0, this, this._restoreFocus);
		};

		/**
		 * Checks whether the current page is ListPage
		 *
		 * @returns {boolean} Whether the current page is ListPage
		 * @private
		 */
		MessagePopover.prototype._isListPage = function () {
			return (this._navContainer.getCurrentPage() == this._listPage);
		};

		/**
		 * Sets initial focus of the control
		 *
		 * @private
		 */
		MessagePopover.prototype._setInitialFocus = function () {
			if (this._isListPage()) {
				// if current page is the list page - set initial focus to the list.
				// otherwise use default functionality built-in the popover
				this._oPopover.setInitialFocus(this._oLists[this._sCurrentList]);
			}
		};

		/**
		 * Restores the focus after navigation
		 *
		 * @private
		 */
		MessagePopover.prototype._restoreFocus = function () {
			if (this._isListPage()) {
				var oRestoreFocus = this._oRestoreFocus && this._oRestoreFocus.control(0);

				if (oRestoreFocus) {
					oRestoreFocus.focus();
				}
			} else {
				this._oBackButton.focus();
			}
		};

		/**
		 * Restores the state defined by the initiallyExpanded property of the MessagePopover
		 * @private
		 */
		MessagePopover.prototype._restoreExpansionDefaults = function () {
			if (sap.ui.Device.system.phone) {
				this._fnFilterList("all");
			} else  if (this.getInitiallyExpanded()) {
				this._expandMsgPopover();
				this._fnFilterList("all");
			} else {
				this._collapseMsgPopover();
				LIST_TYPES.forEach(function (sListName) {
					this._oLists[sListName].setVisible(false);
				}, this);
			}
		};

		/**
		 * Expands the MessagePopover so that the width and height are equal
		 * @private
		 */
		MessagePopover.prototype._expandMsgPopover = function () {
			this._oPopover
				.setContentHeight(this._oPopover.getContentWidth())
				.removeStyleClass(CSS_CLASS + "-init");
		};

		/**
		 * Sets the height of the MessagePopover to auto so that only the header with
		 * the SegmentedButton is visible
		 * @private
		 */
		MessagePopover.prototype._collapseMsgPopover = function () {
			this._oPopover
				.addStyleClass(CSS_CLASS + "-init")
				.setContentHeight("auto");

			this._oSegmentedButton.setSelectedButton("none");
		};

		/**
		 * Opens the MessagePopover
		 *
		 * @param {sap.ui.core.Control} oControl Control which opens the MessagePopover
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @public
		 * @ui5-metamodel
		 */
		MessagePopover.prototype.openBy = function (oControl) {
			var oResponsivePopoverControl = this._oPopover.getAggregation("_popup"),
				oParent = oControl.getParent();

			// If MessagePopover is opened from an instance of sap.m.Toolbar and is instance of sap.m.Popover remove the Arrow
			if (oResponsivePopoverControl instanceof Popover) {
				if ((oParent instanceof Toolbar || oParent instanceof Bar || oParent instanceof SemanticPage)) {
					oResponsivePopoverControl.setShowArrow(false);
				} else {
					oResponsivePopoverControl.setShowArrow(true);
				}
			}

			if (this._oPopover) {
				this._restoreExpansionDefaults();
				this._oPopover.openBy(oControl);
			}

			return this;
		};

		/**
		 * Closes the MessagePopover
		 *
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @public
		 */
		MessagePopover.prototype.close = function () {
			if (this._oPopover) {
				this._oPopover.close();
			}

			return this;
		};

		/**
		 * The method checks if the MessagePopover is open. It returns true when the MessagePopover is currently open
		 * (this includes opening and closing animations), otherwise it returns false
		 *
		 * @public
		 * @returns {boolean} Whether the MessagePopover is open
		 */
		MessagePopover.prototype.isOpen = function () {
			return this._oPopover.isOpen();
		};

		/**
		 * This method toggles between open and closed state of the MessagePopover instance.
		 * oControl parameter is mandatory in the same way as in 'openBy' method
		 *
		 * @param {sap.ui.core.Control} oControl Control which opens the MessagePopover
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 * @public
		 */
		MessagePopover.prototype.toggle = function (oControl) {
			if (this.isOpen()) {
				this.close();
			} else {
				this.openBy(oControl);
			}

			return this;
		};

		/**
		 * The method sets the placement position of the MessagePopover. Only accepted Values are:
		 * sap.m.PlacementType.Top, sap.m.PlacementType.Bottom and sap.m.PlacementType.Vertical
		 *
		 * @param {sap.m.PlacementType} sPlacement Placement type
		 * @returns {sap.m.MessagePopover} Reference to the 'this' for chaining purposes
		 */
		MessagePopover.prototype.setPlacement = function (sPlacement) {
			this.setProperty("placement", sPlacement, true);
			this._oPopover.setPlacement(sPlacement);

			return this;
		};

		MessagePopover.prototype.getDomRef = function (sSuffix) {
			return this._oPopover && this._oPopover.getAggregation("_popup").getDomRef(sSuffix);
		};

		["addStyleClass", "removeStyleClass", "toggleStyleClass", "hasStyleClass", "getBusyIndicatorDelay",
			"setBusyIndicatorDelay", "getVisible", "setVisible", "getBusy", "setBusy"].forEach(function(sName){
				MessagePopover.prototype[sName] = function() {
					if (this._oPopover && this._oPopover[sName]) {
						var oPopover = this._oPopover;
						var res = oPopover[sName].apply(oPopover, arguments);
						return res === oPopover ? this : res;
					}
				};
			});

		// The following inherited methods of this control are extended because this control uses ResponsivePopover for rendering
		["setModel", "bindAggregation", "setAggregation", "insertAggregation", "addAggregation",
			"removeAggregation", "removeAllAggregation", "destroyAggregation"].forEach(function (sFuncName) {
				// First, they are saved for later reference
				MessagePopover.prototype["_" + sFuncName + "Old"] = MessagePopover.prototype[sFuncName];

				// Once they are called
				MessagePopover.prototype[sFuncName] = function () {
					// We immediately call the saved method first
					var result = MessagePopover.prototype["_" + sFuncName + "Old"].apply(this, arguments);

					// Then there is additional logic

					// Mark items aggregation as changed and invalidate popover to trigger rendering
					// See 'MessagePopover.prototype.onBeforeRenderingPopover'
					this._bItemsChanged = true;

					// If Popover dependency has already been instantiated ...
					if (this._oPopover) {
						// ... invalidate it
						this._oPopover.invalidate();
					}

					// If the called method is 'removeAggregation' or 'removeAllAggregation' ...
					if (["removeAggregation", "removeAllAggregation"].indexOf(sFuncName) !== -1) {
						// ... return the result of the operation
						return result;
					}

					return this;
				};
			});

		return MessagePopover;

	}, /* bExport= */ true);
