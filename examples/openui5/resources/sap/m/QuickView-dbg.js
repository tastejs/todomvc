/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.QuickView.
sap.ui.define([
	'jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool',
		'./QuickViewBase', './ResponsivePopover', './NavContainer',
		'./PlacementType', './Page', './Bar', './Button'],
	function(jQuery, library, Control, IconPool,
			QuickViewBase, ResponsivePopover, NavContainer,
			PlacementType, Page, Bar, Button) {
	"use strict";

	/**
	 * Constructor for a new QuickView.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class The QuickView control renders a responsive popover (sap.m.Popover or sap.m.Dialog)
	 * and displays information of an object in a business-card format. It also allows this object to be linked to
	 * another object using one of the links in the responsive popover. Clicking that link updates the information in the
	 * popover with the data of the linked object. Unlimited number of objects can be linked.
	 *
	 * @extends sap.m.QuickViewBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.28.11
	 * @alias sap.m.QuickView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var QuickView = QuickViewBase.extend("sap.m.QuickView", /** @lends sap.m.QuickView.prototype */	{
				metadata: {

					library: "sap.m",
					properties: {
						/**
						 * This property is reused from sap.m.Popover and only takes effect when running on desktop or tablet. Please refer the documentation of the placement property of sap.m.Popover.
						 */
						placement : {
							type : "sap.m.PlacementType",
							group : "Misc",
							defaultValue : PlacementType.Right
						},
						/**
						 * The width of the QuickView. The property takes effect only when running on desktop or tablet.
						 */
						width : {
							type : 'sap.ui.core.CSSSize',
							group : 'Dimension',
							defaultValue : '320px'
						}
					},
					aggregations: {
					},
					events: {
						/**
						 * This event fires after the QuickView is opened.
						 */
						afterOpen: {
							parameters: {
								/**
								 * This parameter refers to the control, which opens the QuickView.
								 */
								openBy: {
									type: "sap.ui.core.Control"
								}
							}
						},

						/**
						 * This event fires after the QuickView is closed.
						 */
						afterClose: {
							parameters: {
								/**
								 * This parameter refers to the control, which opens the QuickView.
								 */
								openBy: {
									type: "sap.ui.core.Control"
								},

								/**
								 * This parameter contains the control,
								 * which triggers the close of the QuickView.
								 * It is undefined when running on desktop or tablet.
								 */
								origin : {
									type : "sap.m.Button"
								}
							}
						},

						/**
						 * This event fires before the QuickView is opened.
						 */
						beforeOpen: {
							parameters: {
								/**
								 * This parameter refers to the control, which opens the QuickView.
								 */
								openBy: {
									type: "sap.ui.core.Control"
								}
							}
						},

						/**
						 * This event fires before the QuickView is closed.
						 */
						beforeClose: {
							parameters: {
								/**
								 * This parameter refers to the control, which opens the QuickView.
								 */
								openBy: {
									type: "sap.ui.core.Control"
								},

								/**
								 * This parameter contains the control,
								 * which triggers the close of the QuickView.
								 * It is undefined when running on desktop or tablet.
								 */
								origin : {
									type : "sap.m.Button"
								}
							}
						}
					}
				}
			});

	/**
	 * Initialize the control.
	 *
	 * @private
	 */
	QuickView.prototype.init = function() {

		var oNavConfig = {
			pages: [new Page()],
			navigate: this._navigate.bind(this),
			afterNavigate: this._afterNavigate.bind(this)
		};

		if (!sap.ui.Device.system.phone) {
			oNavConfig.width = this.getWidth();
		}

		this._oNavContainer = new NavContainer(oNavConfig);

		var that = this;

		this._oPopover = new ResponsivePopover(this.getId() + '-quickView', {
			placement: this.getPlacement(),
			content: [this._oNavContainer],
			showHeader: false,
			showCloseButton : false,
			afterOpen: function (oEvent) {
				that._afterOpen(oEvent);
				that.fireAfterOpen({
					openBy: oEvent.getParameter("openBy")
				});
			},
			afterClose: function (oEvent) {
				that.fireAfterClose({
					openBy: oEvent.getParameter("openBy"),
					origin: that.getCloseButton()
				});
			},
			beforeOpen: function (oEvent) {
				that.fireBeforeOpen({
					openBy: oEvent.getParameter("openBy")
				});
			},
			beforeClose: function (oEvent) {
				that.fireBeforeClose({
					openBy: oEvent.getParameter("openBy"),
					origin: that.getCloseButton()
				});
			}
		});

		this._oPopover.addStyleClass('sapMQuickView');

		var oPopupControl = this._oPopover.getAggregation("_popup");
		oPopupControl.addEventDelegate({
			onBeforeRendering: this.onBeforeRenderingPopover,
			onAfterRendering: this._setLinkWidth,
			onkeydown: this._onPopupKeyDown
		}, this);

		var that = this;
		var fnSetArrowPosition = oPopupControl._fnSetArrowPosition;

		if (fnSetArrowPosition) {
			oPopupControl._fnSetArrowPosition = function () {
				fnSetArrowPosition.apply(oPopupControl, arguments);

				that._adjustContainerHeight();
			};
		}

		this._bItemsChanged = true;

		this._oPopover.addStyleClass("sapMQuickView");
	};

	QuickView.prototype.onBeforeRenderingPopover = function() {

		this._bRendered = true;

		// Update pages only if items aggregation is changed
		if (this._bItemsChanged) {
			this._initPages();

			// add a close button on phone devices when there are no pages
			var aPages = this.getAggregation("pages");
			if (!aPages && sap.ui.Device.system.phone) {
				this._addEmptyPage();
			}

			this._bItemsChanged = false;
		}
	};

	QuickView.prototype.exit = function() {

		this._bRendered = false;
		this._bItemsChanged = true;

		if (this._oPopover) {
			this._oPopover.destroy();
		}
	};

	/**
	 * Creates a new {@link sap.m.Page} that can be inserted in a QuickView.
	 * @param {sap.m.QuickViewPage} oQuickViewPage The object that contains the data to be displayed.
	 * @returns {sap.m.Page} The created page
	 * @private
	 */
	QuickView.prototype._createPage = function(oQuickViewPage) {
		return oQuickViewPage._createPage();
	};

	/**
	 * Keyboard handling function when the down arrow is pressed.
	 * @param {sap.ui.base.Event} oEvent The event object for this event.
	 * @private
	 */
	QuickView.prototype._onPopupKeyDown = function(oEvent) {
		this._processKeyboard(oEvent);
	};

	/**
	 * Helper function to restore the focus to the proper element after the QuickView is opened on phone.
	 * @private
	 */
	QuickView.prototype._afterOpen = function(oEvent) {
		if (sap.ui.Device.system.phone) {
			this._restoreFocus();
		}
	};

	/**
	 * Creates a new empty {@link sap.m.Page} and adds it to the QuickView.
	 * @private
	 */
	QuickView.prototype._addEmptyPage = function() {
		var oPage = new Page({
			customHeader : new Bar()
		});

		var that = this;

		var oCustomHeader = oPage.getCustomHeader();
		oCustomHeader.addContentRight(
			new Button({
				icon : IconPool.getIconURI("decline"),
				press : function() {
					that._oPopover.close();
				}
			})
		);

		oPage.addStyleClass('sapMQuickViewPage');
		this._oNavContainer.addPage(oPage);
	};

	/**
	 * Adjusts the popup height based on the QuickView's content.
	 * @private
	 */
	QuickView.prototype._adjustContainerHeight = function() {
		var oPopupControl = this._oPopover.getAggregation("_popup");
		var $container = oPopupControl.$().find('.sapMPopoverCont');

		if ($container[0] && !$container[0].style.height) {
			$container[0].style.height = $container.height() + 'px';
		}
	};

	/**
	 * Sets the correct length of the links inside the QuickView. This is done to overwrite the styles set by the ResponsiveGridLayout
	 * @private
	 */
	QuickView.prototype._setLinkWidth = function() {
		this._oPopover.$().find(".sapMLnk").css("width", "auto");
	};

	QuickView.prototype.setProperty = function (sPropertyName, oValue, bSuppressInvalidate) {
		switch (sPropertyName) {
			case "busy":
			case "busyIndicatorDelay":
			case "visible":
			case "fieldGroupIds":
				if (this._oPopover) {
					this._oPopover.setProperty(sPropertyName, oValue, bSuppressInvalidate);
					return sap.ui.core.Control.prototype.setProperty.call(this, sPropertyName, oValue, true);
				}
				break;
			default:
				break;
		}

		return sap.ui.core.Control.prototype.setProperty.apply(this, arguments);
	};

	/**
	 * Returns the button, which closes the QuickView.
	 * On desktop or tablet, this method returns undefined.
	 * @returns {sap.ui.core.Control} The close button of the QuickView on phone or undefined on desktop and tablet.
	 * @private
	 */
	QuickView.prototype.getCloseButton = function() {
		if (!sap.ui.Device.system.phone) {
			return undefined;
		}

		var oPage = this._oNavContainer.getCurrentPage();
		var oButton = oPage.getCustomHeader().getContentRight()[0];

		return oButton;
	};

	/**
	 * The method sets placement position of the QuickView.
	 *
	 * @param {sap.m.PlacementType} sPlacement The side from which the QuickView appears relative to the control that opens it.
	 * @returns {sap.m.QuickView} Pointer to the control instance for chaining.
	 * @public
	 */
	QuickView.prototype.setPlacement = function (sPlacement) {
		this.setProperty("placement", sPlacement, true); // no re-rendering
		this._oPopover.setPlacement(sPlacement);

		return this;
	};

	/**
	 * The method sets the width of the QuickView.
	 * Works only on desktop or tablet.
	 * @param {sap.ui.core.CSSSize} sWidth The new width of the QuickView.
	 * @returns {sap.m.QuickView} Pointer to the control instance for chaining
	 * @public
	 */
	QuickView.prototype.setWidth = function (sWidth) {
		if (this._oNavContainer) {
			this._oNavContainer.setWidth(sWidth);
			this.setProperty('width', sWidth, true);
		}

		return this;
	};

	/**
	 * Opens the QuickView.
	 * @param {sap.ui.core.Control} oControl The control which opens the QuickView.
	 * @returns {sap.m.QuickView} Pointer to the control instance for chaining
	 * @public
	 */
	QuickView.prototype.openBy = function(oControl) {
		this._oPopover.openBy(oControl);

		return this;
	};

	["addStyleClass", "removeStyleClass", "toggleStyleClass", "hasStyleClass"].forEach(function(sName){
		QuickView.prototype[sName] = function() {
			if (this._oPopover && this._oPopover[sName]) {
				var res = this._oPopover[sName].apply(this._oPopover, arguments);
				return res === this._oPopover ? this : res;
			}
		};
	});

	["setModel", "bindAggregation", "setAggregation", "insertAggregation", "addAggregation",
		"removeAggregation", "removeAllAggregation", "destroyAggregation"].forEach(function (sFuncName) {
			QuickView.prototype["_" + sFuncName + "Old"] = QuickView.prototype[sFuncName];
			QuickView.prototype[sFuncName] = function () {
				var result = QuickView.prototype["_" + sFuncName + "Old"].apply(this, arguments);

				// Marks items aggregation as changed and invalidate popover to trigger rendering
				this._bItemsChanged = true;

				if (this._oPopover) {
					if (arguments[0] != "pages") {
						this._oPopover[sFuncName].apply(this._oPopover, arguments);
					}

					if (this._bRendered) {
						this._oPopover.invalidate();
					}
				}

				if (["removeAggregation", "removeAllAggregation"].indexOf(sFuncName) !== -1) {
					return result;
				}

				return this;
			};
		});

	return QuickView;

}, /* bExport= */true);
